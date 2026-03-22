import { useState } from 'react';
import { X } from 'lucide-react';
import type { GalleryImage as GalleryImageType } from '../types';

interface GalleryImageProps {
  image: GalleryImageType;
}

export default function GalleryImage({ image }: GalleryImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="relative bg-gray-100 rounded-lg overflow-hidden cursor-pointer group h-64"
        onClick={() => setIsOpen(true)}
      >
        <img
          src={image.image_url}
          alt={image.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
        <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/60 to-transparent">
          <h3 className="text-white font-semibold">{image.title}</h3>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={image.image_url}
              alt={image.title}
              className="w-full h-full object-contain rounded-lg"
            />
            {image.description && (
              <p className="text-white text-sm mt-4">{image.description}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
