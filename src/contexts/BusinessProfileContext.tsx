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
  business_name: 'Maria Nails Studio & Pedicure',
  tagline: 'Belleza en tus manos y pies',
  hero_title: 'Bienvenida a Maria Nails Studio & Pedicure',
  hero_subtitle:
    'Manicurista profesional: manicura, gel, pedicura spa y acrílico del #1 al #8. Solo con cita previa. Coffee bar de cortesía en cada visita.',
  about_title: 'Sobre María Bonifacio',
  about_description:
    'Soy María Bonifacio, manicurista profesional técnica en manicura completa y pedicura.\nTe esperamos en Gran Parada Tenares, Calle Principal #25 (Salón Griselda, segundo nivel) con cafecito, té y galletitas de cortesía.',
  footer_description:
    'Manicura, gel, pedicura spa y acrílico con atención profesional de María Bonifacio. Solo con cita previa.',
  contact_phone: '+1 829 338 8282',
  contact_whatsapp: 'https://wa.me/18293388282',
  contact_email: null,
  address_line_1: 'Gran Parada Tenares, Calle Principal #25, salida San Francisco de Macorís',
  address_line_2: 'En Salón Griselda, segundo nivel, República Dominicana',
  maps_url: null,
  instagram_url: null,
  logo_url: null,
  logo_storage_path: null,
  profile_image_url: null,
  profile_image_storage_path: null,
  price_catalog_url: null,
  price_catalog_storage_path: null,
  payment_details:
    'Efectivo en el local. Transferencia Banreservas cuenta 9605474442 a nombre de María Bonifacio.',
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
