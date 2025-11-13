import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Code2, Mail, Globe, Smartphone, ShieldCheck, Zap, Users, HeadphonesIcon } from "lucide-react";

const DesenvolvimentoWeb = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              Desenvolvimento Web & E-mail Corporativo
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Soluções completas para sua presença digital: sites profissionais e infraestrutura de e-mail corporativo robusta e confiável.
            </p>
          </div>
        </div>
      </section>

      {/* Desenvolvimento Web Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Globe className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-3xl font-bold mb-4">Desenvolvimento de Sites</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Criamos sites modernos, responsivos e otimizados para seu negócio crescer na internet
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="border-2 hover:border-red-500 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <Code2 className="w-12 h-12 mb-4 text-red-500" />
                <h3 className="text-xl font-semibold mb-3">Sites Institucionais</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Design moderno e profissional</li>
                  <li>• Totalmente responsivo</li>
                  <li>• SEO otimizado</li>
                  <li>• Integração com redes sociais</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-red-500 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <Smartphone className="w-12 h-12 mb-4 text-red-500" />
                <h3 className="text-xl font-semibold mb-3">E-commerce</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Loja virtual completa</li>
                  <li>• Gateway de pagamento</li>
                  <li>• Gestão de estoque</li>
                  <li>• Painel administrativo</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-red-500 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <Zap className="w-12 h-12 mb-4 text-red-500" />
                <h3 className="text-xl font-semibold mb-3">Landing Pages</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Alta conversão</li>
                  <li>• Carregamento rápido</li>
                  <li>• Formulários integrados</li>
                  <li>• Analytics configurado</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* E-mail Corporativo Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Mail className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-3xl font-bold mb-4">E-mail Corporativo</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Infraestrutura profissional de e-mail com seu domínio próprio, garantindo credibilidade e segurança
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-red-500" />
                Recursos Principais
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✓</span>
                  <span><strong>Domínio Personalizado:</strong> seu@suaempresa.com.br</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✓</span>
                  <span><strong>Armazenamento Generoso:</strong> Planos de 10GB a 100GB por caixa</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✓</span>
                  <span><strong>Antispam Avançado:</strong> Proteção contra vírus e phishing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✓</span>
                  <span><strong>Acesso Multiplataforma:</strong> Webmail, desktop e mobile</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✓</span>
                  <span><strong>Sincronização:</strong> Contatos e calendários integrados</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Users className="w-8 h-8 text-red-500" />
                Benefícios Corporativos
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✓</span>
                  <span><strong>Credibilidade Profissional:</strong> Transmita confiança aos clientes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✓</span>
                  <span><strong>Backup Automático:</strong> Seus e-mails sempre seguros</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✓</span>
                  <span><strong>Suporte Técnico:</strong> Atendimento especializado em português</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✓</span>
                  <span><strong>Migração Gratuita:</strong> Transferimos seus e-mails atuais</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✓</span>
                  <span><strong>Escalável:</strong> Adicione ou remova contas conforme necessário</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <HeadphonesIcon className="w-12 h-12" />
              <div>
                <h3 className="text-2xl font-bold">Suporte Completo</h3>
                <p className="text-red-100">Configuração, migração e treinamento inclusos</p>
              </div>
            </div>
            <p className="mb-6">
              Nossa equipe técnica está pronta para configurar seu e-mail corporativo, migrar suas mensagens existentes e treinar sua equipe para utilizar todas as funcionalidades disponíveis.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para Crescer Online?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Entre em contato e descubra como podemos impulsionar sua presença digital
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white" asChild>
              <a href="/#contato">Solicitar Orçamento</a>
            </Button>
            <Button size="lg" variant="outline" className="border-red-500 text-red-500 hover:bg-red-50" asChild>
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
