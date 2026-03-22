import { Award, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBusinessProfile } from '../contexts/BusinessProfileContext';

export default function Home() {
  const { profile } = useBusinessProfile();

  const businessName = profile.business_name || 'Maria Nails';
  const heroTitle = profile.hero_title || `Bienvenida a ${businessName}`;
  const heroSubtitle =
    profile.hero_subtitle ||
    'Especialista en manicura, pedicura y unas acrilicas con atencion profesional y experiencia.';
  const aboutTitle = profile.about_title || 'Sobre Maria';
  const aboutDescription =
    profile.about_description ||
    'Tecnica en unas con experiencia dedicada a realzar la belleza de tus manos y pies.';

  const aboutParagraphs = aboutDescription
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-pink-50 to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{heroTitle}</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">{heroSubtitle}</p>
          <Link
            to="/reserva"
            className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition text-lg"
          >
            <Calendar className="w-5 h-5" />
            <span>Reserva tu cita</span>
          </Link>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Por que elegir {businessName}</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-pink-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Experiencia profesional</h4>
              <p className="text-gray-600">Tecnica profesional con amplia trayectoria en el arte de las unas.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-pink-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Calidad premium</h4>
              <p className="text-gray-600">Productos de primera calidad y tecnicas modernas.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-pink-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Reservas faciles</h4>
              <p className="text-gray-600">Sistema de reservas en linea para tu comodidad.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-pink-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{aboutTitle}</h3>
              {aboutParagraphs.length > 0 ? (
                aboutParagraphs.map((paragraph) => (
                  <p key={paragraph} className="text-gray-700 mb-4 leading-relaxed">
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
                Conoce mas &rarr;
              </Link>
            </div>
            {profile.profile_image_url ? (
              <img
                src={profile.profile_image_url}
                alt={`${aboutTitle} foto`}
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
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Nuestros Servicios</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-lg p-6 border border-pink-200">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Sistema de Acrilico</h4>
              <p className="text-gray-700 mb-3">Extensiones resistentes y duraderas con acabado perfecto.</p>
              <p className="text-pink-600 font-semibold">Consultar precio</p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-lg p-6 border border-pink-200">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Sistema de Gel</h4>
              <p className="text-gray-700 mb-3">Brillo intenso y mayor resistencia. Ideal para un look elegante.</p>
              <p className="text-pink-600 font-semibold">Consultar precio</p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-lg p-6 border border-pink-200">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Manicura</h4>
              <p className="text-gray-700 mb-3">Cuidado completo de manos con esmaltado profesional.</p>
              <p className="text-pink-600 font-semibold">Consultar precio</p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-lg p-6 border border-pink-200">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Pedicura</h4>
              <p className="text-gray-700 mb-3">Tratamiento spa con exfoliacion, masaje y esmaltado.</p>
              <p className="text-pink-600 font-semibold">Consultar precio</p>
            </div>
          </div>
          <div className="text-center">
            <Link
              to="/servicios"
              className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Ver todos los servicios
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
