/**
 * Services.tsx — Página /servicios con todo el catálogo reservable.
 *
 * Cómo funciona: carga servicios de Supabase y los muestra con buscador,
 * filtro por categoría y orden (precio, duración, nombre). La tabla
 * acrílica interactiva vive en su propia pestaña y abre un modal con
 * detalle + botón Reservar.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { GridSkeleton } from '../components/Skeletons';
import AcrylicPriceTable from '../components/AcrylicPriceTable';
import PolicyBlocks from '../components/PolicyBlocks';
import { serviceService } from '../services/serviceService';
import type { Service } from '../types';
import { groupServicesByCategory, sortedCategoryKeys } from '../utils/catalog';
import { formatDuration, formatPrice } from '../utils/format';
import { useBusinessProfile } from '../contexts/BusinessProfileContext';

/** Clave especial para la vista interactiva (distinta de la categoría "Acrílico" de la BD). */
const INTERACTIVE_KEY = 'Acrílico interactivo';

/** Opciones de orden para la lista filtrada. */
type SortKey = 'orden' | 'precio-asc' | 'precio-desc' | 'duracion' | 'nombre';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'orden', label: 'Orden del salón' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
  { value: 'duracion', label: 'Duración más corta' },
  { value: 'nombre', label: 'Nombre A-Z' },
];

/** Compara dos servicios según la opción de orden elegida. */
function compareServices(a: Service, b: Service, sort: SortKey): number {
  if (sort === 'precio-asc') return a.price - b.price;
  if (sort === 'precio-desc') return b.price - a.price;
  if (sort === 'duracion') return a.duration_minutes - b.duration_minutes;
  if (sort === 'nombre') return a.name.localeCompare(b.name, 'es');
  return 0;
}

/** Catálogo con buscador, filtros por categoría, orden y modal de detalle. */
export default function Services() {
  const { profile } = useBusinessProfile();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('orden');

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

  const hasFilters = query.trim() !== '' || activeCategory !== 'Todos' || sort !== 'orden';

  const clearFilters = () => {
    setQuery('');
    setActiveCategory('Todos');
    setSort('orden');
  };

  const visibleGroups = useMemo(() => {
    if (activeCategory === INTERACTIVE_KEY) return [];
    const q = query.trim().toLowerCase();
    let list = services;
    if (activeCategory !== 'Todos') {
      list = list.filter((s) => s.category === activeCategory);
    }
    if (q) {
      list = list.filter((s) =>
        `${s.name} ${s.description} ${s.category}`.toLowerCase().includes(q),
      );
    }
    const sorted = [...list].sort((a, b) => compareServices(a, b, sort));
    const g = groupServicesByCategory(sorted);
    return sortedCategoryKeys(g).map((k) => ({ key: k, items: g[k] }));
  }, [services, activeCategory, query, sort]);

  const totalVisible = visibleGroups.reduce((acc, g) => acc + g.items.length, 0);

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
          <div className="mb-8 rounded-2xl border border-purple-100 bg-white/80 p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <label className="relative flex-1">
                <span className="sr-only">Buscar servicio</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar: manicura, gel, pedicura, acrílico..."
                  className="w-full rounded-full border border-purple-200 bg-white py-2 pl-9 pr-9 text-sm outline-none placeholder:text-gray-400 focus:border-purple-400"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Limpiar búsqueda"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <span className="whitespace-nowrap font-medium">Ordenar:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="rounded-full border border-purple-200 bg-white px-3 py-2 text-sm font-medium text-purple-800 outline-none focus:border-purple-400"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por categoría">
              {categories.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={activeCategory === c}
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
                role="tab"
                aria-selected={activeCategory === INTERACTIVE_KEY}
                onClick={() => setActiveCategory(INTERACTIVE_KEY)}
                title="Compara los 6 estilos acrílicos por largo #1-#8"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === INTERACTIVE_KEY
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow'
                    : 'bg-white text-purple-700 border border-dashed border-purple-300 hover:border-purple-400'
                }`}
              >
                Acrílico interactivo #1-#8
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
              <p aria-live="polite">
                {activeCategory === INTERACTIVE_KEY
                  ? 'Tabla interactiva de acrílico con 48 precios oficiales.'
                  : `${totalVisible} servicio${totalVisible === 1 ? '' : 's'} ${hasFilters ? 'con estos filtros' : 'en total'}`}
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-semibold text-purple-700 underline hover:text-purple-900"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
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
            {activeCategory === INTERACTIVE_KEY ? (
              <div className="rounded-2xl bg-white/70 border border-purple-100 p-4 sm:p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Elige tu largo #1-#8</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Precios oficiales. Toca un largo para ver los 6 estilos.
                </p>
                <AcrylicPriceTable services={services} />
              </div>
            ) : totalVisible === 0 ? (
              <div className="rounded-2xl border border-purple-100 bg-white p-8 text-center">
                <p className="text-lg font-semibold text-gray-900">No encontramos servicios con esos filtros</p>
                <p className="mt-1 text-sm text-gray-600">
                  Prueba con otra palabra o limpia los filtros para ver todo el catálogo.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 font-semibold text-white"
                >
                  Ver todos los servicios
                </button>
              </div>
            ) : (
              <div className="space-y-10 mb-12">
                {visibleGroups.map(({ key, items }) => (
                  <section key={key} aria-label={`Servicios de ${key}`}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="inline-block h-6 w-1.5 rounded bg-gradient-to-b from-purple-500 to-pink-500" />
                      {key}
                      <span className="text-sm font-medium text-gray-500">({items.length})</span>
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
