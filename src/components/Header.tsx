/**
 * Header.tsx — Barra superior con logo, nombre y menú de navegación.
 *
 * 100% estático: datos desde officialCatalog.ts, sin base de datos.
 * Enlaces: Inicio / Sobre mí / Galería (puente a Instagram) / Precios / Reservar.
 */
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS_INFO, SITE_IMAGES } from '../data/officialCatalog';

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
                alt={`${businessName} logo`}
                className="w-12 h-12 rounded-full object-cover border border-pink-200"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {initials}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">{businessName}</h1>
              <p className="text-xs text-gray-600">{tagline}</p>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-pink-600 font-medium transition">
              Inicio
            </Link>
            <Link to="/sobre-mi" className="text-gray-700 hover:text-pink-600 font-medium transition">
              Sobre mí
            </Link>
            <Link to="/galeria" className="text-gray-700 hover:text-pink-600 font-medium transition">
              Galería
            </Link>
            <Link to="/precios" className="text-gray-700 hover:text-pink-600 font-medium transition">
              Precios
            </Link>
            <a
              href={`${BUSINESS_INFO.whatsappUrl}?text=${encodeURIComponent('Hola María. Quiero reservar mi cita en Maria Nails. Mi nombre es: ___. Quedo atenta, ¡gracias!')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition"
            >
              Reservar por WhatsApp
            </a>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {menuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>

        {menuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              onClick={() => setMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/sobre-mi"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              onClick={() => setMenuOpen(false)}
            >
              Sobre mí
            </Link>
            <Link
              to="/galeria"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              onClick={() => setMenuOpen(false)}
            >
              Galería
            </Link>
            <Link
              to="/precios"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              onClick={() => setMenuOpen(false)}
            >
              Precios
            </Link>
            <a
              href={`${BUSINESS_INFO.whatsappUrl}?text=${encodeURIComponent('Hola María. Quiero reservar mi cita en Maria Nails. Mi nombre es: ___. Quedo atenta, ¡gracias!')}`}
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
