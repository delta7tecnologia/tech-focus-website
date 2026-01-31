import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Link as LinkIcon, Headset, FileText, Monitor, Cloud } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const iconMap: Record<string, React.ReactNode> = {
  link: <LinkIcon className="w-5 h-5" />,
  headset: <Headset className="w-5 h-5" />,
  file: <FileText className="w-5 h-5" />,
  monitor: <Monitor className="w-5 h-5" />,
  cloud: <Cloud className="w-5 h-5" />,
};

const defaultLinks = [
  {
    id: '1',
    title: 'Portal de Chamados',
    url: 'https://www.app.delta7tecnologia.com.br/front/login.php',
    description: 'Acesse nosso sistema de suporte técnico',
    icon: 'headset',
    category: 'Suporte'
  },
  {
    id: '2',
    title: 'Acesso Remoto',
    url: 'https://anydesk.com/pt/downloads',
    description: 'Download do software de acesso remoto',
    icon: 'monitor',
    category: 'Ferramentas'
  }
];

const UsefulLinksSection = () => {
  const { data: links } = useQuery({
    queryKey: ['useful-links'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('useful_links')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const displayLinks = links && links.length > 0 ? links : defaultLinks;

  // Group links by category
  const groupedLinks = displayLinks.reduce((acc, link) => {
    const category = link.category || 'Geral';
    if (!acc[category]) acc[category] = [];
    acc[category].push(link);
    return acc;
  }, {} as Record<string, typeof displayLinks>);

  return (
    <section id="links" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Acesso Rápido
          </span>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">
            Links Úteis
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayLinks.map((link, index) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -3 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {iconMap[link.icon || 'link'] || iconMap.link}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {link.title}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  {link.description && (
                    <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                  )}
                  <span className="inline-block text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-2">
                    {link.category}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UsefulLinksSection;
