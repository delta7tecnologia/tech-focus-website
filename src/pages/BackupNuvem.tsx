import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Cloud, ShieldCheck, Lock, RefreshCw, Server, HardDrive,
  CheckCircle, Database, Bell, Globe, Clock, ExternalLink, Phone, FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageTransition from '@/components/PageTransition';

const SYSTEM_URL = 'https://backup.delta7tecnologia.com.br/';
const WHATSAPP = 'https://wa.me/5591982370332?text=Ol%C3%A1!%20Tenho%20interesse%20no%20Backup%20em%20Nuvem%20Delta7.';

const BackupNuvem = () => {
  const features = [
    { icon: <RefreshCw className="w-6 h-6" />, title: 'Backup automatizado', desc: 'Agendamentos diários, incrementais e completos sem intervenção manual.' },
    { icon: <Lock className="w-6 h-6" />, title: 'Criptografia ponta a ponta', desc: 'Seus dados são cifrados antes do envio e mantidos seguros em repouso.' },
    { icon: <Database className="w-6 h-6" />, title: 'Servidores, VMs e arquivos', desc: 'Compatível com Windows, Linux, Hyper-V, VMware, bancos SQL e arquivos.' },
    { icon: <Cloud className="w-6 h-6" />, title: 'Armazenamento em nuvem', desc: 'Infraestrutura redundante em datacenters nacionais com alta disponibilidade.' },
    { icon: <Bell className="w-6 h-6" />, title: 'Monitoramento 24x7', desc: 'Equipe Delta7 acompanha cada job e age proativamente em caso de falha.' },
    { icon: <FileCheck className="w-6 h-6" />, title: 'Testes de restauração', desc: 'Validamos periodicamente a integridade dos seus backups e do plano de DR.' },
  ];

  const benefits = [
    'Proteção contra ransomware e exclusão acidental',
    'Retenção configurável (diária, semanal, mensal)',
    'Conformidade com LGPD',
    'Disaster Recovery e RTO/RPO definidos',
    'Suporte técnico especializado Delta7',
    'Painel web para acompanhamento em tempo real',
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <SEOHead
          title="Backup em Nuvem Corporativo | Delta7 Tecnologia"
          description="Backup em nuvem gerenciado para empresas: automatizado, criptografado e com disaster recovery. Proteja servidores, VMs e arquivos com a Delta7."
        />
        <Navigation />

        {/* Hero */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div className="text-center text-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 mb-6">Proteção de Dados</Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Backup em Nuvem{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Gerenciado</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Continuidade do negócio garantida. Seus dados protegidos contra ransomware, falhas de hardware
                e desastres, com monitoramento e restauração assistida pela Delta7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700" asChild>
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                    Solicitar Proposta <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white bg-white/10 text-white hover:bg-white hover:text-cyan-700 backdrop-blur-sm" asChild>
                  <a href={SYSTEM_URL} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-5 w-5" /> Acessar Sistema
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Breadcrumbs items={[{ label: 'Soluções', href: '/solucoes' }, { label: 'Backup em Nuvem' }]} />

        {/* Features */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="bg-cyan-100 text-cyan-700 mb-4">Recursos</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Backup profissional, sem dor de cabeça</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Plataforma robusta com gestão e suporte feitos pela equipe Delta7.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Card className="h-full hover:shadow-lg transition-all border-0 shadow-md">
                    <CardHeader>
                      <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600 mb-3">{f.icon}</div>
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
            <div className="grid grid-cols-2 gap-4 order-2 lg:order-1">
              {[
                { icon: <ShieldCheck className="w-7 h-7" />, label: 'LGPD' },
                { icon: <Server className="w-7 h-7" />, label: 'Servidores' },
                { icon: <HardDrive className="w-7 h-7" />, label: 'VMs & Bancos' },
                { icon: <Globe className="w-7 h-7" />, label: 'Datacenter BR' },
              ].map((c, i) => (
                <Card key={i} className="p-6 text-center border-cyan-100 bg-cyan-50/40">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-cyan-600 mx-auto mb-3 shadow-sm">{c.icon}</div>
                  <p className="font-semibold text-gray-800">{c.label}</p>
                </Card>
              ))}
            </div>
            <div className="order-1 lg:order-2">
              <Badge className="bg-green-100 text-green-700 mb-4">Por que Delta7</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Continuidade do negócio com plano de recuperação</h2>
              <p className="text-lg text-gray-600 mb-6">
                Não basta copiar dados — é preciso garantir que estarão íntegros e recuperáveis quando você mais precisar.
                Nossa equipe cuida do ciclo completo do backup à restauração.
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
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-cyan-600 to-teal-700 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Proteja agora os dados da sua empresa</h2>
            <p className="text-xl text-cyan-100 mb-8">Receba um diagnóstico gratuito e uma proposta sob medida da Delta7.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-cyan-700 hover:bg-cyan-50" asChild>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                  <Phone className="mr-2 h-5 w-5" /> Falar com Especialista
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white bg-white/10 text-white hover:bg-white hover:text-cyan-700 backdrop-blur-sm" asChild>
                <a href={SYSTEM_URL} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-5 w-5" /> Acessar Sistema
                </a>
              </Button>
            </div>
            <p className="text-cyan-100 text-sm mt-6">
              <Link to="/solucoes" className="underline hover:text-white">Conheça outras soluções Delta7</Link>
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default BackupNuvem;
