/**
 * catalog.ts — Ayudas del catálogo estático de servicios.
 *
 * Convierte OFFICIAL_SERVICES en una lista tipo Service 100% estática.
 */
import type { Service } from '../types';
import { OFFICIAL_SERVICES } from '../data/officialCatalog';

const STATIC_TIMESTAMP = new Date().toISOString();

/**
 * Convierte OFFICIAL_SERVICES en lista tipo Service 100% estática.
 */
export function getOfficialServices(): Service[] {
  return OFFICIAL_SERVICES.map((s, i) => ({
    id: `official-${i}`,
    name: s.name,
    description: s.description,
    duration_minutes: s.duration_minutes,
    price: s.price,
    category: s.category,
    active: true,
    created_at: STATIC_TIMESTAMP,
    updated_at: STATIC_TIMESTAMP,
  }));
}
