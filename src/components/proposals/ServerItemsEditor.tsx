import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { formatBRL, type ServerModel, type ServerModality, type ServerProposalItem, type ServerUpgrade } from '@/lib/serverRental';

interface Props { items: ServerProposalItem[]; models: ServerModel[]; upgrades: ServerUpgrade[]; modality: ServerModality; onChange: (items: ServerProposalItem[]) => void }

export default function ServerItemsEditor({ items, models, upgrades, modality, onChange }: Props) {
  const available = upgrades.filter(u => u.ativo && (u.aplica_modalidade === 'ambas' || u.aplica_modalidade === modality));
  const update = (index: number, patch: Partial<ServerProposalItem>) => onChange(items.map((item, i) => i === index ? { ...item, ...patch } : item));
  const add = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (!model) return;
    onChange([...items, { id: crypto.randomUUID(), model, quantidade: 1, upgrades: [], mensalidade: Number(model.mensalidade_base) }]);
  };
  const toggleUpgrade = (index: number, upgrade: ServerUpgrade, checked: boolean) => {
    const current = items[index];
    const next = checked ? [...current.upgrades, upgrade] : current.upgrades.filter(u => u.id !== upgrade.id);
    const monthly = Number(current.model.mensalidade_base) + next.filter(u => u.tipo_cobranca === 'mensal').reduce((s, u) => s + Number(u.mensalidade), 0);
    update(index, { upgrades: next, mensalidade: monthly });
  };
  const monthly = items.reduce((s, i) => s + i.mensalidade * i.quantidade, 0);
  const setup = items.reduce((s, i) => s + i.upgrades.filter(u => u.tipo_cobranca === 'unica').reduce((x, u) => x + Number(u.mensalidade) * i.quantidade, 0), 0);
  return <div className="space-y-4">
    <div className="flex items-end gap-2"><div className="flex-1"><Label>Adicionar servidor do catálogo</Label><Select onValueChange={add}><SelectTrigger><SelectValue placeholder="Selecione um modelo" /></SelectTrigger><SelectContent>{models.filter(m => m.ativo).map(m => <SelectItem key={m.id} value={m.id}>{m.nome} · {formatBRL(m.mensalidade_base)}/mês</SelectItem>)}</SelectContent></Select></div><Button type="button" variant="outline" disabled><Plus className="h-4 w-4" /></Button></div>
    {items.map((item, index) => <div key={item.id} className="rounded-md border p-4 space-y-3">
      <div className="flex justify-between gap-3"><div><p className="font-semibold text-foreground">{item.model.nome}</p><p className="text-xs text-muted-foreground">{item.model.cpu} · {item.model.ram_base_gb}GB · {item.model.storage_base}</p></div><Button type="button" size="icon" variant="ghost" onClick={() => onChange(items.filter((_, i) => i !== index))}><Trash2 className="h-4 w-4" /></Button></div>
      <div className="grid gap-3 sm:grid-cols-2"><div><Label>Quantidade</Label><Input type="number" min={1} value={item.quantidade} onChange={e => update(index, { quantidade: Math.max(1, Number(e.target.value)) })} /></div><div><Label>Mensalidade por unidade</Label><Input type="number" min={0} step="0.01" value={item.mensalidade} onChange={e => update(index, { mensalidade: Number(e.target.value) })} /></div></div>
      <div><Label>Adicionais compatíveis</Label><div className="mt-2 grid gap-2 sm:grid-cols-2">{available.map(up => <label key={up.id} className="flex items-start gap-2 rounded border p-2 text-sm"><Checkbox checked={item.upgrades.some(u => u.id === up.id)} onCheckedChange={v => toggleUpgrade(index, up, v === true)} /><span><b>{up.nome}</b><small className="block text-muted-foreground">{formatBRL(up.mensalidade)} · {up.tipo_cobranca === 'mensal' ? 'mensal' : 'única'}</small></span></label>)}</div></div>
    </div>)}
    {!items.length && <p className="rounded-md border border-dashed py-8 text-center text-sm text-muted-foreground">Nenhum servidor adicionado.</p>}
    <div className="grid gap-2 rounded-md bg-muted p-4 sm:grid-cols-2"><p><span className="text-xs text-muted-foreground">TOTAL MENSAL</span><strong className="block text-lg text-primary">{formatBRL(monthly)}</strong></p><p><span className="text-xs text-muted-foreground">TOTAL IMPLANTAÇÃO</span><strong className="block text-lg text-primary">{formatBRL(setup)}</strong></p></div>
  </div>;
}