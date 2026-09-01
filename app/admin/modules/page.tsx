'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { createClient } from '@/lib/supabase/client';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  X,
  Save,
  Sparkles,
  RefreshCw,
  FileText
} from 'lucide-react';

interface ModuleRecord {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  content_body: string;
  image_url?: string;
  order_index: number;
  is_published: boolean;
  created_at?: string;
}

export default function ModuleManagementCMSPage() {
  const supabase = createClient();
  const [modules, setModules] = useState<ModuleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [editingModule, setEditingModule] = useState<ModuleRecord | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Metrologi Industri',
    description: '',
    content_body: '',
    image_url: '',
    order_index: 1,
    is_published: true,
  });

  const fetchModules = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('order_index', { ascending: true });

      if (!error && data) {
        setModules(data);
      }
    } catch (err) {
      console.error('Error fetching modules:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const openCreateModal = () => {
    setEditingModule(null);
    setActiveTab('editor');
    setFormData({
      title: '',
      slug: '',
      category: 'Metrologi Industri',
      description: '',
      content_body: '',
      image_url: '',
      order_index: modules.length + 1,
      is_published: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (mod: ModuleRecord) => {
    setEditingModule(mod);
    setActiveTab('editor');
    setFormData({
      title: mod.title,
      slug: mod.slug,
      category: mod.category || 'Metrologi Industri',
      description: mod.description || '',
      content_body: mod.content_body || '',
      image_url: mod.image_url || '',
      order_index: mod.order_index || 1,
      is_published: mod.is_published,
    });
    setIsModalOpen(true);
  };

  const applyTemplate = (type: 'vernier' | 'micrometer') => {
    if (type === 'vernier') {
      setFormData({
        title: 'Pengenalan Jangka Sorong (Vernier Caliper)',
        slug: 'pengenalan-jangka-sorong',
        category: 'Metrologi Presisi',
        description: 'Pelajari komponen utama, prinsip skala nonius, dan teknik pembacaan jangka sorong ketelitian 0.05mm dan 0.02mm.',
        content_body: `## Prinsip Kerja Jangka Sorong

Jangka sorong adalah alat ukur presisi yang digunakan untuk mengukur dimensi luar, dimensi dalam, dan kedalaman suatu benda kerja.

### Komponen Utama:
1. **Rahang Tetap & Rahang Geser (Luar)**: Untuk mengukur diameter luar/tebal.
2. **Rahang Atas (Dalam)**: Untuk mengukur diameter dalam pipa/lubang.
3. **Pengukur Kedalaman (Depth Probe)**: Batang tipis di bagian belakang.
4. **Skala Utama (Main Scale)**: Satuan millimeter (mm) atau inchi.
5. **Skala Nonius (Vernier Scale)**: Memberikan tingkat ketelitian hingga 0.05 mm atau 0.02 mm.

### Rumus Hasil Pembacaan:
Hasil Ukur = Skala Utama + (Skala Nonius x Ketelitian)`,
        image_url: '/Vernier_caliper.svg',
        order_index: 1,
        is_published: true,
      });
    } else {
      setFormData({
        title: 'Pengenalan Mikrometer Sekrup (Micrometer Screw Gauge)',
        slug: 'pengenalan-mikrometer-sekrup',
        category: 'Metrologi Presisi',
        description: 'Memahami mekanisme poros geser, skala thimble, dan pengukuran tingkat mikron ketelitian 0.01mm.',
        content_body: `## Prinsip Kerja Mikrometer Sekrup

Mikrometer sekrup adalah alat ukur yang memiliki tingkat ketelitian lebih tinggi dibanding jangka sorong, mencapai **0.01 mm**.

### Komponen Utama:
1. **Landasan (Anvil)**: Bagian poros tetap penahan benda.
2. **Poros Geser (Spindle)**: Poros bergerak yang menjepit benda.
3. **Bingkai (Frame)**: Rangka berbentuk huruf C dari logam kuat.
4. **Tabung Lengan (Sleeve)**: Berisi skala utama (atas & bawah mm).
5. **Thimble (Roda Putar)**: Berisi 50 garis skala nonius.
6. **Roda Bergigi (Ratchet Stop)**: Memastikan tekanan penjepitan konsisten.

### Rumus Hasil Pembacaan:
Hasil Ukur = Skala Utama Sleeve + (Garis Skala Thimble x 0.01 mm)`,
        image_url: '/Micrometer.svg',
        order_index: 2,
        is_published: true,
      });
    }
  };

  const handleTitleChange = (val: string) => {
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: editingModule ? prev.slug : generatedSlug,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    try {
      if (editingModule) {
        const { error } = await supabase
          .from('modules')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingModule.id);

        if (error) throw error;
        setNotification({ type: 'success', message: `Module "${formData.title}" updated successfully!` });
      } else {
        const { error } = await supabase.from('modules').insert([
          {
            ...formData,
          },
        ]);

        if (error) throw error;
        setNotification({ type: 'success', message: `New module "${formData.title}" created!` });
      }

      setIsModalOpen(false);
      fetchModules();
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to save module.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteModule = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete module "${title}"?`)) return;

    try {
      const { error } = await supabase.from('modules').delete().eq('id', id);
      if (error) throw error;

      setNotification({ type: 'success', message: `Module "${title}" deleted.` });
      setModules((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to delete module.' });
    }
  };

  const togglePublishStatus = async (mod: ModuleRecord) => {
    const updatedStatus = !mod.is_published;
    try {
      const { error } = await supabase
        .from('modules')
        .update({ is_published: updatedStatus })
        .eq('id', mod.id);

      if (error) throw error;

      setModules((prev) =>
        prev.map((m) => (m.id === mod.id ? { ...m, is_published: updatedStatus } : m))
      );
    } catch (err: any) {
      alert(`Error updating publish status: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader title="Module Management CMS (Learning Materials)" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Learning Modules Management ({modules.length})
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Create, edit, reorder, or publish theoretical learning materials for "Modul Belajar".
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-900/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Module</span>
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

      {/* Modules Data Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
            <p className="text-sm font-medium">Loading learning modules...</p>
          </div>
        ) : modules.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                  <th className="py-3.5 px-6">Order</th>
                  <th className="py-3.5 px-6">Module Title & Slug</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {modules.map((mod) => (
                  <tr key={mod.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-4 px-6 font-bold text-gray-900">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-xs font-extrabold text-gray-700 border border-gray-200">
                        #{mod.order_index}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-900 leading-tight">{mod.title}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">/{mod.slug}</p>
                      {mod.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {mod.description}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                        {mod.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => togglePublishStatus(mod)}
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border transition ${
                          mod.is_published
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {mod.is_published ? (
                          <>
                            <Eye className="w-3 h-3 text-emerald-600" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-gray-400" />
                            Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(mod)}
                          className="p-2 text-gray-600 hover:text-emerald-700 bg-gray-100 hover:bg-emerald-50 rounded-lg border border-gray-200 transition"
                          title="Edit Module"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteModule(mod.id, mod.title)}
                          className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition"
                          title="Delete Module"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400 text-sm flex flex-col items-center gap-3">
            <BookOpen className="w-10 h-10 text-gray-300" />
            <p>No learning modules created in Supabase yet.</p>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={openCreateModal}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                + Create Custom Module
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Form for Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-6 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  {editingModule ? 'Edit Learning Module' : 'Create New Learning Module'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Template Fill Buttons (For New Modules) */}
            {!editingModule && (
              <div className="px-6 pt-4 pb-2 bg-emerald-50/60 border-b border-emerald-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  1-Click Auto Fill Templates:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => applyTemplate('vernier')}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-lg transition"
                  >
                    + Jangka Sorong
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('micrometer')}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold rounded-lg transition"
                  >
                    + Mikrometer Sekrup
                  </button>
                </div>
              </div>
            )}

            {/* Form & Tab Controls */}
            <div className="px-6 pt-3 flex items-center border-b border-gray-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`py-2 px-4 border-b-2 transition ${
                  activeTab === 'editor'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                Content Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`py-2 px-4 border-b-2 transition ${
                  activeTab === 'preview'
                    ? 'border-emerald-600 text-emerald-700 font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                Render Preview
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
              {activeTab === 'editor' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Module Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. Pengenalan Jangka Sorong"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="e.g. pengenalan-jangka-sorong"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Metrologi Industri"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Display Order Index
                      </label>
                      <input
                        type="number"
                        value={formData.order_index}
                        onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 1 })}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Brief Summary Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Short introductory summary for student module cards..."
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Full Content Body (Markdown / Text) *
                    </label>
                    <textarea
                      rows={6}
                      required
                      value={formData.content_body}
                      onChange={(e) => setFormData({ ...formData, content_body: e.target.value })}
                      placeholder="Detailed learning material text..."
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="is_published_cb"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                    />
                    <label htmlFor="is_published_cb" className="text-xs font-bold text-gray-700">
                      Publish module immediately on live site
                    </label>
                  </div>
                </>
              ) : (
                /* Preview Tab */
                <div className="space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs">
                  <div className="border-b border-gray-200 pb-3">
                    <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                      {formData.category || 'Category'}
                    </span>
                    <h2 className="text-lg font-black text-gray-900 mt-2">
                      {formData.title || 'Untitled Module'}
                    </h2>
                    <p className="text-gray-500 text-xs mt-1">{formData.description}</p>
                  </div>

                  <div className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed pt-2">
                    {formData.content_body || 'No content written yet.'}
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-900/20 disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{editingModule ? 'Save Changes' : 'Create & Publish Module'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
