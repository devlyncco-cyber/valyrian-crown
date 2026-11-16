import { Profile } from '@/types';
import { supabase, isSupabaseConfigured } from '../supabase/client';

const ADMINS_STORAGE_KEY = 'valyrian_admins';

const defaultAdmins: Profile[] = [
  {
    id: 'a1000000-0000-0000-0000-000000000001',
    full_name: 'Valyrian Owner',
    email: 'admin@valyriancrown.com',
    role: 'admin',
    created_at: '2026-11-16T00:00:00Z',
    updated_at: '2026-11-16T00:00:00Z',
  },
];

export const adminService = {
  async getAdmins(): Promise<Profile[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'admin')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn('Falling back to local admins:', err);
      }
    }

    const local = localStorage.getItem(ADMINS_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Error parsing local admins', e);
      }
    } else {
      localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(defaultAdmins));
    }
    return defaultAdmins;
  },

  async addAdmin(payload: { email: string; full_name: string; password?: string }): Promise<Profile> {
    const newAdmin: Profile = {
      id: crypto.randomUUID(),
      full_name: payload.full_name,
      email: payload.email,
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured) {
      // 1. Create auth user if password provided
      if (payload.password) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: payload.email,
          password: payload.password,
          options: {
            data: {
              full_name: payload.full_name,
            },
          },
        });

        if (authError) throw authError;

        if (authData.user) {
          newAdmin.id = authData.user.id;
        }
      }

      // 2. Insert or update profile with admin role
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: newAdmin.id,
          full_name: newAdmin.full_name,
          role: 'admin',
        })
        .select()
        .single();

      if (error) throw error;
      if (data) return { ...data, email: payload.email };
    }

    const current = await this.getAdmins();
    const updated = [newAdmin, ...current];
    localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(updated));
    return newAdmin;
  },

  async removeAdmin(adminId: string): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'user' })
        .eq('id', adminId);

      if (error) throw error;
      return;
    }

    const current = await this.getAdmins();
    if (current.length <= 1) {
      throw new Error('Cannot remove the sole remaining administrator.');
    }
    const filtered = current.filter((a) => a.id !== adminId);
    localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(filtered));
  },
};
