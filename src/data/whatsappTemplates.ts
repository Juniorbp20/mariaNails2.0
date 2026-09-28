/**
 * whatsappTemplates.ts — Mensajes listos para WhatsApp.
 *
 * Qué contiene: textos con el tono cálido oficial (bienvenida, nail art,
 * dirección) usados en el botón flotante, el asistente y los enlaces
 * de reserva. Edítalos aquí y se actualizan en toda la web.
 */
import { BUSINESS_INFO } from './officialCatalog';

/** Arma un link wa.me con el mensaje ya codificado. */
export function waLink(message: string): string {
  return `${BUSINESS_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

/** Plantillas usadas en la web (bienvenida del asistente, nail art, dirección). */
export const WHATSAPP_TEMPLATES = {
  bienvenida: `Hola, bienvenida a ${BUSINESS_INFO.name} Soy la asistente de María. Atendemos exclusivamente con cita previa. ¿En qué servicio estás interesada hoy? Tenemos manicura, gel, pedicura spa y acrílico del #1 al #8.`,

  nailArt: `Hola María. Me interesa Nail Art personalizado (mano alzada / 3D / pedrería). Te envío mis fotos de referencia para cotizar. ¡Gracias!`,

  direccion: `Estamos en ${BUSINESS_INFO.addressLine1} (${BUSINESS_INFO.addressLine2}). Te esperamos con cafecito, té, jugos y galletitas de cortesía.`,
};
