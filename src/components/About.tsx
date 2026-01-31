import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Heart, Users, Award, Clock, Shield, Zap } from 'lucide-react';

const About = () => {
  const values = [
    { icon: <Shield className="w-5 h-5" />, title: "Segurança", desc: "Proteção como prioridade" },
    { icon: <Zap className="w-5 h-5" />, title: "Agilidade", desc: "Respostas rápidas" },
    { icon: <Users className="w-5 h-5" />, title: "Parceria", desc: "Crescemos juntos" },
    { icon: <Award className="w-5 h-5" />, title: "Excelência", desc: "Qualidade sempre" },
  ];

  const stats = [
    { number: "10+", label: "Anos de experiência" },
    { number: "200+", label: "Empresas atendidas" },
    { number: "98%", label: "Taxa de satisfação" },
    { number: "24/7", label: "Suporte disponível" },
  ];

  return (
    <section id="about" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
              Sobre a Delta7
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-6">
              Quem <span className="text-blue-600">Somos</span>
            </h2>
            
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                A <strong className="text-gray-900">Delta7 Tecnologia</strong> é uma empresa especializada 
                em soluções de TI para pequenas e médias empresas. Há mais de 10 anos, transformamos 
                a tecnologia em vantagem competitiva para nossos clientes.
              </p>
              <p>
                Nossa metodologia de trabalho garante entregas precisas em todos os projetos, 
                com desenvolvimento ágil e eficaz que proporciona uma experiência positiva. 
                Investimos constantemente na especialização e atualização da nossa equipe.
              </p>
              <p>
                Atuamos com atendimento <strong className="text-gray-900">remoto em todo Brasil</strong> e 
                presencial na região Norte, sempre focados em oferecer soluções sob medida 
                que atendam às necessidades específicas de cada negócio.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    {value.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{value.title}</div>
                    <div className="text-xs text-gray-500">{value.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Stats & Mission/Vision */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-center text-white shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-3xl lg:text-4xl font-bold">{stat.number}</div>
                  <div className="text-blue-100 text-sm mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Mission Card */}
            <motion.div
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Nossa Missão</h3>
              </div>
              <p className="text-gray-600">
                Entregar soluções tecnológicas que impulsionem o crescimento dos nossos clientes, 
                com segurança, eficiência e suporte de excelência.
              </p>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Nossa Visão</h3>
              </div>
              <p className="text-gray-600">
                Ser referência em gestão de TI para PMEs, reconhecida pela qualidade 
                técnica, inovação e relacionamento próximo com clientes.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
