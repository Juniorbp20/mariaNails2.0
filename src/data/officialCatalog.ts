/**
 * officialCatalog.ts — Fuente única de verdad del negocio.
 *
 * Qué contiene: datos oficiales de Maria Nails Studio & Pedicure
 * (contacto, dirección, precios de manicura/gel/pedicura y la matriz
 * de acrílico 6 estilos x 8 largos). Sirve para pintar la web, validar
 * precios y alimentar el asistente virtual sin depender de la BD.
 * Si un precio cambia aquí, cambia en catálogo, reserva y asistente.
 */

export const BUSINESS_INFO = {
  name: 'Maria Nails Studio & Pedicure',
  shortName: 'María Nails',
  professional: 'María Bonifacio',
  professionalTitle: 'Manicurista profesional técnica en manicura completa y pedicura',
  tagline: 'Belleza en tus manos y pies',
  phoneDisplay: '829-338-8282',
  phoneInternational: '+1 829 338 8282',
  whatsappDigits: '18293388282',
  whatsappUrl: 'https://wa.me/18293388282',
  addressLine1: 'Gran Parada Tenares, Calle Principal #25, salida San Francisco de Macorís',
  addressLine2: 'En Salón Griselda, segundo nivel, República Dominicana',
  modality: 'Exclusivamente con cita previa reservada con anticipación.',
  bank: 'Banreservas',
  bankAccount: '9605474442',
  bankHolder: 'María Bonifacio',
} as const;

/** Cortesías gratis que disfruta cada clienta durante su cita. */
export const COURTESIES = [
  'Café recién colado',
  'Selección variada de tés',
  'Jugos refrescantes',
  'Galletas y aperitivos dulces',
] as const;

/** Políticas de reserva: canal, cancelación 24h y tolerancia de 15 min. */
export const POLICIES = {
  bookingChannel: 'Gestión de turnos exclusivamente vía WhatsApp al 829-338-8282.',
  cancellation:
    'Cancelaciones sin costo con al menos 24 horas de anticipación. Si se cancela con menos de 24 horas, no se realiza devolución de la seña/depósito.',
  punctuality:
    'Esperamos un máximo de 15 minutos a partir de la hora pautada. Pasado ese tiempo, el turno quedará vacante y se perderá la cita.',
} as const;

/** Largos de uña acrílica disponibles (#1 corto → #8 extra largo). */
export type AcrylicLength = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Clave interna de cada estilo de acrílico (se usa en URLs y búsquedas). */
export type AcrylicStyleKey =
  | 'pintura-regular'
  | 'cover-liso'
  | 'cover-french'
  | 'acrilico-gel'
  | 'baby-boomer'
  | 'full-set';

/** Un estilo de acrílico con su precio oficial por cada largo. */
export interface AcrylicStyle {
  key: AcrylicStyleKey;
  label: string;
  shortLabel: string;
  description: string;
  prices: Record<AcrylicLength, number>;
}

/** Los 6 estilos oficiales con sus 48 precios (ver tabla en /precios). */
export const ACRYLIC_STYLES: AcrylicStyle[] = [
  {
    key: 'pintura-regular',
    label: 'Uñas con pintura regular',
    shortLabel: 'Pintura Regular',
    description: 'Acrílico con esmaltado regular clásico.',
    prices: { 1: 750, 2: 800, 3: 850, 4: 900, 5: 1000, 6: 1150, 7: 1300, 8: 1400 },
  },
  {
    key: 'cover-liso',
    label: 'Cover Liso',
    shortLabel: 'Cover Liso',
    description: 'Cover en tono nude liso, elegante y natural.',
    prices: { 1: 800, 2: 900, 3: 1000, 4: 1250, 5: 1350, 6: 1500, 7: 1650, 8: 1800 },
  },
  {
    key: 'cover-french',
    label: 'Cover French',
    shortLabel: 'Cover French',
    description: 'French clásico sobre base cover.',
    prices: { 1: 850, 2: 950, 3: 1050, 4: 1200, 5: 1350, 6: 1500, 7: 1650, 8: 1800 },
  },
  {
    key: 'acrilico-gel',
    label: 'Acrílico + Gel',
    shortLabel: 'Acrílico + Gel',
    description: 'Base acrílica con acabado en gel de larga duración.',
    prices: { 1: 900, 2: 1000, 3: 1150, 4: 1250, 5: 1350, 6: 1500, 7: 1750, 8: 1900 },
  },
  {
    key: 'baby-boomer',
    label: 'Baby Boomer',
    shortLabel: 'Baby Boomer',
    description: 'Degradado baby boomer difuminado.',
    prices: { 1: 950, 2: 1100, 3: 1200, 4: 1350, 5: 1500, 6: 1650, 7: 1800, 8: 2000 },
  },
  {
    key: 'full-set',
    label: 'Full Set (Set Completo)',
    shortLabel: 'Full Set',
    description: 'Set completo con diseño integral.',
    prices: { 1: 1000, 2: 1250, 3: 1300, 4: 1450, 5: 1600, 6: 1700, 7: 1850, 8: 2100 },
  },
];

/** Forma de un servicio base (manicura, gel, pedicura, nail art). */
export interface OfficialServiceSeed {
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  category: string;
}

/** Los 8 servicios base con precio y duración oficial (RD$ y minutos). */
export const OFFICIAL_SERVICES: OfficialServiceSeed[] = [
  {
    name: 'Manicura en Seco',
    description: 'Retiro de cutículas con drill, pintura regular e hidratación de cutícula.',
    duration_minutes: 40,
    price: 250,
    category: 'Manicura',
  },
  {
    name: 'Manicura en Seco en Gel',
    description: 'Retiro de cutículas con drill, pintura en gel e hidratación de cutícula.',
    duration_minutes: 50,
    price: 450,
    category: 'Manicura',
  },
  {
    name: 'Manicura Regular',
    description:
      'Retiro de cutículas, exfoliación profunda, masaje relajante con hidratación y pintura regular.',
    duration_minutes: 60,
    price: 600,
    category: 'Manicura',
  },
  {
    name: 'Manicura en Gel',
    description:
      'Retiro de cutículas, exfoliación profunda, masaje relajante con hidratación y esmaltado en gel de larga duración.',
    duration_minutes: 70,
    price: 800,
    category: 'Manicura',
  },
  {
    name: 'Esmaltado en gel sobre uña natural',
    description: 'Esmaltado en gel de larga duración sobre tu uña natural.',
    duration_minutes: 45,
    price: 450,
    category: 'Gel',
  },
  {
    name: 'Sistemas en Gel (Rubber / Acry / Builder)',
    description:
      'Sistemas avanzados Rubber Gel, Acry Gel y Builder Gel. Precio base desde RD$ 1,234 según largo y diseño.',
    duration_minutes: 90,
    price: 1234,
    category: 'Gel',
  },
  {
    name: 'Pedicura completa',
    description:
      'Exfoliación, hidratación profunda, tratamiento y esmaltado. Aprox. 3 horas de atención y máxima relajación.',
    duration_minutes: 180,
    price: 1234,
    category: 'Pedicura',
  },
  {
    name: 'Nail Art & Decoración',
    description:
      'Diseños a mano alzada, stickers, 3D, pedrería, gel sólido y diseños personalizados. Trae fotos de referencia para cotizar detalles.',
    duration_minutes: 30,
    price: 0,
    category: 'Nail Art',
  },
];

/**
 * Devuelve el precio oficial de un estilo + largo.
 * Ej: getAcrylicPrice('cover-liso', 4) → 1250.
 */
export function getAcrylicPrice(styleKey: AcrylicStyleKey, length: AcrylicLength): number {
  const style = ACRYLIC_STYLES.find((s) => s.key === styleKey);
  if (!style) return 0;
  return style.prices[length];
}

/**
 * Construye el nombre estándar de un servicio acrílico en la BD.
 * Ej: buildAcrylicServiceName('Cover Liso', 4) → "Acrílico Cover Liso #4".
 */
export function buildAcrylicServiceName(styleLabel: string, length: AcrylicLength): string {
  return `Acrílico ${styleLabel} #${length}`;
}
