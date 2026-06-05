import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Loader2, Users } from 'lucide-react';

export interface FeaturedClient {
  id: string;
  name: string;
  logo_url?: string | null;
  website_url?: string | null;
}

interface Props {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

const ClientShowcasePicker: React.FC<Props> = ({ selectedIds, onChange }) => {
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['proposal-client-showcase'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id,name,logo_url,website_url')
        .eq('is_active', true)
        .order('order_index', { ascending: true })
        .order('name', { ascending: true });
      if (error) throw error;
      return (data || []) as FeaturedClient[];
    },
  });

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const toggle = (id: string) => {
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id); else next.add(id);
    onChange(Array.from(next));
  };

  const selectAll = () => onChange(clients.map((c) => c.id));
  const clearAll = () => onChange([]);

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-blue-900 font-bold text-base">
            <Users className="w-4 h-4" /> Clientes em destaque
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Selecione clientes ativos do site para incluir uma seção de prova social no PDF da proposta.
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="outline" onClick={selectAll} disabled={isLoading || !clients.length}>
            Selecionar todos
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={clearAll} disabled={!selectedIds.length}>
            Limpar
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500 py-4"><Loader2 className="w-4 h-4 animate-spin" /> Carregando clientes…</div>
      ) : clients.length === 0 ? (
        <p className="text-sm text-gray-500 italic">Nenhum cliente ativo cadastrado.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {clients.map((c) => {
            const checked = selectedSet.has(c.id);
            return (
              <label
                key={c.id}
                className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors ${checked ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
              >
                <Checkbox checked={checked} onCheckedChange={() => toggle(c.id)} />
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  {c.logo_url ? (
                    <img src={c.logo_url} alt={c.name} className="w-7 h-7 object-contain bg-white rounded border border-gray-100" />
                  ) : (
                    <div className="w-7 h-7 rounded bg-blue-900/10 flex items-center justify-center text-[10px] font-bold text-blue-900">
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs text-gray-800 truncate">{c.name}</span>
                </div>
              </label>
            );
          })}
        </div>
      )}

      <p className="text-xs text-gray-400">
        {selectedIds.length} de {clients.length} clientes selecionados
      </p>
    </div>
  );
};

export const fetchFeaturedClients = async (ids: string[]): Promise<FeaturedClient[]> => {
  if (!ids?.length) return [];
  const { data, error } = await supabase
    .from('clients')
    .select('id,name,logo_url,website_url')
    .in('id', ids);
  if (error) throw error;
  // preserve original ordering
  const map = new Map((data || []).map((c: any) => [c.id, c as FeaturedClient]));
  return ids.map((id) => map.get(id)).filter(Boolean) as FeaturedClient[];
};

export default ClientShowcasePicker;
