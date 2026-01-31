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
import { Plus, Pencil, Trash2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  icon: string | null;
  image_url: string | null;
  is_active: boolean;
  order_index: number;
}

const AdminServices = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    icon: 'settings',
    image_url: '',
    is_active: true,
    order_index: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: services, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data as Service[];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (data.id) {
        const { error } = await supabase.from('services').update(data).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('services').insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['admin-services-count'] });
      toast({ title: editingItem ? 'Serviço atualizado!' : 'Serviço criado!' });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-services'] });
      queryClient.invalidateQueries({ queryKey: ['admin-services-count'] });
      toast({ title: 'Serviço removido!' });
    }
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', short_description: '', icon: 'settings', image_url: '', is_active: true, order_index: 0 });
    setEditingItem(null);
    setIsOpen(false);
  };

  const handleEdit = (item: Service) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      short_description: item.short_description || '',
      icon: item.icon || 'settings',
      image_url: item.image_url || '',
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
          <h2 className="text-2xl font-bold text-gray-900">Serviços</h2>
          <p className="text-gray-500">Gerencie os serviços oferecidos</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar' : 'Novo'} Serviço</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nome *</Label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div>
                <Label>Descrição Curta</Label>
                <Input value={formData.short_description} onChange={(e) => setFormData({...formData, short_description: e.target.value})} />
              </div>
              <div>
                <Label>Descrição Completa</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ícone</Label>
                  <Input value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} placeholder="settings" />
                </div>
                <div>
                  <Label>Ordem</Label>
                  <Input type="number" value={formData.order_index} onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value) || 0})} />
                </div>
              </div>
              <div>
                <Label>URL da Imagem</Label>
                <Input value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." />
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
      ) : services?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum serviço cadastrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {services?.map((item) => (
            <Card key={item.id} className={!item.is_active ? 'opacity-60' : ''}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{item.name}</span>
                        {!item.is_active && <span className="text-xs bg-gray-200 px-2 py-1 rounded">Inativo</span>}
                      </div>
                      {item.short_description && <p className="text-sm text-gray-500">{item.short_description}</p>}
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

export default AdminServices;
