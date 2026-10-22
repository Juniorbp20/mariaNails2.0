/**
 * About.tsx — Página /sobre-mi de María Bonifacio.
 *
 * 100% estática: todo desde officialCatalog.ts, sin base de datos.
 * Foto de perfil: coloca el archivo en `public/images/` y apunta
 * SITE_IMAGES.profile a `/images/tu-foto.jpg`. Si es null, no se muestra imagen.
 */
import { Heart, Users, Zap } from 'lucide-react';
import { BUSINESS_INFO, COURTESIES, SITE_IMAGES, STATIC_PROFILE } from '../data/officialCatalog';

/** Perfil de María + valores + tarjeta de contacto del salón. */
export default function About() {
  const businessName = BUSINESS_INFO.name;
  const paragraphs = STATIC_PROFILE.aboutDescription
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{STATIC_PROFILE.aboutTitle}</h1>

        {SITE_IMAGES.profile && (
          <img
            src={SITE_IMAGES.profile}
            srcSet={`${SITE_IMAGES.profileSmall} 480w, ${SITE_IMAGES.profile} 809w`}
            sizes="(min-width: 896px) 896px, 100vw"
            alt={`${STATIC_PROFILE.aboutTitle} — técnica de uñas en ${businessName}`}
            width={809}
            height={1080}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="w-full h-auto max-h-[520px] object-contain rounded-lg border border-pink-200 bg-pink-50 mb-8"
          />
        )}

        <div className="mb-12 p-8 bg-gradient-to-br from-pink-50 to-red-50 rounded-lg border border-pink-200 space-y-4">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="text-xl text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Experiencia</h2>
            <p className="text-gray-700">Formación continua y trabajo profesional para cada clienta.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Pasión</h2>
            <p className="text-gray-700">Atención dedicada y cuidado en cada detalle de tu servicio.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Comunidad</h2>
            <p className="text-gray-700">Clientas satisfechas que confían en {businessName} cada semana.</p>
          </div>
        </div>

        <section aria-label="Contacto del salón">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contacto del salón</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-8 space-y-3">
            <p className="text-gray-700">Profesional: {BUSINESS_INFO.professional} — {BUSINESS_INFO.professionalTitle}</p>
            <p className="text-gray-700">WhatsApp citas: {BUSINESS_INFO.phoneDisplay}</p>
            {BUSINESS_INFO.contactEmail && <p className="text-gray-700">Email: {BUSINESS_INFO.contactEmail}</p>}
            <p className="text-gray-700">
              Dirección: {BUSINESS_INFO.addressLine1}, {BUSINESS_INFO.addressLine2}
            </p>
            <p className="text-gray-700">Modalidad: {BUSINESS_INFO.modality}</p>
            <p className="text-gray-700">Cortesías: {COURTESIES.join(', ')}</p>
            <p className="text-gray-700">Pagos: {STATIC_PROFILE.paymentDetails}</p>
            {BUSINESS_INFO.mapsUrl && (
              <a
                href={BUSINESS_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-semibold text-pink-600 hover:text-pink-700"
              >
                Cómo llegar en Google Maps &rarr;
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
