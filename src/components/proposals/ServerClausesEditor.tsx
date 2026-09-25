import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { ServerClause, ServerModality } from '@/lib/serverRental';

export default function ServerClausesEditor({ clauses, modality, onChange }: { clauses: ServerClause[]; modality: ServerModality; onChange: (value: ServerClause[]) => void }) {
  const update = (index: number, patch: Partial<ServerClause>) => onChange(clauses.map((c, i) => i === index ? { ...c, ...patch } : c));
  return <div className="space-y-3"><p className="text-xs text-amber-700">Textos-modelo. Revise com o jurídico antes do primeiro uso.</p>{clauses.filter(c => !(c.key === 'compra' && modality === 'dedicado')).map((clause) => {
    const index = clauses.findIndex(c => c.key === clause.key);
    return <div key={clause.key} className="rounded-md border p-4 space-y-3"><div className="flex justify-between gap-3"><Label>{clause.title}</Label><Switch checked={clause.active} disabled={clause.key === 'pagamento'} onCheckedChange={active => update(index, { active })} /></div>{clause.active && <><div className="grid gap-2 sm:grid-cols-3">{Object.entries(clause.params).map(([key, value]) => <div key={key}><Label className="text-xs">{key.replaceAll('_', ' ')}</Label><Input value={value} onChange={e => update(index, { params: { ...clause.params, [key]: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value) } })} /></div>)}</div><Textarea rows={5} value={clause.text} onChange={e => update(index, { text: e.target.value })} /></>}</div>;
  })}</div>;
}