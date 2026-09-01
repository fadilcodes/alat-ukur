'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { createClient } from '@/lib/supabase/client';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  CheckCircle,
  AlertCircle,
  X,
  Save,
  BookOpen,
  Award,
  RefreshCw,
  Sparkles,
  Eye
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  module_id?: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  points: number;
  explanation?: string;
  order_index: number;
  module_title?: string;
}

interface ModuleSimple {
  id: string;
  title: string;
}

export default function QuizManagementCRUDPage() {
  const supabase = createClient();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [modules, setModules] = useState<ModuleSimple[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('all');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewQuestion, setPreviewQuestion] = useState<QuizQuestion | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);

  const [formData, setFormData] = useState({
    module_id: '',
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A' as 'A' | 'B' | 'C' | 'D',
    points: 10,
    explanation: '',
    order_index: 1,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: modulesData } = await supabase
        .from('modules')
        .select('id, title')
        .order('order_index');

      if (modulesData) {
        setModules(modulesData);
      }

      const { data: questionsData, error: qErr } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('order_index', { ascending: true });

      if (!qErr && questionsData) {
        const enriched = questionsData.map((q) => {
          const mod = modulesData?.find((m) => m.id === q.module_id);
          return {
            ...q,
            module_title: mod ? mod.title : 'General Metrologi',
          };
        });
        setQuestions(enriched);
      }
    } catch (err) {
      console.error('Error loading quiz data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingQuestion(null);
    setFormData({
      module_id: modules[0]?.id || '',
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A',
      points: 10,
      explanation: '',
      order_index: questions.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (q: QuizQuestion) => {
    setEditingQuestion(q);
    setFormData({
      module_id: q.module_id || '',
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: q.correct_answer,
      points: q.points || 10,
      explanation: q.explanation || '',
      order_index: q.order_index || 1,
    });
    setIsModalOpen(true);
  };

  const seedDefaultQuestions = async () => {
    setSeeding(true);
    setNotification(null);

    const defaultSeedData = [
      {
        question_text: 'Berapa tingkat ketelitian (precision) standar dari Jangka Sorong dengan 50 skala nonius?',
        option_a: '0.1 mm',
        option_b: '0.05 mm',
        option_c: '0.02 mm',
        option_d: '0.01 mm',
        correct_answer: 'C',
        points: 10,
        explanation: 'Ketelitian 50 skala nonius = 1 mm / 50 = 0.02 mm.',
        order_index: 1,
      },
      {
        question_text: 'Komponen Mikrometer Sekrup yang berfungsi untuk mencegah penekanan berlebihan pada benda kerja adalah?',
        option_a: 'Anvil (Landasan Tetap)',
        option_b: 'Spindle (Poros Geser)',
        option_c: 'Thimble (Roda Skala Putar)',
        option_d: 'Ratchet Stop (Roda Bergigi)',
        correct_answer: 'D',
        points: 10,
        explanation: 'Ratchet stop memutar poros geser dengan tekanan konstan yang terkontrol.',
        order_index: 2,
      },
      {
        question_text: 'Jika Skala Utama Jangka Sorong menunjukkan 14 mm dan skala nonius ke-7 berimpit tegak lurus (ketelitian 0.05 mm), berapa hasil pengukurannya?',
        option_a: '14.05 mm',
        option_b: '14.35 mm',
        option_c: '14.70 mm',
        option_d: '14.50 mm',
        correct_answer: 'B',
        points: 15,
        explanation: 'Hasil = 14 mm + (7 x 0.05 mm) = 14 mm + 0.35 mm = 14.35 mm.',
        order_index: 3,
      },
    ];

    try {
      const { error } = await supabase.from('quiz_questions').insert(defaultSeedData);
      if (error) throw error;

      setNotification({ type: 'success', message: 'Standard measurement quiz questions seeded successfully!' });
      fetchData();
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to seed quiz questions.' });
    } finally {
      setSeeding(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    const payload = {
      module_id: formData.module_id || null,
      question_text: formData.question_text,
      option_a: formData.option_a,
      option_b: formData.option_b,
      option_c: formData.option_c,
      option_d: formData.option_d,
      correct_answer: formData.correct_answer,
      points: formData.points,
      explanation: formData.explanation,
      order_index: formData.order_index,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingQuestion) {
        const { error } = await supabase
          .from('quiz_questions')
          .update(payload)
          .eq('id', editingQuestion.id);

        if (error) throw error;
        setNotification({ type: 'success', message: 'Quiz question updated successfully!' });
      } else {
        const { error } = await supabase.from('quiz_questions').insert([payload]);

        if (error) throw error;
        setNotification({ type: 'success', message: 'New quiz question added to database!' });
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to save question.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const { error } = await supabase.from('quiz_questions').delete().eq('id', id);
      if (error) throw error;

      setNotification({ type: 'success', message: 'Quiz question deleted.' });
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to delete question.' });
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (selectedModuleFilter === 'all') return true;
    return q.module_id === selectedModuleFilter;
  });

  return (
    <div className="space-y-6">
      <AdminHeader title="Quiz Management CRUD (Questions & Answer Key)" />

      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            Quiz Question Bank ({questions.length})
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Create, edit, and configure answer keys and points for learning module quizzes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {questions.length === 0 && (
            <button
              onClick={seedDefaultQuestions}
              disabled={seeding}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl transition border border-emerald-300"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{seeding ? 'Seeding...' : 'Seed Sample Questions'}</span>
            </button>
          )}

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-emerald-900/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Question</span>
          </button>
        </div>
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

      {/* Module Filter */}
      {modules.length > 0 && (
        <div className="flex items-center gap-2 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
          <BookOpen className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-bold text-gray-700">Filter by Module:</span>
          <select
            value={selectedModuleFilter}
            onChange={(e) => setSelectedModuleFilter(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-800 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Modules ({questions.length})</option>
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
            <p className="text-sm font-medium">Fetching quiz questions from Supabase...</p>
          </div>
        ) : filteredQuestions.length > 0 ? (
          filteredQuestions.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs hover:border-emerald-300 transition duration-150"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Q#{idx + 1}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {q.module_title}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-600" />
                      +{q.points} XP
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 leading-relaxed pt-1">
                    {q.question_text}
                  </h3>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewQuestion(q)}
                    className="p-2 text-gray-600 hover:text-emerald-700 bg-gray-100 hover:bg-emerald-50 rounded-lg border border-gray-200 transition"
                    title="Preview Question"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(q)}
                    className="p-2 text-gray-600 hover:text-emerald-700 bg-gray-100 hover:bg-emerald-50 rounded-lg border border-gray-200 transition"
                    title="Edit Question"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 pt-4 border-t border-gray-100">
                {[
                  { key: 'A', text: q.option_a },
                  { key: 'B', text: q.option_b },
                  { key: 'C', text: q.option_c },
                  { key: 'D', text: q.option_d },
                ].map((opt) => {
                  const isCorrect = q.correct_answer === opt.key;
                  return (
                    <div
                      key={opt.key}
                      className={`p-3 rounded-xl text-xs font-medium border flex items-center justify-between transition ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center font-extrabold text-[11px] ${
                            isCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {opt.key}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                      {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Note if available */}
              {q.explanation && (
                <div className="mt-3 text-xs text-gray-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span className="font-bold text-slate-800">Explanation Note:</span>{' '}
                  {q.explanation}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-400 text-sm flex flex-col items-center gap-3">
            <HelpCircle className="w-10 h-10 text-gray-300" />
            <p>No questions found in this category.</p>
            <div className="flex items-center gap-3 mt-1">
              <button
                onClick={seedDefaultQuestions}
                disabled={seeding}
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Seed Sample Questions</span>
              </button>
              <button
                onClick={openCreateModal}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition"
              >
                + Create Question
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-6 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                {editingQuestion ? 'Edit Quiz Question' : 'Add New Quiz Question'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Associated Module
                  </label>
                  <select
                    value={formData.module_id}
                    onChange={(e) => setFormData({ ...formData, module_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                  >
                    <option value="">-- General Metrologi --</option>
                    {modules.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Points Award (XP)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 10 })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Question Text *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.question_text}
                  onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                  placeholder="e.g. Berapa ketelitian umum pada Jangka Sorong standar?"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                />
              </div>

              {/* 4 Options Input */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Multiple Choice Options *
                </label>

                {[
                  { key: 'option_a', label: 'Option A' },
                  { key: 'option_b', label: 'Option B' },
                  { key: 'option_c', label: 'Option C' },
                  { key: 'option_d', label: 'Option D' },
                ].map((opt) => (
                  <div key={opt.key} className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 font-extrabold text-xs flex items-center justify-center border border-gray-200 shrink-0">
                      {opt.label.split(' ')[1]}
                    </span>
                    <input
                      type="text"
                      required
                      value={(formData as any)[opt.key]}
                      onChange={(e) => setFormData({ ...formData, [opt.key]: e.target.value })}
                      placeholder={`Enter text for ${opt.label}...`}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                    />
                  </div>
                ))}
              </div>

              {/* Correct Answer Selection */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Select Correct Answer Key *
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {(['A', 'B', 'C', 'D'] as const).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData({ ...formData, correct_answer: key })}
                      className={`py-2.5 rounded-xl font-bold text-xs border transition flex items-center justify-center gap-1.5 ${
                        formData.correct_answer === key
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-900/20'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      <span>Option {key}</span>
                      {formData.correct_answer === key && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Explanation Field */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Answer Explanation (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Explain why this answer is correct..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
                />
              </div>

              {/* Modal Actions */}
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
                  <span>{editingQuestion ? 'Save Question' : 'Create Question'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Question Preview Modal */}
      {previewQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Student Question Preview</h3>
              </div>
              <button
                onClick={() => setPreviewQuestion(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <h2 className="text-sm font-bold text-gray-900 leading-relaxed">
                {previewQuestion.question_text}
              </h2>

              <div className="space-y-2">
                {[
                  { key: 'A', text: previewQuestion.option_a },
                  { key: 'B', text: previewQuestion.option_b },
                  { key: 'C', text: previewQuestion.option_c },
                  { key: 'D', text: previewQuestion.option_d },
                ].map((opt) => {
                  const isAnswer = previewQuestion.correct_answer === opt.key;
                  return (
                    <div
                      key={opt.key}
                      className={`p-3 rounded-xl text-xs font-semibold border flex items-center justify-between ${
                        isAnswer
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                            isAnswer
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {opt.key}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                      {isAnswer && (
                        <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-extrabold">
                          CORRECT KEY
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {previewQuestion.explanation && (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-gray-600 border border-slate-200">
                  <span className="font-bold text-slate-900">Explanation:</span>{' '}
                  {previewQuestion.explanation}
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setPreviewQuestion(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-xl transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
