/**
 * types/index.ts — Formas de los datos que viajan entre BD y pantalla.
 *
 * Service: servicio reservable · Appointment: cita de una clienta ·
 * AvailabilitySlot: horario de un día · BlockedDate: día cerrado ·
 * GalleryImage: foto de trabajos · BookingFormData: lo que pide el
 * formulario · BusinessProfile: datos del salón editables en /admin.
 */
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

/** Cita: quién reservó, qué servicio, cuándo y en qué estado va. */
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

/** Horario de un día de semana (0=domingo) con descanso opcional. */
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

/** Día cerrado (feriado o libre) con su motivo. */
export interface BlockedDate {
  id: string;
  blocked_date: string;
  reason: string | null;
  created_at: string;
}

/** Foto de la galería con su URL y orden de muestra. */
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

/** Lo que la clienta escribe en el paso final de /reserva. */
export interface BookingFormData {
  service_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  appointment_date: string;
  appointment_time: string;
}

/** Perfil único del salón: textos, contacto, dirección, pagos e imágenes. */
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
  price_catalog_url: string | null;
  price_catalog_storage_path: string | null;
  payment_details: string | null;
  created_at: string;
  updated_at: string;
}
