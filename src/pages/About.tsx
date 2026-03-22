import { Heart, Users, Zap } from 'lucide-react';
import { useBusinessProfile } from '../contexts/BusinessProfileContext';

export default function About() {
  const { profile } = useBusinessProfile();

  const businessName = profile.business_name || 'Maria Nails';
  const aboutTitle = profile.about_title || 'Sobre Maria';
  const aboutDescription =
    profile.about_description ||
    'Tecnica en unas con experiencia dedicada a ofrecer servicios personalizados y profesionales.';

  const paragraphs = aboutDescription
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{aboutTitle}</h1>

        {profile.profile_image_url && (
          <img
            src={profile.profile_image_url}
            alt={`${aboutTitle} foto`}
            className="w-full h-80 object-cover rounded-lg border border-pink-200 mb-8"
          />
        )}

        <div className="mb-12 p-8 bg-gradient-to-br from-pink-50 to-red-50 rounded-lg border border-pink-200 space-y-4">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-xl text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-xl text-gray-700 leading-relaxed">{aboutDescription}</p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Experiencia</h3>
            <p className="text-gray-700">Formacion continua y trabajo profesional para cada cliente.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Pasion</h3>
            <p className="text-gray-700">Atencion dedicada y cuidado en cada detalle de tu servicio.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Comunidad</h3>
            <p className="text-gray-700">Clientes satisfechas que confian en {businessName} cada semana.</p>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contacto del salon</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-8 space-y-3">
            {profile.contact_phone && <p className="text-gray-700">Telefono: {profile.contact_phone}</p>}
            {profile.contact_email && <p className="text-gray-700">Email: {profile.contact_email}</p>}
            {profile.address_line_1 && <p className="text-gray-700">Direccion: {profile.address_line_1}</p>}
            {profile.address_line_2 && <p className="text-gray-700">{profile.address_line_2}</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
