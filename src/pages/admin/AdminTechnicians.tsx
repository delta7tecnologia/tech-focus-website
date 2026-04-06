import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserCheck, UserX, Users } from 'lucide-react';

const AdminTechnicians = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['admin-technicians'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestão de Técnicos</h2>
        <p className="text-gray-500">Aprove ou revogue o acesso de técnicos à área restrita</p>
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
                <div className="flex items-center justify-between">
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
                  <div>
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
    </div>
  );
};

export default AdminTechnicians;
