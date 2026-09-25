import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RotateCcw } from 'lucide-react';
import type { ServerProposalContent } from '@/lib/serverRental';

export default function ServerContentEditor({ value, onChange, onReset }: { value: ServerProposalContent; onChange: (value: ServerProposalContent) => void; onReset: () => void }) {
  const field = (key: keyof ServerProposalContent, label: string, rows = 3) => <div><Label>{label}</Label><Textarea rows={rows} value={value[key]} onChange={e => onChange({ ...value, [key]: e.target.value })} /></div>;
  return <div className="rounded-md border p-4 space-y-4"><div className="flex justify-between gap-3"><div><h4 className="font-semibold">Editar textos do documento</h4><p className="text-xs text-muted-foreground">As alterações valem somente para esta proposta.</p></div><Button type="button" size="sm" variant="outline" onClick={onReset}><RotateCcw className="mr-2 h-4 w-4" />Restaurar</Button></div>{field('coverSubtitle', 'Subtítulo da capa')}{field('onPremiseSummary', 'Resumo — servidor no cliente')}{field('dedicatedSummary', 'Resumo — servidor dedicado')}{field('includedTitle', 'Título dos serviços incluídos', 2)}{field('acceptanceText', 'Texto de aceite')}</div>;
}