import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCartContext } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, ArrowLeft, CreditCard, ShoppingBag, Package, 
  Shield, Lock, QrCode, FileText, CheckCircle2, Minus, Plus, Trash2 
} from 'lucide-react';

type PaymentMethod = 'PIX' | 'BOLETO';

const Checkout = () => {
  const { items, total, clearCart, updateQuantity, removeItem } = useCartContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    taxId: '',
    cellphone: '',
  });

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0, 14);
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  };

  const paymentMethodLabels = {
    PIX: { name: 'PIX', description: 'Aprovação instantânea', icon: QrCode, discount: '5% de desconto' },
    BOLETO: { name: 'Boleto Bancário', description: 'Vencimento em 3 dias', icon: FileText, discount: null },
  };

  const getTotal = () => {
    if (paymentMethod === 'PIX') {
      return total * 0.95; // 5% discount
    }
    return total;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione produtos ao carrinho antes de finalizar',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('abacatepay-checkout', {
        body: {
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            description: item.description || item.name,
          })),
          customer: {
            name: formData.name,
            email: formData.email,
            taxId: formData.taxId,
            cellphone: formData.cellphone,
          },
          paymentMethod: paymentMethod,
          returnUrl: `${window.location.origin}/loja`,
          completionUrl: `${window.location.origin}/pagamento-sucesso`,
        },
      });

      if (error) throw error;
      
      if (data?.checkoutUrl) {
        clearCart();
        window.location.href = data.checkoutUrl;
      } else if (data?.billing?.url) {
        clearCart();
        window.location.href = data.billing.url;
      } else {
        throw new Error('URL de checkout não retornada');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: 'Erro ao processar pagamento',
        description: error.message || 'Tente novamente mais tarde',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-2xl text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Adicione produtos ao carrinho para continuar com a compra
            </p>
            <Button size="lg" onClick={() => navigate('/loja')} className="bg-blue-600 hover:bg-blue-700">
              Explorar Produtos
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <Button 
            variant="ghost" 
            className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/loja')}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a loja
          </Button>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">1</div>
              <span className="text-sm font-medium hidden sm:inline">Carrinho</span>
            </div>
            <div className="w-12 h-0.5 bg-blue-600"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">2</div>
              <span className="text-sm font-medium hidden sm:inline">Pagamento</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium">3</div>
              <span className="text-sm text-muted-foreground hidden sm:inline">Confirmação</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-8 text-center">Finalizar Compra</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Cart Items & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cart Items */}
              <Card className="border-0 shadow-md">
                <CardHeader className="border-b bg-gray-50/50">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                    Itens do Pedido ({items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {items.map((item, index) => (
                    <div key={item.id}>
                      <div className="p-4 flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{item.name}</h4>
                          {item.description && (
                            <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                          )}
                          <p className="text-blue-600 font-semibold mt-1">
                            R$ {item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <button
                              className="w-8 h-8 flex items-center justify-center hover:bg-white rounded transition-colors"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              className="w-8 h-8 flex items-center justify-center hover:bg-white rounded transition-colors"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                            Remover
                          </button>
                        </div>
                      </div>
                      {index < items.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card className="border-0 shadow-md">
                <CardHeader className="border-b bg-gray-50/50">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Forma de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                    <div className="space-y-3">
                      {(Object.keys(paymentMethodLabels) as PaymentMethod[]).map((method) => {
                        const { name, description, icon: Icon, discount } = paymentMethodLabels[method];
                        const isSelected = paymentMethod === method;
                        return (
                          <label
                            key={method}
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-blue-600 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <RadioGroupItem value={method} className="text-blue-600" />
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{name}</span>
                                {discount && (
                                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                    {discount}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{description}</p>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="w-6 h-6 text-blue-600" />
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Customer Data */}
              <Card className="border-0 shadow-md">
                <CardHeader className="border-b bg-gray-50/50">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Seus Dados
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium">Nome Completo *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          placeholder="Seu nome completo"
                          className="mt-1.5 h-11"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          placeholder="seu@email.com"
                          className="mt-1.5 h-11"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="taxId" className="text-sm font-medium">CPF *</Label>
                        <Input
                          id="taxId"
                          value={formData.taxId}
                          onChange={(e) => setFormData({ ...formData, taxId: formatCPF(e.target.value) })}
                          required
                          placeholder="000.000.000-00"
                          maxLength={14}
                          className="mt-1.5 h-11"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cellphone" className="text-sm font-medium">Telefone</Label>
                        <Input
                          id="cellphone"
                          value={formData.cellphone}
                          onChange={(e) => setFormData({ ...formData, cellphone: formatPhone(e.target.value) })}
                          placeholder="(00) 00000-0000"
                          maxLength={15}
                          className="mt-1.5 h-11"
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-md sticky top-24">
                <CardHeader className="border-b bg-gray-50/50">
                  <CardTitle className="text-lg">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({items.length} itens)</span>
                      <span>R$ {total.toFixed(2)}</span>
                    </div>
                    
                    {paymentMethod === 'PIX' && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Desconto PIX (5%)</span>
                        <span>- R$ {(total * 0.05).toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frete</span>
                      <span className="text-green-600">Grátis</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">R$ {getTotal().toFixed(2)}</span>
                    </div>

                  </div>

                  <Button 
                    type="submit"
                    form="checkout-form"
                    className="w-full mt-6 h-14 text-lg bg-green-600 hover:bg-green-700" 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Pagar R$ {getTotal().toFixed(2)}
                      </>
                    )}
                  </Button>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>Seus dados estão protegidos</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Lock className="w-4 h-4 text-green-500" />
                      <span>Pagamento 100% seguro</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <p className="text-xs text-center text-muted-foreground">
                    Pagamento processado com segurança via<br />
                    <strong className="text-foreground">AbacatePay</strong>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
