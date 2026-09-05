import { Link } from 'react-router-dom';
import { CalendarX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-white px-4 py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100">
        <CalendarX className="h-8 w-8 text-pink-600" />
      </div>
      <h1 className="mb-2 text-4xl font-bold text-gray-900">Página no encontrada</h1>
      <p className="mb-8 max-w-md text-gray-600">
        La página que buscas no existe o fue movida. Pero tus uñas perfectas sí existen: reserva tu cita.
      </p>
      <div className="flex gap-4">
        <Link
          to="/"
          className="rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
        >
          Volver al inicio
        </Link>
        <Link
          to="/reserva"
          className="rounded-lg bg-gradient-to-r from-pink-500 to-red-500 px-6 py-3 font-semibold text-white transition hover:shadow-lg"
        >
          Reservar cita
        </Link>
      </div>
    </div>
  );
}
