import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const VideoInstitucional = () => {
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
            Conheça a
            <span className="block bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">
              Delta7 Tecnologia
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Nossa história, valores e como podemos transformar a tecnologia da sua empresa
          </p>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="aspect-video bg-gradient-to-br from-blue-600/10 to-red-500/10 rounded-lg mb-8 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-red-500/20 rounded-lg"></div>
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
                transformar os processos da sua empresa, oferecendo soluções personalizadas e suporte 
                técnico de excelência.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nossa Missão
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Missão</h3>
              <p className="text-gray-600 leading-relaxed">
                Fornecer soluções tecnológicas inovadoras e suporte técnico de excelência, 
                contribuindo para o crescimento e sucesso dos nossos clientes através da 
                transformação digital.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Visão</h3>
              <p className="text-gray-600 leading-relaxed">
                Ser reconhecida como a principal referência em soluções de TI na região, 
                destacando-se pela qualidade, confiabilidade e inovação dos nossos serviços.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Valores</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Excelência no atendimento</li>
                <li>• Confidencialidade e segurança</li>
                <li>• Inovação constante</li>
                <li>• Relacionamento duradouro</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Diferenciais</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Suporte técnico especializado</li>
                <li>• Atendimento personalizado</li>
                <li>• Soluções sob medida</li>
                <li>• Equipe qualificada</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VideoInstitucional;