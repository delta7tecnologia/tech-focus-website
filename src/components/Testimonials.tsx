import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Testimonials = () => {
  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(4);
      if (error) throw error;
      return data;
    }
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">
            Depoimentos
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mt-2 mb-4">
            O que nossos <span className="text-cyan-400">clientes</span> dizem
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A satisfação dos nossos clientes é o nosso maior indicador de sucesso
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div 
          className="flex flex-wrap justify-center gap-8 lg:gap-16 mb-16 py-8 border-y border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <div className="text-sm text-gray-400">4.9/5 de avaliação</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">98%</div>
            <div className="text-sm text-gray-400">Taxa de satisfação</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">200+</div>
            <div className="text-sm text-gray-400">Clientes ativos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">15min</div>
            <div className="text-sm text-gray-400">Tempo médio de resposta</div>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start gap-4">
                <Quote className="w-8 h-8 text-blue-400 flex-shrink-0 opacity-50" />
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {getInitials(testimonial.client_name)}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.client_name}</div>
                      <div className="text-sm text-gray-400">
                        {testimonial.position && `${testimonial.position} • `}{testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {testimonials.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            Nenhuma avaliação disponível no momento.
          </div>
        )}

        {/* CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 mb-4">Junte-se a mais de 200 empresas satisfeitas</p>
          <a 
            href="https://wa.me/5591982370332?text=Olá! Gostaria de saber mais sobre os serviços da Delta7."
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-blue-50 transition-colors"
          >
            Fale com nosso time
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
