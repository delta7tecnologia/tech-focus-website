import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartContext } from '@/contexts/CartContext';
import { ShoppingCart, Package, Star, Shield, Truck, CreditCard, Search, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Loja = () => {
  const { addItem, setIsOpen } = useCartContext();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price || 0,
      image_url: product.image_url,
      description: product.short_description,
    });
    toast({
      title: '✓ Adicionado ao carrinho!',
      description: product.name,
    });
  };

  const handleBuyNow = (product: any) => {
    handleAddToCart(product);
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      
      {/* Hero Banner */}
      <section className="pt-20 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white border-none mb-4">
              🛒 Loja Oficial
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Produtos & Serviços
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Soluções em tecnologia para impulsionar seu negócio. Qualidade garantida e suporte especializado.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 bg-white text-gray-900 border-none rounded-full shadow-lg"
              />
            </div>
          </div>
        </div>
        
        {/* Trust Badges */}
        <div className="bg-blue-900/30 py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span>Compra Segura</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-400" />
                <span>Entrega Rápida</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-400" />
                <span>PIX, Cartão ou Boleto</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>Suporte Especializado</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="py-12">
        <div className="container mx-auto px-4">
          {/* Results Count */}
          {!isLoading && (
            <p className="text-muted-foreground mb-6">
              {filteredProducts?.length || 0} produto(s) encontrado(s)
              {searchTerm && ` para "${searchTerm}"`}
            </p>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse overflow-hidden">
                  <div className="h-56 bg-gray-200" />
                  <CardContent className="p-5">
                    <div className="h-5 bg-gray-200 rounded mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                    <div className="h-8 bg-gray-200 rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts?.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">
                {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum produto disponível'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? 'Tente buscar por outro termo' : 'Em breve teremos novidades!'}
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Limpar busca
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts?.map((product) => (
                <Card 
                  key={product.id} 
                  className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white"
                >
                  {/* Image Container */}
                  <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-20 h-20 text-gray-300" />
                      </div>
                    )}
                    
                    {/* Quick View Button */}
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white"
                    >
                      <Eye className="w-5 h-5 text-gray-700" />
                    </button>

                    {/* Price Badge */}
                    {product.price && (
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-green-500 hover:bg-green-600 text-white text-lg px-3 py-1 font-bold shadow-lg">
                          R$ {product.price.toFixed(2)}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    {product.short_description && (
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                        {product.short_description}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.price}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Carrinho
                      </Button>
                      <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleBuyNow(product)}
                        disabled={!product.price}
                      >
                        Comprar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Product Quick View Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {selectedProduct?.image_url ? (
                <img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-20 h-20 text-gray-300" />
                </div>
              )}
            </div>
            
            <div className="flex flex-col">
              {selectedProduct?.price && (
                <p className="text-3xl font-bold text-green-600 mb-4">
                  R$ {selectedProduct.price.toFixed(2)}
                </p>
              )}
              
              {selectedProduct?.short_description && (
                <p className="text-muted-foreground mb-2">
                  {selectedProduct.short_description}
                </p>
              )}
              
              {selectedProduct?.description && (
                <p className="text-sm text-gray-600 mb-6 flex-1">
                  {selectedProduct.description}
                </p>
              )}

              <div className="space-y-3">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                  onClick={() => {
                    handleBuyNow(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  disabled={!selectedProduct?.price}
                >
                  Comprar Agora
                </Button>
                <Button 
                  variant="outline"
                  className="w-full h-12"
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  disabled={!selectedProduct?.price}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Adicionar ao Carrinho
                </Button>
              </div>

              <div className="mt-6 pt-4 border-t space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Compra 100% segura</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-500" />
                  <span>PIX, Cartão de Crédito ou Boleto</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Loja;
