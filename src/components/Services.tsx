
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Monitor, Shield, Cloud, Server, Database, BarChart3, ArrowRight } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Monitor className="h-8 w-8 text-blue-600" />,
      title: "Gerenciamento e Suporte de TI",
      description: "Gestão completa da infraestrutura com GLPI e Proxmox",
      features: ["GLPI - Controle de chamados e inventário", "Proxmox - Virtualização e alta disponibilidade", "Inventário automatizado de ativos", "Gestão de incidentes e problemas"],
      badge: "Essencial"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Monitoramento e Observabilidade",
      description: "Supervisão proativa com Zabbix e Grafana",
      features: ["Zabbix - Monitoramento de servidores e redes", "Grafana - Dashboards e análise visual", "Alertas em tempo real", "Relatórios de performance"],
      badge: "Crítico"
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Segurança e Firewall",
      description: "Proteção avançada com PfSense e Wazuh",
      features: ["PfSense - Firewall e VPN", "Wazuh - Detecção de intrusão e SIEM", "Balanceamento de carga", "Compliance e auditoria"],
      badge: "Segurança"
    },
    {
      icon: <Cloud className="h-8 w-8 text-green-600" />,
      title: "Backup e Alta Disponibilidade",
      description: "Proteção total dos dados e continuidade do negócio",
      features: ["Backup automatizado em nuvem", "Replicações e snapshots", "Recuperação de desastres", "Testes de integridade"],
      badge: "Proteção"
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Nossos Serviços Especializados
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Oferecemos soluções completas de TI com foco em ferramentas open-source 
            e tecnologias enterprise para máxima eficiência e economia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    {service.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-gray-900">{service.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full group">
                  Saiba Mais
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Precisa de uma solução personalizada?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Desenvolvemos soluções sob medida para atender às necessidades específicas do seu negócio, 
              integrando as melhores tecnologias do mercado.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Solicitar Consultoria Gratuita
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
