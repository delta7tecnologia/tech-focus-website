import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Headphones, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users, 
  Target 
} from 'lucide-react';

const Differentials = () => {
  const differentials = [
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "Atendimento Especializado",
      description: "Equipe técnica qualificada com certificações e experiência comprovada em ambientes corporativos.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Monitoramento Proativo",
      description: "Identificamos e resolvemos problemas antes que afetem sua operação. Acompanhamento 24x7 da infraestrutura.",
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Segurança da Informação",
      description: "Políticas e ferramentas de segurança para proteger seus dados contra ameaças e vazamentos.",
      color: "text-red-500",
      bg: "bg-red-50"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Suporte Rápido e Eficiente",
      description: "Tempo de resposta ágil com SLAs definidos. Resolução eficaz de problemas críticos.",
      color: "text-orange-500",
      bg: "bg-orange-50"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Soluções Sob Medida",
      description: "Cada empresa é única. Desenvolvemos soluções personalizadas para suas necessidades específicas.",
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Parceria de Longo Prazo",
      description: "Não somos apenas fornecedores. Somos parceiros estratégicos no crescimento do seu negócio.",
      color: "text-cyan-600",
      bg: "bg-cyan-50"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Por que escolher a Delta7?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nosso compromisso é entregar soluções de TI que realmente façam 
            diferença no dia a dia da sua empresa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {differentials.map((item, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
            >
              <CardContent className="p-6">
                <div className={`w-14 h-14 ${item.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <div className={item.color}>{item.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 lg:p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Pronto para modernizar sua TI?
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
              Agende uma consultoria gratuita e descubra como podemos ajudar 
              sua empresa a crescer com tecnologia e segurança.
            </p>
            <a 
              href="https://wa.me/5591982370332?text=Olá! Gostaria de agendar uma consultoria gratuita."
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Agendar Consultoria Gratuita
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Differentials;
