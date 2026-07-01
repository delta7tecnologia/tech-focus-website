// src/components/proposals/VmItemsEditor.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Server } from 'lucide-react';

export interface VmItem {
  nome: string;
  funcao: string;
  vcpus: number;
  ram: string;
  storage: string;
  so: string;
}

interface Props {
  vms: VmItem[];
  onChange: (vms: VmItem[]) => void;
}

// ── Templates predefinidos ────────────────────────────────────────────────────
const VM_TEMPLATES: VmItem[] = [
  { nome: 'VM — Active Directory', funcao: 'Controlador de Dominio (AD/DC)',        vcpus: 2, ram: '4 GB',  storage: '80 GB SSD',             so: 'Windows Server 2022' },
  { nome: 'VM — Fileserver',       funcao: 'Servidor de Arquivos',                  vcpus: 2, ram: '4 GB',  storage: '100 GB SSD + 1 TB HDD', so: 'Windows Server 2022' },
  { nome: 'VM — Notion',           funcao: 'Notion Self-hosted (Aplicacao Web)',     vcpus: 2, ram: '4 GB',  storage: '100 GB SSD',            so: 'Ubuntu Server LTS'   },
  { nome: 'VM — Node.js',          funcao: 'Aplicacao Node.js / API',               vcpus: 2, ram: '4 GB',  storage: '80 GB SSD',             so: 'Ubuntu Server LTS'   },
  { nome: 'VM — SQL Server',       funcao: 'Banco de Dados SQL Server',             vcpus: 4, ram: '8 GB',  storage: '200 GB SSD',            so: 'Windows Server 2022' },
  { nome: 'VM — DNS',              funcao: 'Servidor DNS secundario',               vcpus: 1, ram: '2 GB',  storage: '40 GB SSD',             so: 'Ubuntu Server LTS'   },
  { nome: 'VM — Backup',           funcao: 'Servidor de Backup local (PBS/Veeam)',  vcpus: 2, ram: '4 GB',  storage: '500 GB HDD',            so: 'Ubuntu Server LTS'   },
  { nome: 'VM — ERP',              funcao: 'Servidor de ERP / Sistema interno',     vcpus: 4, ram: '8 GB',  storage: '200 GB SSD',            so: 'Windows Server 2022' },
  { nome: 'VM — Web',              funcao: 'Servidor Web / Nginx / Apache',         vcpus: 2, ram: '4 GB',  storage: '80 GB SSD',             so: 'Ubuntu Server LTS'   },
  { nome: 'VM — Monitoramento',    funcao: 'Zabbix / Grafana / PRTG',              vcpus: 2, ram: '4 GB',  storage: '100 GB SSD',            so: 'Ubuntu Server LTS'   },
];

const VM_EMPTY: VmItem = { nome: '', funcao: '', vcpus: 2, ram: '4 GB', storage: '', so: '' };

const VmItemsEditor: React.FC<Props> = ({ vms, onChange }) => {
  const addTemplate = (tpl: VmItem) => {
    // Permite adicionar duplicatas — pode querer duas VMs do mesmo tipo
    onChange([...vms, { ...tpl }]);
  };

  const addCustom = () => onChange([...vms, { ...VM_EMPTY }]);

  const update = (idx: number, patch: Partial<VmItem>) =>
    onChange(vms.map((v, i) => (i === idx ? { ...v, ...patch } : v)));

  const remove = (idx: number) => onChange(vms.filter((_, i) => i !== idx));

  const totalVcpus = vms.reduce((s, v) => s + (Number(v.vcpus) || 0), 0);

  return (
    <div className="space-y-5">
      {/* Templates */}
      <div>
        <Label className="text-sm font-semibold mb-2 block">Adicionar VM predefinida</Label>
        <div className="flex flex-wrap gap-2">
          {VM_TEMPLATES.map((tpl) => (
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

      {/* Tabela de VMs */}
      {vms.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="text-left px-3 py-2">Nome / Identificacao</th>
                <th className="text-left px-3 py-2">Funcao</th>
                <th className="text-center px-2 py-2 w-20">vCPUs</th>
                <th className="text-center px-2 py-2 w-24">RAM</th>
                <th className="text-left px-2 py-2">Storage</th>
                <th className="text-left px-2 py-2">Sistema</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {vms.map((vm, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-2 py-1">
                    <Input
                      value={vm.nome}
                      onChange={(e) => update(idx, { nome: e.target.value })}
                      placeholder="VM 1 — Active Directory"
                      className="h-8 text-xs"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      value={vm.funcao}
                      onChange={(e) => update(idx, { funcao: e.target.value })}
                      placeholder="Controlador de Dominio"
                      className="h-8 text-xs"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      type="number"
                      min={1}
                      max={32}
                      value={vm.vcpus}
                      onChange={(e) => update(idx, { vcpus: Number(e.target.value) })}
                      className="h-8 text-xs text-center"
                    />
                  </td>
                  <td className="px-2 py-1">
                    <Input
                      value={vm.ram}
                      onChange={(e) => update(idx, { ram: e.target.value })}
                      placeholder="4 GB"
                      className="h-8 text-xs text-center"
                    />
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
                    <Input
                      value={vm.so}
                      onChange={(e) => update(idx, { so: e.target.value })}
                      placeholder="Ubuntu Server LTS"
                      className="h-8 text-xs"
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
              ))}
              {/* Linha de total */}
              <tr className="bg-orange-50 border-t-2 border-orange-200">
                <td className="px-3 py-2 font-bold text-xs text-orange-700" colSpan={2}>TOTAL</td>
                <td className="px-2 py-2 text-center font-bold text-xs text-orange-700">{totalVcpus} vCPUs</td>
                <td colSpan={4}></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {vms.length === 0 && (
        <p className="text-sm text-gray-400 italic text-center py-6 border rounded-lg border-dashed">
          Nenhuma VM adicionada. Use os templates acima ou adicione uma VM personalizada.
        </p>
      )}
    </div>
  );
};

export default VmItemsEditor;
