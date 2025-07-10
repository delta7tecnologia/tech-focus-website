import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, MessageCircle, Instagram } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve. Obrigado pelo interesse!",
    });
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6 text-blue-600" />,
      title: "Telefone",
      info: "(91) 98237-0332",
      link: "tel:+5591982370332"
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-green-600" />,
      title: "WhatsApp",
      info: "(91) 98237-0332",
      link: "https://wa.me/5591982370332"
    },
    {
      icon: <Mail className="h-6 w-6 text-purple-600" />,
      title: "E-mail",
      info: "contato@delta7tecnologia.com.br",
      link: "mailto:contato@delta7tecnologia.com.br"
    },
    {
      icon: <Instagram className="h-6 w-6 text-pink-600" />,
      title: "Instagram",
      info: "@delta7tecnologia",
      link: "https://www.instagram.com/delta7tecnologia/"
    },
    {
      icon: <Clock className="h-6 w-6 text-orange-600" />,
      title: "Horário",
      info: "Seg-Sex: 8h às 18h",
      link: null
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Entre em Contato
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Está pronto para modernizar sua infraestrutura de TI? 
            Nossa equipe está aqui para ajudar com uma consultoria gratuita.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                Solicite seu Orçamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    placeholder="Seu nome completo"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Seu e-mail"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Nome da empresa"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="h-12"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Descreva suas necessidades de TI..."
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="min-h-[120px]"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                  Enviar Mensagem
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Informações de Contato
              </h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{item.title}</div>
                      {item.link ? (
                        <a 
                          href={item.link}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                          target={item.link.startsWith('http') ? '_blank' : undefined}
                          rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {item.info}
                        </a>
                      ) : (
                        <div className="text-gray-600">{item.info}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
              <h4 className="text-xl font-bold mb-4">
                Consultoria Gratuita
              </h4>
              <p className="mb-6 text-blue-100">
                Oferecemos uma análise gratuita da sua infraestrutura atual 
                e apresentamos propostas personalizadas para otimização.
              </p>
              <Button variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <a href="https://wa.me/5591982370332?text=Olá! Gostaria de agendar uma consultoria gratuita.">
                  Agendar Consultoria
                </a>
              </Button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="font-bold text-gray-900 mb-4">
                Atendimento Especializado
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Suporte remoto e presencial</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Monitoramento 24x7</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Resposta rápida em emergências</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Documentação completa</span>
                </li>
              </ul>
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h4 className="font-bold text-gray-900 mb-4 text-center">
                  Nossa Localização
                </h4>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.4080858009606!2d-47.3582811!3d-2.9841332000000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92b75df6c286c857%3A0xdb62e4ebaaf76857!2sDelta7%20Solu%C3%A7%C3%B5es%20em%20Tecnologia!5e0!3m2!1spt-BR!2sbr!4v1752178438389!5m2!1spt-BR!2sbr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Delta7 Tecnologia"
              ></iframe>
              <div className="p-4 text-center">
                <Button variant="outline" asChild>
                  <a href="https://maps.app.goo.gl/5RbmwEGGWdrSRcqVA" target="_blank" rel="noopener noreferrer">
                    <MapPin className="mr-2 h-4 w-4" />
                    Ver no Google Maps
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;