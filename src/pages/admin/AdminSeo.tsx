import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MousePointerClick, Eye, Percent, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

type Row = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number };
type Data = {
  range: { startDate: string; endDate: string; days: number };
  totals: { clicks: number; impressions: number; ctr: number; position: number };
  byDate: Row[];
  byQuery: Row[];
  byPage: Row[];
};

const PRESETS = [
  { label: '7 dias', days: 7 },
  { label: '28 dias', days: 28 },
  { label: '90 dias', days: 90 },
];

const formatPct = (n: number) => `${(n * 100).toFixed(2)}%`;
const formatNum = (n: number) => n.toLocaleString('pt-BR');
const formatPos = (n: number) => n.toFixed(1);

const AdminSeo = () => {
  const [days, setDays] = useState(28);
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gsc-performance?days=${days}`;
      const r = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });
      const json = await r.json();
      if (!r.ok) throw new Error(json.error || 'Erro ao carregar');
      setData(json);
    } catch (e: any) {
      setError(e.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [days]);

  const kpis = [
    { label: 'Cliques', value: data ? formatNum(data.totals.clicks) : '—', icon: MousePointerClick, color: 'text-blue-600 bg-blue-50' },
    { label: 'Impressões', value: data ? formatNum(data.totals.impressions) : '—', icon: Eye, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'CTR', value: data ? formatPct(data.totals.ctr) : '—', icon: Percent, color: 'text-purple-600 bg-purple-50' },
    { label: 'Posição média', value: data ? formatPos(data.totals.position) : '—', icon: TrendingUp, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Desempenho SEO</h2>
          <p className="text-sm text-gray-500">Dados do Google Search Console — delta7tecnologia.com.br</p>
        </div>
        <div className="flex items-center gap-2">
          {PRESETS.map((p) => (
            <Button
              key={p.days}
              variant={days === p.days ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDays(p.days)}
            >
              {p.label}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-medium">Não foi possível carregar os dados</p>
              <p className="text-amber-700 mt-1">{error}</p>
              <p className="text-xs text-amber-600 mt-2">
                Lembre-se: o Google Search Console pode levar alguns dias para coletar os primeiros dados após a verificação do domínio.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${k.color} mb-3`}>
                <k.icon className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{k.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{k.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Cliques e Impressões ao longo do tempo</CardTitle></CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.byDate.map(r => ({ date: r.keys?.[0], clicks: r.clicks, impressions: r.impressions })) ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#2563eb" strokeWidth={2} dot={false} name="Cliques" />
                <Line yAxisId="right" type="monotone" dataKey="impressions" stroke="#10b981" strokeWidth={2} dot={false} name="Impressões" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Principais consultas</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="text-left px-4 py-2">Consulta</th>
                    <th className="text-right px-4 py-2">Cliques</th>
                    <th className="text-right px-4 py-2">Impr.</th>
                    <th className="text-right px-4 py-2">CTR</th>
                    <th className="text-right px-4 py-2">Pos.</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(data?.byQuery ?? []).slice(0, 15).map((r, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2 truncate max-w-[180px]" title={r.keys?.[0]}>{r.keys?.[0]}</td>
                      <td className="px-4 py-2 text-right">{formatNum(r.clicks)}</td>
                      <td className="px-4 py-2 text-right">{formatNum(r.impressions)}</td>
                      <td className="px-4 py-2 text-right">{formatPct(r.ctr)}</td>
                      <td className="px-4 py-2 text-right">{formatPos(r.position)}</td>
                    </tr>
                  ))}
                  {(!data || data.byQuery.length === 0) && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Sem dados ainda.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Páginas com melhor desempenho</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="text-left px-4 py-2">Página</th>
                    <th className="text-right px-4 py-2">Cliques</th>
                    <th className="text-right px-4 py-2">Impr.</th>
                    <th className="text-right px-4 py-2">CTR</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(data?.byPage ?? []).slice(0, 15).map((r, i) => {
                    const path = (r.keys?.[0] || '').replace('https://delta7tecnologia.com.br', '') || '/';
                    return (
                      <tr key={i}>
                        <td className="px-4 py-2 truncate max-w-[200px]" title={r.keys?.[0]}>{path}</td>
                        <td className="px-4 py-2 text-right">{formatNum(r.clicks)}</td>
                        <td className="px-4 py-2 text-right">{formatNum(r.impressions)}</td>
                        <td className="px-4 py-2 text-right">{formatPct(r.ctr)}</td>
                      </tr>
                    );
                  })}
                  {(!data || data.byPage.length === 0) && (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Sem dados ainda.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSeo;
