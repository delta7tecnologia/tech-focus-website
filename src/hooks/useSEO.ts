import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface UseSEOOptions {
  title: string;
  description: string;
  noindex?: boolean;
}

/**
 * Hook variant of SEOHead. Useful for pages with multiple early returns
 * where mounting a component conditionally would skip metadata updates.
 */
export const useSEO = ({ title, description, noindex }: UseSEOOptions) => {
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
  }, [title, description, location.pathname, noindex]);
};
