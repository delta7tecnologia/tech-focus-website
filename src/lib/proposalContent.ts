// Conteúdo fixo da Proposta Comercial de Backup Online
// Mantém a edição do Word eliminada — apenas dados do cliente mudam.

export const ABOUT_DELTA7 = `A Delta7 Tecnologia é uma empresa especializada em soluções de TI para pequenas e médias empresas. Há mais de 10 anos, transformamos a tecnologia em vantagem competitiva para nossos clientes.

Nossa metodologia de trabalho garante entregas precisas em todos os projetos, com desenvolvimento ágil e eficaz que proporciona uma experiência positiva. Investimos constantemente na especialização e atualização da nossa equipe.

Atuamos com atendimento remoto em todo o Brasil e presencial na região Norte, sempre focados em oferecer soluções sob medida que atendam às necessidades específicas de cada negócio.`;

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

export const formatBRL = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
