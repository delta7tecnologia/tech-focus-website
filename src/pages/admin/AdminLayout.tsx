import React, { useEffect, useState } from 'react';
import logoDark from '@/assets/logo.png';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Star,
  Package,
  Settings,
  Link as LinkIcon,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Building2,
  Users,
  Monitor,
  FileSignature,
  ClipboardList,
  HardDriveUpload,
  LifeBuoy,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type MenuItem = { name: string; icon: any; path: string };
type MenuSection = { label: string; items: MenuItem[] };

const sections: MenuSection[] = [
  {
    label: 'Geral',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
      { name: 'Avaliações', icon: Star, path: '/admin/avaliacoes' },
      { name: 'FAQ', icon: HelpCircle, path: '/admin/faq' },
    ],
  },
  {
    label: 'Conteúdo',
    items: [
      { name: 'Serviços', icon: Settings, path: '/admin/servicos' },
      { name: 'Clientes', icon: Building2, path: '/admin/clientes' },
      { name: 'Links Úteis', icon: LinkIcon, path: '/admin/links' },
    ],
  },
  {
    label: 'Operação',
    items: [
      { name: 'Técnicos', icon: Users, path: '/admin/tecnicos' },
      { name: 'Patrimônios', icon: Monitor, path: '/admin/patrimonios' },
      { name: 'Arquivos Técnicos', icon: Package, path: '/admin/arquivos' },
      { name: 'Laudos', icon: FileSignature, path: '/admin/laudos' },
      { name: 'Ordens de Serviço', icon: ClipboardList, path: '/admin/ordens-servico' },
    ],
  },
  {
    label: 'Comercial',
    items: [
      { name: 'Propostas Backup', icon: HardDriveUpload, path: '/admin/propostas' },
      { name: 'Propostas Suporte TI', icon: LifeBuoy, path: '/admin/propostas-suporte' },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { name: 'Configurações', icon: Settings, path: '/admin/configuracoes' },
    ],
  },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false); // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
        return;
      }
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .single();
      if (!roles) {
        await supabase.auth.signOut();
        navigate('/admin/login');
        return;
      }
      setUser(session.user);
      setLoading(false);
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate('/admin/login');
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Logout realizado', description: 'Você foi desconectado com sucesso.' });
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const sidebarWidth = collapsed ? 'lg:w-16' : 'lg:w-64';
  const mainOffset = collapsed ? 'lg:ml-16' : 'lg:ml-64';

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-40 flex flex-col
          transition-transform duration-300 ease-in-out
          w-72 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 ${sidebarWidth} lg:transition-[width]
        `}
      >
        {/* Logo */}
        <div className="h-16 px-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          {(!collapsed || mobileOpen) && <img src={logoDark} alt="Delta7" className="h-7" />}
          <button
            onClick={() => {
              if (window.innerWidth < 1024) setMobileOpen(false);
              else setCollapsed(!collapsed);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
            aria-label="Toggle sidebar"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5 hidden lg:block" />}
            {!mobileOpen && !collapsed && <span className="lg:hidden"><X className="w-5 h-5" /></span>}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          {sections.map((section) => (
            <div key={section.label}>
              {(!collapsed || mobileOpen) && (
                <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      title={collapsed && !mobileOpen ? item.name : undefined}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        active
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                      {(!collapsed || mobileOpen) && <span className="font-medium truncate">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 space-y-1 flex-shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title={collapsed && !mobileOpen ? 'Ver Site' : undefined}
          >
            <ExternalLink className="w-[18px] h-[18px]" />
            {(!collapsed || mobileOpen) && <span>Ver Site</span>}
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title={collapsed && !mobileOpen ? 'Sair' : undefined}
          >
            <LogOut className="w-[18px] h-[18px]" />
            {(!collapsed || mobileOpen) && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${mainOffset}`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg text-gray-600"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
              Painel Administrativo
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span className="text-sm text-gray-500 truncate max-w-[200px]">{user?.email}</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

