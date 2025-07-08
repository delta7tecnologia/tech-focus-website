
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Scale, Monitor, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h1 className="text-6xl lg:text-7xl font-bold mb-6 flex flex-col items-center space-y-4">
            <img 
              src="https://delta7tecnologia.com.br/delta7/wp-content/uploads/2023/03/delta-e-dell-branco.png" 
              alt="Delta7 Tecnologia" 
              className="h-20 lg:h-24 object-contain"
            />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Delta7 Tecnologia
            </span>
          </h1>
          <p className="text-2xl text-gray-600 mb-4 font-medium">
            Soluções completas em tecnologia da informação
          </p>
          <p className="text-lg text-gray-500 max-w-4xl mx-auto">
            Especialistas em infraestrutura de TI, desenvolvimento de software e consultoria tecnológica
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card Suporte Jurídico */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden bg-white">
            <CardHeader className="text-center pb-6 pt-12">
              <div className="flex items-center justify-center mb-8">
                <div className="p-6 bg-blue-50 rounded-full group-hover:scale-110 transition-transform">
                  <Scale className="h-16 w-16 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-900 mb-4">
                Assistência Técnica Jurídica
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg px-4">
                Suporte especializado para escritórios de advocacia e profissionais do direito
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Confidencialidade e segurança de dados</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Monitor className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Suporte para softwares jurídicos</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Users className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span>Atendimento sob agendamento</span>
                </div>
              </div>
              <Link to="/juridico">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 group">
                  Acessar Suporte Jurídico
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card Soluções Empresariais */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden bg-white">
            <CardHeader className="text-center pb-6 pt-12">
              <div className="flex items-center justify-center mb-8">
                <div className="p-6 bg-purple-50 rounded-full group-hover:scale-110 transition-transform">
                  <Monitor className="h-16 w-16 text-purple-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-900 mb-4">
                Soluções Empresariais
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg px-4">
                Infraestrutura completa de TI com tecnologias avançadas
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Shield className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <span>GLPI, Zabbix, Proxmox</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Monitor className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <span>Monitoramento 24x7</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Users className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <span>Suporte especializado</span>
                </div>
              </div>
              <Link to="/solucoes">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-6 group">
                  Acessar Soluções Empresariais
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
