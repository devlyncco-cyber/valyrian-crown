import React, { useState } from 'react';
import { Save, ShieldCheck, Check, RotateCcw } from 'lucide-react';
import { useStoreSettings } from '@/contexts/SettingsContext';
import { StoreSettings } from '@/types';
import { initialSettings } from '@/data/initialSettings';
import { toast } from 'sonner';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useStoreSettings();
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key: keyof StoreSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formData);
      toast.success('Store settings updated and synchronized across website!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update store settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all store settings to brand defaults?')) {
      setFormData({ ...initialSettings });
      toast.info('Settings reset to brand defaults. Click Save to persist.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-brand-gold text-xs font-heading font-medium tracking-widest uppercase mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Store Configuration</span>
          </div>
          <h1 className="text-2xl font-heading font-bold uppercase tracking-tight text-white">
            Brand & Store Settings
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Configure public brand metadata, direct WhatsApp order routing, and hero content.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="px-3.5 py-2 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white rounded text-xs font-heading uppercase flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Identity & Tagline */}
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 space-y-4">
          <h2 className="text-xs uppercase font-heading font-bold tracking-wider text-brand-gold pb-2 border-b border-neutral-800">
            1. Brand Identity & Taglines
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Brand Name
              </label>
              <input
                type="text"
                required
                value={formData.brand_name}
                onChange={(e) => handleChange('brand_name', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Official Tagline
              </label>
              <input
                type="text"
                required
                value={formData.brand_tagline}
                onChange={(e) => handleChange('brand_tagline', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Brand Philosophy & Description
            </label>
            <textarea
              rows={3}
              value={formData.brand_description}
              onChange={(e) => handleChange('brand_description', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-brand-gold leading-relaxed"
            />
          </div>
        </div>

        {/* 2. Direct Contacts & WhatsApp Order Destination */}
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 space-y-4">
          <h2 className="text-xs uppercase font-heading font-bold tracking-wider text-brand-gold pb-2 border-b border-neutral-800">
            2. Direct WhatsApp Routing & Customer Contacts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                WhatsApp Order Recipient Number * (Ghana Intl format)
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp_number}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                placeholder="233509758180"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[10px] text-neutral-500 mt-1">
                International format without '+' (e.g. 233509758180). All WhatsApp checkouts will route here.
              </p>
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Customer Phone Support Line
              </label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                placeholder="0554381898"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                value={formData.instagram_handle}
                onChange={(e) => handleChange('instagram_handle', e.target.value)}
                placeholder="@valyriancrown._"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={formData.instagram_url}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                placeholder="https://instagram.com/valyriancrown._"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Snapchat Username
              </label>
              <input
                type="text"
                value={formData.snapchat_handle}
                onChange={(e) => handleChange('snapchat_handle', e.target.value)}
                placeholder="lebenam.mm"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>
        </div>

        {/* 3. Homepage Hero Banner Customization */}
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 space-y-4">
          <h2 className="text-xs uppercase font-heading font-bold tracking-wider text-brand-gold pb-2 border-b border-neutral-800">
            3. Homepage Hero & Featured Drops Display
          </h2>

          <div>
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Hero Main Heading
            </label>
            <input
              type="text"
              value={formData.hero_heading}
              onChange={(e) => handleChange('hero_heading', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-300 mb-1">
              Hero Supporting Copy
            </label>
            <input
              type="text"
              value={formData.hero_description}
              onChange={(e) => handleChange('hero_description', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured_collection_visible}
                onChange={(e) => handleChange('featured_collection_visible', e.target.checked)}
                className="w-4 h-4 rounded text-brand-gold bg-neutral-950 border-neutral-700"
              />
              <span className="text-xs font-heading font-semibold uppercase text-neutral-200">
                Display Featured Drops Section on Homepage
              </span>
            </label>
          </div>
        </div>

        {/* 4. Currency Configuration */}
        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6 space-y-4">
          <h2 className="text-xs uppercase font-heading font-bold tracking-wider text-brand-gold pb-2 border-b border-neutral-800">
            4. Currency & Locale
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Currency Code
              </label>
              <input
                type="text"
                value={formData.currency_code}
                onChange={(e) => handleChange('currency_code', e.target.value)}
                placeholder="GHS"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-brand-gold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={formData.currency_symbol}
                onChange={(e) => handleChange('currency_symbol', e.target.value)}
                placeholder="GH₵"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-brand-gold font-bold"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-neutral-800">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-brand-gold hover:bg-brand-gold-light text-brand-black rounded text-xs font-heading font-bold uppercase tracking-wider flex items-center gap-2 shadow-luxury transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Updating Store...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
