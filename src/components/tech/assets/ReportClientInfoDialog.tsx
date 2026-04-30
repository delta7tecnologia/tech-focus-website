import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

const ReportClientInfoDialog = ({ open, onOpenChange, defaultCompany, onConfirm }: Props) => {
  const [info, setInfo] = useState<ReportClientInfo>({
    company_name: defaultCompany || '',
    document: '',
    contact_person: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<'registry' | 'manual' | 'not-found' | null>(null);

  // Sempre que abre o diálogo, tenta buscar do cadastro
  useEffect(() => {
    if (!open) return;
    const company = defaultCompany?.trim();
    if (!company) {
      setInfo({ company_name: '', document: '', contact_person: '', address: '' });
      setSource(null);
      return;
    }

    setLoading(true);
    setSource(null);
    supabase
      .from('clients')
      .select('name, document, contact_person, address')
      .ilike('name', company)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setInfo({
            company_name: data.name,
            document: data.document || '',
            contact_person: data.contact_person || '',
            address: data.address || '',
          });
          setSource('registry');
        } else {
          setInfo({ company_name: company, document: '', contact_person: '', address: '' });
          setSource('not-found');
        }
      })
      .then(() => setLoading(false));
  }, [open, defaultCompany]);

  const handleConfirm = () => {
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
            As informações são puxadas automaticamente do cadastro de clientes. Edite no painel "Clientes" para alterar permanentemente.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-6 flex items-center justify-center text-sm text-muted-foreground gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Buscando cadastro...
          </div>
        ) : (
          <>
            {source === 'registry' && (
              <div className="flex items-start gap-2 text-xs bg-green-50 text-green-700 border border-green-200 rounded p-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Dados carregados do cadastro de clientes.</span>
              </div>
            )}
            {source === 'not-found' && (
              <div className="flex items-start gap-2 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded p-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  Cliente não encontrado no cadastro. Preencha os dados abaixo manualmente ou cadastre-o em <b>Admin → Clientes</b> para reuso futuro.
                </span>
              </div>
            )}

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
                  placeholder="Nome do contato"
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
          </>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleConfirm} disabled={!info.company_name.trim() || loading}>
            Gerar relatório
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportClientInfoDialog;
