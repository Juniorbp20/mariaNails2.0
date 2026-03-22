import { supabase } from '../lib/supabase';
import type { BusinessProfile } from '../types';

const BRANDING_BUCKET = 'branding';

type UploadResult = {
  publicUrl: string;
  path: string;
};

export type BrandingAssetKind = 'logo' | 'profile';

export type BusinessProfileUpdateInput = Partial<
  Pick<
    BusinessProfile,
    | 'business_name'
    | 'tagline'
    | 'hero_title'
    | 'hero_subtitle'
    | 'about_title'
    | 'about_description'
    | 'footer_description'
    | 'contact_phone'
    | 'contact_whatsapp'
    | 'contact_email'
    | 'address_line_1'
    | 'address_line_2'
    | 'maps_url'
    | 'instagram_url'
  >
>;

const extractBrandingPathFromPublicUrl = (url: string): string | null => {
  try {
    const pathname = new URL(url).pathname;
    const marker = '/storage/v1/object/public/branding/';
    const markerIndex = pathname.indexOf(marker);
    if (markerIndex === -1) return null;
    return decodeURIComponent(pathname.slice(markerIndex + marker.length));
  } catch {
    return null;
  }
};

const normalizeBrandingPath = (value: string | null | undefined): string | null => {
  if (!value) return null;

  if (/^https?:\/\//i.test(value)) {
    return extractBrandingPathFromPublicUrl(value);
  }

  return value.replace(/^branding\//, '');
};

const toNullableText = (value: string | null): string | null => {
  if (value === null) return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const sanitizeUpdates = (updates: BusinessProfileUpdateInput): Record<string, string | null> => {
  const payload: Record<string, string | null> = {};

  if (updates.business_name !== undefined) payload.business_name = updates.business_name.trim();
  if (updates.tagline !== undefined) payload.tagline = updates.tagline.trim();
  if (updates.hero_title !== undefined) payload.hero_title = updates.hero_title.trim();
  if (updates.hero_subtitle !== undefined) payload.hero_subtitle = updates.hero_subtitle.trim();
  if (updates.about_title !== undefined) payload.about_title = updates.about_title.trim();
  if (updates.about_description !== undefined) payload.about_description = updates.about_description.trim();
  if (updates.footer_description !== undefined) payload.footer_description = updates.footer_description.trim();

  if (updates.contact_phone !== undefined) payload.contact_phone = toNullableText(updates.contact_phone);
  if (updates.contact_whatsapp !== undefined) payload.contact_whatsapp = toNullableText(updates.contact_whatsapp);
  if (updates.contact_email !== undefined) payload.contact_email = toNullableText(updates.contact_email);
  if (updates.address_line_1 !== undefined) payload.address_line_1 = toNullableText(updates.address_line_1);
  if (updates.address_line_2 !== undefined) payload.address_line_2 = toNullableText(updates.address_line_2);
  if (updates.maps_url !== undefined) payload.maps_url = toNullableText(updates.maps_url);
  if (updates.instagram_url !== undefined) payload.instagram_url = toNullableText(updates.instagram_url);

  return payload;
};

const getPublicUrl = (path: string): string => {
  const {
    data: { publicUrl },
  } = supabase.storage.from(BRANDING_BUCKET).getPublicUrl(path);

  return publicUrl;
};

export const businessProfileService = {
  async getBusinessProfile(): Promise<BusinessProfile> {
    const { data, error } = await supabase
      .from('business_profile')
      .select('*')
      .eq('singleton', true)
      .maybeSingle();

    if (error) throw error;
    if (data) return data;

    const { data: created, error: createError } = await supabase
      .from('business_profile')
      .insert([{ singleton: true }])
      .select('*')
      .single();

    if (createError) throw createError;
    return created;
  },

  async updateBusinessProfile(updates: BusinessProfileUpdateInput): Promise<BusinessProfile> {
    const profile = await this.getBusinessProfile();
    const payload = {
      ...sanitizeUpdates(updates),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('business_profile')
      .update(payload)
      .eq('id', profile.id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async uploadBrandingAsset(file: File, kind: BrandingAssetKind): Promise<UploadResult> {
    const safeFileName = file.name.replace(/\s+/g, '-');
    const path = `${kind}/${Date.now()}-${safeFileName}`;

    const { data, error } = await supabase.storage
      .from(BRANDING_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    return {
      publicUrl: getPublicUrl(data.path),
      path: data.path,
    };
  },

  async removeBrandingAsset(pathOrUrl: string | null | undefined): Promise<void> {
    const storagePath = normalizeBrandingPath(pathOrUrl);
    if (!storagePath) return;

    const { error } = await supabase.storage.from(BRANDING_BUCKET).remove([storagePath]);
    if (error) throw error;
  },

  async replaceBrandingAsset(kind: BrandingAssetKind, file: File): Promise<BusinessProfile> {
    const profile = await this.getBusinessProfile();
    const upload = await this.uploadBrandingAsset(file, kind);

    const isLogo = kind === 'logo';
    const previousPath = isLogo ? profile.logo_storage_path : profile.profile_image_storage_path;

    const updatePayload = isLogo
      ? {
          logo_url: upload.publicUrl,
          logo_storage_path: upload.path,
          updated_at: new Date().toISOString(),
        }
      : {
          profile_image_url: upload.publicUrl,
          profile_image_storage_path: upload.path,
          updated_at: new Date().toISOString(),
        };

    const { data, error } = await supabase
      .from('business_profile')
      .update(updatePayload)
      .eq('id', profile.id)
      .select('*')
      .single();

    if (error) {
      await this.removeBrandingAsset(upload.path).catch(() => undefined);
      throw error;
    }

    await this.removeBrandingAsset(previousPath).catch(() => undefined);

    return data;
  },
};
