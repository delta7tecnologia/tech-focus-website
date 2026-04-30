import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Building2 } from 'lucide-react';
import { validateDocument, formatDocument } from '@/lib/validators/document';

interface Client {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  is_active: boolean;
  order_index: number;
  document: string | null;
  contact_person: string | null;
  address: string | null;
}

const AdminClients = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    website_url: '',
    is_active: true,
    order_index: 0,
    document: '',
    contact_person: '',
    address: '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clients, isLoading } = useQuery({
    queryKey: ['admin-clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data as Client[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Client, 'id'>) => {
      const { error } = await supabase.from('clients').insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
      toast({ title: 'Cliente adicionado com sucesso!' });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao adicionar cliente', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: Client) => {
      const { error } = await supabase.from('clients').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
      toast({ title: 'Cliente atualizado com sucesso!' });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao atualizar cliente', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] });
      toast({ title: 'Cliente removido com sucesso!' });
    },
    onError: (error: any) => {
      toast({ title: 'Erro ao remover cliente', description: error.message, variant: 'destructive' });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '', logo_url: '', website_url: '', is_active: true, order_index: 0,
      document: '', contact_person: '', address: '',
    });
    setEditingClient(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      logo_url: client.logo_url || '',
      website_url: client.website_url || '',
      is_active: client.is_active,
      order_index: client.order_index,
      document: client.document || '',
      contact_person: client.contact_person || '',
      address: client.address || '',
    });
    setIsDialogOpen(true);
  };

  const docValidation = validateDocument(formData.document);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docValidation.empty && !docValidation.valid) {
      toast({
        title: 'Documento inválido',
        description: docValidation.message || 'Verifique o CNPJ/CPF informado.',
        variant: 'destructive',
      });
      return;
    }
    const data = {
      ...formData,
      logo_url: formData.logo_url || null,
      website_url: formData.website_url || null,
      document: docValidation.empty ? null : formatDocument(formData.document),
      contact_person: formData.contact_person || null,
      address: formData.address || null,
    };

    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id, ...data } as Client);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
          <p className="text-gray-500">Gerencie os clientes exibidos no site</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Empresa *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="logo_url">URL do Logo</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://exemplo.com/logo.png"
                />
              </div>
              <div>
                <Label htmlFor="website_url">Website</Label>
                <Input
                  id="website_url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://exemplo.com"
                />
              </div>

              <div className="border-t pt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Dados para relatórios técnicos
                </p>
              </div>
              <div>
                <Label htmlFor="document">CNPJ / CPF</Label>
                <Input
                  id="document"
                  value={formData.document}
                  onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                  onBlur={() => {
                    const v = validateDocument(formData.document);
                    if (v.valid && !v.empty) setFormData({ ...formData, document: formatDocument(formData.document) });
                  }}
                  placeholder="00.000.000/0001-00"
                  className={!docValidation.empty && !docValidation.valid ? 'border-destructive focus-visible:ring-destructive' : ''}
                />
                {!docValidation.empty && !docValidation.valid && (
                  <p className="text-xs text-destructive mt-1">{docValidation.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="contact_person">Responsável</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  placeholder="Nome do contato"
                />
              </div>
              <div>
                <Label htmlFor="address">Endereço</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Rua, nº, bairro, cidade/UF"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="order_index">Ordem de Exibição</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Ativo</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  {editingClient ? 'Salvar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Lista de Clientes ({clients?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : clients?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum cliente cadastrado ainda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ordem</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients?.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.order_index}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {client.logo_url ? (
                          <img src={client.logo_url} alt={client.name} className="w-8 h-8 object-contain rounded" />
                        ) : (
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-blue-600" />
                          </div>
                        )}
                        {client.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {client.website_url ? (
                        <a href={client.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {client.website_url}
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${client.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {client.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(client)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => deleteMutation.mutate(client.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminClients;
