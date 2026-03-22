import { Clock, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useBusinessProfile } from '../contexts/BusinessProfileContext';

const DEFAULT_PHONE = '+1 829 338 8282';

const toWhatsappUrl = (value: string | null): string | null => {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;

  const digits = value.replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}`;
};

export default function Footer() {
  const { profile } = useBusinessProfile();

  const businessName = profile.business_name || 'Maria Nails';
  const footerDescription = profile.footer_description || 'Manicura, pedicura y unas acrilicas con atencion profesional.';
  const addressLine1 = profile.address_line_1 || 'Direccion no configurada';
  const addressLine2 = profile.address_line_2 || '';
  const phone = profile.contact_phone || DEFAULT_PHONE;
  const mapsUrl = profile.maps_url;
  const instagramUrl = profile.instagram_url;
  const whatsappUrl = toWhatsappUrl(profile.contact_whatsapp || profile.contact_phone);

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{businessName}</h3>
            <p className="text-gray-400">{footerDescription}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Ubicacion</h3>
            <div className="flex items-start space-x-3 mb-4">
              <MapPin className="w-5 h-5 text-pink-500 flex-shrink-0 mt-1" />
              <div>
                <p className="text-gray-300 text-sm">{addressLine1}</p>
                {addressLine2 && <p className="text-gray-400 text-sm">{addressLine2}</p>}
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
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-pink-500" />
                <span className="text-gray-300">{phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-pink-500" />
                <div className="text-gray-300 text-sm">
                  <p>Lun-Sab: 9am - 6pm</p>
                  <p className="text-gray-400">Cerrado Dom y Mar</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2026 {businessName}. Todos los derechos reservados.</p>
            <div className="flex space-x-4">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-400 transition"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-400 transition"
                >
                  <MessageCircle className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
