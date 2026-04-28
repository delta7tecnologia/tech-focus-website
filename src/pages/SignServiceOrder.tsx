import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, FileSignature, CheckCircle2, XCircle, ShieldCheck, MapPin } from 'lucide-react';
import SignaturePad from '@/components/tech/reports/SignaturePad';
import delta7Logo from '@/assets/delta7-logo.png';
import QRCode from 'qrcode';

const ROLE_LABEL: Record<string, string> = {
  responsavel: 'Responsável no local',
  gestor: 'Gestor / Solicitante',
};

const SignServiceOrder = () => {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [signature, setSignature] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['sign-os-link', token],
    queryFn: async () => {
      const { data: link, error: lErr } = await supabase
        .from('service_order_signature_links')
        .select('*')
        .eq('token', token!)
        .maybeSingle();
      if (lErr) throw lErr;
      if (!link) throw new Error('Link inválido');

      const { data: os, error: oErr } = await supabase
        .from('service_orders')
        .select('*')
        .eq('id', link.service_order_id)
        .maybeSingle();
      if (oErr) throw oErr;
      if (!os) throw new Error('Ordem de serviço não encontrada');
      return { link, os };
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
      if (!signature) throw new Error('Assine no campo abaixo');
      if (!name.trim()) throw new Error('Informe seu nome completo');

      const { link, os } = data;
      const now = new Date().toISOString();

      // Atualiza OS com assinatura presencial
      const update: any = {
        signer_name: name,
        signer_role: role || os.signer_role,
        signature_data: signature,
        signed_at: now,
      };
      const { error: u1 } = await supabase.from('service_orders').update(update).eq('id', os.id);
      if (u1) throw u1;

      const { error: u2 } = await supabase
        .from('service_order_signature_links')
        .update({ signed_at: now, signature_data: signature, signer_name: name })
        .eq('id', link.id);
      if (u2) throw u2;
    },
    onSuccess: () => {
      toast({ title: 'Assinatura registrada!', description: 'Obrigado, seu aceite foi gravado.' });
      refetch();
    },
    onError: (e: any) => toast({ title: 'Erro ao assinar', description: e.message, variant: 'destructive' }),
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-900" /></div>;
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

  const { link, os } = data;
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
          <CardContent className="p-6 space-y-3">
            <div className="flex items-start gap-3">
              <FileSignature className="w-6 h-6 text-blue-900 mt-1" />
              <div>
                <h1 className="text-xl font-bold text-blue-900">Ordem de Serviço {os.os_number}</h1>
                <p className="text-sm text-gray-600">{os.client_name} • {os.client_address}</p>
                <p className="text-xs text-gray-500 mt-1">Técnico: {os.technician_name}</p>
                {os.summary && <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap">{os.summary}</p>}
              </div>
            </div>
            {os.checkin_at && (
              <div className="text-xs text-gray-600 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Check-in {new Date(os.checkin_at).toLocaleString('pt-BR')}
              </div>
            )}
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-900 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong>Documento autêntico.</strong>
                <div className="mt-1">Hash: <code className="break-all">{os.integrity_hash}</code></div>
                <a href={`/validar-os/${os.integrity_hash}`} target="_blank" rel="noopener noreferrer" className="underline mt-1 inline-block">
                  Verificar autenticidade →
                </a>
              </div>
              <QRBadge url={`${window.location.origin}/validar-os/${os.integrity_hash}`} />
            </div>
          </CardContent>
        </Card>

        {isSigned ? (
          <Card className="border-green-300 bg-green-50">
            <CardContent className="p-6 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
              <h2 className="text-lg font-bold text-green-900">Assinatura já registrada</h2>
              <p className="text-sm text-green-800">
                Assinado por <strong>{link.signer_name}</strong> em {new Date(link.signed_at).toLocaleString('pt-BR')}.
              </p>
            </CardContent>
          </Card>
        ) : isExpired ? (
          <Card className="border-red-300 bg-red-50">
            <CardContent className="p-6 text-center space-y-2">
              <XCircle className="w-12 h-12 text-red-600 mx-auto" />
              <h2 className="text-lg font-bold text-red-900">Link expirado</h2>
              <p className="text-sm text-red-800">Solicite um novo link ao técnico.</p>
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
              <div>
                <label className="text-sm font-medium text-gray-700">Cargo / Setor</label>
                <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Ex: Encarregado de obra" />
              </div>
              <SignaturePad label="Assine abaixo" value={signature} onChange={setSignature} />
              <p className="text-xs text-gray-500">
                Ao assinar, você confirma que o atendimento descrito acima foi realizado. Sua assinatura, nome, data e horário ficarão registrados.
              </p>
              <Button onClick={() => signMutation.mutate()} disabled={signMutation.isPending} className="w-full bg-blue-900 hover:bg-blue-800">
                {signMutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Registrando...</> : <><FileSignature className="w-4 h-4 mr-2" /> Confirmar assinatura</>}
              </Button>
              <p className="text-xs text-center text-gray-400">Link válido até {new Date(link.expires_at).toLocaleString('pt-BR')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const QRBadge: React.FC<{ url: string }> = ({ url }) => {
  const [src, setSrc] = useState('');
  useEffect(() => {
    QRCode.toDataURL(url, { margin: 1, width: 120, color: { dark: '#1e3a8a', light: '#ffffff' } })
      .then(setSrc).catch(() => {});
  }, [url]);
  if (!src) return null;
  return <img src={src} alt="QR validação" className="w-16 h-16 border border-blue-200 rounded bg-white p-1" />;
};

export default SignServiceOrder;
