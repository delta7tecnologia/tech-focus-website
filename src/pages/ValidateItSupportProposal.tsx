import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, ShieldAlert, Download, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import logoDark from '@/assets/logo.png';
import { downloadItSupportProposalPdf } from '@/utils/itSupportProposalPdf';
import { formatBRL } from '@/lib/itSupportContent';

const fmt = (iso?: string | null) => (iso ? new Date(iso).toLocaleString('pt-BR') : '—');

const ValidateItSupportProposal = () => {
  const { hash } = useParams<{ hash: string }>();
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const { data: p, isLoading, error } = useQuery({
    queryKey: ['validate-it-support-proposal', hash],
    queryFn: async () => {
      if (!hash) throw new Error('Hash não informada');
      const cleanHash = hash.trim().toLowerCase().replace(/[^a-f0-9]/g, '');
      if (cleanHash.length < 16) throw new Error('Hash inválida.');

      let { data, error } = await (supabase as any)
        .from('it_support_proposals')
        .select('*')
        .eq('integrity_hash', cleanHash)
        .maybeSingle();
      if (error) throw error;

      if (!data && cleanHash.length < 64) {
        const { data: rows } = await (supabase as any)
          .from('it_support_proposals')
          .select('*')
          .like('integrity_hash', `${cleanHash}%`)
          .limit(2);
        if (rows && rows.length === 1) data = rows[0];
        else if (rows && rows.length > 1) throw new Error('Hash parcial corresponde a múltiplas propostas.');
      }

      if (!data) throw new Error('Nenhuma proposta encontrada para esta hash.');
      return data;
    },
    enabled: !!hash,
    retry: false,
  });

  const handleDownload = async () => {
    if (!p) return;
    setDownloading(true);
    try {
      await downloadItSupportProposalPdf({
        proposalNumber: p.proposal_number,
        generatedAt: p.generated_at,
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
        integrityHash: p.integrity_hash || '',
        sections: (p as any).sections || undefined,
        showAltatekLogo: (p as any).show_altatek_logo ?? false,
      });
    } catch (e: any) {
      toast({ title: 'Erro ao gerar PDF', description: e.message, variant: 'destructive' });
    } finally {
      setDownloading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-blue-900" /></div>;
  }

  if (error || !p) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="max-w-md border-red-200">
          <CardContent className="p-8 text-center space-y-3">
            <ShieldAlert className="w-14 h-14 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold text-red-900">Proposta não validada</h2>
            <p className="text-gray-600 text-sm">{(error as any)?.message || 'Não encontrada.'}</p>
            <p className="text-xs text-gray-500 mt-4">Hash: <code className="break-all">{hash}</code></p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const auditLog: any[] = Array.isArray(p.audit_log) ? (p.audit_log as any[]) : [];
  const wasEdited = auditLog.some((e) => e.event === 'edited_after_emission');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
          <img src={logoDark} alt="Delta7" className="h-10" />
          <div className="text-right">
            <p className="text-xs text-gray-500">Validação de proposta</p>
            <p className="text-sm font-semibold text-blue-900">Autenticidade Delta7</p>
          </div>
        </div>

        <Card className={wasEdited ? 'border-amber-300 bg-amber-50' : 'border-green-300 bg-green-50'}>
          <CardContent className="p-6 text-center space-y-2">
            {wasEdited ? <AlertTriangle className="w-14 h-14 text-amber-600 mx-auto" /> : <ShieldCheck className="w-14 h-14 text-green-600 mx-auto" />}
            <h1 className={`text-2xl font-bold ${wasEdited ? 'text-amber-900' : 'text-green-900'}`}>
              {wasEdited ? 'Proposta editada após emissão' : 'Proposta autêntica'}
            </h1>
            <p className={`text-sm ${wasEdited ? 'text-amber-800' : 'text-green-800'}`}>
              {wasEdited
                ? 'Esta proposta foi alterada após a emissão original. Verifique antes de aceitar.'
                : 'Esta proposta foi emitida pela plataforma Delta7 e sua integridade está garantida.'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-bold text-blue-900">Suporte de TI Mensal {p.proposal_number}</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-gray-500 uppercase">Cliente</dt><dd className="font-medium">{p.client_name}</dd></div>
              <div><dt className="text-xs text-gray-500 uppercase">Executivo</dt><dd className="font-medium">{p.sales_rep_name}</dd></div>
              <div><dt className="text-xs text-gray-500 uppercase">Mensalidade</dt><dd className="font-medium">{formatBRL(Number(p.monthly_total) || 0)}</dd></div>
              <div><dt className="text-xs text-gray-500 uppercase">Setup</dt><dd className="font-medium">{formatBRL(Number(p.setup_fee) || 0)}</dd></div>
              <div><dt className="text-xs text-gray-500 uppercase">Vigência</dt><dd className="font-medium">{p.contract_months} meses</dd></div>
              <div><dt className="text-xs text-gray-500 uppercase">Emitida em</dt><dd className="font-medium">{fmt(p.generated_at)}</dd></div>
            </dl>

            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-xs font-semibold text-blue-900 mb-1">Hash SHA-256 de integridade</p>
              <code className="text-xs break-all text-blue-900 block font-mono">{p.integrity_hash}</code>
            </div>

            <Button onClick={handleDownload} disabled={downloading} className="w-full bg-blue-900 hover:bg-blue-800">
              {downloading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gerando PDF...</>) : (<><Download className="w-4 h-4 mr-2" /> Baixar proposta original em PDF</>)}
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400">
          Plataforma Delta7 Soluções em Tecnologia · Validação automática por hash SHA-256
        </p>
      </div>
    </div>
  );
};

export default ValidateItSupportProposal;
