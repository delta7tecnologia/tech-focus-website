import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import SEOHead from '@/components/SEOHead';

import ClientsSection from '@/components/ClientsSection';
import ServicesSection from '@/components/ServicesSection';

import About from '@/components/About';
import Differentials from '@/components/Differentials';
import Testimonials from '@/components/Testimonials';
import FAQSection from '@/components/FAQSection';
import UsefulLinksSection from '@/components/UsefulLinksSection';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PageTransition from '@/components/PageTransition';

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <SEOHead 
          title="Delta7 Tecnologia em Paragominas-PA | Suporte de TI e Cloud"
          description="Empresa de TI em Paragominas-PA: suporte técnico, monitoramento 24x7, cloud, segurança e backup em nuvem para empresas no Pará e em todo o Brasil."
        />
        <StructuredData />
        <Navigation />
        <HeroSection />
        <ClientsSection />
        <ServicesSection />
        
        <About />
        <Differentials />
        <Testimonials />
        <FAQSection />
        <UsefulLinksSection />
        <Contact />
        <Footer />
        <WhatsAppButton />
      </div>
    </PageTransition>
  );
};

export default Index;
