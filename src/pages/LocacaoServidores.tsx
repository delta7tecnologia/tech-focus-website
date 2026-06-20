import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Server, ShieldCheck, Zap, Wrench, Cpu, HardDrive,
  CheckCircle, Network, Clock, Phone, Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageTransition from '@/components/PageTransition';
import dellLogo from '@/assets/dell-expert-network.png';

const WHATSAPP = 'https://wa.me/5591982370332?text=Ol%C3%A1!%20Tenho%20interesse%20em%20Loca%C3%A7%C3%A3o%20de%20Servidores%20Dell%20Delta7.';

const LocacaoServidores = () => {
  const features = [
    { icon: <Cpu className="w-6 h-6" />, title: 'Servidores Dell PowerEdge', desc: 'Hardware corporativo de última geração com processadores Intel Xeon e AMD EPYC.' },
    { icon: <ShieldCheck className="w-6 h-6" />, title: 'Garantia Dell ProSupport', desc: 'Cobertura oficial Dell durante todo o contrato — peças e suporte inclusos.' },
    { icon: <Wrench className="w-6 h-6" />, title: 'Instalação e configuração', desc: 'Equipe Delta7 cuida da implantação, virtualização e migração do ambiente.' },
    { icon: <HardDrive className="w-6 h-6" />, title: 'Storage e RAID', desc: 'Discos SSD/NVMe corporativos com RAID configurado para alta performance.' },
    { icon: <Network className="w-6 h-6" />, title: 'Conectividade redundante', desc: 'Placas de rede 10GbE, iDRAC para gestão remota e fontes redundantes.' },
    { icon: <Clock className="w-6 h-6" />, title: 'Monitoramento 24x7', desc: 'Acompanhamento proativo via Zabbix/Grafana com SLA garantido.' },
  ];

  const benefits = [
    'Sem investimento inicial em hardware (CapEx → OpEx)',
    'Atualização tecnológica ao fim do contrato',
    'Custo mensal previsível, com NF para dedução fiscal',
    'Equipamentos novos com garantia integral Dell',
    'Substituição em caso de falha sem custo adicional',
    'Possibilidade de hospedar em datacenter Delta7 (colocation)',
  ];

  const useCases = [
    { title: 'Virtualização', desc: 'Hosts VMware, Proxmox ou Hyper-V para consolidar suas cargas.' },
    { title: 'Bancos de Dados', desc: 'SQL Server, Oracle, PostgreSQL com alta performance I/O.' },
    { title: 'ERP & Sistemas', desc: 'Servidores dedicados para Protheus, SAP, sistemas internos.' },
    { title: 'Arquivos & AD', desc: 'File server, Active Directory, impressão e compartilhamento.' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white">
        <SEOHead
          title="Locação de Servidores Dell | Delta7 Tecnologia"
          description="Locação de servidores Dell PowerEdge com garantia, suporte e gestão completa Delta7. Hardware corporativo sem investimento inicial, com SLA e monitoramento 24x7."
        />
        <Navigation />

        {/* Hero */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div className="text-center text-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 mb-6">Infraestrutura sob Demanda</Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Locação de{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Servidores Dell</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
                Servidores Dell PowerEdge novos, configurados e gerenciados pela Delta7.
                Tenha infraestrutura de classe mundial sem imobilizar capital.
              </p>

              {/* Dell Partner Logo */}
              <div className="inline-flex items-center gap-4 bg-white rounded-2xl px-6 py-4 mb-8 shadow-lg">
                <img src={dellLogo} alt="Dell Expert Network — Parceiro Oficial Dell Technologies" className="h-10 w-auto" />
                <div className="text-left border-l border-gray-200 pl-4">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Parceiro Oficial</p>
                  <p className="text-sm font-bold text-gray-900">Dell Technologies</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                    Solicitar Orçamento <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white bg-white/10 text-white hover:bg-white hover:text-blue-700 backdrop-blur-sm" asChild>
                  <a href="#recursos">Ver Recursos</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Breadcrumbs items={[{ label: 'Soluções', href: '/solucoes' }, { label: 'Locação de Servidores' }]} />

        {/* Features */}
        <section id="recursos" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge className="bg-blue-100 text-blue-700 mb-4">Recursos</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Hardware Dell, gestão Delta7</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Da especificação ao suporte: cuidamos de todo o ciclo de vida do seu servidor.
              </p>
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

        {/* Use Cases */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="bg-cyan-100 text-cyan-700 mb-4">Aplicações</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Para qualquer carga de trabalho</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((u, i) => (
                <Card key={i} className="p-6 text-center hover:shadow-lg transition-all border hover:border-blue-200">
                  <Server className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">{u.title}</h3>
                  <p className="text-sm text-gray-600">{u.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-green-100 text-green-700 mb-4">Por que locar</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Mais inteligência financeira para sua TI</h2>
              <p className="text-lg text-gray-600 mb-6">
                Transforme o custo de hardware em mensalidade previsível e ganhe agilidade para crescer
                sem preocupações com obsolescência.
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
                { icon: <Award className="w-7 h-7" />, label: 'Dell Partner' },
                { icon: <Zap className="w-7 h-7" />, label: 'Alta Performance' },
                { icon: <ShieldCheck className="w-7 h-7" />, label: 'Garantia Total' },
                { icon: <Clock className="w-7 h-7" />, label: 'SLA 24x7' },
              ].map((c, i) => (
                <Card key={i} className="p-6 text-center border-blue-100 bg-white">
                  <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-3">{c.icon}</div>
                  <p className="font-semibold text-gray-800">{c.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-blue-700 to-blue-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-block bg-white rounded-xl px-6 py-3 mb-6 shadow-lg">
              <img src={dellLogo} alt="Dell Technologies" className="h-10 w-auto" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Monte agora a configuração ideal</h2>
            <p className="text-xl text-blue-100 mb-8">
              Conte com a expertise Delta7 + a robustez Dell para dimensionar seu servidor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50" asChild>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                  <Phone className="mr-2 h-5 w-5" /> Falar com Especialista
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white bg-white/10 text-white hover:bg-white hover:text-blue-700 backdrop-blur-sm" asChild>
                <Link to="/solucoes">Ver Outras Soluções</Link>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default LocacaoServidores;
