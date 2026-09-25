export type ServerModality = 'on_premise' | 'dedicado';

export interface ServerModel {
  id: string;
  nome: string;
  fabricante: string;
  formato: 'rack' | 'torre';
  cpu: string;
  ram_base_gb: number;
  storage_base: string;
  baias: number;
  fonte_redundante: boolean;
  custo_aquisicao: number;
  mensalidade_base: number;
  vida_util_meses: number;
  ativo: boolean;
  observacoes?: string | null;
}

export interface ServerUpgrade {
  id: string;
  categoria: 'memoria' | 'armazenamento' | 'rede' | 'energia' | 'licenca' | 'servico';
  nome: string;
  custo_aquisicao: number;
  mensalidade: number;
  tipo_cobranca: 'mensal' | 'unica';
  aplica_modalidade: 'ambas' | ServerModality;
  ativo: boolean;
}

export interface ServerProposalItem {
  id: string;
  model: ServerModel;
  quantidade: number;
  upgrades: ServerUpgrade[];
  mensalidade: number;
}

export interface CalculationParams {
  margemPercentual: number;
  taxaCapitalMensal: number;
  residualPercentual: number;
  reservaManutencaoPercentual: number;
}

export interface ServerPlan { prazo: number; mensal: number; manual: boolean }

export interface ServerClause {
  key: 'fidelidade' | 'reajuste' | 'guarda' | 'compra' | 'pagamento';
  title: string;
  active: boolean;
  text: string;
  params: Record<string, string | number>;
}

export interface ServerProposalContent {
  coverSubtitle: string;
  onPremiseSummary: string;
  dedicatedSummary: string;
  includedTitle: string;
  acceptanceText: string;
}

export const DEFAULT_CALCULATION_PARAMS: CalculationParams = {
  margemPercentual: 30,
  taxaCapitalMensal: 1.5,
  residualPercentual: 20,
  reservaManutencaoPercentual: 8,
};

export const getDefaultServerContent = (): ServerProposalContent => ({
  coverSubtitle: 'Infraestrutura robusta, previsível e gerenciada para sua operação.',
  onPremiseSummary: 'Servidor físico instalado no ambiente da CONTRATANTE, com configuração dedicada, implantação profissional e opções de suporte gerenciado pela Delta7 Tecnologia.',
  dedicatedSummary: 'Servidor físico exclusivo para a CONTRATANTE, hospedado na infraestrutura Delta7, com conectividade, monitoramento e operação especializada.',
  includedTitle: 'Serviços e recursos incluídos',
  acceptanceText: 'Declaramos estar de acordo com os equipamentos, valores e condições apresentados nesta proposta comercial.',
});

export function normalizeServerContent(value: unknown): ServerProposalContent {
  const defaults = getDefaultServerContent();
  if (!value || typeof value !== 'object' || Array.isArray(value)) return defaults;
  const raw = value as Record<string, unknown>;
  return Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [key, typeof raw[key] === 'string' ? raw[key] : fallback])) as unknown as ServerProposalContent;
}

export function getDefaultServerClauses(modality: ServerModality, residual = 20): ServerClause[] {
  const guarda = modality === 'on_premise'
    ? 'Os equipamentos permanecem de propriedade exclusiva da CONTRATADA. A CONTRATANTE se obriga a mantê-los em local adequado, com energia estabilizada e climatização, sendo vedado abrir, remover, transferir, sublocar ou modificar os equipamentos sem autorização por escrito. Danos decorrentes de mau uso, sinistro, furto ou falha elétrica no local serão de responsabilidade da CONTRATANTE. A CONTRATADA substituirá peças com defeito de funcionamento em até {{sla_troca_pecas_horas}} horas úteis após a abertura do chamado. Ao término ou rescisão do contrato, a CONTRATANTE deverá disponibilizar os equipamentos para retirada em até {{prazo_devolucao_dias}} dias, ressalvado o desgaste natural.'
    : 'Os equipamentos permanecem de propriedade exclusiva da CONTRATADA e hospedados em sua infraestrutura, sendo de uso exclusivo da CONTRATANTE durante a vigência. Ao término ou rescisão, a CONTRATANTE terá {{prazo_retirada_dados_dias}} dias para exportar seus dados; após esse prazo, os discos serão apagados de forma segura, sem possibilidade de recuperação.';
  return [
    { key: 'fidelidade', title: 'Fidelidade e multa rescisória', active: true, params: { prazo: 36, multa_percentual: 50 }, text: 'O presente contrato tem prazo mínimo de {{prazo}} meses. Em caso de rescisão antecipada por iniciativa da CONTRATANTE, será devida multa equivalente a {{multa_percentual}}% do valor das mensalidades remanescentes até o término do prazo contratado, calculada proporcionalmente aos meses não cumpridos.' },
    { key: 'reajuste', title: 'Reajuste anual', active: true, params: { indice: 'IPCA' }, text: 'Os valores serão reajustados a cada 12 (doze) meses, contados da data de assinatura, pela variação acumulada do {{indice}} no período, ou por outro índice oficial que venha a substituí-lo.' },
    { key: 'guarda', title: modality === 'on_premise' ? 'Guarda, conservação e devolução' : 'Hospedagem e retirada de dados', active: true, params: modality === 'on_premise' ? { prazo_devolucao_dias: 10, sla_troca_pecas_horas: 48 } : { prazo_retirada_dados_dias: 15 }, text: guarda },
    { key: 'compra', title: 'Opção de compra', active: false, params: { residual_percentual: residual, valor_residual: 0 }, text: 'Ao término do prazo contratado, e estando adimplente, a CONTRATANTE poderá adquirir os equipamentos pelo valor residual de R$ {{valor_residual}}, mediante manifestação por escrito com antecedência mínima de 30 dias. A opção não se aplica em caso de rescisão antecipada.' },
    { key: 'pagamento', title: 'Condições de pagamento', active: true, params: { dia_vencimento: 10, multa_atraso: 2, juros_mes: 1, dias_suspensao: 15 }, text: 'As mensalidades vencem todo dia {{dia_vencimento}}. Atrasos sujeitam-se a multa de {{multa_atraso}}% e juros de {{juros_mes}}% ao mês. Após {{dias_suspensao}} dias de atraso, a CONTRATADA poderá suspender os serviços de suporte e monitoramento até a regularização.' },
  ];
}

export const formatBRL = (value: number) => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function calculateServerTotals(items: ServerProposalItem[]) {
  return items.reduce((acc, item) => {
    const qty = Math.max(1, Number(item.quantidade) || 1);
    acc.monthly += (Number(item.mensalidade) || 0) * qty;
    acc.setup += item.upgrades.filter(u => u.tipo_cobranca === 'unica').reduce((sum, u) => sum + Number(u.mensalidade || 0) * qty, 0);
    acc.cost += (Number(item.model.custo_aquisicao) + item.upgrades.reduce((sum, u) => sum + Number(u.custo_aquisicao || 0), 0)) * qty;
    acc.monthlyServices += item.upgrades.filter(u => u.tipo_cobranca === 'mensal' && u.categoria === 'servico').reduce((sum, u) => sum + Number(u.mensalidade || 0) * qty, 0);
    return acc;
  }, { monthly: 0, setup: 0, cost: 0, monthlyServices: 0 });
}

export function suggestedMonthly(cost: number, services: number, months: number, params: CalculationParams) {
  const i = params.taxaCapitalMensal / 100;
  const residualPv = (cost * params.residualPercentual / 100) / Math.pow(1 + i, months);
  const present = Math.max(0, cost - residualPv);
  const amortization = i === 0 ? present / months : present * i / (1 - Math.pow(1 + i, -months));
  return Math.ceil((amortization * (1 + params.margemPercentual / 100)) * (1 + params.reservaManutencaoPercentual / 100) + services);
}

export function renderClause(clause: ServerClause): string {
  return Object.entries(clause.params).reduce((text, [key, value]) => text.split(`{{${key}}}`).join(String(value)), clause.text);
}