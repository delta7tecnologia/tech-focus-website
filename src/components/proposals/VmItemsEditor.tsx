// src/components/proposals/VmItemsEditor.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Server, TrendingUp } from 'lucide-react';

export interface VmItem {
  nome: string;
  funcao: string;
  vcpus: number;
  ram: string;
  storage: string;
  so: string;
  preco: number;
  _vcpusBase?: number;
  _ramBase?: number;
  _precoBase?: number;
}

interface Props {
  vms: VmItem[];
  onChange: (vms: VmItem[]) => void;
}

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ── Templates predefinidos com precos Delta7 ──────────────────────────────────
const VM_TEMPLATES: VmItem[] = [
  { nome: 'VM — Active Directory', funcao: 'Controlador de Dominio (AD/DC)',        vcpus: 2, ram: '4 GB',   storage: '80 GB SSD',             so: 'Windows Server 2022', preco: 390, _vcpusBase: 2, _ramBase: 4,  _precoBase: 390 },
  { nome: 'VM — Fileserver',       funcao: 'Servidor de Arquivos',                  vcpus: 2, ram: '4 GB',   storage: '100 GB SSD + 1 TB HDD', so: 'Windows Server 2022', preco: 390, _vcpusBase: 2, _ramBase: 4,  _precoBase: 390 },
  { nome: 'VM — Notion',           funcao: 'Notion Self-hosted (Aplicacao Web)',     vcpus: 2, ram: '4 GB',   storage: '100 GB SSD',            so: 'Ubuntu Server LTS',   preco: 250, _vcpusBase: 2, _ramBase: 4,  _precoBase: 250 },
  { nome: 'VM — Node.js',          funcao: 'Aplicacao Node.js / API',               vcpus: 2, ram: '4 GB',   storage: '80 GB SSD',             so: 'Ubuntu Server LTS',   preco: 250, _vcpusBase: 2, _ramBase: 4,  _precoBase: 250 },
  { nome: 'VM — SQL Server',       funcao: 'Banco de Dados SQL Server',             vcpus: 4, ram: '8 GB',   storage: '200 GB SSD',            so: 'Windows Server 2022', preco: 620, _vcpusBase: 4, _ramBase: 8,  _precoBase: 620 },
  { nome: 'VM — DNS',              funcao: 'Servidor DNS secundario',               vcpus: 1, ram: '2 GB',   storage: '40 GB SSD',             so: 'Ubuntu Server LTS',   preco: 150, _vcpusBase: 1, _ramBase: 2,  _precoBase: 150 },
  { nome: 'VM — Backup',           funcao: 'Servidor de Backup local (PBS/Veeam)',  vcpus: 2, ram: '4 GB',   storage: '500 GB HDD',            so: 'Ubuntu Server LTS',   preco: 220, _vcpusBase: 2, _ramBase: 4,  _precoBase: 220 },
  { nome: 'VM — ERP',              funcao: 'Servidor de ERP / Sistema interno',     vcpus: 4, ram: '8 GB',   storage: '200 GB SSD',            so: 'Windows Server 2022', preco: 620, _vcpusBase: 4, _ramBase: 8,  _precoBase: 620 },
  { nome: 'VM — Web',              funcao: 'Servidor Web / Nginx / Apache',         vcpus: 2, ram: '4 GB',   storage: '80 GB SSD',             so: 'Ubuntu Server LTS',   preco: 220, _vcpusBase: 2, _ramBase: 4,  _precoBase: 220 },
  { nome: 'VM — Monitoramento',    funcao: 'Zabbix / Grafana / PRTG',              vcpus: 2, ram: '4 GB',   storage: '100 GB SSD',            so: 'Ubuntu Server LTS',   preco: 230, _vcpusBase: 2, _ramBase: 4,  _precoBase: 230 },
  { nome: 'VM — Nextcloud',        funcao: 'Nextcloud Self-hosted (1 TB incluso)',  vcpus: 4, ram: '8 GB',   storage: '1 TB SSD',              so: 'Ubuntu Server LTS',   preco: 490, _vcpusBase: 4, _ramBase: 8,  _precoBase: 490 },
  { nome: 'Backup em Nuvem 1TB',   funcao: 'Backup gerenciado em nuvem — 1 TB',    vcpus: 0, ram: '—',      storage: '1 TB Nuvem',            so: '—',                   preco: 290, _vcpusBase: 0, _ramBase: 0,  _precoBase: 290 },
];

const VM_EMPTY: VmItem = { nome: '', funcao: '', vcpus: 2, ram: '4 GB', storage: '', so: '', preco: 0 };

// ── Calculo de preco sugerido ─────────────────────────────────────────────────
// +R$ 60 por vCPU acima do base
// +R$ 40 por cada 4 GB de RAM acima do base
function parseGb(str: string): number {
  const m = String(str || '').match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

function calcPrecoSugerido(vm: VmItem): number | null {
  if (!vm._precoBase || !vm._vcpusBase || !vm._ramBase) return null;
  // Backup em nuvem nao tem CPU/RAM para calcular
  if (vm._vcpusBase === 0) return null;

  const vcpusExtra = Math.max(0, (Number(vm.vcpus) || 0) - vm._vcpusBase);
  const ramExtra   = Math.max(0, parseGb(vm.ram) - vm._ramBase);
  const blocos4gb  = Math.floor(ramExtra / 4);
  const ajuste     = vcpusExtra * 60 + blocos4gb * 40;

  if (ajuste === 0) return null;
  return vm._precoBase + ajuste;
}

// ── Verifica se e servico de nuvem (sem CPU/RAM) ─────────────────────────────
const isCloudService = (vm: VmItem) => vm._vcpusBase === 0;

// ── Componente ────────────────────────────────────────────────────────────────
const VmItemsEditor: React.FC<Props> = ({ vms, onChange }) => {
  const addTemplate = (tpl: VmItem) => onChange([...vms, { ...tpl }]);
  const addCustom   = () => onChange([...vms, { ...VM_EMPTY }]);

  const update = (idx: number, patch: Partial<VmItem>) =>
    onChange(vms.map((v, i) => (i === idx ? { ...v, ...patch } : v)));

  const remove = (idx: number) => onChange(vms.filter((_, i) => i !== idx));

  const aplicarSugestao = (idx: number, sugerido: number) =>
    update(idx, { preco: sugerido });

  const totalVcpus = vms.reduce((s, v) => s + (Number(v.vcpus) || 0), 0);
  const totalPreco = vms.reduce((s, v) => s + (Number(v.preco) || 0), 0);

  // Separa templates em VMs e servicos de nuvem para exibicao
  const templatesVm     = VM_TEMPLATES.filter(t => !isCloudService(t));
  const templatesNuvem  = VM_TEMPLATES.filter(t => isCloudService(t));

  return (
    <div className="space-y-5">
      {/* Templates — VMs */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Adicionar VM predefinida</Label>
        <div className="flex flex-wrap gap-2">
          {templatesVm.map((tpl) => (
            <Button
              key={tpl.nome}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addTemplate(tpl)}
              className="text-xs"
            >
              <Server className="w-3 h-3 mr-1" />
              {tpl.nome.replace('VM — ', '')}
            </Button>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addCustom} className="text-xs border-dashed">
            <Plus className="w-3 h-3 mr-1" /> VM personalizada
          </Button>
        </div>
      </div>

      {/* Templates — Servicos de nuvem */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Adicionar servico em nuvem</Label>
        <div className="flex flex-wrap gap-2">
          {templatesNuvem.map((tpl) => (
            <Button
              key={tpl.nome}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addTemplate(tpl)}
              className="text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <Server className="w-3 h-3 mr-1" />
              {tpl.nome}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      {vms.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="text-left px-3 py-2">Nome / Identificacao</th>
                <th className="text-left px-2 py-2">Funcao</th>
                <th className="text-center px-2 py-2 w-20">vCPUs</th>
                <th className="text-center px-2 py-2 w-24">RAM</th>
                <th className="text-left px-2 py-2">Storage</th>
                <th className="text-left px-2 py-2 w-32">Sistema</th>
                <th className="text-right px-2 py-2 w-40">Preco/mes (R$)</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {vms.map((vm, idx) => {
                const sugerido    = calcPrecoSugerido(vm);
                const temSugestao = sugerido !== null && sugerido !== vm.preco;
                const cloud       = isCloudService(vm);

                return (
                  <React.Fragment key={idx}>
                    <tr className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-2 py-1">
                        <Input
                          value={vm.nome}
                          onChange={(e) => update(idx, { nome: e.target.value })}
                          placeholder="VM — Active Directory"
                          className="h-8 text-xs"
                        />
                      </td>
                      <td className="px-2 py-1">
                        <Input
                          value={vm.funcao}
                          onChange={(e) => update(idx, { funcao: e.target.value })}
                          placeholder="Funcao"
                          className="h-8 text-xs"
                        />
                      </td>
                      <td className="px-2 py-1">
                        {cloud ? (
                          <span className="block text-center text-xs text-gray-400">—</span>
                        ) : (
                          <Input
                            type="number"
                            min={1}
                            max={32}
                            value={vm.vcpus}
                            onChange={(e) => update(idx, { vcpus: Number(e.target.value) })}
                            className={`h-8 text-xs text-center ${vm._vcpusBase && vm.vcpus > vm._vcpusBase ? 'border-amber-400 bg-amber-50' : ''}`}
                          />
                        )}
                      </td>
                      <td className="px-2 py-1">
                        {cloud ? (
                          <span className="block text-center text-xs text-gray-400">—</span>
                        ) : (
                          <Input
                            value={vm.ram}
                            onChange={(e) => update(idx, { ram: e.target.value })}
                            placeholder="4 GB"
                            className={`h-8 text-xs text-center ${vm._ramBase && parseGb(vm.ram) > vm._ramBase ? 'border-amber-400 bg-amber-50' : ''}`}
                          />
                        )}
                      </td>
                      <td className="px-2 py-1">
                        <Input
                          value={vm.storage}
                          onChange={(e) => update(idx, { storage: e.target.value })}
                          placeholder="80 GB SSD"
                          className="h-8 text-xs"
                        />
                      </td>
                      <td className="px-2 py-1">
                        {cloud ? (
                          <span className="block text-xs text-gray-400">Nuvem</span>
                        ) : (
                          <Input
                            value={vm.so}
                            onChange={(e) => update(idx, { so: e.target.value })}
                            placeholder="Ubuntu Server LTS"
                            className="h-8 text-xs"
                          />
                        )}
                      </td>
                      <td className="px-2 py-1">
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={vm.preco}
                          onChange={(e) => update(idx, { preco: Number(e.target.value) })}
                          className="h-8 text-xs text-right font-medium text-orange-700"
                        />
                      </td>
                      <td className="px-2 py-1 text-center">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => remove(idx)}
                          className="text-red-500 h-7 w-7"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>

                    {/* Sugestao de preco */}
                    {temSugestao && (
                      <tr className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td colSpan={6} className="px-3 pb-2 pt-0">
                          <div className="flex items-center gap-1.5 text-xs text-amber-700">
                            <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              Recursos acima do padrao do template.
                              Preco sugerido: <strong className="ml-1">{formatBRL(sugerido!)}/mes</strong>
                            </span>
                          </div>
                        </td>
                        <td className="px-2 pb-2 pt-0 text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => aplicarSugestao(idx, sugerido!)}
                            className="h-6 text-xs border-amber-400 text-amber-700 hover:bg-amber-50 px-2"
                          >
                            Aplicar
                          </Button>
                        </td>
                        <td></td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Total */}
              <tr className="bg-orange-50 border-t-2 border-orange-200">
                <td className="px-3 py-2 font-bold text-xs text-orange-700" colSpan={2}>TOTAL MENSAL</td>
                <td className="px-2 py-2 text-center font-bold text-xs text-orange-700">{totalVcpus > 0 ? `${totalVcpus} vCPUs` : ''}</td>
                <td colSpan={3}></td>
                <td className="px-2 py-2 text-right font-bold text-sm text-orange-700">{formatBRL(totalPreco)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {vms.length === 0 && (
        <p className="text-sm text-gray-400 italic text-center py-6 border rounded-lg border-dashed">
          Nenhum item adicionado. Use os templates acima ou adicione uma VM personalizada.
        </p>
      )}

      {vms.length > 0 && (
        <p className="text-xs text-gray-400 italic">
          * O preco de cada item pode ser editado diretamente. Os planos de contratacao sao calculados automaticamente com base no total acima.
        </p>
      )}
    </div>
  );
};

export default VmItemsEditor;
