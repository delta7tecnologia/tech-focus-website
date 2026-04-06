import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Monitor, Upload, Eye, Search } from 'lucide-react';

interface Asset {
  id: string;
  machine_name: string;
  company_name: string;
  windows_activation_date: string | null;
  office_activation_date: string | null;
  windows_license: string | null;
  office_license: string | null;
  notes: string | null;
  screenshot_url: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

const emptyForm = {
  machine_name: '',
  company_name: '',
  windows_activation_date: '',
  office_activation_date: '',
  windows_license: '',
  office_license: '',
  notes: '',
};

const AdminAssets = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [deleteAsset, setDeleteAsset] = useState<Asset | null>(null);
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [hiddenLicenses, setHiddenLicenses] = useState<Record<string, boolean>>({});

  const toggleLicense = (key: string) => {
    setHiddenLicenses(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['admin-assets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Asset[];
    },
  });

  const companies = [...new Set(assets.map(a => a.company_name))].sort();

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.machine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = !companyFilter || a.company_name === companyFilter;
    return matchesSearch && matchesCompany;
  });

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setScreenshotFile(null);
    setScreenshotPreview(null);
    setDialogOpen(true);
  };

  const openEdit = (asset: Asset) => {
    setEditingId(asset.id);
    setForm({
      machine_name: asset.machine_name,
      company_name: asset.company_name,
      windows_activation_date: asset.windows_activation_date || '',
      office_activation_date: asset.office_activation_date || '',
      windows_license: asset.windows_license || '',
      office_license: asset.office_license || '',
      notes: asset.notes || '',
    });
    setScreenshotFile(null);
    setScreenshotPreview(asset.screenshot_url || null);
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshotFile(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const uploadScreenshot = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from('asset-screenshots')
      .upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage
      .from('asset-screenshots')
      .getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.machine_name.trim() || !form.company_name.trim()) {
      toast({ title: 'Erro', description: 'Nome da máquina e empresa são obrigatórios.', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      let screenshot_url = editingId
        ? assets.find(a => a.id === editingId)?.screenshot_url || null
        : null;

      if (screenshotFile) {
        screenshot_url = await uploadScreenshot(screenshotFile);
      }

      const { data: { user } } = await supabase.auth.getUser();

      const payload = {
        machine_name: form.machine_name.trim(),
        company_name: form.company_name.trim(),
        windows_activation_date: form.windows_activation_date || null,
        office_activation_date: form.office_activation_date || null,
        windows_license: form.windows_license.trim() || null,
        office_license: form.office_license.trim() || null,
        notes: form.notes.trim() || null,
        screenshot_url,
      };

      if (editingId) {
        const { error } = await supabase.from('assets').update(payload).eq('id', editingId);
        if (error) throw error;
        toast({ title: 'Patrimônio atualizado!' });
      } else {
        const { error } = await supabase.from('assets').insert({ ...payload, created_by: user!.id });
        if (error) throw error;
        toast({ title: 'Patrimônio cadastrado!' });
      }

      queryClient.invalidateQueries({ queryKey: ['admin-assets'] });
      setDialogOpen(false);
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteAsset) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('assets').delete().eq('id', deleteAsset.id);
      if (error) throw error;
      toast({ title: 'Patrimônio excluído!' });
      queryClient.invalidateQueries({ queryKey: ['admin-assets'] });
      setDeleteAsset(null);
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d: string | null) => {
    if (!d) return '—';
    return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patrimônios</h2>
          <p className="text-gray-500">Gerencie os patrimônios e licenças das máquinas</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" /> Novo Patrimônio
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar por máquina ou empresa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum patrimônio cadastrado.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Máquina</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Windows</TableHead>
                <TableHead>Office</TableHead>
                <TableHead>Evidência</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.machine_name}</TableCell>
                  <TableCell>{asset.company_name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Ativação: {formatDate(asset.windows_activation_date)}</p>
                      {asset.windows_license ? (
                        <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono break-all">{asset.windows_license}</code>
                      ) : (
                        <span className="text-xs text-gray-400">Sem licença</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Ativação: {formatDate(asset.office_activation_date)}</p>
                      {asset.office_license ? (
                        <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded font-mono break-all">{asset.office_license}</code>
                      ) : (
                        <span className="text-xs text-gray-400">Sem licença</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {asset.screenshot_url ? (
                      <button
                        onClick={() => setViewImage(asset.screenshot_url)}
                        className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                      >
                        <Eye className="w-4 h-4" /> Ver
                      </button>
                    ) : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(asset)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => setDeleteAsset(asset)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Patrimônio' : 'Novo Patrimônio'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome da Máquina *</label>
              <Input value={form.machine_name} onChange={e => setForm(f => ({ ...f, machine_name: e.target.value }))} placeholder="Ex: PC-001" />
            </div>
            <div>
              <label className="text-sm font-medium">Empresa *</label>
              <Input value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} placeholder="Nome da empresa" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Ativação Windows</label>
                <Input type="date" value={form.windows_activation_date} onChange={e => setForm(f => ({ ...f, windows_activation_date: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium">Ativação Office</label>
                <Input type="date" value={form.office_activation_date} onChange={e => setForm(f => ({ ...f, office_activation_date: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Licença Windows</label>
              <Input value={form.windows_license} onChange={e => setForm(f => ({ ...f, windows_license: e.target.value }))} placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX" />
            </div>
            <div>
              <label className="text-sm font-medium">Licença Office</label>
              <Input value={form.office_license} onChange={e => setForm(f => ({ ...f, office_license: e.target.value }))} placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX" />
            </div>
            <div>
              <label className="text-sm font-medium">Evidência (Print Screen)</label>
              <div className="mt-1">
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />
                <Button type="button" variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4" /> Selecionar imagem
                </Button>
              </div>
              {screenshotPreview && (
                <img src={screenshotPreview} alt="Preview" className="mt-2 rounded-lg border max-h-48 object-contain w-full" />
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Observações</label>
              <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Anotações adicionais..." rows={3} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : editingId ? 'Salvar' : 'Cadastrar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteAsset} onOpenChange={() => setDeleteAsset(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir patrimônio?</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja excluir o patrimônio "{deleteAsset?.machine_name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
              {deleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Image Viewer */}
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

export default AdminAssets;
