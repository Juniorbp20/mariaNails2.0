import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { GridSkeleton } from '../components/Skeletons';
import { serviceService } from '../services/serviceService';
import type { Service } from '../types';
import { formatDuration, formatPrice } from '../utils/format';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Servicios</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ofrecemos una amplia variedad de servicios profesionales para el cuidado y embellecimiento de tus uñas.
          </p>
        </div>

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
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} onClick={() => setSelectedService(service)} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">
            No hay servicios disponibles por el momento. Escríbenos por WhatsApp y te ayudamos.
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
              className="bg-white rounded-lg max-w-2xl w-full p-8 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{selectedService.name}</h2>
                  <p className="mt-1 text-xl font-bold text-pink-600">{formatPrice(selectedService.price)}</p>
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
                  <p className="text-lg font-semibold text-gray-900">{formatDuration(selectedService.duration_minutes)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Precio</p>
                  <p className="text-lg font-semibold text-pink-600">{formatPrice(selectedService.price)}</p>
                </div>
              </div>

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
                  className="flex-1 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 px-6 py-3 text-center font-semibold text-white transition hover:shadow-lg"
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
