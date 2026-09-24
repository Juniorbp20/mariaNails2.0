/**
 * whatsappTemplates.ts — Mensajes listos para WhatsApp + prompt del asistente.
 *
 * Qué contiene: textos con el tono cálido oficial (bienvenida, precios,
 * reserva, cancelación, pagos...) y el system prompt que define cómo debe
 * responder cualquier IA/bot del negocio. Edítalos aquí y se actualizan
 * en el botón flotante, el asistente y los enlaces de reserva.
 */
import { BUSINESS_INFO } from './officialCatalog';

/** Arma un link wa.me con el mensaje ya codificado. */
export function waLink(message: string): string {
  return `${BUSINESS_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

/** Plantillas de respuesta rápida (se usan en la web y pueden copiarse a bots). */
export const WHATSAPP_TEMPLATES = {
  bienvenida: `Hola, bienvenida a ${BUSINESS_INFO.name} Soy la asistente de María. Atendemos exclusivamente con cita previa. ¿En qué servicio estás interesada hoy? Tenemos manicura, gel, pedicura spa y acrílico del #1 al #8.`,

  consultaPrecios: `Con gusto, mi amor. Estos son nuestros precios oficiales:
• Manicura en Seco RD$250 | En Gel RD$450
• Manicura Regular RD$600 | Manicura en Gel RD$800
• Esmaltado gel uña natural RD$450
• Sistemas Rubber/Acry/Builder desde RD$1,234
• Pedicura completa RD$1,234 (3 horas spa)
• Acrílico desde RD$750 según largo #1-#8 y estilo.
¿Te ayudo a reservar tu cita?`,

  /** Mensaje de reserva con servicio, fecha y hora ya rellenables. */
  agendar: (servicio = 'tu servicio', fecha = 'tu fecha', hora = 'tu hora') =>
    `Hola María. Quiero reservar: ${servicio} para el ${fecha} a las ${hora}. Mi nombre es: ___. Quedo atenta a confirmación. ¡Gracias!`,

  cancelacion24h: `Hola María. Necesito cancelar/reprogramar mi cita con más de 24 horas de anticipación. Mi cita es: ___. Gracias por tu comprensión.`,

  tardanza15min: `Hola María. Voy en camino, podría llegar unos minutos tarde. Entiendo la tolerancia de 15 minutos. Mi cita es a las: ___. Gracias.`,

  nailArt: `Hola María. Me interesa Nail Art personalizado (mano alzada / 3D / pedrería). Te envío mis fotos de referencia para cotizar. ¡Gracias!`,

  pagoTransferencia: `Hola María. Haré mi pago por transferencia Banreservas cuenta ${BUSINESS_INFO.bankAccount} a nombre de ${BUSINESS_INFO.bankHolder}. Te envío el comprobante. ¡Gracias!`,

  direccion: `Estamos en ${BUSINESS_INFO.addressLine1} (${BUSINESS_INFO.addressLine2}). Te esperamos con cafecito, té, jugos y galletitas de cortesía ☕🍪💜`,
};

/** System prompt maestro: pégalo en ChatGPT/Claude/bots para clonar a la asistente. */
export const ASSISTANT_SYSTEM_PROMPT = `Actúa como la asistente virtual y community manager oficial de "${BUSINESS_INFO.name}", salón especializado en manos y pies. Tono cálido, profesional, empático, femenino y delicado (estética lila/pastel).
Datos 100% exactos:
- Profesional: ${BUSINESS_INFO.professional} (${BUSINESS_INFO.professionalTitle})
- Eslogan: "${BUSINESS_INFO.tagline}"
- WhatsApp reservas: ${BUSINESS_INFO.phoneDisplay}
- Ubicación: ${BUSINESS_INFO.addressLine1}, ${BUSINESS_INFO.addressLine2}
- Modalidad: ${BUSINESS_INFO.modality}
- Precios: Manicura Seco 250, Seco Gel 450, Regular 600, Gel 800; Esmaltado gel natural 450; Sistemas Gel avanzados desde 1234; Pedicura completa 1234 (3h); Acrílico #1-#8 según estilo (Pintura Regular 750-1400, Cover Liso 800-1800, Cover French 850-1800, Acrílico+Gel 900-1900, Baby Boomer 950-2000, Full Set 1000-2100); Nail Art cotizar con foto referencia.
- Cortesías gratis: café recién colado, tés, jugos, galletas.
- Políticas: solo WhatsApp, cancelar sin costo 24h antes, menos de 24h pierde seña, tolerancia 15 min.
- Pago: efectivo, transferencia ${BUSINESS_INFO.bank} ${BUSINESS_INFO.bankAccount} titular ${BUSINESS_INFO.bankHolder}.
Instrucciones: saluda con calidez, detalla precios por largo/tipo, menciona cortesías y dirección al agendar.`;
