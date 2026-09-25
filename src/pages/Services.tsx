/**
 * Services.tsx — Página /servicios con todo el catálogo reservable.
 *
 * Cómo funciona: carga servicios de Supabase, los agrupa por categoría
 * (Manicura/Gel/Pedicura/Acrílico/Nail Art) con filtros, muestra la tabla
 * acrílica interactiva y abre un modal con detalle + botón Reservar.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { GridSkeleton } from '../components/Skeletons';
import AcrylicPriceTable from '../components/AcrylicPriceTable';
import PolicyBlocks from '../components/PolicyBlocks';
import { serviceService } from '../services/serviceService';
import type { Service } from '../types';
import { groupServicesByCategory, sortedCategoryKeys } from '../utils/catalog';
import { formatDuration, formatPrice } from '../utils/format';
import { useBusinessProfile } from '../contexts/BusinessProfileContext';

/** Catálogo por categorías con filtros, tabla acrílica y modal de detalle. */
export default function Services() {
  const { profile } = useBusinessProfile();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await serviceService.getServices();
        setServices(data);
      } catch (err) {
        console.error('Error loading services:', err);
        setError('No pudimos cargar los servicios. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    void loadServices();
  }, []);

  useEffect(() => {
    if (!selectedService) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedService(null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selectedService]);

  const grouped = useMemo(() => groupServicesByCategory(services), [services]);
  const categories = useMemo(() => ['Todos', ...sortedCategoryKeys(grouped)], [grouped]);

  const visibleGroups = useMemo(() => {
    if (activeCategory === 'Todos') return sortedCategoryKeys(grouped).map((k) => ({ key: k, items: grouped[k] }));
    if (activeCategory === 'Acrílico') return [];
    return grouped[activeCategory] ? [{ key: activeCategory, items: grouped[activeCategory] }] : [];
  }, [grouped, activeCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Nuestros Servicios</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hola mi amor. Precios oficiales en RD$, sin sorpresas. Solo con cita previa al
            829-338-8282. Incluye coffee bar de cortesía.
          </p>
          <Link to="/precios" className="mt-3 inline-block font-semibold text-purple-700 hover:text-purple-800">
            Ver catálogo completo con tabla acrílica #1-#8
          </Link>
        </div>

        {!loading && !error && services.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === c
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow'
                    : 'bg-white text-purple-700 border border-purple-200 hover:border-purple-400'
                }`}
              >
                {c}
              </button>
            ))}
            <button
              onClick={() => setActiveCategory('Acrílico')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeCategory === 'Acrílico'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow'
                  : 'bg-white text-purple-700 border border-purple-200 hover:border-purple-400'
              }`}
            >
              Acrílico interactivo
            </button>
          </div>
        )}

        {loading ? (
          <GridSkeleton count={4} />
        ) : error ? (
          <div className="mx-auto max-w-xl rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="mb-4 text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-red-600 px-6 py-2 font-semibold text-white transition hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        ) : services.length > 0 ? (
          <>
            {activeCategory === 'Acrílico' ? (
              <div className="rounded-2xl bg-white/70 border border-purple-100 p-4 sm:p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Elige tu largo #1-#8</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Precios oficiales. Toca un largo para ver los 6 estilos.
                </p>
                <AcrylicPriceTable services={services} />
              </div>
            ) : (
              <div className="space-y-10 mb-12">
                {visibleGroups.map(({ key, items }) => (
                  <section key={key} aria-label={`Servicios de ${key}`}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="inline-block h-6 w-1.5 rounded bg-gradient-to-b from-purple-500 to-pink-500" />
                      {key}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {items.map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          onClick={() => setSelectedService(service)}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
            <PolicyBlocks paymentDetails={profile.payment_details} />
          </>
        ) : (
          <p className="text-center text-gray-600">
            No hay servicios disponibles por el momento. Escríbenos por WhatsApp al 829-338-8282 y te
            ayudamos.
          </p>
        )}

        {selectedService && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedService(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`Detalles de ${selectedService.name}`}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-xl border border-purple-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{selectedService.name}</h2>
                  <p className="mt-1 text-xl font-bold text-pink-600">
                    {formatPrice(selectedService.price)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  aria-label="Cerrar detalles"
                  className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Descripción</h3>
                <p className="text-gray-700 leading-relaxed">{selectedService.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Categoría</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedService.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duración</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDuration(selectedService.duration_minutes)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Precio</p>
                  <p className="text-lg font-semibold text-pink-600">
                    {formatPrice(selectedService.price)}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-4">
                Incluye coffee bar de cortesía · Solo con cita previa · Tolerancia 15 min ·
                Cancela sin costo 24h antes.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setSelectedService(null)}
                  className="flex-1 rounded-lg border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
                >
                  Cerrar
                </button>
                <Link
                  to="/reserva"
                  state={{ serviceId: selectedService.id }}
                  className="flex-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-center font-semibold text-white transition hover:shadow-lg"
                >
                  Reservar este servicio
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
