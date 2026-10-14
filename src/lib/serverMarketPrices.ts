import { catalogMonthlyFromCost, type ServerModel, type ServerUpgrade } from './serverRental';

/**
 * Tabela de preços de mercado (seminovo com NF e garantia, salvo indicação), out/2026.
 * Fontes: ShockTI, Chypps, Memórias Online, iPLoja, KaBuM.
 * Custos de servidor SEM discos — discos entram como adicionais.
 * A mensalidade de 36 meses é calculada a partir do custo (catalogMonthlyFromCost).
 */
export const MARKET_PRICES_LABEL = 'out/2026';

type ModelPreset = Omit<ServerModel, 'id' | 'mensalidade_base' | 'ativo' | 'observacoes'>;
type UpgradePreset = Pick<ServerUpgrade, 'categoria' | 'nome' | 'custo_aquisicao' | 'tipo_cobranca' | 'aplica_modalidade' | 'permite_quantidade'> &
  Partial<Pick<ServerUpgrade, 'capacidade_gb' | 'compat_memoria' | 'compat_tipo_modulo' | 'compat_baia' | 'compat_interface'>>;

const rack = { fabricante: 'Dell', formato: 'rack' as const, storage_base: 'Sem discos', fonte_redundante: true, vida_util_meses: 60, interface_disco: ['SAS', 'SATA'] };

export const MARKET_MODELS: ModelPreset[] = [
  { ...rack, nome: 'Dell PowerEdge R720', geracao: '12G', cpu: '2x Intel Xeon E5-2650L v2 (20 núcleos / 40 threads)', ram_base_gb: 64, padrao_memoria: 'DDR3', tipo_modulo: 'RDIMM', slots_memoria: 24, ram_max_gb: 768, baias: 8, tamanho_baia: '2.5"', custo_aquisicao: 4470 },
  { ...rack, nome: 'Dell PowerEdge R720 128GB', geracao: '12G', cpu: '2x Intel Xeon E5-2650L v2 (20 núcleos / 40 threads)', ram_base_gb: 128, padrao_memoria: 'DDR3', tipo_modulo: 'RDIMM', slots_memoria: 24, ram_max_gb: 768, baias: 8, tamanho_baia: '2.5"', custo_aquisicao: 4670 },
  { ...rack, nome: 'Dell PowerEdge R630', geracao: '13G', cpu: '2x Intel Xeon E5-2680 v4 (28 núcleos / 56 threads)', ram_base_gb: 64, padrao_memoria: 'DDR4', tipo_modulo: 'RDIMM', slots_memoria: 24, ram_max_gb: 768, baias: 8, tamanho_baia: '2.5"', custo_aquisicao: 8545 },
  { ...rack, nome: 'Dell PowerEdge R730', geracao: '13G', cpu: '2x Intel Xeon E5-2680 v4 (28 núcleos / 56 threads)', ram_base_gb: 64, padrao_memoria: 'DDR4', tipo_modulo: 'RDIMM', slots_memoria: 24, ram_max_gb: 768, baias: 8, tamanho_baia: '2.5"', custo_aquisicao: 9570 },
  { ...rack, nome: 'Dell PowerEdge R730XD', geracao: '13G', cpu: '2x Intel Xeon E5-2680 v4 (28 núcleos / 56 threads)', ram_base_gb: 64, padrao_memoria: 'DDR4', tipo_modulo: 'RDIMM', slots_memoria: 24, ram_max_gb: 768, baias: 12, tamanho_baia: '3.5"', custo_aquisicao: 10570 },
  { ...rack, nome: 'Dell PowerEdge R640', geracao: '14G', cpu: '2x Intel Xeon Gold 6138 (40 núcleos / 80 threads)', ram_base_gb: 64, padrao_memoria: 'DDR4', tipo_modulo: 'RDIMM', slots_memoria: 24, ram_max_gb: 1536, baias: 8, tamanho_baia: '2.5"', custo_aquisicao: 14010 },
  { ...rack, formato: 'torre', fonte_redundante: false, nome: 'Dell PowerEdge T330', geracao: '13G', cpu: 'Intel Xeon E3-1220 v6 (4 núcleos)', ram_base_gb: 8, padrao_memoria: 'DDR4', tipo_modulo: 'UDIMM', slots_memoria: 4, ram_max_gb: 64, baias: 8, tamanho_baia: '3.5"', custo_aquisicao: 4410 },
];

const disk = (nome: string, custo: number, iface: string[], baia: string[] = ['2.5"']): UpgradePreset => ({ categoria: 'armazenamento', nome, custo_aquisicao: custo, tipo_cobranca: 'mensal', aplica_modalidade: 'ambas', permite_quantidade: true, compat_baia: baia, compat_interface: iface });
const mem = (gb: number, std: 'DDR3' | 'DDR4', mod: 'RDIMM' | 'UDIMM', custo: number): UpgradePreset => ({ categoria: 'memoria', nome: `+${gb}GB ${std} ECC${mod === 'UDIMM' ? ' UDIMM' : ''}`, custo_aquisicao: custo, tipo_cobranca: 'mensal', aplica_modalidade: 'ambas', permite_quantidade: false, capacidade_gb: gb, compat_memoria: [std], compat_tipo_modulo: [mod] });

export const MARKET_UPGRADES: UpgradePreset[] = [
  disk('SSD 960GB SATA enterprise (seminovo)', 2350, ['SAS', 'SATA']),
  disk('SSD 1.92TB SATA enterprise (seminovo)', 2890, ['SAS', 'SATA']),
  disk('SSD 1.92TB Kingston DC600M (novo)', 6480, ['SAS', 'SATA']),
  disk('SSD 3.84TB SAS enterprise (seminovo)', 4390, ['SAS']),
  disk('HDD SAS 600GB 10k 2.5"', 290, ['SAS']),
  disk('HDD SAS 1.2TB 10k 2.5"', 700, ['SAS']),
  disk('HDD SAS 1.8TB 10k 2.5"', 1000, ['SAS']),
  mem(32, 'DDR4', 'RDIMM', 1252), mem(64, 'DDR4', 'RDIMM', 2513), mem(128, 'DDR4', 'RDIMM', 5026), mem(256, 'DDR4', 'RDIMM', 10050),
  mem(32, 'DDR4', 'UDIMM', 1252),
  mem(32, 'DDR3', 'RDIMM', 466), mem(64, 'DDR3', 'RDIMM', 932), mem(128, 'DDR3', 'RDIMM', 1863), mem(256, 'DDR3', 'RDIMM', 3725),
];

const key = (s: string) => String(s || '').trim().toLowerCase();

/**
 * Aplica a tabela: atualiza itens com o mesmo nome, cria os que faltam e desativa
 * discos/memórias que não estão na tabela. Nunca exclui (propostas salvas guardam cópia dos itens).
 */
export async function applyMarketPrices(client: any) {
  const [{ data: models, error: e1 }, { data: upgrades, error: e2 }] = await Promise.all([
    client.from('server_models').select('id,nome'),
    client.from('server_upgrades').select('id,nome,categoria,ativo'),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;
  const summary = { modelsUpdated: 0, modelsCreated: 0, upgradesUpdated: 0, upgradesCreated: 0, upgradesDeactivated: 0 };

  for (const preset of MARKET_MODELS) {
    const payload = { ...preset, mensalidade_base: catalogMonthlyFromCost(preset.custo_aquisicao), ativo: true };
    const existing = (models || []).find((m: any) => key(m.nome) === key(preset.nome));
    const { error } = existing ? await client.from('server_models').update(payload).eq('id', existing.id) : await client.from('server_models').insert(payload);
    if (error) throw error;
    existing ? summary.modelsUpdated++ : summary.modelsCreated++;
  }

  const presetNames = new Set(MARKET_UPGRADES.map(u => key(u.nome)));
  for (const preset of MARKET_UPGRADES) {
    const payload = { compat_memoria: [], compat_tipo_modulo: [], compat_baia: [], compat_interface: [], ...preset, mensalidade: catalogMonthlyFromCost(preset.custo_aquisicao), ativo: true };
    const existing = (upgrades || []).find((u: any) => key(u.nome) === key(preset.nome));
    const { error } = existing ? await client.from('server_upgrades').update(payload).eq('id', existing.id) : await client.from('server_upgrades').insert(payload);
    if (error) throw error;
    existing ? summary.upgradesUpdated++ : summary.upgradesCreated++;
  }

  const stale = (upgrades || []).filter((u: any) => u.ativo && (u.categoria === 'armazenamento' || u.categoria === 'memoria') && !presetNames.has(key(u.nome)));
  if (stale.length) {
    const { error } = await client.from('server_upgrades').update({ ativo: false }).in('id', stale.map((u: any) => u.id));
    if (error) throw error;
    summary.upgradesDeactivated = stale.length;
  }
  return summary;
}
