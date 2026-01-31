import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Ricardo Santos",
      role: "Diretor de TI",
      company: "Construtora Amazônia",
      content: "A Delta7 transformou nossa infraestrutura de TI. O monitoramento 24/7 e o suporte rápido nos deram tranquilidade para focar no crescimento do negócio.",
      rating: 5,
      image: "RS"
    },
    {
      name: "Dra. Carla Mendes",
      role: "Sócia",
      company: "Mendes & Associados Advocacia",
      content: "Migrar para a nuvem foi mais simples do que imaginávamos. A equipe da Delta7 nos acompanhou em cada etapa e hoje temos 100% de mobilidade.",
      rating: 5,
      image: "CM"
    },
    {
      name: "Fernando Lima",
      role: "CEO",
      company: "TechParts Distribuição",
      content: "O sistema de backup implementado pela Delta7 nos salvou de uma situação crítica. Recuperamos todos os dados em menos de 2 horas.",
      rating: 5,
      image: "FL"
    },
    {
      name: "Ana Paula Ferreira",
      role: "Gerente Financeiro",
      company: "Clínica Saúde Integral",
      content: "Excelente atendimento! O firewall e as políticas de segurança implementadas nos deram a conformidade que precisávamos para a LGPD.",
      rating: 5,
      image: "AF"
    }
  ];

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
              key={index}
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
                  <p className="text-gray-300 leading-relaxed mb-4">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {testimonial.image}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">
                        {testimonial.role} • {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
