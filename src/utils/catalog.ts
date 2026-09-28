/**
 * catalog.ts — Ayudas del catálogo estático de servicios.
 *
 * Qué hace: convierte OFFICIAL_SERVICES en lista tipo Service y localiza
 * el servicio que corresponde a un estilo + largo acrílico.
 */
import type { Service } from '../types';
import {
  ACRYLIC_STYLES,
  OFFICIAL_SERVICES,
  type AcrylicLength,
  type AcrylicStyleKey,
} from '../data/officialCatalog';

/**
 * Convierte OFFICIAL_SERVICES en lista tipo Service 100% estática.
 */
export function getOfficialServices(): Service[] {
  const now = new Date().toISOString();
  return OFFICIAL_SERVICES.map((s, i) => ({
    id: `official-${i}`,
    name: s.name,
    description: s.description,
    duration_minutes: s.duration_minutes,
    price: s.price,
    category: s.category,
    active: true,
    created_at: now,
    updated_at: now,
  }));
}

/**
 * Busca en la lista estática el servicio que coincide con un estilo + largo.
 * Devuelve null si no existe (entonces se usa el precio oficial).
 */
export function findServiceForAcrylic(
  services: Service[],
  styleKey: AcrylicStyleKey,
  length: AcrylicLength,
): Service | null {
  const style = ACRYLIC_STYLES.find((s) => s.key === styleKey);
  if (!style) return null;
  const candidates = services.filter((s) => s.category === 'Acrílico');
  // Match por #largo + estilo
  const direct = candidates.find(
    (s) =>
      s.name.includes(`#${length}`) &&
      (s.name.toLowerCase().includes(style.shortLabel.toLowerCase()) ||
        s.name.toLowerCase().includes(style.label.toLowerCase())),
  );
  if (direct) return direct;
  // Fallback: cualquier acrílico con ese largo
  return candidates.find((s) => s.name.includes(`#${length}`)) ?? null;
}
