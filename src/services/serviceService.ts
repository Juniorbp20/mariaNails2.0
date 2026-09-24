/**
 * serviceService.ts — Lectura y gestión de servicios en Supabase.
 *
 * Tabla `services`: cada fila es un servicio reservable (manicura, gel,
 * pedicura, cada acrílico #1-#8, nail art) con precio RD$ y duración.
 * La web pública solo ve active=true; /admin ve y edita todos.
 */
import { supabase } from '../lib/supabase';
import type { Service } from '../types';

/** API de servicios: listar, ver uno, crear, editar y activar/desactivar. */
export const serviceService = {
  /** Lista servicios activos (o todos si includeInactive) ordenados por creación. */
  async getServices(options?: { includeInactive?: boolean }): Promise<Service[]> {
    const includeInactive = options?.includeInactive ?? false;

    let query = supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true });

    if (!includeInactive) {
      query = query.eq('active', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  /** Trae un servicio por su id (para el modal de detalle y la reserva). */
  async getServiceById(id: string): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /** Crea un servicio nuevo desde /admin (ej: "Acrílico Cover Liso #4"). */
  async createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /** Actualiza nombre, precio, duración o descripción de un servicio. */
  async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /** Activa/desactiva sin borrar (lo oculto no se puede reservar). */
  async toggleServiceActive(id: string, active: boolean): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update({ active })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
