/**
 * ScrollToTop.tsx — Vuelve arriba al cambiar de página.
 *
 * Sin esto, al navegar entre páginas la vista quedaría
 * a mitad de scroll. No pinta nada en pantalla (return null).
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Escucha cambios de ruta y sube el scroll al inicio. */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}
