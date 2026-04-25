import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Search, FileText, Trash2, Download, Loader2 } from 'lucide-react';
import { downloadReportPdf, type ReportPhoto } from '@/utils/reportPdf';

const statusColor = (s: string) =>
  s === 'Resolvido' ? 'bg-green-100 text-green-700'
  : s === 'Condenado' ? 'bg-red-100 text-red-700'
  : 'bg-amber-100 text-amber-700';

const ReportList: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['technical-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technical_reports')
        .select('*')
        .order('generated_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = reports.filter((r: any) => {
    const q = search.toLowerCase();
    return (
      r.report_number.toLowerCase().includes(q) ||
      r.company_name.toLowerCase().includes(q) ||
      r.equipment.toLowerCase().includes(q)
    );
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const report = reports.find((r: any) => r.id === id);
      // Remove fotos do storage
      if (report?.photos && Array.isArray(report.photos) && report.photos.length > 0) {
        const paths = (report.photos as Array<{ path: string }>).map((p) => p.path).filter(Boolean);
        if (paths.length > 0) {
          await supabase.storage.from('report-photos').remove(paths);
        }
      }
      const { error } = await supabase.from('technical_reports').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technical-reports'] });
      toast({ title: 'Laudo excluído.' });
      setDeleteId(null);
    },
    onError: (e: any) => {
      toast({ title: 'Erro ao excluir', description: e.message, variant: 'destructive' });
    },
  });

  const handleDownload = async (r: any) => {
    setDownloadingId(r.id);
    try {
      // Baixa fotos como dataURL
      const photos: ReportPhoto[] = [];
      for (const p of (r.photos || []) as Array<{ path: string; caption: string }>) {
        const { data } = await supabase.storage.from('report-photos').download(p.path);
        if (data) {
          const dataUrl = await new Promise<string>((res, rej) => {
            const reader = new FileReader();
            reader.onload = () => res(reader.result as string);
            reader.onerror = rej;
            reader.readAsDataURL(data);
          });
          photos.push({ dataUrl, caption: p.caption });
        }
      }
      await downloadReportPdf({
        reportNumber: r.report_number,
        technicianName: r.technician_name,
        companyName: r.company_name,
        equipment: r.equipment,
        generatedAt: r.generated_at,
        triagem: r.triagem,
        diagnostico: r.diagnostico,
        conclusao: r.conclusao,
        photos,
        integrityHash: r.integrity_hash,
      });
    } catch (e: any) {
      toast({ title: 'Erro ao baixar laudo', description: e.message, variant: 'destructive' });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Buscar por número, cliente ou equipamento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Carregando...</div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum laudo encontrado.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((r: any) => (
            <Card key={r.id}>
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-blue-900">{r.report_number}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${statusColor(r.status_final)}`}>
                      {r.status_final}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 truncate mt-1">{r.company_name}</p>
                  <p className="text-sm text-gray-500 truncate">{r.equipment}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(r.generated_at).toLocaleString('pt-BR')} · {r.technician_name}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(r)}
                    disabled={downloadingId === r.id}
                  >
                    {downloadingId === r.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Download className="w-4 h-4" />}
                  </Button>
                  {r.created_by === user?.id && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600"
                      onClick={() => setDeleteId(r.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir laudo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação remove o laudo e suas fotos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReportList;
