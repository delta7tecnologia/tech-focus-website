import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Monitor, 
  Shield, 
  Cloud, 
  Server, 
  BarChart3, 
  Network, 
  Settings, 
  ArrowRight 
} from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: <Monitor className="h-8 w-8" />,
      title: "Suporte Técnico e TI Gerenciada",
      description: "Gestão completa da infraestrutura de TI com atendimento especializado",
      features: ["Help desk e suporte remoto", "Gestão de chamados (GLPI)", "Manutenção preventiva", "Inventário de ativos"],
      badge: "Essencial",
      color: "blue"
    },
    {
      icon: <Server className="h-8 w-8" />,
      title: "Servidores e Virtualização",
      description: "Infraestrutura robusta com alta disponibilidade",
      features: ["Proxmox VE", "VMware vSphere", "Windows Server", "Linux Enterprise"],
      badge: "Enterprise",
      color: "green"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Firewall e Segurança",
      description: "Proteção avançada contra ameaças e invasões",
      features: ["PfSense / OPNsense", "VPN Site-to-Site", "Wazuh SIEM", "Análise de vulnerabilidades"],
      badge: "Segurança",
      color: "red"
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Backup Local e em Nuvem",
      description: "Proteção total dos dados e recuperação de desastres",
      features: ["Backup automatizado", "Replicação em nuvem", "Disaster recovery", "Testes de integridade"],
      badge: "Proteção",
      color: "cyan"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Monitoramento",
      description: "Supervisão proativa 24x7 da infraestrutura",
      features: ["Zabbix", "Grafana dashboards", "Alertas em tempo real", "Relatórios de SLA"],
      badge: "Crítico",
      color: "orange"
    },
    {
      icon: <Network className="h-8 w-8" />,
      title: "Infraestrutura de Redes",
      description: "Projetos e implementação de redes corporativas",
      features: ["Switching e routing", "Wi-Fi corporativo", "Cabeamento estruturado", "VLANs e segmentação"],
      badge: "Redes",
      color: "purple"
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "Consultoria e Projetos de TI",
      description: "Planejamento estratégico e projetos sob medida",
      features: ["Análise de ambiente", "Roadmap tecnológico", "Migração de sistemas", "Documentação técnica"],
      badge: "Consultoria",
      color: "indigo"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { icon: string; badge: string; border: string }> = {
      blue: { icon: "text-blue-600", badge: "bg-blue-50 text-blue-700", border: "hover:border-blue-200" },
      green: { icon: "text-green-600", badge: "bg-green-50 text-green-700", border: "hover:border-green-200" },
      red: { icon: "text-red-500", badge: "bg-red-50 text-red-700", border: "hover:border-red-200" },
      cyan: { icon: "text-cyan-600", badge: "bg-cyan-50 text-cyan-700", border: "hover:border-cyan-200" },
      orange: { icon: "text-orange-500", badge: "bg-orange-50 text-orange-700", border: "hover:border-orange-200" },
      purple: { icon: "text-purple-600", badge: "bg-purple-50 text-purple-700", border: "hover:border-purple-200" },
      indigo: { icon: "text-indigo-600", badge: "bg-indigo-50 text-indigo-700", border: "hover:border-indigo-200" }
    };
    return colors[color] || colors.blue;
  };

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-700 mb-4">Nossos Serviços</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Soluções Completas em TI
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Oferecemos uma gama completa de serviços de tecnologia para manter 
            sua empresa segura, conectada e sempre operacional.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const colorClasses = getColorClasses(service.color);
            return (
              <Card 
                key={index} 
                className={`group hover:shadow-xl transition-all duration-300 border ${colorClasses.border}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-gray-50 rounded-lg group-hover:scale-110 transition-transform ${colorClasses.icon}`}>
                      {service.icon}
                    </div>
                    <Badge variant="secondary" className={colorClasses.badge}>
                      {service.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-gray-900">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
            <a href="#contact">
              Solicitar Orçamento
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
