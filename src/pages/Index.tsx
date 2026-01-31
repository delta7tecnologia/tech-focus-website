import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import About from '@/components/About';
import Differentials from '@/components/Differentials';
import Testimonials from '@/components/Testimonials';
import Technologies from '@/components/Technologies';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <About />
      <Differentials />
      <Testimonials />
      <Technologies />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
