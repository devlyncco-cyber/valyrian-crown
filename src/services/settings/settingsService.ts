import { StoreSettings } from '@/types';
import { initialSettings } from '@/data/initialSettings';
import { supabase, isSupabaseConfigured } from '../supabase/client';

const SETTINGS_STORAGE_KEY = 'valyrian_store_settings';

export const settingsService = {
  async getSettings(): Promise<StoreSettings> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('setting_key, setting_value');

        if (!error && data && data.length > 0) {
          const settingsObj: Partial<StoreSettings> = {};
          data.forEach((row) => {
            (settingsObj as Record<string, unknown>)[row.setting_key] = row.setting_value;
          });
          return { ...initialSettings, ...settingsObj };
        }
      } catch (err) {
        console.warn('Falling back to local store settings:', err);
      }
    }

    const local = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (local) {
      try {
        return { ...initialSettings, ...JSON.parse(local) };
      } catch (e) {
        console.error('Error parsing local settings', e);
      }
    }
    return initialSettings;
  },

  async updateSettings(newSettings: Partial<StoreSettings>): Promise<StoreSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...newSettings };

    if (isSupabaseConfigured) {
      try {
        const updates = Object.entries(newSettings).map(([key, value]) => ({
          setting_key: key,
          setting_value: value,
        }));

        const { error } = await supabase
          .from('store_settings')
          .upsert(updates, { onConflict: 'setting_key' });

        if (error) {
          console.error('Failed to update Supabase store_settings:', error);
          throw error;
        }
      } catch (err) {
        console.error('Supabase settings update error:', err);
        throw err;
      }
    }

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },
};
