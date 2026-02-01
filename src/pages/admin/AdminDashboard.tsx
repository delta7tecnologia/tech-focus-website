import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Package, Settings, Link as LinkIcon, HelpCircle, Plus, ExternalLink, Building2, ShoppingBag, CreditCard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const { data: testimonialCount } = useQuery({
    queryKey: ['admin-testimonials-count'],
    queryFn: async () => {
      const { count } = await supabase.from('testimonials').select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: productCount } = useQuery({
    queryKey: ['admin-products-count'],
    queryFn: async () => {
      const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: serviceCount } = useQuery({
    queryKey: ['admin-services-count'],
    queryFn: async () => {
      const { count } = await supabase.from('services').select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: linkCount } = useQuery({
    queryKey: ['admin-links-count'],
    queryFn: async () => {
      const { count } = await supabase.from('useful_links').select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: faqCount } = useQuery({
    queryKey: ['admin-faqs-count'],
    queryFn: async () => {
      const { count } = await supabase.from('faqs').select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: clientCount } = useQuery({
    queryKey: ['admin-clients-count'],
    queryFn: async () => {
      const { count } = await supabase.from('clients').select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: orderCount } = useQuery({
    queryKey: ['admin-orders-count'],
    queryFn: async () => {
      const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: pendingOrderCount } = useQuery({
    queryKey: ['admin-pending-orders-count'],
    queryFn: async () => {
      const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true }).eq('payment_status', 'pending');
      return count || 0;
    }
  });

  const stats = [
    { name: 'Pedidos', count: orderCount, icon: ShoppingBag, color: 'bg-emerald-500', path: '/admin/pedidos' },
    { name: 'Pendentes', count: pendingOrderCount, icon: CreditCard, color: 'bg-amber-500', path: '/admin/pedidos' },
    { name: 'Avaliações', count: testimonialCount, icon: Star, color: 'bg-yellow-500', path: '/admin/avaliacoes' },
    { name: 'Produtos', count: productCount, icon: Package, color: 'bg-blue-500', path: '/admin/produtos' },
    { name: 'Serviços', count: serviceCount, icon: Settings, color: 'bg-green-500', path: '/admin/servicos' },
    { name: 'Clientes', count: clientCount, icon: Building2, color: 'bg-cyan-500', path: '/admin/clientes' },
    { name: 'Links Úteis', count: linkCount, icon: LinkIcon, color: 'bg-purple-500', path: '/admin/links' },
    { name: 'FAQs', count: faqCount, icon: HelpCircle, color: 'bg-orange-500', path: '/admin/faq' },
  ];

  const quickActions = [
    { name: 'Ver Pedidos', description: 'Acompanhe os pedidos da loja', icon: ShoppingBag, path: '/admin/pedidos' },
    { name: 'Adicionar Avaliação', description: 'Cadastre uma nova avaliação de cliente', icon: Star, path: '/admin/avaliacoes' },
    { name: 'Novo Produto', description: 'Adicione um novo produto ao catálogo', icon: Package, path: '/admin/produtos' },
    { name: 'Novo Serviço', description: 'Cadastre um novo serviço oferecido', icon: Settings, path: '/admin/servicos' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500">Bem-vindo ao painel administrativo da Delta7 Tecnologia</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        {stats.map((stat) => (
          <Link key={stat.name} to={stat.path}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.count ?? 0}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Card key={action.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <action.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{action.name}</h4>
                <p className="text-sm text-gray-500 mb-4">{action.description}</p>
                <Button asChild variant="outline" size="sm">
                  <Link to={action.path}>
                    <Plus className="w-4 h-4 mr-1" />
                    Acessar
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dicas de Uso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p>• Use o menu lateral para navegar entre as seções</p>
          <p>• Itens marcados como "Ativo" aparecem automaticamente no site</p>
          <p>• As FAQs são exibidas na página inicial na seção de perguntas frequentes</p>
          <p>• Os Links Úteis aparecem na seção dedicada do site</p>
          <p>• O botão de WhatsApp em cada produto leva diretamente para o atendimento</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
