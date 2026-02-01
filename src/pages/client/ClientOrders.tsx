import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Eye, 
  Printer, 
  Key, 
  HelpCircle, 
  Copy, 
  Check, 
  Lock,
  Package,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import OrderPdfGenerator from '@/components/client/OrderPdfGenerator';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  items: OrderItem[];
  subtotal: number;
  discount: number | null;
  total: number;
  payment_status: string;
  payment_method: string;
  notes: string | null;
  created_at: string;
}

interface License {
  id: string;
  order_id: string;
  product_id: string;
  license_key: string;
  encrypted_serial: string;
  activation_instructions: string | null;
  is_activated: boolean;
  products?: {
    name: string;
  };
}

const ClientOrders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showLicense, setShowLicense] = useState<License | null>(null);
  const [showInstructions, setShowInstructions] = useState<License | null>(null);
  const [copiedLicense, setCopiedLicense] = useState<string | null>(null);
  const [showPdfGenerator, setShowPdfGenerator] = useState<Order | null>(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['clientOrders', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []).map(order => ({
        ...order,
        items: order.items as unknown as OrderItem[]
      })) as Order[];
    },
    enabled: !!user?.id
  });

  const { data: licenses } = useQuery({
    queryKey: ['clientLicenses', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('licenses')
        .select(`
          *,
          products (name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as License[];
    },
    enabled: !!user?.id
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      pending: { variant: 'secondary', label: 'Pendente' },
      paid: { variant: 'default', label: 'Pago' },
      cancelled: { variant: 'destructive', label: 'Cancelado' },
      expired: { variant: 'destructive', label: 'Expirado' },
      refunded: { variant: 'outline', label: 'Reembolsado' },
    };
    const { variant, label } = variants[status] || { variant: 'secondary', label: status };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getProductNames = (items: OrderItem[]) => {
    return items.map(item => item.name).join(', ');
  };

  const getLicenseForOrder = (orderId: string) => {
    return licenses?.filter(l => l.order_id === orderId) || [];
  };

  const handleCopyLicense = async (licenseKey: string, licenseId: string) => {
    try {
      await navigator.clipboard.writeText(licenseKey);
      setCopiedLicense(licenseId);
      toast({
        title: 'Licença copiada!',
        description: 'A chave de licença foi copiada para a área de transferência.',
      });
      setTimeout(() => setCopiedLicense(null), 2000);
    } catch {
      toast({
        title: 'Erro ao copiar',
        description: 'Não foi possível copiar a licença.',
        variant: 'destructive'
      });
    }
  };

  const canViewLicense = (order: Order) => {
    return order.payment_status === 'paid';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Meus Pedidos</h1>
        <p className="text-muted-foreground">
          Visualize seus pedidos e acesse suas licenças de software
        </p>
      </div>

      {orders?.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum pedido encontrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Você ainda não realizou nenhuma compra.
            </p>
            <Button asChild>
              <a href="/loja">Explorar Produtos</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Histórico de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Pedido ID</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.map((order) => (
                    <TableRow key={order.id} className="border-border">
                      <TableCell className="font-mono text-sm">
                        {order.id.slice(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {getProductNames(order.items)}
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.payment_status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                            title="Ver pedido"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowPdfGenerator(order)}
                            title="Imprimir PDF"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          {canViewLicense(order) ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const orderLicenses = getLicenseForOrder(order.id);
                                if (orderLicenses.length > 0) {
                                  setShowLicense(orderLicenses[0]);
                                }
                              }}
                              title="Ver código"
                              className="text-primary hover:text-primary"
                            >
                              <Key className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled
                              title="Pagamento pendente"
                            >
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const orderLicenses = getLicenseForOrder(order.id);
                              if (orderLicenses.length > 0) {
                                setShowInstructions(orderLicenses[0]);
                              }
                            }}
                            title="Como ativar"
                          >
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Order Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido</DialogTitle>
            <DialogDescription>
              Pedido #{selectedOrder?.id.slice(0, 8).toUpperCase()}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedOrder.customer_email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium">
                    {format(new Date(selectedOrder.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedOrder.payment_status)}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-2">Produtos</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span>{item.name} x{item.quantity}</span>
                      <span className="font-medium">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>R$ {selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                {selectedOrder.discount && selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Desconto</span>
                    <span>- R$ {selectedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>R$ {selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground">Observações</p>
                  <p className="mt-1">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View License Dialog */}
      <Dialog open={!!showLicense} onOpenChange={() => setShowLicense(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Chave de Licença
            </DialogTitle>
            <DialogDescription>
              {showLicense?.products?.name}
            </DialogDescription>
          </DialogHeader>
          {showLicense && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-2 bg-warning/10 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <p className="text-sm text-warning">
                  Não compartilhe esta chave. Ela é única para sua compra.
                </p>
              </div>

              <div className="relative">
                <div className="p-4 bg-muted rounded-lg font-mono text-sm break-all">
                  {showLicense.license_key}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopyLicense(showLicense.license_key, showLicense.id)}
                >
                  {copiedLicense === showLicense.id ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  setShowLicense(null);
                  setShowInstructions(showLicense);
                }}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Ver Instruções de Ativação
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Activation Instructions Dialog */}
      <Dialog open={!!showInstructions} onOpenChange={() => setShowInstructions(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Como Ativar
            </DialogTitle>
            <DialogDescription>
              Instruções de ativação para {showInstructions?.products?.name}
            </DialogDescription>
          </DialogHeader>
          {showInstructions && (
            <div className="space-y-4">
              {showInstructions.activation_instructions ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div 
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ 
                      __html: showInstructions.activation_instructions 
                    }} 
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="font-medium">Passos para ativação:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Abra o software instalado em seu computador</li>
                    <li>Acesse o menu de ativação ou registro</li>
                    <li>Cole a chave de licença quando solicitado</li>
                    <li>Clique em "Ativar" e aguarde a confirmação</li>
                    <li>Reinicie o software se necessário</li>
                  </ol>
                  <p className="text-sm text-muted-foreground mt-4">
                    Em caso de dúvidas, entre em contato com nosso suporte.
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* PDF Generator */}
      {showPdfGenerator && (
        <OrderPdfGenerator 
          order={showPdfGenerator} 
          onClose={() => setShowPdfGenerator(null)} 
        />
      )}
    </div>
  );
};

export default ClientOrders;
