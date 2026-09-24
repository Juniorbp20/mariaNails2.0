/**
 * supabase.ts — Conexión única a Supabase (BD + Storage + Auth).
 *
 * Lee VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY del .env. Si faltan,
 * la app sigue abriendo en modo local con un aviso (ConfigBanner).
 * Importa `supabase` desde aquí, nunca crees otro cliente.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/** True si hay credenciales; false → modo local con aviso amarillo. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (!isSupabaseConfigured) {
  console.warn(
    '[Supabase] Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY en el archivo .env. ' +
      'La app cargará con datos de respaldo y los servicios mostrarán un aviso.'
  );
}

// Cliente siempre definido para no romper la app en local sin .env.
// Si no hay credenciales se usa un placeholder: las llamadas fallarán
// de forma controlada y cada página muestra su estado de error.
export const supabase: SupabaseClient = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseKey ?? 'placeholder-anon-key'
);
