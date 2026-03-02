import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { 
  ArrowLeft, ArrowRight, Shield, Monitor, Cloud, BarChart3, Server, Database,
  Code2, Mail, Globe, Smartphone, Zap, Users, HardDrive, Wrench, CheckCircle,
  Scale, Lock, HeadphonesIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Solucoes = () => {
  const infraServices = [
    {
      icon: <Monitor className="h-7 w-7" />,
      title: "Gerenciamento e Suporte de TI",
      description: "Gestão completa da infraestrutura com soluções integradas",
      features: ["Sistema de chamados e controle de ativos", "Plataforma de virtualização", "Inventário automatizado", "Gestão de incidentes"],
      badge: "Essencial",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <BarChart3 className="h-7 w-7" />,
      title: "Monitoramento e Observabilidade",
      description: "Supervisão proativa com ferramentas avançadas",
      features: ["Monitoramento 24x7 de servidores", "Dashboards personalizados", "Alertas em tempo real", "Relatórios de SLA"],
      badge: "Crítico",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Shield className="h-7 w-7" />,
      title: "Segurança e Firewall",
      description: "Proteção avançada com PfSense e Wazuh",
      features: ["Firewall e VPN corporativa", "Detecção de intrusão (SIEM)", "Balanceamento de carga", "Compliance e auditoria"],
      badge: "Segurança",
      gradient: "from-red-500 to-rose-600"
    },
    {
      icon: <Cloud className="h-7 w-7" />,
      title: "Backup e Alta Disponibilidade",
      description: "Proteção total dos dados e continuidade do negócio",
      features: ["Backup automatizado em nuvem", "Replicações e snapshots", "Disaster recovery", "Testes de integridade"],
      badge: "Proteção",
      gradient: "from-cyan-500 to-teal-600"
    }
  ];

  const cloudServices = [
    {
      icon: <Server className="h-6 w-6" />,
      title: "Servidores VPS",
      description: "Servidores virtuais com recursos dedicados e desempenho garantido",
      features: ["Painel intuitivo", "Backup automático", "Escalabilidade", "Suporte dedicado"]
    },
    {
      icon: <HardDrive className="h-6 w-6" />,
      title: "Servidores Dedicados",
      description: "Hardware exclusivo para aplicações que exigem máxima potência",
      features: ["Hardware exclusivo", "Monitoramento 24h", "Suporte técnico", "SLA garantido"]
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Colocation",
      description: "Hospede seus equipamentos em nossa infraestrutura certificada",
      features: ["Energia redundante", "Conectividade alta", "Segurança 24h", "Climatização"]
    },
    {
      icon: <Cloud className="h-6 w-6" />,
      title: "Armazenamento S3",
      description: "Armazenamento de objetos escalável compatível com protocolo S3",
      features: ["API compatível", "Integração fácil", "Escalabilidade", "Backup integrado"]
    }
  ];

  const webServices = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Sites Institucionais",
      description: "Sites modernos, responsivos e otimizados para SEO"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "E-commerce",
      description: "Lojas virtuais completas com gateway de pagamento"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "E-mail Corporativo",
      description: "Infraestrutura profissional com seu domínio próprio"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Landing Pages",
      description: "Páginas de alta conversão e carregamento rápido"
    }
  ];

  const aiServices = [
    {
      icon: <Code2 className="h-7 w-7" />,
      title: "Desenvolvimento de Sistemas",
      description: "Sistemas sob medida para empresas com foco em eficiência",
      features: ["Sistemas personalizados", "Arquitetura escalável", "Integração com sistemas existentes", "Metodologias ágeis"],
      badge: "Custom",
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      icon: <Database className="h-7 w-7" />,
      title: "Integração de IA e Automação",
      description: "Inteligência artificial aplicada aos fluxos de atendimento",
      features: ["Chatbots personalizados", "Integração n8n, WhatsApp, Telegram", "Automatização de rotinas", "APIs customizadas"],
      badge: "IA",
      gradient: "from-cyan-500 to-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 mb-6">
              Soluções Completas
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Todas as Soluções de TI que sua{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Empresa Precisa
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Infraestrutura, segurança, cloud, desenvolvimento web e automação com IA. 
              Tudo integrado para impulsionar seu negócio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <a href="https://wa.me/5591982370332?text=Olá! Gostaria de solicitar um orçamento.">
                  Solicitar Orçamento
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <a href="#infra">Ver Soluções</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Infraestrutura de TI */}
      <section id="infra" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-blue-100 text-blue-700 mb-4">Infraestrutura</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Infraestrutura de TI Profissional
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Soluções completas de monitoramento, virtualização, segurança e backup para sua empresa
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {infraServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all border-0 shadow-lg overflow-hidden">
                  <div className={`h-1 bg-gradient-to-r ${service.gradient}`} />
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${service.gradient} text-white`}>
                        {service.icon}
                      </div>
                      <Badge variant="secondary">{service.badge}</Badge>
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cloud Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-cyan-100 text-cyan-700 mb-4">Cloud</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Infraestrutura em Nuvem
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Servidores, backup e armazenamento com alta disponibilidade e pagamento em moeda nacional
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cloudServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-all border hover:border-cyan-200">
                  <CardHeader>
                    <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 mb-4">
                      {service.icon}
                    </div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Web & Email */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-purple-100 text-purple-700 mb-4">Web & E-mail</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Desenvolvimento Web & E-mail Corporativo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Presença digital profissional e infraestrutura de comunicação empresarial
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {webServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-all text-center border hover:border-purple-200 p-6">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mx-auto mb-4">
                    {service.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI & Development */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-400/30 mb-4">
              🧠 Inovação
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Soluções Inteligentes e Desenvolvimento
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Sistemas sob medida e integração de IA para automação e otimização de processos
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {aiServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-white/10 backdrop-blur-sm border-white/10 hover:bg-white/15 transition-all">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${service.gradient} text-white`}>
                        {service.icon}
                      </div>
                      <Badge className="bg-white/20 text-white border-white/30">{service.badge}</Badge>
                    </div>
                    <CardTitle className="text-xl text-white">{service.title}</CardTitle>
                    <CardDescription className="text-gray-300">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-cyan-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support for Offices */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-green-100 text-green-700 mb-4">Empresarial</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Suporte Especializado para Escritórios
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Atendimento técnico confiável, seguro e sob medida para manter sua operação 
                funcionando sem interrupções. Ideal para escritórios de advocacia, contabilidades, 
                clínicas e empresas que precisam de confidencialidade.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Formatação e otimização de computadores",
                  "Instalação de impressoras e scanners",
                  "Manutenção preventiva e corretiva",
                  "Backup seguro de documentos",
                  "Adequação à LGPD",
                  "Suporte a softwares específicos"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
                <a href="https://wa.me/5591982370332?text=Olá! Preciso de suporte técnico para meu escritório.">
                  Agendar Atendimento
                </a>
              </Button>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {[
                { icon: <Scale className="w-6 h-6" />, title: "Advocacia", desc: "SAJ, Projudi, PJe" },
                { icon: <Shield className="w-6 h-6" />, title: "Confidencialidade", desc: "Sigilo absoluto" },
                { icon: <HeadphonesIcon className="w-6 h-6" />, title: "Suporte Remoto", desc: "Atendimento rápido" },
                { icon: <Lock className="w-6 h-6" />, title: "LGPD", desc: "Conformidade total" }
              ].map((item, i) => (
                <Card key={i} className="p-5 hover:shadow-lg transition-all border hover:border-green-200">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-3">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Pronto para Transformar sua TI?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Agende uma consultoria gratuita e descubra a solução ideal para o seu negócio
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8" asChild>
                <a href="https://wa.me/5591982370332?text=Olá! Gostaria de agendar uma consultoria gratuita.">
                  Agendar Consultoria Gratuita
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/#contact">Falar com Especialista</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Solucoes;
