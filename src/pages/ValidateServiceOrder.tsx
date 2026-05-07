import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Loader2, ShieldCheck, ShieldAlert, Download, FileSignature,
  CheckCircle2, MapPin, AlertTriangle, History,
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import delta7Logo from '@/assets/delta7-logo.png';
import { downloadServiceOrderPdf, type SOEvidence } from '@/utils/serviceOrderPdf';

const formatDateTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString('pt-BR') : '—';

const ROLE_LABEL: Record<string, string> = {
  responsavel: 'Responsável no local',
  gestor: 'Gestor / Solicitante',
};

const VISIT_LABEL: Record<string, string> = {
  obra: 'Visita em obra / vistoria',
  atendimento: 'Atendimento técnico no local',
  reuniao: 'Reunião com gestor / cliente',
  outro: 'Outro',
};

const ValidateServiceOrder = () => {
  const { hash } = useParams<{ hash: string }>();
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const { data: os, isLoading, error } = useQuery({
    queryKey: ['validate-os', hash],
    queryFn: async () => {
      if (!hash) throw new Error('Hash não informada');
      const cleanHash = hash.trim().toLowerCase().replace(/[^a-f0-9]/g, '');
      if (cleanHash.length < 16) throw new Error('Hash inválida ou muito curta. Verifique o link recebido.');

      const { data: rows, error } = await (supabase as any).rpc('get_service_order_by_hash', { p_hash: cleanHash });
      if (error) throw error;
      if (!rows || rows.length === 0) throw new Error('Nenhuma ordem de serviço encontrada para esta hash de validação.');
      if (rows.length > 1) throw new Error('Hash parcial corresponde a múltiplas OS. Use o link completo.');
      const data = rows[0];
      return data;
    },
    enabled: !!hash,
    retry: false,
  });

  const { data: signLinks = [] } = useQuery({
    queryKey: ['validate-os-links', os?.id],
    queryFn: async () => {
      if (!os?.id) return [];
      const { data } = await supabase
        .from('service_order_signature_links')
        .select('*')
        .eq('service_order_id', os.id)
        .order('created_at', { ascending: false });
      return data || [];
    },
    enabled: !!os?.id,
  });

  const handleDownload = async () => {
    if (!os) return;
    setDownloading(true);
    try {
      const evs: SOEvidence[] = [];
      for (const ev of (os.evidences as any[] || [])) {
        if (ev.kind && ev.kind !== 'image') {
          evs.push({ dataUrl: '', caption: ev.caption || '', external: true, externalUrl: ev.externalUrl, kind: ev.kind, fileName: ev.fileName });
          continue;
        }
        const { data } = await supabase.storage.from('service-order-photos').download(ev.path);
        if (data) {
          const dataUrl = await new Promise<string>((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result as string);
            r.onerror = rej;
            r.readAsDataURL(data);
          });
          evs.push({ dataUrl, caption: ev.caption || '' });
        }
      }
      await downloadServiceOrderPdf({
        osNumber: os.os_number,
        generatedAt: os.generated_at,
        technicianName: os.technician_name,
        clientName: os.client_name,
        clientContact: os.client_contact || '',
        clientAddress: os.client_address,
        visitType: os.visit_type,
        requestedBy: os.requested_by || '',
        requestedByRole: os.requested_by_role || '',
        scheduledAt: os.scheduled_at || '',
        startedAt: os.started_at || '',
        finishedAt: os.finished_at || '',
        checkin: { lat: os.checkin_lat, lng: os.checkin_lng, accuracy: os.checkin_accuracy, at: os.checkin_at },
        checkout: { lat: os.checkout_lat, lng: os.checkout_lng, accuracy: os.checkout_accuracy, at: os.checkout_at },
        summary: os.summary || '',
        checklist: (os.checklist as any) || [],
        materials: (os.materials as any) || [],
        travel: (os.travel as any) || {},
        evidences: evs,
        signerName: os.signer_name || '',
        signerRole: os.signer_role || '',
        signerDocument: os.signer_document || '',
        signatureData: os.signature_data || '',
        signedAt: os.signed_at || '',
        integrityHash: os.integrity_hash || '',
        auditLog: (os.audit_log as any) || [],
      });
      toast({ title: 'Download iniciado', description: 'PDF original regerado com sucesso.' });
    } catch (e: any) {
      toast({ title: 'Erro ao gerar PDF', description: e.message, variant: 'destructive' });
    } finally {
      setDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
      </div>
    );
  }

  if (error || !os) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="max-w-md border-red-200">
          <CardContent className="p-8 text-center space-y-3">
            <ShieldAlert className="w-14 h-14 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold text-red-900">Documento não validado</h2>
            <p className="text-gray-600 text-sm">
              {(error as any)?.message || 'Nenhuma OS encontrada com esta assinatura digital.'}
            </p>
            <p className="text-xs text-gray-500 mt-4">
              Hash informada: <code className="break-all">{hash}</code>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const auditLog: any[] = Array.isArray(os.audit_log) ? (os.audit_log as any[]) : [];
  const wasEdited = auditLog.some((e) => e.event === 'edited_after_emission');
  const wasReopened = auditLog.some((e) => e.event === 'reopened');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
          <img src={delta7Logo} alt="Delta7" className="h-10" />
          <div className="text-right">
            <p className="text-xs text-gray-500">Validação de documento</p>
            <p className="text-sm font-semibold text-blue-900">Autenticidade Delta7</p>
          </div>
        </div>

        <Card className={wasEdited ? 'border-amber-300 bg-amber-50' : 'border-green-300 bg-green-50'}>
          <CardContent className="p-6 text-center space-y-2">
            {wasEdited ? <AlertTriangle className="w-14 h-14 text-amber-600 mx-auto" /> : <ShieldCheck className="w-14 h-14 text-green-600 mx-auto" />}
            <h1 className={`text-2xl font-bold ${wasEdited ? 'text-amber-900' : 'text-green-900'}`}>
              {wasEdited ? 'Documento editado após emissão' : 'Documento autêntico'}
            </h1>
            <p className={`text-sm ${wasEdited ? 'text-amber-800' : 'text-green-800'}`}>
              {wasEdited
                ? 'Esta OS foi modificada após a emissão original. Verifique o histórico abaixo antes de aceitar como válido.'
                : 'Esta ordem de serviço foi emitida pela plataforma Delta7 e sua integridade está garantida pela hash de segurança abaixo.'}
            </p>
            {os.locked && !wasEdited && (
              <p className="text-xs text-green-700">🔒 Documento travado contra alterações</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
              <FileSignature className="w-5 h-5" /> Ordem de Serviço {os.os_number}
            </h2>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-gray-500 uppercase">Cliente</dt>
                <dd className="font-medium">{os.client_name}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase">Endereço</dt>
                <dd className="font-medium">{os.client_address}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase">Tipo de visita</dt>
                <dd className="font-medium">{VISIT_LABEL[os.visit_type] || os.visit_type}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase">Técnico responsável</dt>
                <dd className="font-medium">{os.technician_name}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase">Emitido em</dt>
                <dd className="font-medium">{formatDateTime(os.generated_at)}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase">Status</dt>
                <dd className="font-medium">{os.is_draft ? 'RASCUNHO' : 'EMITIDA'}</dd>
              </div>
            </dl>

            {os.summary && (
              <div className="bg-gray-50 border-l-4 border-blue-900 p-3 text-sm text-gray-700 whitespace-pre-wrap">
                {os.summary}
              </div>
            )}

            {os.checkin_at && (
              <div className="text-xs text-gray-600 flex items-center gap-2 border-t pt-3">
                <MapPin className="w-4 h-4 text-blue-900" />
                <span>
                  Check-in {formatDateTime(os.checkin_at)} ·
                  {os.checkin_lat && (
                    <a className="text-blue-900 underline ml-1" target="_blank" rel="noopener noreferrer"
                      href={`https://www.google.com/maps?q=${os.checkin_lat},${os.checkin_lng}`}>
                      Ver no mapa
                    </a>
                  )}
                </span>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-xs font-semibold text-blue-900 mb-1">Hash SHA-256 de integridade</p>
              <code className="text-xs break-all text-blue-900 block font-mono">{os.integrity_hash}</code>
            </div>

            <Button onClick={handleDownload} disabled={downloading} className="w-full bg-blue-900 hover:bg-blue-800">
              {downloading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gerando PDF...</>
              ) : (
                <><Download className="w-4 h-4 mr-2" /> Baixar OS original em PDF</>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-bold text-blue-900">Assinaturas registradas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-gray-700">Aceite presencial {os.signer_name ? `— ${os.signer_name}` : ''}</span>
                {os.signature_data ? (
                  <span className="text-green-700 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Assinado {os.signed_at ? `em ${formatDateTime(os.signed_at)}` : ''}</span>
                ) : (
                  <span className="text-gray-400">Pendente</span>
                )}
              </div>
              {signLinks.map((l: any) => (
                <div key={l.id} className="flex items-center justify-between border-b pb-2">
                  <span className="text-gray-700">
                    {ROLE_LABEL[l.signer_role] || l.signer_role} {l.signer_name ? `— ${l.signer_name}` : ''}
                  </span>
                  {l.signed_at ? (
                    <span className="text-green-700 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> {formatDateTime(l.signed_at)}</span>
                  ) : (
                    <span className="text-gray-400">Pendente</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {(wasEdited || wasReopened) && auditLog.length > 0 && (
          <Card className="border-amber-200">
            <CardContent className="p-6">
              <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-3">
                <History className="w-5 h-5" /> Histórico de alterações
              </h3>
              <ul className="text-xs text-gray-700 space-y-2">
                {auditLog.map((e, i) => (
                  <li key={i} className="border-l-2 border-amber-300 pl-3">
                    <strong>
                      {e.event === 'finalized' && 'OS finalizada'}
                      {e.event === 'reopened' && 'OS reaberta por administrador'}
                      {e.event === 'edited_after_emission' && '⚠️ Conteúdo editado após emissão'}
                    </strong>
                    <div className="text-gray-500">{formatDateTime(e.at)}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-xs text-gray-400">
          Plataforma Delta7 Soluções em Tecnologia · Validação automática por hash SHA-256
        </p>
      </div>
    </div>
  );
};

export default ValidateServiceOrder;
