import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileSignature, Camera, X, Loader2, FileCheck2, RotateCcw, Save, Eye } from 'lucide-react';
import { generateReportHash, generateReportNumber } from '@/utils/reportHash';
import { generateReportPdf, type ReportPhoto } from '@/utils/reportPdf';
import type jsPDF from 'jspdf';
import PdfPreviewDialog from './PdfPreviewDialog';
import delta7Logo from '@/assets/delta7-logo.png';

interface PhotoState extends ReportPhoto {
  id: string;
  file?: File;
  storagePath?: string;
  uploaded?: boolean;
}

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const initialForm = {
  companyName: '',
  equipment: '',
  technicianName: '',
  estado: '',
  lacre: '',
  acessorios: '',
  testes: '',
  causaRaiz: '',
  pecas: '',
  recomendacoes: '',
  statusFinal: '',
};

interface DraftReport {
  id: string;
  report_number: string;
  technician_name: string;
  company_name: string;
  equipment: string;
  triagem: any;
  diagnostico: any;
  conclusao: any;
  photos: any;
  form_data: any;
}

interface Props {
  onSaved?: () => void;
  draft?: DraftReport | null;
}

const ReportGenerator: React.FC<Props> = ({ onSaved, draft }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useQuery({
    queryKey: ['report-profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles').select('full_name').eq('user_id', user!.id).single();
      if (data?.full_name && !form.technicianName) {
        setForm((prev) => ({ ...prev, technicianName: data.full_name as string }));
      }
      return data;
    },
    enabled: !!user,
  });

  const { data: existingCompanies = [] } = useQuery({
    queryKey: ['report-companies'],
    queryFn: async () => {
      const { data } = await supabase.from('assets').select('company_name');
      const set = new Set((data || []).map((a) => a.company_name).filter(Boolean));
      return Array.from(set).sort();
    },
  });

  const [form, setForm] = useState(initialForm);
  const [photos, setPhotos] = useState<PhotoState[]>([]);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [reportNumber, setReportNumber] = useState<string>('');

  // Preview state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPdf, setPreviewPdf] = useState<jsPDF | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Hidratar do draft
  useEffect(() => {
    const loadDraft = async () => {
      if (!draft) return;
      const fd = draft.form_data || {};
      setForm({
        companyName: draft.company_name || fd.companyName || '',
        equipment: draft.equipment || fd.equipment || '',
        technicianName: draft.technician_name || fd.technicianName || '',
        estado: draft.triagem?.estado || '',
        lacre: draft.triagem?.lacre || '',
        acessorios: draft.triagem?.acessorios || '',
        testes: draft.diagnostico?.testes || '',
        causaRaiz: draft.diagnostico?.causaRaiz || '',
        pecas: draft.diagnostico?.pecas || '',
        recomendacoes: draft.conclusao?.recomendacoes || '',
        statusFinal: draft.conclusao?.statusFinal || '',
      });
      setDraftId(draft.id);
      setReportNumber(draft.report_number);
      // Carregar fotos já enviadas
      const loaded: PhotoState[] = [];
      for (const p of (draft.photos || []) as Array<{ path: string; caption: string }>) {
        try {
          const { data } = await supabase.storage.from('report-photos').download(p.path);
          if (data) {
            const dataUrl = await new Promise<string>((res, rej) => {
              const reader = new FileReader();
              reader.onload = () => res(reader.result as string);
              reader.onerror = rej;
              reader.readAsDataURL(data);
            });
            loaded.push({ id: crypto.randomUUID(), dataUrl, caption: p.caption || '', storagePath: p.path, uploaded: true });
          }
        } catch {}
      }
      setPhotos(loaded);
    };
    loadDraft();
  }, [draft]);

  const filteredCompanies = existingCompanies.filter((c) =>
    c.toLowerCase().includes(form.companyName.toLowerCase())
  );

  const update = (k: keyof typeof initialForm, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleAddPhotos = async (files: FileList | null) => {
    if (!files) return;
    const arr: PhotoState[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'Foto muito grande', description: `${file.name} excede 5MB.`, variant: 'destructive' });
        continue;
      }
      const dataUrl = await fileToDataUrl(file);
      arr.push({ id: crypto.randomUUID(), file, dataUrl, caption: '', uploaded: false });
    }
    setPhotos((prev) => [...prev, ...arr]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updateCaption = (id: string, caption: string) =>
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, caption } : p)));

  const removePhoto = (id: string) =>
    setPhotos((prev) => prev.filter((p) => p.id !== id));

  const reset = () => {
    setForm({ ...initialForm, technicianName: form.technicianName });
    setPhotos([]);
    setDraftId(null);
    setReportNumber('');
  };

  const ensureUploadedPhotos = async (rNum: string) => {
    const out: { path: string; caption: string }[] = [];
    for (const p of photos) {
      if (p.uploaded && p.storagePath) {
        out.push({ path: p.storagePath, caption: p.caption });
      } else if (p.file) {
        const ext = p.file.name.split('.').pop() || 'jpg';
        const path = `${user!.id}/${rNum}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from('report-photos').upload(path, p.file);
        if (error) throw error;
        out.push({ path, caption: p.caption });
        p.uploaded = true;
        p.storagePath = path;
      }
    }
    return out;
  };

  const buildPayload = (rNum: string, generatedAt: string, integrityHash: string, uploadedPhotos: any[], isDraft: boolean) => {
    const triagem = { estado: form.estado, lacre: form.lacre, acessorios: form.acessorios };
    const diagnostico = { testes: form.testes, causaRaiz: form.causaRaiz, pecas: form.pecas };
    const conclusao = { recomendacoes: form.recomendacoes, statusFinal: form.statusFinal };
    return {
      report_number: rNum,
      report_type: 'atendimento',
      created_by: user!.id,
      technician_name: form.technicianName || 'Não informado',
      company_name: form.companyName || 'Rascunho',
      equipment: form.equipment || 'Rascunho',
      triagem,
      diagnostico,
      conclusao,
      photos: uploadedPhotos,
      integrity_hash: integrityHash,
      status_final: form.statusFinal || 'Pendente',
      generated_at: generatedAt,
      is_draft: isDraft,
      form_data: form,
    };
  };

  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      const rNum = reportNumber || generateReportNumber();
      const generatedAt = new Date().toISOString();
      const uploadedPhotos = await ensureUploadedPhotos(rNum);
      const integrityHash = await generateReportHash(
        { rNum, form, draft: true },
        form.technicianName || 'rascunho',
        generatedAt,
      );
      const payload = buildPayload(rNum, generatedAt, integrityHash, uploadedPhotos, true);

      if (draftId) {
        const { error } = await supabase.from('technical_reports').update(payload).eq('id', draftId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('technical_reports').insert(payload).select('id').single();
        if (error) throw error;
        setDraftId(data.id);
      }
      setReportNumber(rNum);
      return rNum;
    },
    onSuccess: (num) => {
      toast({ title: 'Rascunho salvo', description: `Você pode continuar editando ${num} a qualquer momento.` });
      queryClient.invalidateQueries({ queryKey: ['technical-reports'] });
    },
    onError: (e: any) => {
      toast({ title: 'Erro ao salvar rascunho', description: e.message, variant: 'destructive' });
    },
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      if (!form.companyName.trim()) throw new Error('Informe o nome do cliente.');
      if (!form.equipment.trim()) throw new Error('Informe o equipamento.');
      if (!form.technicianName.trim()) throw new Error('Informe o nome do técnico responsável.');
      if (!form.estado) throw new Error('Selecione o estado geral do equipamento.');
      if (!form.lacre) throw new Error('Indique a condição do lacre.');
      if (!form.statusFinal) throw new Error('Selecione o status final.');

      const rNum = reportNumber || generateReportNumber();
      const generatedAt = new Date().toISOString();

      const triagem = { estado: form.estado, lacre: form.lacre, acessorios: form.acessorios };
      const diagnostico = { testes: form.testes, causaRaiz: form.causaRaiz, pecas: form.pecas };
      const conclusao = { recomendacoes: form.recomendacoes, statusFinal: form.statusFinal };

      const integrityHash = await generateReportHash(
        { reportNumber: rNum, companyName: form.companyName, equipment: form.equipment, triagem, diagnostico, conclusao },
        form.technicianName,
        generatedAt
      );

      const uploadedPhotos = await ensureUploadedPhotos(rNum);
      const payload = buildPayload(rNum, generatedAt, integrityHash, uploadedPhotos, false);

      if (draftId) {
        const { error } = await supabase.from('technical_reports').update(payload).eq('id', draftId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('technical_reports').insert(payload).select('id').single();
        if (error) throw error;
        setDraftId(data.id);
      }
      setReportNumber(rNum);

      const pdf = await generateReportPdf({
        reportNumber: rNum,
        technicianName: form.technicianName,
        companyName: form.companyName,
        equipment: form.equipment,
        generatedAt,
        triagem,
        diagnostico,
        conclusao,
        photos: photos.map((p) => ({ dataUrl: p.dataUrl, caption: p.caption })),
        integrityHash,
      });
      return { pdf, rNum };
    },
    onSuccess: ({ pdf, rNum }) => {
      setPreviewPdf(pdf);
      setPreviewLoading(false);
      setPreviewOpen(true);
      toast({ title: 'Laudo finalizado', description: `Documento ${rNum} disponível para revisão.` });
      queryClient.invalidateQueries({ queryKey: ['technical-reports'] });
    },
    onError: (e: any) => {
      setPreviewLoading(false);
      toast({ title: 'Erro ao gerar laudo', description: e.message, variant: 'destructive' });
    },
  });

  const handleGenerate = () => {
    setPreviewLoading(true);
    setPreviewPdf(null);
    setPreviewOpen(true);
    generateMutation.mutate();
  };

  const handlePreviewClose = (open: boolean) => {
    setPreviewOpen(open);
    if (!open && previewPdf) {
      // Após fechar a pré-visualização do laudo finalizado, limpa
      reset();
      onSaved?.();
    }
  };

  const now = new Date().toLocaleString('pt-BR');

  return (
    <div className="space-y-6">
      {/* Cabeçalho timbrado */}
      <Card className="border-blue-900 border-t-4">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
            <div className="flex items-center gap-3">
              <img src={delta7Logo} alt="Delta7" className="h-10 w-auto" />
              <div>
                <h3 className="text-xl font-bold text-blue-900">DELTA7 SOLUÇÕES EM TECNOLOGIA</h3>
                <p className="text-sm text-gray-500">
                  {draftId ? `Editando rascunho ${reportNumber}` : 'Novo Laudo Técnico de Atendimento'}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium">Data/Hora:</span> {now}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Identificação */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h4 className="font-semibold text-blue-900 border-l-4 border-blue-900 pl-3">Identificação</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="relative">
              <Label>Cliente / Empresa *</Label>
              <Input
                value={form.companyName}
                onChange={(e) => { update('companyName', e.target.value); setShowCompanyDropdown(true); }}
                onFocus={() => setShowCompanyDropdown(true)}
                onBlur={() => setTimeout(() => setShowCompanyDropdown(false), 150)}
                placeholder="Digite ou selecione"
              />
              {showCompanyDropdown && filteredCompanies.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-40 overflow-auto">
                  {filteredCompanies.slice(0, 8).map((c) => (
                    <button key={c} type="button"
                      className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm"
                      onClick={() => { update('companyName', c); setShowCompanyDropdown(false); }}>
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label>Equipamento *</Label>
              <Input
                value={form.equipment}
                onChange={(e) => update('equipment', e.target.value)}
                placeholder="Ex.: Notebook Dell Latitude 5420 - SN: ABC123"
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Técnico Responsável *</Label>
              <Input value={form.technicianName} onChange={(e) => update('technicianName', e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Triagem */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h4 className="font-semibold text-blue-900 border-l-4 border-blue-900 pl-3">1. Triagem</h4>
          <div>
            <Label>Estado geral do equipamento *</Label>
            <RadioGroup value={form.estado} onValueChange={(v) => update('estado', v)} className="flex gap-6 mt-2">
              {['Bom', 'Regular', 'Crítico'].map((opt) => (
                <div key={opt} className="flex items-center gap-2">
                  <RadioGroupItem value={opt} id={`estado-${opt}`} />
                  <Label htmlFor={`estado-${opt}`} className="cursor-pointer font-normal">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label>Houve violação de lacres? *</Label>
            <RadioGroup value={form.lacre} onValueChange={(v) => update('lacre', v)} className="flex gap-6 mt-2">
              {['Sim', 'Não'].map((opt) => (
                <div key={opt} className="flex items-center gap-2">
                  <RadioGroupItem value={opt} id={`lacre-${opt}`} />
                  <Label htmlFor={`lacre-${opt}`} className="cursor-pointer font-normal">{opt}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label>Acessórios recebidos</Label>
            <Input value={form.acessorios} onChange={(e) => update('acessorios', e.target.value)} placeholder="Ex.: Carregador, mouse, maleta" />
          </div>
        </CardContent>
      </Card>

      {/* Diagnóstico */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h4 className="font-semibold text-blue-900 border-l-4 border-blue-900 pl-3">2. Diagnóstico</h4>
          <div>
            <Label>Testes realizados</Label>
            <Textarea rows={3} value={form.testes} onChange={(e) => update('testes', e.target.value)} placeholder="Descreva os testes executados (boot, memória, disco, rede...)" />
          </div>
          <div>
            <Label>Causa raiz identificada</Label>
            <Textarea rows={3} value={form.causaRaiz} onChange={(e) => update('causaRaiz', e.target.value)} placeholder="O que originou o problema?" />
          </div>
          <div>
            <Label>Peças/componentes necessários</Label>
            <Textarea rows={2} value={form.pecas} onChange={(e) => update('pecas', e.target.value)} placeholder="Liste peças a substituir, se houver" />
          </div>
        </CardContent>
      </Card>

      {/* Conclusão */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h4 className="font-semibold text-blue-900 border-l-4 border-blue-900 pl-3">3. Conclusão</h4>
          <div>
            <Label>Recomendações ao cliente</Label>
            <Textarea rows={3} value={form.recomendacoes} onChange={(e) => update('recomendacoes', e.target.value)} placeholder="Orientações de uso, manutenções preventivas, próximas etapas..." />
          </div>
          <div>
            <Label>Status final *</Label>
            <Select value={form.statusFinal} onValueChange={(v) => update('statusFinal', v)}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Resolvido">Resolvido</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Condenado">Condenado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Anexos */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-blue-900 border-l-4 border-blue-900 pl-3">4. Evidências fotográficas</h4>
            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Camera className="w-4 h-4 mr-2" /> Adicionar fotos
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" multiple className="hidden" onChange={(e) => handleAddPhotos(e.target.files)} />
          </div>

          {photos.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">Nenhuma foto adicionada. Toque em "Adicionar fotos" para usar a câmera ou galeria.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((p) => (
                <div key={p.id} className="space-y-2">
                  <div className="relative">
                    <img src={p.dataUrl} alt="Evidência" className="w-full h-32 object-cover rounded border" />
                    <button type="button" className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700" onClick={() => removePhoto(p.id)}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <Input placeholder="Legenda da foto" value={p.caption} onChange={(e) => updateCaption(p.id, e.target.value)} className="text-xs" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <Button type="button" variant="outline" onClick={reset} disabled={generateMutation.isPending || saveDraftMutation.isPending}>
          <RotateCcw className="w-4 h-4 mr-2" /> Limpar
        </Button>
        <Button type="button" variant="outline" onClick={() => saveDraftMutation.mutate()} disabled={saveDraftMutation.isPending || generateMutation.isPending}>
          {saveDraftMutation.isPending
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
            : <><Save className="w-4 h-4 mr-2" /> Salvar rascunho</>}
        </Button>
        <Button type="button" className="bg-blue-900 hover:bg-blue-800" onClick={handleGenerate} disabled={generateMutation.isPending || saveDraftMutation.isPending}>
          {generateMutation.isPending
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gerando...</>
            : <><Eye className="w-4 h-4 mr-2" /> Pré-visualizar e gerar PDF</>}
        </Button>
      </div>

      <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
        <FileSignature className="w-3 h-3" />
        Cada laudo recebe um hash SHA-256 único de integridade.
      </p>

      <PdfPreviewDialog
        open={previewOpen}
        onOpenChange={handlePreviewClose}
        pdf={previewPdf}
        fileName={`${reportNumber || 'Laudo'}.pdf`}
        isLoading={previewLoading}
      />
    </div>
  );
};

export default ReportGenerator;
