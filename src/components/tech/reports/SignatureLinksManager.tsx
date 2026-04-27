import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Link2, Loader2, Trash2, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface Props {
  reportId: string;
}

const ROLE_LABEL: Record<string, string> = { cliente: 'Cliente', gestor: 'Gestor' };

const generateToken = () => {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
};

const SignatureLinksManager: React.FC<Props> = ({ reportId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [signerRole, setSignerRole] = useState<'cliente' | 'gestor'>('cliente');

  const { data: links = [], isLoading } = useQuery({
    queryKey: ['signature-links', reportId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_signature_links')
        .select('*')
        .eq('report_id', reportId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!reportId,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Não autenticado');
      const token = generateToken();
      const { error } = await supabase.from('report_signature_links').insert({
        report_id: reportId,
        token,
        signer_role: signerRole,
        signer_name: signerName || null,
        signer_email: signerEmail || null,
        created_by: user.id,
      });
      if (error) throw error;
      return token;
    },
    onSuccess: (token) => {
      const url = `${window.location.origin}/assinar/${token}`;
      navigator.clipboard?.writeText(url).catch(() => {});
      toast({ title: 'Link gerado e copiado!', description: 'Cole no WhatsApp ou e-mail do signatário.' });
      setSignerName('');
      setSignerEmail('');
      qc.invalidateQueries({ queryKey: ['signature-links', reportId] });
    },
    onError: (e: any) => toast({ title: 'Erro', description: e.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('report_signature_links').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Link removido' });
      qc.invalidateQueries({ queryKey: ['signature-links', reportId] });
    },
  });

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/assinar/${token}`;
    navigator.clipboard?.writeText(url);
    toast({ title: 'Link copiado!' });
  };

  const getStatus = (link: any) => {
    if (link.signed_at) return { label: 'Assinado', icon: CheckCircle2, color: 'bg-green-100 text-green-800' };
    if (new Date(link.expires_at) < new Date()) return { label: 'Expirado', icon: XCircle, color: 'bg-red-100 text-red-800' };
    return { label: 'Pendente', icon: Clock, color: 'bg-amber-100 text-amber-800' };
  };

  return (
    <Card className="border-blue-200">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-blue-900" />
          <h4 className="font-semibold text-blue-900">Links de assinatura remota</h4>
        </div>
        <p className="text-xs text-gray-600">
          Gere um link único (válido por 7 dias) para Cliente ou Gestor assinar sem precisar fazer login. Copie e envie via WhatsApp ou e-mail.
        </p>

        <div className="grid sm:grid-cols-4 gap-2">
          <select
            value={signerRole}
            onChange={(e) => setSignerRole(e.target.value as any)}
            className="h-9 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="cliente">Cliente</option>
            <option value="gestor">Gestor</option>
          </select>
          <Input placeholder="Nome (opcional)" value={signerName} onChange={(e) => setSignerName(e.target.value)} className="h-9" />
          <Input placeholder="E-mail (opcional)" value={signerEmail} onChange={(e) => setSignerEmail(e.target.value)} className="h-9" />
          <Button
            type="button"
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            className="bg-blue-900 hover:bg-blue-800 h-9"
          >
            {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Link2 className="w-4 h-4 mr-2" />Gerar link</>}
          </Button>
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500">Carregando...</p>
        ) : links.length === 0 ? (
          <p className="text-sm text-gray-500 italic">Nenhum link de assinatura gerado.</p>
        ) : (
          <div className="border rounded-md divide-y">
            {links.map((link: any) => {
              const status = getStatus(link);
              const StatusIcon = status.icon;
              return (
                <div key={link.id} className="p-3 flex flex-wrap items-center gap-3 text-sm">
                  <Badge variant="outline">{ROLE_LABEL[link.signer_role]}</Badge>
                  <span className="font-medium text-gray-900">{link.signer_name || '—'}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${status.color}`}>
                    <StatusIcon className="w-3 h-3" /> {status.label}
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {link.signed_at
                      ? `Assinou ${new Date(link.signed_at).toLocaleString('pt-BR')}`
                      : `Expira ${new Date(link.expires_at).toLocaleDateString('pt-BR')}`}
                  </span>
                  {!link.signed_at && (
                    <Button type="button" size="sm" variant="outline" onClick={() => copyLink(link.token)}>
                      <Copy className="w-3 h-3 mr-1" /> Copiar
                    </Button>
                  )}
                  <Button type="button" size="sm" variant="ghost" onClick={() => deleteMutation.mutate(link.id)}>
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SignatureLinksManager;
