
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Clock, Award } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      title: "Qualidade",
      description: "Comprometimento com excelência em cada projeto"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Parceria",
      description: "Relacionamento de longo prazo com nossos clientes"
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-600" />,
      title: "Agilidade",
      description: "Respostas rápidas e soluções eficientes"
    },
    {
      icon: <Award className="h-6 w-6 text-orange-600" />,
      title: "Expertise",
      description: "Especialização em tecnologias de ponta"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Sobre a Delta7 Tecnologia
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  A Delta7 Tecnologia é uma empresa especializada em soluções completas de TI, 
                  com foco em infraestrutura, desenvolvimento de software e consultoria tecnológica. 
                  Nossa equipe possui anos de experiência em implementação e suporte de ferramentas 
                  como GLPI, Zabbix, Proxmox, PfSense e Wazuh.
                </p>
                <p>
                  Nossa missão é fornecer soluções de TI robustas, seguras e eficientes, 
                  permitindo que nossos clientes foquem no que realmente importa: 
                  o crescimento do seu negócio.
                </p>
                <p>
                  Oferecemos atendimento personalizado, seja presencial ou remoto, 
                  garantindo que sua infraestrutura esteja sempre funcionando 
                  com máxima performance e segurança.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">10+</div>
                <div className="text-sm text-gray-600">Anos no Mercado</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-green-600 mb-2">200+</div>
                <div className="text-sm text-gray-600">Projetos Entregues</div>
              </div>
            </div>
          </div>

          {/* Right Column - Values */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Nossos Valores e Diferenciais
            </h3>
            
            <div className="space-y-4">
              {values.map((value, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        {value.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">{value.title}</h4>
                        <p className="text-gray-600 text-sm">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <h4 className="font-semibold mb-2">Suporte 24x7</h4>
              <p className="text-blue-100 text-sm">
                Monitoramento contínuo e suporte técnico especializado 
                para garantir a continuidade do seu negócio.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
