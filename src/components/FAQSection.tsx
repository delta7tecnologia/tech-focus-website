import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const defaultFaqs = [
  {
    id: '1',
    question: "Qual o tempo de resposta para suporte técnico?",
    answer: "Nosso SLA padrão é de até 4 horas para primeiro contato. Para clientes com contrato premium, oferecemos resposta em até 30 minutos e suporte 24/7."
  },
  {
    id: '2',
    question: "Vocês atendem empresas de qual porte?",
    answer: "Atendemos desde pequenos escritórios com 5 usuários até grandes empresas com mais de 500 colaboradores. Nossas soluções são escaláveis e adaptadas à realidade de cada cliente."
  },
  {
    id: '3',
    question: "Como funciona o suporte remoto?",
    answer: "Utilizamos ferramentas seguras de acesso remoto que permitem resolver a maioria dos problemas sem a necessidade de visita presencial. Isso garante agilidade e menor custo operacional."
  },
  {
    id: '4',
    question: "Vocês oferecem serviços de backup em nuvem?",
    answer: "Sim! Oferecemos soluções de backup em nuvem com criptografia de ponta a ponta, armazenamento em datacenters brasileiros e recuperação rápida de dados."
  },
  {
    id: '5',
    question: "É possível contratar apenas um serviço específico?",
    answer: "Com certeza! Você pode contratar serviços avulsos como configuração de rede, migração para nuvem ou consultoria. Também oferecemos pacotes personalizados conforme sua necessidade."
  },
  {
    id: '6',
    question: "Qual a área de atuação da Delta7?",
    answer: "Nossa sede fica em Parauapebas-PA, mas atendemos clientes em todo o Brasil através de suporte remoto. Para serviços presenciais, atuamos na região do sudeste do Pará."
  }
];

const FAQSection = () => {
  const { data: faqs } = useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const displayFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            Perguntas Frequentes
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Tire suas <span className="text-blue-600">dúvidas</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Respondemos às perguntas mais comuns sobre nossos serviços e forma de trabalho.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {displayFaqs.map((faq, index) => (
              <AccordionItem 
                key={faq.id} 
                value={faq.id}
                className="bg-gray-50 rounded-xl px-6 border border-gray-100 hover:border-blue-200 transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-600 py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-gray-600 mb-4">
            Não encontrou sua resposta?
          </p>
          <a 
            href="https://wa.me/5591982370332?text=Olá! Tenho uma dúvida sobre os serviços da Delta7."
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            Fale diretamente conosco pelo WhatsApp →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
