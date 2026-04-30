import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Eye, EyeOff, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  LICENSE_CATALOG,
  getCategory,
  getProductsForCategory,
  getEditionsForProduct,
  emptyLicenseDraft,
  type LicenseDraft,
} from '@/lib/licenseCatalog';

interface Props {
  value: LicenseDraft[];
  onChange: (next: LicenseDraft[]) => void;
}

const LicenseListEditor: React.FC<Props> = ({ value, onChange }) => {
  const { toast } = useToast();
  const [visible, setVisible] = useState<Record<number, boolean>>({});

  const update = (idx: number, patch: Partial<LicenseDraft>) => {
    const next = value.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    onChange(next);
  };

  const remove = (idx: number) => {
    onChange(value.filter((_, i) => i !== idx));
  };

  const add = () => {
    onChange([...value, emptyLicenseDraft()]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Licenças instaladas</label>
        <Button type="button" size="sm" variant="outline" onClick={add} className="gap-1">
          <Plus className="w-4 h-4" /> Adicionar licença
        </Button>
      </div>

      {value.length === 0 && (
        <p className="text-xs text-muted-foreground italic">
          Nenhuma licença cadastrada. Clique em "Adicionar licença" para incluir Windows, Office, M365, CAL RDS, antivírus etc.
        </p>
      )}

      {value.map((lic, idx) => {
        const cat = getCategory(lic.category);
        const products = getProductsForCategory(lic.category);
        const editions = getEditionsForProduct(lic.category, lic.product);
        const allowCustomProduct = cat?.allowCustom || lic.category === 'outro';
        const isVisible = !!visible[idx];

        return (
          <Card key={idx} className="p-3 space-y-2 bg-muted/30">
            <div className="flex items-start gap-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                {/* Categoria */}
                <div>
                  <label className="text-xs text-muted-foreground">Categoria</label>
                  <Select
                    value={lic.category}
                    onValueChange={(v) => update(idx, { category: v, product: '', edition: '' })}
                  >
                    <SelectTrigger className="h-9"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {LICENSE_CATALOG.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Produto */}
                <div>
                  <label className="text-xs text-muted-foreground">Produto</label>
                  {products.length > 0 && !allowCustomProduct ? (
                    <Select
                      value={lic.product}
                      onValueChange={(v) => update(idx, { product: v, edition: '' })}
                      disabled={!lic.category}
                    >
                      <SelectTrigger className="h-9"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : products.length > 0 ? (
                    <div className="flex gap-1">
                      <Select
                        value={products.some((p) => p.value === lic.product) ? lic.product : ''}
                        onValueChange={(v) => update(idx, { product: v, edition: '' })}
                        disabled={!lic.category}
                      >
                        <SelectTrigger className="h-9 flex-1"><SelectValue placeholder="Sugestões..." /></SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <Input
                      className="h-9"
                      value={lic.product}
                      onChange={(e) => update(idx, { product: e.target.value })}
                      placeholder="Nome do produto"
                      disabled={!lic.category}
                    />
                  )}
                  {allowCustomProduct && products.length > 0 && (
                    <Input
                      className="h-8 mt-1 text-xs"
                      value={lic.product}
                      onChange={(e) => update(idx, { product: e.target.value })}
                      placeholder="Ou digite outro produto"
                    />
                  )}
                </div>

                {/* Edição */}
                <div>
                  <label className="text-xs text-muted-foreground">Edição</label>
                  {editions.length > 0 ? (
                    <Select
                      value={lic.edition}
                      onValueChange={(v) => update(idx, { edition: v })}
                      disabled={!lic.product}
                    >
                      <SelectTrigger className="h-9"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        {editions.map((e) => (
                          <SelectItem key={e} value={e}>{e}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      className="h-9"
                      value={lic.edition}
                      onChange={(e) => update(idx, { edition: e.target.value })}
                      placeholder="Ex: Pro, Standard..."
                      disabled={!lic.product}
                    />
                  )}
                </div>
              </div>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => remove(idx)}
                className="text-destructive hover:text-destructive shrink-0"
                title="Remover"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2">
                <label className="text-xs text-muted-foreground">Chave de licença</label>
                <div className="flex gap-1">
                  <Input
                    className="h-9 font-mono text-xs"
                    type={isVisible ? 'text' : 'password'}
                    value={lic.license_key}
                    onChange={(e) => update(idx, { license_key: e.target.value })}
                    placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-9 w-9 shrink-0"
                    onClick={() => setVisible((v) => ({ ...v, [idx]: !v[idx] }))}
                    title={isVisible ? 'Ocultar' : 'Mostrar'}
                  >
                    {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  {lic.license_key && (
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText(lic.license_key);
                        toast({ title: 'Licença copiada!' });
                      }}
                      title="Copiar"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Ativação</label>
                <Input
                  className="h-9"
                  type="date"
                  value={lic.activation_date}
                  onChange={(e) => update(idx, { activation_date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Observações da licença (opcional)</label>
              <Textarea
                rows={2}
                value={lic.notes}
                onChange={(e) => update(idx, { notes: e.target.value })}
                placeholder="Conta vinculada, nº de assento, validade, etc."
                className="text-sm"
              />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default LicenseListEditor;
