import { useEffect, useState } from 'react';
import { BarChart3, Building2, Calendar, Clock, Eye, EyeOff, Image, LogOut, Trash2 } from 'lucide-react';
import { useBusinessProfile } from '../contexts/BusinessProfileContext';
import { supabase } from '../lib/supabase';
import { appointmentService } from '../services/appointmentService';
import { availabilityService } from '../services/availabilityService';
import { businessProfileService } from '../services/businessProfileService';
import { galleryService } from '../services/galleryService';
import { serviceService } from '../services/serviceService';
import type { Appointment, AvailabilitySlot, BlockedDate, BusinessProfile, GalleryImage, Service } from '../types';

type AdminTab =
  | 'appointments'
  | 'services'
  | 'availability'
  | 'blocked-dates'
  | 'gallery'
  | 'business'
  | 'stats';

type ServiceForm = {
  name: string;
  description: string;
  duration_minutes: string;
  price: string;
  category: string;
  active: boolean;
};

type AvailabilityDraft = {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  break_start: string;
  break_end: string;
  is_active: boolean;
};

type BusinessProfileForm = {
  business_name: string;
  tagline: string;
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_description: string;
  footer_description: string;
  contact_phone: string;
  contact_whatsapp: string;
  contact_email: string;
  address_line_1: string;
  address_line_2: string;
  maps_url: string;
  instagram_url: string;
};

const DAYS: Record<number, string> = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miercoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sabado'
};

const createEmptyServiceForm = (): ServiceForm => ({
  name: '',
  description: '',
  duration_minutes: '60',
  price: '0',
  category: '',
  active: true
});

const toInputTime = (value: string | null): string => {
  if (!value) return '';
  return value.length >= 5 ? value.slice(0, 5) : value;
};

const toDbTime = (value: string): string => (value.length === 5 ? `${value}:00` : value);

const defaultDraft = (day: number): AvailabilityDraft => ({
  day_of_week: day,
  start_time: '09:00',
  end_time: '18:00',
  break_start: '13:00',
  break_end: '14:00',
  is_active: false
});

const buildDrafts = (slots: AvailabilitySlot[]): Record<number, AvailabilityDraft> => {
  const drafts: Record<number, AvailabilityDraft> = {};
  for (let day = 0; day <= 6; day += 1) {
    drafts[day] = defaultDraft(day);
  }
  for (const slot of slots) {
    drafts[slot.day_of_week] = {
      id: slot.id,
      day_of_week: slot.day_of_week,
      start_time: toInputTime(slot.start_time),
      end_time: toInputTime(slot.end_time),
      break_start: toInputTime(slot.break_start),
      break_end: toInputTime(slot.break_end),
      is_active: slot.is_active
    };
  }
  return drafts;
};

const mapBusinessProfileToForm = (profile: BusinessProfile): BusinessProfileForm => ({
  business_name: profile.business_name || '',
  tagline: profile.tagline || '',
  hero_title: profile.hero_title || '',
  hero_subtitle: profile.hero_subtitle || '',
  about_title: profile.about_title || '',
  about_description: profile.about_description || '',
  footer_description: profile.footer_description || '',
  contact_phone: profile.contact_phone || '',
  contact_whatsapp: profile.contact_whatsapp || '',
  contact_email: profile.contact_email || '',
  address_line_1: profile.address_line_1 || '',
  address_line_2: profile.address_line_2 || '',
  maps_url: profile.maps_url || '',
  instagram_url: profile.instagram_url || '',
});

export default function AdminDashboard() {
  const { applyProfile } = useBusinessProfile();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('appointments');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [availabilityDrafts, setAvailabilityDrafts] = useState<Record<number, AvailabilityDraft>>({});
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [businessForm, setBusinessForm] = useState<BusinessProfileForm>({
    business_name: '',
    tagline: '',
    hero_title: '',
    hero_subtitle: '',
    about_title: '',
    about_description: '',
    footer_description: '',
    contact_phone: '',
    contact_whatsapp: '',
    contact_email: '',
    address_line_1: '',
    address_line_2: '',
    maps_url: '',
    instagram_url: '',
  });

  const [serviceForm, setServiceForm] = useState<ServiceForm>(createEmptyServiceForm());
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const [blockedDateInput, setBlockedDateInput] = useState('');
  const [blockedReasonInput, setBlockedReasonInput] = useState('');

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const fail = (message: string, err?: unknown) => {
    if (err) console.error(err);
    setSuccess('');
    setError(message);
  };

  const ok = (message: string) => {
    setError('');
    setSuccess(message);
  };

  const ensureAdmin = async (adminEmail: string): Promise<boolean> => {
    const { data, error: adminError } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', adminEmail)
      .maybeSingle();
    if (adminError) throw adminError;
    return !!data;
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [apts, srvs, slots, blocked, images, business] = await Promise.all([
        appointmentService.getAppointments(),
        serviceService.getServices({ includeInactive: true }),
        availabilityService.getAvailabilitySlots({ includeInactive: true }),
        availabilityService.getBlockedDates({ includePast: true }),
        galleryService.getGalleryImages(500, 0, true),
        businessProfileService.getBusinessProfile(),
      ]);
      setAppointments(apts);
      setServices(srvs);
      setAvailabilitySlots(slots);
      setAvailabilityDrafts(buildDrafts(slots));
      setBlockedDates(blocked);
      setGalleryImages(images);
      setBusinessProfile(business);
      setBusinessForm(mapBusinessProfileToForm(business));
      applyProfile(business);
    } catch (err) {
      fail('No se pudieron cargar los datos admin.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const boot = async () => {
      setAuthLoading(true);
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!mounted) return;

        const sessionEmail = data.session?.user?.email;
        if (!sessionEmail) {
          setIsAuthenticated(false);
          return;
        }

        const isAdmin = await ensureAdmin(sessionEmail);
        if (!mounted) return;
        if (!isAdmin) {
          await supabase.auth.signOut();
          setIsAuthenticated(false);
          fail('Este usuario no tiene permisos admin.');
          return;
        }

        setEmail(sessionEmail);
        setIsAuthenticated(true);
        await loadAllData();
      } catch (err) {
        if (mounted) fail('No se pudo validar sesion admin.', err);
      } finally {
        if (mounted) setAuthLoading(false);
      }
    };

    boot();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      if (loginError) throw loginError;

      const userEmail = data.user?.email;
      if (!userEmail) throw new Error('No se pudo leer el email del usuario.');

      const isAdmin = await ensureAdmin(userEmail);
      if (!isAdmin) {
        await supabase.auth.signOut();
        throw new Error('Este usuario no esta autorizado como admin.');
      }

      setIsAuthenticated(true);
      await loadAllData();
      ok('Sesion iniciada.');
    } catch (err) {
      fail(err instanceof Error ? err.message : 'No se pudo iniciar sesion.', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setPassword('');
    ok('Sesion cerrada.');
  };

  const handleStatusChange = async (id: number, status: Appointment['status']) => {
    clearMessages();
    try {
      await appointmentService.updateAppointmentStatus(id, status);

      let syncWarning = '';
      if (status === 'confirmed' || status === 'cancelled') {
        try {
          await appointmentService.syncAppointmentWithGoogleCalendar(
            status === 'confirmed' ? 'upsert' : 'cancel',
            id
          );
        } catch (syncErr) {
          console.error(syncErr);
          const message = syncErr instanceof Error ? syncErr.message : 'Error desconocido';
          syncWarning = `La cita se actualizo, pero fallo la sincronizacion con Google Calendar: ${message}`;
        }
      }

      await loadAllData();
      if (syncWarning) {
        setSuccess('');
        setError(syncWarning);
      } else {
        ok('Cita actualizada.');
      }
    } catch (err) {
      fail('No se pudo actualizar la cita.', err);
    }
  };

  const handleDeleteAppointment = async (id: number) => {
    if (!window.confirm('Eliminar esta cita?')) return;
    clearMessages();
    try {
      let syncWarning = '';
      try {
        await appointmentService.syncAppointmentWithGoogleCalendar('cancel', id);
      } catch (syncErr) {
        console.error(syncErr);
        const message = syncErr instanceof Error ? syncErr.message : 'Error desconocido';
        syncWarning = `La cita se elimino, pero fallo la sincronizacion con Google Calendar: ${message}`;
      }
      await appointmentService.deleteAppointment(id);
      await loadAllData();
      if (syncWarning) {
        setSuccess('');
        setError(syncWarning);
      } else {
        ok('Cita eliminada.');
      }
    } catch (err) {
      fail('No se pudo eliminar la cita.', err);
    }
  };

  const resetServiceForm = () => {
    setEditingServiceId(null);
    setServiceForm(createEmptyServiceForm());
  };

  const startEditService = (service: Service) => {
    setEditingServiceId(service.id);
    setServiceForm({
      name: service.name,
      description: service.description,
      duration_minutes: String(service.duration_minutes),
      price: String(service.price),
      category: service.category,
      active: service.active
    });
  };

  const saveService = async (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();

    const duration = Number(serviceForm.duration_minutes);
    const price = Number(serviceForm.price);
    if (!serviceForm.name.trim()) return fail('El nombre del servicio es obligatorio.');
    if (!serviceForm.category.trim()) return fail('La categoria es obligatoria.');
    if (!Number.isFinite(duration) || duration <= 0) return fail('La duracion es invalida.');
    if (!Number.isFinite(price) || price < 0) return fail('El precio es invalido.');

    try {
      const payload = {
        name: serviceForm.name.trim(),
        description: serviceForm.description.trim(),
        duration_minutes: duration,
        price,
        category: serviceForm.category.trim(),
        active: serviceForm.active
      };
      if (editingServiceId) {
        await serviceService.updateService(editingServiceId, payload);
        ok('Servicio actualizado.');
      } else {
        await serviceService.createService(payload);
        ok('Servicio creado.');
      }
      resetServiceForm();
      await loadAllData();
    } catch (err) {
      fail('No se pudo guardar el servicio.', err);
    }
  };

  const toggleService = async (service: Service) => {
    clearMessages();
    try {
      await serviceService.toggleServiceActive(service.id, !service.active);
      await loadAllData();
      ok('Estado del servicio actualizado.');
    } catch (err) {
      fail('No se pudo cambiar el estado del servicio.', err);
    }
  };

  const patchDraft = (day: number, patch: Partial<AvailabilityDraft>) => {
    setAvailabilityDrafts((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] || defaultDraft(day)),
        ...patch
      }
    }));
  };

  const saveAvailability = async (day: number) => {
    clearMessages();
    const draft = availabilityDrafts[day];
    if (!draft?.start_time || !draft?.end_time) return fail('Debes indicar horas de inicio y fin.');

    try {
      const payload = {
        day_of_week: day,
        start_time: toDbTime(draft.start_time),
        end_time: toDbTime(draft.end_time),
        break_start: draft.break_start ? toDbTime(draft.break_start) : null,
        break_end: draft.break_end ? toDbTime(draft.break_end) : null,
        is_active: draft.is_active
      };

      if (draft.id) {
        await availabilityService.updateAvailabilitySlot(draft.id, payload);
      } else {
        await availabilityService.createAvailabilitySlot(payload);
      }
      await loadAllData();
      ok(`Horario guardado para ${DAYS[day]}.`);
    } catch (err) {
      fail('No se pudo guardar el horario.', err);
    }
  };

  const addBlockedDate = async (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();
    if (!blockedDateInput) return fail('Selecciona una fecha.');
    try {
      await availabilityService.addBlockedDate(blockedDateInput, blockedReasonInput.trim() || undefined);
      setBlockedDateInput('');
      setBlockedReasonInput('');
      await loadAllData();
      ok('Fecha bloqueada agregada.');
    } catch (err) {
      fail('No se pudo agregar la fecha bloqueada.', err);
    }
  };

  const removeBlockedDate = async (id: string) => {
    if (!window.confirm('Quitar esta fecha bloqueada?')) return;
    clearMessages();
    try {
      await availabilityService.removeBlockedDate(id);
      await loadAllData();
      ok('Fecha bloqueada eliminada.');
    } catch (err) {
      fail('No se pudo eliminar la fecha bloqueada.', err);
    }
  };

  const uploadImage = async (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();
    if (!uploadFile) return fail('Selecciona una imagen.');
    if (!uploadTitle.trim()) return fail('El nombre de la imagen es obligatorio.');

    try {
      const uploadResult = await galleryService.uploadImage(uploadFile);
      await galleryService.createGalleryImage({
        title: uploadTitle.trim(),
        description: uploadDescription.trim() || null,
        image_url: uploadResult.publicUrl,
        storage_path: uploadResult.path,
        service_id: null,
        display_order: null,
        active: true
      });
      setUploadFile(null);
      setUploadTitle('');
      setUploadDescription('');
      await loadAllData();
      ok('Imagen subida.');
    } catch (err) {
      fail('No se pudo subir la imagen.', err);
    }
  };

  const editImage = async (image: GalleryImage) => {
    const newTitle = window.prompt('Nuevo nombre de la imagen:', image.title);
    if (newTitle === null) return;
    const newDescription = window.prompt(
      'Nueva descripcion (deja vacio para quitarla):',
      image.description || ''
    );
    if (newDescription === null) return;

    clearMessages();
    try {
      await galleryService.updateGalleryImage(image.id, {
        title: newTitle.trim(),
        description: newDescription.trim() || null
      });
      await loadAllData();
      ok('Imagen actualizada.');
    } catch (err) {
      fail('No se pudo actualizar la imagen.', err);
    }
  };

  const deleteImage = async (id: string) => {
    if (!window.confirm('Eliminar esta imagen?')) return;
    clearMessages();
    try {
      await galleryService.deleteGalleryImage(id);
      await loadAllData();
      ok('Imagen eliminada.');
    } catch (err) {
      fail('No se pudo eliminar la imagen.', err);
    }
  };

  const patchBusinessForm = (patch: Partial<BusinessProfileForm>) => {
    setBusinessForm((prev) => ({ ...prev, ...patch }));
  };

  const saveBusinessInfo = async (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();

    if (!businessForm.business_name.trim()) return fail('El nombre del negocio es obligatorio.');
    if (!businessForm.tagline.trim()) return fail('El slogan es obligatorio.');
    if (!businessForm.hero_title.trim()) return fail('El titulo principal es obligatorio.');
    if (!businessForm.hero_subtitle.trim()) return fail('El subtitulo principal es obligatorio.');
    if (!businessForm.about_title.trim()) return fail('El titulo de sobre mi es obligatorio.');
    if (!businessForm.about_description.trim()) return fail('La descripcion de sobre mi es obligatoria.');
    if (!businessForm.footer_description.trim()) return fail('La descripcion del footer es obligatoria.');

    try {
      const updated = await businessProfileService.updateBusinessProfile({
        business_name: businessForm.business_name,
        tagline: businessForm.tagline,
        hero_title: businessForm.hero_title,
        hero_subtitle: businessForm.hero_subtitle,
        about_title: businessForm.about_title,
        about_description: businessForm.about_description,
        footer_description: businessForm.footer_description,
        contact_phone: businessForm.contact_phone,
        contact_whatsapp: businessForm.contact_whatsapp,
        contact_email: businessForm.contact_email,
        address_line_1: businessForm.address_line_1,
        address_line_2: businessForm.address_line_2,
        maps_url: businessForm.maps_url,
        instagram_url: businessForm.instagram_url,
      });

      setBusinessProfile(updated);
      setBusinessForm(mapBusinessProfileToForm(updated));
      applyProfile(updated);
      ok('Informacion del negocio actualizada.');
    } catch (err) {
      fail('No se pudo actualizar la informacion del negocio.', err);
    }
  };

  const uploadBrandAsset = async (kind: 'logo' | 'profile') => {
    clearMessages();
    const selectedFile = kind === 'logo' ? logoFile : profilePhotoFile;
    if (!selectedFile) {
      fail(kind === 'logo' ? 'Selecciona un archivo para el logo.' : 'Selecciona un archivo para la foto de perfil.');
      return;
    }

    try {
      const updated = await businessProfileService.replaceBrandingAsset(kind, selectedFile);
      setBusinessProfile(updated);
      setBusinessForm(mapBusinessProfileToForm(updated));
      applyProfile(updated);
      if (kind === 'logo') setLogoFile(null);
      if (kind === 'profile') setProfilePhotoFile(null);
      ok(kind === 'logo' ? 'Logo actualizado.' : 'Foto de perfil actualizada.');
    } catch (err) {
      fail('No se pudo subir el archivo de branding.', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Validando sesion admin...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Acceso Admin</h1>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Inicia sesion con tu usuario de Supabase Auth
          </p>
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="admin@tu-dominio.com"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Contrasena"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg font-semibold disabled:opacity-60"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administracion</h1>
            <p className="text-sm text-gray-600">{email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Salir</span>
          </button>
        </div>

        {error && <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">{error}</div>}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <div className="flex space-x-4 mb-8 overflow-x-auto">
          {[
            { tab: 'appointments', icon: Calendar, label: 'Citas' },
            { tab: 'services', icon: Clock, label: 'Servicios' },
            { tab: 'availability', icon: Clock, label: 'Horarios' },
            { tab: 'blocked-dates', icon: Calendar, label: 'Fechas bloqueadas' },
            { tab: 'gallery', icon: Image, label: 'Galeria' },
            { tab: 'business', icon: Building2, label: 'Negocio' },
            { tab: 'stats', icon: BarChart3, label: 'Estadisticas' }
          ].map(({ tab, icon: Icon, label }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as AdminTab)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-pink-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {loading && <div className="text-center text-gray-600 mb-6">Cargando...</div>}

        {!loading && activeTab === 'appointments' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">#</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Cliente</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Servicio</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Fecha</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Hora</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Estado</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appointments.map((apt) => {
                    const service = services.find((s) => s.id === apt.service_id);
                    return (
                      <tr key={apt.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{apt.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{apt.client_name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{service?.name || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(apt.appointment_date).toLocaleDateString('es-ES')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{apt.appointment_time}</td>
                        <td className="px-4 py-3 text-sm">
                          <select
                            value={apt.status}
                            onChange={(event) =>
                              handleStatusChange(apt.id, event.target.value as Appointment['status'])
                            }
                            className="px-3 py-1 rounded-lg border border-gray-300 text-sm"
                          >
                            <option value="pending">Pendiente</option>
                            <option value="confirmed">Confirmada</option>
                            <option value="completed">Completada</option>
                            <option value="cancelled">Cancelada</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusChange(apt.id, 'cancelled')}
                              className="px-3 py-1 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleDeleteAppointment(apt.id)}
                              className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {appointments.length === 0 && <div className="p-8 text-center text-gray-600">No hay citas.</div>}
          </div>
        )}

        {!loading && activeTab === 'services' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                {editingServiceId ? 'Editar servicio' : 'Nuevo servicio'}
              </h2>
              <form onSubmit={saveService} className="space-y-3">
                <input
                  type="text"
                  value={serviceForm.name}
                  onChange={(event) => setServiceForm((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Nombre"
                  required
                />
                <textarea
                  value={serviceForm.description}
                  onChange={(event) =>
                    setServiceForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Descripcion"
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min={1}
                    value={serviceForm.duration_minutes}
                    onChange={(event) =>
                      setServiceForm((prev) => ({ ...prev, duration_minutes: event.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Min"
                    required
                  />
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={serviceForm.price}
                    onChange={(event) => setServiceForm((prev) => ({ ...prev, price: event.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Precio"
                    required
                  />
                </div>
                <input
                  type="text"
                  value={serviceForm.category}
                  onChange={(event) => setServiceForm((prev) => ({ ...prev, category: event.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Categoria"
                  required
                />
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={serviceForm.active}
                    onChange={(event) => setServiceForm((prev) => ({ ...prev, active: event.target.checked }))}
                  />
                  Activo
                </label>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg">
                    {editingServiceId ? 'Actualizar' : 'Crear'}
                  </button>
                  {editingServiceId && (
                    <button
                      type="button"
                      onClick={resetServiceForm}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 rounded-lg border ${
                    service.active ? 'border-gray-200' : 'border-yellow-300 bg-yellow-50'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.description}</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {service.duration_minutes} min | ${service.price} | {service.category}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditService(service)}
                        className="px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => toggleService(service)}
                        className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                      >
                        {service.active ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {services.length === 0 && <div className="text-center text-gray-600 py-8">No hay servicios.</div>}
            </div>
          </div>
        )}

        {!loading && activeTab === 'availability' && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-3">
            {Object.entries(DAYS).map(([dayValue, label]) => {
              const day = Number(dayValue);
              const draft = availabilityDrafts[day] || defaultDraft(day);
              return (
                <div key={day} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid lg:grid-cols-12 gap-2 items-end">
                    <div className="lg:col-span-2 font-semibold text-gray-900">{label}</div>
                    <input
                      type="time"
                      value={draft.start_time}
                      onChange={(event) => patchDraft(day, { start_time: event.target.value })}
                      className="lg:col-span-2 px-2 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="time"
                      value={draft.end_time}
                      onChange={(event) => patchDraft(day, { end_time: event.target.value })}
                      className="lg:col-span-2 px-2 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="time"
                      value={draft.break_start}
                      onChange={(event) => patchDraft(day, { break_start: event.target.value })}
                      className="lg:col-span-2 px-2 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="time"
                      value={draft.break_end}
                      onChange={(event) => patchDraft(day, { break_end: event.target.value })}
                      className="lg:col-span-2 px-2 py-2 border border-gray-300 rounded-lg"
                    />
                    <label className="lg:col-span-1 flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={draft.is_active}
                        onChange={(event) => patchDraft(day, { is_active: event.target.checked })}
                      />
                      Activo
                    </label>
                    <button
                      onClick={() => saveAvailability(day)}
                      className="lg:col-span-1 px-3 py-2 rounded bg-pink-600 text-white hover:bg-pink-700"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              );
            })}
            {availabilitySlots.length === 0 && (
              <div className="p-4 text-sm rounded border border-yellow-300 bg-yellow-50 text-yellow-800">
                No hay horarios creados. Guarda cada dia para inicializarlo.
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === 'blocked-dates' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Bloquear fecha</h2>
              <form onSubmit={addBlockedDate} className="space-y-3">
                <input
                  type="date"
                  value={blockedDateInput}
                  onChange={(event) => setBlockedDateInput(event.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  value={blockedReasonInput}
                  onChange={(event) => setBlockedReasonInput(event.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Motivo (opcional)"
                />
                <button type="submit" className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg">
                  Agregar
                </button>
              </form>
            </div>
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 space-y-2">
              {blockedDates.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(item.blocked_date).toLocaleDateString('es-ES')}
                    </p>
                    {item.reason && <p className="text-sm text-gray-600">{item.reason}</p>}
                  </div>
                  <button
                    onClick={() => removeBlockedDate(item.id)}
                    className="px-3 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Quitar
                  </button>
                </div>
              ))}
              {blockedDates.length === 0 && <div className="text-center text-gray-600 py-8">Sin fechas bloqueadas.</div>}
            </div>
          </div>
        )}

        {!loading && activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Subir imagen</h2>
              <form onSubmit={uploadImage} className="grid md:grid-cols-4 gap-3 items-end">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
                  className="md:col-span-1 text-sm"
                  required
                />
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(event) => setUploadTitle(event.target.value)}
                  className="md:col-span-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Nombre"
                  required
                />
                <input
                  type="text"
                  value={uploadDescription}
                  onChange={(event) => setUploadDescription(event.target.value)}
                  className="md:col-span-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Descripcion"
                />
                <button type="submit" className="md:col-span-1 px-4 py-2 bg-pink-600 text-white rounded-lg">
                  Subir
                </button>
              </form>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <div key={image.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <img src={image.image_url} alt={image.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <p className="font-semibold text-gray-900">{image.title}</p>
                    {image.description && <p className="text-sm text-gray-600 mt-1">{image.description}</p>}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => editImage(image)}
                        className="flex-1 px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteImage(image.id)}
                        className="flex-1 px-3 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Borrar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {galleryImages.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-600">
                No hay imagenes registradas.
              </div>
            )}
          </div>
        )}

        {!loading && activeTab === 'business' && (
          <div className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Logo del negocio</h2>
                {businessProfile?.logo_url ? (
                  <img
                    src={businessProfile.logo_url}
                    alt="Logo actual"
                    className="w-28 h-28 rounded-full object-cover border border-pink-200 mb-4"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 mb-4">
                    Sin logo
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setLogoFile(event.target.files?.[0] ?? null)}
                  className="w-full text-sm mb-3"
                />
                <button
                  type="button"
                  onClick={() => uploadBrandAsset('logo')}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Subir logo
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Foto de perfil</h2>
                {businessProfile?.profile_image_url ? (
                  <img
                    src={businessProfile.profile_image_url}
                    alt="Foto de perfil actual"
                    className="w-28 h-28 rounded-full object-cover border border-pink-200 mb-4"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 mb-4">
                    Sin foto
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setProfilePhotoFile(event.target.files?.[0] ?? null)}
                  className="w-full text-sm mb-3"
                />
                <button
                  type="button"
                  onClick={() => uploadBrandAsset('profile')}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Subir foto de perfil
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Informacion del negocio</h2>
              <form onSubmit={saveBusinessInfo} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={businessForm.business_name}
                    onChange={(event) => patchBusinessForm({ business_name: event.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Nombre del negocio"
                    required
                  />
                  <input
                    type="text"
                    value={businessForm.tagline}
                    onChange={(event) => patchBusinessForm({ tagline: event.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Slogan"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={businessForm.hero_title}
                    onChange={(event) => patchBusinessForm({ hero_title: event.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Titulo principal (inicio)"
                    required
                  />
                  <input
                    type="text"
                    value={businessForm.hero_subtitle}
                    onChange={(event) => patchBusinessForm({ hero_subtitle: event.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Subtitulo principal (inicio)"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={businessForm.about_title}
                    onChange={(event) => patchBusinessForm({ about_title: event.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Titulo de sobre mi"
                    required
                  />
                  <input
                    type="text"
                    value={businessForm.footer_description}
                    onChange={(event) => patchBusinessForm({ footer_description: event.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Descripcion corta para footer"
                    required
                  />
                </div>

                <textarea
                  value={businessForm.about_description}
                  onChange={(event) => patchBusinessForm({ about_description: event.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                  placeholder="Descripcion de sobre mi (puedes usar saltos de linea)"
                  required
                />

                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={businessForm.contact_phone}
                    onChange={(event) => patchBusinessForm({ contact_phone: event.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Telefono"
                  />
                  <input
                    type="text"
                    value={businessForm.contact_whatsapp}
                    onChange={(event) => patchBusinessForm({ contact_whatsapp: event.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="WhatsApp (numero o URL)"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="email"
                    value={businessForm.contact_email}
                    onChange={(event) => patchBusinessForm({ contact_email: event.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Email de contacto"
                  />
                  <input
                    type="url"
                    value={businessForm.instagram_url}
                    onChange={(event) => patchBusinessForm({ instagram_url: event.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="URL de Instagram"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={businessForm.address_line_1}
                    onChange={(event) => patchBusinessForm({ address_line_1: event.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Direccion linea 1"
                  />
                  <input
                    type="text"
                    value={businessForm.address_line_2}
                    onChange={(event) => patchBusinessForm({ address_line_2: event.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Direccion linea 2"
                  />
                </div>

                <input
                  type="url"
                  value={businessForm.maps_url}
                  onChange={(event) => patchBusinessForm({ maps_url: event.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="URL de Google Maps"
                />

                <div>
                  <button type="submit" className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
                    Guardar informacion del negocio
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {!loading && activeTab === 'stats' && (
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600 text-sm">Total citas</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{appointments.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600 text-sm">Confirmadas</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {appointments.filter((a) => a.status === 'confirmed').length}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600 text-sm">Pendientes</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {appointments.filter((a) => a.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-600 text-sm">Servicios activos</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {services.filter((s) => s.active).length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
