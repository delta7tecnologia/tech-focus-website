import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Depoimentos = () => {
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials-page'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <img 
                src="/lovable-uploads/960d4398-2d86-492b-8415-3fe19e4f9f38.png" 
                alt="Delta7 Tecnologia"
                className="h-12 w-auto"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Depoimentos dos
            <span className="block bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">
              Nossos Clientes
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Veja o que nossos clientes falam sobre nossos serviços e como transformamos a tecnologia de suas empresas
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Carregando avaliações...</div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Nenhuma avaliação disponível no momento.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="mb-6">
                      <Quote className="h-8 w-8 text-blue-600 mb-4" />
                      <p className="text-gray-600 italic leading-relaxed">{testimonial.content}</p>
                    </div>
                    <div className="border-t pt-4">
                      <p className="font-semibold text-gray-900">{testimonial.client_name}</p>
                      {testimonial.company && <p className="text-gray-500 text-sm">{testimonial.company}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Google Reviews Section */}
          <div className="bg-gradient-to-r from-blue-600 to-red-500 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Avaliações Google</h2>
            <div className="flex items-center justify-center mb-6">
              <div className="flex mr-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-8 w-8 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-3xl font-bold">4.9/5</span>
            </div>
            <p className="text-blue-100 mb-8 text-lg">
              Mais de 50 avaliações positivas no Google Maps
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <a href="https://maps.app.goo.gl/5RbmwEGGWdrSRcqVA" target="_blank" rel="noopener noreferrer">
                <Star className="mr-2 h-5 w-5" />
                Ver Todas as Avaliações no Google
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Depoimentos;
