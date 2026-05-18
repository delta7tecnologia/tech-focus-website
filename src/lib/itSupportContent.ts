// Conteúdo fixo da Proposta de Suporte de TI Mensal — Delta7
// Mesma espinha dorsal da proposta de Backup, adaptado para contrato MSP.

export const ABOUT_DELTA7_SUP = `A Delta7 Tecnologia é parceira estratégica de TI para empresas que dependem da tecnologia para operar. Atuamos como o departamento de TI terceirizado dos nossos clientes, garantindo continuidade, segurança e produtividade.

Há mais de 10 anos entregamos suporte técnico especializado, monitoramento 24/7, gestão de servidores Windows e Linux, hipervisores, antivírus corporativo e infraestrutura de redes. Nossa metodologia transforma TI em vantagem competitiva — você foca no seu negócio, nós cuidamos da tecnologia.

Atendemos remotamente em todo o Brasil e presencialmente em Paragominas-PA e região, com equipe certificada e processos padronizados.`;

// Paleta Navy & Slate — mesma do backup para manter identidade visual
export const SUP_COLORS = {
  navy: '#0a1f44',
  navyDeep: '#142a5c',
  gold: '#475569',
  goldLight: '#94a3b8',
  cream: '#f1f5f9',
  ink: '#1a2540',
  muted: '#64748b',
  paper: '#f8fafc',
};

export const SUP_KPIS: { value: string; label: string }[] = [
  { value: '+10', label: 'anos de mercado' },
  { value: '24/7', label: 'monitoramento' },
  { value: '99,9%', label: 'disponibilidade' },
];

export type SupBenefitIcon = 'platform' | 'cloud' | 'ransom' | 'auto' | 'retention' | 'panel' | 'bell' | 'support' | 'lock' | 'shield' | 'eye';

export const SUP_BENEFITS: { title: string; text: string; icon: SupBenefitIcon }[] = [
  { icon: 'support', title: 'Time especializado', text: 'Acesso a equipe multidisciplinar em servidores, redes, cloud e segurança — sem custo de contratação.' },
  { icon: 'auto', title: 'Foco no seu negócio', text: 'Você delega a TI e direciona energia para o que realmente importa: o crescimento da empresa.' },
  { icon: 'platform', title: 'Redução de custos', text: 'Custo previsível e menor que manter equipe interna, com escala e maturidade de processos.' },
  { icon: 'bell', title: 'SLA por prioridade', text: 'Tempos de resposta acordados para chamados críticos, altos, médios e baixos.' },
  { icon: 'eye', title: 'Monitoramento 24/7', text: 'Servidores, links e serviços críticos vigiados com Zabbix e Grafana — alertas proativos.' },
  { icon: 'shield', title: 'Prevenção e atualização', text: 'Patches, antivírus, backups e revisões periódicas para evitar incidentes antes que aconteçam.' },
  { icon: 'lock', title: 'Conformidade LGPD', text: 'Boas práticas, controle de acesso e rastreabilidade alinhados às exigências regulatórias.' },
  { icon: 'panel', title: 'Suporte humano', text: 'Atendimento direto Delta7 via WhatsApp, telefone e portal — sem URA, sem terceirização.' },
];

export const SUP_INFRA: { title: string; text: string; icon: 'lock' | 'cloud' | 'shield' | 'eye' }[] = [
  { icon: 'eye', title: 'Zabbix + Grafana', text: 'Monitoramento contínuo de infra crítica, dashboards e alertas em tempo real.' },
  { icon: 'shield', title: 'Antivírus corporativo', text: 'Bitdefender gerenciado centralmente, com políticas e relatórios mensais.' },
  { icon: 'lock', title: 'Acesso remoto seguro', text: 'AnyDesk, RustDesk e VPN com controle de sessão e auditoria.' },
  { icon: 'cloud', title: 'Backup local & nuvem', text: 'Acompanhamento de rotinas Veeam e Backup Online para garantir integridade.' },
];

export const SUP_IDEAL_FOR: { title: string; text: string }[] = [
  { title: 'Empresa com 5+ estações', text: 'Equipes que dependem de TI no dia a dia e não podem parar por falhas técnicas.' },
  { title: 'Sem equipe interna de TI', text: 'Negócios que precisam de TI profissional sem o custo de manter um departamento.' },
  { title: 'Servidores e infra crítica', text: 'Quem opera Windows Server, Linux, Hyper-V, AD ou bancos de dados em produção.' },
  { title: 'Conformidade e auditoria', text: 'Empresas que precisam comprovar boas práticas, controle de acesso e rastreabilidade.' },
];

export const SUP_QUOTE = {
  text: 'TI bem feita não aparece — ela simplesmente funciona. Nossa missão é manter o seu negócio rodando sem que você precise se preocupar com a tecnologia.',
  author: 'Delta7 Tecnologia',
};

export const SUP_NOT_INCLUDED = `Nesta proposta não estão inclusos: hardware (servidores, computadores, switches, racks), licenças de software (Windows, Office, antivírus, etc.), cabeamento estruturado, plantão 24h fora do horário comercial, deslocamento para fora de Paragominas-PA e projetos sob demanda — estes serão cobrados como hora técnica avulsa ou em proposta separada.`;

export const SUP_CONTRACT_TEXT = `Durante a vigência do contrato, a Delta7 Tecnologia prestará serviços de assistência e suporte técnico, com o objetivo de manter a continuidade da operação de TI do cliente.

O escopo inclui suporte remoto em horário comercial, monitoramento dos ativos críticos, gestão de antivírus corporativo, acompanhamento de rotinas de backup, atualização de patches de segurança, orientação a usuários finais e abertura de chamados via WhatsApp, telefone ou portal.

Atividades fora do escopo (projetos, mudanças de infraestrutura, instalação de novos serviços) podem ser executadas como hora técnica avulsa, mediante aprovação prévia.`;

export const SUP_CONTRACT_REQUIREMENTS: string[] = [
  'Atendimento de segunda a sexta-feira em dias úteis',
  'Horário de atendimento das 8h às 18h',
  'Plantão de atendimento aos sábados das 8h às 12h',
  'Contrato com vigência mínima de 12 meses',
  'Atualização de softwares (correções e novas versões) sempre que disponíveis',
  'Acesso aos canais de suporte: WhatsApp, telefone e portal',
  'Painel on-line do cliente com histórico de ocorrências',
  'Atendimento extra de segunda a sexta das 18:01 às 21:59 — cobrança extra de R$ 200,00 por hora',
  'Plantão 24h e finais de semana — não inclusos (hora técnica avulsa)',
  'Visitas presenciais fora de Paragominas-PA — orçadas separadamente',
];

export const SUP_SLA: { priority: string; description: string; response: string; color: string }[] = [
  { priority: 'Crítico', description: 'Servidor, link ou serviço crítico fora do ar; impacto na operação inteira.', response: '1 hora útil', color: '#dc2626' },
  { priority: 'Alto', description: 'Falha em sistema importante afetando departamento ou múltiplos usuários.', response: '4 horas úteis', color: '#ea580c' },
  { priority: 'Médio', description: 'Falha pontual, com workaround possível ou impacto limitado.', response: '8 horas úteis', color: '#ca8a04' },
  { priority: 'Baixo', description: 'Solicitações de mudança, dúvidas, melhorias e ajustes não urgentes.', response: '24 horas úteis', color: '#16a34a' },
];

export interface SupCatalogItem {
  description: string;
  unit_price: number;
  unit_label?: string;
}

// Catálogo padrão (todos editáveis no formulário antes de salvar)
export const SUP_CATALOG: SupCatalogItem[] = [
  { description: 'Suporte por estação Windows / Mac', unit_price: 80, unit_label: 'mês' },
  { description: 'Suporte por servidor Windows Server', unit_price: 250, unit_label: 'mês' },
  { description: 'Suporte por servidor Linux', unit_price: 200, unit_label: 'mês' },
  { description: 'Suporte a Hyper-V / VMware', unit_price: 180, unit_label: 'mês' },
  { description: 'Monitoramento Zabbix / Grafana', unit_price: 120, unit_label: 'mês' },
  { description: 'Gestão de antivírus corporativo', unit_price: 15, unit_label: 'estação' },
  { description: 'Gestão de firewall / UTM', unit_price: 200, unit_label: 'mês' },
  { description: 'Gestão de Active Directory', unit_price: 250, unit_label: 'mês' },
  { description: 'Hora técnica avulsa (fora do escopo)', unit_price: 180, unit_label: 'hora' },
  { description: 'Visita presencial em Paragominas-PA', unit_price: 150, unit_label: 'visita' },
];

export const SUP_SETUP_FEE_DEFAULT = 0;
export const SUP_VALIDITY_DAYS_DEFAULT = 15;
export const SUP_CONTRACT_MONTHS_DEFAULT = 12;

// ============ Toggles de seções do PDF ============
export interface SupProposalSections {
  showAbout: boolean;
  showBenefits: boolean;
  showInfra: boolean;
  showSla: boolean;
  showIdealFor: boolean;
  showQuote: boolean;
  showSupportReqs: boolean;
}

export const SUP_DEFAULT_SECTIONS: SupProposalSections = {
  showAbout: true,
  showBenefits: true,
  showInfra: true,
  showSla: true,
  showIdealFor: true,
  showQuote: true,
  showSupportReqs: true,
};

export const SUP_COMPACT_SECTIONS: SupProposalSections = {
  showAbout: true,
  showBenefits: false,
  showInfra: false,
  showSla: true,
  showIdealFor: false,
  showQuote: false,
  showSupportReqs: false,
};

export const SUP_MINIMAL_SECTIONS: SupProposalSections = {
  showAbout: false,
  showBenefits: false,
  showInfra: false,
  showSla: false,
  showIdealFor: false,
  showQuote: false,
  showSupportReqs: false,
};

export const SUP_SECTION_LABELS: { key: keyof SupProposalSections; label: string; hint: string }[] = [
  { key: 'showAbout', label: 'Sobre a Delta7 + KPIs', hint: '~½ página' },
  { key: 'showBenefits', label: 'Por que terceirizar TI (8 cards)', hint: '~½ página' },
  { key: 'showInfra', label: 'Stack monitorada (4 cards)', hint: '~⅓ página' },
  { key: 'showSla', label: 'SLA por prioridade', hint: '~⅓ página' },
  { key: 'showIdealFor', label: 'Perfil ideal (4 numerais)', hint: '~⅓ página' },
  { key: 'showQuote', label: 'Citação institucional', hint: '~⅙ página' },
  { key: 'showSupportReqs', label: 'Requisitos do contrato', hint: '~½ página' },
];

export const formatBRL = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
