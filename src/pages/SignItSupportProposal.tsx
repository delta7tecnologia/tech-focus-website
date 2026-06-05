import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, FileSignature, CheckCircle2, XCircle, ShieldCheck, FileDown } from 'lucide-react';
import SignaturePad from '@/components/tech/reports/SignaturePad';
import { downloadItSupportProposalPdf } from '@/utils/itSupportProposalPdf';
import { formatBRL } from '@/lib/itSupportContent';
import delta7Logo from '@/assets/delta7-logo.png';
import { useSEO } from '@/hooks/useSEO';

const ROLE_LABEL: Record<string, string> = { cliente: 'Cliente', responsavel: 'Responsável / Decisor' };

const SignItSupportProposal = () => {
  useSEO({ title: 'Assinar proposta de suporte de TI | Delta7 Tecnologia', description: 'Página segura para revisar e assinar digitalmente a proposta de suporte de TI da Delta7 Tecnologia.', noindex: true });

  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [signature, setSignature] = useState('');
  const [name, setName] = useState('');
  const [downloading, setDownloading] = useState<'modelo01' | 'modelo02' | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['sign-it-support-proposal-link', token],
    queryFn: async () => {
      const { data: result, error: rpcErr } = await (supabase as any).rpc('get_it_support_proposal_signature_link', { p_token: token });
      if (rpcErr) throw rpcErr;
      if (!result || !result.link) throw new Error('Link inválido');
      if (!result.proposal) throw new Error('Proposta não encontrada');
      return { link: result.link, proposal: result.proposal };
    },
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (data?.link?.signer_name && !name) setName(data.link.signer_name);
  }, [data?.link?.signer_name]);

  const signMutation = useMutation({
    mutationFn: async () => {
      if (!data) throw new Error('Sem dados');
      if (!signature) throw new Error('Por favor, assine no campo abaixo');
      if (!name.trim()) throw new Error('Informe seu nome completo');
      const { error: rpcErr } = await (supabase as any).rpc('sign_it_support_proposal_signature_link', {
        p_token: token, p_signature: signature, p_name: name,
      });
      if (rpcErr) throw rpcErr;
    },
    onSuccess: () => {
      toast({ title: 'Aceite registrado!', description: 'Obrigado, sua assinatura foi gravada.' });
      refetch();
    },
    onError: (e: any) => toast({ title: 'Erro ao assinar', description: e.message, variant: 'destructive' }),
  });

  const handleDownload = async (template: 'modelo01' | 'modelo02') => {
    if (!data) return;
    const p = data.proposal as any;
    setDownloading(template);
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
        sections: p.sections || undefined,
        showAltatekLogo: p.show_altatek_logo ?? false,
        featuredClients: Array.isArray(p.featured_clients) ? p.featured_clients : [],
        template,
      });
    } catch (e: any) {
      toast({ title: 'Erro ao gerar PDF', description: e.message, variant: 'destructive' });
    } finally {
      setDownloading(null);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-900" /></div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center space-y-3">
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold">Link inválido</h2>
            <p className="text-gray-600">{(error as any)?.message || 'Este link não existe ou foi removido.'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { link, proposal } = data as any;
  const isExpired = new Date(link.expires_at) < new Date();
  const isSigned = !!link.signed_at;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
          <img src={delta7Logo} alt="Delta7" className="h-10" />
          <div className="text-right">
            <p className="text-xs text-gray-500">Aceite digital</p>
            <p className="text-sm font-semibold">{ROLE_LABEL[link.signer_role]}</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <FileSignature className="w-6 h-6 text-blue-900 mt-1" />
              <div className="flex-1">
                <h1 className="text-xl font-bold text-blue-900">Contrato de Suporte de TI {proposal.proposal_number}</h1>
                <p className="text-sm text-gray-600">{proposal.client_name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Mensal: <strong>{formatBRL(Number(proposal.monthly_total) || 0)}</strong> · Setup: {formatBRL(Number(proposal.setup_fee) || 0)} · Vigência {proposal.contract_months} meses · Validade {proposal.validity_days} dias
                </p>
              </div>
            </div>

            {proposal.integrity_hash && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Documento autêntico.</strong> Hash: <code className="break-all">{proposal.integrity_hash}</code>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => handleDownload('modelo01')} disabled={!!downloading}>
                {downloading === 'modelo01' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileDown className="w-4 h-4 mr-2" />}
                Baixar Modelo 01 (Premium)
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleDownload('modelo02')} disabled={!!downloading}>
                {downloading === 'modelo02' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileDown className="w-4 h-4 mr-2" />}
                Baixar Modelo 02 (Editorial)
              </Button>
            </div>
          </CardContent>
        </Card>

        {isSigned ? (
          <Card className="border-green-300 bg-green-50">
            <CardContent className="p-6 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
              <h2 className="text-lg font-bold text-green-900">Aceite registrado</h2>
              <p className="text-sm text-green-800">
                Aceito por <strong>{link.signer_name}</strong> em {new Date(link.signed_at).toLocaleString('pt-BR')}.
              </p>
            </CardContent>
          </Card>
        ) : isExpired ? (
          <Card className="border-red-300 bg-red-50">
            <CardContent className="p-6 text-center space-y-2">
              <XCircle className="w-12 h-12 text-red-600 mx-auto" />
              <h2 className="text-lg font-bold text-red-900">Link expirado</h2>
              <p className="text-sm text-red-800">Solicite um novo link ao executivo Delta7.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold text-blue-900">Sua assinatura</h3>
              <div>
                <label className="text-sm font-medium text-gray-700">Nome completo</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Digite seu nome" />
              </div>
              <SignaturePad label="Assine abaixo" value={signature} onChange={setSignature} />
              <p className="text-xs text-gray-500">
                Ao assinar, você confirma o aceite dos termos, valores e condições deste contrato. Sua assinatura, nome, data e horário ficarão registrados.
              </p>
              <Button
                type="button"
                onClick={() => signMutation.mutate()}
                disabled={signMutation.isPending}
                className="w-full bg-blue-900 hover:bg-blue-800"
              >
                {signMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Registrando...</>
                ) : (
                  <><FileSignature className="w-4 h-4 mr-2" /> Confirmar aceite</>
                )}
              </Button>
              <p className="text-xs text-center text-gray-400">
                Link válido até {new Date(link.expires_at).toLocaleString('pt-BR')}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SignItSupportProposal;
