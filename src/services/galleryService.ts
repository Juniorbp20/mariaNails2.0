/**
 * galleryService.ts — Fotos de trabajos en Supabase.
 *
 * Tabla `gallery_images` + bucket `gallery`: subir, listar paginado,
 * filtrar por servicio, editar título y borrar (foto + registro).
 */
import { supabase } from '../lib/supabase';
import type { GalleryImage } from '../types';

type UploadResult = {
  publicUrl: string;
  path: string;
};

/** Saca la ruta de Storage desde una URL pública de la galería. */
const extractPathFromPublicUrl = (url: string): string | null => {
  try {
    const pathname = new URL(url).pathname;
    const marker = '/storage/v1/object/public/gallery/';
    const markerIndex = pathname.indexOf(marker);
    if (markerIndex === -1) return null;
    return decodeURIComponent(pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
};

/** Resuelve la ruta de Storage de una foto (acepta ruta o URL vieja). */
const getStoragePathFromImage = (image: Pick<GalleryImage, 'storage_path' | 'image_url'>): string | null => {
  if (image.storage_path) {
    if (/^https?:\/\//i.test(image.storage_path)) {
      return extractPathFromPublicUrl(image.storage_path);
    }

    return image.storage_path.replace(/^gallery\//, '');
  }

  return extractPathFromPublicUrl(image.image_url);
};

/** API de galería: subir, listar, crear, editar y borrar fotos. */
export const galleryService = {
  /** Sube la imagen al bucket y devuelve su URL pública + ruta. */
  async uploadImage(file: File): Promise<UploadResult> {
    const safeFileName = file.name.replace(/\s+/g, '-');
    const fileName = `${Date.now()}-${safeFileName}`;
    const { data, error } = await supabase.storage
      .from('gallery')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('gallery')
      .getPublicUrl(fileName);

    return { publicUrl, path: data.path };
  },

  /** Lista fotos paginadas (público ve solo activas; admin puede ver todas). */
  async getGalleryImages(limit = 100, offset = 0, includeInactive = false): Promise<GalleryImage[]> {
    let query = supabase
      .from('gallery_images')
      .select('*')
      .order('display_order', { ascending: true })
      .range(offset, offset + limit - 1);

    if (!includeInactive) {
      query = query.eq('active', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  /** Fotos de un servicio concreto (para mostrar ejemplos al reservar). */
  async getGalleryImagesByService(serviceId: string): Promise<GalleryImage[]> {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('service_id', serviceId)
      .eq('active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /** Registra en la BD una foto ya subida al Storage. */
  async createGalleryImage(image: Omit<GalleryImage, 'id' | 'created_at' | 'updated_at'>): Promise<GalleryImage> {
    const { data, error } = await supabase
      .from('gallery_images')
      .insert([image])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /** Edita título/descripción de una foto. */
  async updateGalleryImage(id: string, updates: Partial<GalleryImage>): Promise<GalleryImage> {
    const { data, error } = await supabase
      .from('gallery_images')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /** Borra la foto del Storage y su registro de la BD. */
  async deleteGalleryImage(id: string): Promise<void> {
    const { data: image, error: readError } = await supabase
      .from('gallery_images')
      .select('id, image_url, storage_path')
      .eq('id', id)
      .single();

    if (readError) throw readError;

    const storagePath = getStoragePathFromImage(image);

    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([storagePath]);

      if (storageError) throw storageError;
    }

    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
