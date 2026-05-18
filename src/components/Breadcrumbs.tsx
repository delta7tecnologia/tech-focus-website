import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const location = useLocation();

  const allItems = [{ label: 'Início', href: '/' }, ...items];

  // JSON-LD BreadcrumbList
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.href ? { "item": `https://delta7tecnologia.com.br${item.href}` } : {})
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-700">
          {allItems.map((item, index) => (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-500" />}
              {item.href && index < allItems.length - 1 ? (
                <Link to={item.href} className="hover:text-blue-700 transition-colors flex items-center gap-1">
                  {index === 0 && <Home className="w-3.5 h-3.5" />}
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">
                  {index === 0 && !item.href && <Home className="w-3.5 h-3.5 inline mr-1" />}
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
