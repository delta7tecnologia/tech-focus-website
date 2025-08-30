
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Scale, Monitor, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h1 className="text-6xl lg:text-7xl font-bold mb-6 flex flex-col items-center space-y-4">
            <img 
              src="public\logo.png" 
              alt="Delta7 Pet Shop" 
              className="h-20 lg:h-24 object-contain"
            />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Delta7 Pet Shop
            </span>
          </h1>
          <p className="text-2xl text-foreground mb-4 font-medium">
            Cuidado completo para o seu melhor amigo
          </p>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            Oferecemos banho, tosa, veterinário, produtos e muito carinho para seu pet
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card Serviços Pet */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden bg-card">
            <CardHeader className="text-center pb-6 pt-12">
              <div className="flex items-center justify-center mb-8">
                <div className="p-6 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                  <Scale className="h-16 w-16 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-card-foreground mb-4">
                Serviços para seu Pet
              </CardTitle>
              <CardDescription className="text-muted-foreground text-lg px-4">
                Banho, tosa e cuidados especiais com muito amor
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-card-foreground">
                  <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Produtos de qualidade premium</span>
                </div>
                <div className="flex items-center space-x-3 text-card-foreground">
                  <Monitor className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Profissionais especializados</span>
                </div>
                <div className="flex items-center space-x-3 text-card-foreground">
                  <Users className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Atendimento personalizado</span>
                </div>
              </div>
              <Link to="/juridico">
                <Button className="w-full bg-primary hover:bg-primary/90 text-lg py-6 group">
                  Ver Nossos Serviços
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card Produtos Pet */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden bg-card">
            <CardHeader className="text-center pb-6 pt-12">
              <div className="flex items-center justify-center mb-8">
                <div className="p-6 bg-accent/10 rounded-full group-hover:scale-110 transition-transform">
                  <Monitor className="h-16 w-16 text-accent" />
                </div>
              </div>
              <CardTitle className="text-2xl text-card-foreground mb-4">
                Produtos Pet Shop
              </CardTitle>
              <CardDescription className="text-muted-foreground text-lg px-4">
                Ração, brinquedos e acessórios das melhores marcas
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 text-card-foreground">
                  <Shield className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>Marcas premium e confiáveis</span>
                </div>
                <div className="flex items-center space-x-3 text-card-foreground">
                  <Monitor className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>Entrega rápida e segura</span>
                </div>
                <div className="flex items-center space-x-3 text-card-foreground">
                  <Users className="h-5 w-5 text-accent flex-shrink-0" />
                  <span>Consultoria especializada</span>
                </div>
              </div>
              <Link to="/solucoes">
                <Button className="w-full bg-accent hover:bg-accent/90 text-lg py-6 group">
                  Ver Nossos Produtos
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
