
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Monitor, Cloud } from 'lucide-react';

const Hero = () => {
  return (
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
                Especialistas em GLPI, Zabbix, Proxmox, PfSense e Wazuh. 
                Oferecemos soluções completas de monitoramento, virtualização, 
                segurança e backup para sua empresa.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 group">
                Solicitar Orçamento
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-gray-300">
                Nossos Serviços
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">5+</div>
                <div className="text-sm text-gray-600">Anos de Experiência</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">100+</div>
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
  );
};

export default Hero;
