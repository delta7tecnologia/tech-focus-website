import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { 
  Monitor, 
  Shield, 
  Cloud, 
  Server, 
  BarChart3, 
  Network, 
  Settings, 
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: <Monitor className="h-7 w-7" />,
      title: "Suporte Técnico e TI Gerenciada",
      description: "Gestão completa da infraestrutura de TI com atendimento especializado e proativo",
      features: ["Help desk e suporte remoto", "Gestão de chamados (GLPI)", "Manutenção preventiva", "Inventário de ativos"],
      badge: "Essencial",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <Server className="h-7 w-7" />,
      title: "Servidores e Virtualização",
      description: "Infraestrutura robusta com alta disponibilidade e performance",
      features: ["Proxmox VE", "VMware vSphere", "Windows Server", "Linux Enterprise"],
      badge: "Enterprise",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: <Shield className="h-7 w-7" />,
      title: "Firewall e Segurança",
      description: "Proteção avançada contra ameaças cibernéticas e invasões",
      features: ["PfSense / OPNsense", "VPN Site-to-Site", "Wazuh SIEM", "Análise de vulnerabilidades"],
      badge: "Segurança",
      gradient: "from-red-500 to-rose-600"
    },
    {
      icon: <Cloud className="h-7 w-7" />,
      title: "Backup Local e em Nuvem",
      description: "Proteção total dos dados com recuperação de desastres garantida",
      features: ["Backup automatizado", "Replicação em nuvem", "Disaster recovery", "Testes de integridade"],
      badge: "Proteção",
      gradient: "from-cyan-500 to-teal-600"
    },
    {
      icon: <BarChart3 className="h-7 w-7" />,
      title: "Monitoramento 24x7",
      description: "Supervisão proativa da infraestrutura com alertas em tempo real",
      features: ["Zabbix", "Grafana dashboards", "Alertas inteligentes", "Relatórios de SLA"],
      badge: "Crítico",
      gradient: "from-orange-500 to-amber-600"
    },
    {
      icon: <Network className="h-7 w-7" />,
      title: "Infraestrutura de Redes",
      description: "Projetos e implementação de redes corporativas de alto desempenho",
      features: ["Switching e routing", "Wi-Fi corporativo", "Cabeamento estruturado", "VLANs e segmentação"],
      badge: "Redes",
      gradient: "from-purple-500 to-violet-600"
    },
    {
      icon: <Settings className="h-7 w-7" />,
      title: "Consultoria e Projetos de TI",
      description: "Planejamento estratégico e projetos sob medida para seu negócio",
      features: ["Análise de ambiente", "Roadmap tecnológico", "Migração de sistemas", "Documentação técnica"],
      badge: "Consultoria",
      gradient: "from-indigo-500 to-blue-600"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Nossos Serviços
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Soluções Completas em <span className="text-blue-600">TI</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Oferecemos um ecossistema completo de serviços tecnológicos para manter 
            sua empresa segura, conectada e sempre operacional.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
                {/* Gradient Top Bar */}
                <div className={`h-1 bg-gradient-to-r ${service.gradient}`} />
                
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${service.gradient} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      {service.icon}
                    </div>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-medium">
                      {service.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 px-8"
            asChild
          >
            <a href="#contact">
              Solicitar Orçamento
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
