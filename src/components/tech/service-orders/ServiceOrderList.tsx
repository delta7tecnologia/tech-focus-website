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
import { Search, ClipboardList, Trash2, Download, Loader2, Pencil, MapPin } from 'lucide-react';
import { downloadServiceOrderPdf, type SOEvidence } from '@/utils/serviceOrderPdf';

interface Props {
  onEdit?: (os: any) => void;
}

const VISIT_LABEL: Record<string, string> = {
  obra: 'Obra',
  atendimento: 'Atendimento',
  reuniao: 'Reunião',
  outro: 'Outro',
};

const ServiceOrderList: React.FC<Props> = ({ onEdit }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data: perms = { isAdmin: false } } = useQuery({
    queryKey: ['so-perms', user?.id],
    queryFn: async () => {
      if (!user) return { isAdmin: false };
      const { data } = await supabase.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle();
      return { isAdmin: data?.role === 'admin' };
    },
    enabled: !!user,
  });

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['service-orders'],
    queryFn: async () => {
      const { data, error } = await supabase.from('service_orders').select('*').order('generated_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = orders.filter((o: any) => {
    const q = search.toLowerCase();
    return o.os_number.toLowerCase().includes(q) || o.client_name.toLowerCase().includes(q) || (o.client_address || '').toLowerCase().includes(q);
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const os = orders.find((o: any) => o.id === id);
      if (Array.isArray(os?.evidences) && os.evidences.length > 0) {
        await supabase.storage.from('service-order-photos').remove(os.evidences.map((e: any) => e.path));
      }
      const { error } = await supabase.from('service_orders').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['service-orders'] });
      toast({ title: 'OS excluída.' });
      setDeleteId(null);
    },
    onError: (e: any) => toast({ title: 'Erro ao excluir', description: e.message, variant: 'destructive' }),
  });

  const handleDownload = async (o: any) => {
    setDownloadingId(o.id);
    try {
      const evs: SOEvidence[] = [];
      for (const ev of (o.evidences || [])) {
        const { data } = await supabase.storage.from('service-order-photos').download(ev.path);
        if (data) {
          const dataUrl = await new Promise<string>((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result as string);
            r.onerror = rej;
            r.readAsDataURL(data);
          });
          evs.push({ dataUrl, caption: ev.caption });
        }
      }
      await downloadServiceOrderPdf({
        osNumber: o.os_number,
        generatedAt: o.generated_at,
        technicianName: o.technician_name,
        clientName: o.client_name,
        clientContact: o.client_contact || '',
        clientAddress: o.client_address,
        visitType: o.visit_type,
        requestedBy: o.requested_by || '',
        requestedByRole: o.requested_by_role || '',
        scheduledAt: o.scheduled_at || '',
        startedAt: o.started_at || '',
        finishedAt: o.finished_at || '',
        checkin: { lat: o.checkin_lat, lng: o.checkin_lng, accuracy: o.checkin_accuracy, at: o.checkin_at },
        checkout: { lat: o.checkout_lat, lng: o.checkout_lng, accuracy: o.checkout_accuracy, at: o.checkout_at },
        summary: o.summary || '',
        checklist: o.checklist || [],
        materials: o.materials || [],
        travel: o.travel || {},
        evidences: evs,
        signerName: o.signer_name || '',
        signerRole: o.signer_role || '',
        signerDocument: o.signer_document || '',
        signatureData: o.signature_data || '',
        signedAt: o.signed_at || '',
        integrityHash: o.integrity_hash || '',
      });
    } catch (e: any) {
      toast({ title: 'Erro ao baixar', description: e.message, variant: 'destructive' });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input className="pl-10" placeholder="Buscar por número, cliente ou endereço..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Carregando...</div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma ordem de serviço encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((o: any) => (
            <Card key={o.id}>
              <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-blue-900">{o.os_number}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">{VISIT_LABEL[o.visit_type] || o.visit_type}</span>
                    {o.is_draft ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 font-semibold">RASCUNHO</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800 font-semibold">EMITIDA</span>
                    )}
                    {o.checkin_at && (
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Geolocalizada
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900 truncate mt-1">{o.client_name}</p>
                  <p className="text-sm text-gray-500 truncate">{o.client_address}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(o.generated_at).toLocaleString('pt-BR')} · {o.technician_name}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {onEdit && (o.created_by === user?.id || perms.isAdmin) && (
                    <Button size="sm" variant="outline" className="text-blue-900" onClick={() => onEdit(o)}>
                      <Pencil className="w-4 h-4 mr-1" /> {o.is_draft ? 'Continuar' : 'Editar'}
                    </Button>
                  )}
                  {!o.is_draft && (
                    <Button size="sm" variant="outline" onClick={() => handleDownload(o)} disabled={downloadingId === o.id}>
                      {downloadingId === o.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    </Button>
                  )}
                  {(o.created_by === user?.id || perms.isAdmin) && (
                    <Button size="sm" variant="ghost" className="text-red-600" onClick={() => setDeleteId(o.id)}>
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
            <AlertDialogTitle>Excluir ordem de serviço?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação remove a OS e suas evidências permanentemente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteId && deleteMutation.mutate(deleteId)}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ServiceOrderList;
