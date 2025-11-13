import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Cloud, Server, Shield, Database, HardDrive, Wrench, CheckCircle2, Zap, Lock, Clock, HeadphonesIcon, TrendingUp } from "lucide-react";

const InfraestruturaNuvem = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Cloud className="w-20 h-20 mx-auto mb-6 text-red-500" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              Infraestrutura em Nuvem Corporativa
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Soluções empresariais de cloud computing com alta disponibilidade, segurança e desempenho para sua operação crítica
            </p>
          </div>
        </div>
      </section>

      {/* Serviços Principais */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Serviços</h2>
          
          <div className="space-y-8">
            {/* Servidores VPS */}
            <Card className="border-2 hover:border-red-500 transition-all">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="bg-red-100 p-4 rounded-lg">
                    <Server className="w-10 h-10 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">Servidores VPS</h3>
                    <p className="text-gray-600 mb-4">
                      Servidores virtuais privados com recursos dedicados e desempenho garantido para suas aplicações
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Painel Intuitivo:</strong> Gerenciamento completo via interface web</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Backup Automático:</strong> Snapshots programados e restauração rápida</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Escalabilidade:</strong> Recursos ajustáveis conforme demanda</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Suporte Dedicado:</strong> Atendimento técnico especializado</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Backup em Nuvem */}
            <Card className="border-2 hover:border-red-500 transition-all">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="bg-red-100 p-4 rounded-lg">
                    <Shield className="w-10 h-10 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">Backup em Nuvem</h3>
                    <p className="text-gray-600 mb-4">
                      Proteção total dos seus dados críticos com redundância geográfica e criptografia de nível empresarial
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Armazenamento Seguro:</strong> Redundância em múltiplos datacenters</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Criptografia:</strong> Dados protegidos em trânsito e repouso</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Restauração Rápida:</strong> Recuperação de dados em minutos</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Versionamento:</strong> Múltiplas versões de arquivos disponíveis</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Servidores Dedicados */}
            <Card className="border-2 hover:border-red-500 transition-all">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="bg-red-100 p-4 rounded-lg">
                    <HardDrive className="w-10 h-10 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">Servidores Dedicados</h3>
                    <p className="text-gray-600 mb-4">
                      Hardware exclusivo de alto desempenho para aplicações que exigem máxima potência e estabilidade
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Hardware Exclusivo:</strong> Servidores de última geração dedicados</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Monitoramento 24h:</strong> Supervisão contínua de desempenho</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Suporte Técnico:</strong> Equipe especializada disponível sempre</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>SLA Garantido:</strong> Uptime de 99.95% com compensação</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Colocation */}
            <Card className="border-2 hover:border-red-500 transition-all">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="bg-red-100 p-4 rounded-lg">
                    <Database className="w-10 h-10 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">Colocation</h3>
                    <p className="text-gray-600 mb-4">
                      Hospede seus próprios equipamentos em nossa infraestrutura de datacenter certificada e segura
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Energia Redundante:</strong> Múltiplos geradores e no-breaks</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Conectividade:</strong> Links de alta velocidade redundantes</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Segurança 24h:</strong> Controle de acesso e videomonitoramento</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Climatização:</strong> Temperatura e umidade controladas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Armazenamento S3 */}
            <Card className="border-2 hover:border-red-500 transition-all">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="bg-red-100 p-4 rounded-lg">
                    <Cloud className="w-10 h-10 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">Armazenamento em Nuvem S3</h3>
                    <p className="text-gray-600 mb-4">
                      Armazenamento de objetos escalável e compatível com protocolo S3 para aplicações modernas
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Compatibilidade S3:</strong> APIs compatíveis com Amazon S3</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Acesso via API:</strong> Integração simplificada com aplicações</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Integração Backup:</strong> Compatible com soluções de backup</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Escalabilidade:</strong> Capacidade sob demanda ilimitada</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Soluções Personalizadas */}
            <Card className="border-2 hover:border-red-500 transition-all">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="bg-red-100 p-4 rounded-lg">
                    <Wrench className="w-10 h-10 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">Soluções Personalizadas</h3>
                    <p className="text-gray-600 mb-4">
                      Projetos customizados desenvolvidos especificamente para as necessidades da sua empresa
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Análise Técnica:</strong> Avaliação detalhada das necessidades</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Dimensionamento:</strong> Recursos calculados sob medida</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Implantação:</strong> Deploy assistido pela equipe técnica</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700"><strong>Otimização:</strong> Ajustes contínuos de performance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Diferenciais</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-red-500 transition-all">
              <CardContent className="pt-6 text-center">
                <HeadphonesIcon className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold mb-2">Suporte Técnico Especializado</h3>
                <p className="text-gray-600">
                  Equipe certificada disponível para resolver questões técnicas complexas
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-red-500 transition-all">
              <CardContent className="pt-6 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold mb-2">Serviços Escaláveis</h3>
                <p className="text-gray-600">
                  Expanda ou reduza recursos conforme a demanda do seu negócio
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-red-500 transition-all">
              <CardContent className="pt-6 text-center">
                <Zap className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold mb-2">Alta Disponibilidade</h3>
                <p className="text-gray-600">
                  Datacenters com infraestrutura redundante e SLA garantido
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-red-500 transition-all">
              <CardContent className="pt-6 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold mb-2">Pagamento Nacional</h3>
                <p className="text-gray-600">
                  Faturamento em reais sem IOF ou variação cambial
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-red-500 transition-all">
              <CardContent className="pt-6 text-center">
                <Lock className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold mb-2">Segurança Avançada</h3>
                <p className="text-gray-600">
                  Proteção em múltiplas camadas com certificações internacionais
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-red-500 transition-all">
              <CardContent className="pt-6 text-center">
                <Server className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold mb-2">Atendimento Consultivo</h3>
                <p className="text-gray-600">
                  Consultoria técnica para escolher a melhor solução
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Modernizar Sua Infraestrutura?
          </h2>
          <p className="text-xl mb-8 text-red-50">
            Fale com nossos especialistas e descubra a solução ideal para seu negócio
          </p>
          <Button 
            size="lg" 
            className="bg-white text-red-500 hover:bg-gray-100 text-lg px-8 py-6 h-auto"
            asChild
          >
            <a href="/#contato">Solicitar Orçamento</a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default InfraestruturaNuvem;
