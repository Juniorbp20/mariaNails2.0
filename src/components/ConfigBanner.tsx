/**
 * ConfigBanner.tsx — Aviso amarillo cuando falta el archivo .env.
 *
 * Solo aparece en desarrollo local sin credenciales de Supabase;
 * en producción (con .env) no muestra nada.
 */
import { isSupabaseConfigured } from '../lib/supabase';

/** Franja de alerta si Supabase no está configurado; null si todo está bien. */
export default function ConfigBanner() {
  if (isSupabaseConfigured) return null;
  return (
    <div className="bg-amber-400 px-4 py-2 text-center text-sm font-medium text-amber-950" role="alert">
      Falta el archivo <code className="font-bold">.env</code> con <code>VITE_SUPABASE_URL</code> y{' '}
      <code>VITE_SUPABASE_ANON_KEY</code>. La página carga en modo local sin datos. Crea el{' '}
      <code>.env</code> y reinicia con <code>npm run dev</code>.
    </div>
  );
}
