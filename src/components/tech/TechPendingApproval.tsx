import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const TechPendingApproval = () => {
  const { signOut, user } = useAuth();

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Aguardando Aprovação</h2>
          <p className="text-gray-600 mb-2">
            Olá, <strong>{user?.user_metadata?.full_name || user?.email}</strong>
          </p>
          <p className="text-gray-500 mb-6">
            Seu cadastro está pendente de aprovação por um administrador. 
            Você receberá acesso assim que for aprovado.
          </p>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechPendingApproval;
