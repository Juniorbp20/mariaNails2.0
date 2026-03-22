import { supabase } from '../lib/supabase';
import type { Service } from '../types';

export const serviceService = {
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

  async getServiceById(id: string): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert([service])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

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
