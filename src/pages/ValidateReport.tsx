import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, ShieldAlert, Download, FileSignature, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import delta7Logo from '@/assets/delta7-logo.png';
import { generateAdvancedReportPdf, type AdvancedReportData } from '@/utils/reportPdfAdvanced';
import { generateReportPdf, type ReportData } from '@/utils/reportPdf';
import { useSEO } from '@/hooks/useSEO';

const formatDateTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString('pt-BR') : '—';

const ValidateReport = () => {
  useSEO({ title: 'Validar laudo técnico | Delta7 Tecnologia', description: 'Valide a autenticidade de um laudo técnico emitido pela Delta7 Tecnologia.', noindex: true });

  const { hash } = useParams<{ hash: string }>();
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['validate-report', hash],
    queryFn: async () => {
      if (!hash) throw new Error('Hash não informada');
      const cleanHash = hash.trim().toLowerCase().replace(/[^a-f0-9]/g, '');
      if (cleanHash.length < 16) {
        throw new Error('Hash inválida ou muito curta. Verifique o link recebido.');
      }

      const { data: rows, error } = await (supabase as any).rpc('get_technical_report_by_hash', { p_hash: cleanHash });
      if (error) throw error;
      if (!rows || rows.length === 0) throw new Error('Nenhum laudo encontrado para esta hash de validação.');
      if (rows.length > 1) throw new Error('Hash parcial corresponde a múltiplos laudos. Use o link completo.');
      const data = rows[0];
      return data;
    },
    enabled: !!hash,
    retry: false,
  });

  const handleDownload = async () => {
    if (!report) return;
    setDownloading(true);
    try {
      const fd: any = report.form_data || {};
      // Heurística: laudos avançados têm campos como "patrimonio", "hardware", "parecer"
      const isAdvanced = !!(fd.patrimonio || fd.hardware || fd.parecer);

      if (isAdvanced) {
        const advData: AdvancedReportData = {
          reportNumber: report.report_number,
          generatedAt: report.generated_at,
          technicianName: report.technician_name,
          patrimonio: fd.patrimonio || '',
          marca: fd.marca || '',
          modelo: fd.modelo || '',
          tipo: fd.tipo || '',
          setor: fd.setor || '',
          unidade: fd.unidade || '',
          usuario: fd.usuario || '',
          contato: fd.contato || '',
          dataAquisicao: fd.dataAquisicao || '',
          garantia: fd.garantia || '',
          finalidades: fd.finalidades || [],
          finalidadeOutro: fd.finalidadeOutro || '',
          hardware: fd.hardware || [],
          software: fd.software || {
            so: { descricao: '', situacao: '', obs: '' },
            office: { descricao: '', situacao: '', obs: '' },
            antivirus: { descricao: '', situacao: '', obs: '' },
            especifico: { descricao: '', situacao: '', obs: '' },
            drivers: { descricao: '', situacao: '', obs: '' },
          },
          problemas: fd.problemas || [],
          estado: fd.estado || { conservacao: '', desempenho: '', seguranca: '', conectividade: '' },
          parecer: fd.parecer || '',
          parecerTexto: fd.parecerTexto || '',
          recomendacoes: fd.recomendacoes || [],
          photos: (report.photos as any) || [],
          observacoesFinais: fd.observacoesFinais || '',
          assinaturaTecnico: fd.signatures?.assinaturaTecnico || fd.assinaturaTecnico || '',
          assinaturaGestor: fd.signatures?.assinaturaGestor || fd.assinaturaGestor || '',
          assinaturaUsuario: fd.signatures?.assinaturaUsuario || fd.assinaturaUsuario || '',
          gestorNome: fd.signatures?.gestorNome || fd.gestorNome || '',
          gestorCargo: fd.signatures?.gestorCargo || fd.gestorCargo || '',
          usuarioNome: fd.signatures?.usuarioNome || fd.usuarioNome || '',
          usuarioMatricula: fd.signatures?.usuarioMatricula || fd.usuarioMatricula || '',
          integrityHash: report.integrity_hash,
        };
        const pdf = await generateAdvancedReportPdf(advData);
        pdf.save(`${report.report_number}.pdf`);
      } else {
        const triagem: any = report.triagem || {};
        const diag: any = report.diagnostico || {};
        const conc: any = report.conclusao || {};
        const data: ReportData = {
          reportNumber: report.report_number,
          technicianName: report.technician_name,
          companyName: report.company_name,
          equipment: report.equipment,
          generatedAt: report.generated_at,
          triagem: {
            estado: triagem.estado || '',
            lacre: triagem.lacre || '',
            acessorios: triagem.acessorios || '',
          },
          diagnostico: {
            testes: diag.testes || '',
            causaRaiz: diag.causaRaiz || '',
            pecas: diag.pecas || '',
          },
          conclusao: {
            recomendacoes: conc.recomendacoes || '',
            statusFinal: report.status_final,
          },
          photos: (report.photos as any) || [],
          integrityHash: report.integrity_hash,
        };
        const pdf = await generateReportPdf(data);
        pdf.save(`${report.report_number}.pdf`);
      }
      toast({ title: 'Download iniciado', description: 'O PDF original foi regerado.' });
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

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="max-w-md border-red-200">
          <CardContent className="p-8 text-center space-y-3">
            <ShieldAlert className="w-14 h-14 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold text-red-900">Documento não validado</h2>
            <p className="text-gray-600 text-sm">
              {(error as any)?.message || 'Nenhum laudo encontrado com esta assinatura digital.'}
            </p>
            <p className="text-xs text-gray-500 mt-4">
              Hash informada: <code className="break-all">{hash}</code>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fd: any = report.form_data || {};
  const sigs = fd.signatures || {};
  const history: any[] = Array.isArray(report.signature_history) ? report.signature_history : [];

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

        <Card className="border-green-300 bg-green-50">
          <CardContent className="p-6 text-center space-y-2">
            <ShieldCheck className="w-14 h-14 text-green-600 mx-auto" />
            <h1 className="text-2xl font-bold text-green-900">Documento autêntico</h1>
            <p className="text-sm text-green-800">
              Este laudo foi emitido pela plataforma Delta7 e sua integridade está garantida pela hash de segurança abaixo.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
              <FileSignature className="w-5 h-5" /> Laudo Técnico {report.report_number}
            </h2>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-gray-500 uppercase">Cliente</dt>
                <dd className="font-medium">{report.company_name}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase">Equipamento</dt>
                <dd className="font-medium">{report.equipment}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase">Técnico responsável</dt>
                <dd className="font-medium">{report.technician_name}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase">Emitido em</dt>
                <dd className="font-medium">{formatDateTime(report.generated_at)}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase">Status final</dt>
                <dd className="font-medium">{report.status_final}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500 uppercase">Última atualização</dt>
                <dd className="font-medium">{formatDateTime(report.updated_at)}</dd>
              </div>
            </dl>

            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-xs font-semibold text-blue-900 mb-1">Hash SHA-256 de integridade</p>
              <code className="text-xs break-all text-blue-900 block font-mono">{report.integrity_hash}</code>
            </div>

            <Button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full bg-blue-900 hover:bg-blue-800"
            >
              {downloading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gerando PDF...</>
              ) : (
                <><Download className="w-4 h-4 mr-2" /> Baixar laudo original em PDF</>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-bold text-blue-900">Assinaturas registradas</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-gray-700">Técnico Responsável</span>
                {sigs.assinaturaTecnico ? (
                  <span className="text-green-700 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Assinado</span>
                ) : (
                  <span className="text-gray-400">Pendente</span>
                )}
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-gray-700">Gestor / Supervisor {sigs.gestorNome ? `— ${sigs.gestorNome}` : ''}</span>
                {sigs.assinaturaGestor ? (
                  <span className="text-green-700 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Assinado</span>
                ) : (
                  <span className="text-gray-400">Pendente</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Usuário / Cliente {sigs.usuarioNome ? `— ${sigs.usuarioNome}` : ''}</span>
                {sigs.assinaturaUsuario ? (
                  <span className="text-green-700 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Assinado</span>
                ) : (
                  <span className="text-gray-400">Pendente</span>
                )}
              </div>
            </div>

            {history.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Histórico de versões</p>
                <ul className="text-xs text-gray-600 space-y-1 max-h-40 overflow-y-auto">
                  {history.map((h, i) => (
                    <li key={i} className="border-l-2 border-blue-200 pl-2">
                      <strong>{h.signerName || h.signer_name || '—'}</strong> ({h.signerRole || h.signer_role || '—'}) — {formatDateTime(h.signedAt || h.signed_at)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400">
          Plataforma Delta7 Soluções em Tecnologia · Validação automática por hash SHA-256
        </p>
      </div>
    </div>
  );
};

export default ValidateReport;
