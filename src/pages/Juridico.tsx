
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Shield, Monitor, Phone, Mail, MessageSquare, ArrowLeft, CheckCircle, Clock, Users, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const Juridico = () => {
  const services = [
    {
      title: "Formatação e Otimização",
      description: "Formatação completa e otimização de computadores para máxima performance",
      icon: <Monitor className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Impressoras e Scanners",
      description: "Instalação e configuração de equipamentos de digitalização",
      icon: <FileText className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Manutenção Preventiva",
      description: "Manutenção preventiva e corretiva de equipamentos",
      icon: <CheckCircle className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Servidores",
      description: "Montagem e atualização de servidores corporativos",
      icon: <Monitor className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Backup Seguro",
      description: "Backup local e em nuvem de documentos empresariais",
      icon: <Shield className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Proteção de Dados",
      description: "Criptografia e proteção de dados sensíveis",
      icon: <Shield className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Videoconferência",
      description: "Soluções para audiências online e reuniões virtuais",
      icon: <Users className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Softwares Jurídicos",
      description: "Instalação e suporte de SAJ, Projudi e outros sistemas",
      icon: <Scale className="h-6 w-6 text-blue-600" />
    }
  ];

  const differentials = [
    {
      icon: <Clock className="h-6 w-6 text-green-600" />,
      title: "Atendimento Agendado",
      description: "Suporte técnico com horário marcado para não interromper sua rotina"
    },
    {
      icon: <Monitor className="h-6 w-6 text-blue-600" />,
      title: "Suporte Remoto",
      description: "Atendimento rápido via software autorizado e seguro"
    },
    {
      icon: <Shield className="h-6 w-6 text-red-600" />,
      title: "Confidencialidade",
      description: "Sigilo absoluto de dados e informações sensíveis"
    },
    {
      icon: <FileText className="h-6 w-6 text-purple-600" />,
      title: "Adequação LGPD",
      description: "Consultoria para adequação à Lei Geral de Proteção de Dados"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
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
              <img 
                src="/lovable-uploads/960d4398-2d86-492b-8415-3fe19e4f9f38.png" 
                alt="Delta7 Tecnologia"
                className="h-12 w-auto"
              />
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#servicos" className="text-gray-700 hover:text-blue-600 font-medium">Serviços</a>
              <a href="#diferenciais" className="text-gray-700 hover:text-blue-600 font-medium">Diferenciais</a>
              <a href="#contato" className="text-gray-700 hover:text-blue-600 font-medium">Contato</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-blue-100 text-blue-800 mb-4">Criada para empresas</Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Tecnologia com
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Confidencialidade e Agilidade
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Na Delta7, oferecemos suporte técnico confiável, seguro e sob medida para manter sua operação funcionando sem interrupções.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <a href="https://wa.me/5599999999999?text=Olá! Gostaria de agendar um atendimento técnico" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="mr-2 h-5 w-5" />
                Agendar Atendimento
              </a>
            </Button>
            
            <Button size="lg" variant="outline" asChild>
              <a href="tel:+5599999999999">
                <Phone className="mr-2 h-5 w-5" />
                Contato Imediato
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Serviços Especializados
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Soluções técnicas desenvolvidas especificamente para as necessidades de clientes empresariais
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader className="pb-4">
                  <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials Section */}
      <section id="diferenciais" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nossos Diferenciais
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              O que nos torna únicos no atendimento a clientes empresariais
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {differentials.map((diff, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {diff.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-lg">{diff.title}</h3>
                      <p className="text-gray-600">{diff.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/lovable-uploads/960d4398-2d86-492b-8415-3fe19e4f9f38.png" 
                alt="Delta7 Tecnologia"
                className="h-16 w-auto mb-4"
              />
            </div>
            <div className="inline-flex items-center mb-6">
              <span className="text-2xl mr-2">🤝</span>
              <h2 className="text-3xl lg:text-4xl font-bold">Nossos Clientes</h2>
            </div>
            
            <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
              A <strong>Delta7 Tecnologia</strong> tem orgulho de atender empresas que são referência em seus segmentos
            </p>
            
            <p className="text-lg text-blue-200 max-w-4xl mx-auto leading-relaxed">
              Confira alguns dos nossos parceiros que confiam em nossa expertise em <strong>TI</strong> para garantir performance, segurança e inovação:
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
            {[
              'Construcred Norte',
              'Dinâmica',
              'Agro RC',
              'Geo Master',
              'Fundação Amazônia',
              'Sandro Auto Parts',
              'Estradão',
              'Hidráulica Imperatriz',
              'Igapó',
              'Adequa BBTS',
              'Cemestra',
              'JM Prime',
              'Nacional',
              'Agro Gil',
              'Belagro',
              'O Boticário',
              'Plantagro Rural',
              'Contabilidade',
              'Vale Verde',
              'Ferbel',
              'C740',
              'Zara Service',
              'Forte Med'
            ].map((client, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-300">
                <div className="h-12 flex items-center justify-center">
                  <span className="text-sm font-medium text-white/90 text-center">{client}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-2xl mr-2">🔒</span>
              <h3 className="text-2xl font-bold">Clientes Diversificados</h3>
            </div>
            <p className="text-blue-100 text-lg">
              São clientes de diferentes áreas que compartilham uma escolha em comum: <strong>soluções tecnológicas com qualidade, suporte especializado e confiança Delta7</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Entre em Contato
            </h2>
            <p className="text-xl text-gray-600">
              Estamos prontos para atender suas necessidades técnicas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="p-4 bg-green-100 rounded-full w-fit mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">WhatsApp</h3>
                <p className="text-gray-600 mb-4">Atendimento rápido e direto</p>
                <Button className="bg-green-600 hover:bg-green-700" asChild>
                  <a href="https://wa.me/5599999999999?text=Olá! Preciso de suporte técnico" target="_blank" rel="noopener noreferrer">
                    Chamar no WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Telefone</h3>
                <p className="text-gray-600 mb-4">Atendimento comercial</p>
                <Button variant="outline" asChild>
                  <a href="tel:+5599999999999">
                    (99) 9999-9999
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="p-4 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                  <Mail className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">E-mail</h3>
                <p className="text-gray-600 mb-4">Contato profissional</p>
                <Button variant="outline" asChild>
                  <a href="mailto:contato@delta7tecnologia.com.br">
                    contato@delta7tecnologia.com.br
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Atendimento Especializado</h3>
            <p className="text-blue-100 mb-6">
              Horário comercial: Segunda a Sexta, 8h às 18h
            </p>
            <p className="text-blue-100">
              Suporte emergencial disponível 24h para clientes premium
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Juridico;
