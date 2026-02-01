import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, ArrowRight, Star } from 'lucide-react';
import { useCartContext } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';

const FeaturedProducts = () => {
  const { addItem } = useCartContext();
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

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

  if (isLoading || !products || products.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-blue-100 text-blue-700 border-none mb-4">
            <Star className="w-3 h-3 mr-1" />
            Loja Online
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Produtos em <span className="text-blue-600">Destaque</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Confira nossas soluções em licenciamento, software e serviços de TI
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-300" />
                  </div>
                )}
                {product.price && (
                  <Badge className="absolute bottom-2 left-2 bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg">
                    R$ {product.price.toFixed(2)}
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                {product.short_description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {product.short_description}
                  </p>
                )}
                <Button 
                  size="sm"
                  className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.price}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Comprar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/loja">
              Ver Todos os Produtos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
