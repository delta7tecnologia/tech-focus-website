import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Carlos Mendes",
      role: "Diretor de Operações",
      company: "Logística Express",
      content: "A Delta7 transformou nossa infraestrutura de TI. O monitoramento proativo reduziu significativamente nossos tempos de inatividade.",
      rating: 5
    },
    {
      name: "Ana Paula Silva",
      role: "Gerente Administrativa",
      company: "Escritório Advocacia Silva",
      content: "Excelente suporte técnico e atendimento. A equipe sempre resolve nossos problemas com agilidade e profissionalismo.",
      rating: 5
    },
    {
      name: "Roberto Almeida",
      role: "CEO",
      company: "Indústria Almeida",
      content: "Implementaram nosso firewall e backup em nuvem com perfeição. Hoje temos total confiança na segurança dos nossos dados.",
      rating: 5
    },
    {
      name: "Fernanda Costa",
      role: "Coordenadora de TI",
      company: "Grupo Educacional Costa",
      content: "A consultoria da Delta7 nos ajudou a reduzir custos e otimizar toda a infraestrutura. Recomendo fortemente!",
      rating: 5
    }
  ];

  const stats = [
    { value: "200+", label: "Clientes Satisfeitos" },
    { value: "98%", label: "Taxa de Resolução" },
    { value: "< 2h", label: "Tempo Médio de Resposta" },
    { value: "10+", label: "Anos de Experiência" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl">
              <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A satisfação dos nossos clientes é a melhor prova da qualidade dos nossos serviços.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                
                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-100" />
                  <p className="text-gray-700 leading-relaxed pl-6">
                    "{testimonial.content}"
                  </p>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-blue-600">{testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
