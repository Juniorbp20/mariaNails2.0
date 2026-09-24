import type { Service } from '../types';
import { ACRYLIC_STYLES, type AcrylicLength, type AcrylicStyleKey } from '../data/officialCatalog';

export const CATEGORY_ORDER = [
  'Manicura',
  'Gel',
  'Pedicura',
  'Acrílico',
  'Nail Art',
] as const;

export function groupServicesByCategory(services: Service[]): Record<string, Service[]> {
  const grouped: Record<string, Service[]> = {};
  for (const s of services) {
    const key = s.category?.trim() || 'Otros';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(s);
  }
  return grouped;
}

export function sortedCategoryKeys(grouped: Record<string, Service[]>): string[] {
  const keys = Object.keys(grouped);
  return keys.sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a as (typeof CATEGORY_ORDER)[number]);
    const ib = CATEGORY_ORDER.indexOf(b as (typeof CATEGORY_ORDER)[number]);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

export function parseAcrylicName(name: string): {
  styleKey: AcrylicStyleKey | null;
  length: AcrylicLength | null;
} {
  const match = name.match(/#(\d)/);
  const length = match ? (Number(match[1]) as AcrylicLength) : null;
  const lower = name.toLowerCase();
  const found = ACRYLIC_STYLES.find(
    (s) =>
      lower.includes(s.shortLabel.toLowerCase()) || lower.includes(s.label.toLowerCase()),
  );
  const validLength =
    length && length >= 1 && length <= 8 ? (length as AcrylicLength) : null;
  return { styleKey: found ? found.key : null, length: validLength };
}

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
