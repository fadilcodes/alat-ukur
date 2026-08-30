'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Star, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/zustand/useAuthStore';

export interface LeaderboardItem {
  id: string;
  rank: number;
  username: string;
  initials: string;
  avatarBg: string;
  points: number;
  isCurrentUser?: boolean;
}

const BG_COLORS = [
  'bg-emerald-600',
  'bg-blue-600',
  'bg-purple-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-teal-600',
];

export default function LeaderboardTable() {
  const { user } = useAuthStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, total_points')
          .order('total_points', { ascending: false })
          .limit(10);

        if (!error && data && data.length > 0) {
          const formatted: LeaderboardItem[] = data.map((item, index) => {
            const name = item.username || 'Siswa';
            const initials = name.substring(0, 2).toUpperCase();
            return {
              id: item.id,
              rank: index + 1,
              username: name,
              initials: initials,
              avatarBg: BG_COLORS[index % BG_COLORS.length],
              points: item.total_points || 0,
              isCurrentUser: user?.id === item.id,
            };
          });
          setLeaderboard(formatted);
        } else {
          // If database returns empty or fails, use current logged in user if available
          if (user) {
            setLeaderboard([
              {
                id: user.id,
                rank: 1,
                username: user.username,
                initials: user.username.substring(0, 2).toUpperCase(),
                avatarBg: 'bg-[#10B981]',
                points: user.total_points || 0,
                isCurrentUser: true,
              },
            ]);
          } else {
            setLeaderboard([]);
          }
        }
      } catch (err) {
        console.error('Error loading leaderboard:', err);
        if (user) {
          setLeaderboard([
            {
              id: user.id,
              rank: 1,
              username: user.username,
              initials: user.username.substring(0, 2).toUpperCase(),
              avatarBg: 'bg-[#10B981]',
              points: user.total_points || 0,
              isCurrentUser: true,
            },
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboard();
  }, [user]);

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 max-w-md w-full mx-auto space-y-5 select-none">
      {/* Leaderboard Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-800 font-black text-lg">
          <span className="text-xl">🏆</span>
          <h3>Leaderboard Realtime</h3>
        </div>
        <span className="text-[11px] font-extrabold px-3 py-1 bg-[#E8F8F0] text-[#047857] rounded-full border border-[#D1F2E2]">
          Peringkat XP
        </span>
      </div>

      {/* Leaderboard Content */}
      {isLoading ? (
        <div className="py-8 text-center space-y-2">
          <div className="w-6 h-6 border-3 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Memuat data leaderboard...</p>
        </div>
      ) : leaderboard.length > 0 ? (
        <div className="space-y-2.5">
          {leaderboard.map((item) => {
            const medal = getMedalIcon(item.rank);

            return (
              <div
                key={item.id || item.rank}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  item.isCurrentUser
                    ? 'bg-[#E8F8F0] border-[#10B981] shadow-2xs'
                    : 'bg-white border-slate-100 hover:border-slate-200 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank / Medal */}
                  <div className="w-6 text-center font-black text-slate-400 text-xs shrink-0">
                    {medal ? (
                      <span className="text-lg leading-none">{medal}</span>
                    ) : (
                      <span>#{item.rank}</span>
                    )}
                  </div>

                  {/* Avatar Circle */}
                  <div
                    className={`w-9 h-9 rounded-full ${item.avatarBg} text-white font-black text-xs flex items-center justify-center shadow-2xs shrink-0`}
                  >
                    {item.initials}
                  </div>

                  {/* Name */}
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      {item.username}
                      {item.isCurrentUser && (
                        <span className="text-[9px] bg-[#10B981] text-white font-extrabold px-1.5 py-0.5 rounded-md">
                          Kamu
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center gap-1 text-slate-700 font-extrabold text-xs font-mono bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-xl">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{item.points.toLocaleString('id-ID')} XP</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-8 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800">Belum Ada Skor di Leaderboard</h4>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              Selesaikan Latihan Soal untuk mengumpulkan poin XP dan jadilah nomor 1!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

