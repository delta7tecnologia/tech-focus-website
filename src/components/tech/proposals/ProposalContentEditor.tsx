import { RotateCcw } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type NamedText = { title: string; text: string; [key: string]: unknown };
type Kpi = { value: string; label: string };
type Quote = { text: string; author: string };
type Sla = { priority: string; description: string; response: string; color: string };

export interface EditableProposalContent {
  about: string;
  kpis: Kpi[];
  benefits: NamedText[];
  infrastructure: NamedText[];
  idealFor: NamedText[];
  notIncluded: string;
  requirements: string[];
  quote: Quote;
  supportText?: string;
  contractText?: string;
  sla?: Sla[];
}

interface Props<T extends EditableProposalContent> {
  value: T;
  onChange: (value: T) => void;
  onReset: () => void;
  mode: 'backup' | 'support';
}

const ProposalContentEditor = <T extends EditableProposalContent>({ value, onChange, onReset, mode }: Props<T>) => {
  const set = <K extends keyof T>(key: K, next: T[K]) => onChange({ ...value, [key]: next });
  const updateNamed = (key: 'benefits' | 'infrastructure' | 'idealFor', index: number, field: 'title' | 'text', next: string) => {
    const list = value[key].map((item, i) => i === index ? { ...item, [field]: next } : item);
    onChange({ ...value, [key]: list });
  };
  const updateKpi = (index: number, field: keyof Kpi, next: string) =>
    onChange({ ...value, kpis: value.kpis.map((item, i) => i === index ? { ...item, [field]: next } : item) });
  const updateRequirement = (index: number, next: string) =>
    onChange({ ...value, requirements: value.requirements.map((item, i) => i === index ? next : item) });
  const updateSla = (index: number, field: 'priority' | 'description' | 'response', next: string) => {
    if (!value.sla) return;
    onChange({ ...value, sla: value.sla.map((item, i) => i === index ? { ...item, [field]: next } : item) });
  };
  const namedSection = (key: 'benefits' | 'infrastructure' | 'idealFor') => (
    <div className="space-y-3">{value[key].map((item, index) => <div key={index} className="grid gap-2 border-b pb-3 last:border-0"><Input aria-label={`Título ${index + 1}`} value={item.title} onChange={(e) => updateNamed(key, index, 'title', e.target.value)} /><Textarea aria-label={`Descrição ${index + 1}`} rows={2} value={item.text} onChange={(e) => updateNamed(key, index, 'text', e.target.value)} /></div>)}</div>
  );

  return <div className="rounded-md border p-4">
    <div className="flex items-center justify-between gap-3"><div><h4 className="font-semibold text-gray-900">Editar textos do documento</h4><p className="text-xs text-gray-500">As alterações valem somente para esta proposta.</p></div><Button type="button" size="sm" variant="outline" onClick={onReset}><RotateCcw className="mr-2 h-4 w-4" />Restaurar padrão</Button></div>
    <Accordion type="multiple" className="mt-3">
      <AccordionItem value="about"><AccordionTrigger>Sobre a Delta7 e indicadores</AccordionTrigger><AccordionContent className="space-y-3"><Textarea rows={7} value={value.about} onChange={(e) => set('about', e.target.value)} /><div className="grid gap-2 md:grid-cols-3">{value.kpis.map((item, index) => <div key={index} className="space-y-2"><Input aria-label={`Valor do indicador ${index + 1}`} value={item.value} onChange={(e) => updateKpi(index, 'value', e.target.value)} /><Input aria-label={`Nome do indicador ${index + 1}`} value={item.label} onChange={(e) => updateKpi(index, 'label', e.target.value)} /></div>)}</div></AccordionContent></AccordionItem>
      <AccordionItem value="benefits"><AccordionTrigger>Benefícios</AccordionTrigger><AccordionContent>{namedSection('benefits')}</AccordionContent></AccordionItem>
      <AccordionItem value="infra"><AccordionTrigger>Infraestrutura e tecnologias</AccordionTrigger><AccordionContent>{namedSection('infrastructure')}</AccordionContent></AccordionItem>
      <AccordionItem value="ideal"><AccordionTrigger>Perfil ideal</AccordionTrigger><AccordionContent>{namedSection('idealFor')}</AccordionContent></AccordionItem>
      {value.sla && <AccordionItem value="sla"><AccordionTrigger>SLA por prioridade</AccordionTrigger><AccordionContent className="space-y-3">{value.sla.map((item, index) => <div key={index} className="grid gap-2 border-b pb-3 last:border-0 md:grid-cols-3"><Input value={item.priority} onChange={(e) => updateSla(index, 'priority', e.target.value)} /><Input value={item.response} onChange={(e) => updateSla(index, 'response', e.target.value)} /><Textarea className="md:col-span-3" rows={2} value={item.description} onChange={(e) => updateSla(index, 'description', e.target.value)} /></div>)}</AccordionContent></AccordionItem>}
      <AccordionItem value="terms"><AccordionTrigger>Termos, condições e não inclusos</AccordionTrigger><AccordionContent className="space-y-4"><div><Label>{mode === 'backup' ? 'Texto de suporte' : 'Termos do contrato'}</Label><Textarea rows={7} value={mode === 'backup' ? value.supportText : value.contractText} onChange={(e) => mode === 'backup' ? onChange({ ...value, supportText: e.target.value }) : onChange({ ...value, contractText: e.target.value })} /></div><div><Label>Não inclusos</Label><Textarea rows={4} value={value.notIncluded} onChange={(e) => set('notIncluded', e.target.value)} /></div><div className="space-y-2"><Label>Requisitos e condições</Label>{value.requirements.map((item, index) => <Textarea key={index} rows={2} value={item} onChange={(e) => updateRequirement(index, e.target.value)} />)}</div></AccordionContent></AccordionItem>
      <AccordionItem value="quote"><AccordionTrigger>Citação institucional</AccordionTrigger><AccordionContent className="space-y-2"><Textarea rows={3} value={value.quote.text} onChange={(e) => onChange({ ...value, quote: { ...value.quote, text: e.target.value } })} /><Input value={value.quote.author} onChange={(e) => onChange({ ...value, quote: { ...value.quote, author: e.target.value } })} /></AccordionContent></AccordionItem>
    </Accordion>
  </div>;
};

export default ProposalContentEditor;