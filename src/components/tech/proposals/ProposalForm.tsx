import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Save, FileDown, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import ProposalItemsEditor, { type EditableItem } from './ProposalItemsEditor';
import {
  ACTIVATION_FEE_DEFAULT,
  VALIDITY_DAYS_DEFAULT,
  DEFAULT_SECTIONS,
  COMPACT_SECTIONS,
  MINIMAL_SECTIONS,
  SECTION_LABELS,
  type ProposalSections,
} from '@/lib/proposalContent';
import { validateDocument, formatDocument } from '@/lib/validators/document';
import { sha256Hex } from '@/utils/reportHash';
import { downloadCommercialProposalPdf, previewCommercialProposalPdf } from '@/utils/commercialProposalPdf';

interface Props {
  proposal?: any;
  onClose: () => void;
}

const ProposalForm: React.FC<Props> = ({ proposal, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEdit = !!proposal;

  const [clientName, setClientName] = useState(proposal?.client_name || '');
  const [clientDocument, setClientDocument] = useState(proposal?.client_document || '');
  const [clientContact, setClientContact] = useState(proposal?.client_contact || '');
  const [clientEmail, setClientEmail] = useState(proposal?.client_email || '');
  const [clientAddress, setClientAddress] = useState(proposal?.client_address || '');
  const [salesRepName, setSalesRepName] = useState(proposal?.sales_rep_name || '');
  const [salesRepEmail, setSalesRepEmail] = useState(proposal?.sales_rep_email || '');
  const [validityDays, setValidityDays] = useState<number>(proposal?.validity_days ?? VALIDITY_DAYS_DEFAULT);
  const [notes, setNotes] = useState(proposal?.notes || '');
  const [items, setItems] = useState<EditableItem[]>(
    proposal?.items?.length ? proposal.items : [],
  );
  const [activationFee, setActivationFee] = useState<number>(proposal?.activation_fee ?? ACTIVATION_FEE_DEFAULT);
  const [discount, setDiscount] = useState<number>(proposal?.discount ?? 0);
  const [sections, setSections] = useState<ProposalSections>({
    ...DEFAULT_SECTIONS,
    ...(proposal?.sections || {}),
  });

  const toggleSection = (key: keyof ProposalSections) =>
    setSections((s) => ({ ...s, [key]: !s[key] }));

  const [previewPages, setPreviewPages] = useState<string[] | null>(null);
  const [previewLoading, setPreviewLoading] = useState<false | 'modelo01' | 'modelo02'>(false);
  const [previewTemplate, setPreviewTemplate] = useState<'modelo01' | 'modelo02'>('modelo01');

  const handlePreview = async (template: 'modelo01' | 'modelo02') => {
    const err = validateForm();
    if (err) {
      toast({ title: 'Não foi possível gerar a prévia', description: err, variant: 'destructive' });
      return;
    }
    setPreviewLoading(template);
    setPreviewTemplate(template);
    try {
      const payload = buildPayload();
      const pages = await previewCommercialProposalPdf({
        proposalNumber: proposal?.proposal_number || 'PRÉVIA',
        generatedAt: new Date().toISOString(),
        validityDays: payload.validity_days,
        clientName: payload.client_name,
        clientDocument: payload.client_document || undefined,
        clientContact: payload.client_contact || undefined,
        clientEmail: payload.client_email || undefined,
        clientAddress: payload.client_address || undefined,
        salesRepName: payload.sales_rep_name,
        salesRepEmail: payload.sales_rep_email || undefined,
        items: payload.items as any,
        activationFee: payload.activation_fee,
        discount: payload.discount,
        notes: payload.notes || undefined,
        integrityHash: proposal?.integrity_hash || 'previa-sem-hash-de-integridade'.padEnd(64, '0'),
        sections,
        template,
      });
      setPreviewPages(pages);
    } catch (e: any) {
      toast({ title: 'Erro na prévia', description: e.message, variant: 'destructive' });
    } finally {
      setPreviewLoading(false);
    }
  };

  const docValidation = validateDocument(clientDocument);

  // Pré-preenche executivo com dados do perfil logado
  useEffect(() => {
    if (isEdit || !user) return;
    (async () => {
      const { data } = await supabase.from('profiles').select('full_name,email').eq('user_id', user.id).maybeSingle();
      if (data) {
        if (!salesRepName) setSalesRepName(data.full_name || '');
        if (!salesRepEmail) setSalesRepEmail(data.email || '');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const validateForm = (): string | null => {
    if (!clientName.trim()) return 'Informe o nome do cliente.';
    if (clientDocument && !docValidation.valid) return docValidation.message || 'Documento inválido.';
    if (!salesRepName.trim()) return 'Informe o executivo de vendas.';
    if (items.length === 0) return 'Adicione pelo menos um item ao cenário.';
    return null;
  };

  const buildPayload = () => {
    const monthlyTotal = items.reduce((s, i) => s + (i.qty || 0) * (i.unit_price || 0), 0) - (discount || 0);
    return {
      client_name: clientName.trim(),
      client_document: clientDocument ? formatDocument(clientDocument) : null,
      client_contact: clientContact.trim() || null,
      client_email: clientEmail.trim() || null,
      client_address: clientAddress.trim() || null,
      sales_rep_name: salesRepName.trim(),
      sales_rep_email: salesRepEmail.trim() || null,
      validity_days: validityDays || VALIDITY_DAYS_DEFAULT,
      notes: notes.trim() || null,
      items: items.filter((i) => i.description.trim() && i.qty > 0),
      activation_fee: activationFee,
      discount,
      monthly_total: monthlyTotal,
      setup_total: activationFee,
      sections: sections as any,
    };
  };

  const saveMutation = useMutation({
    mutationFn: async (opts: { finalize: boolean }) => {
      const err = validateForm();
      if (err) throw new Error(err);
      const payload = buildPayload();

      if (isEdit) {
        const update: any = { ...payload };
        if (opts.finalize) {
          update.is_draft = false;
          update.status = 'enviada';
          update.generated_at = new Date().toISOString();
          update.integrity_hash = await sha256Hex(JSON.stringify(payload) + '|' + (proposal.proposal_number || '') + '|' + new Date().toISOString());
        }
        const { data, error } = await supabase
          .from('commercial_proposals')
          .update(update)
          .eq('id', proposal.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const insert: any = {
          ...payload,
          created_by: user!.id,
          is_draft: !opts.finalize,
          status: opts.finalize ? 'enviada' : 'rascunho',
        };
        if (opts.finalize) {
          insert.generated_at = new Date().toISOString();
          insert.integrity_hash = await sha256Hex(JSON.stringify(payload) + '|' + user!.id + '|' + insert.generated_at);
        }
        const { data, error } = await supabase
          .from('commercial_proposals')
          .insert(insert)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: async (data: any, vars) => {
      queryClient.invalidateQueries({ queryKey: ['commercial-proposals'] });
      toast({ title: vars.finalize ? 'Proposta gerada' : 'Rascunho salvo' });
      if (vars.finalize) {
        try {
          await downloadCommercialProposalPdf({
            proposalNumber: data.proposal_number,
            generatedAt: data.generated_at,
            validityDays: data.validity_days,
            clientName: data.client_name,
            clientDocument: data.client_document || undefined,
            clientContact: data.client_contact || undefined,
            clientEmail: data.client_email || undefined,
            clientAddress: data.client_address || undefined,
            salesRepName: data.sales_rep_name,
            salesRepEmail: data.sales_rep_email || undefined,
            items: (data.items as EditableItem[]) || [],
            activationFee: Number(data.activation_fee) || 0,
            discount: Number(data.discount) || 0,
            notes: data.notes || undefined,
            integrityHash: data.integrity_hash || '',
            sections: (data.sections as ProposalSections) || sections,
          });
        } catch (pdfErr: any) {
          console.error('Falha ao gerar PDF após salvar proposta:', pdfErr);
          toast({
            title: 'Proposta salva, mas falhou ao gerar PDF',
            description: `${pdfErr?.message || 'Erro desconhecido'}. Você pode baixar o PDF novamente pela lista de propostas.`,
            variant: 'destructive',
          });
        }
      }
      onClose();
    },
    onError: (e: any) => {
      const msg = e?.message || String(e) || 'Erro desconhecido';
      const hint = /load failed|failed to fetch|network/i.test(msg)
        ? ' Verifique sua conexão e tente novamente.'
        : '';
      toast({ title: 'Erro ao salvar proposta', description: msg + hint, variant: 'destructive' });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-blue-900">Identificação do Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <Label>Nome / Razão Social *</Label>
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} required />
            </div>
            <div>
              <Label>CNPJ / CPF</Label>
              <Input
                value={clientDocument}
                onChange={(e) => setClientDocument(e.target.value)}
                placeholder="00.000.000/0001-00"
                onBlur={() => {
                  if (clientDocument && docValidation.valid && !docValidation.empty) {
                    setClientDocument(formatDocument(clientDocument));
                  }
                }}
              />
              {clientDocument && !docValidation.valid && (
                <p className="text-xs text-red-600 mt-1">{docValidation.message}</p>
              )}
              {clientDocument && docValidation.valid && !docValidation.empty && (
                <p className="text-xs text-green-700 mt-1">{docValidation.type.toUpperCase()} válido</p>
              )}
            </div>
            <div>
              <Label>Contato</Label>
              <Input value={clientContact} onChange={(e) => setClientContact(e.target.value)} placeholder="Nome / telefone" />
            </div>
            <div>
              <Label>E-mail</Label>
              <Input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
            </div>
            <div>
              <Label>Endereço</Label>
              <Input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-blue-900">Executivo de Vendas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Nome *</Label>
              <Input value={salesRepName} onChange={(e) => setSalesRepName(e.target.value)} required />
            </div>
            <div>
              <Label>E-mail Delta7</Label>
              <Input type="email" value={salesRepEmail} onChange={(e) => setSalesRepEmail(e.target.value)} />
            </div>
            <div>
              <Label>Validade da proposta (dias)</Label>
              <Input type="number" min={1} value={validityDays} onChange={(e) => setValidityDays(Number(e.target.value))} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-blue-900">Cenário com Backup Online</h3>
          <ProposalItemsEditor
            items={items}
            onChange={setItems}
            discount={discount}
            onDiscountChange={setDiscount}
            activationFee={activationFee}
            onActivationFeeChange={setActivationFee}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-lg font-bold text-blue-900">Conteúdo do PDF</h3>
              <p className="text-xs text-gray-500 mt-1">Marque as seções que deseja incluir. Quanto menos seções, mais curto o documento.</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => setSections(MINIMAL_SECTIONS)}>Apenas comercial</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setSections(COMPACT_SECTIONS)}>Enxuta</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setSections(DEFAULT_SECTIONS)}>Padrão</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
            {SECTION_LABELS.map(({ key, label, hint }) => (
              <label
                key={key}
                className="flex items-center gap-3 p-3 rounded-md border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors"
              >
                <Checkbox checked={sections[key]} onCheckedChange={() => toggleSection(key)} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">{label}</div>
                  <div className="text-xs text-gray-500">{hint}</div>
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-blue-900">Observações</h3>
          <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Informações adicionais para o cliente (opcional)" />
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 justify-end sticky bottom-0 bg-white py-3 border-t">
        <Button variant="outline" onClick={onClose} disabled={saveMutation.isPending}>Cancelar</Button>
        <Button variant="outline" onClick={() => handlePreview('modelo01')} disabled={!!previewLoading || saveMutation.isPending}>
          {previewLoading === 'modelo01' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Eye className="w-4 h-4 mr-2" />}
          Prévia · Modelo 01
        </Button>
        <Button variant="outline" onClick={() => handlePreview('modelo02')} disabled={!!previewLoading || saveMutation.isPending}>
          {previewLoading === 'modelo02' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Eye className="w-4 h-4 mr-2" />}
          Prévia · Modelo 02
        </Button>
        <Button variant="outline" onClick={() => saveMutation.mutate({ finalize: false })} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar Rascunho
        </Button>
        <Button onClick={() => saveMutation.mutate({ finalize: true })} disabled={saveMutation.isPending} className="bg-blue-900 hover:bg-blue-800">
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileDown className="w-4 h-4 mr-2" />}
          Finalizar e Gerar PDF
        </Button>
      </div>

      <Dialog open={!!previewPages} onOpenChange={(o) => { if (!o) setPreviewPages(null); }}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-3 border-b flex-row items-center justify-between gap-4 space-y-0">
            <DialogTitle className="text-blue-900">
              Prévia · {previewTemplate === 'modelo02' ? 'Modelo 02 (Editorial)' : 'Modelo 01 (Premium)'} {previewPages ? `· ${previewPages.length} página(s)` : ''}
            </DialogTitle>
            <span className="text-xs text-gray-500 mr-8">Visualização aproximada — finalize para baixar o PDF</span>
          </DialogHeader>
          <div className="flex-1 overflow-auto bg-gray-200 p-4">
            <div className="mx-auto max-w-3xl space-y-4">
              {previewPages?.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Página ${i + 1}`}
                  className="w-full block bg-white shadow-lg rounded"
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProposalForm;
