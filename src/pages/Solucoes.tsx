
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Shield, Monitor, Cloud, BarChart3, Server, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import About from '@/components/About';
import Technologies from '@/components/Technologies';
import Contact from '@/components/Contact';

const Solucoes = () => {
  const services = [
    {
      icon: <Monitor className="h-8 w-8 text-blue-600" />,
      title: "Gerenciamento e Suporte de TI",
      description: "Gestão completa da infraestrutura com soluções integradas",
      features: ["Sistema de chamados e controle de ativos", "Plataforma de virtualização com alta disponibilidade", "Inventário automatizado de equipamentos e sistemas", "Gestão eficiente de incidentes e problemas"],
      badge: "Essencial"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Monitoramento e Observabilidade",
      description: "Supervisão proativa com ferramentas de monitoramento e visualização",
      features: ["Monitoramento contínuo de servidores e redes", "Painéis visuais para análise de dados", "Alertas em tempo real", "Relatórios de desempenho e disponibilidade"],
      badge: "Crítico"
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Segurança e Firewall",
      description: "Proteção avançada com PfSense e Wazuh",
      features: ["PfSense - Firewall e VPN", "Wazuh - Detecção de intrusão e SIEM", "Balanceamento de carga", "Compliance e auditoria"],
      badge: "Segurança"
    },
    {
      icon: <Cloud className="h-8 w-8 text-green-600" />,
      title: "Backup e Alta Disponibilidade",
      description: "Proteção total dos dados e continuidade do negócio",
      features: ["Backup automatizado em nuvem", "Replicações e snapshots", "Recuperação de desastres", "Testes de integridade"],
      badge: "Proteção"
    }
  ];

  const intelligentSolutions = [
    {
      icon: <Server className="h-8 w-8 text-indigo-600" />,
      title: "Desenvolvimento de Sistemas",
      description: "Sistemas sob medida para empresas com foco em eficiência",
      features: ["Desenvolvimento de sistemas personalizados", "Arquitetura escalável e moderna", "Integração com sistemas existentes", "Metodologias ágeis de desenvolvimento"],
      badge: "Custom"
    },
    {
      icon: <Database className="h-8 w-8 text-cyan-600" />,
      title: "Integração de IA e Automação",
      description: "Inteligência artificial aplicada aos fluxos de atendimento",
      features: ["Criação e treinamento de Chatbots personalizados", "Integração com n8n, WhatsApp, Telegram e CRMs", "Automatização de rotinas operacionais", "APIs e conectores personalizados"],
      badge: "IA"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Menu
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
               <img 
                src="/logo.png" 
                alt="Delta7 Tecnologia"
                className="h-16 w-auto mb-4"
              />
              </h2>
            </div>
            
            <div className="hidden md:flex space-x-6">
              <a href="#home" className="text-gray-700 hover:text-blue-600 font-medium">Início</a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 font-medium">Serviços</a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 font-medium">Quem Somos</a>
              <a href="#tech" className="text-gray-700 hover:text-blue-600 font-medium">Tecnologias</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium">Contato</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Infraestrutura de TI
                  <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Profissional
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Especialistas em sistemas de monitoramento, servidores virtualizados, firewalls avançados e proteção cibernética.
                  Oferecemos soluções completas de monitoramento, virtualização, 
                  segurança e backup para sua empresa.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 group" asChild>
                  <a href="https://wa.me/5591982370332?text=Olá! Gostaria de solicitar um orçamento para soluções empresariais.">
                    Solicitar Orçamento
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-gray-300" asChild>
                  <a href="#services">
                    Nossos Serviços
                  </a>
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">10+</div>
                  <div className="text-sm text-gray-600">Anos de Experiência</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">200+</div>
                  <div className="text-sm text-gray-600">Clientes Atendidos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600">Suporte Disponível</div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual Elements */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <Shield className="h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Segurança</h3>
                    <p className="text-sm text-gray-600">Firewalls e monitoramento avançado</p>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <Monitor className="h-12 w-12 text-purple-600 mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Monitoramento</h3>
                    <p className="text-sm text-gray-600">Supervisão 24x7 da infraestrutura</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <Cloud className="h-12 w-12 text-green-600 mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">Backup</h3>
                    <p className="text-sm text-gray-600">Proteção completa dos dados</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                    <h3 className="font-semibold mb-2">Suporte Especializado</h3>
                    <p className="text-sm opacity-90">Atendimento técnico qualificado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Infraestrutura de TI
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos soluções completas de TI com foco em ferramentas open-source 
              e tecnologias enterprise para máxima eficiência e economia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg group-hover:scale-110 transition-transform">
                      {service.icon}
                    </div>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      {service.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full group" asChild>
                    <a href="#contact">
                      Saiba Mais
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Intelligent Solutions Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              🧠 Soluções Inteligentes e Desenvolvimento de Software
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desenvolvimento de sistemas sob medida e integração de IA para automação 
              e otimização dos processos empresariais.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {intelligentSolutions.map((solution, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gray-50 rounded-lg group-hover:scale-110 transition-transform">
                      {solution.icon}
                    </div>
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                      {solution.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-gray-900">{solution.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {solution.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {solution.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full group" asChild>
                    <a href="#contact">
                      Solicitar Consulta
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <About />
      <Technologies />
      <Contact />
    </div>
  );
};

export default Solucoes;
