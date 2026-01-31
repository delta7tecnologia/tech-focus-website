import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Instagram, 
  Linkedin,
  ArrowUp
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const services = [
    { name: "Suporte de TI", href: "/#services" },
    { name: "Servidores e Virtualização", href: "/#services" },
    { name: "Firewall e Segurança", href: "/#services" },
    { name: "Backup em Nuvem", href: "/#services" },
    { name: "Monitoramento 24/7", href: "/#services" },
    { name: "Consultoria de TI", href: "/#services" },
  ];

  const quickLinks = [
    { name: "Soluções", href: "/solucoes" },
    { name: "Quem Somos", href: "/#about" },
    { name: "Links Úteis", href: "/links-uteis" },
    { name: "Contato", href: "/#contact" },
  ];

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <img 
              src="/logo-branco.png" 
              alt="Delta7 Tecnologia" 
              className="h-10 w-auto"
            />
            <p className="text-gray-400 leading-relaxed">
              Especialistas em soluções de TI para empresas. 
              Mais de 10 anos transformando tecnologia em vantagem competitiva.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/delta7tecnologia" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/delta7tecnologia" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/delta7tecnologia" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6">Serviços</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <a 
                    href={service.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('/') && !link.href.includes('#') ? (
                    <Link 
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <a href="tel:+5591982370332" className="text-white hover:text-blue-400 transition-colors">
                    (91) 98237-0332
                  </a>
                  <p className="text-sm text-gray-500">WhatsApp disponível</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 mt-0.5" />
                <a href="mailto:contato@delta7tecnologia.com.br" className="text-gray-400 hover:text-white transition-colors text-sm">
                  contato@delta7tecnologia.com.br
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-gray-400">Parauapebas, Pará - Brasil</p>
                  <p className="text-sm text-gray-500">Atendimento remoto nacional</p>
                </div>
              </li>
            </ul>

            {/* Portal Link */}
            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm text-gray-400 mb-2">Já é cliente?</p>
              <a 
                href="https://www.app.delta7tecnologia.com.br/front/login.php"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Acessar Portal de Chamados →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Delta7 Tecnologia. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="/politica-privacidade" className="hover:text-white transition-colors">
                Política de Privacidade
              </a>
              <a href="/termos-uso" className="hover:text-white transition-colors">
                Termos de Uso
              </a>
              <button 
                onClick={scrollToTop}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label="Voltar ao topo"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
