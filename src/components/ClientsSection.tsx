import React from 'react';
import { motion } from 'framer-motion';

const ClientsSection = () => {
  // Placeholder client logos - representando segmentos atendidos
  const clientSegments = [
    { name: "Escritórios de Advocacia", count: "50+" },
    { name: "Clínicas e Consultórios", count: "35+" },
    { name: "Comércio e Varejo", count: "40+" },
    { name: "Indústrias", count: "25+" },
    { name: "Construtoras", count: "20+" },
    { name: "Contabilidades", count: "30+" },
  ];

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
            Confiança de quem usa
          </p>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            + de 200 empresas confiam na Delta7
          </h2>
        </motion.div>

        {/* Client Segments Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {clientSegments.map((segment, index) => (
            <motion.div
              key={segment.name}
              className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="text-3xl font-bold text-blue-600 mb-1">{segment.count}</div>
              <div className="text-xs text-gray-600">{segment.name}</div>
            </motion.div>
          ))}
        </div>

        {/* Scrolling Logos Effect */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10" />
          
          <motion.div 
            className="flex items-center justify-center gap-12 py-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {/* Tech Badges */}
            <div className="flex items-center gap-8 flex-wrap justify-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xs">MS</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Microsoft Partner</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border">
                <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-xs">PX</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Proxmox Certified</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border">
                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                  <span className="text-red-600 font-bold text-xs">ZB</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Zabbix Partner</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border">
                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xs">PF</span>
                </div>
                <span className="text-sm font-medium text-gray-700">pfSense Expert</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust indicators */}
        <motion.div 
          className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Atendimento em todo Brasil
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Suporte remoto e presencial
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            SLA garantido
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientsSection;
