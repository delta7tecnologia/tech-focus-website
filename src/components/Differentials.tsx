import React from 'react';
import { motion } from 'framer-motion';
import { 
  Headphones, 
  TrendingUp, 
  Shield, 
  Clock, 
  Settings, 
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Button } from './ui/button';

const Differentials = () => {
  const differentials = [
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Atendimento Especializado",
      description: "Equipe técnica certificada com experiência em ambientes corporativos complexos",
      color: "blue"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Monitoramento Proativo",
      description: "Identificamos e resolvemos problemas antes que afetem seu negócio",
      color: "green"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Segurança em Primeiro Lugar",
      description: "Políticas robustas de segurança e conformidade com LGPD",
      color: "red"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Suporte Rápido e Eficiente",
      description: "Tempo médio de primeira resposta inferior a 15 minutos",
      color: "orange"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Soluções Sob Medida",
      description: "Projetos personalizados de acordo com as necessidades do seu negócio",
      color: "purple"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Parceria de Longo Prazo",
      description: "Relacionamento próximo e consultivo com foco no seu crescimento",
      color: "cyan"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; icon: string }> = {
      blue: { bg: "bg-blue-100", icon: "text-blue-600" },
      green: { bg: "bg-green-100", icon: "text-green-600" },
      red: { bg: "bg-red-100", icon: "text-red-600" },
      orange: { bg: "bg-orange-100", icon: "text-orange-600" },
      purple: { bg: "bg-purple-100", icon: "text-purple-600" },
      cyan: { bg: "bg-cyan-100", icon: "text-cyan-600" }
    };
    return colors[color] || colors.blue;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Por que escolher a Delta7?
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Nossos <span className="text-blue-600">Diferenciais</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Entendemos que cada empresa é única. Por isso, oferecemos soluções 
            personalizadas com o suporte que você merece.
          </p>
        </motion.div>

        {/* Differentials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {differentials.map((item, index) => {
            const colorClasses = getColorClasses(item.color);
            return (
              <motion.div
                key={index}
                className="p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl border border-transparent hover:border-gray-200 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-14 h-14 rounded-xl ${colorClasses.bg} ${colorClasses.icon} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-8 lg:p-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Pronto para transformar sua TI?
              </h3>
              <p className="text-blue-100 text-lg mb-6">
                Agende uma consultoria gratuita e descubra como podemos 
                otimizar sua infraestrutura de tecnologia.
              </p>
              <ul className="space-y-2 mb-6">
                {["Análise gratuita do ambiente", "Proposta personalizada", "Sem compromisso"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-white">
                    <CheckCircle className="w-5 h-5 text-cyan-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold shadow-xl"
                asChild
              >
                <a href="https://wa.me/5591982370332?text=Olá! Gostaria de agendar uma consultoria gratuita.">
                  Agendar Consultoria
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Differentials;
