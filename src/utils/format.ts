/**
 * format.ts — Formato de precios, duraciones y validaciones.
 *
 * Qué hace: convierte números a moneda DOP (RD$) y minutos a "1 h 30 min".
 */

const priceFormatter = new Intl.NumberFormat('es-DO', {
  style: 'currency',
  currency: 'DOP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Formatea un precio a RD$ (ej: 1250 → "RD$1,250"); 0 o inválido → "Consultar precio". */
export function formatPrice(price: number): string {
  if (!Number.isFinite(price) || price <= 0) return 'Consultar precio';
  return priceFormatter.format(price);
}

/** Convierte minutos a texto legible (ej: 90 → "1 h 30 min"). */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}
