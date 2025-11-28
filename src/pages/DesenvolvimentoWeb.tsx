import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Code2, Mail, Globe, Smartphone, ShieldCheck, Zap, CheckCircle2, ArrowRight, Users, HeadphonesIcon, Clock, TrendingUp } from "lucide-react";

const DesenvolvimentoWeb = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#FF6A00] to-red-600 bg-clip-text text-transparent">
              Desenvolvimento Web Profissional
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transforme sua presença digital com sites modernos, responsivos e otimizados para conversão. Infraestrutura de e-mail corporativo completa e profissional.
            </p>
          </div>
        </div>
      </section>

      {/* Serviços de Desenvolvimento */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Globe className="w-16 h-16 mx-auto mb-4 text-[#FF6A00]" />
            <h2 className="text-3xl font-bold mb-4">Soluções Web Sob Medida</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Desenvolvemos soluções digitais que atendem às necessidades específicas do seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="border-2 hover:border-[#FF6A00] transition-all hover:shadow-xl">
              <CardContent className="pt-6">
                <Code2 className="w-12 h-12 mb-4 text-[#FF6A00]" />
                <h3 className="text-xl font-semibold mb-3">Sites Institucionais</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span>Design moderno e profissional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span>Responsivo para todos os dispositivos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span>Otimização para motores de busca (SEO)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span>Integração com redes sociais</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#FF6A00] transition-all hover:shadow-xl">
              <CardContent className="pt-6">
                <Smartphone className="w-12 h-12 mb-4 text-[#FF6A00]" />
                <h3 className="text-xl font-semibold mb-3">E-commerce</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span>Plataforma de vendas completa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span>Integração com gateways de pagamento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span>Sistema de gestão de estoque</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span>Painel administrativo intuitivo</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#FF6A00] transition-all hover:shadow-xl">
              <CardContent className="pt-6">
                <Zap className="w-12 h-12 mb-4 text-[#FF6A00]" />
                <h3 className="text-xl font-semibold mb-3">Landing Pages</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span>Foco em conversão de leads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span>Carregamento ultra-rápido</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span>Formulários e chamadas para ação</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span>Análise de métricas integrada</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Processo de Trabalho */}
          <div className="bg-muted/40 rounded-2xl p-8 md:p-12 mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center">Nosso Processo de Desenvolvimento</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FF6A00] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
                <h4 className="font-semibold mb-2">Planejamento</h4>
                <p className="text-sm text-muted-foreground">Análise de requisitos e definição de escopo</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FF6A00] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
                <h4 className="font-semibold mb-2">Design</h4>
                <p className="text-sm text-muted-foreground">Criação de layouts e protótipos interativos</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FF6A00] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
                <h4 className="font-semibold mb-2">Desenvolvimento</h4>
                <p className="text-sm text-muted-foreground">Programação com tecnologias modernas</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#FF6A00] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">4</div>
                <h4 className="font-semibold mb-2">Entrega</h4>
                <p className="text-sm text-muted-foreground">Testes, otimização e publicação</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* E-mail Corporativo Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Mail className="w-16 h-16 mx-auto mb-4 text-[#FF6A00]" />
            <h2 className="text-3xl font-bold mb-4">E-mail Corporativo Profissional</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transmita credibilidade com endereços personalizados do seu domínio. Infraestrutura robusta e segura para comunicação empresarial.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-2">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-8 h-8 text-[#FF6A00]" />
                  Recursos Incluídos
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span><strong>Domínio Personalizado:</strong> seu@suaempresa.com.br</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span><strong>Armazenamento Amplo:</strong> Planos de 10GB até 100GB por caixa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span><strong>Proteção Avançada:</strong> Antispam, antivírus e anti-phishing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span><strong>Acesso Universal:</strong> Webmail, aplicativos desktop e mobile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span><strong>Sincronização Total:</strong> Contatos, calendários e tarefas</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Users className="w-8 h-8 text-[#FF6A00]" />
                  Vantagens Corporativas
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span><strong>Profissionalismo:</strong> Imagem corporativa consolidada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span><strong>Backup Automático:</strong> Seus dados sempre protegidos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span><strong>Suporte Dedicado:</strong> Atendimento técnico em português</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span><strong>Migração Incluída:</strong> Transferimos seus e-mails atuais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-0.5 flex-shrink-0" />
                    <span><strong>Flexibilidade:</strong> Adicione ou remova contas quando necessário</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Por Que Escolher a Delta7?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center border-2 hover:border-[#FF6A00] transition-all">
              <CardContent className="pt-8">
                <HeadphonesIcon className="w-12 h-12 mx-auto mb-4 text-[#FF6A00]" />
                <h3 className="text-xl font-semibold mb-2">Suporte Completo</h3>
                <p className="text-muted-foreground">
                  Configuração, migração e treinamento inclusos no serviço
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-[#FF6A00] transition-all">
              <CardContent className="pt-8">
                <Clock className="w-12 h-12 mx-auto mb-4 text-[#FF6A00]" />
                <h3 className="text-xl font-semibold mb-2">Entregas no Prazo</h3>
                <p className="text-muted-foreground">
                  Cronogramas realistas e cumprimento rigoroso de prazos
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-[#FF6A00] transition-all">
              <CardContent className="pt-8">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-[#FF6A00]" />
                <h3 className="text-xl font-semibold mb-2">Resultados Mensuráveis</h3>
                <p className="text-muted-foreground">
                  Acompanhamento de métricas e otimização contínua
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#FF6A00] to-red-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Transformar sua Presença Digital?
          </h2>
          <p className="text-xl mb-8 text-orange-50">
            Entre em contato e descubra como podemos impulsionar seu negócio online
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-[#FF6A00] hover:bg-gray-100 text-lg px-8 py-6 h-auto"
              asChild
            >
              <a href="/#contato">
                Solicitar Orçamento
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto"
              asChild
            >
              <a href="https://www.app.delta7tecnologia.com.br/front/login.php">
                Falar com Especialista
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesenvolvimentoWeb;
