
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Scale, Monitor, Shield, Users, Code2, Mail, Cloud, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';

const Index = () => {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h1 className="text-6xl lg:text-7xl font-bold mb-6 flex flex-col items-center space-y-4">
            <img 
              src="/logo.png" 
              alt="Delta7 Tecnologia" 
              className="h-20 lg:h-24 object-contain"
            />
          </h1>
          <p className="text-2xl text-gray-600 mb-4 font-medium">
            Soluções completas em tecnologia da informação
          </p>
          <p className="text-lg text-gray-500 max-w-4xl mx-auto">
            Especialistas em infraestrutura de TI, desenvolvimento de software e consultoria tecnológica
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card Soluções Empresariais */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden bg-white dark:bg-card">
            <CardHeader className="text-center pb-6 pt-12">
              <div className="flex items-center justify-center mb-8">
                <div className="p-6 bg-orange-50 dark:bg-orange-950 rounded-full group-hover:scale-110 transition-transform">
                  <Monitor className="h-16 w-16 text-[#FF6A00]" />
                </div>
              </div>
              <CardTitle className="text-2xl mb-4">
                Soluções Empresariais
              </CardTitle>
              <CardDescription className="text-lg px-4">
                Infraestrutura completa de TI com tecnologias avançadas
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-[#FF6A00] flex-shrink-0" />
                  <span>GLPI, Zabbix, Proxmox</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Monitor className="h-5 w-5 text-[#FF6A00] flex-shrink-0" />
                  <span>Monitoramento 24x7</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-[#FF6A00] flex-shrink-0" />
                  <span>Suporte especializado</span>
                </div>
              </div>
              <Link to="/solucoes">
                <Button className="w-full bg-[#FF6A00] hover:bg-[#E55F00] text-white text-lg py-6 group">
                  Acessar Soluções Empresariais
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card Suporte de TI para empresas */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden bg-white dark:bg-card">
            <CardHeader className="text-center pb-6 pt-12">
              <div className="flex items-center justify-center mb-8">
                <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-full group-hover:scale-110 transition-transform">
                  <Scale className="h-16 w-16 text-black dark:text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl mb-4">
                Suporte de TI para empresas
              </CardTitle>
              <CardDescription className="text-lg px-4">
                Suporte especializado para pequenas e grandes empresas
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-black dark:text-white flex-shrink-0" />
                  <span>Confidencialidade e segurança de dados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Monitor className="h-5 w-5 text-black dark:text-white flex-shrink-0" />
                  <span>Suporte para softwares Empresariais</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-black dark:text-white flex-shrink-0" />
                  <span>Atendimento sob agendamento</span>
                </div>
              </div>
              <Link to="/juridico">
                <Button className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 text-lg py-6 group">
                  Acessar Suporte Empresarial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card Desenvolvimento Web */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden bg-white dark:bg-card">
            <CardHeader className="text-center pb-6 pt-12">
              <div className="flex items-center justify-center mb-8">
                <div className="p-6 bg-green-50 dark:bg-green-950 rounded-full group-hover:scale-110 transition-transform">
                  <Code2 className="h-16 w-16 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl mb-4">
                Desenvolvimento Web
              </CardTitle>
              <CardDescription className="text-lg px-4">
                Sites profissionais e e-mail corporativo
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Code2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Sites modernos e responsivos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>E-mail corporativo profissional</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>SEO otimizado e seguro</span>
                </div>
              </div>
              <Link to="/desenvolvimento-web">
                <Button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white text-lg py-6 group">
                  Acessar Desenvolvimento Web
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card Infraestrutura em Nuvem */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden bg-white dark:bg-card">
            <CardHeader className="text-center pb-6 pt-12">
              <div className="flex items-center justify-center mb-8">
                <div className="p-6 bg-blue-50 dark:bg-blue-950 rounded-full group-hover:scale-110 transition-transform">
                  <Cloud className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <CardTitle className="text-2xl mb-4">
                Infraestrutura em Nuvem
              </CardTitle>
              <CardDescription className="text-lg px-4">
                Cloud computing empresarial de alta performance
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Server className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span>Servidores VPS e Dedicados</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span>Backup e segurança avançada</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Cloud className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span>Armazenamento em nuvem S3</span>
                </div>
              </div>
              <Link to="/infraestrutura-nuvem">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-lg py-6 group">
                  Acessar Infraestrutura em Nuvem
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </>
  );
};

export default Index;
