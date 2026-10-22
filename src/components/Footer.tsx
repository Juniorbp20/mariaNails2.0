/**
 * Footer.tsx — Pie de página con negocio, ubicación, contacto y redes.
 *
 * 100% estático: todo sale de officialCatalog.ts, sin base de datos.
 * Si quitas la DB, Vercel ya no necesita VITE_SUPABASE_*.
 */
import { Clock, CreditCard, Instagram, MapPin, Phone } from 'lucide-react';
import { BUSINESS_INFO, COURTESIES, STATIC_PROFILE } from '../data/officialCatalog';

/** Icono de WhatsApp en SVG (igual que el botón flotante). */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M19.11 4.93A9.9 9.9 0 0 0 12.07 2C6.56 2 2.08 6.48 2.08 12c0 1.77.46 3.5 1.33 5.03L2 22l5.12-1.34A9.93 9.93 0 0 0 12.07 22c5.51 0 9.99-4.48 9.99-10 0-2.67-1.04-5.18-2.95-7.07Zm-7.04 15.32a8.24 8.24 0 0 1-4.19-1.14l-.3-.18-3.04.8.81-2.96-.2-.31a8.23 8.23 0 0 1-1.28-4.46c0-4.56 3.71-8.27 8.28-8.27 2.2 0 4.27.86 5.82 2.42A8.2 8.2 0 0 1 20.35 12c0 4.56-3.72 8.27-8.28 8.27Zm4.54-6.2c-.25-.13-1.47-.72-1.7-.8-.23-.08-.4-.12-.57.12-.17.25-.66.8-.81.96-.15.17-.3.19-.56.06-.25-.13-1.06-.39-2.03-1.25a7.6 7.6 0 0 1-1.4-1.74c-.15-.25-.02-.39.11-.52.12-.12.25-.3.38-.45.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.57-1.37-.78-1.87-.21-.5-.43-.43-.57-.43h-.49c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.28 3.79.6.26 1.08.42 1.44.53.61.19 1.17.16 1.61.1.49-.07 1.47-.6 1.68-1.17.21-.57.21-1.06.15-1.17-.06-.1-.23-.17-.48-.3Z" />
    </svg>
  );
}

/** Pie de página estático: 3 columnas + Instagram y WhatsApp. */
export default function Footer() {
  const businessName = BUSINESS_INFO.name;
  const instagramUrl = BUSINESS_INFO.instagramUrl;
  const mapsUrl = BUSINESS_INFO.mapsUrl;

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{businessName}</h3>
            <p className="text-gray-400 text-sm">{STATIC_PROFILE.footerDescription}</p>
            <p className="mt-3 text-xs text-purple-300">
              Cortesía: {COURTESIES.join(' · ')}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Ubicación</h3>
            <div className="flex items-start space-x-3 mb-4">
              <MapPin className="w-5 h-5 text-pink-500 flex-shrink-0 mt-1" aria-hidden="true" />
              <div>
                <p className="text-gray-300 text-sm">{BUSINESS_INFO.addressLine1}</p>
                <p className="text-gray-400 text-sm">{BUSINESS_INFO.addressLine2}</p>
              </div>
            </div>
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 text-sm font-medium"
              >
                Ver en Google Maps &rarr;
              </a>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contacto y Pagos</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-pink-500" aria-hidden="true" />
                <span className="text-gray-300">
                  {BUSINESS_INFO.phoneDisplay} · WhatsApp citas
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <CreditCard className="w-5 h-5 text-pink-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-gray-300 text-sm">{STATIC_PROFILE.paymentDetails}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-pink-500" aria-hidden="true" />
                <div className="text-gray-300 text-sm">
                  <p>Solo con cita previa</p>
                  <p className="text-gray-400">Cancela sin costo 24h antes · Tolerancia 15 min</p>
                </div>
              </div>
              {BUSINESS_INFO.contactEmail && (
                <p className="text-gray-300 text-sm">{BUSINESS_INFO.contactEmail}</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} {businessName}. Todos los derechos reservados.</p>
            <div className="flex items-center gap-3">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-pink-500/30 hover:-translate-y-0.5 transition"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
                <span className="text-sm">Instagram</span>
              </a>

              <a
                href={BUSINESS_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white font-semibold shadow-lg hover:bg-emerald-400 hover:-translate-y-0.5 transition"
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span className="text-sm">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
