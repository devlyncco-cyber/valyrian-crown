import React, { useState } from 'react';
import { Save, ShieldCheck, RotateCcw } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAEAEA]">
        <div>
          <div className="flex items-center gap-2 text-[#777777] text-xs font-mono tracking-widest uppercase mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#111111]" />
            <span>Store Configuration</span>
          </div>
          <h1 className="text-2xl font-heading font-medium uppercase tracking-tight text-[#111111]">
            Brand & Store Settings
          </h1>
          <p className="text-xs text-[#777777] mt-1">
            Configure public brand metadata, direct WhatsApp order routing, and hero content.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="px-3.5 py-2 bg-white border border-[#EAEAEA] text-[#777777] hover:text-[#111111] rounded-[1px] text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Identity & Tagline */}
        <div className="bg-white rounded-[1px] border border-[#EAEAEA] p-6 space-y-4">
          <h2 className="text-xs uppercase font-medium tracking-wider text-[#111111] pb-2 border-b border-[#EAEAEA]">
            1. Brand Identity & Taglines
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                Brand Name
              </label>
              <input
                type="text"
                required
                value={formData.brand_name}
                onChange={(e) => handleChange('brand_name', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                Official Tagline
              </label>
              <input
                type="text"
                required
                value={formData.brand_tagline}
                onChange={(e) => handleChange('brand_tagline', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
              Brand Philosophy & Description
            </label>
            <textarea
              rows={3}
              value={formData.brand_description}
              onChange={(e) => handleChange('brand_description', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] focus:outline-none focus:border-[#111111] leading-relaxed"
            />
          </div>
        </div>

        {/* 2. Direct Contacts & WhatsApp Order Destination */}
        <div className="bg-white rounded-[1px] border border-[#EAEAEA] p-6 space-y-4">
          <h2 className="text-xs uppercase font-medium tracking-wider text-[#111111] pb-2 border-b border-[#EAEAEA]">
            2. Direct WhatsApp Routing & Customer Contacts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                WhatsApp Order Recipient Number * (Ghana Intl format)
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp_number}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                placeholder="233509758180"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] font-mono font-medium focus:outline-none focus:border-[#111111]"
              />
              <p className="text-[10px] text-[#777777] mt-1">
                Format without '+' (e.g. 233509758180). All WhatsApp checkouts will route here.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                Customer Phone Support Line
              </label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
                placeholder="0554381898"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                value={formData.instagram_handle}
                onChange={(e) => handleChange('instagram_handle', e.target.value)}
                placeholder="@valyriancrown._"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={formData.instagram_url}
                onChange={(e) => handleChange('instagram_url', e.target.value)}
                placeholder="https://instagram.com/valyriancrown._"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                Snapchat Username
              </label>
              <input
                type="text"
                value={formData.snapchat_handle}
                onChange={(e) => handleChange('snapchat_handle', e.target.value)}
                placeholder="lebenam.mm"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>
        </div>

        {/* 3. Homepage Hero Banner Customization */}
        <div className="bg-white rounded-[1px] border border-[#EAEAEA] p-6 space-y-4">
          <h2 className="text-xs uppercase font-medium tracking-wider text-[#111111] pb-2 border-b border-[#EAEAEA]">
            3. Homepage Hero & Featured Drops Display
          </h2>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
              Hero Main Heading
            </label>
            <input
              type="text"
              value={formData.hero_heading}
              onChange={(e) => handleChange('hero_heading', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
              Hero Supporting Copy
            </label>
            <input
              type="text"
              value={formData.hero_description}
              onChange={(e) => handleChange('hero_description', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured_collection_visible}
                onChange={(e) => handleChange('featured_collection_visible', e.target.checked)}
                className="w-4 h-4 rounded-[1px] text-[#111111] border-[#EAEAEA]"
              />
              <span className="text-xs font-medium uppercase tracking-wide text-[#111111]">
                Display Featured Drops Section on Homepage
              </span>
            </label>
          </div>
        </div>

        {/* 4. Currency Configuration */}
        <div className="bg-white rounded-[1px] border border-[#EAEAEA] p-6 space-y-4">
          <h2 className="text-xs uppercase font-medium tracking-wider text-[#111111] pb-2 border-b border-[#EAEAEA]">
            4. Currency & Locale
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                Currency Code
              </label>
              <input
                type="text"
                value={formData.currency_code}
                onChange={(e) => handleChange('currency_code', e.target.value)}
                placeholder="GHS"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={formData.currency_symbol}
                onChange={(e) => handleChange('currency_symbol', e.target.value)}
                placeholder="GH₵"
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs font-mono text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-[#EAEAEA]">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-[#111111] hover:bg-[#262626] text-white rounded-[1px] text-xs font-medium uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-40"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Updating Store...' : 'Save All Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
