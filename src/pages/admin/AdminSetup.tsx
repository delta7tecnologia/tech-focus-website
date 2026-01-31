import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminSetup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkExistingAdmin();
  }, []);

  const checkExistingAdmin = async () => {
    try {
      // Try to call the setup endpoint to check if admin exists
      const { data, error } = await supabase.functions.invoke('setup-admin', {
        body: { check: true }
      });
      
      // If we get a 403, there's already an admin
      if (error?.message?.includes('403') || error?.message?.includes('Já existe')) {
        setHasAdmin(true);
      }
    } catch (err) {
      // Edge function might not be deployed yet, allow setup
    } finally {
      setChecking(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('setup-admin', {
        body: { email, password }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar administrador.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (hasAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Sistema já configurado</h2>
            <p className="text-gray-500 mb-6">
              Já existe um administrador cadastrado. Faça login para acessar o painel.
            </p>
            <Button onClick={() => navigate('/admin/login')} className="w-full">
              Ir para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Administrador criado!</h2>
            <p className="text-gray-500">
              Redirecionando para a página de login...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Configurar Administrador</CardTitle>
          <CardDescription>
            Crie o primeiro usuário administrador para acessar o painel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetup} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail do Administrador</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@delta7tecnologia.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar Administrador'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-gray-500 hover:text-blue-600">
              ← Voltar ao site
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;
