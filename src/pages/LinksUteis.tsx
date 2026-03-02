import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import UsefulLinksSection from '@/components/UsefulLinksSection';
import WhatsAppButton from '@/components/WhatsAppButton';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import SEOHead from '@/components/SEOHead';
import Breadcrumbs from '@/components/Breadcrumbs';

const LinksUteis = () => {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <SEOHead
          title="Links Úteis e Ferramentas de Suporte | Delta7 Tecnologia"
          description="Acesse rapidamente os sistemas e ferramentas de suporte da Delta7 Tecnologia. Portal de chamados, acesso remoto e mais."
        />
        <Navigation />
        
        <section className="pt-24 pb-12 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl font-bold mb-4">Portal de Links Úteis</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Acesse rapidamente nossos sistemas e ferramentas de suporte.
              </p>
            </motion.div>
          </div>
        </section>

        <Breadcrumbs items={[{ label: 'Links Úteis' }]} />

        <UsefulLinksSection />
        
        <Footer />
        <WhatsAppButton />
      </div>
    </PageTransition>
  );
};

export default LinksUteis;
