import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import UsefulLinksSection from '@/components/UsefulLinksSection';
import WhatsAppButton from '@/components/WhatsAppButton';
import { motion } from 'framer-motion';

const LinksUteis = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero */}
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

      <UsefulLinksSection />
      
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default LinksUteis;
