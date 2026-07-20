// src/components/proposals/VmProposalForm.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Save, FileDown, Eye, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { sha256Hex } from '@/utils/reportHash';
import VmItemsEditor, { type VmItem } from './VmItemsEditor';
import { downloadVmProposalPdf, previewVmProposalPdf, type VmPlano } from '@/utils/vmProposalPdf';
import { validateDocument, formatDocument } from '@/lib/validators/document';

// ── Constantes ────────────────────────────────────────────────────────────────
const VALIDITY_DAYS_DEFAULT  = 30;
const ACTIVATION_FEE_DEFAULT = 0;

// Fatores de desconto por prazo (quanto menor o fator, maior o desconto para contratos longos)
const PLANOS_FATORES = [
  { prazo: '12 MESES', fator: 1.00 },
  { prazo: '24 MESES', fator: 0.92 },
  { prazo: '36 MESES', fator: 0.85 },
];

interface Props {
  proposal?: any;
  onClose: () => void;
}

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const VmProposalForm: React.FC<Props> = ({ proposal, onClose }) => {
  const { user }        = useAuth();
  const { toast }       = useToast();
  const queryClient     = useQueryClient();
  const isEdit          = !!proposal;

  // ── Estado do formulario ──────────────────────────────────────────────────
  const [clientName,     setClientName]     = useState(proposal?.client_name     || '');
  const [clientDocument, setClientDocument] = useState(proposal?.client_document || '');
  const [clientContact,  setClientContact]  = useState(proposal?.client_contact  || '');
  const [clientEmail,    setClientEmail]    = useState(proposal?.client_email    || '');
  const [salesRepName,   setSalesRepName]   = useState(proposal?.sales_rep_name  || '');
  const [salesRepEmail,  setSalesRepEmail]  = useState(proposal?.sales_rep_email || '');
  const [validityDays,   setValidityDays]   = useState<number>(proposal?.validity_days ?? VALIDITY_DAYS_DEFAULT);
  const [notes,          setNotes]          = useState(proposal?.notes           || '');
  const [activationFee,  setActivationFee]  = useState<number>(proposal?.activation_fee ?? ACTIVATION_FEE_DEFAULT);

  const [vms,    setVms]    = useState<VmItem[]>(proposal?.vms    || []);

  // Planos: se vier do banco usa os salvos, senao calcula automaticamente
  const [planosOverride, setPlanosOverride] = useState<VmPlano[] | null>(
    proposal?.planos?.length ? proposal.planos : null
  );

  const [previewPages,   setPreviewPages]   = useState<string[] | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const docValidation = validateDocument(clientDocument);

  // ── Calculo automatico dos planos baseado no total das VMs ────────────────
  const totalMensalVms = useMemo(
    () => vms.reduce((s, v) => s + (Number(v.preco) || 0), 0),
    [vms]
  );

  // Planos calculados automaticamente
  const planosCalculados: VmPlano[] = useMemo(
    () => PLANOS_FATORES.map(({ prazo, fator }) => ({
      prazo,
      mensal: Math.ceil(totalMensalVms * fator), // arredonda para cima
    })),
    [totalMensalVms]
  );

  // Planos efetivos: override manual ou calculados
  const planos: VmPlano[] = planosOverride ?? planosCalculados;

  // Quando as VMs mudam e nao ha override, os planos se recalculam automaticamente.
  // Se houver override, mantem o que o usuario editou.
  const updatePlano = (idx: number, patch: Partial<VmPlano>) => {
    const base = planosOverride ?? planosCalculados;
    setPlanosOverride(base.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };

  const addPlano = () => {
    const base = planosOverride ?? planosCalculados;
    setPlanosOverride([...base, { prazo: '', mensal: totalMensalVms }]);
  };

  const removePlano = (idx: number) => {
    const base = planosOverride ?? planosCalculados;
    setPlanosOverride(base.filter((_, i) => i !== idx));
  };

  // Botao para redefinir planos ao calculo automatico
  const resetPlanos = () => setPlanosOverride(null);

  // Pre-preenche executivo
  useEffect(() => {
    if (isEdit || !user) return;
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('full_name,email')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) {
        if (!salesRepName)  setSalesRepName(data.full_name || '');
        if (!salesRepEmail) setSalesRepEmail(data.email    || '');
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ── Validacao ─────────────────────────────────────────────────────────────
  const validateForm = (): string | null => {
    if (!clientName.trim())   return 'Informe o nome do cliente.';
    if (clientDocument && !docValidation.valid) return docValidation.message || 'Documento invalido.';
    if (!salesRepName.trim()) return 'Informe o executivo de vendas.';
    if (vms.length === 0)     return 'Adicione pelo menos uma VM.';
    if (planos.length === 0)  return 'Adicione pelo menos um plano.';
    return null;
  };

  // ── Payload ───────────────────────────────────────────────────────────────
  const buildPayload = () => ({
    client_name:     clientName.trim(),
    client_document: clientDocument ? formatDocument(clientDocument) : null,
    client_contact:  clientContact.trim() || null,
    client_email:    clientEmail.trim()   || null,
    sales_rep_name:  salesRepName.trim(),
    sales_rep_email: salesRepEmail.trim() || null,
    validity_days:   validityDays || VALIDITY_DAYS_DEFAULT,
    notes:           notes.trim() || null,
    activation_fee:  activationFee,
    vms,
    planos,
  });

  const buildPdfData = (data: any) => ({
    proposalNumber: data.proposal_number || 'PREVIA',
    generatedAt:    data.generated_at    || new Date().toISOString(),
    validityDays:   data.validity_days,
    clientName:     data.client_name,
    clientDocument: data.client_document || undefined,
    clientContact:  data.client_contact  || undefined,
    clientEmail:    data.client_email    || undefined,
    salesRepName:   data.sales_rep_name,
    salesRepEmail:  data.sales_rep_email || undefined,
    vms:            data.vms             || [],
    planos:         data.planos          || [],
    activationFee:  Number(data.activation_fee) || 0,
    notes:          data.notes           || undefined,
    integrityHash:  data.integrity_hash  || 'previa-sem-hash'.padEnd(64, '0'),
  });

  // ── Preview ───────────────────────────────────────────────────────────────
  const handlePreview = async () => {
    const err = validateForm();
    if (err) {
      toast({ title: 'Nao foi possivel gerar a previa', description: err, variant: 'destructive' });
      return;
    }
    setPreviewLoading(true);
    try {
      const payload = buildPayload();
      const pages = await previewVmProposalPdf(buildPdfData({
        ...payload,
        proposal_number: 'PREVIA',
        generated_at:    new Date().toISOString(),
      }));
      setPreviewPages(pages);
    } catch (e: any) {
      toast({ title: 'Erro na previa', description: e.message, variant: 'destructive' });
    } finally {
      setPreviewLoading(false);
    }
  };

  // ── Save mutation ─────────────────────────────────────────────────────────
  const saveMutation = useMutation({
    mutationFn: async (opts: { finalize: boolean }) => {
      const err = validateForm();
      if (err) throw new Error(err);
      const payload = buildPayload();

      if (isEdit) {
        const update: any = { ...payload };
        if (opts.finalize) {
          update.is_draft      = false;
          update.status        = 'enviada';
          update.generated_at  = new Date().toISOString();
          update.integrity_hash= await sha256Hex(JSON.stringify(payload) + '|' + (proposal.proposal_number || '') + '|' + update.generated_at);
        }
        const { data, error } = await supabase
          .from('vm_proposals')
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
          is_draft:   !opts.finalize,
          status:     opts.finalize ? 'enviada' : 'rascunho',
        };
        if (opts.finalize) {
          insert.generated_at   = new Date().toISOString();
          insert.integrity_hash = await sha256Hex(JSON.stringify(payload) + '|' + user!.id + '|' + insert.generated_at);
        }
        const { data, error } = await supabase
          .from('vm_proposals')
          .insert(insert)
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: async (data: any, vars) => {
      queryClient.invalidateQueries({ queryKey: ['vm_proposals'] });
      if (vars.finalize) {
        toast({ title: 'Proposta finalizada!', description: `N\u00ba ${data.proposal_number}` });
        await downloadVmProposalPdf(buildPdfData(data));
      } else {
        toast({ title: 'Rascunho salvo.' });
      }
      onClose();
    },
    onError: (e: any) => {
      toast({ title: 'Erro ao salvar', description: e.message, variant: 'destructive' });
    },
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 pb-4">

      {/* Cliente */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-blue-900">Dados do Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Razao Social / Nome *</Label>
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} required />
            </div>
            <div>
              <Label>CNPJ / CPF</Label>
              <Input value={clientDocument} onChange={(e) => setClientDocument(e.target.value)} placeholder="00.000.000/0000-00" />
              {clientDocument && docValidation.valid && (
                <p className="text-xs text-green-700 mt-1">{docValidation.type.toUpperCase()} valido</p>
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
          </div>
        </CardContent>
      </Card>

      {/* Executivo */}
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
            <div>
              <Label>Taxa de Ativacao / Implantacao (R$)</Label>
              <Input type="number" min={0} step="0.01" value={activationFee} onChange={(e) => setActivationFee(Number(e.target.value))} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* VMs */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-blue-900">Maquinas Virtuais</h3>
          <VmItemsEditor vms={vms} onChange={setVms} />
        </CardContent>
      </Card>

      {/* Planos — calculados automaticamente */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-bold text-blue-900">Planos de Contratacao</h3>
              {totalMensalVms > 0 && (
                <p className="text-xs text-gray-500 mt-0.5">
                  Base: {formatBRL(totalMensalVms)}/mes
                  {planosOverride && (
                    <button
                      type="button"
                      onClick={resetPlanos}
                      className="ml-2 text-orange-600 underline hover:no-underline"
                    >
                      Redefinir para automatico
                    </button>
                  )}
                </p>
              )}
            </div>
            <Button type="button" size="sm" variant="outline" onClick={addPlano}>
              <Plus className="w-3 h-3 mr-1" /> Adicionar plano
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="text-left px-3 py-2">Prazo</th>
                  <th className="text-right px-3 py-2">Valor Mensal (R$)</th>
                  <th className="text-right px-3 py-2">Total do contrato</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {planos.map((plano, idx) => {
                  const meses = parseInt(plano.prazo) || 0;
                  const total = meses * plano.mensal;
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-2 py-1">
                        <Input
                          value={plano.prazo}
                          onChange={(e) => updatePlano(idx, { prazo: e.target.value })}
                          placeholder="12 MESES"
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="px-2 py-1">
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={plano.mensal}
                          onChange={(e) => updatePlano(idx, { mensal: Number(e.target.value) })}
                          className="h-8 text-sm text-right"
                        />
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-blue-900">
                        {total > 0 ? formatBRL(total) : '—'}
                      </td>
                      <td className="px-2 py-1 text-center">
                        <Button type="button" size="icon" variant="ghost" onClick={() => removePlano(idx)} className="text-red-500 h-7 w-7">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {planos.length === 0 && (
                  <tr><td colSpan={4} className="text-center text-gray-400 py-4 italic text-sm">Nenhum plano adicionado</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Observacoes */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-bold text-blue-900">Observacoes</h3>
          <Textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Informacoes adicionais para o cliente (opcional)"
          />
        </CardContent>
      </Card>

      {/* Botoes */}
      <div className="flex flex-wrap gap-2 justify-end sticky bottom-0 bg-white py-3 border-t">
        <Button variant="outline" onClick={onClose} disabled={saveMutation.isPending}>
          Cancelar
        </Button>
        <Button variant="outline" onClick={handlePreview} disabled={previewLoading || saveMutation.isPending}>
          {previewLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Eye className="w-4 h-4 mr-2" />}
          Previa do PDF
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

      {/* Dialog de Preview */}
      <Dialog open={!!previewPages} onOpenChange={(o) => { if (!o) setPreviewPages(null); }}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-3 border-b flex-row items-center justify-between gap-4 space-y-0">
            <DialogTitle className="text-blue-900">
              Previa da Proposta {previewPages ? `— ${previewPages.length} pagina(s)` : ''}
            </DialogTitle>
            <span className="text-xs text-gray-500 mr-8">Visualizacao aproximada — finalize para baixar o PDF</span>
          </DialogHeader>
          <div className="flex-1 overflow-auto bg-gray-200 p-4">
            <div className="mx-auto max-w-3xl space-y-4">
              {previewPages?.map((src, i) =>
                src.startsWith('data:application/pdf') || src.startsWith('blob:') ? (
                  <object
                    key={i}
                    data={src}
                    type="application/pdf"
                    className="w-full bg-white shadow-lg rounded"
                    style={{ height: '80vh' }}
                  >
                    <div className="flex flex-col items-center justify-center h-64 bg-white rounded shadow text-gray-500 gap-3">
                      <p className="text-sm">Seu navegador bloqueou a previa do PDF.</p>
                      <a href={src} download="previa-proposta.pdf" className="text-blue-700 underline text-sm">
                        Clique aqui para baixar a previa
                      </a>
                    </div>
                  </object>
                ) : (
                  <img key={i} src={src} alt={`Pagina ${i + 1}`} className="w-full block bg-white shadow-lg rounded" />
                )
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VmProposalForm;
