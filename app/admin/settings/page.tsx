'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { createClient } from '@/lib/supabase/client';
import {
  Sliders,
  Save,
  CheckCircle,
  AlertCircle,
  Globe,
  Search,
  Megaphone,
  RefreshCw,
  Eye,
  Sparkles
} from 'lucide-react';

interface SiteSettingsData {
  site_title: string;
  site_description: string;
  hero_title: string;
  hero_description: string;
  seo_keywords: string;
  contact_email: string;
  announcement: string;
}

export default function SiteSettingsCMSPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [formData, setFormData] = useState<SiteSettingsData>({
    site_title: 'Belajar Alat Ukur - Metrologi Industri',
    site_description: 'Platform E-Learning Gamifikasi interaktif 2D & 3D untuk belajar Jangka Sorong dan Mikrometer Sekrup.',
    hero_title: 'Kuasai Alat Ukur Presisi Secara Interaktif',
    hero_description: 'Pelajari cara membaca Jangka Sorong & Mikrometer Sekrup melalui modul interaktif, simulasi 3D realistis, dan tantangan Quiz ber-point!',
    seo_keywords: 'alat ukur, jangka sorong, mikrometer sekrup, metrologi, e-learning, simulasi 3D',
    contact_email: 'admin@alatukur.id',
    announcement: 'Selamat datang di E-Learning Alat Ukur Presisi!',
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (data && !error) {
        setFormData({
          site_title: data.site_title || formData.site_title,
          site_description: data.site_description || formData.site_description,
          hero_title: data.hero_title || formData.hero_title,
          hero_description: data.hero_description || formData.hero_description,
          seo_keywords: data.seo_keywords || formData.seo_keywords,
          contact_email: data.contact_email || formData.contact_email,
          announcement: data.announcement || formData.announcement,
        });
      }
    } catch (err) {
      console.warn('Unable to load dynamic site settings from Supabase, using defaults:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          {
            id: 1,
            ...formData,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );

      if (error) {
        setNotification({ type: 'error', message: `Failed to save site settings: ${error.message}` });
      } else {
        setNotification({ type: 'success', message: 'Website global settings updated & published successfully!' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Error updating settings.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader title="Site Settings CMS (Global Information)" />

      {/* Header Info Banner */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-600" />
            Global Site Content Management
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Modify header titles, hero announcements, SEO keywords, and contact metadata dynamically.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSettings}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition border border-gray-300/80"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Reload
        </button>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Real-time Hero Live Preview Box */}
      <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live Landing Page Hero Preview
            </h3>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
            Real-Time Render
          </span>
        </div>

        {formData.announcement && (
          <div className="bg-emerald-600 text-white text-[11px] font-bold py-1.5 px-4 rounded-xl text-center shadow-xs flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{formData.announcement}</span>
          </div>
        )}

        <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/60 text-center space-y-2">
          <h1 className="text-lg font-black text-white tracking-tight">
            {formData.hero_title || 'Hero Title Placeholder'}
          </h1>
          <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
            {formData.hero_description || 'Hero description paragraph...'}
          </p>
        </div>
      </div>

      {/* Form Settings */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: General Site Identity */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Globe className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
              1. Website Identity & Header
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Site Main Title
              </label>
              <input
                type="text"
                name="site_title"
                required
                value={formData.site_title}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Support Contact Email
              </label>
              <input
                type="email"
                name="contact_email"
                required
                value={formData.contact_email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Site Meta Description
            </label>
            <textarea
              name="site_description"
              rows={2}
              required
              value={formData.site_description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Section 2: Hero Banner Content */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Megaphone className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
              2. Hero Section & Header Banner
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Hero Section Headline Title
            </label>
            <input
              type="text"
              name="hero_title"
              required
              value={formData.hero_title}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Hero Section Description Paragraph
            </label>
            <textarea
              name="hero_description"
              rows={3}
              required
              value={formData.hero_description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Header Top Announcement Ribbon Text
            </label>
            <input
              type="text"
              name="announcement"
              value={formData.announcement}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Section 3: SEO Keywords */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Search className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
              3. Search Engine Optimization (SEO)
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              SEO Meta Keywords (comma separated)
            </label>
            <input
              type="text"
              name="seo_keywords"
              value={formData.seo_keywords}
              onChange={handleChange}
              placeholder="alat ukur, jangka sorong, mikrometer sekrup, metrologi"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-900/20 disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving Settings...' : 'Save & Publish Site Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
