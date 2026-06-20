import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Clock, MapPin, Smartphone, ShieldCheck, FileText, Users,
  CheckCircle, Fingerprint, BarChart3, Bell, Scale, ExternalLink, Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageTransition from '@/components/PageTransition';

const SYSTEM_URL = 'https://ponto.delta7tecnologia.com.br/v2/login';
const WHATSAPP = 'https://wa.me/5591982370332?text=Ol%C3%A1!%20Tenho%20interesse%20no%20sistema%20de%20Ponto%20Eletr%C3%B4nico%20Delta7.';

const PontoEletronico = () => {
  const features = [
    { icon: <Smartphone className="w-6 h-6" />, title: 'Registro pelo celular', desc: 'App e web responsivo — colaboradores batem ponto de qualquer lugar autorizado.' },
    { icon: <MapPin className="w-6 h-6" />, title: 'Geolocalização e cerca virtual', desc: 'Garanta que o registro só ocorra dentro das áreas permitidas pela empresa.' },
    { icon: <Fingerprint className="w-6 h-6" />, title: 'Reconhecimento facial', desc: 'Anti-fraude com biometria facial e validação de selfie em tempo real.' },
    { icon: <FileText className="w-6 h-6" />, title: 'Espelho de ponto e AFD', desc: 'Relatórios e exportação no padrão exigido pela legislação brasileira.' },
    { icon: <Bell className="w-6 h-6" />, title: 'Alertas e justificativas', desc: 'Notificações automáticas de atrasos, faltas, horas extras e ajustes.' },
    { icon: <BarChart3 className="w-6 h-6" />, title: 'Dashboards de gestão', desc: 'Visão consolidada de jornada, banco de horas e produtividade por equipe.' },
  ];

  const benefits = [
    'Conformidade com a Portaria MTP 671/2021 e CLT',
    'Redução de fraudes e passivos trabalhistas',
    'Aprovações de ajustes pelo gestor em poucos cliques',
    'Integração com folha de pagamento',
    'Suporte técnico Delta7 incluído',
    'Implantação e treinamento da equipe',
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <SEOHead
          title="Ponto Eletrônico Online | Delta7 Tecnologia"
          description="Sistema de ponto eletrônico digital com biometria facial, geolocalização, AFD e gestão de jornada conforme a Portaria 671. Solução Delta7 para sua empresa."
        />
        <Navigation />

        {/* Hero */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div className="text-center text-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 mb-6">Gestão de Jornada</Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Ponto Eletrônico{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">100% Digital</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Controle de jornada moderno, em conformidade com a Portaria 671, com biometria facial,
                geolocalização e relatórios prontos para a fiscalização.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                    Solicitar Demonstração <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white bg-white/10 text-white hover:bg-white hover:text-blue-700 backdrop-blur-sm" asChild>
                  <a href={SYSTEM_URL} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-5 w-5" /> Acessar Sistema
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Breadcrumbs items={[{ label: 'Soluções', href: '/solucoes' }, { label: 'Ponto Eletrônico' }]} />

        {/* Features */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="bg-blue-100 text-blue-700 mb-4">Recursos</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Tudo que sua empresa precisa para controlar a jornada</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Plataforma completa hospedada na infraestrutura segura da Delta7.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Card className="h-full hover:shadow-lg transition-all border-0 shadow-md">
                    <CardHeader>
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-3">{f.icon}</div>
                      <CardTitle className="text-lg">{f.title}</CardTitle>
                      <CardDescription>{f.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-green-100 text-green-700 mb-4">Por que Delta7</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Conformidade legal e tranquilidade para o RH</h2>
              <p className="text-lg text-gray-600 mb-6">
                Nosso ponto eletrônico foi desenhado para atender as exigências da legislação trabalhista brasileira,
                eliminando planilhas, fraudes e o risco de autuações.
              </p>
              <ul className="space-y-3">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Scale className="w-7 h-7" />, label: 'Portaria 671' },
                { icon: <ShieldCheck className="w-7 h-7" />, label: 'Anti-fraude' },
                { icon: <Clock className="w-7 h-7" />, label: 'Tempo real' },
                { icon: <Users className="w-7 h-7" />, label: 'Multi-empresa' },
              ].map((c, i) => (
                <Card key={i} className="p-6 text-center border-blue-100 bg-blue-50/40">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-3 shadow-sm">{c.icon}</div>
                  <p className="font-semibold text-gray-800">{c.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Modernize o controle de ponto da sua empresa</h2>
            <p className="text-xl text-blue-100 mb-8">Fale com um especialista Delta7 e receba uma proposta personalizada.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50" asChild>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                  <Phone className="mr-2 h-5 w-5" /> Solicitar Proposta
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white bg-white/10 text-white hover:bg-white hover:text-blue-700 backdrop-blur-sm" asChild>
                <a href={SYSTEM_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-5 w-5" /> Acessar Sistema
                </a>
              </Button>
            </div>
            <p className="text-blue-100 text-sm mt-6">
              <Link to="/solucoes" className="underline hover:text-white">Conheça outras soluções Delta7</Link>
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default PontoEletronico;
