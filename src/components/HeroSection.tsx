import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Server, Cloud, Headphones, CheckCircle, Play } from 'lucide-react';

const HeroSection = () => {
  const words = ['inteligente', 'eficiente', 'confiável', 'segura'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen pt-20 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating particles - pure CSS */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium backdrop-blur-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                + de 10 anos de experiência em TI
              </div>
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white">
                Transforme seu negócio com uma TI{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400">
                  {words[currentWordIndex]}
                </span>
              </h1>
              
              <p className="text-xl text-gray-200 leading-relaxed max-w-xl">
                Líder em Gestão de TI B2B para Pequenas e Médias Empresas. 
                Infraestrutura, segurança, monitoramento e suporte especializado 
                para acelerar o crescimento do seu negócio.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-6 text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                asChild
              >
                <a href="https://wa.me/5591982370332?text=Olá! Gostaria de falar com um especialista em TI.">
                  Fale com um especialista
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button 
                size="lg" 
                className="border-2 border-white/40 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg backdrop-blur-sm"
                asChild
              >
                <a href="#services">
                  <Play className="w-5 h-5 mr-2" />
                  Conheça Nossos Serviços
                </a>
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                +90% de avaliação positiva
              </span>
              <span className="hidden sm:block">|</span>
              <span className="hidden sm:flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Suporte 24/7
              </span>
            </div>

            <div className="flex flex-wrap gap-8 pt-8 border-t border-white/10">
              {[
                { value: '200+', label: 'Clientes Atendidos' },
                { value: '24/7', label: 'Suporte Disponível' },
                { value: '99.9%', label: 'Uptime Garantido' },
                { value: '10+', label: 'Anos de Mercado' },
              ].map((stat, i) => (
                <div key={i} className="text-center sm:text-left">
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{stat.value}</div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-blue-400/30 transition-all duration-300 group">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Segurança Avançada</h3>
                <p className="text-sm text-gray-400">Firewall, VPN, SIEM e proteção completa contra ameaças</p>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-green-400/30 transition-all duration-300 group">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Server className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Servidores & Virtualização</h3>
                <p className="text-sm text-gray-400">Proxmox, VMware e alta disponibilidade</p>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 group">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Cloud className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Cloud & Backup</h3>
                <p className="text-sm text-gray-400">Infraestrutura em nuvem e disaster recovery</p>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 border border-blue-500/30 shadow-xl shadow-blue-500/20 group">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Headphones className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Suporte 24/7</h3>
                <p className="text-sm text-blue-100">Atendimento especializado sempre disponível</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-[5]">
        <svg className="w-full h-20 text-white" viewBox="0 0 1440 54" fill="currentColor" preserveAspectRatio="none">
          <path d="M0 22L60 16.7C120 11 240 1.00001 360 0.700012C480 1.00001 600 11 720 16.7C840 22 960 22 1080 18.3C1200 15 1320 7.00001 1380 3.70001L1440 0.700012V54H1380C1320 54 1200 54 1080 54C960 54 840 54 720 54C600 54 480 54 360 54C240 54 120 54 60 54H0V22Z" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
