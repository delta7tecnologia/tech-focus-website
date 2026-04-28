import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  MapPin, Save, Loader2, Plus, X, Camera, Trash2, CheckCircle2,
  FileSignature, Download, Play, Square, Paperclip, AlertCircle, Lock,
} from 'lucide-react';
import SignaturePad from '@/components/tech/reports/SignaturePad';
import SOSignatureLinksManager from './SOSignatureLinksManager';
import { downloadServiceOrderPdf, type SOEvidence } from '@/utils/serviceOrderPdf';
import { sha256Hex } from '@/utils/reportHash';
import { compressImageIfNeeded } from '@/utils/compressImage';

interface Props {
  draft?: any;
  onSaved: () => void;
}

interface ChecklistItem { label: string; status: string; obs: string }
interface MaterialItem { item: string; qtd: string; unidade: string; valor: string }
interface EvidenceMeta {
  path: string;
  caption: string;
  mime_type?: string;
  kind?: 'image' | 'file' | 'video';
  fileName?: string;
}

const VISIT_TYPES = [
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

const fallbackOSNumber = () => {
  const d = new Date();
  return `OS-${d.getFullYear()}-TMP${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
};

const ServiceOrderForm: React.FC<Props> = ({ draft, onSaved }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [osNumber, setOsNumber] = useState<string>(draft?.os_number || fallbackOSNumber());
  const [savedId, setSavedId] = useState<string | null>(draft?.id || null);
  const [isDraft, setIsDraft] = useState<boolean>(draft?.is_draft ?? true);
  const [isLocked, setIsLocked] = useState<boolean>(draft?.locked ?? false);
  const [tab, setTab] = useState<'identificacao' | 'visita' | 'atendimento' | 'evidencias' | 'assinatura'>('identificacao');

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

  const [evidences, setEvidences] = useState<EvidenceMeta[]>(
    Array.isArray(draft?.evidences) ? draft.evidences : [],
  );

  const [checkin, setCheckin] = useState<any>({
    lat: draft?.checkin_lat, lng: draft?.checkin_lng, accuracy: draft?.checkin_accuracy, at: draft?.checkin_at,
  });
  const [checkout, setCheckout] = useState<any>({
    lat: draft?.checkout_lat, lng: draft?.checkout_lng, accuracy: draft?.checkout_accuracy, at: draft?.checkout_at,
  });
  const [startedAt, setStartedAt] = useState<string | null>(draft?.started_at || null);
  const [finishedAt, setFinishedAt] = useState<string | null>(draft?.finished_at || null);

  const [signerName, setSignerName] = useState(draft?.signer_name || '');
  const [signerRole, setSignerRole] = useState(draft?.signer_role || '');
  const [signerDocument, setSignerDocument] = useState(draft?.signer_document || '');
  const [signatureData, setSignatureData] = useState(draft?.signature_data || '');
  const initialSignedAt = useRef<string | null>(draft?.signed_at || null);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Verifica se há link remoto de assinatura já assinado
  const { data: signedLinks = [] } = useQuery({
    queryKey: ['so-links-status', savedId],
    queryFn: async () => {
      if (!savedId) return [];
      const { data } = await supabase
        .from('service_order_signature_links')
        .select('signed_at')
        .eq('service_order_id', savedId)
        .not('signed_at', 'is', null);
      return data || [];
    },
    enabled: !!savedId,
    refetchInterval: 15000,
  });

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

  const captureGeo = (kind: 'in' | 'out') => new Promise<void>((resolve) => {
    if (!('geolocation' in navigator)) {
      toast({ title: 'Geolocalização indisponível', variant: 'destructive' });
      resolve();
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
          toast({ title: '🟢 Visita iniciada', description: `Check-in registrado (±${Math.round(data.accuracy)} m).` });
        } else {
          setCheckout(data);
          setFinishedAt(data.at);
          toast({ title: '🔴 Visita encerrada', description: `Check-out registrado (±${Math.round(data.accuracy)} m).` });
        }
        resolve();
      },
      (err) => {
        toast({ title: 'Não foi possível obter a localização', description: err.message, variant: 'destructive' });
        resolve();
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  });

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingPhoto(true);
    try {
      for (const original of Array.from(files)) {
        if (original.size > 20 * 1024 * 1024) {
          toast({ title: `${original.name} ignorado`, description: 'Limite de 20 MB por arquivo.', variant: 'destructive' });
          continue;
        }
        const file = await compressImageIfNeeded(original);
        const ext = file.name.split('.').pop() || 'bin';
        const path = `${user!.id}/${osNumber}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from('service-order-photos').upload(path, file, { contentType: file.type });
        if (error) throw error;

        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const kind: EvidenceMeta['kind'] = isImage ? 'image' : isVideo ? 'video' : 'file';
        setEvidences((p) => [...p, { path, caption: '', mime_type: file.type, kind, fileName: original.name }]);
      }
      toast({ title: 'Evidências adicionadas' });
    } catch (e: any) {
      toast({ title: 'Erro ao enviar arquivo', description: e.message, variant: 'destructive' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const removeEvidence = async (idx: number) => {
    const ev = evidences[idx];
    try { await supabase.storage.from('service-order-photos').remove([ev.path]); } catch {}
    setEvidences((p) => p.filter((_, i) => i !== idx));
  };

  const buildPayload = async (markFinal = false) => {
    // signed_at deve ser setado APENAS UMA VEZ, na primeira assinatura
    const signedAtFinal = signatureData
      ? (initialSignedAt.current || new Date().toISOString())
      : null;

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
      signed_at: signedAtFinal,
      created_by: user!.id,
      is_draft: markFinal ? false : isDraft,
      status: markFinal
        ? 'concluido'
        : (!isDraft ? 'concluido' : (startedAt ? 'em_andamento' : 'rascunho')),
    };
    const integrityBase = JSON.stringify({ ...payload, signature_data: !!payload.signature_data });
    payload.integrity_hash = await sha256Hex(integrityBase);
    return payload;
  };

  const saveMutation = useMutation({
    mutationFn: async (markFinal: boolean) => {
      if (!user) throw new Error('Sem sessão');
      if (!clientName.trim() || !clientAddress.trim()) throw new Error('Cliente e endereço são obrigatórios.');

      // Auto check-out ao finalizar se ainda não tiver
      if (markFinal && !checkout.at) {
        try { await captureGeo('out'); } catch {}
      }

      const payload = await buildPayload(markFinal);
      if (savedId) {
        const { error } = await supabase.from('service_orders').update(payload).eq('id', savedId);
        if (error) throw error;
        return savedId;
      } else {
        const { data, error } = await supabase
          .from('service_orders')
          .insert(payload)
          .select('id, os_number, os_seq, locked, signed_at')
          .single();
        if (error) throw error;
        // Se o backend gerou um número sequencial novo, aplica no UI
        if (data?.os_seq && osNumber.includes('TMP')) {
          const newNum = `OS-${new Date().getFullYear()}-${String(data.os_seq).padStart(6, '0')}`;
          setOsNumber(newNum);
          await supabase.from('service_orders').update({ os_number: newNum }).eq('id', data.id);
        }
        if (data?.signed_at) initialSignedAt.current = data.signed_at;
        return data.id as string;
      }
    },
    onSuccess: (id, markFinal) => {
      setSavedId(id);
      if (markFinal) { setIsDraft(false); setIsLocked(true); }
      qc.invalidateQueries({ queryKey: ['service-orders'] });
      if (markFinal !== undefined) {
        toast({ title: markFinal ? 'OS finalizada com sucesso!' : 'Rascunho salvo' });
      }
    },
    onError: (e: any) => toast({ title: 'Erro ao salvar', description: e.message, variant: 'destructive' }),
  });

  // Auto-save a cada 30s quando rascunho
  useEffect(() => {
    if (!isDraft || isLocked) return;
    const interval = setInterval(async () => {
      if (!clientName.trim() || !clientAddress.trim()) return;
      setAutoSaveStatus('saving');
      try {
        const payload = await buildPayload(false);
        if (savedId) {
          await supabase.from('service_orders').update(payload).eq('id', savedId);
        } else {
          const { data } = await supabase.from('service_orders').insert(payload).select('id, os_seq').single();
          if (data?.id) {
            setSavedId(data.id);
            if (data.os_seq && osNumber.includes('TMP')) {
              const newNum = `OS-${new Date().getFullYear()}-${String(data.os_seq).padStart(6, '0')}`;
              setOsNumber(newNum);
              await supabase.from('service_orders').update({ os_number: newNum }).eq('id', data.id);
            }
          }
        }
        setAutoSaveStatus('saved');
        setTimeout(() => setAutoSaveStatus('idle'), 2000);
      } catch {
        setAutoSaveStatus('idle');
      }
    }, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isDraft, isLocked, savedId, clientName, clientAddress, summary, visitType,
    checklist, materials, evidences, checkin, checkout, signatureData,
  ]);

  const hasRemoteSignature = signedLinks.length > 0;

  const finalizeChecklist = useMemo(() => ([
    { ok: !!clientName.trim(), label: 'Cliente preenchido' },
    { ok: !!clientAddress.trim(), label: 'Endereço preenchido' },
    { ok: !!summary.trim(), label: 'Resumo do atendimento' },
    { ok: evidences.length > 0, label: 'Pelo menos 1 evidência (foto/anexo)' },
    { ok: !!checkin.at, label: 'Check-in geolocalizado registrado' },
    { ok: !!signatureData || hasRemoteSignature, label: 'Assinatura presencial OU remota concluída' },
  ]), [clientName, clientAddress, summary, evidences.length, checkin.at, signatureData, hasRemoteSignature]);

  const allowedToFinalize = finalizeChecklist.every((i) => i.ok) && !isLocked;
  const pendingItems = finalizeChecklist.filter((i) => !i.ok).map((i) => i.label);

  const downloadPdf = async () => {
    const evs: SOEvidence[] = [];
    for (const ev of evidences) {
      if (ev.kind && ev.kind !== 'image') {
        const { data: signed } = await supabase.storage.from('service-order-photos').createSignedUrl(ev.path, 60 * 60 * 24 * 7);
        evs.push({ dataUrl: '', caption: ev.caption, external: true, externalUrl: signed?.signedUrl, kind: ev.kind, fileName: ev.fileName });
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
        evs.push({ dataUrl, caption: ev.caption });
      }
    }
    const payload = await buildPayload(false);
    await downloadServiceOrderPdf({
      osNumber, generatedAt: new Date().toISOString(),
      technicianName: payload.technician_name,
      clientName, clientContact, clientAddress, visitType,
      requestedBy, requestedByRole, scheduledAt: payload.scheduled_at,
      startedAt: startedAt || '', finishedAt: finishedAt || '',
      checkin, checkout, summary, checklist, materials,
      travel: { km: travelKm, valor_km: travelValorKm, observacao: travelObs },
      evidences: evs,
      signerName, signerRole, signerDocument, signatureData,
      signedAt: payload.signed_at || '',
      integrityHash: payload.integrity_hash,
      auditLog: draft?.audit_log || [],
    });
  };

  return (
    <div className="space-y-4">
      {/* Header sticky com status + botões grandes de visita */}
      <Card className="sticky top-0 z-10">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-bold text-blue-900">OS {osNumber}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-2">
                {isLocked && <Lock className="w-3 h-3 text-green-700" />}
                {isLocked ? 'Documento emitido e travado.' : isDraft ? 'Rascunho — só é considerado emitido após finalizar.' : 'Documento emitido.'}
                {autoSaveStatus === 'saving' && <span className="text-blue-600">• salvando…</span>}
                {autoSaveStatus === 'saved' && <span className="text-green-600">• salvo</span>}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded font-semibold ${isDraft ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {isDraft ? 'RASCUNHO' : 'EMITIDA'}
              </span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {!checkin.at ? (
              <Button onClick={() => captureGeo('in')} className="bg-emerald-600 hover:bg-emerald-700 flex-1 sm:flex-none" size="lg">
                <Play className="w-5 h-5 mr-2" /> Iniciar visita (check-in)
              </Button>
            ) : !checkout.at ? (
              <Button onClick={() => captureGeo('out')} className="bg-red-600 hover:bg-red-700 flex-1 sm:flex-none" size="lg">
                <Square className="w-5 h-5 mr-2" /> Encerrar visita (check-out)
              </Button>
            ) : (
              <div className="text-xs text-gray-600 bg-gray-50 border rounded px-3 py-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Visita registrada: {new Date(checkin.at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} → {new Date(checkout.at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="identificacao">1. Identificação</TabsTrigger>
          <TabsTrigger value="visita">2. Visita</TabsTrigger>
          <TabsTrigger value="atendimento">3. Atendimento</TabsTrigger>
          <TabsTrigger value="evidencias">4. Evidências</TabsTrigger>
          <TabsTrigger value="assinatura">5. Assinatura</TabsTrigger>
        </TabsList>

        {/* ETAPA 1 — IDENTIFICAÇÃO */}
        <TabsContent value="identificacao" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Cliente *</Label>
                  <Input value={clientName} onChange={(e) => setClientName(e.target.value)} disabled={isLocked} />
                </div>
                <div>
                  <Label>Contato</Label>
                  <Input value={clientContact} onChange={(e) => setClientContact(e.target.value)} placeholder="Telefone / e-mail" disabled={isLocked} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Endereço completo *</Label>
                  <Input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="Rua, nº, bairro, cidade" disabled={isLocked} />
                </div>
                <div>
                  <Label>Tipo de visita</Label>
                  <Select value={visitType} onValueChange={setVisitType} disabled={isLocked}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {VISIT_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Agendado para</Label>
                  <Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} disabled={isLocked} />
                </div>
                <div>
                  <Label>Solicitante</Label>
                  <Input value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)} placeholder="Nome de quem solicitou" disabled={isLocked} />
                </div>
                <div>
                  <Label>Cargo / Setor do solicitante</Label>
                  <Input value={requestedByRole} onChange={(e) => setRequestedByRole(e.target.value)} disabled={isLocked} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ETAPA 2 — VISITA (geolocalização) */}
        <TabsContent value="visita" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h4 className="font-semibold text-blue-900 flex items-center gap-2"><MapPin className="w-4 h-4" /> Geolocalização da visita</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="border rounded p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <strong className="text-sm">Check-in</strong>
                    <Button size="sm" variant="outline" onClick={() => captureGeo('in')} disabled={isLocked}>
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
                    <Button size="sm" variant="outline" onClick={() => captureGeo('out')} disabled={isLocked}>
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
        </TabsContent>

        {/* ETAPA 3 — ATENDIMENTO (resumo + checklist + materiais + deslocamento) */}
        <TabsContent value="atendimento" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h4 className="font-semibold text-blue-900">Resumo do atendimento</h4>
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Descreva o que foi feito, com quem foi tratado, próximas providências..."
                rows={5}
                disabled={isLocked}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-blue-900">Checklist da visita</h4>
                <Button size="sm" variant="outline" onClick={addChecklist} disabled={isLocked}><Plus className="w-3 h-3 mr-1" /> Item</Button>
              </div>
              {checklist.map((c, i) => (
                <div key={i} className="grid sm:grid-cols-12 gap-2 items-start">
                  <Input className="sm:col-span-5" placeholder="Item" value={c.label} onChange={(e) => updateChecklist(i, { label: e.target.value })} disabled={isLocked} />
                  <Select value={c.status} onValueChange={(v) => updateChecklist(i, { status: v })} disabled={isLocked}>
                    <SelectTrigger className="sm:col-span-2"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>{STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input className="sm:col-span-4" placeholder="Observação" value={c.obs} onChange={(e) => updateChecklist(i, { obs: e.target.value })} disabled={isLocked} />
                  <Button size="icon" variant="ghost" className="sm:col-span-1 text-red-600" onClick={() => rmChecklist(i)} disabled={isLocked}><X className="w-4 h-4" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-blue-900">Materiais utilizados</h4>
                <Button size="sm" variant="outline" onClick={addMaterial} disabled={isLocked}><Plus className="w-3 h-3 mr-1" /> Material</Button>
              </div>
              {materials.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Nenhum material adicionado.</p>
              ) : materials.map((m, i) => (
                <div key={i} className="grid sm:grid-cols-12 gap-2 items-center">
                  <Input className="sm:col-span-5" placeholder="Item / peça" value={m.item} onChange={(e) => updateMaterial(i, { item: e.target.value })} disabled={isLocked} />
                  <Input className="sm:col-span-2" placeholder="Qtd" value={m.qtd} onChange={(e) => updateMaterial(i, { qtd: e.target.value })} disabled={isLocked} />
                  <Input className="sm:col-span-2" placeholder="Un" value={m.unidade} onChange={(e) => updateMaterial(i, { unidade: e.target.value })} disabled={isLocked} />
                  <Input className="sm:col-span-2" placeholder="Valor R$" value={m.valor} onChange={(e) => updateMaterial(i, { valor: e.target.value })} disabled={isLocked} />
                  <Button size="icon" variant="ghost" className="sm:col-span-1 text-red-600" onClick={() => rmMaterial(i)} disabled={isLocked}><X className="w-4 h-4" /></Button>
                </div>
              ))}

              <div className="border-t pt-3 mt-3">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Deslocamento</h5>
                <div className="grid sm:grid-cols-3 gap-2">
                  <Input placeholder="KM rodados" value={travelKm} onChange={(e) => setTravelKm(e.target.value)} disabled={isLocked} />
                  <Input placeholder="Valor por KM" value={travelValorKm} onChange={(e) => setTravelValorKm(e.target.value)} disabled={isLocked} />
                  <Input placeholder="Observação" value={travelObs} onChange={(e) => setTravelObs(e.target.value)} disabled={isLocked} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ETAPA 4 — EVIDÊNCIAS */}
        <TabsContent value="evidencias" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h4 className="font-semibold text-blue-900 flex items-center gap-2"><Camera className="w-4 h-4" /> Evidências (fotos, PDFs e vídeos)</h4>
                <div className="flex gap-2">
                  <Label className="cursor-pointer">
                    <input
                      type="file" accept="image/*" capture="environment" multiple className="hidden"
                      disabled={uploadingPhoto || isLocked}
                      onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
                    />
                    <span className="inline-flex items-center gap-1 text-xs bg-blue-900 text-white px-3 py-2 rounded">
                      {uploadingPhoto ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
                      Fotos
                    </span>
                  </Label>
                  <Label className="cursor-pointer">
                    <input
                      type="file" accept="image/*,application/pdf,video/mp4" multiple className="hidden"
                      disabled={uploadingPhoto || isLocked}
                      onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }}
                    />
                    <span className="inline-flex items-center gap-1 text-xs bg-gray-700 text-white px-3 py-2 rounded">
                      <Paperclip className="w-3 h-3" /> Anexos
                    </span>
                  </Label>
                </div>
              </div>
              {evidences.length === 0 ? (
                <p className="text-xs text-gray-400 italic">Adicione pelo menos uma foto para comprovar a presença no local. Aceita imagens, PDFs e vídeos MP4 (máx 20 MB cada).</p>
              ) : (
                <div className="grid sm:grid-cols-3 gap-3">
                  {evidences.map((ev, i) => (
                    <EvidenceThumb
                      key={ev.path}
                      ev={ev}
                      disabled={isLocked}
                      onCaption={(c) => setEvidences((p) => p.map((x, idx) => idx === i ? { ...x, caption: c } : x))}
                      onRemove={() => removeEvidence(i)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ETAPA 5 — ASSINATURA */}
        <TabsContent value="assinatura" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-6 space-y-3">
              <h4 className="font-semibold text-blue-900 flex items-center gap-2"><FileSignature className="w-4 h-4" /> Aceite presencial</h4>
              <p className="text-xs text-gray-500">Coleta da assinatura de quem recebeu o atendimento (gestor, encarregado, usuário, etc).</p>
              <div className="grid sm:grid-cols-3 gap-3">
                <Input placeholder="Nome completo" value={signerName} onChange={(e) => setSignerName(e.target.value)} disabled={isLocked} />
                <Input placeholder="Cargo / Setor" value={signerRole} onChange={(e) => setSignerRole(e.target.value)} disabled={isLocked} />
                <Input placeholder="CPF / RG (opcional)" value={signerDocument} onChange={(e) => setSignerDocument(e.target.value)} disabled={isLocked} />
              </div>
              <SignaturePad label="Assinatura do responsável no local" value={signatureData} onChange={isLocked ? () => {} : setSignatureData} />
              {savedId && <SOSignatureLinksManager serviceOrderId={savedId} />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Checklist visual de finalização */}
      <Card className={allowedToFinalize ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}>
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            {allowedToFinalize
              ? <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              : <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />}
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                {allowedToFinalize ? 'Pronto para finalizar!' : 'Para finalizar você precisa:'}
              </p>
              <ul className="text-xs space-y-1">
                {finalizeChecklist.map((it, i) => (
                  <li key={i} className={it.ok ? 'text-green-700' : 'text-gray-600'}>
                    {it.ok ? '✅' : '⬜'} {it.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de ação */}
      <div className="flex flex-wrap gap-2 justify-end sticky bottom-0 bg-white py-3 border-t -mx-4 px-4">
        {!isLocked && (
          <Button variant="outline" onClick={() => saveMutation.mutate(false)} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
            Salvar rascunho
          </Button>
        )}
        {savedId && (
          <Button variant="outline" onClick={downloadPdf}>
            <Download className="w-4 h-4 mr-1" /> Baixar PDF
          </Button>
        )}
        {!isLocked && (
          <Button
            className="bg-blue-900 hover:bg-blue-800"
            disabled={!allowedToFinalize || saveMutation.isPending}
            onClick={() => saveMutation.mutate(true)}
            title={!allowedToFinalize ? `Pendente: ${pendingItems.join(', ')}` : ''}
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Finalizar OS
          </Button>
        )}
        <Button variant="ghost" onClick={onSaved}>Voltar</Button>
      </div>
    </div>
  );
};

const EvidenceThumb: React.FC<{
  ev: EvidenceMeta;
  disabled?: boolean;
  onCaption: (c: string) => void;
  onRemove: () => void;
}> = ({ ev, disabled, onCaption, onRemove }) => {
  const [url, setUrl] = useState<string>('');
  useEffect(() => {
    let active = true;
    supabase.storage.from('service-order-photos').createSignedUrl(ev.path, 3600).then(({ data }) => {
      if (active && data?.signedUrl) setUrl(data.signedUrl);
    });
    return () => { active = false; };
  }, [ev.path]);

  const isImage = !ev.kind || ev.kind === 'image';
  const isVideo = ev.kind === 'video';

  return (
    <div className="border rounded overflow-hidden bg-gray-50">
      {isImage ? (
        url ? <img src={url} className="w-full h-32 object-cover" alt="evidência" /> : <div className="w-full h-32 bg-gray-200 animate-pulse" />
      ) : (
        <div className="w-full h-32 bg-gray-100 flex flex-col items-center justify-center text-center px-2">
          {isVideo ? <span className="text-3xl">🎥</span> : <Paperclip className="w-8 h-8 text-gray-400" />}
          <span className="text-xs text-gray-700 mt-1 font-semibold truncate w-full">{ev.fileName || ev.path.split('/').pop()}</span>
          {url && <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 underline mt-1">Abrir</a>}
        </div>
      )}
      <div className="p-2 space-y-1">
        <Input className="h-8 text-xs" placeholder="Legenda" value={ev.caption} onChange={(e) => onCaption(e.target.value)} disabled={disabled} />
        {!disabled && (
          <Button size="sm" variant="ghost" className="text-red-600 w-full h-7" onClick={onRemove}>
            <Trash2 className="w-3 h-3 mr-1" /> Remover
          </Button>
        )}
      </div>
    </div>
  );
};

export default ServiceOrderForm;
