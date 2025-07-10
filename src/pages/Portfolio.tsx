import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const Portfolio = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/juridico">
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
            Nosso
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Portfólio
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Conheça nossos projetos e cases de sucesso com empresas de diversos segmentos
          </p>
        </div>
      </section>

      {/* Portfolio Download Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <div className="p-6 bg-white/10 rounded-full w-fit mx-auto mb-8">
              <Download className="h-16 w-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-6">Portfólio Completo</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Baixe nosso portfólio em PDF e conheça todos os nossos projetos, cases de sucesso e soluções implementadas para empresas de diversos segmentos
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <a href="/portfolio-delta7.pdf" download>
                <Download className="mr-2 h-5 w-5" />
                Baixar Portfólio PDF
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Projects Highlight */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Projetos em Destaque
            </h2>
            <p className="text-xl text-gray-600">
              Alguns dos nossos principais trabalhos realizados
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Modernização de Infraestrutura",
                client: "Construnorte",
                description: "Atualização completa da infraestrutura de TI com servidores, rede e backup"
              },
              {
                title: "Sistema de Videoconferência",
                client: "Escritório Jurídico",
                description: "Implementação de sistema para audiências online e reuniões virtuais"
              },
              {
                title: "Adequação LGPD",
                client: "Dinâmica Contabilidade",
                description: "Consultoria e implementação de medidas para adequação à LGPD"
              },
              {
                title: "Backup e Segurança",
                client: "AgroTec",
                description: "Implementação de sistema de backup seguro e proteção de dados"
              },
              {
                title: "Automação de Processos",
                client: "Evolução Contabilidade",
                description: "Automatização de processos contábeis e financeiros"
              },
              {
                title: "Suporte Técnico 24h",
                client: "Grupo Empresarial",
                description: "Contrato de suporte técnico premium com atendimento 24 horas"
              }
            ].map((project, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-blue-600 font-medium mb-3">{project.client}</p>
                <p className="text-gray-600">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;