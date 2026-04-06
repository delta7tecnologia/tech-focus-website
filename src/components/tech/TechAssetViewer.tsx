import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Monitor, Eye, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const TechAssetViewer = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [visibleLicenses, setVisibleLicenses] = useState<Record<string, boolean>>({});

  const toggleLicense = (key: string) => {
    setVisibleLicenses(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['tech-assets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('company_name', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const companies = [...new Set(assets.map(a => a.company_name))].sort();

  const filtered = assets.filter(a => {
    const matchesSearch = a.machine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = !companyFilter || a.company_name === companyFilter;
    return matchesSearch && matchesCompany;
  });

  const formatDate = (d: string | null) => {
    if (!d) return '—';
    return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Licença copiada!' });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Buscar por máquina ou empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">Todas as empresas</option>
          {companies.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Carregando...</div>
      ) : !filtered.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Monitor className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum patrimônio encontrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((asset) => (
            <Card key={asset.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{asset.machine_name}</p>
                    <p className="text-sm text-gray-500">{asset.company_name}</p>
                  </div>
                  {asset.screenshot_url && (
                    <Button size="icon" variant="ghost" onClick={() => setViewImage(asset.screenshot_url)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Windows</p>
                    <p className="text-xs text-gray-400">Ativação: {formatDate(asset.windows_activation_date)}</p>
                    {asset.windows_license ? (
                      <button
                        onClick={() => copyToClipboard(asset.windows_license!)}
                        className="flex items-center gap-1 mt-1 text-xs font-mono bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors break-all text-left"
                      >
                        <Copy className="w-3 h-3 flex-shrink-0" />
                        {asset.windows_license}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">Sem licença</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Office</p>
                    <p className="text-xs text-gray-400">Ativação: {formatDate(asset.office_activation_date)}</p>
                    {asset.office_license ? (
                      <button
                        onClick={() => copyToClipboard(asset.office_license!)}
                        className="flex items-center gap-1 mt-1 text-xs font-mono bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors break-all text-left"
                      >
                        <Copy className="w-3 h-3 flex-shrink-0" />
                        {asset.office_license}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">Sem licença</span>
                    )}
                  </div>
                </div>

                {asset.notes && (
                  <p className="text-xs text-gray-500 border-t pt-2">{asset.notes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!viewImage} onOpenChange={() => setViewImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Evidência</DialogTitle>
          </DialogHeader>
          {viewImage && <img src={viewImage} alt="Evidência" className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TechAssetViewer;
