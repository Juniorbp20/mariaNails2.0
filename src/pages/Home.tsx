import { useEffect, useState } from 'react';
import { Award, Calendar, MapPin, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBusinessProfile } from '../contexts/BusinessProfileContext';
import { serviceService } from '../services/serviceService';
import type { Service } from '../types';
import { formatPrice } from '../utils/format';

const TESTIMONIALS = [
  {
    name: 'Carolina M.',
    text: 'El mejor servicio de uñas que he probado. Mis acrílicas duraron perfectas por semanas. ¡Volveré siempre!',
    rating: 5,
  },
  {
    name: 'Yohanna P.',
    text: 'Reservé en línea en menos de un minuto y me atendieron puntual. La pedicura spa es increíble.',
    rating: 5,
  },
  {
    name: 'Daniela R.',
    text: 'Diseños preciosos y atención muy profesional. Se nota la experiencia y la calidad de los productos.',
    rating: 5,
  },
];

export default function Home() {
  const { profile } = useBusinessProfile();
  const [services, setServices] = useState<Service[]>([]);

  const businessName = profile.business_name || 'María Nails';
  const heroTitle = profile.hero_title || `Bienvenida a ${businessName}`;
  const heroSubtitle =
    profile.hero_subtitle ||
    'Especialista en manicura, pedicura y uñas acrílicas con atención profesional y experiencia.';
  const aboutTitle = profile.about_title || 'Sobre María';
  const aboutDescription =
    profile.about_description ||
    'Técnica en uñas con experiencia, dedicada a realzar la belleza de tus manos y pies.';

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
            ✨ Reserva en línea · Confirmación inmediata
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{heroTitle}</h1>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">{heroSubtitle}</p>
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
              <p className="text-gray-600">Técnica profesional con amplia trayectoria en el arte de las uñas.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-pink-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Calidad premium</h3>
              <p className="text-gray-600">Productos de primera calidad y técnicas modernas.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-pink-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Reservas fáciles</h3>
              <p className="text-gray-600">Sistema de reservas en línea disponible 24/7 para tu comodidad.</p>
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
                className="rounded-lg h-96 w-full object-cover border border-pink-200"
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
          <p className="text-center text-gray-600 mb-12">Precios claros, sin sorpresas. Elige y reserva en segundos.</p>
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
                  { name: 'Sistema de Acrílico', desc: 'Extensiones resistentes y duraderas con acabado perfecto.' },
                  { name: 'Sistema de Gel', desc: 'Brillo intenso y mayor resistencia. Ideal para un look elegante.' },
                  { name: 'Manicura', desc: 'Cuidado completo de manos con esmaltado profesional.' },
                  { name: 'Pedicura', desc: 'Tratamiento spa con exfoliación, masaje y esmaltado.' },
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

      <section className="py-20 bg-gray-50" aria-label="Opiniones de clientas">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Lo que dicen nuestras clientas</h2>
          <p className="text-center text-gray-600 mb-12">La confianza se gana trabajo a trabajo.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-3 flex gap-1" aria-label={`${t.rating} estrellas`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="mb-4 text-gray-700 leading-relaxed">“{t.text}”</blockquote>
                <figcaption className="font-semibold text-gray-900">— {t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-pink-600 to-red-500 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="mb-3 text-3xl font-bold text-white">¿Lista para unas uñas perfectas?</h2>
          <p className="mb-8 text-pink-100">Elige tu servicio, fecha y hora. Te tomará menos de 2 minutos.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/reserva"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-pink-700 transition hover:shadow-xl"
            >
              Reservar ahora
            </Link>
            {profile.address_line_1 && (
              <span className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-pink-100">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {profile.address_line_1}
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
