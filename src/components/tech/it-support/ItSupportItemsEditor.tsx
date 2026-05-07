import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { SUP_CATALOG, formatBRL, type SupCatalogItem } from '@/lib/itSupportContent';

export interface SupEditableItem {
  description: string;
  qty: number;
  unit_price: number;
  unit_label?: string;
}

interface Props {
  items: SupEditableItem[];
  onChange: (items: SupEditableItem[]) => void;
  discount: number;
  onDiscountChange: (n: number) => void;
  setupFee: number;
  onSetupFeeChange: (n: number) => void;
  contractMonths: number;
  onContractMonthsChange: (n: number) => void;
}

const ItSupportItemsEditor: React.FC<Props> = ({
  items, onChange, discount, onDiscountChange, setupFee, onSetupFeeChange, contractMonths, onContractMonthsChange,
}) => {
  const monthlyTotal = useMemo(
    () => items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.unit_price) || 0), 0) - (discount || 0),
    [items, discount],
  );

  const updateItem = (idx: number, patch: Partial<SupEditableItem>) => {
    onChange(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };
  const removeItem = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const addCatalog = (c: SupCatalogItem) => {
    if (items.some((i) => i.description === c.description)) return;
    onChange([...items, { description: c.description, qty: 1, unit_price: c.unit_price, unit_label: c.unit_label }]);
  };
  const addCustom = () => onChange([...items, { description: '', qty: 1, unit_price: 0 }]);

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-semibold">Adicionar itens do catálogo</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {SUP_CATALOG.map((c) => {
            const added = items.some((i) => i.description === c.description);
            return (
              <Button
                key={c.description}
                type="button"
                variant={added ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => addCatalog(c)}
                disabled={added}
              >
                <Plus className="w-3 h-3 mr-1" />
                {c.description} — {formatBRL(c.unit_price)}{c.unit_label ? `/${c.unit_label}` : ''}
              </Button>
            );
          })}
          <Button type="button" variant="outline" size="sm" onClick={addCustom}>
            <Plus className="w-3 h-3 mr-1" /> Item personalizado
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="text-left px-3 py-2">Item</th>
              <th className="text-center px-3 py-2 w-24">Qtd</th>
              <th className="text-right px-3 py-2 w-36">Valor unit.</th>
              <th className="text-right px-3 py-2 w-36">Subtotal</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr><td colSpan={5} className="text-center text-gray-400 py-6 italic">Nenhum item adicionado</td></tr>
            )}
            {items.map((it, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-2 py-1">
                  <Input value={it.description} onChange={(e) => updateItem(idx, { description: e.target.value })} placeholder="Descrição" />
                </td>
                <td className="px-2 py-1">
                  <Input type="number" min={0} value={it.qty} onChange={(e) => updateItem(idx, { qty: Number(e.target.value) })} className="text-center" />
                </td>
                <td className="px-2 py-1">
                  <Input type="number" min={0} step="0.01" value={it.unit_price} onChange={(e) => updateItem(idx, { unit_price: Number(e.target.value) })} className="text-right" />
                </td>
                <td className="px-3 py-2 text-right font-medium">
                  {formatBRL((it.qty || 0) * (it.unit_price || 0))}
                </td>
                <td className="px-2 py-1 text-center">
                  <Button type="button" size="icon" variant="ghost" onClick={() => removeItem(idx)} className="text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <Label>Setup inicial (R$)</Label>
          <Input type="number" min={0} step="0.01" value={setupFee} onChange={(e) => onSetupFeeChange(Number(e.target.value))} />
        </div>
        <div>
          <Label>Desconto mensal (R$)</Label>
          <Input type="number" min={0} step="0.01" value={discount} onChange={(e) => onDiscountChange(Number(e.target.value))} />
        </div>
        <div>
          <Label>Vigência (meses)</Label>
          <Input type="number" min={1} value={contractMonths} onChange={(e) => onContractMonthsChange(Number(e.target.value))} />
        </div>
        <div className="md:text-right md:self-end">
          <Label className="block">Mensalidade total</Label>
          <div className="text-2xl font-bold text-blue-900">{formatBRL(monthlyTotal)}</div>
        </div>
      </div>
    </div>
  );
};

export default ItSupportItemsEditor;
