import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PageTransition from '@/components/PageTransition';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useAuth } from '@/contexts/AuthContext';
import TechLogin from '@/components/tech/TechLogin';
import TechFileManager from '@/components/tech/TechFileManager';
import TechPendingApproval from '@/components/tech/TechPendingApproval';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AreaTecnica = () => {
  const { user, loading: authLoading } = useAuth();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['tech-profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: isAdmin } = useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async () => {
      const { data } = await supabase.rpc('has_role', { _user_id: user!.id, _role: 'admin' });
      return data as boolean;
    },
    enabled: !!user,
  });

  const isApproved = profile?.is_approved || isAdmin;
  const isLoading = authLoading || (user && profileLoading);

  return (
    <PageTransition>
      <div className="min-h-screen">
        <SEOHead
          title="Área Técnica | Delta7 Tecnologia"
          description="Área restrita para técnicos da Delta7 Tecnologia. Acesse documentos, manuais e ferramentas internas."
        />
        <Navigation />

        <section className="pt-24 pb-12 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold mb-4">Área Técnica</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Acesso restrito para técnicos autorizados.
              </p>
            </div>
          </div>
        </section>

        <Breadcrumbs items={[{ label: 'Área Técnica' }]} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : !user ? (
            <TechLogin />
          ) : !isApproved ? (
            <TechPendingApproval />
          ) : (
            <TechFileManager />
          )}
        </div>

        <Footer />
        <WhatsAppButton />
      </div>
    </PageTransition>
  );
};

export default AreaTecnica;
