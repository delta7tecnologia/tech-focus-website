import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  MapPin, Save, Loader2, Plus, X, Camera, Trash2, CheckCircle2, FileSignature, Download,
} from 'lucide-react';
import SignaturePad from '@/components/tech/reports/SignaturePad';
import SOSignatureLinksManager from './SOSignatureLinksManager';
import { downloadServiceOrderPdf, type SOEvidence } from '@/utils/serviceOrderPdf';
import { sha256Hex } from '@/utils/reportHash';

interface Props {
  draft?: any;
  onSaved: () => void;
}

interface ChecklistItem { label: string; status: string; obs: string }
interface MaterialItem { item: string; qtd: string; unidade: string; valor: string }

const VISIT_TYPES: Array<{ value: string; label: string }> = [
  { value: 'obra', label: 'Visita em obra / vistoria' },
  { value: 'atendimento', label: 'Atendimento técnico no local' },
  { value: 'reuniao', label: 'Reunião com gestor / cliente' },
  { value: 'outro', label: 'Outro' },
];

const STATUS_OPTIONS = ['OK', 'Pendente', 'N/A', 'Atenção'];

const DEFAULT_CHECKLIST: Record<string, string[]> = {
  obra: ['Pontos de rede mapeados', 'Local do rack definido', 'Alinhamento com provedor', 'Configuração de VLANs', 'Plano de cabeamento'],
  atendimento: ['Equipamento atendido', 'Problema relatado pelo usuário', 'Solução aplicada', 'Teste após reparo'],
  reuniao: ['Pauta apresentada', 'Decisões tomadas', 'Próximos passos'],
  outro: ['Item 1'],
};

const newOSNumber = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `OS-${y}${m}${day}-${rand}`;
};

const ServiceOrderForm: React.FC<Props> = ({ draft, onSaved }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [osNumber] = useState(draft?.os_number || newOSNumber());
  const [savedId, setSavedId] = useState<string | null>(draft?.id || null);
  const [isDraft, setIsDraft] = useState<boolean>(draft?.is_draft ?? true);

  const [clientName, setClientName] = useState(draft?.client_name || '');
  const [clientContact, setClientContact] = useState(draft?.client_contact || '');
  const [clientAddress, setClientAddress] = useState(draft?.client_address || '');
  const [visitType, setVisitType] = useState(draft?.visit_type || 'atendimento');
  const [requestedBy, setRequestedBy] = useState(draft?.requested_by || '');
  const [requestedByRole, setRequestedByRole] = useState(draft?.requested_by_role || '');
  const [scheduledAt, setScheduledAt] = useState(draft?.scheduled_at ? draft.scheduled_at.slice(0, 16) : '');
  const [summary, setSummary] = useState(draft?.summary || '');

  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    Array.isArray(draft?.checklist) && draft.checklist.length > 0
      ? draft.checklist
      : (DEFAULT_CHECKLIST[draft?.visit_type || 'atendimento'] || []).map((label) => ({ label, status: '', obs: '' })),
  );

  const [materials, setMaterials] = useState<MaterialItem[]>(
    Array.isArray(draft?.materials) ? draft.materials : [],
  );

  const [travelKm, setTravelKm] = useState(draft?.travel?.km || '');
  const [travelValorKm, setTravelValorKm] = useState(draft?.travel?.valor_km || '');
  const [travelObs, setTravelObs] = useState(draft?.travel?.observacao || '');

  const [evidences, setEvidences] = useState<Array<{ path: string; caption: string; mime_type?: string }>>(
    Array.isArray(draft?.evidences) ? draft.evidences : [],
  );

  const [checkin, setCheckin] = useState<any>({
    lat: draft?.checkin_lat,
    lng: draft?.checkin_lng,
    accuracy: draft?.checkin_accuracy,
    at: draft?.checkin_at,
  });
  const [checkout, setCheckout] = useState<any>({
    lat: draft?.checkout_lat,
    lng: draft?.checkout_lng,
    accuracy: draft?.checkout_accuracy,
    at: draft?.checkout_at,
  });
  const [startedAt, setStartedAt] = useState<string | null>(draft?.started_at || null);
  const [finishedAt, setFinishedAt] = useState<string | null>(draft?.finished_at || null);

  const [signerName, setSignerName] = useState(draft?.signer_name || '');
  const [signerRole, setSignerRole] = useState(draft?.signer_role || '');
  const [signerDocument, setSignerDocument] = useState(draft?.signer_document || '');
  const [signatureData, setSignatureData] = useState(draft?.signature_data || '');

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Atualiza checklist padrão quando o tipo muda e ainda está vazio
  useEffect(() => {
    if (checklist.length === 0) {
      setChecklist((DEFAULT_CHECKLIST[visitType] || []).map((label) => ({ label, status: '', obs: '' })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitType]);

  const updateChecklist = (i: number, patch: Partial<ChecklistItem>) =>
    setChecklist((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  const addChecklist = () => setChecklist((p) => [...p, { label: '', status: '', obs: '' }]);
  const rmChecklist = (i: number) => setChecklist((p) => p.filter((_, idx) => idx !== i));

  const updateMaterial = (i: number, patch: Partial<MaterialItem>) =>
    setMaterials((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  const addMaterial = () => setMaterials((p) => [...p, { item: '', qtd: '', unidade: '', valor: '' }]);
  const rmMaterial = (i: number) => setMaterials((p) => p.filter((_, idx) => idx !== i));

  const captureGeo = (kind: 'in' | 'out') => {
    if (!('geolocation' in navigator)) {
      toast({ title: 'Geolocalização indisponível', variant: 'destructive' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const data = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          at: new Date().toISOString(),
        };
        if (kind === 'in') {
          setCheckin(data);
          setStartedAt(data.at);
          toast({ title: 'Check-in registrado', description: `±${Math.round(data.accuracy)} m de precisão.` });
        } else {
          setCheckout(data);
          setFinishedAt(data.at);
          toast({ title: 'Check-out registrado', description: `±${Math.round(data.accuracy)} m de precisão.` });
        }
      },
      (err) => toast({ title: 'Não foi possível obter a localização', description: err.message, variant: 'destructive' }),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const handlePhoto = async (file: File, caption: string) => {
    setUploadingPhoto(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${user!.id}/${osNumber}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from('service-order-photos').upload(path, file);
      if (error) throw error;
      setEvidences((p) => [...p, { path, caption, mime_type: file.type }]);
      toast({ title: 'Evidência adicionada' });
    } catch (e: any) {
      toast({ title: 'Erro ao enviar foto', description: e.message, variant: 'destructive' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const removeEvidence = async (idx: number) => {
    const ev = evidences[idx];
    try {
      await supabase.storage.from('service-order-photos').remove([ev.path]);
    } catch {}
    setEvidences((p) => p.filter((_, i) => i !== idx));
  };

  const buildPayload = async (markFinal = false) => {
    const payload: any = {
      os_number: osNumber,
      technician_id: user!.id,
      technician_name: user!.user_metadata?.full_name || user!.email,
      client_name: clientName,
      client_contact: clientContact || null,
      client_address: clientAddress,
      visit_type: visitType,
      requested_by: requestedBy || null,
      requested_by_role: requestedByRole || null,
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      started_at: startedAt,
      finished_at: finishedAt,
      checkin_lat: checkin.lat ?? null,
      checkin_lng: checkin.lng ?? null,
      checkin_accuracy: checkin.accuracy ?? null,
      checkin_at: checkin.at ?? null,
      checkout_lat: checkout.lat ?? null,
      checkout_lng: checkout.lng ?? null,
      checkout_accuracy: checkout.accuracy ?? null,
      checkout_at: checkout.at ?? null,
      summary,
      checklist,
      materials,
      travel: { km: travelKm, valor_km: travelValorKm, observacao: travelObs },
      evidences,
      signer_name: signerName || null,
      signer_role: signerRole || null,
      signer_document: signerDocument || null,
      signature_data: signatureData || null,
      signed_at: signatureData ? new Date().toISOString() : null,
      created_by: user!.id,
      is_draft: markFinal ? false : isDraft,
      status: markFinal ? 'concluido' : (startedAt ? 'em_andamento' : 'rascunho'),
    };
    const integrityBase = JSON.stringify({ ...payload, signature_data: !!payload.signature_data });
    payload.integrity_hash = await sha256Hex(integrityBase);
    return payload;
  };

  const saveMutation = useMutation({
    mutationFn: async (markFinal: boolean) => {
      if (!user) throw new Error('Sem sessão');
      if (!clientName.trim() || !clientAddress.trim()) throw new Error('Cliente e endereço são obrigatórios.');
      const payload = await buildPayload(markFinal);
      if (savedId) {
        const { error } = await supabase.from('service_orders').update(payload).eq('id', savedId);
        if (error) throw error;
        return savedId;
      } else {
        const { data, error } = await supabase.from('service_orders').insert(payload).select('id').single();
        if (error) throw error;
        return data.id as string;
      }
    },
    onSuccess: (id, markFinal) => {
      setSavedId(id);
      if (markFinal) setIsDraft(false);
      qc.invalidateQueries({ queryKey: ['service-orders'] });
      toast({ title: markFinal ? 'OS finalizada com sucesso!' : 'Rascunho salvo' });
    },
    onError: (e: any) => toast({ title: 'Erro ao salvar', description: e.message, variant: 'destructive' }),
  });

  const allowedToFinalize = useMemo(() =>
    !!clientName && !!clientAddress && !!summary && evidences.length > 0,
    [clientName, clientAddress, summary, evidences.length],
  );

  const downloadPdf = async () => {
    const evs: SOEvidence[] = [];
    for (const ev of evidences) {
      const { data } = await supabase.storage.from('service-order-photos').download(ev.path);
      if (data) {
        const dataUrl = await new Promise<string>((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result as string);
          r.onerror = rej;
          r.readAsDataURL(data);
        });
        evs.push({ dataUrl, caption: ev.caption });
      }
    }
    const payload = await buildPayload(false);
    await downloadServiceOrderPdf({
      osNumber,
      generatedAt: new Date().toISOString(),
      technicianName: payload.technician_name,
      clientName,
      clientContact,
      clientAddress,
      visitType,
      requestedBy,
      requestedByRole,
      scheduledAt: payload.scheduled_at,
      startedAt: startedAt || '',
      finishedAt: finishedAt || '',
      checkin,
      checkout,
      summary,
      checklist,
      materials,
      travel: { km: travelKm, valor_km: travelValorKm, observacao: travelObs },
      evidences: evs,
      signerName,
      signerRole,
      signerDocument,
      signatureData,
      signedAt: payload.signed_at || '',
      integrityHash: payload.integrity_hash,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-blue-900">OS {osNumber}</h3>
              <p className="text-xs text-gray-500">
                {isDraft ? 'Rascunho — só será considerado emitido após finalizar.' : 'Documento emitido.'}
              </p>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${isDraft ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
              {isDraft ? 'RASCUNHO' : 'EMITIDA'}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Cliente *</Label>
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} />
            </div>
            <div>
              <Label>Contato</Label>
              <Input value={clientContact} onChange={(e) => setClientContact(e.target.value)} placeholder="Telefone / e-mail" />
            </div>
            <div className="sm:col-span-2">
              <Label>Endereço completo *</Label>
              <Input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="Rua, nº, bairro, cidade" />
            </div>
            <div>
              <Label>Tipo de visita</Label>
              <Select value={visitType} onValueChange={setVisitType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {VISIT_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Agendado para</Label>
              <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
            </div>
            <div>
              <Label>Solicitante</Label>
              <Input value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)} placeholder="Nome de quem solicitou" />
            </div>
            <div>
              <Label>Cargo / Setor do solicitante</Label>
              <Input value={requestedByRole} onChange={(e) => setRequestedByRole(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h4 className="font-semibold text-blue-900 flex items-center gap-2"><MapPin className="w-4 h-4" /> Geolocalização</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border rounded p-3 space-y-2">
              <div className="flex justify-between items-center">
                <strong className="text-sm">Check-in</strong>
                <Button size="sm" variant="outline" onClick={() => captureGeo('in')}>
                  <MapPin className="w-3 h-3 mr-1" /> Capturar
                </Button>
              </div>
              {checkin.at ? (
                <p className="text-xs text-gray-600">
                  {new Date(checkin.at).toLocaleString('pt-BR')}<br />
                  {checkin.lat?.toFixed(6)}, {checkin.lng?.toFixed(6)} (±{Math.round(checkin.accuracy)} m)
                </p>
              ) : <p className="text-xs text-gray-400">Não registrado</p>}
            </div>
            <div className="border rounded p-3 space-y-2">
              <div className="flex justify-between items-center">
                <strong className="text-sm">Check-out</strong>
                <Button size="sm" variant="outline" onClick={() => captureGeo('out')}>
                  <MapPin className="w-3 h-3 mr-1" /> Capturar
                </Button>
              </div>
              {checkout.at ? (
                <p className="text-xs text-gray-600">
                  {new Date(checkout.at).toLocaleString('pt-BR')}<br />
                  {checkout.lat?.toFixed(6)}, {checkout.lng?.toFixed(6)} (±{Math.round(checkout.accuracy)} m)
                </p>
              ) : <p className="text-xs text-gray-400">Não registrado</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h4 className="font-semibold text-blue-900">Resumo do atendimento</h4>
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Descreva o que foi feito, com quem foi tratado, próximas providências..."
            rows={5}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-blue-900">Checklist da visita</h4>
            <Button size="sm" variant="outline" onClick={addChecklist}><Plus className="w-3 h-3 mr-1" /> Item</Button>
          </div>
          {checklist.map((c, i) => (
            <div key={i} className="grid sm:grid-cols-12 gap-2 items-start">
              <Input className="sm:col-span-5" placeholder="Item" value={c.label} onChange={(e) => updateChecklist(i, { label: e.target.value })} />
              <Select value={c.status} onValueChange={(v) => updateChecklist(i, { status: v })}>
                <SelectTrigger className="sm:col-span-2"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>{STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <Input className="sm:col-span-4" placeholder="Observação" value={c.obs} onChange={(e) => updateChecklist(i, { obs: e.target.value })} />
              <Button size="icon" variant="ghost" className="sm:col-span-1 text-red-600" onClick={() => rmChecklist(i)}><X className="w-4 h-4" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-blue-900">Materiais utilizados</h4>
            <Button size="sm" variant="outline" onClick={addMaterial}><Plus className="w-3 h-3 mr-1" /> Material</Button>
          </div>
          {materials.length === 0 ? (
            <p className="text-xs text-gray-400 italic">Nenhum material adicionado.</p>
          ) : materials.map((m, i) => (
            <div key={i} className="grid sm:grid-cols-12 gap-2 items-center">
              <Input className="sm:col-span-5" placeholder="Item / peça" value={m.item} onChange={(e) => updateMaterial(i, { item: e.target.value })} />
              <Input className="sm:col-span-2" placeholder="Qtd" value={m.qtd} onChange={(e) => updateMaterial(i, { qtd: e.target.value })} />
              <Input className="sm:col-span-2" placeholder="Un" value={m.unidade} onChange={(e) => updateMaterial(i, { unidade: e.target.value })} />
              <Input className="sm:col-span-2" placeholder="Valor R$" value={m.valor} onChange={(e) => updateMaterial(i, { valor: e.target.value })} />
              <Button size="icon" variant="ghost" className="sm:col-span-1 text-red-600" onClick={() => rmMaterial(i)}><X className="w-4 h-4" /></Button>
            </div>
          ))}

          <div className="border-t pt-3 mt-3">
            <h5 className="text-sm font-semibold text-gray-700 mb-2">Deslocamento</h5>
            <div className="grid sm:grid-cols-3 gap-2">
              <Input placeholder="KM rodados" value={travelKm} onChange={(e) => setTravelKm(e.target.value)} />
              <Input placeholder="Valor por KM" value={travelValorKm} onChange={(e) => setTravelValorKm(e.target.value)} />
              <Input placeholder="Observação" value={travelObs} onChange={(e) => setTravelObs(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-blue-900 flex items-center gap-2"><Camera className="w-4 h-4" /> Evidências (fotos)</h4>
            <Label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                disabled={uploadingPhoto}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handlePhoto(f, '');
                  e.target.value = '';
                }}
              />
              <span className="inline-flex items-center gap-1 text-xs bg-blue-900 text-white px-3 py-2 rounded">
                {uploadingPhoto ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
                Adicionar foto
              </span>
            </Label>
          </div>
          {evidences.length === 0 ? (
            <p className="text-xs text-gray-400 italic">Adicione pelo menos uma foto para comprovar a presença no local.</p>
          ) : (
            <div className="grid sm:grid-cols-3 gap-3">
              {evidences.map((ev, i) => (
                <EvidenceThumb key={ev.path} path={ev.path} caption={ev.caption} onCaption={(c) => {
                  setEvidences((p) => p.map((x, idx) => idx === i ? { ...x, caption: c } : x));
                }} onRemove={() => removeEvidence(i)} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-3">
          <h4 className="font-semibold text-blue-900 flex items-center gap-2"><FileSignature className="w-4 h-4" /> Aceite presencial</h4>
          <p className="text-xs text-gray-500">Coleta da assinatura de quem recebeu o atendimento (gestor, encarregado, usuário, etc).</p>
          <div className="grid sm:grid-cols-3 gap-3">
            <Input placeholder="Nome completo" value={signerName} onChange={(e) => setSignerName(e.target.value)} />
            <Input placeholder="Cargo / Setor" value={signerRole} onChange={(e) => setSignerRole(e.target.value)} />
            <Input placeholder="CPF / RG (opcional)" value={signerDocument} onChange={(e) => setSignerDocument(e.target.value)} />
          </div>
          <SignaturePad label="Assinatura do responsável no local" value={signatureData} onChange={setSignatureData} />
          {savedId && (
            <SOSignatureLinksManager serviceOrderId={savedId} />
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 justify-end sticky bottom-0 bg-white py-3 border-t">
        <Button variant="outline" onClick={() => saveMutation.mutate(false)} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
          Salvar rascunho
        </Button>
        {savedId && (
          <Button variant="outline" onClick={downloadPdf}>
            <Download className="w-4 h-4 mr-1" /> Baixar PDF
          </Button>
        )}
        <Button
          className="bg-blue-900 hover:bg-blue-800"
          disabled={!allowedToFinalize || saveMutation.isPending}
          onClick={() => saveMutation.mutate(true)}
        >
          <CheckCircle2 className="w-4 h-4 mr-1" />
          {isDraft ? 'Finalizar OS' : 'Atualizar OS'}
        </Button>
        <Button variant="ghost" onClick={onSaved}>Voltar</Button>
      </div>
    </div>
  );
};

const EvidenceThumb: React.FC<{ path: string; caption: string; onCaption: (c: string) => void; onRemove: () => void }> = ({ path, caption, onCaption, onRemove }) => {
  const [url, setUrl] = useState<string>('');
  useEffect(() => {
    let active = true;
    supabase.storage.from('service-order-photos').createSignedUrl(path, 3600).then(({ data }) => {
      if (active && data?.signedUrl) setUrl(data.signedUrl);
    });
    return () => { active = false; };
  }, [path]);
  return (
    <div className="border rounded overflow-hidden bg-gray-50">
      {url ? <img src={url} className="w-full h-32 object-cover" alt="evidência" /> : <div className="w-full h-32 bg-gray-200 animate-pulse" />}
      <div className="p-2 space-y-1">
        <Input className="h-8 text-xs" placeholder="Legenda" value={caption} onChange={(e) => onCaption(e.target.value)} />
        <Button size="sm" variant="ghost" className="text-red-600 w-full h-7" onClick={onRemove}>
          <Trash2 className="w-3 h-3 mr-1" /> Remover
        </Button>
      </div>
    </div>
  );
};

export default ServiceOrderForm;
