
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Headset, ExternalLink, Link2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {/* Logo space */}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Link2 className="w-4 h-4 mr-2" />
                  Links Úteis
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white">
                <DropdownMenuItem asChild>
                  <a 
                    href="https://anydesk.com/pt/downloads/windows" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>AnyDesk</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a 
                    href="https://rustdesk.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>RustDesk</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a 
                    href="https://www.win-rar.com/download.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>WinRAR</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a 
                    href="https://www.7-zip.org/download.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>7-Zip</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" asChild>
              <a href="https://www.app.delta7tecnologia.com.br/front/login.php">
                <Headset className="w-4 h-4 mr-2" />
                Portal de Chamados
              </a>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Phone className="w-4 h-4 mr-2" />
              Contato
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3 bg-white border-t">
              <p className="px-3 py-2 text-sm font-semibold text-gray-500">Links Úteis</p>
              <a
                href="https://anydesk.com/pt/downloads/windows"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center justify-between"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>AnyDesk</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://rustdesk.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center justify-between"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>RustDesk</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://www.win-rar.com/download.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center justify-between"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>WinRAR</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://www.7-zip.org/download.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center justify-between"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>7-Zip</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              
              <div className="border-t pt-2 mt-2">
                <a
                  href="https://www.app.delta7tecnologia.com.br/front/login.php"
                  className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Portal de Chamados
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contato
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
