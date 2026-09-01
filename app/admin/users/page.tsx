'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { createClient } from '@/lib/supabase/client';
import {
  Users,
  Search,
  Trophy,
  Shield,
  User,
  Calendar,
  Award,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  X
} from 'lucide-react';

interface UserRecord {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'user';
  total_points: number;
  created_at: string;
  rank?: number;
}

export default function UserMonitoringPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState<UserRecord | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: usersData, error: usersErr } = await supabase
        .from('users')
        .select('*')
        .order('total_points', { ascending: false });

      let list: UserRecord[] = [];

      if (!usersErr && usersData && usersData.length > 0) {
        list = usersData;
      } else {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('*')
          .order('total_points', { ascending: false });

        if (profilesData) {
          list = profilesData.map((p) => ({
            id: p.id,
            email: p.email,
            username: p.username,
            role: p.role || 'user',
            total_points: p.total_points || 0,
            created_at: p.created_at,
          }));
        }
      }

      const ranked = list.map((u, idx) => ({
        ...u,
        rank: idx + 1,
      }));

      setUsers(ranked);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userRecord: UserRecord) => {
    const newRole = userRecord.role === 'admin' ? 'user' : 'admin';
    setUpdatingId(userRecord.id);
    setNotification(null);

    try {
      const { error: userUpdateErr } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userRecord.id);

      await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userRecord.id);

      if (userUpdateErr) {
        setNotification({ type: 'error', message: `Failed to update role: ${userUpdateErr.message}` });
      } else {
        setNotification({
          type: 'success',
          message: `User ${userRecord.username} updated to ${newRole.toUpperCase()}!`,
        });
        setUsers((prev) =>
          prev.map((u) => (u.id === userRecord.id ? { ...u, role: newRole } : u))
        );
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Error toggling user role.' });
    } finally {
      setUpdatingId(null);
    }
  };

  const exportCSV = () => {
    if (users.length === 0) return;
    const headers = ['Rank', 'ID', 'Username', 'Email', 'Role', 'Total Points (XP)', 'Registration Date'];
    const rows = users.map((u) => [
      u.rank,
      u.id,
      `"${u.username}"`,
      `"${u.email}"`,
      u.role,
      u.total_points,
      `"${new Date(u.created_at).toISOString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `alatukur_users_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <AdminHeader title="User Monitoring & Leaderboard Management" />

      {/* Top Banner & Stats Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            Registered Platform Users ({users.length})
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor student accounts, leaderboard rankings, registration dates, and admin roles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            disabled={users.length === 0}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition border border-emerald-200 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition border border-gray-300/80"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
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

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-xs"
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-medium w-full md:w-auto">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              roleFilter === 'all'
                ? 'bg-white text-gray-900 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              roleFilter === 'admin'
                ? 'bg-white text-emerald-700 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Admins ({users.filter((u) => u.role === 'admin').length})
          </button>
          <button
            onClick={() => setRoleFilter('user')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              roleFilter === 'user'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Students ({users.filter((u) => u.role === 'user').length})
          </button>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
            <p className="text-sm font-medium">Fetching registered user profiles...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                  <th className="py-3.5 px-6">Leaderboard Rank</th>
                  <th className="py-3.5 px-6">User Info</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Total Score</th>
                  <th className="py-3.5 px-6">Registration Date</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredUsers.map((u) => {
                  const isTopRank = u.rank && u.rank <= 3;
                  const rankBadge =
                    u.rank === 1
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : u.rank === 2
                      ? 'bg-slate-100 text-slate-700 border-slate-300'
                      : u.rank === 3
                      ? 'bg-amber-800/10 text-amber-900 border-amber-700/20'
                      : 'bg-gray-50 text-gray-600 border-gray-200';

                  return (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition">
                      {/* Rank Column */}
                      <td className="py-4 px-6 font-bold">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full border text-xs font-extrabold ${rankBadge}`}
                        >
                          {isTopRank && <Trophy className="w-3.5 h-3.5 mr-0.5" />}#{u.rank}
                        </span>
                      </td>

                      {/* User Info Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm border border-emerald-200 shrink-0">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 leading-tight">
                              {u.username}
                            </p>
                            <p className="text-xs text-gray-500 leading-tight mt-0.5">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role Column */}
                      <td className="py-4 px-6">
                        {u.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                            <Shield className="w-3 h-3 text-emerald-600" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                            <User className="w-3 h-3 text-slate-400" />
                            Student
                          </span>
                        )}
                      </td>

                      {/* Points Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 font-bold text-gray-900">
                          <Award className="w-4 h-4 text-emerald-600" />
                          <span>{u.total_points.toLocaleString('id-ID')} XP</span>
                        </div>
                      </td>

                      {/* Registration Date Column */}
                      <td className="py-4 px-6 text-gray-500 text-xs">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {new Date(u.created_at).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Action Column */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUserDetail(u)}
                            className="p-2 text-gray-600 hover:text-emerald-700 bg-gray-100 hover:bg-emerald-50 rounded-lg border border-gray-200 transition"
                            title="View User Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRoleToggle(u)}
                            disabled={updatingId === u.id}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                              u.role === 'admin'
                                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            }`}
                          >
                            {updatingId === u.id ? (
                              'Updating...'
                            ) : u.role === 'admin' ? (
                              'Demote'
                            ) : (
                              'Make Admin'
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-400 text-sm font-medium">
            No registered users found matching the search criteria.
          </div>
        )}
      </div>

      {/* User Detail View Modal */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-900 font-extrabold flex items-center justify-center text-base">
                  {selectedUserDetail.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-base">{selectedUserDetail.username}</h3>
                  <p className="text-xs text-slate-400">{selectedUserDetail.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-gray-700">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">User Database ID</span>
                <span className="font-mono text-gray-900 font-bold bg-gray-100 px-2 py-1 rounded text-[11px]">
                  {selectedUserDetail.id}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Current Role</span>
                <span
                  className={`font-bold px-2.5 py-0.5 rounded-full ${
                    selectedUserDetail.role === 'admin'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}
                >
                  {selectedUserDetail.role.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Leaderboard Rank</span>
                <span className="font-extrabold text-gray-900">#{selectedUserDetail.rank}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Accumulated Score</span>
                <span className="font-extrabold text-emerald-600 text-sm">
                  {selectedUserDetail.total_points} XP
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500 font-medium">Joined Date</span>
                <span className="font-bold text-gray-900">
                  {new Date(selectedUserDetail.created_at).toLocaleString('id-ID', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
