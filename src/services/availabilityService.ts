import { supabase } from '../lib/supabase';
import type { AvailabilitySlot, BlockedDate } from '../types';
import { getTodayLocalDateString } from '../utils/dateUtils';

export const availabilityService = {
  async getAvailabilitySlots(options?: { includeInactive?: boolean }): Promise<AvailabilitySlot[]> {
    const includeInactive = options?.includeInactive ?? false;

    let query = supabase
      .from('availability_slots')
      .select('*')
      .order('day_of_week', { ascending: true });

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async getAvailabilityByDayOfWeek(dayOfWeek: number): Promise<AvailabilitySlot | null> {
    const { data, error } = await supabase
      .from('availability_slots')
      .select('*')
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getBlockedDates(options?: { includePast?: boolean }): Promise<BlockedDate[]> {
    const includePast = options?.includePast ?? false;

    let query = supabase
      .from('blocked_dates')
      .select('*')
      .order('blocked_date', { ascending: true });

    if (!includePast) {
      query = query.gte('blocked_date', getTodayLocalDateString());
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  },

  async isDateBlocked(date: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('blocked_dates')
      .select('id')
      .eq('blocked_date', date)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  async updateAvailabilitySlot(id: string, updates: Partial<AvailabilitySlot>): Promise<AvailabilitySlot> {
    const { data, error } = await supabase
      .from('availability_slots')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createAvailabilitySlot(slot: Omit<AvailabilitySlot, 'id' | 'created_at' | 'updated_at'>): Promise<AvailabilitySlot> {
    const { data, error } = await supabase
      .from('availability_slots')
      .insert([slot])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addBlockedDate(blockedDate: string, reason?: string): Promise<BlockedDate> {
    const { data, error } = await supabase
      .from('blocked_dates')
      .insert([{ blocked_date: blockedDate, reason }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeBlockedDate(id: string): Promise<void> {
    const { error } = await supabase
      .from('blocked_dates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
