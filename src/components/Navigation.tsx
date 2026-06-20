import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Menu, X, Phone, Headset, Home, Cloud, Clock, Server, Wrench, BookOpen,
  HelpCircle, Image as ImageIcon, MessageSquare, ShieldCheck, Users, Mail,
  Link2, LayoutGrid
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import logoDark from '@/assets/logo.png';
import logoWhite from '@/assets/logo-branco.png';

type LeafItem = { name: string; href: string; icon?: React.ReactNode; desc?: string; external?: boolean };
type MenuNode = { name: string; href?: string; children?: LeafItem[] };

const menu: MenuNode[] = [
  { name: 'Início', href: '/' },
  {
    name: 'Soluções',
    children: [
      { name: 'Visão Geral', href: '/solucoes', icon: <LayoutGrid className="w-4 h-4" />, desc: 'Todas as soluções Delta7' },
      { name: 'Backup em Nuvem', href: '/backup-nuvem', icon: <Cloud className="w-4 h-4" />, desc: 'Backup gerenciado e disaster recovery' },
      { name: 'Ponto Eletrônico', href: '/ponto-eletronico', icon: <Clock className="w-4 h-4" />, desc: 'Controle de jornada digital' },
      { name: 'Locação de Servidores', href: '/locacao-servidores', icon: <Server className="w-4 h-4" />, desc: 'Servidores Dell sob locação' },
      { name: 'Suporte de TI', href: '/#services', icon: <Wrench className="w-4 h-4" />, desc: 'Suporte gerenciado para empresas' },
      { name: 'Segurança e Firewall', href: '/#services', icon: <ShieldCheck className="w-4 h-4" />, desc: 'Proteção avançada e compliance' },
    ],
  },
  {
    name: 'Recursos',
    children: [
      { name: 'Links Úteis', href: '/links-uteis', icon: <Link2 className="w-4 h-4" />, desc: 'Ferramentas remotas e utilitários' },
      { name: 'FAQ', href: '/faq', icon: <HelpCircle className="w-4 h-4" />, desc: 'Perguntas frequentes' },
      { name: 'Portfólio', href: '/portfolio', icon: <ImageIcon className="w-4 h-4" />, desc: 'Cases e projetos realizados' },
      { name: 'Depoimentos', href: '/depoimentos', icon: <MessageSquare className="w-4 h-4" />, desc: 'O que dizem nossos clientes' },
      { name: 'Ferramentas', href: '/ferramentas', icon: <BookOpen className="w-4 h-4" />, desc: 'Plataformas e tecnologias' },
    ],
  },
  {
    name: 'Empresa',
    children: [
      { name: 'Quem Somos', href: '/#about', icon: <Users className="w-4 h-4" />, desc: 'Conheça a Delta7' },
      { name: 'Vídeo Institucional', href: '/video-institucional', icon: <ImageIcon className="w-4 h-4" />, desc: 'Apresentação institucional' },
      { name: 'Contato', href: '/#contact', icon: <Mail className="w-4 h-4" />, desc: 'Fale conosco' },
    ],
  },
  { name: 'Área Técnica', href: '/area-tecnica' },
];

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const onLight = isScrolled || !isHome;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const linkBase = onLight
    ? 'text-gray-700 hover:text-blue-600'
    : 'text-white/90 hover:text-white';

  const triggerCls = cn(
    'bg-transparent font-medium h-auto px-3 py-2 hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent',
    linkBase
  );

  const renderLeaf = (item: LeafItem) => {
    const isInternal = item.href.startsWith('/') && !item.href.includes('#');
    const content = (
      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors">
        <div className="mt-0.5 w-8 h-8 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
          {item.icon}
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-900">{item.name}</p>
          {item.desc && <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>}
        </div>
      </div>
    );
    return isInternal ? (
      <Link to={item.href} className="block">{content}</Link>
    ) : (
      <a href={item.href} className="block">{content}</a>
    );
  };

  return (
    <nav
      aria-label="Navegação principal"
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        onLight ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src={onLight ? logoDark : logoWhite}
              alt="Delta7 Tecnologia"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                {menu.map((node) => (
                  <NavigationMenuItem key={node.name}>
                    {node.children ? (
                      <>
                        <NavigationMenuTrigger className={triggerCls}>
                          {node.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="w-[420px] p-2 grid grid-cols-1 gap-1">
                            {node.children.map((c) => (
                              <NavigationMenuLink asChild key={c.name}>
                                {renderLeaf(c)}
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : node.href?.startsWith('/') && !node.href.includes('#') ? (
                      <Link
                        to={node.href!}
                        className={cn('font-medium px-3 py-2 inline-block transition-colors', linkBase)}
                      >
                        {node.name}
                      </Link>
                    ) : (
                      <a
                        href={node.href}
                        className={cn('font-medium px-3 py-2 inline-block transition-colors', linkBase)}
                      >
                        {node.name}
                      </a>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Button
              variant={onLight ? 'outline' : 'ghost'}
              size="sm"
              className={!onLight ? 'text-white border-white/30 hover:bg-white/10' : ''}
              asChild
            >
              <a href="https://www.app.delta7tecnologia.com.br/front/login.php" target="_blank" rel="noopener noreferrer">
                <Headset className="w-4 h-4 mr-2" />
                Portal
              </a>
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
              <a href="https://wa.me/5591982370332?text=Olá! Gostaria de falar com um especialista.">
                <Phone className="w-4 h-4 mr-2" />
                Fale Conosco
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={onLight ? 'text-gray-700' : 'text-white'}
              aria-label="Abrir menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t shadow-lg rounded-b-xl">
            <div className="px-4 py-4">
              <Accordion type="multiple" className="w-full">
                {menu.map((node, idx) => {
                  if (!node.children) {
                    const isInternal = node.href!.startsWith('/') && !node.href!.includes('#');
                    return isInternal ? (
                      <Link
                        key={node.name}
                        to={node.href!}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-3 text-gray-800 font-medium border-b border-gray-100"
                      >
                        {node.name}
                      </Link>
                    ) : (
                      <a
                        key={node.name}
                        href={node.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-3 text-gray-800 font-medium border-b border-gray-100"
                      >
                        {node.name}
                      </a>
                    );
                  }
                  return (
                    <AccordionItem key={node.name} value={`item-${idx}`} className="border-gray-100">
                      <AccordionTrigger className="px-3 py-3 text-gray-800 font-medium hover:no-underline">
                        {node.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-3 space-y-1 pb-2">
                          {node.children.map((c) => {
                            const isInternal = c.href.startsWith('/') && !c.href.includes('#');
                            const inner = (
                              <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md">
                                {c.icon}
                                <span>{c.name}</span>
                              </div>
                            );
                            return isInternal ? (
                              <Link key={c.name} to={c.href} onClick={() => setIsMenuOpen(false)} className="block">
                                {inner}
                              </Link>
                            ) : (
                              <a key={c.name} href={c.href} onClick={() => setIsMenuOpen(false)} className="block">
                                {inner}
                              </a>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>

              <div className="border-t pt-4 mt-4 space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <a href="https://www.app.delta7tecnologia.com.br/front/login.php" target="_blank" rel="noopener noreferrer">
                    <Headset className="w-4 h-4 mr-2" />
                    Portal de Chamados
                  </a>
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                  <a href="https://wa.me/5591982370332">
                    <Phone className="w-4 h-4 mr-2" />
                    Fale Conosco
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
