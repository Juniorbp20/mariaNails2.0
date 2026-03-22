export interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  category: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  service_id: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AvailabilitySlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  break_start: string | null;
  break_end: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlockedDate {
  id: string;
  blocked_date: string;
  reason: string | null;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  storage_path: string | null;
  service_id: string | null;
  display_order: number | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookingFormData {
  service_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  appointment_date: string;
  appointment_time: string;
}

export interface BusinessProfile {
  id: string;
  singleton: boolean;
  business_name: string;
  tagline: string;
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_description: string;
  footer_description: string;
  contact_phone: string | null;
  contact_whatsapp: string | null;
  contact_email: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  maps_url: string | null;
  instagram_url: string | null;
  logo_url: string | null;
  logo_storage_path: string | null;
  profile_image_url: string | null;
  profile_image_storage_path: string | null;
  created_at: string;
  updated_at: string;
}
