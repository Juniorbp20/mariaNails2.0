import { supabase } from '../lib/supabase';
import type { GalleryImage } from '../types';

type UploadResult = {
  publicUrl: string;
  path: string;
};

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

const getStoragePathFromImage = (image: Pick<GalleryImage, 'storage_path' | 'image_url'>): string | null => {
  if (image.storage_path) {
    if (/^https?:\/\//i.test(image.storage_path)) {
      return extractPathFromPublicUrl(image.storage_path);
    }

    return image.storage_path.replace(/^gallery\//, '');
  }

  return extractPathFromPublicUrl(image.image_url);
};

export const galleryService = {
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

  async createGalleryImage(image: Omit<GalleryImage, 'id' | 'created_at' | 'updated_at'>): Promise<GalleryImage> {
    const { data, error } = await supabase
      .from('gallery_images')
      .insert([image])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

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
