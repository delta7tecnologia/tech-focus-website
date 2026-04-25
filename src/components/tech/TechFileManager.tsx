import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, Trash2, FileText, LogOut, Search, Monitor, FileSignature, ExternalLink, Link2 } from 'lucide-react';
import TechAssetViewer from './TechAssetViewer';
import TechReports from './reports/TechReports';
import UploadOrLinkInput, { detectExternalProvider, type SourceMode } from './UploadOrLinkInput';

const TechFileManager = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Geral');
  const [file, setFile] = useState<File | null>(null);
  const [sourceMode, setSourceMode] = useState<SourceMode>('upload');
  const [externalUrl, setExternalUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: files, isLoading } = useQuery({
    queryKey: ['technical-files'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technical_files')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!title.trim()) throw new Error('Preencha o título.');

      if (sourceMode === 'external') {
        const url = externalUrl.trim();
        if (!url) throw new Error('Informe a URL do arquivo externo.');
        if (!/^https?:\/\//i.test(url)) throw new Error('A URL deve começar com http:// ou https://');

        const { error: dbError } = await supabase.from('technical_files').insert({
          title: title.trim(),
          description: description.trim() || null,
          category: category.trim() || 'Geral',
          uploaded_by: user!.id,
          is_external: true,
          external_url: url,
          external_provider: detectExternalProvider(url),
          file_path: null,
          file_name: null,
          file_size: null,
          mime_type: null,
        });
        if (dbError) throw dbError;
        return;
      }

      if (!file) throw new Error('Selecione um arquivo.');
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('technical-files')
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from('technical_files').insert({
        title: title.trim(),
        description: description.trim() || null,
        file_path: filePath,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        category: category.trim() || 'Geral',
        uploaded_by: user!.id,
        is_external: false,
      });
      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technical-files'] });
      toast({ title: 'Arquivo registrado com sucesso!' });
      setIsUploadOpen(false);
      setTitle('');
      setDescription('');
      setCategory('Geral');
      setFile(null);
      setExternalUrl('');
      setSourceMode('upload');
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao registrar', description: error.message, variant: 'destructive' });
    },
  });

  const handleDownload = async (filePath: string, fileName: string) => {
    const { data, error } = await supabase.storage
      .from('technical-files')
      .download(filePath);
    if (error) {
      toast({ title: 'Erro ao baixar arquivo', variant: 'destructive' });
      return;
    }
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteMutation = useMutation({
    mutationFn: async ({ id, filePath }: { id: string; filePath: string }) => {
      await supabase.storage.from('technical-files').remove([filePath]);
      const { error } = await supabase.from('technical_files').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technical-files'] });
      toast({ title: 'Arquivo removido!' });
    },
  });

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filtered = files?.filter(
    (f) =>
      f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Área Técnica</h2>
          <p className="text-gray-500">Olá, {user?.user_metadata?.full_name || user?.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </div>

      <Tabs defaultValue="files" className="w-full">
        <TabsList>
          <TabsTrigger value="files" className="gap-2">
            <FileText className="w-4 h-4" /> Arquivos
          </TabsTrigger>
          <TabsTrigger value="assets" className="gap-2">
            <Monitor className="w-4 h-4" /> Patrimônios
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <FileSignature className="w-4 h-4" /> Laudos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-4 mt-4">
          <div className="flex gap-2">
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="w-4 h-4 mr-2" /> Enviar Arquivo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enviar Arquivo</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => { e.preventDefault(); uploadMutation.mutate(); }} className="space-y-4">
                  <div>
                    <Label>Título *</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                  <div>
                    <Label>Categoria</Label>
                    <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Geral" />
                  </div>
                  <div>
                    <Label>Arquivo *</Label>
                    <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>Cancelar</Button>
                    <Button type="submit" disabled={uploadMutation.isPending}>
                      {uploadMutation.isPending ? 'Enviando...' : 'Enviar'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Buscar arquivos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Carregando...</div>
          ) : !filtered?.length ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum arquivo encontrado</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filtered.map((f) => (
                <Card key={f.id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{f.title}</p>
                          <p className="text-xs text-gray-500 truncate">{f.file_name} · {formatSize(f.file_size)}</p>
                          {f.description && <p className="text-sm text-gray-500 mt-1">{f.description}</p>}
                          <span className="inline-block text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded mt-1">
                            {f.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button size="icon" variant="ghost" onClick={() => handleDownload(f.file_path, f.file_name)}>
                          <Download className="w-4 h-4" />
                        </Button>
                        {f.uploaded_by === user?.id && (
                          <Button size="icon" variant="ghost" className="text-red-600" onClick={() => deleteMutation.mutate({ id: f.id, filePath: f.file_path })}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="assets" className="mt-4">
          <TechAssetViewer />
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <TechReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechFileManager;
