import { useState, useEffect } from 'react';
import { galleryService } from '../services/galleryService';
import GalleryImage from '../components/GalleryImage';
import type { GalleryImage as GalleryImageType } from '../types';

export default function Gallery() {
  const [images, setImages] = useState<GalleryImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const loadImages = async () => {
      try {
        const data = await galleryService.getGalleryImages(ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
        setImages(data);
      } catch (error) {
        console.error('Error loading gallery images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, [page]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Galería de Trabajos</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explora algunos de nuestros trabajos más recientes y diseños especiales.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-600">Cargando galería...</div>
        ) : images.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {images.map(image => (
                <GalleryImage key={image.id} image={image} />
              ))}
            </div>

            <div className="flex justify-center items-center space-x-4">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Anterior
              </button>
              <span className="text-gray-600 font-medium">
                Página {page + 1}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={images.length < ITEMS_PER_PAGE}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Siguiente
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-600">No hay imágenes en la galería aún.</div>
        )}
      </div>
    </div>
  );
}
