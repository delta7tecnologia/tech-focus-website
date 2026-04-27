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
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, X, Loader2, FileCheck2, RotateCcw, Plus, FileSignature, Trash2, Save, Eye, Link2 } from 'lucide-react';
import { generateReportHash, generateReportNumber } from '@/utils/reportHash';
import {
  generateAdvancedReportPdf,
  type AdvancedReportData,
  type AdvancedPhoto,
} from '@/utils/reportPdfAdvanced';
import type { SituacaoHW } from '@/utils/reportNarrativeAdvanced';
import SignaturePad from './SignaturePad';
import PdfPreviewDialog from './PdfPreviewDialog';
import type jsPDF from 'jspdf';
import delta7Logo from '@/assets/delta7-logo.png';
import { detectExternalProvider } from '../UploadOrLinkInput';

interface PhotoState extends AdvancedPhoto {
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

const HARDWARE_COMPONENTES = [
  'CPU / Processador',
  'Memória RAM',
  'Armazenamento (HD/SSD)',
  'Placa-mãe',
  'Placa de Vídeo',
  'Placa de Rede',
  'Fonte de Alimentação',
  'Monitor',
  'Teclado / Mouse',
  'Periféricos / Outros',
];

const FINALIDADES = [
  'Uso Administrativo',
  'Desenvolvimento de Software',
  'Edição de Imagens / Vídeo',
  'CAD / Engenharia',
  'Atendimento / Call Center',
  'Ensino / Laboratório',
];

const ESTADO_OPCOES = ['Ótimo', 'Bom', 'Regular', 'Ruim', 'Péssimo'];
const SEGURANCA_OPCOES = ['Adequada', 'Com ressalvas', 'Vulnerável', 'Comprometida'];
const REDE_OPCOES = ['Funcional', 'Instável', 'Sem acesso à rede', 'N/A'];

interface DraftReport {
  id: string;
  report_number: string;
  technician_name: string;
  company_name: string;
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

const initialState = () => ({
  // Identificação
  patrimonio: '',
  marca: '',
  modelo: '',
  tipo: '',
  setor: '',
  unidade: '',
  usuario: '',
  contato: '',
  dataAquisicao: '',
  garantia: '',
  finalidades: [] as string[],
  finalidadeOutro: '',
  companyName: '',
  technicianName: '',
  // Hardware
  hardware: HARDWARE_COMPONENTES.map((c) => ({
    componente: c,
    descricao: '',
    situacao: '' as SituacaoHW,
    obs: '',
  })),
  // Software
  software: {
    so: { descricao: '', situacao: '', obs: '' },
    office: { descricao: '', situacao: '', obs: '' },
    antivirus: { descricao: '', situacao: '', obs: '' },
    especifico: { descricao: '', situacao: '', obs: '' },
    drivers: { descricao: '', situacao: '', obs: '' },
  },
  // Problemas
  problemas: [{ area: '', descricao: '', criticidade: '', acao: '' }],
  // Estado geral
  estado: { conservacao: '', desempenho: '', seguranca: '', conectividade: '' },
  // Parecer
  parecer: '',
  parecerTexto: '',
  // Recomendações
  recomendacoes: [{ texto: '', responsavel: '', prazo: '' }],
  observacoesFinais: '',
  // Assinaturas
  assinaturaTecnico: '',
  assinaturaGestor: '',
  assinaturaUsuario: '',
  gestorNome: '',
  gestorCargo: '',
  usuarioNome: '',
  usuarioMatricula: '',
});

const AdvancedReportGenerator: React.FC<Props> = ({ onSaved, draft }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [s, setS] = useState(initialState);
  const [photos, setPhotos] = useState<PhotoState[]>([]);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [reportNumber, setReportNumber] = useState<string>('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPdf, setPreviewPdf] = useState<jsPDF | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!draft) return;
      const fd = (draft.form_data || {}) as any;
      const ident = draft.triagem?.identificacao || {};
      const conc = draft.conclusao || {};
      const ass = conc.assinaturas || {};
      setS({
        patrimonio: fd.patrimonio ?? ident.patrimonio ?? '',
        marca: fd.marca ?? ident.marca ?? '',
        modelo: fd.modelo ?? ident.modelo ?? '',
        tipo: fd.tipo ?? ident.tipo ?? '',
        setor: fd.setor ?? ident.setor ?? '',
        unidade: fd.unidade ?? ident.unidade ?? '',
        usuario: fd.usuario ?? ident.usuario ?? '',
        contato: fd.contato ?? ident.contato ?? '',
        dataAquisicao: fd.dataAquisicao ?? ident.dataAquisicao ?? '',
        garantia: fd.garantia ?? ident.garantia ?? '',
        finalidades: fd.finalidades ?? ident.finalidades ?? [],
        finalidadeOutro: fd.finalidadeOutro ?? ident.finalidadeOutro ?? '',
        companyName: draft.company_name || '',
        technicianName: draft.technician_name || '',
        hardware: fd.hardware ?? draft.triagem?.hardware ?? initialState().hardware,
        software: fd.software ?? draft.triagem?.software ?? initialState().software,
        problemas: fd.problemas ?? draft.diagnostico?.problemas ?? [{ area: '', descricao: '', criticidade: '', acao: '' }],
        estado: fd.estado ?? draft.diagnostico?.estado ?? { conservacao: '', desempenho: '', seguranca: '', conectividade: '' },
        parecer: fd.parecer ?? conc.parecer ?? '',
        parecerTexto: fd.parecerTexto ?? conc.parecerTexto ?? '',
        recomendacoes: fd.recomendacoes ?? conc.recomendacoes ?? [{ texto: '', responsavel: '', prazo: '' }],
        observacoesFinais: fd.observacoesFinais ?? conc.observacoesFinais ?? '',
        assinaturaTecnico: fd.assinaturaTecnico ?? '',
        assinaturaGestor: fd.assinaturaGestor ?? '',
        assinaturaUsuario: fd.assinaturaUsuario ?? '',
        gestorNome: fd.gestorNome ?? ass.gestorNome ?? '',
        gestorCargo: fd.gestorCargo ?? ass.gestorCargo ?? '',
        usuarioNome: fd.usuarioNome ?? ass.usuarioNome ?? '',
        usuarioMatricula: fd.usuarioMatricula ?? ass.usuarioMatricula ?? '',
      });
      setDraftId(draft.id);
      setReportNumber(draft.report_number);
      const loaded: PhotoState[] = [];
      for (const p of (draft.photos || []) as Array<any>) {
        if (p.external && p.url) {
          loaded.push({
            id: crypto.randomUUID(),
            dataUrl: '',
            caption: p.caption || '',
            external: true,
            externalUrl: p.url,
            externalProvider: p.provider || detectExternalProvider(p.url),
            uploaded: true,
          });
          continue;
        }
        if (!p.path) continue;
        try {
          const { data } = await supabase.storage.from('report-photos').download(p.path);
          if (data) {
            const dataUrl = await new Promise<string>((res, rej) => {
              const r = new FileReader();
              r.onload = () => res(r.result as string);
              r.onerror = rej;
              r.readAsDataURL(data);
            });
            loaded.push({ id: crypto.randomUUID(), dataUrl, caption: p.caption || '', storagePath: p.path, uploaded: true });
          }
        } catch {}
      }
      setPhotos(loaded);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  useQuery({
    queryKey: ['adv-report-profile', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles').select('full_name').eq('user_id', user!.id).single();
      // Só preenche o nome do técnico em laudos NOVOS (sem draft).
      // Ao editar laudo de outra pessoa, mantém o técnico responsável original.
      if (data?.full_name && !s.technicianName && !draft) {
        setS((prev) => ({ ...prev, technicianName: data.full_name as string }));
      }
      return data;
    },
    enabled: !!user && !draft,
  });

  const { data: existingCompanies = [] } = useQuery({
    queryKey: ['report-companies'],
    queryFn: async () => {
      const { data } = await supabase.from('assets').select('company_name');
      const set = new Set((data || []).map((a) => a.company_name).filter(Boolean));
      return Array.from(set).sort();
    },
  });
  const filteredCompanies = existingCompanies.filter((c) =>
    c.toLowerCase().includes(s.companyName.toLowerCase())
  );

  const update = <K extends keyof ReturnType<typeof initialState>>(k: K, v: any) =>
    setS((prev) => ({ ...prev, [k]: v }));

  const updateHW = (i: number, field: 'descricao' | 'situacao' | 'obs', v: string) => {
    setS((prev) => {
      const hw = [...prev.hardware];
      hw[i] = { ...hw[i], [field]: v };
      return { ...prev, hardware: hw };
    });
  };

  const updateSW = (
    key: keyof ReturnType<typeof initialState>['software'],
    field: 'descricao' | 'situacao' | 'obs',
    v: string,
  ) => {
    setS((prev) => ({
      ...prev,
      software: { ...prev.software, [key]: { ...prev.software[key], [field]: v } },
    }));
  };

  const updateProblema = (i: number, field: keyof ReturnType<typeof initialState>['problemas'][0], v: string) => {
    setS((prev) => {
      const p = [...prev.problemas];
      p[i] = { ...p[i], [field]: v };
      return { ...prev, problemas: p };
    });
  };
  const addProblema = () =>
    setS((prev) => ({ ...prev, problemas: [...prev.problemas, { area: '', descricao: '', criticidade: '', acao: '' }] }));
  const removeProblema = (i: number) =>
    setS((prev) => ({ ...prev, problemas: prev.problemas.filter((_, idx) => idx !== i) }));

  const updateRec = (i: number, field: keyof ReturnType<typeof initialState>['recomendacoes'][0], v: string) => {
    setS((prev) => {
      const r = [...prev.recomendacoes];
      r[i] = { ...r[i], [field]: v };
      return { ...prev, recomendacoes: r };
    });
  };
  const addRec = () =>
    setS((prev) => ({ ...prev, recomendacoes: [...prev.recomendacoes, { texto: '', responsavel: '', prazo: '' }] }));
  const removeRec = (i: number) =>
    setS((prev) => ({ ...prev, recomendacoes: prev.recomendacoes.filter((_, idx) => idx !== i) }));

  const toggleFinalidade = (f: string, checked: boolean) => {
    setS((prev) => ({
      ...prev,
      finalidades: checked
        ? [...prev.finalidades, f]
        : prev.finalidades.filter((x) => x !== f),
    }));
  };

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
  const removePhoto = (id: string) => setPhotos((prev) => prev.filter((p) => p.id !== id));

  const reset = () => {
    setS({ ...initialState(), technicianName: s.technicianName });
    setPhotos([]);
    setDraftId(null);
    setReportNumber('');
  };

  const addExternalPhoto = () => {
    const url = window.prompt('Cole o link da foto (OneDrive, Google Drive, etc.):');
    if (!url) return;
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      toast({ title: 'URL inválida', description: 'Deve começar com http:// ou https://', variant: 'destructive' });
      return;
    }
    setPhotos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        dataUrl: '',
        caption: '',
        external: true,
        externalUrl: trimmed,
        externalProvider: detectExternalProvider(trimmed),
        uploaded: true,
      },
    ]);
  };

  const ensureUploadedPhotos = async (rNum: string) => {
    const out: any[] = [];
    for (const p of photos) {
      if (p.external && p.externalUrl) {
        out.push({ external: true, url: p.externalUrl, provider: p.externalProvider || 'Externo', caption: p.caption });
        continue;
      }
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

  const buildPersistPayload = (rNum: string, generatedAt: string, integrityHash: string, uploadedPhotos: any[], isDraft: boolean) => {
    const equipmentLabel = [s.marca, s.modelo, s.patrimonio ? `SN: ${s.patrimonio}` : '']
      .filter(Boolean).join(' ') || 'Equipamento sem identificação';
    const triagem = {
      identificacao: {
        patrimonio: s.patrimonio, marca: s.marca, modelo: s.modelo, tipo: s.tipo,
        setor: s.setor, unidade: s.unidade, usuario: s.usuario, contato: s.contato,
        dataAquisicao: s.dataAquisicao, garantia: s.garantia,
        finalidades: s.finalidades, finalidadeOutro: s.finalidadeOutro,
      },
      hardware: s.hardware,
      software: s.software,
    };
    const diagnostico = { problemas: s.problemas, estado: s.estado };
    const conclusao = {
      parecer: s.parecer,
      parecerTexto: s.parecerTexto,
      recomendacoes: s.recomendacoes,
      observacoesFinais: s.observacoesFinais,
      assinaturas: {
        tecnico: !!s.assinaturaTecnico,
        gestor: !!s.assinaturaGestor,
        usuario: !!s.assinaturaUsuario,
        gestorNome: s.gestorNome, gestorCargo: s.gestorCargo,
        usuarioNome: s.usuarioNome, usuarioMatricula: s.usuarioMatricula,
      },
    };
    return {
      report_number: rNum,
      report_type: 'equipamento',
      created_by: user!.id,
      technician_name: s.technicianName || 'Não informado',
      company_name: s.companyName || 'Rascunho',
      equipment: equipmentLabel,
      triagem,
      diagnostico,
      conclusao,
      photos: uploadedPhotos,
      integrity_hash: integrityHash,
      status_final: s.parecer || 'Pendente',
      generated_at: generatedAt,
      is_draft: isDraft,
      form_data: s,
    };
  };

  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      const rNum = reportNumber || generateReportNumber();
      const generatedAt = new Date().toISOString();
      const uploadedPhotos = await ensureUploadedPhotos(rNum);
      const integrityHash = await generateReportHash(
        { rNum, draft: true, s },
        s.technicianName || 'rascunho',
        generatedAt,
      );
      const payload = buildPersistPayload(rNum, generatedAt, integrityHash, uploadedPhotos, true);
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
      if (!s.companyName.trim()) throw new Error('Informe o cliente / empresa.');
      if (!s.patrimonio.trim() && !s.modelo.trim()) throw new Error('Informe ao menos patrimônio/Nº de série ou modelo.');
      if (!s.technicianName.trim()) throw new Error('Informe o técnico responsável.');
      if (!s.parecer) throw new Error('Selecione o parecer conclusivo.');

      const rNum = reportNumber || generateReportNumber();
      const generatedAt = new Date().toISOString();

      const integrityHash = await generateReportHash(
        {
          reportNumber: rNum,
          patrimonio: s.patrimonio, marca: s.marca, modelo: s.modelo,
          hardware: s.hardware, software: s.software,
          problemas: s.problemas, parecer: s.parecer,
        },
        s.technicianName,
        generatedAt,
      );

      const uploadedPhotos = await ensureUploadedPhotos(rNum);
      const payload = buildPersistPayload(rNum, generatedAt, integrityHash, uploadedPhotos, false);

      if (draftId) {
        const { error } = await supabase.from('technical_reports').update(payload).eq('id', draftId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('technical_reports').insert(payload).select('id').single();
        if (error) throw error;
        setDraftId(data.id);
      }
      setReportNumber(rNum);

      const data: AdvancedReportData = {
        reportNumber: rNum, generatedAt, technicianName: s.technicianName,
        patrimonio: s.patrimonio, marca: s.marca, modelo: s.modelo, tipo: s.tipo,
        setor: s.setor, unidade: s.unidade, usuario: s.usuario, contato: s.contato,
        dataAquisicao: s.dataAquisicao, garantia: s.garantia,
        finalidades: s.finalidades, finalidadeOutro: s.finalidadeOutro,
        hardware: s.hardware, software: s.software,
        problemas: s.problemas, estado: s.estado,
        parecer: s.parecer, parecerTexto: s.parecerTexto,
        recomendacoes: s.recomendacoes,
        photos: photos.map((p) => ({ dataUrl: p.dataUrl, caption: p.caption, external: p.external, externalUrl: p.externalUrl, externalProvider: p.externalProvider })),
        observacoesFinais: s.observacoesFinais,
        assinaturaTecnico: s.assinaturaTecnico,
        assinaturaGestor: s.assinaturaGestor,
        assinaturaUsuario: s.assinaturaUsuario,
        gestorNome: s.gestorNome, gestorCargo: s.gestorCargo,
        usuarioNome: s.usuarioNome, usuarioMatricula: s.usuarioMatricula,
        integrityHash,
      };
      const pdf = await generateAdvancedReportPdf(data);
      return { pdf, rNum };
    },
    onSuccess: ({ pdf, rNum }) => {
      setPreviewPdf(pdf);
      setPreviewLoading(false);
      setPreviewOpen(true);
      toast({ title: 'Laudo finalizado', description: `Documento ${rNum} pronto para revisão.` });
      queryClient.invalidateQueries({ queryKey: ['technical-reports'] });
    },
    onError: (e: any) => {
      setPreviewLoading(false);
      setPreviewOpen(false);
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
      reset();
      onSaved?.();
    }
  };


  const now = new Date().toLocaleString('pt-BR');

  return (
    <div className="space-y-6">
      {/* Cabeçalho timbrado */}
      <Card className="border-blue-900 border-t-4">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
          <div className="flex items-center gap-3">
            <img src={delta7Logo} alt="Delta7" className="h-12 w-auto" />
            <div>
              <h3 className="text-xl font-bold text-blue-900">DELTA7 SOLUÇÕES EM TECNOLOGIA</h3>
              <p className="text-sm text-gray-500">
                {draftId ? `Editando rascunho ${reportNumber}` : 'Laudo Técnico de Equipamento — Computador / Estação de Trabalho'}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500"><span className="font-medium">Data/Hora:</span> {now}</div>
        </CardContent>
      </Card>

      {/* 1. Identificação */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h4 className="font-semibold text-blue-900 border-l-4 border-blue-900 pl-3">1. Identificação do equipamento</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="relative">
              <Label>Cliente / Empresa *</Label>
              <Input
                value={s.companyName}
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
              <Label>Técnico Responsável *</Label>
              <Input value={s.technicianName} onChange={(e) => update('technicianName', e.target.value)} />
            </div>
            <div>
              <Label>Patrimônio / Nº de Série</Label>
              <Input value={s.patrimonio} onChange={(e) => update('patrimonio', e.target.value)} />
            </div>
            <div>
              <Label>Marca</Label>
              <Input value={s.marca} onChange={(e) => update('marca', e.target.value)} placeholder="Dell, Lenovo, HP..." />
            </div>
            <div>
              <Label>Modelo</Label>
              <Input value={s.modelo} onChange={(e) => update('modelo', e.target.value)} />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={s.tipo} onValueChange={(v) => update('tipo', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Desktop">Desktop</SelectItem>
                  <SelectItem value="Notebook">Notebook</SelectItem>
                  <SelectItem value="All-in-One">All-in-One</SelectItem>
                  <SelectItem value="Workstation">Workstation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Setor / Departamento</Label>
              <Input value={s.setor} onChange={(e) => update('setor', e.target.value)} />
            </div>
            <div>
              <Label>Unidade</Label>
              <Input value={s.unidade} onChange={(e) => update('unidade', e.target.value)} />
            </div>
            <div>
              <Label>Usuário Responsável</Label>
              <Input value={s.usuario} onChange={(e) => update('usuario', e.target.value)} />
            </div>
            <div>
              <Label>Ramal / Contato</Label>
              <Input value={s.contato} onChange={(e) => update('contato', e.target.value)} />
            </div>
            <div>
              <Label>Data de Aquisição</Label>
              <Input type="date" value={s.dataAquisicao} onChange={(e) => update('dataAquisicao', e.target.value)} />
            </div>
            <div>
              <Label>Garantia vigente?</Label>
              <Select value={s.garantia} onValueChange={(v) => update('garantia', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sim">Sim</SelectItem>
                  <SelectItem value="Não">Não</SelectItem>
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Finalidade principal do equipamento</Label>
            <div className="grid sm:grid-cols-2 gap-2 mt-2">
              {FINALIDADES.map((f) => (
                <label key={f} className="flex items-center gap-2 cursor-pointer text-sm">
                  <Checkbox
                    checked={s.finalidades.includes(f)}
                    onCheckedChange={(c) => toggleFinalidade(f, !!c)}
                  />
                  {f}
                </label>
              ))}
            </div>
            <Input
              className="mt-2"
              placeholder="Outro (descreva)"
              value={s.finalidadeOutro}
              onChange={(e) => update('finalidadeOutro', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Hardware */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h4 className="font-semibold text-blue-900 border-l-4 border-blue-900 pl-3">2. Inspeção de hardware</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-blue-50">
                <tr>
                  <th className="text-left p-2 border">Componente</th>
                  <th className="text-left p-2 border">Descrição</th>
                  <th className="text-left p-2 border w-40">Situação</th>
                  <th className="text-left p-2 border">Observações</th>
                </tr>
              </thead>
              <tbody>
                {s.hardware.map((h, i) => (
                  <tr key={i}>
                    <td className="p-2 border font-medium text-gray-700">{h.componente}</td>
                    <td className="p-2 border">
                      <Input className="h-8" value={h.descricao} onChange={(e) => updateHW(i, 'descricao', e.target.value)} />
                    </td>
                    <td className="p-2 border">
                      <Select value={h.situacao} onValueChange={(v) => updateHW(i, 'situacao', v)}>
                        <SelectTrigger className="h-8"><SelectValue placeholder="—" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bom">Bom</SelectItem>
                          <SelectItem value="Regular">Regular</SelectItem>
                          <SelectItem value="Ruim">Ruim</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2 border">
                      <Input className="h-8" value={h.obs || ''} onChange={(e) => updateHW(i, 'obs', e.target.value)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 3. Software */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h4 className="font-semibold text-blue-900 border-l-4 border-blue-900 pl-3">3. Configuração de software</h4>
          {([
            { key: 'so', label: 'Sistema Operacional', opts: ['Original', 'Pirata'] },
            { key: 'office', label: 'Pacote Office / Produtividade', opts: ['Licenciado', 'Pirata', 'N/A'] },
            { key: 'antivirus', label: 'Antivírus / Segurança', opts: ['Ativo', 'Expirado', 'Sem'] },
            { key: 'especifico', label: 'Software Específico', opts: ['OK', 'Com falha', 'N/A'] },
            { key: 'drivers', label: 'Drivers / Atualizações', opts: ['Atualizados', 'Pendentes'] },
          ] as const).map((row) => (
            <div key={row.key} className="grid sm:grid-cols-12 gap-2 items-end">
              <div className="sm:col-span-3"><Label className="text-xs">{row.label}</Label></div>
              <div className="sm:col-span-4">
                <Input className="h-9" placeholder="Descrição / versão"
                  value={s.software[row.key].descricao}
                  onChange={(e) => updateSW(row.key, 'descricao', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Select value={s.software[row.key].situacao} onValueChange={(v) => updateSW(row.key, 'situacao', v)}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>
                    {row.opts.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-3">
                <Input className="h-9" placeholder="Observação"
                  value={s.software[row.key].obs}
                  onChange={(e) => updateSW(row.key, 'obs', e.target.value)} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 4. Diagnóstico de problemas */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-blue-900 border-l-4 border-blue-900 pl-3">4. Diagnóstico de problemas</h4>
            <Button type="button" size="sm" variant="outline" onClick={addProblema}>
              <Plus className="w-4 h-4 mr-1" /> Adicionar
            </Button>
          </div>
          {s.problemas.map((p, i) => (
            <div key={i} className="grid sm:grid-cols-12 gap-2 items-start border-l-2 border-blue-100 pl-3">
              <div className="sm:col-span-3">
                <Label className="text-xs">Componente / Área</Label>
                <Input className="h-9" value={p.area} onChange={(e) => updateProblema(i, 'area', e.target.value)} />
              </div>
              <div className="sm:col-span-4">
                <Label className="text-xs">Descrição do problema</Label>
                <Input className="h-9" value={p.descricao} onChange={(e) => updateProblema(i, 'descricao', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Criticidade</Label>
                <Select value={p.criticidade} onValueChange={(v) => updateProblema(i, 'criticidade', v)}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                    <SelectItem value="N/A">N/A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Ação recomendada</Label>
                <Input className="h-9" value={p.acao} onChange={(e) => updateProblema(i, 'acao', e.target.value)} />
              </div>
              <div className="sm:col-span-1 flex justify-end pt-5">
                {s.problemas.length > 1 && (
                  <Button type="button" size="icon" variant="ghost" className="h-9 w-9 text-red-600"
                    onClick={() => removeProblema(i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 5. Estado geral */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h4 className="font-semibold text-blue-900 border-l-4 border-blue-900 pl-3">5. Estado geral do equipamento</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            {([
              { key: 'conservacao', label: 'Conservação Física', opts: ESTADO_OPCOES },
              { key: 'desempenho', label: 'Desempenho Operacional', opts: ESTADO_OPCOES },
              { key: 'seguranca', label: 'Segurança da Informação', opts: SEGURANCA_OPCOES },
              { key: 'conectividade', label: 'Conectividade / Rede', opts: REDE_OPCOES },
            ] as const).map((row) => (
              <div key={row.key}>
                <Label>{row.label}</Label>
                <Select value={s.estado[row.key]} onValueChange={(v) => update('estado', { ...s.estado, [row.key]: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {row.opts.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 6. Parecer */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h4 className="font-semibold text-blue-900 border-l-4 border-blue-900 pl-3">6. Parecer conclusivo</h4>
          <div>
            <Label>Conclusão *</Label>
            <RadioGroup value={s.parecer} onValueChange={(v) => update('parecer', v)} className="grid sm:grid-cols-2 gap-2 mt-2">
              {[
                { v: 'ADEQUADO', l: 'Adequado para uso' },
                { v: 'ADEQUADO_RESSALVAS', l: 'Adequado com ressalvas' },
                { v: 'INADEQUADO', l: 'Inadequado para uso' },
                { v: 'CONDENADO', l: 'Condenado' },
              ].map((o) => (
                <div key={o.v} className="flex items-center gap-2 border rounded p-2">
                  <RadioGroupItem value={o.v} id={`par-${o.v}`} />
                  <Label htmlFor={`par-${o.v}`} className="cursor-pointer font-normal">{o.l}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <Label>Justificativa / parecer técnico</Label>
            <Textarea rows={4} value={s.parecerTexto} onChange={(e) => update('parecerTexto', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* 7. Recomendações */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-blue-900 border-l-4 border-blue-900 pl-3">7. Recomendações e providências</h4>
            <Button type="button" size="sm" variant="outline" onClick={addRec}>
              <Plus className="w-4 h-4 mr-1" /> Adicionar
            </Button>
          </div>
          {s.recomendacoes.map((r, i) => (
            <div key={i} className="grid sm:grid-cols-12 gap-2 items-start border-l-2 border-blue-100 pl-3">
              <div className="sm:col-span-6">
                <Label className="text-xs">Providência / recomendação</Label>
                <Input className="h-9" value={r.texto} onChange={(e) => updateRec(i, 'texto', e.target.value)} />
              </div>
              <div className="sm:col-span-3">
                <Label className="text-xs">Responsável</Label>
                <Input className="h-9" value={r.responsavel} onChange={(e) => updateRec(i, 'responsavel', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Prazo estimado</Label>
                <Input type="date" className="h-9" value={r.prazo} onChange={(e) => updateRec(i, 'prazo', e.target.value)} />
              </div>
              <div className="sm:col-span-1 flex justify-end pt-5">
                {s.recomendacoes.length > 1 && (
                  <Button type="button" size="icon" variant="ghost" className="h-9 w-9 text-red-600"
                    onClick={() => removeRec(i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 8. Fotos */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="font-semibold text-blue-900 border-l-4 border-blue-900 pl-3">8. Evidências fotográficas</h4>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Camera className="w-4 h-4 mr-2" /> Adicionar fotos
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={addExternalPhoto} title="Cole o link de uma foto na nuvem (OneDrive, Drive, etc.)">
                <Link2 className="w-4 h-4 mr-2" /> Adicionar link
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" capture="environment" multiple
                className="hidden" onChange={(e) => handleAddPhotos(e.target.files)} />
            </div>
          </div>
          {photos.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Nenhuma evidência adicionada.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((p) => (
                <div key={p.id} className="space-y-2">
                  <div className="relative">
                    {p.external ? (
                      <div className="w-full h-32 rounded border border-dashed bg-purple-50 flex flex-col items-center justify-center p-2 text-center">
                        <Link2 className="w-5 h-5 text-purple-700 mb-1" />
                        <span className="text-[10px] font-semibold text-purple-700 uppercase">{p.externalProvider}</span>
                        <a href={p.externalUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-700 underline truncate w-full mt-1">
                          {p.externalUrl}
                        </a>
                      </div>
                    ) : (
                      <img src={p.dataUrl} alt="Evidência" className="w-full h-32 object-cover rounded border" />
                    )}
                    <button type="button"
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      onClick={() => removePhoto(p.id)}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <Input placeholder="Legenda" value={p.caption}
                    onChange={(e) => updateCaption(p.id, e.target.value)} className="text-xs" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 9. Assinaturas */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h4 className="font-semibold text-blue-900 border-l-4 border-blue-900 pl-3">9. Assinaturas digitais</h4>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <SignaturePad label="Técnico Responsável" value={s.assinaturaTecnico}
                onChange={(v) => update('assinaturaTecnico', v)} />
              <Input value={s.technicianName} disabled className="text-xs h-8" />
            </div>
            <div className="space-y-2">
              <SignaturePad label="Gestor / Supervisor" value={s.assinaturaGestor}
                onChange={(v) => update('assinaturaGestor', v)} />
              <Input placeholder="Nome do gestor" value={s.gestorNome}
                onChange={(e) => update('gestorNome', e.target.value)} className="text-xs h-8" />
              <Input placeholder="Cargo" value={s.gestorCargo}
                onChange={(e) => update('gestorCargo', e.target.value)} className="text-xs h-8" />
            </div>
            <div className="space-y-2">
              <SignaturePad label="Usuário do Equipamento" value={s.assinaturaUsuario}
                onChange={(v) => update('assinaturaUsuario', v)} />
              <Input placeholder="Nome do usuário" value={s.usuarioNome}
                onChange={(e) => update('usuarioNome', e.target.value)} className="text-xs h-8" />
              <Input placeholder="Matrícula" value={s.usuarioMatricula}
                onChange={(e) => update('usuarioMatricula', e.target.value)} className="text-xs h-8" />
            </div>
          </div>
          <div>
            <Label>Observações finais</Label>
            <Textarea rows={3} value={s.observacoesFinais}
              onChange={(e) => update('observacoesFinais', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <Button type="button" variant="outline" onClick={reset} disabled={generateMutation.isPending || saveDraftMutation.isPending}>
          <RotateCcw className="w-4 h-4 mr-2" /> Limpar
        </Button>
        <Button type="button" variant="outline"
          onClick={() => saveDraftMutation.mutate()}
          disabled={saveDraftMutation.isPending || generateMutation.isPending}>
          {saveDraftMutation.isPending
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
            : <><Save className="w-4 h-4 mr-2" /> Salvar rascunho</>}
        </Button>
        <Button type="button" className="bg-blue-900 hover:bg-blue-800"
          onClick={handleGenerate} disabled={generateMutation.isPending || saveDraftMutation.isPending}>
          {generateMutation.isPending
            ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gerando...</>
            : <><Eye className="w-4 h-4 mr-2" /> Pré-visualizar e gerar PDF</>}
        </Button>
      </div>
      <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
        <FileSignature className="w-3 h-3" /> Hash SHA-256 único combinando técnico + Nº de série + diagnóstico.
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

export default AdvancedReportGenerator;
