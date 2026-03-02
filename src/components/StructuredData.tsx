import React from 'react';

const StructuredData = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Delta7 Tecnologia",
    "url": "https://delta7tecnologia.com.br",
    "logo": "https://delta7tecnologia.com.br/logo.png",
    "description": "Especialistas em infraestrutura de TI com GLPI, Zabbix, Proxmox, PfSense e Wazuh. Monitoramento 24x7, virtualização, segurança e backup para empresas.",
    "foundingDate": "2014",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Parauapebas",
      "addressRegion": "PA",
      "addressCountry": "BR"
    },
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
};

export default StructuredData;
