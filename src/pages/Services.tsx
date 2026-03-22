import { useEffect, useState } from 'react';
import ServiceCard from '../components/ServiceCard';
import { serviceService } from '../services/serviceService';
import type { Service } from '../types';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await serviceService.getServices();
        setServices(data);
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setLoading(false);
      }
    };

    void loadServices();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Servicios</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ofrecemos una amplia variedad de servicios profesionales para el cuidado y embellecimiento de tus unas.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Cargando servicios...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} onClick={() => setSelectedService(service)} />
            ))}
          </div>
        )}

        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-8 shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-gray-900">{selectedService.name}</h2>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  x
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">Descripcion</h3>
                <p className="text-gray-700 leading-relaxed">{selectedService.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Categoria</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedService.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duracion</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedService.duration_minutes} min</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedService(null)}
                className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
