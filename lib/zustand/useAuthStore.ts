import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  total_points: number;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  loginUser: (email: string, username?: string) => void;
  registerUser: (username: string, email: string) => void;
  updatePoints: (delta: number) => void;
  setTotalPoints: (points: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      loginUser: (email, username) => {
        const u: UserProfile = {
          id: 'usr-' + Math.random().toString(36).substring(2, 9),
          email: email,
          username: username || email.split('@')[0] || 'SiswaTeknik',
          total_points: 0,
        };
        set({ user: u, isAuthenticated: true });
      },

      registerUser: (username, email) => {
        const u: UserProfile = {
          id: 'usr-' + Math.random().toString(36).substring(2, 9),
          email: email,
          username: username || 'SiswaBaru',
          total_points: 0,
        };
        set({ user: u, isAuthenticated: true });
      },

      updatePoints: (delta) => {
        const current = get().user;
        if (!current) return;

        const newPoints = Math.max(0, current.total_points + delta);

        // Update local Zustand state for instant UI responsiveness
        set({
          user: { ...current, total_points: newPoints },
        });

        // Sync with Supabase database profiles table asynchronously
        try {
          const supabase = createClient();
          supabase
            .from('profiles')
            .update({ total_points: newPoints })
            .eq('id', current.id)
            .then(({ error }) => {
              if (error) console.warn('Database points sync note:', error.message);
            });
        } catch (err) {
          console.warn('Database sync skipped (offline mode):', err);
        }
      },

      setTotalPoints: (points) => {
        const current = get().user;
        if (!current) return;

        set({
          user: { ...current, total_points: points },
        });

        try {
          const supabase = createClient();
          supabase
            .from('profiles')
            .update({ total_points: points })
            .eq('id', current.id)
            .then(({ error }) => {
              if (error) console.warn('Database points sync note:', error.message);
            });
        } catch (err) {
          console.warn('Database sync skipped (offline mode):', err);
        }
      },

      logout: () => {
        try {
          const supabase = createClient();
          supabase.auth.signOut().catch(() => {});
        } catch (err) {}
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'alatukur-auth-storage-v2',
    }
  )
);
