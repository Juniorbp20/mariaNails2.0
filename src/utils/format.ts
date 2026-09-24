/**
 * format.ts — Formato de precios, duraciones y validaciones.
 *
 * Qué hace: convierte números a moneda DOP (RD$), minutos a "1 h 30 min",
 * arma links wa.me y valida teléfono/email de los formularios.
 */

/** Formatea un precio a RD$ (ej: 1250 → "RD$1,250"); 0 o inválido → "Consultar precio". */
export function formatPrice(price: number): string {
  if (!Number.isFinite(price) || price <= 0) return 'Consultar precio';
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/** Convierte minutos a texto legible (ej: 90 → "1 h 30 min"). */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

/** Convierte un teléfono o URL en link wa.me; null si no hay número válido. */
export function toWhatsAppUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  const digits = value.replace(/\D/g, '');
  if (!digits) return null;
  return `https://wa.me/${digits}`;
}

/** Valida que un teléfono tenga entre 7 y 15 dígitos. */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

/** Valida formato básico de email (texto@texto.dominio). */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
