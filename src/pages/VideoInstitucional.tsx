import React from 'react';
import { Button } from "@/components/ui/button";
import { Play } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageTransition from '@/components/PageTransition';

const VideoInstitucional = () => {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <SEOHead
          title="Conheça a Delta7 Tecnologia | Vídeo Institucional"
          description="Assista ao vídeo institucional da Delta7 Tecnologia e conheça nossa história, missão, valores e diferenciais em soluções de TI."
        />
        <Navigation />

        <section className="pt-24 pb-12 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Conheça a Delta7 Tecnologia</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Nossa história, valores e como podemos transformar a tecnologia da sua empresa
            </p>
          </div>
        </section>

        <Breadcrumbs items={[{ label: 'Vídeo Institucional' }]} />

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="aspect-video bg-gradient-to-br from-blue-600/10 to-blue-800/10 rounded-lg mb-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-lg"></div>
                <div className="text-center relative z-10">
                  <div className="p-8 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                    <Play className="h-16 w-16 text-blue-600" />
                  </div>
                  <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
                    <a href="https://youtube.com/shorts/t7GlACKyUno?feature=share" target="_blank" rel="noopener noreferrer">
                      <Play className="mr-2 h-6 w-6" />
                      Assistir no YouTube
                    </a>
                  </Button>
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Delta7 Tecnologia</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Conheça nossa trajetória, missão e valores. Veja como nossa expertise em tecnologia pode 
                  transformar os processos da sua empresa.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossa Missão</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
              {[
                { title: "Missão", text: "Fornecer soluções tecnológicas inovadoras e suporte técnico de excelência, contribuindo para o crescimento e sucesso dos nossos clientes." },
                { title: "Visão", text: "Ser reconhecida como a principal referência em soluções de TI na região, destacando-se pela qualidade, confiabilidade e inovação." },
                { title: "Valores", items: ["Excelência no atendimento", "Confidencialidade e segurança", "Inovação constante", "Relacionamento duradouro"] },
                { title: "Diferenciais", items: ["Suporte técnico especializado", "Atendimento personalizado", "Soluções sob medida", "Equipe qualificada"] }
              ].map((card, i) => (
                <div key={i} className="bg-white rounded-xl p-8 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{card.title}</h3>
                  {'text' in card ? (
                    <p className="text-gray-600 leading-relaxed">{card.text}</p>
                  ) : (
                    <ul className="text-gray-600 space-y-2">
                      {card.items?.map((item, j) => <li key={j}>• {item}</li>)}
                    </ul>
                  )}
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

export default VideoInstitucional;
