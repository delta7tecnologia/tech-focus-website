import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageTransition from '@/components/PageTransition';

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
    <PageTransition>
      <div className="min-h-screen">
        <SEOHead
          title="Depoimentos de Clientes | Delta7 Tecnologia"
          description="Veja o que nossos clientes falam sobre os serviços da Delta7 Tecnologia. Mais de 50 avaliações positivas no Google com nota 4.9/5."
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Delta7 Tecnologia",
            url: "https://delta7tecnologia.com.br",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              bestRating: "5",
              ratingCount: Math.max(testimonials.length, 50),
            },
            review: testimonials.slice(0, 10).map((t: any) => ({
              "@type": "Review",
              author: { "@type": "Person", name: t.client_name || "Cliente" },
              reviewRating: { "@type": "Rating", ratingValue: t.rating || 5, bestRating: 5 },
              reviewBody: t.content || "",
            })),
          }}
        />
        <Navigation />

        {/* Hero */}
        <section className="pt-24 pb-12 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Depoimentos dos Nossos Clientes</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Veja o que nossos clientes falam sobre nossos serviços e como transformamos a tecnologia de suas empresas
            </p>
          </div>
        </section>

        <Breadcrumbs items={[{ label: 'Depoimentos' }]} />

        {/* Testimonials */}
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

            {/* Google Reviews */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white text-center">
              <h2 className="text-3xl font-bold mb-6">Avaliações Google</h2>
              <div className="flex items-center justify-center mb-6">
                <div className="flex mr-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-8 w-8 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-3xl font-bold">4.9/5</span>
              </div>
              <p className="text-blue-100 mb-8 text-lg">Mais de 50 avaliações positivas no Google Maps</p>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <a href="https://maps.app.goo.gl/5RbmwEGGWdrSRcqVA" target="_blank" rel="noopener noreferrer">
                  <Star className="mr-2 h-5 w-5" />
                  Ver Todas as Avaliações no Google
                </a>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
        <WhatsAppButton />
      </div>
    </PageTransition>
  );
};

export default Depoimentos;
