import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Mail, 
  Calendar, 
  Package, 
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ClientAccount = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const { data: orderStats } = useQuery({
    queryKey: ['orderStats', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('payment_status')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      const stats = {
        total: data?.length || 0,
        paid: data?.filter(o => o.payment_status === 'paid').length || 0,
        pending: data?.filter(o => o.payment_status === 'pending').length || 0,
        cancelled: data?.filter(o => ['cancelled', 'expired'].includes(o.payment_status)).length || 0,
      };
      
      return stats;
    },
    enabled: !!user?.id
  });

  const statsCards = [
    { 
      label: 'Total de Pedidos', 
      value: orderStats?.total || 0, 
      icon: Package,
      color: 'text-foreground'
    },
    { 
      label: 'Pagos', 
      value: orderStats?.paid || 0, 
      icon: CheckCircle2,
      color: 'text-success'
    },
    { 
      label: 'Pendentes', 
      value: orderStats?.pending || 0, 
      icon: Clock,
      color: 'text-warning'
    },
    { 
      label: 'Cancelados', 
      value: orderStats?.cancelled || 0, 
      icon: XCircle,
      color: 'text-destructive'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Minha Conta</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações e acompanhe seus pedidos
          </p>
        </div>
      </div>

      {/* User Info Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Informações da Conta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{profile?.full_name || 'Não informado'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Membro desde</p>
                <p className="font-medium">
                  {user?.created_at 
                    ? format(new Date(user.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    : '-'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                  Conta ativa
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color} opacity-50`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Acesso Rápido</CardTitle>
          <CardDescription>
            Navegue para as principais áreas do painel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Link to="/cliente/pedidos">
              <Button 
                variant="outline" 
                className="w-full h-auto py-4 justify-between group border-border hover:bg-primary hover:text-primary-foreground"
              >
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Meus Pedidos</p>
                    <p className="text-sm opacity-70">Ver todas as compras e licenças</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/loja">
              <Button 
                variant="outline" 
                className="w-full h-auto py-4 justify-between group border-border hover:bg-primary hover:text-primary-foreground"
              >
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5" />
                  <div className="text-left">
                    <p className="font-medium">Loja</p>
                    <p className="text-sm opacity-70">Explorar mais produtos</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientAccount;
