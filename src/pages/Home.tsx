/**
 * Home.tsx — Página de inicio (/).
 *
 * 100% estática: textos desde STATIC_PROFILE + BUSINESS_INFO,
 * servicios desde OFFICIAL_SERVICES, sin base de datos.
 */
import { Award, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { formatPrice } from '../utils/format';
import { getOfficialServices } from '../utils/catalog';
import { BUSINESS_INFO, COURTESIES, SITE_IMAGES, STATIC_PROFILE } from '../data/officialCatalog';
import { waLink } from '../data/whatsappTemplates';

/** Portada del negocio: hero, beneficios, sobre María y servicios destacados. */
export default function Home() {
  const services = useMemo(() => getOfficialServices().slice(0, 4), []);

  const businessName = BUSINESS_INFO.name;

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-pink-50 to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-3 inline-block rounded-full bg-white/70 px-4 py-1 text-sm font-medium text-pink-700 border border-pink-200">
            Reserva por WhatsApp · Solo con cita previa · {BUSINESS_INFO.phoneDisplay}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{STATIC_PROFILE.heroTitle}</h1>
          <p className="text-lg text-gray-700 mb-4 max-w-2xl mx-auto">{STATIC_PROFILE.heroSubtitle}</p>
          <p className="text-sm text-purple-700 mb-8">
            Coffee bar de cortesía: {COURTESIES.join(' · ')} · {BUSINESS_INFO.addressLine1}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={waLink('Hola María. Quiero reservar mi cita en Maria Nails Studio & Pedicure. Mi nombre es: ___. Quedo atenta, ¡gracias!')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition text-lg"
            >
              <Calendar className="w-5 h-5" aria-hidden="true" />
              <span>Reservar por WhatsApp</span>
            </a>
            <Link
              to="/galeria"
              className="inline-flex items-center px-8 py-3 bg-white text-pink-700 rounded-lg font-semibold border border-pink-200 hover:shadow transition text-lg"
            >
              Ver trabajos
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Por qué elegir {businessName}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-pink-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Experiencia profesional</h3>
              <p className="text-gray-600">María Bonifacio, técnica en manicura completa y pedicura.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-pink-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Coffee bar de cortesía</h3>
              <p className="text-gray-600">Café, tés, jugos y galletitas gratis en tu cita.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-pink-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Solo con cita previa</h3>
              <p className="text-gray-600">Reserva por WhatsApp al {BUSINESS_INFO.phoneDisplay} con anticipación.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-pink-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{STATIC_PROFILE.aboutTitle}</h2>
              {STATIC_PROFILE.aboutDescription
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean)
                .map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-gray-700 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              <Link
                to="/sobre-mi"
                className="inline-block px-6 py-2 bg-white text-pink-600 font-semibold rounded-lg hover:shadow-lg transition border border-pink-200"
              >
                Conoce más &rarr;
              </Link>
            </div>
            {SITE_IMAGES.profile ? (
              <img
                src={SITE_IMAGES.profile}
                alt={`${STATIC_PROFILE.aboutTitle} — técnica de uñas`}
                loading="lazy"
                className="w-full h-auto max-h-[520px] object-contain rounded-lg border border-pink-200 bg-pink-50"
              />
            ) : (
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg h-96 flex items-center justify-center text-gray-400">
                Foto de perfil
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Nuestros Servicios</h2>
          <p className="text-center text-gray-600 mb-2">Precios oficiales en RD$, sin sorpresas. Elige y reserva en segundos.</p>
          <p className="text-center text-sm text-purple-700 mb-12">
            Manicura · Gel · Pedicura · Acrílico #1-#8 (precios a consultar) ·{' '}
            <a href="/precios" className="font-semibold underline">Ver tabla completa</a>
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {services.map((service) => (
              <a
                key={service.id}
                href={waLink(`Hola María. Quiero reservar: ${service.name} (${formatPrice(service.price)}). Mi nombre es: ___.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-gradient-to-br from-pink-50 to-red-50 rounded-lg p-6 border border-pink-200 transition hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-pink-700">{service.name}</h3>
                  <span className="whitespace-nowrap font-bold text-pink-600">{formatPrice(service.price)}</span>
                </div>
                <p className="text-gray-700 mb-3 line-clamp-2">{service.description}</p>
                <p className="text-pink-600 font-semibold">Reservar por WhatsApp &rarr;</p>
              </a>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/precios"
              className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Ver todos los servicios y precios
            </Link>
          </div>
        </div>
      </section>

      {SITE_IMAGES.catalog && (
        <section className="py-20 bg-white" aria-label="Catálogo de precios">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Catálogo de precios</h2>
            <p className="text-gray-600 mb-8">Consulta todos nuestros precios de un vistazo.</p>
            <Link to="/precios" className="block overflow-hidden rounded-lg border border-pink-200 shadow-lg transition hover:shadow-xl">
              <img
                src={SITE_IMAGES.catalog}
                alt={`Catálogo de precios de ${businessName}`}
                loading="lazy"
                className="max-h-[480px] w-full object-cover object-top"
              />
            </Link>
            <Link
              to="/precios"
              className="mt-6 inline-block rounded-lg bg-gradient-to-r from-pink-500 to-red-500 px-8 py-3 font-semibold text-white transition hover:shadow-lg"
            >
              Ver catálogo completo
            </Link>
          </div>
        </section>
      )}

    </div>
  );
}
