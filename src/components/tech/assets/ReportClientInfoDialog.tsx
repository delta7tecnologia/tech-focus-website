import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText, CheckCircle2, AlertCircle, Loader2, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { validateDocument, formatDocument, onlyDigits } from '@/lib/validators/document';

export interface ReportClientInfo {
  company_name: string;
  document: string;
  contact_person: string;
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
  const [source, setSource] = useState<'name-exact' | 'document' | 'manual' | 'not-found' | null>(null);
  const [docLookup, setDocLookup] = useState('');

  // Busca um cliente por nome exato (case-insensitive). Sem ilike fuzzy.
  const fetchByName = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return null;
    const { data } = await supabase
      .from('clients')
      .select('name, document, contact_person, address')
      // ilike sem wildcards = comparação exata case-insensitive
      .ilike('name', trimmed)
      .limit(1)
      .maybeSingle();
    return data;
  };

  // Busca por documento normalizado (somente dígitos).
  // Tenta tanto a forma normalizada quanto pelo dígito puro armazenado.
  const fetchByDocument = async (rawDoc: string) => {
    const digits = onlyDigits(rawDoc);
    if (!digits) return null;
    // RPC simples: pega todos clientes não nulos e compara por dígitos no client-side
    // (volume baixo de clientes — solução mais robusta sem precisar de índice).
    const { data } = await supabase
      .from('clients')
      .select('name, document, contact_person, address')
      .not('document', 'is', null);
    return (data || []).find((c) => onlyDigits(c.document || '') === digits) || null;
  };

  useEffect(() => {
    if (!open) return;
    const company = defaultCompany?.trim();
    setDocLookup('');

    if (!company) {
      setInfo({ company_name: '', document: '', contact_person: '', address: '' });
      setSource(null);
      return;
    }

    setLoading(true);
    setSource(null);
    fetchByName(company)
      .then((data) => {
        if (data) {
          setInfo({
            company_name: data.name,
            document: data.document ? formatDocument(data.document) : '',
            contact_person: data.contact_person || '',
            address: data.address || '',
          });
          setSource('name-exact');
        } else {
          setInfo({ company_name: company, document: '', contact_person: '', address: '' });
          setSource('not-found');
        }
      })
      .finally(() => setLoading(false));
  }, [open, defaultCompany]);

  const handleDocLookup = async () => {
    if (!docLookup.trim()) return;
    const v = validateDocument(docLookup);
    if (!v.valid) return;
    setLoading(true);
    const data = await fetchByDocument(docLookup);
    setLoading(false);
    if (data) {
      setInfo({
        company_name: data.name,
        document: data.document ? formatDocument(data.document) : formatDocument(docLookup),
        contact_person: data.contact_person || '',
        address: data.address || '',
      });
      setSource('document');
    } else {
      setSource('not-found');
      setInfo((s) => ({ ...s, document: formatDocument(docLookup) }));
    }
  };

  const docValidation = validateDocument(info.document);
  const lookupValidation = validateDocument(docLookup);
  const canConfirm = !!info.company_name.trim() && !loading && (docValidation.empty || docValidation.valid);

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm({ ...info, document: docValidation.empty ? '' : formatDocument(info.document) });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Dados do cliente para o relatório
          </DialogTitle>
          <DialogDescription>
            Buscamos no cadastro pelo nome exato. Se não encontrar, busque pelo CNPJ/CPF abaixo ou cadastre em <b>Admin → Clientes</b>.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-6 flex items-center justify-center text-sm text-muted-foreground gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Buscando cadastro...
          </div>
        ) : (
          <>
            {source === 'name-exact' && (
              <div className="flex items-start gap-2 text-xs bg-green-50 text-green-700 border border-green-200 rounded p-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Cliente localizado pelo nome cadastrado.</span>
              </div>
            )}
            {source === 'document' && (
              <div className="flex items-start gap-2 text-xs bg-green-50 text-green-700 border border-green-200 rounded p-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Cliente localizado pelo documento (CNPJ/CPF).</span>
              </div>
            )}
            {source === 'not-found' && (
              <div className="flex items-start gap-2 text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded p-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Não encontrado pelo nome. Use a busca por CNPJ/CPF abaixo ou preencha manualmente.</span>
              </div>
            )}

            {/* Busca por CNPJ/CPF — sempre visível */}
            <div className="space-y-1 border rounded-md p-2 bg-muted/30">
              <Label className="text-xs font-semibold">Buscar cliente por CNPJ/CPF</Label>
              <div className="flex gap-2">
                <Input
                  value={docLookup}
                  onChange={(e) => setDocLookup(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && lookupValidation.valid && !lookupValidation.empty) {
                      e.preventDefault();
                      handleDocLookup();
                    }
                  }}
                  placeholder="00.000.000/0001-00 ou 000.000.000-00"
                  className={!lookupValidation.empty && !lookupValidation.valid ? 'border-destructive' : ''}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDocLookup}
                  disabled={!lookupValidation.valid || lookupValidation.empty}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              {!lookupValidation.empty && !lookupValidation.valid && (
                <p className="text-xs text-destructive">{lookupValidation.message}</p>
              )}
              {lookupValidation.empty && (
                <p className="text-xs text-muted-foreground">Digite o documento e clique na lupa (ou pressione Enter).</p>
              )}
            </div>

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
                  onBlur={() => {
                    const v = validateDocument(info.document);
                    if (v.valid && !v.empty) setInfo((s) => ({ ...s, document: formatDocument(s.document) }));
                  }}
                  placeholder="00.000.000/0001-00"
                  className={!docValidation.empty && !docValidation.valid ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {!docValidation.empty && !docValidation.valid && (
                  <p className="text-xs text-destructive mt-1">{docValidation.message}</p>
                )}
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
          <Button onClick={handleConfirm} disabled={!canConfirm}>
            Gerar relatório
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportClientInfoDialog;
