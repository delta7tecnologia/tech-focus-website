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
import ItSupportItemsEditor, { type SupEditableItem } from './ItSupportItemsEditor';
import ItSupportProposalSignatureLinksManager from './ItSupportProposalSignatureLinksManager';
import ClientShowcasePicker, { fetchFeaturedClients, type FeaturedClient } from '@/components/tech/proposals/ClientShowcasePicker';
import {
  SUP_SETUP_FEE_DEFAULT,
  SUP_VALIDITY_DAYS_DEFAULT,
  SUP_CONTRACT_MONTHS_DEFAULT,
  SUP_DEFAULT_SECTIONS,
  SUP_COMPACT_SECTIONS,
  SUP_MINIMAL_SECTIONS,
  SUP_SECTION_LABELS,
  type SupProposalSections,
} from '@/lib/itSupportContent';
import { validateDocument, formatDocument } from '@/lib/validators/document';
import { sha256Hex } from '@/utils/reportHash';
import { downloadItSupportProposalPdf, previewItSupportProposalPdf } from '@/utils/itSupportProposalPdf';

interface Props {
  proposal?: any;
  onClose: () => void;
}

const ItSupportProposalForm: React.FC<Props> = ({ proposal, onClose }) => {
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
  const [validityDays, setValidityDays] = useState<number>(proposal?.validity_days ?? SUP_VALIDITY_DAYS_DEFAULT);
  const [contractMonths, setContractMonths] = useState<number>(proposal?.contract_months ?? SUP_CONTRACT_MONTHS_DEFAULT);
  const [notes, setNotes] = useState(proposal?.notes || '');
  const [showAltatekLogo, setShowAltatekLogo] = useState<boolean>(proposal?.show_altatek_logo ?? false);
  const [items, setItems] = useState<SupEditableItem[]>(proposal?.items?.length ? proposal.items : []);
  const [setupFee, setSetupFee] = useState<number>(proposal?.setup_fee ?? SUP_SETUP_FEE_DEFAULT);
  const [discount, setDiscount] = useState<number>(proposal?.discount ?? 0);
  const [sections, setSections] = useState<SupProposalSections>({
    ...SUP_DEFAULT_SECTIONS,
    ...(proposal?.sections || {}),
  });
  const [featuredClients, setFeaturedClients] = useState<FeaturedClient[]>(
    Array.isArray(proposal?.featured_clients) ? proposal.featured_clients : [],
  );
  const featuredClientIds = featuredClients.map((c) => c.id);
  const handleFeaturedClientsChange = async (ids: string[]) => {
    const list = await fetchFeaturedClients(ids);
    setFeaturedClients(list);
  };

  const toggleSection = (key: keyof SupProposalSections) =>
    setSections((s) => ({ ...s, [key]: !s[key] }));

  const [previewPages, setPreviewPages] = useState<string[] | null>(null);
  const [previewLoading, setPreviewLoading] = useState<false | 'modelo01' | 'modelo02'>(false);
  const [previewTemplate, setPreviewTemplate] = useState<'modelo01' | 'modelo02'>('modelo01');

  const docValidation = validateDocument(clientDocument);

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
    if (items.length === 0) return 'Adicione pelo menos um item ao contrato.';
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
      validity_days: validityDays || SUP_VALIDITY_DAYS_DEFAULT,
      contract_months: contractMonths || SUP_CONTRACT_MONTHS_DEFAULT,
      notes: notes.trim() || null,
      items: items.filter((i) => i.description.trim() && i.qty > 0),
      setup_fee: setupFee,
      discount,
      monthly_total: monthlyTotal,
      setup_total: setupFee,
      sections: sections as any,
      show_altatek_logo: showAltatekLogo,
      featured_clients: featuredClients as any,
    };
  };

  const buildPdfData = (p: any, template: 'modelo01' | 'modelo02', overrideHash?: string) => ({
    proposalNumber: p.proposal_number || 'PRÉVIA',
    generatedAt: p.generated_at || new Date().toISOString(),
    validityDays: p.validity_days,
    contractMonths: p.contract_months,
    clientName: p.client_name,
    clientDocument: p.client_document || undefined,
    clientContact: p.client_contact || undefined,
    clientEmail: p.client_email || undefined,
    clientAddress: p.client_address || undefined,
    salesRepName: p.sales_rep_name,
    salesRepEmail: p.sales_rep_email || undefined,
    items: (p.items as any) || [],
    setupFee: Number(p.setup_fee) || 0,
    discount: Number(p.discount) || 0,
    notes: p.notes || undefined,
    integrityHash: overrideHash ?? (p.integrity_hash || ''),
    sections: (p.sections as SupProposalSections) || sections,
    showAltatekLogo: p.show_altatek_logo ?? showAltatekLogo,
    featuredClients: (Array.isArray(p.featured_clients) ? p.featured_clients : featuredClients) as any,
    template,
  });

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
      const pages = await previewItSupportProposalPdf(buildPdfData(
        { ...payload, proposal_number: proposal?.proposal_number || 'PRÉVIA', generated_at: new Date().toISOString() },
        template,
        proposal?.integrity_hash || 'previa-sem-hash-de-integridade'.padEnd(64, '0'),
      ));
      setPreviewPages(pages);
    } catch (e: any) {
      toast({ title: 'Erro na prévia', description: e.message, variant: 'destructive' });
    } finally {
      setPreviewLoading(false);
    }
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
        const { data, error } = await (supabase as any)
          .from('it_support_proposals')
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
        const { data, error } = await (supabase as any)
          .from('it_support_proposals')
          .insert(insert)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: async (data: any, vars) => {
      queryClient.invalidateQueries({ queryKey: ['it-support-proposals'] });
      toast({ title: vars.finalize ? 'Proposta gerada' : 'Rascunho salvo' });
      if (vars.finalize) {
        try {
          await downloadItSupportProposalPdf(buildPdfData(data, 'modelo01'));
        } catch (pdfErr: any) {
          console.error('Falha ao gerar PDF:', pdfErr);
          toast({
            title: 'Proposta salva, mas falhou ao gerar PDF',
            description: `${pdfErr?.message || 'Erro desconhecido'}. Você pode baixar pela lista.`,
            variant: 'destructive',
          });
        }
      }
      onClose();
    },
    onError: (e: any) => {
      toast({ title: 'Erro ao salvar proposta', description: e?.message || String(e), variant: 'destructive' });
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
          <h3 className="text-lg font-bold text-blue-900">Escopo do Contrato de Suporte</h3>
          <ItSupportItemsEditor
            items={items}
            onChange={setItems}
            discount={discount}
            onDiscountChange={setDiscount}
            setupFee={setupFee}
            onSetupFeeChange={setSetupFee}
            contractMonths={contractMonths}
            onContractMonthsChange={setContractMonths}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-lg font-bold text-blue-900">Conteúdo do PDF</h3>
              <p className="text-xs text-gray-500 mt-1">Marque as seções que deseja incluir.</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => setSections(SUP_MINIMAL_SECTIONS)}>Apenas comercial</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setSections(SUP_COMPACT_SECTIONS)}>Enxuta</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setSections(SUP_DEFAULT_SECTIONS)}>Padrão</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
            {SUP_SECTION_LABELS.map(({ key, label, hint }) => (
              <label key={key} className="flex items-center gap-3 p-3 rounded-md border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors">
                <Checkbox checked={sections[key]} onCheckedChange={() => toggleSection(key)} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">{label}</div>
                  <div className="text-xs text-gray-500">{hint}</div>
                </div>
              </label>
            ))}
          </div>

          <div className="pt-3 border-t mt-2">
            <label className="flex items-center gap-3 p-3 rounded-md border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors">
              <Checkbox checked={showAltatekLogo} onCheckedChange={(v) => setShowAltatekLogo(!!v)} />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">Exibir selo "Consultor Autorizado Dell Expert Network"</div>
                <div className="text-xs text-gray-500">Inclui a logo Dell Expert Network na capa do PDF.</div>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-blue-900">Observações</h3>
          <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Informações adicionais para o cliente (opcional)" />
        </CardContent>
      </Card>

      {isEdit && proposal?.id && !proposal?.is_draft && (
        <ItSupportProposalSignatureLinksManager proposalId={proposal.id} />
      )}

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
                <img key={i} src={src} alt={`Página ${i + 1}`} className="w-full block bg-white shadow-lg rounded" />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItSupportProposalForm;
