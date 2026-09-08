'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/zustand/useAuthStore';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight, User, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const cleanUsername = username.trim();
    const cleanEmail = email.trim();

    if (!cleanUsername || cleanUsername.length < 3) {
      setErrorMessage('Nama pengguna (username) minimal 3 karakter.');
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMessage('Format email tidak valid. Masukkan email dengan format yang benar (contoh: nama@sekolah.sch.id).');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      // Check if username already exists in profiles or users table
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, username')
        .ilike('username', cleanUsername)
        .maybeSingle();

      if (existingProfile) {
        throw new Error(`Nama pengguna "${cleanUsername}" sudah terdaftar oleh siswa lain. Silakan pilih username lain.`);
      }

      // Execute Supabase Auth sign up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: { username: cleanUsername },
        },
      });

      let realUserId = authData?.user?.id;

      if (authError) {
        // If user already exists or database trigger returned an error, try sign in fallback
        if (
          authError.message.includes('User already registered') ||
          authError.message.includes('already exists') ||
          authError.message.includes('Database error') ||
          authError.message.includes('Database')
        ) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: password,
          });

          if (!signInError && signInData?.user?.id) {
            realUserId = signInData.user.id;
          } else if (authError.message.includes('Database error') || authError.message.includes('Database')) {
            throw new Error('Terjadi kendala pada database Supabase ("Database error saving new user"). Mohon salin dan jalankan script file "supabase/schema.sql" pada Supabase SQL Editor milik Anda.');
          } else {
            throw new Error('Email ini sudah terdaftar. Silakan masuk / login ke akun Anda.');
          }
        } else {
          throw authError;
        }
      }

      if (!realUserId) {
        throw new Error('Gagal memverifikasi ID pendaftaran. Silakan coba kembali.');
      }

      // Determine role if user is admin
      const assignedRole = cleanUsername.toLowerCase().includes('admin') || cleanEmail.toLowerCase().includes('admin') ? 'admin' : 'user';

      // Upsert record into public.users table directly
      try {
        await supabase.from('users').upsert({
          id: realUserId,
          email: cleanEmail,
          username: cleanUsername,
          role: assignedRole,
          total_points: 0,
          updated_at: new Date().toISOString(),
        });
      } catch (uErr) {
        console.warn('Direct users table upsert note:', uErr);
      }

      // Upsert record into public.profiles table directly
      try {
        await supabase.from('profiles').upsert({
          id: realUserId,
          email: cleanEmail,
          username: cleanUsername,
          role: assignedRole,
          total_points: 0,
          updated_at: new Date().toISOString(),
        });
      } catch (pErr) {
        console.warn('Direct profiles table upsert note:', pErr);
      }

      // Update Zustand local auth store for instant session
      setUser({
        id: realUserId,
        email: cleanEmail,
        username: cleanUsername,
        total_points: 0,
      });

      router.push('/');
    } catch (err: any) {
      console.error('Registration authentication error:', err);
      setErrorMessage(err.message || 'Gagal mendaftar. Periksa kembali data pendaftaran kamu.');
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Daftar Akun Siswa</h1>
          <p className="text-xs text-slate-500">Mulai petualangan e-learning metrologi kamu!</p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold space-y-1">
            <div className="flex items-center gap-2 font-bold text-red-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>Gagal Pendaftaran Akun</span>
            </div>
            <p className="leading-relaxed text-[11px] text-red-600">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Nama Pengguna / Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Noval Fikri Ramadhan"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Siswa</label>
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
                minLength={6}
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
                <span>Mendaftarkan ke Database...</span>
              </>
            ) : (
              <>
                <span>Daftar & Mulai Belajar</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Sudah punya akun?{' '}
          <Link href="/auth/login" className="font-bold text-emerald-600 hover:underline">
            Masuk Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
