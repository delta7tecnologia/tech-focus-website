
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Technologies = () => {
  const technologies = [
    {
      name: "GLPI",
      category: "Gestão de TI",
      description: "Sistema completo para gestão de chamados, inventário e ativos de TI",
      color: "bg-blue-500"
    },
    {
      name: "Zabbix",
      category: "Monitoramento",
      description: "Plataforma de monitoramento de infraestrutura em tempo real",
      color: "bg-red-500"
    },
    {
      name: "Proxmox",
      category: "Virtualização",
      description: "Plataforma de virtualização enterprise com alta disponibilidade",
      color: "bg-orange-500"
    },
    {
      name: "Grafana",
      category: "Dashboards",
      description: "Criação de dashboards e visualização de dados em tempo real",
      color: "bg-yellow-500"
    },
    {
      name: "PfSense",
      category: "Firewall",
      description: "Firewall open-source com recursos avançados de segurança",
      color: "bg-green-500"
    },
    {
      name: "Wazuh",
      category: "Segurança",
      description: "Plataforma SIEM para detecção de ameaças e compliance",
      color: "bg-purple-500"
    }
  ];

  return (
    <section id="tech" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tecnologias que Dominamos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Utilizamos as melhores ferramentas open-source e enterprise para 
            construir soluções robustas e eficientes para sua empresa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {technologies.map((tech, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className={`h-2 ${tech.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{tech.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {tech.category}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tech.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Integração Completa
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto mb-8">
              Não trabalhamos com ferramentas isoladas. Integramos todas essas tecnologias 
              para criar um ecossistema completo de monitoramento, segurança e gestão 
              que funciona em perfeita harmonia.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">🔄</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Integração</h4>
                <p className="text-sm text-gray-600">Todas as ferramentas trabalham em conjunto</p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Performance</h4>
                <p className="text-sm text-gray-600">Otimização contínua da infraestrutura</p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Segurança</h4>
                <p className="text-sm text-gray-600">Proteção em múltiplas camadas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technologies;
