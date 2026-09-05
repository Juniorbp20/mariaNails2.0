import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { businessProfileService } from '../services/businessProfileService';
import type { BusinessProfile } from '../types';

const DEFAULT_PROFILE: BusinessProfile = {
  id: '',
  singleton: true,
  business_name: 'María Nails',
  tagline: 'Belleza en tus manos',
  hero_title: 'Bienvenida a María Nails',
  hero_subtitle: 'Especialista en manicura, pedicura y uñas acrílicas.',
  about_title: 'Sobre María',
  about_description: 'Técnica en uñas con experiencia y atención personalizada.',
  footer_description: 'Manicura, pedicura y uñas acrílicas con atención profesional.',
  contact_phone: null,
  contact_whatsapp: null,
  contact_email: null,
  address_line_1: null,
  address_line_2: null,
  maps_url: null,
  instagram_url: null,
  logo_url: null,
  logo_storage_path: null,
  profile_image_url: null,
  profile_image_storage_path: null,
  created_at: '',
  updated_at: '',
};

type BusinessProfileContextValue = {
  profile: BusinessProfile;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  applyProfile: (nextProfile: BusinessProfile) => void;
};

const BusinessProfileContext = createContext<BusinessProfileContextValue | undefined>(undefined);

export function BusinessProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<BusinessProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const data = await businessProfileService.getBusinessProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to load business profile', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyProfile = useCallback((nextProfile: BusinessProfile) => {
    setProfile(nextProfile);
  }, []);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const contextValue = useMemo(
    () => ({ profile, loading, refreshProfile, applyProfile }),
    [profile, loading, refreshProfile, applyProfile],
  );

  return <BusinessProfileContext.Provider value={contextValue}>{children}</BusinessProfileContext.Provider>;
}

export function useBusinessProfile() {
  const context = useContext(BusinessProfileContext);
  if (!context) {
    throw new Error('useBusinessProfile must be used within BusinessProfileProvider');
  }
  return context;
}
