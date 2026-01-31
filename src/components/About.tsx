import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Target, Eye, Heart } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Target className="h-6 w-6 text-blue-600" />,
      title: "Missão",
      description: "Fornecer soluções de TI robustas, seguras e eficientes, permitindo que nossos clientes foquem no crescimento do seu negócio."
    },
    {
      icon: <Eye className="h-6 w-6 text-green-600" />,
      title: "Visão",
      description: "Ser referência regional em soluções de infraestrutura e suporte de TI, reconhecida pela excelência técnica e atendimento humanizado."
    },
    {
      icon: <Heart className="h-6 w-6 text-red-500" />,
      title: "Valores",
      description: "Compromisso, transparência, inovação e parceria. Construímos relacionamentos duradouros baseados em confiança mútua."
    }
  ];

  const highlights = [
    "Atendimento presencial e remoto em toda a região",
    "Equipe técnica certificada e experiente",
    "Foco em ferramentas open-source e enterprise",
    "Monitoramento proativo 24x7",
    "Soluções personalizadas para cada cliente",
    "Suporte rápido com SLA definido"
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Sobre a Delta7 Tecnologia
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  A <strong className="text-gray-900">Delta7 Tecnologia</strong> é uma empresa especializada em soluções completas de TI, 
                  com mais de 10 anos de experiência no mercado. Atuamos com foco em 
                  <strong className="text-gray-900"> infraestrutura, segurança, monitoramento e suporte</strong> para empresas de todos os portes.
                </p>
                <p>
                  Nossa equipe possui ampla experiência em implementação e suporte de ferramentas 
                  como Zabbix, Grafana, Proxmox, PfSense, Wazuh e GLPI, garantindo uma 
                  infraestrutura robusta e monitorada 24 horas.
                </p>
                <p>
                  Oferecemos atendimento personalizado, seja presencial ou remoto, 
                  garantindo que sua infraestrutura esteja sempre funcionando 
                  com máxima performance e segurança.
                </p>
              </div>
            </div>

            {/* Highlights List */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">O que nos diferencia:</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {highlights.map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-1">10+</div>
                <div className="text-sm text-gray-600">Anos no Mercado</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-green-600 mb-1">200+</div>
                <div className="text-sm text-gray-600">Projetos</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-red-500 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Monitoramento</div>
              </div>
            </div>
          </div>

          {/* Right Column - Mission/Vision/Values */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Nosso Propósito
            </h3>
            
            <div className="space-y-6">
              {values.map((value, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gray-50 rounded-lg flex-shrink-0">
                        {value.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-lg">{value.title}</h4>
                        <p className="text-gray-600 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white mt-8">
              <h4 className="font-semibold mb-2 text-lg">Atendimento Regional e Remoto</h4>
              <p className="text-blue-100 text-sm leading-relaxed">
                Atendemos empresas em toda a região com suporte presencial e remoto. 
                Nossa equipe está preparada para garantir a continuidade do seu negócio 
                onde quer que você esteja.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
