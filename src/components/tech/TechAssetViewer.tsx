import React, { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, Monitor, Eye, Copy, Plus, Pencil, Upload, Printer, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { printAssetReport } from '@/utils/printAssetReport';

const emptyForm = {
  machine_name: '',
  company_name: '',
  windows_activation_date: '',
  office_activation_date: '',
  windows_license: '',
  office_license: '',
  notes: '',
};

const TechAssetViewer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [visibleLicenses, setVisibleLicenses] = useState<Record<string, boolean>>({});

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

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

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setScreenshotFile(null);
    setScreenshotPreview(null);
    setDialogOpen(true);
  };

  const openEdit = async (asset: any) => {
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
    const preview = asset.screenshot_url ? await getSignedUrl(asset.screenshot_url) : null;
    setScreenshotPreview(preview);
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
    const { error } = await supabase.storage.from('asset-screenshots').upload(path, file);
    if (error) throw error;
    // Store the storage path; we'll generate signed URLs on demand
    return path;
  };

  const getSignedUrl = async (pathOrUrl: string): Promise<string | null> => {
    if (!pathOrUrl) return null;
    // Backward compatibility: if it's a full URL (legacy public bucket), extract path
    let path = pathOrUrl;
    const marker = '/asset-screenshots/';
    const idx = pathOrUrl.indexOf(marker);
    if (idx !== -1) {
      path = pathOrUrl.substring(idx + marker.length);
    }
    const { data, error } = await supabase.storage
      .from('asset-screenshots')
      .createSignedUrl(path, 3600);
    if (error) return null;
    return data.signedUrl;
  };

  const handleViewImage = async (pathOrUrl: string) => {
    const url = await getSignedUrl(pathOrUrl);
    if (url) setViewImage(url);
    else toast({ title: 'Erro', description: 'Não foi possível carregar a imagem.', variant: 'destructive' });
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

      queryClient.invalidateQueries({ queryKey: ['tech-assets'] });
      setDialogOpen(false);
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from('assets').delete().eq('id', deleteId);
      if (error) throw error;
      toast({ title: 'Patrimônio excluído!' });
      queryClient.invalidateQueries({ queryKey: ['tech-assets'] });
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    } finally {
      setDeleteId(null);
    }
  };

  const filteredCompanies = companies.filter(c =>
    c.toLowerCase().includes(form.company_name.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
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
        <Button
          variant="outline"
          className="gap-2"
          disabled={filtered.length === 0}
          onClick={() => {
            const company = companyFilter || 'Todas as empresas';
            printAssetReport(filtered, company);
          }}
        >
          <Printer className="w-4 h-4" /> Imprimir
        </Button>
        <Button onClick={openNew} className="gap-2">
          <Plus className="w-4 h-4" /> Novo
        </Button>
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
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(asset)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeleteId(asset.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {asset.screenshot_url && (
                      <Button size="icon" variant="ghost" onClick={() => handleViewImage(asset.screenshot_url)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Windows</p>
                    <p className="text-xs text-gray-400">Ativação: {formatDate(asset.windows_activation_date)}</p>
                    {asset.windows_license ? (
                      <div className="flex items-center gap-1 mt-1">
                        <button
                          onClick={() => toggleLicense(`win-${asset.id}`)}
                          className="text-xs font-mono bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors break-all text-left"
                        >
                          {visibleLicenses[`win-${asset.id}`] ? asset.windows_license : '••••••••••••••'}
                        </button>
                        {visibleLicenses[`win-${asset.id}`] && (
                          <button onClick={() => copyToClipboard(asset.windows_license!)} className="text-gray-400 hover:text-gray-600">
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Sem licença</span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Office</p>
                    <p className="text-xs text-gray-400">Ativação: {formatDate(asset.office_activation_date)}</p>
                    {asset.office_license ? (
                      <div className="flex items-center gap-1 mt-1">
                        <button
                          onClick={() => toggleLicense(`off-${asset.id}`)}
                          className="text-xs font-mono bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors break-all text-left"
                        >
                          {visibleLicenses[`off-${asset.id}`] ? asset.office_license : '••••••••••••••'}
                        </button>
                        {visibleLicenses[`off-${asset.id}`] && (
                          <button onClick={() => copyToClipboard(asset.office_license!)} className="text-gray-400 hover:text-gray-600">
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
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
            <div className="relative">
              <label className="text-sm font-medium">Empresa *</label>
              <Input
                value={form.company_name}
                onChange={e => {
                  setForm(f => ({ ...f, company_name: e.target.value }));
                  setShowCompanyDropdown(true);
                }}
                onFocus={() => setShowCompanyDropdown(true)}
                onBlur={() => setTimeout(() => setShowCompanyDropdown(false), 200)}
                placeholder="Digite ou selecione a empresa"
              />
              {showCompanyDropdown && filteredCompanies.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-40 overflow-y-auto">
                  {filteredCompanies.map(c => (
                    <button
                      key={c}
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                      onMouseDown={() => {
                        setForm(f => ({ ...f, company_name: c }));
                        setShowCompanyDropdown(false);
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
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

      {/* Image Viewer */}
      <Dialog open={!!viewImage} onOpenChange={() => setViewImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Evidência</DialogTitle>
          </DialogHeader>
          {viewImage && <img src={viewImage} alt="Evidência" className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir patrimônio?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O patrimônio será removido permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TechAssetViewer;
