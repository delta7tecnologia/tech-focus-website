import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Testimonial {
  id: string;
  client_name: string;
  company: string | null;
  position: string | null;
  content: string;
  rating: number;
  avatar_url: string | null;
  is_active: boolean;
}

const AdminTestimonials = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    client_name: '',
    company: '',
    position: '',
    content: '',
    rating: 5,
    avatar_url: '',
    is_active: true
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Testimonial[];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData & { id?: string }) => {
      if (data.id) {
        const { error } = await supabase.from('testimonials').update(data).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('testimonials').insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials-count'] });
      toast({ title: editingItem ? 'Avaliação atualizada!' : 'Avaliação criada!' });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials-count'] });
      toast({ title: 'Avaliação removida!' });
    }
  });

  const resetForm = () => {
    setFormData({ client_name: '', company: '', position: '', content: '', rating: 5, avatar_url: '', is_active: true });
    setEditingItem(null);
    setIsOpen(false);
  };

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      client_name: item.client_name,
      company: item.company || '',
      position: item.position || '',
      content: item.content,
      rating: item.rating,
      avatar_url: item.avatar_url || '',
      is_active: item.is_active
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
          <h2 className="text-2xl font-bold text-gray-900">Avaliações</h2>
          <p className="text-gray-500">Gerencie os depoimentos de clientes</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Avaliação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar' : 'Nova'} Avaliação</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome do Cliente *</Label>
                  <Input value={formData.client_name} onChange={(e) => setFormData({...formData, client_name: e.target.value})} required />
                </div>
                <div>
                  <Label>Empresa</Label>
                  <Input value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cargo</Label>
                  <Input value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} />
                </div>
                <div>
                  <Label>Nota (1-5)</Label>
                  <Input type="number" min={1} max={5} value={formData.rating} onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})} />
                </div>
              </div>
              <div>
                <Label>Depoimento *</Label>
                <Textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} rows={4} required />
              </div>
              <div>
                <Label>URL do Avatar</Label>
                <Input value={formData.avatar_url} onChange={(e) => setFormData({...formData, avatar_url: e.target.value})} placeholder="https://..." />
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
      ) : testimonials?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma avaliação cadastrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {testimonials?.map((item) => (
            <Card key={item.id} className={!item.is_active ? 'opacity-60' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{item.client_name}</span>
                      {item.company && <span className="text-gray-500">• {item.company}</span>}
                      {!item.is_active && <span className="text-xs bg-gray-200 px-2 py-1 rounded">Inativo</span>}
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-gray-600 line-clamp-2">{item.content}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
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

export default AdminTestimonials;
