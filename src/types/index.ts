/**
 * types/index.ts — Forma del servicio del catálogo oficial (sitio estático,
 * sin base de datos).
 */
export interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  category: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}
