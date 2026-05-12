import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListChecks } from 'lucide-react';
import { formatLicenseTitle, getCategoryLabel, type AssetLicense } from '@/lib/licenseCatalog';

interface AssetLite {
  id: string;
  machine_name: string;
  company_name: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assets: AssetLite[];
  licensesByAsset: Record<string, AssetLicense[]>;
  onConfirm: (selectedIds: string[]) => void;
}

const formatDate = (d: string | null) => (d ? new Date(d + 'T00:00:00').toLocaleDateString('pt-BR') : '—');

const LicenseSelectionDialog = ({ open, onOpenChange, assets, licensesByAsset, onConfirm }: Props) => {
  const allLicenses = useMemo(() => {
    const arr: { lic: AssetLicense; asset: AssetLite }[] = [];
    for (const a of assets) {
      for (const l of licensesByAsset[a.id] || []) arr.push({ lic: l, asset: a });
    }
    return arr;
  }, [assets, licensesByAsset]);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [lastN, setLastN] = useState<string>('3');

  // Default: tudo marcado ao abrir
  useEffect(() => {
    if (open) setSelected(new Set(allLicenses.map((x) => x.lic.id)));
  }, [open, allLicenses]);

  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const markAll = () => setSelected(new Set(allLicenses.map((x) => x.lic.id)));
  const clearAll = () => setSelected(new Set());

  const markLastN = () => {
    const n = Math.max(1, parseInt(lastN || '0', 10) || 0);
    if (!n) return;
    // ordena por activation_date desc (sem data vai pro fim) e pega N
    const sorted = [...allLicenses].sort((a, b) => {
      const da = a.lic.activation_date || '';
      const db = b.lic.activation_date || '';
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return db.localeCompare(da);
    });
    setSelected(new Set(sorted.slice(0, n).map((x) => x.lic.id)));
  };

  // Agrupa por ativo para exibição
  const grouped = useMemo(() => {
    const map = new Map<string, { asset: AssetLite; items: AssetLicense[] }>();
    for (const { lic, asset } of allLicenses) {
      if (!map.has(asset.id)) map.set(asset.id, { asset, items: [] });
      map.get(asset.id)!.items.push(lic);
    }
    return Array.from(map.values());
  }, [allLicenses]);

  const total = allLicenses.length;
  const count = selected.size;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-primary" />
            Selecionar licenças para o inventário
          </DialogTitle>
          <DialogDescription>
            Marque as licenças que devem aparecer no PDF entregue ao cliente. Equipamentos sem nenhuma licença marcada serão omitidos.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 items-center border rounded-md p-2 bg-muted/30 text-sm">
          <Button size="sm" variant="outline" onClick={markAll} type="button">Marcar todas</Button>
          <Button size="sm" variant="outline" onClick={clearAll} type="button">Desmarcar todas</Button>
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-xs text-muted-foreground">Marcar últimas</span>
            <Input
              type="number"
              min={1}
              value={lastN}
              onChange={(e) => setLastN(e.target.value)}
              className="h-8 w-16"
            />
            <span className="text-xs text-muted-foreground">por ativação</span>
            <Button size="sm" variant="secondary" onClick={markLastN} type="button">Aplicar</Button>
          </div>
        </div>

        <ScrollArea className="flex-1 h-[55vh] border rounded-md overflow-y-auto">
          <div className="p-2 space-y-3">
            {grouped.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6 italic">
                Nenhum equipamento com licenças cadastradas.
              </p>
            )}
            {grouped.map(({ asset, items }) => (
              <div key={asset.id} className="border rounded-md p-2">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold">{asset.machine_name}</p>
                    <p className="text-xs text-muted-foreground">{asset.company_name}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {items.filter((l) => selected.has(l.id)).length}/{items.length}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {items.map((lic) => (
                    <label
                      key={lic.id}
                      className="flex items-center gap-2 text-sm hover:bg-muted/50 px-2 py-1 rounded cursor-pointer"
                    >
                      <Checkbox
                        checked={selected.has(lic.id)}
                        onCheckedChange={() => toggle(lic.id)}
                      />
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {getCategoryLabel(lic.category)}
                      </Badge>
                      <span className="font-medium">{formatLicenseTitle(lic)}</span>
                      {lic.activation_date && (
                        <span className="text-[10px] text-muted-foreground">
                          · ativ. {formatDate(lic.activation_date)}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between gap-2 pt-2">
          <p className="text-xs text-muted-foreground">
            <strong>{count}</strong> de {total} licença{total === 1 ? '' : 's'} selecionada{count === 1 ? '' : 's'}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button
              onClick={() => onConfirm(Array.from(selected))}
              disabled={count === 0}
            >
              Continuar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LicenseSelectionDialog;
