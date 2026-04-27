import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, FileSignature, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import SignaturePad from '@/components/tech/reports/SignaturePad';
import {
  appendSignatureHistory,
  normalizeSignatureHistory,
  formatSignatureDate,
} from '@/utils/reportSignatures';
import delta7Logo from '@/assets/delta7-logo.png';

const ROLE_LABEL: Record<string, string> = { cliente: 'Cliente', gestor: 'Gestor / Supervisor' };

const SignReport = () => {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [signature, setSignature] = useState('');
  const [name, setName] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['sign-link', token],
    queryFn: async () => {
      const { data: link, error: linkErr } = await supabase
        .from('report_signature_links')
        .select('*')
        .eq('token', token!)
        .maybeSingle();
      if (linkErr) throw linkErr;
      if (!link) throw new Error('Link inválido');

      const { data: report, error: rErr } = await supabase
        .from('technical_reports')
        .select('*')
        .eq('id', link.report_id)
        .maybeSingle();
      if (rErr) throw rErr;
      if (!report) throw new Error('Laudo não encontrado');
      return { link, report };
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

      const { link, report } = data;
      const now = new Date().toISOString();

      // 1. Update report form_data with signature in correct field
      const formData = (report.form_data || {}) as any;
      const signatures = formData.signatures || {};
      const updatedSignatures = { ...signatures };

      if (link.signer_role === 'cliente') {
        updatedSignatures.assinaturaUsuario = signature;
        updatedSignatures.usuarioNome = name;
      } else if (link.signer_role === 'gestor') {
        updatedSignatures.assinaturaGestor = signature;
        updatedSignatures.gestorNome = name;
      }

      const existingHistory = normalizeSignatureHistory(report.signature_history);
      const nextHistory = appendSignatureHistory({
        previousForm: signatures,
        nextForm: updatedSignatures,
        existingHistory,
        reportNumber: report.report_number,
        signedAt: now,
        technicianName: report.technician_name,
        previousHash: report.integrity_hash,
        nextHash: report.integrity_hash,
      });

      const { error: updErr } = await supabase
        .from('technical_reports')
        .update({
          form_data: { ...formData, signatures: updatedSignatures } as any,
          signature_history: nextHistory as any,
          updated_at: now,
        })
        .eq('id', report.id);
      if (updErr) throw updErr;

      // 2. Mark link as signed
      const { error: linkErr } = await supabase
        .from('report_signature_links')
        .update({
          signature_data: signature,
          signed_at: now,
          signer_name: name,
        })
        .eq('id', link.id);
      if (linkErr) throw linkErr;
    },
    onSuccess: () => {
      toast({ title: 'Assinatura registrada!', description: 'Obrigado, seu aceite foi gravado com sucesso.' });
      refetch();
    },
    onError: (e: any) => toast({ title: 'Erro ao assinar', description: e.message, variant: 'destructive' }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
      </div>
    );
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

  const { link, report } = data;
  const isExpired = new Date(link.expires_at) < new Date();
  const isSigned = !!link.signed_at;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
          <img src={delta7Logo} alt="Delta7" className="h-10" />
          <div className="text-right">
            <p className="text-xs text-gray-500">Assinatura digital</p>
            <p className="text-sm font-semibold">{ROLE_LABEL[link.signer_role]}</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <FileSignature className="w-6 h-6 text-blue-900 mt-1" />
              <div>
                <h1 className="text-xl font-bold text-blue-900">Laudo Técnico {report.report_number}</h1>
                <p className="text-sm text-gray-600">{report.company_name} • {report.equipment}</p>
                <p className="text-xs text-gray-500 mt-1">Técnico: {report.technician_name}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Documento autêntico.</strong> Hash de integridade: <code className="break-all">{report.integrity_hash}</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {isSigned ? (
          <Card className="border-green-300 bg-green-50">
            <CardContent className="p-6 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
              <h2 className="text-lg font-bold text-green-900">Assinatura já registrada</h2>
              <p className="text-sm text-green-800">
                Assinado por <strong>{link.signer_name}</strong> em {formatSignatureDate(link.signed_at)}.
              </p>
            </CardContent>
          </Card>
        ) : isExpired ? (
          <Card className="border-red-300 bg-red-50">
            <CardContent className="p-6 text-center space-y-2">
              <XCircle className="w-12 h-12 text-red-600 mx-auto" />
              <h2 className="text-lg font-bold text-red-900">Link expirado</h2>
              <p className="text-sm text-red-800">Solicite um novo link ao técnico responsável.</p>
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
                Ao assinar, você confirma a leitura e o aceite das informações deste laudo. Sua assinatura, nome, data e horário ficarão registrados.
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
                  <><FileSignature className="w-4 h-4 mr-2" /> Confirmar assinatura</>
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

export default SignReport;
