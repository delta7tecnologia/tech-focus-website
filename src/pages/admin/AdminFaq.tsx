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
import { Plus, Pencil, Trash2, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  is_active: boolean;
  order_index: number;
}

const AdminFaq = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Faq | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'Geral',
    is_active: true,
    order_index: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: faqs, isLoading } = useQuery({
    queryKey: ['admin-faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data as Faq[];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (data.id) {
        const { error } = await supabase.from('faqs').update(data).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('faqs').insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-faqs-count'] });
      toast({ title: editingItem ? 'FAQ atualizada!' : 'FAQ criada!' });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] });
      queryClient.invalidateQueries({ queryKey: ['admin-faqs-count'] });
      toast({ title: 'FAQ removida!' });
    }
  });

  const resetForm = () => {
    setFormData({ question: '', answer: '', category: 'Geral', is_active: true, order_index: 0 });
    setEditingItem(null);
    setIsOpen(false);
  };

  const handleEdit = (item: Faq) => {
    setEditingItem(item);
    setFormData({
      question: item.question,
      answer: item.answer,
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
          <h2 className="text-2xl font-bold text-gray-900">Perguntas Frequentes (FAQ)</h2>
          <p className="text-gray-500">Gerencie as perguntas e respostas do site</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Nova FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar' : 'Nova'} FAQ</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Pergunta *</Label>
                <Textarea value={formData.question} onChange={(e) => setFormData({...formData, question: e.target.value})} rows={2} required />
              </div>
              <div>
                <Label>Resposta *</Label>
                <Textarea value={formData.answer} onChange={(e) => setFormData({...formData, answer: e.target.value})} rows={4} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Categoria</Label>
                  <Input value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} placeholder="Geral" />
                </div>
                <div>
                  <Label>Ordem</Label>
                  <Input type="number" value={formData.order_index} onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value) || 0})} />
                </div>
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
      ) : faqs?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma FAQ cadastrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {faqs?.map((item) => (
            <Card key={item.id} className={!item.is_active ? 'opacity-60' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <HelpCircle className="w-5 h-5 text-orange-500" />
                      <span className="font-semibold">{item.question}</span>
                      {!item.is_active && <span className="text-xs bg-gray-200 px-2 py-1 rounded">Inativo</span>}
                    </div>
                    <p className="text-gray-600 pl-7 line-clamp-2">{item.answer}</p>
                    <span className="inline-block text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded mt-2 ml-7">
                      {item.category}
                    </span>
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

export default AdminFaq;
