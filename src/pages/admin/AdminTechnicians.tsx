import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { UserCheck, UserX, Users, Pencil, KeyRound, Eye, EyeOff } from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  is_approved: boolean;
  created_at: string;
}

const AdminTechnicians = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [editProfile, setEditProfile] = useState<Profile | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const [resetProfile, setResetProfile] = useState<Profile | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['admin-technicians'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Profile[];
    },
  });

  const toggleApproval = useMutation({
    mutationFn: async ({ userId, approved }: { userId: string; approved: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_approved: approved })
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: (_, { approved }) => {
      queryClient.invalidateQueries({ queryKey: ['admin-technicians'] });
      toast({ title: approved ? 'Técnico aprovado!' : 'Acesso revogado!' });
    },
    onError: (error: any) => {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    },
  });

  const updateProfile = useMutation({
    mutationFn: async ({ userId, full_name, email }: { userId: string; full_name: string; email: string }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name, email })
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-technicians'] });
      toast({ title: 'Perfil atualizado!' });
      setEditProfile(null);
    },
    onError: (error: any) => {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
    },
  });

  const handleResetPassword = async () => {
    if (!resetProfile || !newPassword) return;
    if (newPassword.length < 6) {
      toast({ title: 'Erro', description: 'A senha deve ter pelo menos 6 caracteres.', variant: 'destructive' });
      return;
    }

    setResettingPassword(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke('admin-reset-password', {
        body: { user_id: resetProfile.user_id, new_password: newPassword },
      });

      if (res.error) throw new Error(res.error.message || 'Erro ao redefinir senha');
      if (res.data?.error) throw new Error(res.data.error);

      toast({ title: 'Senha redefinida com sucesso!' });
      setResetProfile(null);
      setNewPassword('');
      setShowPassword(false);
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    } finally {
      setResettingPassword(false);
    }
  };

  const openEdit = (p: Profile) => {
    setEditName(p.full_name || '');
    setEditEmail(p.email);
    setEditProfile(p);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestão de Técnicos</h2>
        <p className="text-gray-500">Aprove, edite ou redefina senhas dos técnicos</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : !profiles?.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum técnico cadastrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {profiles.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{p.full_name || 'Sem nome'}</span>
                      <Badge variant={p.is_approved ? 'default' : 'secondary'}>
                        {p.is_approved ? 'Aprovado' : 'Pendente'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{p.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Cadastrado em {new Date(p.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(p)}
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setResetProfile(p); setNewPassword(''); setShowPassword(false); }}
                    >
                      <KeyRound className="w-4 h-4 mr-1" /> Senha
                    </Button>
                    {p.is_approved ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => toggleApproval.mutate({ userId: p.user_id, approved: false })}
                        disabled={toggleApproval.isPending}
                      >
                        <UserX className="w-4 h-4 mr-1" /> Revogar
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => toggleApproval.mutate({ userId: p.user_id, approved: true })}
                        disabled={toggleApproval.isPending}
                      >
                        <UserCheck className="w-4 h-4 mr-1" /> Aprovar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editProfile} onOpenChange={(open) => !open && setEditProfile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Técnico</DialogTitle>
            <DialogDescription>Altere os dados do perfil do técnico.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProfile(null)}>Cancelar</Button>
            <Button
              onClick={() => editProfile && updateProfile.mutate({ userId: editProfile.user_id, full_name: editName, email: editEmail })}
              disabled={updateProfile.isPending}
            >
              {updateProfile.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!resetProfile} onOpenChange={(open) => !open && setResetProfile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redefinir Senha</DialogTitle>
            <DialogDescription>
              Defina uma nova senha para <strong>{resetProfile?.full_name || resetProfile?.email}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label>Nova Senha</Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetProfile(null)}>Cancelar</Button>
            <Button onClick={handleResetPassword} disabled={resettingPassword || !newPassword}>
              {resettingPassword ? 'Redefinindo...' : 'Redefinir Senha'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTechnicians;
