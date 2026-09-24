/**
 * Skeletons.tsx — Marcadores grises animados mientras cargan los datos.
 *
 * Mejoran la experiencia: en vez de pantalla en blanco se ven tarjetas
 * pulsantes hasta que llegan servicios o fotos desde Supabase.
 */

/** Tarjeta fantasma individual (título + líneas de texto simuladas). */
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-6" aria-hidden="true">
      <div className="mb-3 h-5 w-2/3 rounded bg-gray-200" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="mb-2 h-3 rounded bg-gray-100" style={{ width: `${90 - i * 12}%` }} />
      ))}
      <div className="mt-4 flex justify-between">
        <div className="h-4 w-20 rounded bg-gray-200" />
        <div className="h-6 w-24 rounded bg-pink-100" />
      </div>
    </div>
  );
}

/** Rejilla de tarjetas fantasma para listas (servicios). */
export function GridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2" aria-label="Cargando contenido">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Cuadrícula de fotos fantasma para la galería. */
export function GallerySkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Cargando galería">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-200" aria-hidden="true" />
      ))}
    </div>
  );
}
