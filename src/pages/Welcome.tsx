
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Scale, Monitor, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Delta7 Tecnologia
            </span>
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            Soluções completas em tecnologia da informação
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Especialistas em infraestrutura de TI, desenvolvimento de software e consultoria tecnológica
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Card Suporte Jurídico */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50 pb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-blue-100 rounded-2xl group-hover:scale-110 transition-transform">
                  <Scale className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center text-gray-900 mb-4">
                Assistência Técnica Jurídica
              </CardTitle>
              <CardDescription className="text-center text-gray-600 text-lg">
                Suporte especializado para escritórios de advocacia e profissionais do direito
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Confidencialidade e segurança de dados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Monitor className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Suporte para softwares jurídicos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Atendimento sob agendamento</span>
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
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50 pb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-purple-100 rounded-2xl group-hover:scale-110 transition-transform">
                  <Monitor className="h-12 w-12 text-purple-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center text-gray-900 mb-4">
                Soluções Empresariais
              </CardTitle>
              <CardDescription className="text-center text-gray-600 text-lg">
                Infraestrutura completa de TI com tecnologias avançadas
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">GLPI, Zabbix, Proxmox</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Monitor className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">Monitoramento 24x7</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="text-gray-700">Suporte especializado</span>
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

        <div className="text-center mt-16">
          <p className="text-gray-500">
            Precisa de ajuda para escolher? Entre em contato conosco
          </p>
          <Button variant="outline" className="mt-4">
            Falar com Especialista
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
