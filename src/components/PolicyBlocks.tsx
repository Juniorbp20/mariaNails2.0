import { Coffee, CreditCard, MapPin, ShieldCheck } from 'lucide-react';
import { BUSINESS_INFO, COURTESIES, POLICIES } from '../data/officialCatalog';
import { waLink, WHATSAPP_TEMPLATES } from '../data/whatsappTemplates';

export default function PolicyBlocks({ paymentDetails }: { paymentDetails?: string | null }) {
  return (
    <div className="grid md:grid-cols-2 gap-4 mt-10">
      <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="flex items-center gap-2 mb-3">
          <Coffee className="h-5 w-5 text-purple-600" aria-hidden="true" />
          <h3 className="font-bold text-gray-900">Coffee bar de cortesía</h3>
        </div>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          {COURTESIES.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-gray-600">Gratis para todas nuestras clientas durante su cita.</p>
      </div>

      <div className="rounded-xl border border-purple-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-5 w-5 text-pink-600" aria-hidden="true" />
          <h3 className="font-bold text-gray-900">Dónde estamos</h3>
        </div>
        <p className="text-sm text-gray-700">{BUSINESS_INFO.addressLine1}</p>
        <p className="text-sm text-gray-600">{BUSINESS_INFO.addressLine2}</p>
        <p className="mt-2 text-sm text-gray-700">{BUSINESS_INFO.modality}</p>
        <a
          href={waLink(WHATSAPP_TEMPLATES.direccion)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-semibold text-pink-600 hover:text-pink-700"
        >
          Pedir ubicación por WhatsApp →
        </a>
      </div>

      <div className="rounded-xl border border-purple-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-5 w-5 text-purple-600" aria-hidden="true" />
          <h3 className="font-bold text-gray-900">Reservas y puntualidad</h3>
        </div>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>{POLICIES.bookingChannel}</li>
          <li>{POLICIES.cancellation}</li>
          <li>{POLICIES.punctuality}</li>
        </ul>
      </div>

      <div className="rounded-xl border border-purple-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="h-5 w-5 text-pink-600" aria-hidden="true" />
          <h3 className="font-bold text-gray-900">Métodos de pago</h3>
        </div>
        <p className="text-sm text-gray-700">
          {paymentDetails ||
            `Efectivo en el local. Transferencia ${BUSINESS_INFO.bank} cuenta ${BUSINESS_INFO.bankAccount} a nombre de ${BUSINESS_INFO.bankHolder}.`}
        </p>
        <a
          href={waLink(
            `Hola María Haré mi pago por transferencia Banreservas cuenta ${BUSINESS_INFO.bankAccount} a nombre de ${BUSINESS_INFO.bankHolder}. Te envío el comprobante.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-semibold text-pink-600 hover:text-pink-700"
        >
          Enviar comprobante por WhatsApp →
        </a>
      </div>
    </div>
  );
}
