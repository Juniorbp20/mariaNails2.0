import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://marianails.app';

const PAGES: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Maria Nails | Manicura, Gel, Pedicura y Acrílico en Tenares',
    description:
      'Manicura, gel, pedicura spa y acrílico del #1 al #8 en Tenares. Reserva tu cita por WhatsApp con María Bonifacio.',
  },
  '/galeria': {
    title: 'Galería de Trabajos | Maria Nails',
    description:
      'Descubre los trabajos de Maria Nails en Instagram: acrílico, gel, pedicura spa y nail art.',
  },
  '/sobre-mi': {
    title: 'Sobre María Bonifacio | Maria Nails',
    description:
      'Conoce a María Bonifacio, manicurista profesional en Tenares, República Dominicana.',
  },
  '/precios': {
    title: 'Catálogo de Precios | Maria Nails',
    description:
      'Precios oficiales de manicura, gel, pedicura y acrílico #1-#8. Reserva por WhatsApp.',
  },
};

const NOT_FOUND = {
  title: 'Página no encontrada | Maria Nails',
  description:
    'La página que buscas no existe. Vuelve al inicio o consulta el catálogo de precios de Maria Nails.',
};

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  document
    .querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
    ?.setAttribute('content', content);
}

function setCanonical(href: string | null) {
  const existing = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!href) {
    existing?.remove();
    return;
  }

  if (existing) {
    existing.href = href;
    return;
  }

  const link = document.createElement('link');
  link.rel = 'canonical';
  link.href = href;
  document.head.appendChild(link);
}

export default function RouteMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/';
    const isKnown = Object.prototype.hasOwnProperty.call(PAGES, path);
    const page = isKnown ? PAGES[path] : NOT_FOUND;

    document.title = page.title;
    setMeta('name', 'description', page.description);
    setMeta('name', 'robots', isKnown ? 'index, follow' : 'noindex, follow');
    setMeta('property', 'og:title', page.title);
    setMeta('property', 'og:description', page.description);
    setMeta('property', 'og:url', `${SITE_URL}${path}`);
    setMeta('name', 'twitter:title', page.title);
    setMeta('name', 'twitter:description', page.description);
    setCanonical(isKnown ? `${SITE_URL}${path}` : null);
  }, [pathname]);

  return null;
}
