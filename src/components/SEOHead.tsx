import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title: string;
  description: string;
  noindex?: boolean;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

const SEOHead = ({ title, description, noindex, jsonLd }: SEOHeadProps) => {
  const location = useLocation();

  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);

    const absoluteUrl = `https://delta7tecnologia.com.br${location.pathname}`;
    setMeta('meta[property="og:url"]', 'property', 'og:url', absoluteUrl);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', absoluteUrl);

    // Robots
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (noindex) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.setAttribute('name', 'robots');
        document.head.appendChild(robots);
      }
      robots.setAttribute('content', 'noindex, nofollow');
    } else if (robots) {
      robots.setAttribute('content', 'index, follow');
    }

    // Route-scoped JSON-LD
    const SCRIPT_ID = 'seo-head-jsonld';
    const existing = document.getElementById(SCRIPT_ID);
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = SCRIPT_ID;
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const s = document.getElementById(SCRIPT_ID);
      if (s) s.remove();
    };
  }, [title, description, location.pathname, noindex, JSON.stringify(jsonLd)]);

  return null;
};

export default SEOHead;
