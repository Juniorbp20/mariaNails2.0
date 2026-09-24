/**
 * PriceCatalog.tsx — Página /precios con precios oficiales en RD$.
 *
 * Tabs: Manicura, Gel y Pedicura, Acrílico #1-#8 (interactivo), Nail Art
 * y Cortesías/Políticas. Si la admin subió una imagen de catálogo se muestra
 * arriba; si la BD está vacía usa los precios oficiales locales.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BadgeDollarSign, Calendar } from 'lucide-react';
import { useBusinessProfile } from '../contexts/BusinessProfileContext';
import { serviceService } from '../services/serviceService';
import type { Service } from '../types';
import { toWhatsAppUrl, formatPrice, formatDuration } from '../utils/format';
import { OFFICIAL_SERVICES } from '../data/officialCatalog';
import { WHATSAPP_TEMPLATES, waLink } from '../data/whatsappTemplates';
import AcrylicPriceTable from '../components/AcrylicPriceTable';
import PolicyBlocks from '../components/PolicyBlocks';

/** Claves de las 5 pestañas del catálogo. */
type TabKey = 'manicura' | 'gel' | 'acrilico' | 'nailart' | 'info';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'manicura', label: 'Manicura' },
  { key: 'gel', label: 'Gel y Pedicura' },
  { key: 'acrilico', label: 'Acrílico #1-#8' },
  { key: 'nailart', label: 'Nail Art' },
  { key: 'info', label: 'Cortesías y Políticas ☕' },
];

/** Convierte los precios oficiales en servicios ficticios si la BD viene vacía. */
function toServiceLike(): Service[] {
  const now = new Date().toISOString();
  return OFFICIAL_SERVICES.map((s, i) => ({
    id: `official-${i}`,
    name: s.name,
    description: s.description,
    duration_minutes: s.duration_minutes,
    price: s.price,
    category: s.category,
    active: true,
    created_at: now,
    updated_at: now,
  }));
}

/** Catálogo oficial por pestañas con reserva directa o por WhatsApp. */
export default function PriceCatalog() {
  const { profile, loading: profileLoading } = useBusinessProfile();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>('manicura');

  const businessName = profile.business_name || 'Maria Nails Studio & Pedicure';
  const catalogUrl = profile.price_catalog_url;
  const whatsappUrl = toWhatsAppUrl(profile.contact_whatsapp || profile.contact_phone);

  useEffect(() => {
    let mounted = true;
    serviceService
      .getServices()
      .then((data) => {
        if (!mounted) return;
        setServices(data.length > 0 ? data : toServiceLike());
      })
      .catch(() => {
        if (mounted) setServices(toServiceLike());
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const manicura = useMemo(
    () => services.filter((s) => s.category === 'Manicura'),
    [services],
  );
  const gelPedi = useMemo(
    () => services.filter((s) => s.category === 'Gel' || s.category === 'Pedicura'),
    [services],
  );
  const nailArt = useMemo(
    () => services.filter((s) => s.category === 'Nail Art'),
    [services],
  );

  const renderServiceCards = (list: Service[], emptyHint: string) => {
    if (loading) {
      return <div className="h-32 animate-pulse rounded-xl bg-purple-100" aria-label="Cargando servicios" />;
    }
    if (list.length === 0) return <p className="text-gray-600">{emptyHint}</p>;
    return (
      <div className="grid md:grid-cols-2 gap-4">
        {list.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-purple-200 bg-white p-5 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-bold text-gray-900">{s.name}</h3>
              <span className="whitespace-nowrap font-bold text-pink-600">
                {formatPrice(s.price)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{s.description}</p>
            <p className="text-xs text-gray-500 mb-3">{formatDuration(s.duration_minutes)}</p>
            <div className="flex gap-2">
              {s.id.startsWith('official-') ? (
                <a
                  href={waLink(`Hola María. Quiero reservar: ${s.name} (${formatPrice(s.price)}). Mi nombre es: ___.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Reservar por WhatsApp
                </a>
              ) : (
                <Link
                  to="/reserva"
                  state={{ serviceId: s.id }}
                  className="flex-1 text-center rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Reservar
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100">
            <BadgeDollarSign className="h-7 w-7 text-purple-600" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Catálogo de precios</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {businessName} · Belleza en tus manos y pies · Precios oficiales en RD$, sin sorpresas.
          </p>
          {catalogUrl && (
            <figure className="mt-6 overflow-hidden rounded-2xl border border-purple-200 shadow-lg">
              <img
                src={catalogUrl}
                alt={`Catálogo de precios de ${businessName}`}
                className="w-full object-contain"
                loading="lazy"
              />
            </figure>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8" role="tablist" aria-label="Categorías del catálogo">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-full px-5 py-2 font-semibold transition ${
                tab === t.key
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white text-purple-700 border border-purple-200 hover:border-purple-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-white/70 border border-purple-100 p-4 sm:p-6 shadow-sm">
          {tab === 'manicura' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Manicura clásica y cuidado</h2>
              <p className="text-gray-600 mb-5 text-sm">
                Hola mi amor. Elige tu manicura ideal. Todas incluyen hidratación de cutícula.
              </p>
              {renderServiceCards(manicura, 'Pronto publicamos la manicura oficial. Escríbenos por WhatsApp.')}
            </div>
          )}

          {tab === 'gel' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Sistemas en gel y pedicura spa</h2>
              <p className="text-gray-600 mb-5 text-sm">
                Brillo duradero y pedicura de 3 horas con máxima relajación + coffee bar ☕.
              </p>
              {renderServiceCards(gelPedi, 'Pronto publicamos gel y pedicura. Escríbenos por WhatsApp.')}
            </div>
          )}

          {tab === 'acrilico' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Sistema en acrílico por largo #1 al #8</h2>
              <p className="text-gray-600 mb-5 text-sm">
                Selecciona tu largo y compara los 6 estilos. Precios oficiales en RD$.
              </p>
              <AcrylicPriceTable services={services} />
            </div>
          )}

          {tab === 'nailart' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Nail Art & Decoración</h2>
              <p className="text-gray-600 mb-5 text-sm">
                Mano alzada, stickers, 3D, pedrería y gel sólido. Trae fotos de referencia para cotizar.
              </p>
              {renderServiceCards(nailArt, 'Nail Art se cotiza con fotos de referencia.')}
              <a
                href={waLink(WHATSAPP_TEMPLATES.nailArt)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white"
              >
                Enviar mis referencias por WhatsApp
              </a>
            </div>
          )}

          {tab === 'info' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Cortesías, ubicación y políticas</h2>
              <p className="text-gray-600 mb-2 text-sm">
                Todo lo que disfrutas en tu cita, mi amor.
              </p>
              <PolicyBlocks paymentDetails={profile.payment_details} />
            </div>
          )}
        </div>

        <div className="mt-10 text-center space-y-3">
          <Link
            to="/reserva"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 font-semibold text-white transition hover:shadow-lg"
          >
            <Calendar className="h-5 w-5" aria-hidden="true" />
            Reservar mi cita
          </Link>
          <div>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-purple-700 hover:text-purple-800"
              >
                ¿Dudas? Escríbenos al 829-338-8282 por WhatsApp
              </a>
            )}
          </div>
          {profileLoading && <p className="text-xs text-gray-500">Cargando perfil del negocio…</p>}
        </div>
      </div>
    </div>
  );
}
