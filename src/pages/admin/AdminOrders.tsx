import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingBag, Eye, Package, CreditCard, QrCode, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_tax_id: string | null;
  customer_phone: string | null;
  payment_method: string;
  payment_status: string;
  payment_id: string | null;
  payment_url: string | null;
  subtotal: number;
  discount: number;
  total: number;
  items: any[];
  notes: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  paid: { label: 'Pago', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  failed: { label: 'Falhou', color: 'bg-red-100 text-red-800', icon: XCircle },
  cancelled: { label: 'Cancelado', color: 'bg-gray-100 text-gray-800', icon: XCircle },
  refunded: { label: 'Reembolsado', color: 'bg-purple-100 text-purple-800', icon: AlertCircle },
};

const paymentMethodIcons: Record<string, any> = {
  PIX: QrCode,
  CREDIT_CARD: CreditCard,
  BOLETO: FileText,
};

const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (statusFilter !== 'all') {
        query = query.eq('payment_status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Order[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ title: 'Status atualizado!' });
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao atualizar', description: error.message, variant: 'destructive' });
    },
  });

  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter(o => o.payment_status === 'pending').length || 0,
    paid: orders?.filter(o => o.payment_status === 'paid').length || 0,
    revenue: orders?.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + Number(o.total), 0) || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pedidos</h2>
          <p className="text-gray-500">Gerencie os pedidos da loja</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pagos</p>
                <p className="text-2xl font-bold">{stats.paid}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Faturamento</p>
                <p className="text-2xl font-bold">R$ {stats.revenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="paid">Pagos</SelectItem>
            <SelectItem value="failed">Falhados</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
            <SelectItem value="refunded">Reembolsados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <Card><CardContent className="py-12 text-center">Carregando...</CardContent></Card>
      ) : orders?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum pedido encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="w-20">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => {
                const status = statusConfig[order.payment_status] || statusConfig.pending;
                const PaymentIcon = paymentMethodIcons[order.payment_method] || CreditCard;
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <PaymentIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{order.payment_method}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={status.color}>
                        <status.icon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      R$ {Number(order.total).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(order.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Cliente</h4>
                  <p className="text-sm">{selectedOrder.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.customer_email}</p>
                  {selectedOrder.customer_phone && (
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer_phone}</p>
                  )}
                  {selectedOrder.customer_tax_id && (
                    <p className="text-sm text-muted-foreground">CPF: {selectedOrder.customer_tax_id}</p>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Pagamento</h4>
                  <p className="text-sm">Método: {selectedOrder.payment_method}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm">Status:</span>
                    <Select
                      value={selectedOrder.payment_status}
                      onValueChange={(value) => {
                        updateStatusMutation.mutate({ id: selectedOrder.id, status: value });
                        setSelectedOrder({ ...selectedOrder, payment_status: value });
                      }}
                    >
                      <SelectTrigger className="h-8 w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="paid">Pago</SelectItem>
                        <SelectItem value="failed">Falhou</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                        <SelectItem value="refunded">Reembolsado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedOrder.payment_url && (
                    <a
                      href={selectedOrder.payment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline mt-1 block"
                    >
                      Ver link de pagamento
                    </a>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold mb-2">Itens</h4>
                <div className="border rounded-lg divide-y">
                  {(selectedOrder.items as any[]).map((item, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>R$ {Number(selectedOrder.subtotal).toFixed(2)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto</span>
                    <span>- R$ {Number(selectedOrder.discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>R$ {Number(selectedOrder.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
