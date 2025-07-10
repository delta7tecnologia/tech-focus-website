
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, Shield, Monitor, Phone, Mail, MessageSquare, ArrowLeft, CheckCircle, Clock, Users, FileText, Download, Play, Star, Quote } from 'lucide-react';
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
              <a href="https://wa.me/5591982370332?text=Olá! Gostaria de agendar um atendimento técnico" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="mr-2 h-5 w-5" />
                Agendar Atendimento
              </a>
            </Button>
            
            <Button size="lg" variant="outline" asChild>
              <a href="tel:+5591982370332">
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
                src="/logo-branco.png" 
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
              'Construnorte',
              'Dinâmica',
              'AgroTec',
              'GeoMaster',
              'Evolução contabilidade',
              'Sandro auto peças',
              'Estradão',
              'Hidráulica Imperatriz',
              'Igapó',
              'Adequa BBTS',
              'Cemetra',
              'NPrime',
              'Nacional',
              'AgroGil',
              'Belagro',
              'O Boticário',
              'Plantagro Rural',
              'AC Contabilidade',
              'Vale Verde',
              'Ferbel',
              'A4 Vistoria',
              'Geomap',
              'Para service',
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

      {/* Portfolio Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nosso Portfólio
            </h2>
            <p className="text-xl text-gray-600">
              Conheça nossos projetos e cases de sucesso
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="p-4 bg-white/10 rounded-full w-fit mx-auto mb-6">
              <Download className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Portfólio Completo</h3>
            <p className="text-blue-100 mb-6">
              Baixe nosso portfólio em PDF e conheça todos os nossos projetos, cases de sucesso e soluções implementadas
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <a href="/portfolio-delta7.pdf" download>
                <Download className="mr-2 h-5 w-5" />
                Baixar Portfólio PDF
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Conheça a Delta7
            </h2>
            <p className="text-xl text-gray-600">
              Vídeo institucional da nossa empresa
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="aspect-video bg-gray-100 rounded-lg mb-6 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg"></div>
              <Button size="lg" className="bg-red-600 hover:bg-red-700 relative z-10" asChild>
                <a href="https://youtube.com/@delta7tecnologia" target="_blank" rel="noopener noreferrer">
                  <Play className="mr-2 h-6 w-6" />
                  Assistir no YouTube
                </a>
              </Button>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Delta7 Tecnologia</h3>
            <p className="text-gray-600">
              Conheça nossa história, valores e como podemos transformar a tecnologia da sua empresa
            </p>
          </div>
        </div>
      </section>

      {/* Portal Section */}
      <section id="portal-chamados" className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Portal de Abertura de Chamados
            </h2>
            <p className="text-green-100 text-lg mb-6">
              Clientes com contrato de suporte podem abrir chamados técnicos através do nosso portal online
            </p>
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" asChild>
              <a href="https://portal.delta7tecnologia.com.br" target="_blank" rel="noopener noreferrer">
                <Monitor className="mr-2 h-5 w-5" />
                Acessar Portal de Chamados
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Depoimentos dos Clientes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Veja o que nossos clientes falam sobre nossos serviços
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: "João Silva",
                company: "Construnorte",
                rating: 5,
                text: "Excelente atendimento! A Delta7 resolveu todos os nossos problemas de TI com muita agilidade e profissionalismo."
              },
              {
                name: "Maria Santos",
                company: "Dinâmica Contabilidade",
                rating: 5,
                text: "Suporte técnico excepcional. Sempre prontos para ajudar e com soluções eficientes para nossa empresa."
              },
              {
                name: "Carlos Oliveira",
                company: "AgroTec",
                rating: 5,
                text: "Parceria de confiança! A Delta7 cuida de toda nossa infraestrutura de TI com excelência."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="mb-6">
                    <Quote className="h-8 w-8 text-blue-600 mb-4" />
                    <p className="text-gray-600 italic">{testimonial.text}</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Avaliações Google</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="flex mr-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-2xl font-bold">4.9/5</span>
            </div>
            <p className="text-blue-100 mb-6">
              Mais de 50 avaliações positivas no Google
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
              <a href="https://maps.app.goo.gl/5RbmwEGGWdrSRcqVA" target="_blank" rel="noopener noreferrer">
                <Star className="mr-2 h-5 w-5" />
                Ver Todas as Avaliações
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Ferramentas Essenciais
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Principais ferramentas para manter seu computador funcionando de forma saudável e segura
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Windows Defender</h3>
                <p className="text-gray-600 mb-4">Antivírus nativo do Windows para proteção básica</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.microsoft.com/pt-br/windows/comprehensive-security" target="_blank" rel="noopener noreferrer">
                    Acessar
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-green-100 rounded-full w-fit mx-auto mb-4">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">CCleaner</h3>
                <p className="text-gray-600 mb-4">Limpeza e otimização do sistema</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.ccleaner.com/pt-br" target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                  <Monitor className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">TeamViewer</h3>
                <p className="text-gray-600 mb-4">Acesso remoto para suporte técnico</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.teamviewer.com/pt-br/" target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-red-100 rounded-full w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Malwarebytes</h3>
                <p className="text-gray-600 mb-4">Proteção avançada contra malware</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.malwarebytes.com/" target="_blank" rel="noopener noreferrer">
                    Download
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-yellow-100 rounded-full w-fit mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Windows Update</h3>
                <p className="text-gray-600 mb-4">Atualizações automáticas do sistema</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="ms-settings:windowsupdate" target="_blank" rel="noopener noreferrer">
                    Acessar
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <div className="p-4 bg-indigo-100 rounded-full w-fit mx-auto mb-4">
                  <Clock className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Backup Automático</h3>
                <p className="text-gray-600 mb-4">Configuração de backup no Windows</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="ms-settings:backup" target="_blank" rel="noopener noreferrer">
                    Configurar
                  </a>
                </Button>
              </CardContent>
            </Card>
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
                  <a href="https://wa.me/5591982370332?text=Olá! Preciso de suporte técnico" target="_blank" rel="noopener noreferrer">
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
                  <a href="tel:+5591982370332">
                    (91) 98237-0332
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
