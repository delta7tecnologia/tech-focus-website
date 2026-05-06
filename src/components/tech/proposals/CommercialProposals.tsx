import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FilePlus, Edit, Trash2, FileDown, Loader2, Lock, FileText } from 'lucide-react';
import ProposalForm from './ProposalForm';
import { downloadCommercialProposalPdf } from '@/utils/commercialProposalPdf';
import { formatBRL } from '@/lib/proposalContent';
import type { EditableItem } from './ProposalItemsEditor';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  rascunho: { label: 'Rascunho', color: 'bg-gray-100 text-gray-700' },
  enviada: { label: 'Enviada', color: 'bg-blue-100 text-blue-800' },
  aceita: { label: 'Aceita', color: 'bg-green-100 text-green-800' },
  recusada: { label: 'Recusada', color: 'bg-red-100 text-red-800' },
};

const CommercialProposals: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const { data: proposals, isLoading } = useQuery({
    queryKey: ['commercial-proposals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commercial_proposals')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('commercial_proposals').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commercial-proposals'] });
      toast({ title: 'Proposta excluída' });
    },
    onError: (e: any) => toast({ title: 'Erro ao excluir', description: e.message, variant: 'destructive' }),
  });

  const handleDownload = async (p: any) => {
    setDownloading(p.id);
    try {
      await downloadCommercialProposalPdf({
        proposalNumber: p.proposal_number,
        generatedAt: p.generated_at,
        validityDays: p.validity_days,
        clientName: p.client_name,
        clientDocument: p.client_document || undefined,
        clientContact: p.client_contact || undefined,
        clientEmail: p.client_email || undefined,
        clientAddress: p.client_address || undefined,
        salesRepName: p.sales_rep_name,
        salesRepEmail: p.sales_rep_email || undefined,
        items: (p.items as EditableItem[]) || [],
        activationFee: Number(p.activation_fee) || 0,
        discount: Number(p.discount) || 0,
        notes: p.notes || undefined,
        integrityHash: p.integrity_hash || '',
        sections: p.sections || undefined,
      });
    } catch (e: any) {
      toast({ title: 'Erro ao gerar PDF', description: e.message, variant: 'destructive' });
    } finally {
      setDownloading(null);
    }
  };

  const openNew = () => { setEditing(null); setIsFormOpen(true); };
  const openEdit = (p: any) => { setEditing(p); setIsFormOpen(true); };
  const closeForm = () => { setIsFormOpen(false); setEditing(null); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Propostas Comerciais — Backup Online</h3>
          <p className="text-sm text-gray-500">Gere propostas profissionais para clientes em poucos cliques.</p>
        </div>
        <Button onClick={openNew} className="bg-blue-900 hover:bg-blue-800">
          <FilePlus className="w-4 h-4 mr-2" /> Nova Proposta
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-900" /></div>
      ) : !proposals?.length ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nenhuma proposta criada ainda</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {proposals.map((p: any) => {
            const st = STATUS_LABELS[p.status] || STATUS_LABELS.rascunho;
            return (
              <Card key={p.id}>
                <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-blue-900">{p.proposal_number}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded ${st.color}`}>{st.label}</span>
                      {p.locked && <span className="text-[11px] inline-flex items-center gap-1 text-amber-700"><Lock className="w-3 h-3" /> travada</span>}
                    </div>
                    <p className="font-semibold text-gray-900 truncate">{p.client_name}</p>
                    <p className="text-xs text-gray-500">
                      Mensal: <strong>{formatBRL(Number(p.monthly_total) || 0)}</strong> · Ativação: {formatBRL(Number(p.activation_fee) || 0)} ·{' '}
                      {new Date(p.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {p.integrity_hash && (
                      <Button size="icon" variant="ghost" onClick={() => handleDownload(p)} disabled={downloading === p.id} title="Baixar PDF">
                        {downloading === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                      </Button>
                    )}
                    {!p.locked && (
                      <Button size="icon" variant="ghost" onClick={() => openEdit(p)} title="Editar">
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {p.created_by === user?.id && (
                      <Button size="icon" variant="ghost" className="text-red-600" onClick={() => {
                        if (confirm('Excluir esta proposta?')) deleteMutation.mutate(p.id);
                      }} title="Excluir">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={(o) => !o && closeForm()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? `Editar Proposta — ${editing.proposal_number}` : 'Nova Proposta de Backup Online'}</DialogTitle>
          </DialogHeader>
          <ProposalForm proposal={editing} onClose={closeForm} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommercialProposals;
