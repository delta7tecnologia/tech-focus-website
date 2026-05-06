// Conteúdo fixo da Proposta Comercial de Backup Online
// Mantém a edição do Word eliminada — apenas dados do cliente mudam.

export const ABOUT_DELTA7 = `A Delta7 Tecnologia é uma empresa especializada em soluções de TI para pequenas e médias empresas. Há mais de 10 anos, transformamos a tecnologia em vantagem competitiva para nossos clientes.

Nossa metodologia de trabalho garante entregas precisas em todos os projetos, com desenvolvimento ágil e eficaz que proporciona uma experiência positiva. Investimos constantemente na especialização e atualização da nossa equipe.

Atuamos com atendimento remoto em todo o Brasil e presencial na região Norte, sempre focados em oferecer soluções sob medida que atendam às necessidades específicas de cada negócio.`;

// Paleta Navy & Slate (sem dourado)
export const PROP_COLORS = {
  navy: '#0a1f44',
  navyDeep: '#142a5c',
  gold: '#475569',      // alias mantido — agora slate
  goldLight: '#94a3b8', // alias mantido — agora slate claro
  cream: '#f1f5f9',     // slate-100
  ink: '#1a2540',
  muted: '#64748b',
  paper: '#f8fafc',
};

export const DELTA7_KPIS: { value: string; label: string }[] = [
  { value: '+10', label: 'anos de mercado' },
  { value: '99,9%', label: 'disponibilidade' },
  { value: '24/7', label: 'monitoramento' },
];

export const TECH_STACK: string[] = [
  'Microsoft', 'Veeam', 'Bitdefender', 'Linux', 'Hyper-V', 'MS SQL Server', 'Zabbix', 'Grafana',
];

export const INFRA_HIGHLIGHTS: { title: string; text: string; icon: 'lock' | 'cloud' | 'shield' | 'eye' }[] = [
  { icon: 'lock', title: 'Criptografia AES-256', text: 'Dados criptografados em trânsito e em repouso, garantindo confidencialidade ponta a ponta.' },
  { icon: 'cloud', title: 'Datacenter em solo nacional', text: 'Armazenamento dentro do território brasileiro, em conformidade com a LGPD.' },
  { icon: 'shield', title: 'Redundância de armazenamento', text: 'Múltiplas cópias dos seus dados em sistema redundante, protegendo contra falhas físicas.' },
  { icon: 'eye', title: 'Monitoramento contínuo', text: 'Acompanhamento 24/7 da infraestrutura com alertas proativos de falhas e violações.' },
];

export const BENEFIT_CARDS: { title: string; text: string; icon: 'platform' | 'cloud' | 'ransom' | 'auto' | 'retention' | 'panel' | 'bell' | 'support' }[] = [
  { icon: 'platform', title: 'Multiplataforma', text: 'Compatível com Windows, Linux e macOS.' },
  { icon: 'cloud', title: 'Backup em nuvem', text: 'Sem necessidade de equipamentos locais de armazenamento.' },
  { icon: 'ransom', title: 'Anti-Ransomware', text: 'Proteção contra perda por falhas, roubo ou desastres naturais.' },
  { icon: 'auto', title: 'Automatização total', text: 'Backups executados automaticamente, sem intervenção manual.' },
  { icon: 'retention', title: 'Controle de retenção', text: 'Recupere versões anteriores na data e horário desejados.' },
  { icon: 'panel', title: 'Painel centralizado', text: 'Gerenciamento remoto em plataforma dedicada e intuitiva.' },
  { icon: 'bell', title: 'Notificações automáticas', text: 'Alertas de cada execução de backup direto no seu e-mail.' },
  { icon: 'support', title: 'Suporte humano', text: 'Atendimento direto Delta7 via telefone e WhatsApp.' },
];

export const IDEAL_FOR: { title: string; text: string }[] = [
  { title: 'Empresa com servidor local', text: 'Quem possui ERP, banco de dados ou arquivos críticos em servidor físico ou virtualizado.' },
  { title: 'Ambiente Microsoft / SQL', text: 'Negócios que dependem de Windows Server, Hyper-V, MS SQL Server ou Active Directory.' },
  { title: 'Conformidade & LGPD', text: 'Empresas que precisam comprovar retenção, integridade e rastreabilidade dos dados.' },
  { title: 'Continuidade do negócio', text: 'Quem não pode parar e precisa restaurar rapidamente após incidentes ou ransomware.' },
];

export const INSTITUTIONAL_QUOTE = {
  text: 'Backup não é custo, é continuidade do negócio. Garantimos que seus dados estejam sempre seguros, acessíveis e prontos para restaurar — sem que você precise se preocupar.',
  author: 'Delta7 Tecnologia',
};

export const BACKUP_BENEFITS: string[] = [
  'Backup multiplataforma (Windows, Linux, MacOS)',
  'Backup em nuvem — sem necessidade de equipamentos locais para armazenamento',
  'Segurança Anti-Ransomware e proteção contra perda de dados (falhas de hardware, roubo ou desastres naturais)',
  'Automatização — backups realizados de forma automatizada',
  'Retenção — recupere o backup na data e horário desejados',
  'Gerenciamento remoto e centralizado em plataforma dedicada',
  'Notificações automáticas dos backups realizados',
];

export const NOT_INCLUDED = `Nesta proposta não estão inclusos: instalação física (cabeamento), hardware para instalação, licenças de software, suporte ao usuário final e instalação presencial.`;

export const SUPPORT_TEXT = `Durante a vigência do contrato, a Delta7 Tecnologia prestará serviços de assistência e suporte técnico, visando garantir a continuidade do perfeito funcionamento da solução.

Esses serviços incluem o atendimento e ações necessárias em caso de falhas na solução, como indisponibilidade, incompatibilidade, configurações inadequadas ou outros problemas que possam colocar em risco a implementação de serviços ou regras de negócios do cliente.

O suporte técnico da plataforma será oferecido pela Delta7, garantindo ao cliente acesso direto através de meios de comunicação como telefone e WhatsApp, para resolução de problemas, esclarecimento e orientação sobre o uso da solução.`;

export const SUPPORT_REQUIREMENTS: string[] = [
  'Atendimento de segunda a sexta-feira em dias úteis',
  'Contrato de 12 meses',
  'Horário de atendimento das 8h às 18h',
  'Plantão de atendimento aos sábados das 8h às 12h',
  'Atualização (correções e novas versões) de softwares sempre que disponíveis e funcionais',
  'Acesso aos recursos de suporte via WhatsApp nos dias e horários determinados',
  'Prevenção de problemas técnicos e auxílio na solução, caso ocorram',
  'Atendimento em regime de plantão — não incluso',
  'Disponibilização de painel on-line do cliente com todas as ocorrências',
  'Atendimento extra de segunda a sexta das 18:01 às 21:59 — cobrança extra de R$ 200,00 por hora',
];

export interface ProposalCatalogItem {
  description: string;
  unit_price: number;
}

// Preços fixos conforme modelo PDF original
export const PROPOSAL_CATALOG: ProposalCatalogItem[] = [
  { description: 'Computador desktop', unit_price: 38 },
  { description: 'Servidor Windows Server', unit_price: 90 },
  { description: 'Servidor Linux', unit_price: 90 },
  { description: 'Servidor Hyper-V', unit_price: 270 },
  { description: 'MS SQL Server', unit_price: 130 },
  { description: '1 TB de armazenamento', unit_price: 90 },
];

export const ACTIVATION_FEE_DEFAULT = 90;
export const VALIDITY_DAYS_DEFAULT = 15;

// ============ Controle de seções do PDF ============
export interface ProposalSections {
  showAbout: boolean;        // Sobre a Delta7 + KPIs
  showBenefits: boolean;     // 8 cards de benefícios
  showInfra: boolean;        // 4 cards de infraestrutura
  showIdealFor: boolean;     // 4 numerais "ideal para"
  showQuote: boolean;        // Citação institucional
  showSupportReqs: boolean;  // Lista de requisitos de suporte
}

export const DEFAULT_SECTIONS: ProposalSections = {
  showAbout: true,
  showBenefits: true,
  showInfra: true,
  showIdealFor: true,
  showQuote: true,
  showSupportReqs: true,
};

export const COMPACT_SECTIONS: ProposalSections = {
  showAbout: true,
  showBenefits: false,
  showInfra: false,
  showIdealFor: false,
  showQuote: false,
  showSupportReqs: false,
};

export const MINIMAL_SECTIONS: ProposalSections = {
  showAbout: false,
  showBenefits: false,
  showInfra: false,
  showIdealFor: false,
  showQuote: false,
  showSupportReqs: false,
};

export const SECTION_LABELS: { key: keyof ProposalSections; label: string; hint: string }[] = [
  { key: 'showAbout', label: 'Sobre a Delta7 + KPIs', hint: '~½ página' },
  { key: 'showBenefits', label: 'Cards de benefícios (8)', hint: '~½ página' },
  { key: 'showInfra', label: 'Cards de infraestrutura (4)', hint: '~⅓ página' },
  { key: 'showIdealFor', label: 'Perfil ideal (4 numerais)', hint: '~⅓ página' },
  { key: 'showQuote', label: 'Citação institucional', hint: '~⅙ página' },
  { key: 'showSupportReqs', label: 'Requisitos de suporte', hint: '~½ página' },
];

export const formatBRL = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
