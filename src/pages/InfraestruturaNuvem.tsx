import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Cloud, Server, Shield, Database, HardDrive, Wrench, CheckCircle2, Zap, Lock, Clock, HeadphonesIcon, TrendingUp, ArrowRight, Layers, Copy } from "lucide-react";

const InfraestruturaNuvem = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Cloud className="w-20 h-20 mx-auto mb-6 text-[#FF6A00]" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#FF6A00] to-red-600 bg-clip-text text-transparent">
              Infraestrutura em Nuvem Corporativa
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Soluções empresariais de cloud computing com alta disponibilidade, segurança robusta e desempenho garantido para operações críticas de negócio
            </p>
          </div>
        </div>
      </section>

      {/* Serviços Principais */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Serviços em Nuvem</h2>
          
          <div className="space-y-8">
            {/* Servidores VPS */}
            <Card className="border-2 hover:border-[#FF6A00] transition-all hover:shadow-xl">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                    <Server className="w-10 h-10 text-[#FF6A00]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">Servidores VPS (Virtual Private Server)</h3>
                    <p className="text-muted-foreground mb-4">
                      Servidores virtuais privados com recursos dedicados, desempenho garantido e isolamento completo para hospedar suas aplicações críticas
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Painel Intuitivo:</strong> Gerenciamento completo via interface web amigável</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Backup Automático:</strong> Snapshots programados e restauração instantânea</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Escalabilidade:</strong> Aumente recursos sem downtime conforme necessário</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Suporte Dedicado:</strong> Especialistas disponíveis para suporte técnico</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Virtualização e Replicação */}
            <Card className="border-2 hover:border-[#FF6A00] transition-all hover:shadow-xl">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                    <Layers className="w-10 h-10 text-[#FF6A00]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">Virtualização Empresarial</h3>
                    <p className="text-muted-foreground mb-4">
                      Ambientes virtualizados completos com tecnologias de ponta para máxima eficiência operacional e redução de custos
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Proxmox VE:</strong> Plataforma open-source enterprise-grade</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Alta Disponibilidade:</strong> Cluster HA com failover automático</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Replicação:</strong> Sincronização contínua entre datacenters</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Live Migration:</strong> Mova VMs entre hosts sem interrupção</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Snapshots e Backup */}
            <Card className="border-2 hover:border-[#FF6A00] transition-all hover:shadow-xl">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                    <Copy className="w-10 h-10 text-[#FF6A00]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">Snapshots e Backup em Nuvem</h3>
                    <p className="text-muted-foreground mb-4">
                      Proteção total dos seus dados com múltiplas camadas de backup, versionamento inteligente e recuperação granular
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Snapshots Instantâneos:</strong> Capturas de estado em segundos</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Backup Incremental:</strong> Otimizado para economizar espaço</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Restauração Rápida:</strong> Recupere dados em minutos, não horas</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Versionamento:</strong> Mantenha múltiplas versões históricas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Servidores Dedicados */}
            <Card className="border-2 hover:border-[#FF6A00] transition-all hover:shadow-xl">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                    <HardDrive className="w-10 h-10 text-[#FF6A00]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">Servidores Dedicados</h3>
                    <p className="text-muted-foreground mb-4">
                      Hardware exclusivo de alto desempenho para aplicações que exigem máxima potência computacional, memória e armazenamento
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Hardware Premium:</strong> Servidores enterprise de última geração</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Monitoramento 24/7:</strong> Supervisão contínua de performance e saúde</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>SLA Garantido:</strong> Uptime de 99.95% com compensação contratual</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Acesso Root:</strong> Controle total sobre o ambiente</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Colocation */}
            <Card className="border-2 hover:border-[#FF6A00] transition-all hover:shadow-xl">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                    <Database className="w-10 h-10 text-[#FF6A00]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">Colocation (Hospedagem de Equipamentos)</h3>
                    <p className="text-muted-foreground mb-4">
                      Mantenha seus próprios servidores em nossa infraestrutura de datacenter certificada, segura e redundante
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Energia Redundante:</strong> Múltiplos geradores e sistemas UPS</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Conectividade Premium:</strong> Links de fibra de alta velocidade</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Segurança Física:</strong> Controle biométrico e vigilância 24h</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Climatização:</strong> Controle preciso de temperatura e umidade</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Armazenamento S3 */}
            <Card className="border-2 hover:border-[#FF6A00] transition-all hover:shadow-xl">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                    <Cloud className="w-10 h-10 text-[#FF6A00]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">Armazenamento em Nuvem S3</h3>
                    <p className="text-muted-foreground mb-4">
                      Object storage escalável e compatível com protocolo S3 para armazenamento massivo de dados não estruturados
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>API S3 Compatível:</strong> Funciona com ferramentas padrão de mercado</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Integração Simples:</strong> SDKs para todas as linguagens</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Durabilidade:</strong> Redundância geográfica dos dados</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Escalabilidade Ilimitada:</strong> Cresça sem preocupações</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Soluções Personalizadas */}
            <Card className="border-2 hover:border-[#FF6A00] transition-all hover:shadow-xl">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                    <Wrench className="w-10 h-10 text-[#FF6A00]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">Soluções Personalizadas</h3>
                    <p className="text-muted-foreground mb-4">
                      Arquiteturas customizadas desenvolvidas especificamente para atender aos requisitos únicos do seu negócio
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Análise Profunda:</strong> Levantamento completo de necessidades</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Arquitetura Sob Medida:</strong> Design específico para seu caso</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Implantação Assistida:</strong> Deploy completo pela equipe técnica</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6A00] mt-1 flex-shrink-0" />
                        <span><strong>Otimização Contínua:</strong> Ajustes e melhorias constantes</span>
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
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Diferenciais Competitivos</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-[#FF6A00] transition-all text-center">
              <CardContent className="pt-8">
                <HeadphonesIcon className="w-12 h-12 mx-auto mb-4 text-[#FF6A00]" />
                <h3 className="text-xl font-semibold mb-2">Suporte Técnico Especializado</h3>
                <p className="text-muted-foreground">
                  Equipe certificada com expertise em infraestrutura cloud corporativa
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#FF6A00] transition-all text-center">
              <CardContent className="pt-8">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-[#FF6A00]" />
                <h3 className="text-xl font-semibold mb-2">Serviços Escaláveis</h3>
                <p className="text-muted-foreground">
                  Expanda ou reduza recursos sob demanda conforme seu negócio
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#FF6A00] transition-all text-center">
              <CardContent className="pt-8">
                <Zap className="w-12 h-12 mx-auto mb-4 text-[#FF6A00]" />
                <h3 className="text-xl font-semibold mb-2">Alta Disponibilidade</h3>
                <p className="text-muted-foreground">
                  Datacenters redundantes com SLA de 99.95% de uptime garantido
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#FF6A00] transition-all text-center">
              <CardContent className="pt-8">
                <Clock className="w-12 h-12 mx-auto mb-4 text-[#FF6A00]" />
                <h3 className="text-xl font-semibold mb-2">Pagamento Nacional</h3>
                <p className="text-muted-foreground">
                  Faturamento em reais sem IOF ou oscilação cambial
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#FF6A00] transition-all text-center">
              <CardContent className="pt-8">
                <Lock className="w-12 h-12 mx-auto mb-4 text-[#FF6A00]" />
                <h3 className="text-xl font-semibold mb-2">Segurança Avançada</h3>
                <p className="text-muted-foreground">
                  Proteção multicamadas com certificações internacionais
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-[#FF6A00] transition-all text-center">
              <CardContent className="pt-8">
                <Server className="w-12 h-12 mx-auto mb-4 text-[#FF6A00]" />
                <h3 className="text-xl font-semibold mb-2">Atendimento Consultivo</h3>
                <p className="text-muted-foreground">
                  Consultoria para dimensionar a solução ideal ao seu negócio
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
            Modernize Sua Infraestrutura de TI
          </h2>
          <p className="text-xl mb-8 text-orange-50">
            Fale com nossos especialistas e descubra a solução ideal para impulsionar seu negócio
          </p>
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
        </div>
      </section>
    </div>
  );
};

export default InfraestruturaNuvem;
