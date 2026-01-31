import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
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

const Index = () => {
  return (
    <div className="min-h-screen">
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
  );
};

export default Index;
