import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UsefulLink {
  id: string;
  title: string;
  url: string;
  description: string | null;
  icon: string | null;
  category: string | null;
  is_active: boolean;
  order_index: number;
}

const AdminLinks = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UsefulLink | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    icon: 'link',
    category: 'Geral',
    is_active: true,
    order_index: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: links, isLoading } = useQuery({
    queryKey: ['admin-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('useful_links')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data as UsefulLink[];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (data.id) {
        const { error } = await supabase.from('useful_links').update(data).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('useful_links').insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-links'] });
      queryClient.invalidateQueries({ queryKey: ['admin-links-count'] });
      toast({ title: editingItem ? 'Link atualizado!' : 'Link criado!' });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('useful_links').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-links'] });
      queryClient.invalidateQueries({ queryKey: ['admin-links-count'] });
      toast({ title: 'Link removido!' });
    }
  });

  const resetForm = () => {
    setFormData({ title: '', url: '', description: '', icon: 'link', category: 'Geral', is_active: true, order_index: 0 });
    setEditingItem(null);
    setIsOpen(false);
  };

  const handleEdit = (item: UsefulLink) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      url: item.url,
      description: item.description || '',
      icon: item.icon || 'link',
      category: item.category || 'Geral',
      is_active: item.is_active,
      order_index: item.order_index
    });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(editingItem ? { ...formData, id: editingItem.id } : formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Links Úteis</h2>
          <p className="text-gray-500">Gerencie os links do portal de acesso rápido</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar' : 'Novo'} Link</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Título *</Label>
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div>
                <Label>URL *</Label>
                <Input value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} placeholder="https://..." required />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Categoria</Label>
                  <Input value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="Geral" />
                </div>
                <div>
                  <Label>Ícone</Label>
                  <Input value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} placeholder="link, headset, file, monitor, cloud" />
                </div>
              </div>
              <div>
                <Label>Ordem</Label>
                <Input type="number" value={formData.order_index} onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value) || 0})} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.is_active} onCheckedChange={(checked) => setFormData({...formData, is_active: checked})} />
                <Label>Ativo (visível no site)</Label>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : links?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <LinkIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum link cadastrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {links?.map((item) => (
            <Card key={item.id} className={!item.is_active ? 'opacity-60' : ''}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <LinkIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{item.title}</span>
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">{item.category}</span>
                        {!item.is_active && <span className="text-xs bg-gray-200 px-2 py-1 rounded">Inativo</span>}
                      </div>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                        {item.url} <ExternalLink className="w-3 h-3" />
                      </a>
                      {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteMutation.mutate(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLinks;
