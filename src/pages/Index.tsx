
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Monitor, Cloud, Server, Phone, Mail, MapPin, Clock } from 'lucide-react';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Technologies from '@/components/Technologies';
import Contact from '@/components/Contact';
import Navigation from '@/components/Navigation';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      <Hero />
      <Services />
      <About />
      <Technologies />
      <Contact />
    </div>
  );
};

export default Index;
