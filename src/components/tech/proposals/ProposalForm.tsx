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
import { Loader2, Save, FileDown } from 'lucide-react';
import ProposalItemsEditor, { type EditableItem } from './ProposalItemsEditor';
import { ACTIVATION_FEE_DEFAULT, VALIDITY_DAYS_DEFAULT } from '@/lib/proposalContent';
import { validateDocument, formatDocument } from '@/lib/validators/document';
import { sha256Hex } from '@/utils/reportHash';
import { downloadCommercialProposalPdf } from '@/utils/commercialProposalPdf';

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
        });
      }
      onClose();
    },
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
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
          <h3 className="text-lg font-bold text-blue-900">Observações</h3>
          <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Informações adicionais para o cliente (opcional)" />
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 justify-end sticky bottom-0 bg-white py-3 border-t">
        <Button variant="outline" onClick={onClose} disabled={saveMutation.isPending}>Cancelar</Button>
        <Button variant="outline" onClick={() => saveMutation.mutate({ finalize: false })} disabled={saveMutation.isPending}>
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar Rascunho
        </Button>
        <Button onClick={() => saveMutation.mutate({ finalize: true })} disabled={saveMutation.isPending} className="bg-blue-900 hover:bg-blue-800">
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileDown className="w-4 h-4 mr-2" />}
          Finalizar e Gerar PDF
        </Button>
      </div>
    </div>
  );
};

export default ProposalForm;
