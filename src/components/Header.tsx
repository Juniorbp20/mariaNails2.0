/**
 * Header.tsx — Barra superior con logo, nombre y menú de navegación.
 *
 * 100% estático: datos desde officialCatalog.ts, sin base de datos.
 * Enlaces: Inicio / Sobre mí / Galería (puente a Instagram) / Precios / Reservar.
 */
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BUSINESS_INFO, SITE_IMAGES } from '../data/officialCatalog';
import { waLink, WHATSAPP_TEMPLATES } from '../data/whatsappTemplates';

const desktopNavClass = ({ isActive }: { isActive: boolean }) =>
  `font-medium transition ${isActive ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'}`;

const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
  `block px-4 py-2 rounded-lg transition ${
    isActive ? 'bg-pink-50 text-pink-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
  }`;

/** Encabezado fijo con navegación principal. */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const businessName = BUSINESS_INFO.name;
  const tagline = BUSINESS_INFO.tagline;
  const initials =
    businessName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || 'MN';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            {SITE_IMAGES.logo ? (
              <img
                src={SITE_IMAGES.logo}
                alt=""
                width={48}
                height={48}
                decoding="async"
                className="w-12 h-12 rounded-full object-cover border border-pink-200"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {initials}
              </div>
            )}
            <div>
              <p className="text-xl font-bold text-gray-900">{businessName}</p>
              <p className="text-xs text-gray-600">{tagline}</p>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <NavLink to="/" end className={desktopNavClass}>
              Inicio
            </NavLink>
            <NavLink to="/sobre-mi" className={desktopNavClass}>
              Sobre mí
            </NavLink>
            <NavLink to="/galeria" className={desktopNavClass}>
              Galería
            </NavLink>
            <NavLink to="/precios" className={desktopNavClass}>
              Precios
            </NavLink>
            <a
              href={waLink(WHATSAPP_TEMPLATES.reserva)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition"
            >
              Reservar por WhatsApp
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {menuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>

        {menuOpen && (
          <nav id="mobile-nav" className="md:hidden pb-4 space-y-2">
            <NavLink to="/" end className={mobileNavClass} onClick={() => setMenuOpen(false)}>
              Inicio
            </NavLink>
            <NavLink to="/sobre-mi" className={mobileNavClass} onClick={() => setMenuOpen(false)}>
              Sobre mí
            </NavLink>
            <NavLink to="/galeria" className={mobileNavClass} onClick={() => setMenuOpen(false)}>
              Galería
            </NavLink>
            <NavLink to="/precios" className={mobileNavClass} onClick={() => setMenuOpen(false)}>
              Precios
            </NavLink>
            <a
              href={waLink(WHATSAPP_TEMPLATES.reserva)}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-medium transition"
              onClick={() => setMenuOpen(false)}
            >
              Reservar por WhatsApp
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
