import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageTransition from '@/components/PageTransition';

const Portfolio = () => {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <SEOHead
          title="Portfólio e Cases de Sucesso | Delta7 Tecnologia"
          description="Conheça os projetos e cases de sucesso da Delta7 Tecnologia. Modernização de infraestrutura, adequação LGPD, backup e muito mais."
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Portfólio Delta7 Tecnologia",
            url: "https://delta7tecnologia.com.br/portfolio",
            description: "Cases de sucesso e projetos executados pela Delta7 Tecnologia em infraestrutura, cloud, segurança e suporte de TI.",
            isPartOf: { "@type": "WebSite", name: "Delta7 Tecnologia", url: "https://delta7tecnologia.com.br" },
          }}
        />
        <Navigation />

        {/* Hero */}
        <section className="pt-24 pb-12 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Nosso Portfólio</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Conheça nossos projetos e cases de sucesso com empresas de diversos segmentos
            </p>
          </div>
        </section>

        <Breadcrumbs items={[{ label: 'Portfólio' }]} />

        {/* Download */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white">
              <div className="p-6 bg-white/10 rounded-full w-fit mx-auto mb-8">
                <Download className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-6">Portfólio Completo</h2>
              <p className="text-blue-100 mb-8 text-lg">
                Baixe nosso portfólio em PDF e conheça todos os nossos projetos, cases de sucesso e soluções implementadas
              </p>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <a href="/catalogo.pdf" download>
                  <Download className="mr-2 h-5 w-5" />
                  Baixar Portfólio PDF
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Projetos em Destaque</h2>
              <p className="text-xl text-gray-600">Alguns dos nossos principais trabalhos realizados</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Modernização de Infraestrutura", client: "Construnorte", description: "Atualização completa da infraestrutura de TI com servidores, rede e backup" },
                { title: "Sistema de Videoconferência", client: "Escritório Jurídico", description: "Implementação de sistema para audiências online e reuniões virtuais" },
                { title: "Adequação LGPD", client: "Dinâmica Center", description: "Consultoria e implementação de medidas para adequação à LGPD" },
                { title: "Backup e Segurança", client: "AgroTec", description: "Implementação de sistema de backup seguro e proteção de dados" },
                { title: "Automação de Processos", client: "Evolução Contabilidade", description: "Automatização de processos contábeis e financeiros" },
                { title: "Suporte Técnico 24h", client: "Grupo Empresarial", description: "Contrato de suporte técnico premium com atendimento 24 horas" }
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

        <Footer />
        <WhatsAppButton />
      </div>
    </PageTransition>
  );
};

export default Portfolio;
