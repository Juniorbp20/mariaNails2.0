import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBusinessProfile } from '../contexts/BusinessProfileContext';

const SECRET_ADMIN_TAP_COUNT = 3;
const SECRET_ADMIN_TAP_WINDOW_MS = 2500;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { profile } = useBusinessProfile();
  const navigate = useNavigate();
  const hiddenTapStateRef = useRef<{
    count: number;
    timer: ReturnType<typeof setTimeout> | null;
  }>({ count: 0, timer: null });

  const businessName = profile.business_name || 'Maria Nails';
  const tagline = profile.tagline || 'Belleza en tus manos';
  const initials =
    businessName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || 'MN';

  const handleBrandClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const tapState = hiddenTapStateRef.current;
    tapState.count += 1;

    if (tapState.timer) {
      clearTimeout(tapState.timer);
      tapState.timer = null;
    }

    if (tapState.count >= SECRET_ADMIN_TAP_COUNT) {
      event.preventDefault();
      tapState.count = 0;
      setMenuOpen(false);
      navigate('/admin');
      return;
    }

    tapState.timer = setTimeout(() => {
      hiddenTapStateRef.current.count = 0;
      hiddenTapStateRef.current.timer = null;
    }, SECRET_ADMIN_TAP_WINDOW_MS);
  };

  useEffect(() => {
    return () => {
      const timer = hiddenTapStateRef.current.timer;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3" onClick={handleBrandClick}>
            {profile.logo_url ? (
              <img
                src={profile.logo_url}
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
              Sobre mi
            </Link>
            <Link to="/servicios" className="text-gray-700 hover:text-pink-600 font-medium transition">
              Servicios
            </Link>
            <Link to="/galeria" className="text-gray-700 hover:text-pink-600 font-medium transition">
              Galeria
            </Link>
            <Link
              to="/reserva"
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition"
            >
              Reservar cita
            </Link>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
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
              Sobre mi
            </Link>
            <Link
              to="/servicios"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              onClick={() => setMenuOpen(false)}
            >
              Servicios
            </Link>
            <Link
              to="/galeria"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              onClick={() => setMenuOpen(false)}
            >
              Galeria
            </Link>
            <Link
              to="/reserva"
              className="block px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-medium transition"
              onClick={() => setMenuOpen(false)}
            >
              Reservar cita
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
