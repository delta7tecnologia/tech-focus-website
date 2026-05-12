import React, { useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, Monitor, Eye, Copy, Plus, Pencil, Upload, Printer, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { printAssetReport } from '@/utils/printAssetReport';
import ReportClientInfoDialog, { type ReportClientInfo } from './assets/ReportClientInfoDialog';
import LicenseSelectionDialog from './assets/LicenseSelectionDialog';
import UploadOrLinkInput, { type SourceMode } from './UploadOrLinkInput';
import LicenseListEditor from './assets/LicenseListEditor';
import { fetchAssetLicenses, licensesToDrafts, syncAssetLicenses } from '@/lib/assetLicenses';
import { formatLicenseTitle, getCategoryLabel, type LicenseDraft, type AssetLicense } from '@/lib/licenseCatalog';
import { Badge } from '@/components/ui/badge';

const emptyForm = {
  machine_name: '',
  company_name: '',
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
  const [licenses, setLicenses] = useState<LicenseDraft[]>([]);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotMode, setScreenshotMode] = useState<SourceMode>('upload');
  const [externalScreenshotUrl, setExternalScreenshotUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [reportInfoOpen, setReportInfoOpen] = useState(false);
  const [licenseSelectOpen, setLicenseSelectOpen] = useState(false);
  const [selectedLicenseIds, setSelectedLicenseIds] = useState<string[] | null>(null);

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

  const { data: licensesByAsset = {} } = useQuery({
    queryKey: ['tech-asset-licenses', assets.map((a: any) => a.id).join(',')],
    queryFn: () => fetchAssetLicenses(assets.map((a: any) => a.id)),
    enabled: assets.length > 0,
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
    setLicenses([]);
    setScreenshotFile(null);
    setScreenshotPreview(null);
    setScreenshotMode('upload');
    setExternalScreenshotUrl('');
    setDialogOpen(true);
  };

  const openEdit = async (asset: any) => {
    setEditingId(asset.id);
    setForm({
      machine_name: asset.machine_name,
      company_name: asset.company_name,
      notes: asset.notes || '',
    });
    setLicenses(licensesToDrafts(licensesByAsset[asset.id] || []));
    setScreenshotFile(null);
    setScreenshotFile(null);
    if (asset.is_external_screenshot && asset.screenshot_url) {
      setScreenshotMode('external');
      setExternalScreenshotUrl(asset.screenshot_url);
      setScreenshotPreview(null);
    } else {
      setScreenshotMode('upload');
      setExternalScreenshotUrl('');
      const preview = asset.screenshot_url ? await getSignedUrl(asset.screenshot_url) : null;
      setScreenshotPreview(preview);
    }
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

  const handleViewImage = async (asset: any) => {
    if (asset.is_external_screenshot) {
      window.open(asset.screenshot_url, '_blank', 'noopener,noreferrer');
      return;
    }
    const url = await getSignedUrl(asset.screenshot_url);
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
      const existing = editingId ? assets.find(a => a.id === editingId) : null;
      let screenshot_url: string | null = existing?.screenshot_url || null;
      let is_external_screenshot = existing?.is_external_screenshot || false;

      if (screenshotMode === 'external') {
        const url = externalScreenshotUrl.trim();
        if (url) {
          if (!/^https?:\/\//i.test(url)) {
            throw new Error('A URL da evidência deve começar com http:// ou https://');
          }
          screenshot_url = url;
          is_external_screenshot = true;
        }
      } else if (screenshotFile) {
        screenshot_url = await uploadScreenshot(screenshotFile);
        is_external_screenshot = false;
      }

      const payload = {
        machine_name: form.machine_name.trim(),
        company_name: form.company_name.trim(),
        notes: form.notes.trim() || null,
        screenshot_url,
        is_external_screenshot,
      };

      let assetId = editingId;
      if (editingId) {
        const { error } = await supabase.from('assets').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { data: inserted, error } = await supabase
          .from('assets')
          .insert({ ...payload, created_by: user!.id })
          .select('id')
          .single();
        if (error) throw error;
        assetId = inserted.id;
      }

      await syncAssetLicenses(assetId!, licenses, user!.id);
      toast({ title: editingId ? 'Patrimônio atualizado!' : 'Patrimônio cadastrado!' });

      queryClient.invalidateQueries({ queryKey: ['tech-assets'] });
      queryClient.invalidateQueries({ queryKey: ['tech-asset-licenses'] });
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
          onClick={() => setLicenseSelectOpen(true)}
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
                      <Button size="icon" variant="ghost" onClick={() => handleViewImage(asset)} title={asset.is_external_screenshot ? 'Abrir link externo' : 'Ver evidência'}>
                        {asset.is_external_screenshot ? <ExternalLink className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                </div>

                {(() => {
                  const list = licensesByAsset[asset.id] || [];
                  if (list.length === 0) {
                    return <p className="text-xs text-gray-400 italic">Nenhuma licença cadastrada.</p>;
                  }
                  return (
                    <div className="space-y-2">
                      {list.map((lic) => {
                        const key = `lic-${lic.id}`;
                        const isVisible = visibleLicenses[key];
                        return (
                          <div key={lic.id} className="border-l-2 border-blue-200 pl-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {getCategoryLabel(lic.category)}
                              </Badge>
                              <span className="text-xs font-medium text-gray-800">
                                {formatLicenseTitle(lic)}
                              </span>
                              {lic.activation_date && (
                                <span className="text-[10px] text-gray-400">
                                  · ativ. {formatDate(lic.activation_date)}
                                </span>
                              )}
                            </div>
                            {lic.license_key && (
                              <div className="flex items-center gap-1 mt-1">
                                <button
                                  onClick={() => toggleLicense(key)}
                                  className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded hover:bg-gray-200 transition-colors break-all text-left"
                                >
                                  {isVisible ? lic.license_key : '••••••••••••••'}
                                </button>
                                {isVisible && (
                                  <button onClick={() => copyToClipboard(lic.license_key!)} className="text-gray-400 hover:text-gray-600">
                                    <Copy className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            )}
                            {lic.notes && (
                              <p className="text-[10px] text-gray-500 mt-0.5">{lic.notes}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

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
            <LicenseListEditor value={licenses} onChange={setLicenses} />
            <div>
              <label className="text-sm font-medium">Evidência (Print Screen)</label>
              <div className="mt-1">
                <UploadOrLinkInput
                  mode={screenshotMode}
                  onModeChange={(m) => {
                    setScreenshotMode(m);
                    if (m === 'external') { setScreenshotFile(null); setScreenshotPreview(null); }
                  }}
                  externalUrl={externalScreenshotUrl}
                  onExternalUrlChange={setExternalScreenshotUrl}
                  onFileChange={(f) => {
                    setScreenshotFile(f);
                    setScreenshotPreview(f ? URL.createObjectURL(f) : null);
                  }}
                  selectedFileName={screenshotFile?.name}
                  fileLabel="Selecionar imagem"
                  accept="image/*"
                  preview={screenshotPreview}
                  helpText="Cole o link compartilhável (OneDrive, Google Drive...) para evitar uso do armazenamento interno."
                />
              </div>
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

      <LicenseSelectionDialog
        open={licenseSelectOpen}
        onOpenChange={setLicenseSelectOpen}
        assets={filtered}
        licensesByAsset={licensesByAsset}
        onConfirm={(ids) => {
          setSelectedLicenseIds(ids);
          setLicenseSelectOpen(false);
          setReportInfoOpen(true);
        }}
      />

      <ReportClientInfoDialog
        open={reportInfoOpen}
        onOpenChange={setReportInfoOpen}
        defaultCompany={companyFilter || undefined}
        onConfirm={(info) => {
          printAssetReport(
            filtered,
            info.company_name || companyFilter || 'Todas as empresas',
            info,
            selectedLicenseIds,
          );
        }}
      />
    </div>
  );
};

export default TechAssetViewer;
