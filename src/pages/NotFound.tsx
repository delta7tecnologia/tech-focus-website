import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, MessageCircle, HelpCircle, ArrowLeft, Search } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const quickLinks = [
    { label: "Soluções de TI", href: "/solucoes" },
    { label: "Portfólio", href: "/portfolio" },
    { label: "Depoimentos", href: "/depoimentos" },
    { label: "Links Úteis", href: "/links-uteis" },
    { label: "Backup em Nuvem", href: "/backup-nuvem" },
    { label: "Ponto Eletrônico", href: "/ponto-eletronico" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Página não encontrada (404) | Delta7 Tecnologia"
        description="A página que você procura não existe ou foi movida. Use as opções abaixo para continuar navegando no site da Delta7 Tecnologia."
        noindex
      />
      <Navigation />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-3xl w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary mb-6">
            <Search className="w-10 h-10" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
            Erro 404
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            Página não encontrada
          </h1>
          <p className="text-lg text-muted-foreground mb-2 max-w-xl mx-auto">
            A página que você tentou acessar não existe, foi movida ou está temporariamente indisponível.
          </p>
          <p className="text-sm text-muted-foreground/80 mb-10 font-mono break-all">
            {location.pathname}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Button asChild size="lg">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Voltar ao Início
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/faq">
                <HelpCircle className="w-4 h-4 mr-2" />
                Ver FAQ
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/#contact">
                <MessageCircle className="w-4 h-4 mr-2" />
                Falar com a Delta7
              </Link>
            </Button>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-sm font-semibold text-foreground mb-4">
              Talvez você esteja procurando por:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-4 py-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground text-sm text-muted-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 mt-8 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar à página anterior
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
