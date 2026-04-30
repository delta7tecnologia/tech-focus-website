import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';

export interface ReportClientInfo {
  company_name: string;
  document: string;       // CNPJ/CPF
  contact_person: string; // Responsável
  address: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCompany?: string;
  onConfirm: (info: ReportClientInfo) => void;
}

const STORAGE_KEY = 'delta7-report-client-info';

const ReportClientInfoDialog = ({ open, onOpenChange, defaultCompany, onConfirm }: Props) => {
  const loadCached = (): Partial<ReportClientInfo> => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const all = JSON.parse(raw) as Record<string, ReportClientInfo>;
      return defaultCompany ? all[defaultCompany] || {} : {};
    } catch {
      return {};
    }
  };

  const cached = loadCached();
  const [info, setInfo] = useState<ReportClientInfo>({
    company_name: defaultCompany || cached.company_name || '',
    document: cached.document || '',
    contact_person: cached.contact_person || '',
    address: cached.address || '',
  });

  const handleConfirm = () => {
    // Persiste por empresa para reusar nos próximos relatórios
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const all = raw ? JSON.parse(raw) : {};
      if (info.company_name) all[info.company_name] = info;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {/* noop */}
    onConfirm(info);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Dados do cliente para o relatório
          </DialogTitle>
          <DialogDescription>
            Estes dados aparecerão na capa do PDF. Ficam salvos por empresa para os próximos relatórios.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div>
            <Label htmlFor="rc-company">Razão social / Empresa *</Label>
            <Input
              id="rc-company"
              value={info.company_name}
              onChange={(e) => setInfo((s) => ({ ...s, company_name: e.target.value }))}
              placeholder="Ex: Empresa XYZ Ltda."
            />
          </div>
          <div>
            <Label htmlFor="rc-doc">CNPJ / CPF</Label>
            <Input
              id="rc-doc"
              value={info.document}
              onChange={(e) => setInfo((s) => ({ ...s, document: e.target.value }))}
              placeholder="00.000.000/0001-00"
            />
          </div>
          <div>
            <Label htmlFor="rc-resp">Responsável</Label>
            <Input
              id="rc-resp"
              value={info.contact_person}
              onChange={(e) => setInfo((s) => ({ ...s, contact_person: e.target.value }))}
              placeholder="Nome do contato técnico ou administrativo"
            />
          </div>
          <div>
            <Label htmlFor="rc-addr">Endereço</Label>
            <Textarea
              id="rc-addr"
              value={info.address}
              onChange={(e) => setInfo((s) => ({ ...s, address: e.target.value }))}
              placeholder="Rua, nº, bairro, cidade/UF"
              rows={2}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleConfirm} disabled={!info.company_name.trim()}>
            Gerar relatório
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportClientInfoDialog;
