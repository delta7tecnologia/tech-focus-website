import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import PageTransition from '@/components/PageTransition';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

type QA = { q: string; a: string };
type Group = { title: string; items: QA[] };

const groups: Group[] = [
  {
    title: 'Suporte Técnico',
    items: [
      { q: 'Qual o tempo de resposta para chamados de suporte?', a: 'Nosso SLA padrão é de até 4 horas para o primeiro contato. Clientes com contrato premium contam com resposta em até 30 minutos e atendimento 24/7.' },
      { q: 'Vocês fazem atendimento presencial ou apenas remoto?', a: 'Atendemos presencialmente em Parauapebas-PA e região, e remotamente em todo o Brasil com ferramentas seguras como AnyDesk e RustDesk.' },
      { q: 'É possível contratar suporte avulso, sem mensalidade?', a: 'Sim. Trabalhamos com pacotes de horas técnicas avulsas, ideais para empresas que precisam de demandas pontuais sem contrato mensal.' },
      { q: 'Quais sistemas operacionais vocês suportam?', a: 'Damos suporte a Windows, Windows Server, Linux (várias distribuições), macOS, além de virtualização Proxmox/VMware e ambientes em nuvem.' },
    ],
  },
  {
    title: 'Cloud e Infraestrutura',
    items: [
      { q: 'Vocês oferecem migração de servidores para nuvem?', a: 'Sim. Planejamos e executamos migrações para nuvem pública (AWS, Azure, GCP) e nuvem privada (Proxmox/Hyper-V), com janelas de manutenção mínimas e plano de rollback.' },
      { q: 'Trabalham com virtualização Proxmox?', a: 'Sim, somos especialistas em Proxmox VE: implantação, clusters HA, backup integrado (Proxmox Backup Server) e migração de VMware/Hyper-V para Proxmox.' },
      { q: 'É possível ter um datacenter privado na empresa?', a: 'Sim. Projetamos infraestruturas on-premise com servidores físicos, storage, switches gerenciáveis e redundância adequada ao porte do negócio.' },
    ],
  },
  {
    title: 'Segurança e LGPD',
    items: [
      { q: 'Como funciona a adequação à LGPD?', a: 'Fazemos diagnóstico de maturidade, mapeamento de dados, implementação de controles técnicos (criptografia, logs, controle de acesso), políticas e treinamento da equipe.' },
      { q: 'Quais soluções de firewall e segurança vocês implementam?', a: 'PfSense, OPNsense e firewalls UTM corporativos, com VPN site-to-site, IDS/IPS, filtro de conteúdo e segmentação de rede.' },
      { q: 'Vocês monitoram ataques e tentativas de invasão?', a: 'Sim. Implantamos Wazuh (SIEM/XDR) para detecção em tempo real, com alertas integrados aos canais de comunicação da equipe.' },
    ],
  },
  {
    title: 'Backup em Nuvem',
    items: [
      { q: 'O backup em nuvem é seguro?', a: 'Sim. Usamos criptografia AES-256 em trânsito e em repouso, datacenters brasileiros (LGPD) e retenção configurável por política.' },
      { q: 'Em quanto tempo consigo restaurar meus dados?', a: 'Dependendo do volume, restauramos arquivos individuais em minutos e servidores completos em poucas horas. Definimos RTO/RPO em contrato.' },
      { q: 'O backup roda automaticamente todos os dias?', a: 'Sim. Configuramos agendamentos diários (ou de frequência menor) com verificação automática de integridade e alerta em caso de falha.' },
    ],
  },
  {
    title: 'Monitoramento 24x7',
    items: [
      { q: 'Como funciona o monitoramento Zabbix/Grafana?', a: 'Coletamos métricas de servidores, switches, links de internet, serviços e aplicações, com alertas automáticos por e-mail/Telegram e dashboards customizados em Grafana.' },
      { q: 'Recebo um relatório mensal de disponibilidade?', a: 'Sim. Clientes com contrato de monitoramento recebem relatórios mensais com SLA, incidentes e plano de ação.' },
    ],
  },
  {
    title: 'Comercial e Contratos',
    items: [
      { q: 'Vocês atendem empresas de qual porte?', a: 'Atendemos desde escritórios com 5 usuários até empresas com mais de 500 colaboradores. As soluções são escaláveis e adaptadas à realidade de cada cliente.' },
      { q: 'Como é feita a precificação dos contratos?', a: 'Avaliamos o ambiente (usuários, servidores, complexidade) e enviamos proposta personalizada. Não trabalhamos com tabela fixa para garantir o melhor custo-benefício.' },
      { q: 'Posso cancelar o contrato a qualquer momento?', a: 'Os contratos têm vigência mínima conforme acordado em proposta, com aviso prévio de cancelamento. Buscamos sempre flexibilidade junto ao cliente.' },
    ],
  },
];

const FAQ = () => {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: groups.flatMap((g) =>
      g.items.map((it) => ({
        '@type': 'Question',
        name: it.q,
        acceptedAnswer: { '@type': 'Answer', text: it.a },
      }))
    ),
  };

  return (
    <PageTransition>
      <div className="min-h-screen">
        <SEOHead
          title="Perguntas Frequentes (FAQ) | Delta7 Tecnologia"
          description="Tire suas dúvidas sobre suporte técnico, cloud, segurança, backup, LGPD e monitoramento de TI para empresas com a Delta7 Tecnologia."
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <Navigation />

        <section className="pt-24 pb-12 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-4">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Perguntas Frequentes</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Respostas sobre nossos serviços de TI, cloud, segurança e suporte técnico
            </p>
          </div>
        </section>

        <Breadcrumbs items={[{ label: 'FAQ' }]} />

        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {groups.map((group) => (
              <div key={group.title}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{group.title}</h2>
                <Accordion type="single" collapsible className="bg-gray-50 rounded-xl border border-gray-200">
                  {group.items.map((it, idx) => (
                    <AccordionItem key={idx} value={`${group.title}-${idx}`} className="border-b last:border-b-0 px-5">
                      <AccordionTrigger className="text-left text-gray-900 hover:no-underline">
                        {it.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 leading-relaxed">
                        {it.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Não encontrou sua resposta?</h2>
            <p className="text-gray-600 mb-6">Nossa equipe está pronta para te atender.</p>
            <a
              href="https://wa.me/5591982370332"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors font-semibold"
            >
              Falar com a Delta7
            </a>
          </div>
        </section>

        <Footer />
        <WhatsAppButton />
      </div>
    </PageTransition>
  );
};

export default FAQ;
