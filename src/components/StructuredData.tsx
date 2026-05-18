import React from 'react';

const StructuredData = () => {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Delta7 Tecnologia",
    "url": "https://delta7tecnologia.com.br",
    "logo": "https://delta7tecnologia.com.br/logo.png",
    "image": "https://delta7tecnologia.com.br/logo.png",
    "description": "MSP especializada em infraestrutura de TI, suporte gerenciado, cloud, segurança e backup para empresas.",
    "foundingDate": "2014",
    "telephone": "+55-91-98237-0332",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Paragominas",
      "addressRegion": "PA",
      "addressCountry": "BR"
    },
    "areaServed": [
      { "@type": "City", "name": "Paragominas" },
      { "@type": "Country", "name": "Brasil" }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+55-91-98237-0332",
      "contactType": "customer service",
      "availableLanguage": "Portuguese"
    },
    "sameAs": [
      "https://www.facebook.com/delta7tecnologia",
      "https://www.instagram.com/delta7tecnologia",
      "https://www.linkedin.com/company/delta7tecnologia"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Delta7 Tecnologia",
    "url": "https://delta7tecnologia.com.br",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://delta7tecnologia.com.br/?s={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Qual o tempo de resposta para suporte técnico?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nosso SLA padrão é de até 4 horas para primeiro contato. Para clientes com contrato premium, oferecemos resposta em até 30 minutos e suporte 24/7."
        }
      },
      {
        "@type": "Question",
        "name": "Vocês atendem empresas de qual porte?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Atendemos desde pequenos escritórios com 5 usuários até grandes empresas com mais de 500 colaboradores. Nossas soluções são escaláveis e adaptadas à realidade de cada cliente."
        }
      },
      {
        "@type": "Question",
        "name": "Como funciona o suporte remoto?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Utilizamos ferramentas seguras de acesso remoto que permitem resolver a maioria dos problemas sem a necessidade de visita presencial. Isso garante agilidade e menor custo operacional."
        }
      },
      {
        "@type": "Question",
        "name": "Vocês oferecem serviços de backup em nuvem?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! Oferecemos soluções de backup em nuvem com criptografia de ponta a ponta, armazenamento em datacenters brasileiros e recuperação rápida de dados."
        }
      },
      {
        "@type": "Question",
        "name": "É possível contratar apenas um serviço específico?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Com certeza! Você pode contratar serviços avulsos como configuração de rede, migração para nuvem ou consultoria. Também oferecemos pacotes personalizados conforme sua necessidade."
        }
      },
      {
        "@type": "Question",
        "name": "Qual a área de atuação da Delta7?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nossa sede fica em Paragominas-PA, mas atendemos clientes em todo o Brasil através de suporte remoto. Para serviços presenciais, atuamos na região do sudeste do Pará e região metropolitana de Belém."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
};

export default StructuredData;
