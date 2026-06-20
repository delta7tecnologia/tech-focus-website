import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import PageTransition from '@/components/PageTransition';
import Breadcrumbs from '@/components/Breadcrumbs';

const PoliticaPrivacidade = () => (
  <PageTransition>
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Política de Privacidade | Delta7 Tecnologia"
        description="Política de Privacidade da Delta7 Tecnologia. Saiba como coletamos, usamos e protegemos seus dados pessoais em conformidade com a LGPD."
      />
      <Navigation />
      <section className="pt-24 pb-10 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">Política de Privacidade</h1>
          <p className="text-blue-100">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </section>
      <Breadcrumbs items={[{ label: 'Política de Privacidade' }]} />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-slate">
        <h2>1. Quem somos</h2>
        <p>A <strong>Delta7 Tecnologia</strong> é uma empresa especializada em soluções de TI gerenciada,
        com sede em Paragominas-PA. Esta política descreve como tratamos dados pessoais coletados em
        nosso site e serviços, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018).</p>

        <h2>2. Dados que coletamos</h2>
        <ul>
          <li>Dados de contato fornecidos voluntariamente (nome, e-mail, telefone, empresa) ao preencher formulários.</li>
          <li>Dados de navegação (endereço IP, tipo de dispositivo, páginas visitadas) por meio de cookies e ferramentas analíticas.</li>
          <li>Dados técnicos necessários à prestação de serviços contratados (somente para clientes).</li>
        </ul>

        <h2>3. Como usamos seus dados</h2>
        <ul>
          <li>Responder solicitações de contato, orçamento e suporte.</li>
          <li>Enviar comunicações comerciais quando autorizadas.</li>
          <li>Cumprir obrigações legais e contratuais.</li>
          <li>Melhorar a experiência de uso do site.</li>
        </ul>

        <h2>4. Compartilhamento</h2>
        <p>Não vendemos dados pessoais. Compartilhamos apenas com parceiros estritamente necessários
        à prestação do serviço (ex.: provedores de e-mail, hospedagem) e com autoridades quando exigido por lei.</p>

        <h2>5. Seus direitos</h2>
        <p>Você pode solicitar a qualquer momento o acesso, correção, anonimização ou exclusão dos seus
        dados pessoais entrando em contato pelo e-mail <a href="mailto:contato@delta7tecnologia.com.br">contato@delta7tecnologia.com.br</a>.</p>

        <h2>6. Segurança</h2>
        <p>Adotamos medidas técnicas e administrativas para proteger seus dados, incluindo criptografia,
        controle de acesso e monitoramento contínuo.</p>

        <h2>7. Contato do Encarregado (DPO)</h2>
        <p>Para tratar de assuntos relacionados à privacidade, fale conosco:<br/>
        E-mail: <a href="mailto:contato@delta7tecnologia.com.br">contato@delta7tecnologia.com.br</a><br/>
        WhatsApp: (91) 98237-0332</p>
      </article>
      <Footer />
    </div>
  </PageTransition>
);

export default PoliticaPrivacidade;
