import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { GalleryImage as GalleryImageType } from '../types';

interface GalleryImageProps {
  image: GalleryImageType;
}

export default function GalleryImage({ image }: GalleryImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Ampliar foto: ${image.title}`}
        className="relative block h-64 w-full overflow-hidden rounded-lg bg-gray-100 text-left cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
      >
        <img
          src={image.image_url}
          alt={image.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          loading="lazy"
        />
        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" aria-hidden="true" />
        <span className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/60 to-transparent">
          <span className="text-white font-semibold">{image.title}</span>
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={image.title}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              aria-label="Cerrar foto ampliada"
              className="absolute -top-10 right-0 rounded p-1 text-white hover:text-gray-300 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={image.image_url}
              alt={image.title}
              className="w-full h-full max-h-[75vh] object-contain rounded-lg"
            />
            <div className="mt-4">
              <p className="font-semibold text-white">{image.title}</p>
              {image.description && (
                <p className="text-white/80 text-sm mt-1">{image.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
