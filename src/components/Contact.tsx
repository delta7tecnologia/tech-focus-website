import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  Instagram
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve. Obrigado pelo interesse!",
    });
    setFormData({ name: '', email: '', company: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Telefone",
      value: "(91) 98237-0332",
      link: "tel:+5591982370332"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "E-mail",
      value: "contato@delta7tecnologia.com.br",
      link: "mailto:contato@delta7tecnologia.com.br"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Localização",
      value: "Parauapebas, Pará - Brasil",
      link: null
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Horário",
      value: "Seg-Sex: 8h às 18h | Suporte 24/7",
      link: null
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Entre em Contato
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Fale com nosso <span className="text-blue-600">time</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estamos prontos para ajudar sua empresa a alcançar novos patamares 
            com soluções tecnológicas sob medida.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Solicite um orçamento
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome completo
                  </label>
                  <Input 
                    placeholder="Seu nome"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border-gray-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa
                  </label>
                  <Input 
                    placeholder="Nome da empresa"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <Input 
                    type="email" 
                    placeholder="seu@email.com"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-gray-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <Input 
                    placeholder="(00) 00000-0000"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Como podemos ajudar?
                </label>
                <Textarea 
                  placeholder="Descreva brevemente sua necessidade..."
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="border-gray-200 focus:border-blue-500 resize-none"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 py-6 text-lg"
              >
                <Send className="w-5 h-5 mr-2" />
                Enviar Mensagem
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
                  whileHover={{ y: -3 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">{info.title}</div>
                      {info.link ? (
                        <a href={info.link} className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                          {info.value}
                        </a>
                      ) : (
                        <div className="font-medium text-gray-900">{info.value}</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <motion.div
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Atendimento via WhatsApp</h4>
                  <p className="text-green-100 text-sm">Resposta rápida e direta</p>
                </div>
              </div>
              <p className="text-green-50 mb-4">
                Prefere conversar diretamente? Nosso time está pronto para 
                atender você pelo WhatsApp.
              </p>
              <Button 
                className="w-full bg-white text-green-600 hover:bg-green-50 font-semibold"
                size="lg"
                asChild
              >
                <a href="https://wa.me/5591982370332?text=Olá! Gostaria de mais informações sobre os serviços da Delta7.">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Iniciar Conversa
                </a>
              </Button>
            </motion.div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.4080858009606!2d-47.3582811!3d-2.9841332000000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x92b75df6c286c857%3A0xdb62e4ebaaf76857!2sDelta7%20Solu%C3%A7%C3%B5es%20em%20Tecnologia!5e0!3m2!1spt-BR!2sbr!4v1752178438389!5m2!1spt-BR!2sbr"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Delta7 Tecnologia"
              ></iframe>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Parauapebas, PA</span>
                </div>
                <a 
                  href="https://maps.app.goo.gl/5RbmwEGGWdrSRcqVA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Ver no Maps →
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
