/**
 * Gallery.tsx — Página /galeria como puente a Instagram.
 *
 * Ya no usa base de datos: las fotos viven en Instagram.
 * Muestra qué verán ahí y un CTA grande para abrir el perfil.
 * Para cambiar el destino edita BUSINESS_INFO.instagramUrl en officialCatalog.ts.
 */
import { Camera, Heart, Instagram, Sparkles } from 'lucide-react';
import { BUSINESS_INFO } from '../data/officialCatalog';
import { waLink } from '../data/whatsappTemplates';

/** Galería estática: redirige a Instagram, sin Supabase ni paginación. */
export default function Gallery() {
  const instagramUrl = BUSINESS_INFO.instagramUrl;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-pink-500 to-purple-600 text-white shadow-lg">
          <Instagram className="h-8 w-8" aria-hidden="true" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Galería de Trabajos</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
          Todos nuestros trabajos más recientes, diseños de acrílico #1-#8, manicura, gel,
          pedicura spa y Nail Art están publicados en nuestro Instagram.
        </p>
        <p className="text-sm text-gray-500 max-w-xl mx-auto mb-10">
          Ahí puedes ver fotos y videos actualizados, guardar tus favoritos y traerlos
          como referencia a tu cita.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-10 text-left">
          <div className="rounded-xl border border-pink-200 bg-gradient-to-br from-pink-50 to-red-50 p-5">
            <Camera className="h-6 w-6 text-pink-600 mb-2" aria-hidden="true" />
            <h2 className="font-bold text-gray-900 mb-1">Trabajos reales</h2>
            <p className="text-sm text-gray-600">Fotos de clientas, sin filtros exagerados.</p>
          </div>
          <div className="rounded-xl border border-pink-200 bg-gradient-to-br from-pink-50 to-red-50 p-5">
            <Sparkles className="h-6 w-6 text-pink-600 mb-2" aria-hidden="true" />
            <h2 className="font-bold text-gray-900 mb-1">Ideas por estilo</h2>
            <p className="text-sm text-gray-600">Cover, French, Baby Boomer, Full Set y más.</p>
          </div>
          <div className="rounded-xl border border-pink-200 bg-gradient-to-br from-pink-50 to-red-50 p-5">
            <Heart className="h-6 w-6 text-pink-600 mb-2" aria-hidden="true" />
            <h2 className="font-bold text-gray-900 mb-1">Guarda tu favorito</h2>
            <p className="text-sm text-gray-600">Tráelo a tu cita y lo recreamos para ti.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-white font-semibold text-lg shadow-lg transition hover:shadow-xl hover:-translate-y-0.5"
          >
            <Instagram className="w-5 h-5" aria-hidden="true" />
            <span>Ver trabajos en Instagram</span>
          </a>
          <a
            href={waLink(
              'Hola María. Vi sus trabajos en Instagram y quiero reservar mi cita. Mi nombre es: ___. Mi referencia es: ___. ¡Gracias!',
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 bg-white text-pink-700 rounded-lg font-semibold border border-pink-200 hover:shadow transition text-lg"
          >
            Reservar por WhatsApp
          </a>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          ¿No tienes Instagram? Escríbenos por WhatsApp al {BUSINESS_INFO.phoneDisplay} y te
          enviamos fotos de referencia.
        </p>
      </div>
    </div>
  );
}
