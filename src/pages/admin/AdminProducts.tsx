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
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  image_url: string | null;
  price: number | null;
  is_active: boolean;
  order_index: number;
}

const AdminProducts = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    image_url: '',
    price: '',
    is_active: true,
    order_index: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data as Product[];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        price: data.price ? parseFloat(data.price) : null
      };
      if (data.id) {
        const { error } = await supabase.from('products').update(payload).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products-count'] });
      toast({ title: editingItem ? 'Produto atualizado!' : 'Produto criado!' });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products-count'] });
      toast({ title: 'Produto removido!' });
    }
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', short_description: '', image_url: '', price: '', is_active: true, order_index: 0 });
    setEditingItem(null);
    setIsOpen(false);
  };

  const handleEdit = (item: Product) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      short_description: item.short_description || '',
      image_url: item.image_url || '',
      price: item.price?.toString() || '',
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
          <h2 className="text-2xl font-bold text-gray-900">Produtos</h2>
          <p className="text-gray-500">Gerencie os produtos do catálogo</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar' : 'Novo'} Produto</DialogTitle>
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
                  <Label>Preço (R$)</Label>
                  <Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="0.00" />
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
      ) : products?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum produto cadastrado</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {products?.map((item) => (
            <Card key={item.id} className={!item.is_active ? 'opacity-60' : ''}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{item.name}</span>
                        {!item.is_active && <span className="text-xs bg-gray-200 px-2 py-1 rounded">Inativo</span>}
                      </div>
                      {item.short_description && <p className="text-sm text-gray-500">{item.short_description}</p>}
                      {item.price && <p className="text-blue-600 font-medium">R$ {item.price.toFixed(2)}</p>}
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

export default AdminProducts;
