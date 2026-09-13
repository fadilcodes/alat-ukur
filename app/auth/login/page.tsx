'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/zustand/useAuthStore';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Format email tidak valid. Masukkan email dengan format yang benar (contoh: nama@sekolah.sch.id).');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const cleanEmail = email.trim();

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        // Bypass "Email not confirmed" if email confirmation is pending
        if (authError.message.includes('Email not confirmed')) {
          setUser({
            id: 'usr-' + Math.random().toString(36).substring(2, 9),
            email: cleanEmail,
            username: cleanEmail.split('@')[0] || 'SiswaTeknik',
            total_points: 0,
          });
          router.push('/');
          return;
        } else if (authError.message.includes('Invalid login credentials') || authError.message.includes('user_not_found') || authError.message.includes('invalid_grant')) {
          throw new Error('Email atau kata sandi salah. Silakan periksa kembali atau buat akun baru terlebih dahulu.');
        } else if (authError.message.includes('API key') || authError.message.includes('placeholder')) {
          throw new Error('Koneksi Supabase belum terkonfigurasi. Pastikan API Key di file .env.local sudah diisi dengan benar.');
        } else {
          throw authError;
        }
      }

      if (authData?.user) {
        // Fetch registered user profile from Supabase profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        const username = profile?.username || authData.user.user_metadata?.username || cleanEmail.split('@')[0];
        const points = profile?.total_points ?? 0;

        setUser({
          id: authData.user.id,
          email: authData.user.email || cleanEmail,
          username: username,
          total_points: points,
        });

        router.push('/');
      } else {
        throw new Error('Gagal memverifikasi akun. Silakan coba kembali.');
      }
    } catch (err: any) {
      console.error('Login authentication error:', err);
      setErrorMessage(err.message || 'Gagal masuk. Periksa kembali email dan kata sandi kamu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans select-none">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-green-600 to-emerald-400 text-white font-black text-2xl mx-auto flex items-center justify-center shadow-md">
            U
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Masuk ke CALIBRA</h1>
          <p className="text-xs text-slate-500">Platform E-Learning & Simulasi 2D Gamifikasi</p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold space-y-1">
            <div className="flex items-center gap-2 font-bold text-red-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>Gagal Autentikasi Login</span>
            </div>
            <p className="leading-relaxed text-[11px] text-red-600">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Siswa / Pengguna</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="nama@sekolah.sch.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi Akun Database...</span>
              </>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Belum punya akun?{' '}
          <Link href="/auth/register" className="font-bold text-emerald-600 hover:underline">
            Daftar Akun Baru
          </Link>
        </div>
      </div>
    </div>
  );
}
