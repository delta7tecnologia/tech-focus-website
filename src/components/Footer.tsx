import React from 'react';
import { Phone, Mail, MapPin, Instagram, Linkedin, Clock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <img 
              src="/logo-branco.png" 
              alt="Delta7 Tecnologia" 
              className="h-12 w-auto"
            />
            <p className="text-gray-400 leading-relaxed">
              Soluções inteligentes em TI para sua empresa crescer com segurança. 
              Especialistas em infraestrutura, monitoramento e suporte.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/delta7tecnologia/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/delta7tecnologia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Serviços</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#services" className="hover:text-white transition-colors">Suporte Técnico</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Servidores e Virtualização</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Firewall e Segurança</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Backup em Nuvem</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Monitoramento 24x7</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Consultoria de TI</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Links Rápidos</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#about" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Serviços</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contato</a></li>
              <li>
                <a 
                  href="https://www.app.delta7tecnologia.com.br/front/login.php" 
                  className="hover:text-white transition-colors"
                >
                  Portal de Chamados
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contato</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <a href="tel:+5591982370332" className="hover:text-white transition-colors">
                    (91) 98237-0332
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <a href="mailto:contato@delta7tecnologia.com.br" className="hover:text-white transition-colors">
                  contato@delta7tecnologia.com.br
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Seg - Sex: 8h às 18h</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Parauapebas - PA</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>© {currentYear} Delta7 Tecnologia. Todos os direitos reservados.</p>
            <p className="mt-2 md:mt-0">
              Desenvolvido com ❤️ por <span className="text-blue-400">Delta7</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
