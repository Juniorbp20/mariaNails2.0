import { Link } from 'react-router-dom';
import { BadgeDollarSign, Calendar } from 'lucide-react';
import { useBusinessProfile } from '../contexts/BusinessProfileContext';
import { toWhatsAppUrl } from '../utils/format';

export default function PriceCatalog() {
  const { profile, loading } = useBusinessProfile();

  const businessName = profile.business_name || 'María Nails';
  const catalogUrl = profile.price_catalog_url;
  const whatsappUrl = toWhatsAppUrl(profile.contact_whatsapp || profile.contact_phone);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pink-100">
            <BadgeDollarSign className="h-7 w-7 text-pink-600" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Catálogo de precios</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Todos nuestros servicios y precios en un solo lugar, sin sorpresas.
          </p>
        </div>

        {loading ? (
          <div className="mx-auto h-96 max-w-3xl animate-pulse rounded-lg bg-gray-200" aria-label="Cargando catálogo" />
        ) : catalogUrl ? (
          <figure className="overflow-hidden rounded-lg border border-pink-200 shadow-lg">
            <img
              src={catalogUrl}
              alt={`Catálogo de precios de ${businessName}`}
              className="w-full object-contain"
              loading="lazy"
            />
          </figure>
        ) : (
          <div className="mx-auto max-w-xl rounded-lg border border-pink-200 bg-pink-50 p-8 text-center">
            <p className="mb-2 text-lg font-semibold text-gray-900">Estamos actualizando el catálogo</p>
            <p className="mb-6 text-gray-600">
              Escríbenos y te enviamos los precios actuales, o mira los servicios disponibles.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/servicios"
                className="rounded-lg bg-gradient-to-r from-pink-500 to-red-500 px-6 py-3 font-semibold text-white transition hover:shadow-lg"
              >
                Ver servicios
              </Link>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-pink-200 bg-white px-6 py-3 font-semibold text-pink-700 transition hover:shadow"
                >
                  Pedir precios por WhatsApp
                </a>
              )}
            </div>
          </div>
        )}

        {catalogUrl && (
          <div className="mt-10 text-center">
            <Link
              to="/reserva"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 px-8 py-3 font-semibold text-white transition hover:shadow-lg"
            >
              <Calendar className="h-5 w-5" aria-hidden="true" />
              Reservar mi cita
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
