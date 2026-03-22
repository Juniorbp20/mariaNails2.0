import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import Calendar from '../components/Calendar';
import TimeSlots from '../components/TimeSlots';
import { availabilityService } from '../services/availabilityService';
import { appointmentService } from '../services/appointmentService';
import { serviceService } from '../services/serviceService';
import type { BookingFormData, Service } from '../types';
import { parseLocalDateString } from '../utils/dateUtils';

type BookingStep = 'service' | 'date' | 'time' | 'contact' | 'confirmation';

export default function Booking() {
  const [step, setStep] = useState<BookingStep>('service');
  const [services, setServices] = useState<Service[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmationData, setConfirmationData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesData, blockedDatesData] = await Promise.all([
          serviceService.getServices(),
          availabilityService.getBlockedDates(),
        ]);
        setServices(servicesData);
        setBlockedDates(blockedDatesData.map((d) => d.blocked_date));
      } catch (err) {
        setError('Error cargando datos. Intenta de nuevo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, []);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep('date');
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('contact');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (!selectedService || !selectedDate || !selectedTime) {
        throw new Error('Faltan datos requeridos.');
      }

      const hasEmail = formData.client_email.trim().length > 0;
      const hasPhone = formData.client_phone.trim().length > 0;
      if (!hasEmail && !hasPhone) {
        throw new Error('Debes ingresar al menos correo o telefono.');
      }

      const bookingData: BookingFormData = {
        service_id: selectedService.id,
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
      };

      const appointment = await appointmentService.createAppointment(bookingData);
      setConfirmationData({
        ...appointment,
        service: selectedService,
      });
      setStep('confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la cita.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewBooking = () => {
    setStep('service');
    setSelectedService(null);
    setSelectedDate('');
    setSelectedTime('');
    setFormData({ client_name: '', client_email: '', client_phone: '' });
    setConfirmationData(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Cargando informacion...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">Reserva tu cita</h1>

        <div className="mb-12 bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            {(['service', 'date', 'time', 'contact', 'confirmation'] as BookingStep[]).map((s, index) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                    step === s
                      ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                      : ['service', 'date', 'time', 'contact', 'confirmation'].indexOf(step) > index
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {['service', 'date', 'time', 'contact', 'confirmation'].indexOf(step) > index ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 4 && <div className="h-1 w-12 md:w-20 bg-gray-200 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>
        )}

        {step === 'service' && (
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Selecciona un servicio</h2>
            {services.length > 0 ? (
              <div className="grid gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className="text-left p-6 border border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-3">{service.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">{service.duration_minutes} min</span>
                      <span className="font-semibold text-pink-600">{service.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No hay servicios disponibles.</p>
            )}
          </div>
        )}

        {step === 'date' && selectedService && (
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Selecciona una fecha para {selectedService.name}</h2>
            <Calendar onDateSelect={handleDateSelect} blockedDates={blockedDates} />
            <button
              onClick={() => setStep('service')}
              className="mt-6 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Atras
            </button>
          </div>
        )}

        {step === 'time' && selectedService && (
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Selecciona una hora para{' '}
              {parseLocalDateString(selectedDate).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h2>
            <TimeSlots
              selectedDate={selectedDate}
              onTimeSelect={handleTimeSelect}
              serviceDuration={selectedService.duration_minutes}
            />
            <button
              onClick={() => setStep('date')}
              className="mt-6 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Atras
            </button>
          </div>
        )}

        {step === 'contact' && selectedService && (
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Informacion de contacto</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="booking-client-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input
                  id="booking-client-name"
                  type="text"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleInputChange}
                  required
                  title="Nombre completo"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 outline-none"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="booking-client-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electronico
                </label>
                <input
                  id="booking-client-email"
                  type="email"
                  name="client_email"
                  value={formData.client_email}
                  onChange={handleInputChange}
                  required={!formData.client_phone.trim()}
                  title="Correo electronico"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 outline-none"
                  placeholder="tu@correo.com (opcional si pones telefono)"
                />
              </div>

              <div>
                <label htmlFor="booking-client-phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefono
                </label>
                <input
                  id="booking-client-phone"
                  type="tel"
                  name="client_phone"
                  value={formData.client_phone}
                  onChange={handleInputChange}
                  required={!formData.client_email.trim()}
                  title="Telefono de contacto"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 outline-none"
                  placeholder="+1 829 XXX XXXX (opcional si pones correo)"
                />
                <p className="mt-2 text-xs text-gray-500">Completa al menos uno: correo o telefono.</p>
              </div>

              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Resumen de tu cita:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>
                    <strong>Servicio:</strong> {selectedService.name}
                  </li>
                  <li>
                    <strong>Fecha:</strong> {parseLocalDateString(selectedDate).toLocaleDateString('es-ES')}
                  </li>
                  <li>
                    <strong>Hora:</strong> {selectedTime}
                  </li>
                  <li>
                    <strong>Duracion:</strong> {selectedService.duration_minutes} minutos
                  </li>
                </ul>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setStep('time')}
                  className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Atras
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition disabled:opacity-50"
                >
                  {submitting ? 'Confirmando...' : 'Confirmar cita'}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'confirmation' && confirmationData && (
          <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Cita registrada</h2>
              <p className="text-gray-600">Hemos recibido tu reserva.</p>
            </div>

            <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-bold text-gray-900 mb-4">Detalles de tu cita:</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Confirmacion:</strong> {confirmationData.id}
                </p>
                <p>
                  <strong>Servicio:</strong> {confirmationData.service.name}
                </p>
                <p>
                  <strong>Fecha:</strong>{' '}
                  {parseLocalDateString(confirmationData.appointment_date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p>
                  <strong>Hora:</strong> {confirmationData.appointment_time}
                </p>
                <p>
                  <strong>Cliente:</strong> {confirmationData.client_name}
                </p>
                <p>
                  <strong>Correo:</strong> {confirmationData.client_email || 'No registrado'}
                </p>
                <p>
                  <strong>Telefono:</strong> {confirmationData.client_phone || 'No registrado'}
                </p>
              </div>
            </div>

            {confirmationData.client_email ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  Te enviaremos un correo de confirmacion a <strong>{confirmationData.client_email}</strong>
                </p>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  No registraste correo. Usaremos tu telefono para confirmar detalles de la cita.
                </p>
              </div>
            )}

            <p className="text-gray-600 mb-6">
              Si necesitas cancelar o reprogramar, contactanos por WhatsApp:{' '}
              <a
                href="https://wa.me/+18293388282"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 font-semibold"
              >
                +1 829 338 8282
              </a>
            </p>

            <button
              onClick={handleNewBooking}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition"
            >
              Hacer otra cita
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
