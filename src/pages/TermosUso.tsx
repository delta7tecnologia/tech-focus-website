import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import PageTransition from '@/components/PageTransition';
import Breadcrumbs from '@/components/Breadcrumbs';

const TermosUso = () => (
  <PageTransition>
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Termos de Uso | Delta7 Tecnologia"
        description="Termos e condições de uso do site e dos serviços da Delta7 Tecnologia."
      />
      <Navigation />
      <section className="pt-24 pb-10 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-3">Termos de Uso</h1>
          <p className="text-blue-100">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </section>
      <Breadcrumbs items={[{ label: 'Termos de Uso' }]} />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-slate">
        <h2>1. Aceitação</h2>
        <p>Ao acessar o site da <strong>Delta7 Tecnologia</strong> (delta7tecnologia.com.br) você concorda
        com estes Termos de Uso. Caso não concorde, por favor não utilize o site.</p>

        <h2>2. Uso do site</h2>
        <p>O conteúdo deste site é meramente informativo. As informações sobre serviços, valores e prazos
        podem ser atualizadas sem aviso prévio. Propostas formais são emitidas em documento próprio.</p>

        <h2>3. Propriedade intelectual</h2>
        <p>Todos os textos, marcas, logotipos, imagens e elementos visuais aqui presentes são de
        titularidade da Delta7 Tecnologia ou de seus respectivos proprietários, sendo proibida a
        reprodução sem autorização.</p>

        <h2>4. Limitação de responsabilidade</h2>
        <p>A Delta7 envida esforços para manter o site disponível e seguro, mas não garante ausência
        de falhas, interrupções ou erros. Não nos responsabilizamos por danos decorrentes do uso ou
        impossibilidade de uso do site.</p>

        <h2>5. Links externos</h2>
        <p>O site pode conter links para sites de terceiros. Não somos responsáveis pelo conteúdo,
        políticas ou práticas de tais sites.</p>

        <h2>6. Alterações</h2>
        <p>Podemos atualizar estes Termos a qualquer momento. A versão vigente será sempre a publicada
        nesta página.</p>

        <h2>7. Foro</h2>
        <p>Fica eleito o foro da comarca de Paragominas-PA para dirimir quaisquer controvérsias
        relacionadas a estes Termos.</p>

        <h2>8. Contato</h2>
        <p>E-mail: <a href="mailto:contato@delta7tecnologia.com.br">contato@delta7tecnologia.com.br</a><br/>
        WhatsApp: (91) 98237-0332</p>
      </article>
      <Footer />
    </div>
  </PageTransition>
);

export default TermosUso;
