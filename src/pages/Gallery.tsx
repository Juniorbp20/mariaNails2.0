import { useState, useEffect } from 'react';
import { galleryService } from '../services/galleryService';
import GalleryImage from '../components/GalleryImage';
import { GallerySkeleton } from '../components/Skeletons';
import type { GalleryImage as GalleryImageType } from '../types';

export default function Gallery() {
  const [images, setImages] = useState<GalleryImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    let cancelled = false;
    const loadImages = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await galleryService.getGalleryImages(ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
        if (!cancelled) setImages(data);
      } catch (err) {
        console.error('Error loading gallery images:', err);
        if (!cancelled) setError('No pudimos cargar la galería. Inténtalo de nuevo.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadImages();
    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Galería de Trabajos</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explora algunos de nuestros trabajos más recientes y diseños especiales. Toca una foto para verla en grande.
          </p>
        </div>

        {loading ? (
          <GallerySkeleton count={ITEMS_PER_PAGE} />
        ) : error ? (
          <div className="mx-auto max-w-xl rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="mb-4 text-red-700">{error}</p>
            <button
              onClick={() => setPage((p) => p)}
              className="rounded-lg bg-red-600 px-6 py-2 font-semibold text-white transition hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        ) : images.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {images.map(image => (
                <GalleryImage key={image.id} image={image} />
              ))}
            </div>

            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={() => {
                  setPage(Math.max(0, page - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page === 0}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Anterior
              </button>
              <span className="text-gray-600 font-medium" aria-live="polite">
                Página {page + 1}
              </span>
              <button
                onClick={() => {
                  setPage(page + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={images.length < ITEMS_PER_PAGE}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                title={images.length < ITEMS_PER_PAGE ? 'No hay más fotos' : 'Ver más fotos'}
              >
                Siguiente
              </button>
            </div>
          </>
        ) : page > 0 ? (
          <div className="text-center">
            <p className="mb-4 text-gray-600">No hay más imágenes.</p>
            <button
              onClick={() => setPage(0)}
              className="rounded-lg bg-pink-600 px-6 py-2 font-semibold text-white transition hover:bg-pink-700"
            >
              Volver al inicio
            </button>
          </div>
        ) : (
          <div className="mx-auto max-w-xl rounded-lg border border-pink-200 bg-pink-50 p-8 text-center">
            <p className="mb-2 text-lg font-semibold text-gray-900">Pronto verás nuestros trabajos aquí</p>
            <p className="text-gray-600">Mientras tanto, reserva tu cita y sé la protagonista de la próxima foto.</p>
          </div>
        )}
      </div>
    </div>
  );
}
