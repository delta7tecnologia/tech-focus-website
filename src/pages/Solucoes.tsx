
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Technologies from '@/components/Technologies';
import Contact from '@/components/Contact';

const Solucoes = () => {
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
                TechSolutions Empresarial
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

      <Hero />
      <Services />
      <About />
      <Technologies />
      <Contact />
    </div>
  );
};

export default Solucoes;
