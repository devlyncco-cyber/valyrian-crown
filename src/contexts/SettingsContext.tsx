import React, { createContext, useContext, useEffect, useState } from 'react';
import { StoreSettings } from '@/types';
import { initialSettings } from '@/data/initialSettings';
import { settingsService } from '@/services/settings/settingsService';

interface SettingsContextType {
  settings: StoreSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [isLoading, setIsLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (e) {
      console.error('Failed to load store settings:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const updated = await settingsService.updateSettings(newSettings);
    setSettings(updated);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        refreshSettings: loadSettings,
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useStoreSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useStoreSettings must be used within a SettingsProvider');
  }
  return context;
};
