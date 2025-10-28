import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Shield, FileText, Monitor, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Ferramentas = () => {
  const tools = [
    {
      name: "Windows Defender",
      description: "Antivírus nativo do Windows para proteção básica contra malware e vírus",
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      color: "bg-blue-100",
      link: "https://www.microsoft.com/pt-br/windows/comprehensive-security"
    },
    {
      name: "CCleaner",
      description: "Limpeza e otimização do sistema, remove arquivos temporários e registry inválidos",
      icon: <FileText className="h-8 w-8 text-green-600" />,
      color: "bg-green-100",
      link: "https://www.ccleaner.com/pt-br"
    },
    {
      name: "TeamViewer",
      description: "Acesso remoto para suporte técnico e controle de computadores à distância",
      icon: <Monitor className="h-8 w-8 text-red-500" />,
      color: "bg-red-100",
      link: "https://www.teamviewer.com/pt-br/"
    },
    {
      name: "Malwarebytes",
      description: "Proteção avançada contra malware, spyware e outras ameaças digitais",
      icon: <Shield className="h-8 w-8 text-red-600" />,
      color: "bg-red-100",
      link: "https://www.malwarebytes.com/"
    },
    {
      name: "Windows Update",
      description: "Atualizações automáticas do sistema operacional para segurança e performance",
      icon: <CheckCircle className="h-8 w-8 text-yellow-600" />,
      color: "bg-yellow-100",
      link: "ms-settings:windowsupdate"
    },
    {
      name: "Backup Automático",
      description: "Configuração de backup automático no Windows para proteção de dados",
      icon: <Clock className="h-8 w-8 text-indigo-600" />,
      color: "bg-indigo-100",
      link: "ms-settings:backup"
    }
  ];

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
            Ferramentas
            <span className="block bg-gradient-to-r from-blue-600 to-red-500 bg-clip-text text-transparent">
              Essenciais
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Principais ferramentas para manter seu computador funcionando de forma saudável, segura e otimizada
          </p>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardContent className="p-8 text-center">
                  <div className={`p-4 ${tool.color} rounded-full w-fit mx-auto mb-6`}>
                    {tool.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-4 text-xl">{tool.name}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{tool.description}</p>
                  <Button variant="outline" size="sm" asChild>
                    <a href={tool.link} target="_blank" rel="noopener noreferrer">
                      {tool.link.startsWith('ms-settings:') ? 'Acessar' : 'Download'}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Dicas de Uso
            </h2>
            <p className="text-xl text-gray-600">
              Como usar essas ferramentas de forma eficiente
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Manutenção Preventiva</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Execute o CCleaner semanalmente</li>
                  <li>• Mantenha o Windows Update sempre ativo</li>
                  <li>• Faça backup regularmente</li>
                  <li>• Escaneie com Malwarebytes mensalmente</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Segurança</h3>
                <ul className="space-y-3 text-gray-600">
                  <li>• Mantenha o Windows Defender ativado</li>
                  <li>• Use senhas fortes e únicas</li>
                  <li>• Evite downloads suspeitos</li>
                  <li>• Configure firewall adequadamente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Ferramentas;