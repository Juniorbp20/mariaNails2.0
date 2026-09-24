import { useEffect, useState } from 'react';
import { Award, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBusinessProfile } from '../contexts/BusinessProfileContext';
import { serviceService } from '../services/serviceService';
import type { Service } from '../types';
import { formatPrice } from '../utils/format';
import { BUSINESS_INFO, COURTESIES } from '../data/officialCatalog';

export default function Home() {
  const { profile } = useBusinessProfile();
  const [services, setServices] = useState<Service[]>([]);

  const businessName = profile.business_name || BUSINESS_INFO.name;
  const heroTitle = profile.hero_title || `Bienvenida a ${businessName}`;
  const heroSubtitle =
    profile.hero_subtitle ||
    'Manicurista profesional: manicura, gel, pedicura spa y acrílico del #1 al #8. Solo con cita previa.';
  const aboutTitle = profile.about_title || 'Sobre María Bonifacio';
  const aboutDescription =
    profile.about_description ||
    'Soy María Bonifacio, técnica en manicura completa y pedicura.';

  const aboutParagraphs = aboutDescription
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  useEffect(() => {
    serviceService
      .getServices()
      .then((data) => setServices(data.slice(0, 4)))
      .catch((err) => console.error('Error loading home services:', err));
  }, []);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-pink-50 to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-3 inline-block rounded-full bg-white/70 px-4 py-1 text-sm font-medium text-pink-700 border border-pink-200">
            ✨ Reserva en línea · Solo con cita previa · {BUSINESS_INFO.phoneDisplay}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{heroTitle}</h1>
          <p className="text-lg text-gray-700 mb-4 max-w-2xl mx-auto">{heroSubtitle}</p>
          <p className="text-sm text-purple-700 mb-8">
            ☕ Coffee bar de cortesía: {COURTESIES.join(' · ')} · 📍 {BUSINESS_INFO.addressLine1}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/reserva"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition text-lg"
            >
              <Calendar className="w-5 h-5" aria-hidden="true" />
              <span>Reserva tu cita</span>
            </Link>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{aboutTitle}</h2>
              {aboutParagraphs.length > 0 ? (
                aboutParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="text-gray-700 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-gray-700 mb-4 leading-relaxed">{aboutDescription}</p>
              )}
              <Link
                to="/sobre-mi"
                className="inline-block px-6 py-2 bg-white text-pink-600 font-semibold rounded-lg hover:shadow-lg transition border border-pink-200"
              >
                Conoce más &rarr;
              </Link>
            </div>
            {profile.profile_image_url ? (
              <img
                src={profile.profile_image_url}
                alt={`${aboutTitle} — técnica de uñas`}
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
            Manicura desde RD$250 · Gel desde RD$450 · Pedicura RD$1,234 · Acrílico #1-#8 ·{' '}
            <a href="/precios" className="font-semibold underline">Ver tabla completa</a>
          </p>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {services.length > 0
              ? services.map((service) => (
                  <Link
                    key={service.id}
                    to="/reserva"
                    state={{ serviceId: service.id }}
                    className="group bg-gradient-to-br from-pink-50 to-red-50 rounded-lg p-6 border border-pink-200 transition hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-pink-700">{service.name}</h3>
                      <span className="whitespace-nowrap font-bold text-pink-600">{formatPrice(service.price)}</span>
                    </div>
                    <p className="text-gray-700 mb-3 line-clamp-2">{service.description}</p>
                    <p className="text-pink-600 font-semibold">Reservar &rarr;</p>
                  </Link>
                ))
              : [
                  { name: 'Manicura en Seco desde RD$250', desc: 'Retiro de cutículas con drill + hidratación.' },
                  { name: 'Pedicura completa RD$1,234', desc: '3 horas spa con exfoliación y coffee bar.' },
                  { name: 'Acrílico #1-#8', desc: '6 estilos: Pintura, Cover, French, Gel, Baby Boomer, Full Set.' },
                  { name: 'Sistemas en Gel desde RD$1,234', desc: 'Rubber, Acry y Builder Gel de larga duración.' },
                ].map((s) => (
                  <div key={s.name} className="bg-gradient-to-br from-pink-50 to-red-50 rounded-lg p-6 border border-pink-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{s.name}</h3>
                    <p className="text-gray-700 mb-3">{s.desc}</p>
                    <p className="text-pink-600 font-semibold">Servicio personalizado</p>
                  </div>
                ))}
          </div>
          <div className="text-center">
            <Link
              to="/servicios"
              className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Ver todos los servicios y precios
            </Link>
          </div>
        </div>
      </section>

      {profile.price_catalog_url && (
        <section className="py-20 bg-white" aria-label="Catálogo de precios">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Catálogo de precios</h2>
            <p className="text-gray-600 mb-8">Consulta todos nuestros precios de un vistazo.</p>
            <Link to="/precios" className="block overflow-hidden rounded-lg border border-pink-200 shadow-lg transition hover:shadow-xl">
              <img
                src={profile.price_catalog_url}
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
