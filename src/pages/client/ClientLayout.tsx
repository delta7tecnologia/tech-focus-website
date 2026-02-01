import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  User, 
  LogOut, 
  ShoppingBag,
  Home,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const ClientLayout = () => {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/cliente/login" replace />;
  }

  const navItems = [
    { path: '/cliente', label: 'Minha Conta', icon: User },
    { path: '/cliente/pedidos', label: 'Meus Pedidos', icon: Package },
  ];

  const isActive = (path: string) => {
    if (path === '/cliente') {
      return location.pathname === '/cliente';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo-branco.png" alt="Logo" className="h-8" />
            </Link>
            <span className="hidden md:block text-muted-foreground">|</span>
            <span className="hidden md:block text-sm font-medium text-muted-foreground">
              Área do Cliente
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <Link to="/loja">
              <Button variant="ghost" size="sm" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Loja
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Site
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-border p-4 space-y-2 bg-card">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="w-full justify-start gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <Link to="/loja" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <ShoppingBag className="h-4 w-4" />
                Loja
              </Button>
            </Link>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Home className="h-4 w-4" />
                Site
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={signOut}
              className="w-full justify-start gap-2 text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ClientLayout;
