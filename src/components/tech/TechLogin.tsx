import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Lock, UserPlus, LogIn, ArrowLeft } from 'lucide-react';

const TechLogin = () => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast({
          title: 'E-mail enviado!',
          description: 'Verifique sua caixa de entrada para redefinir sua senha.',
        });
        setMode('login');
      } else if (mode === 'register') {
        if (!fullName.trim()) {
          toast({ title: 'Informe seu nome completo', variant: 'destructive' });
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        toast({
          title: 'Cadastro realizado!',
          description: 'Verifique seu e-mail para confirmar o cadastro. Após confirmar, aguarde a aprovação de um administrador.',
        });
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao processar. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (mode === 'forgot') return 'Redefinir Senha';
    if (mode === 'register') return 'Criar Conta de Técnico';
    return 'Acesso Técnico';
  };

  const getDescription = () => {
    if (mode === 'forgot') return 'Informe seu e-mail para receber o link de redefinição.';
    if (mode === 'register') return 'Cadastre-se para solicitar acesso à área técnica.';
    return 'Faça login para acessar os arquivos e ferramentas.';
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle>{getTitle()}</CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <Label>Nome Completo</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            )}
            <div>
              <Label>E-mail</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            {mode !== 'forgot' && (
              <div>
                <Label>Senha</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => setMode('forgot')}
                >
                  Esqueci minha senha
                </button>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processando...' : mode === 'forgot' ? 'Enviar link de redefinição' : mode === 'register' ? (
                <><UserPlus className="w-4 h-4 mr-2" /> Cadastrar</>
              ) : (
                <><LogIn className="w-4 h-4 mr-2" /> Entrar</>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center space-y-2">
            {mode === 'forgot' ? (
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline flex items-center justify-center gap-1 mx-auto"
                onClick={() => setMode('login')}
              >
                <ArrowLeft className="w-3 h-3" /> Voltar ao login
              </button>
            ) : (
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
              >
                {mode === 'register' ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechLogin;
