import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database.types';

type User = Database['public']['Tables']['users']['Row'];

export const userService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();

    if (error) throw error;
    return data as User;
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  async createProfile(profile: Partial<User>) {
    const { data, error } = await supabase.from('users').insert([profile]).select().single();

    if (error) throw error;
    return data as User;
  },
};
