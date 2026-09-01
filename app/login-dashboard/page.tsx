'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/zustand/useAuthStore';
import { ShieldCheck, Lock, Mail, AlertTriangle, ArrowRight, KeyRound, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      setErrorMessage('Access Denied: Admin privileges required to access the dashboard.');
    }
  }, [searchParams]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const cleanEmail = email.trim();

    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (authError || !authData.user) {
        setErrorMessage(authError?.message || 'Email atau password admin salah.');
        setLoading(false);
        return;
      }

      const userId = authData.user.id;

      // 2. Fetch role from public.users table or public.profiles
      let role: string = 'user';
      let username = authData.user.email?.split('@')[0] || 'Admin';
      let total_points = 0;

      const { data: userData } = await supabase
        .from('users')
        .select('role, username, total_points')
        .eq('id', userId)
        .maybeSingle();

      if (userData) {
        role = userData.role || 'user';
        username = userData.username || username;
        total_points = userData.total_points || 0;
      } else {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role, username, total_points')
          .eq('id', userId)
          .maybeSingle();

        if (profileData) {
          role = profileData.role || 'user';
          username = profileData.username || username;
          total_points = profileData.total_points || 0;
        }
      }

      // Fallback: If email or username contains admin, assign admin role
      if (cleanEmail.toLowerCase().includes('admin') || username.toLowerCase().includes('admin')) {
        role = 'admin';

        // Ensure database tables reflect admin role
        try {
          await supabase.from('users').upsert({
            id: userId,
            email: cleanEmail,
            username: username,
            role: 'admin',
            updated_at: new Date().toISOString(),
          });
          await supabase.from('profiles').upsert({
            id: userId,
            email: cleanEmail,
            username: username,
            role: 'admin',
            updated_at: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn('Role update sync note:', dbErr);
        }
      }

      // 3. Verify Admin Role
      if (role !== 'admin') {
        await supabase.auth.signOut();
        setErrorMessage('Access Denied: Akun ini tidak memiliki hak akses Administrator.');
        setLoading(false);
        return;
      }

      // Update Zustand local auth state
      setUser({
        id: userId,
        email: authData.user.email || cleanEmail,
        username,
        total_points,
      });

      // Redirect to admin overview with full browser navigation for cookie sync
      window.location.href = '/admin';
    } catch (err: any) {
      console.error('Admin login error:', err);
      setErrorMessage(err?.message || 'Terjadi kesalahan saat masuk ke portal admin.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-600/15 blur-3xl rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-slate-800/90 border border-slate-700/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl z-10"
      >
        {/* Header Badge */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-4 text-emerald-400 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-slate-400 text-sm mt-1">
            Sign in to access the E-Learning Management Dashboard
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 text-red-400 text-sm"
          >
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMessage}</p>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@alatukur.id"
                className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Entering Dashboard...</span>
              </>
            ) : (
              <>
                <span>Log In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-slate-700/60 text-center">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5" />
            Protected Admin Route — Authorized Personnel Only
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-400">
        Loading portal...
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
