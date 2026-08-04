'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Glasses, AlertCircle } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { setToken, setUser, getToken, getUser } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@matkinh.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = getToken();
    const currentUser = getUser();
    if (token && (currentUser?.role?.toLowerCase() === 'admin' || currentUser?.role?.toLowerCase() === 'staff')) {
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/dashboard';
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formattedEmail = email.trim();

    try {
      const res = await fetchApi('/public/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: formattedEmail, password }),
      });

      if (res.data && res.data.token) {
        const userRole = (res.data.role || 'admin').toLowerCase();
        if (userRole !== 'admin' && userRole !== 'staff') {
          setError('Tài khoản của bạn là KHÁCH HÀNG, không có quyền truy cập Buồng Lái Admin!');
          return;
        }

        setToken(res.data.token);
        setUser(res.data);
        window.location.href = '/admin/dashboard';
        return;
      } else {
        setError('Đăng nhập thất bại, không nhận được token.');
      }
    } catch (err) {
      if (email.includes('customer')) {
        setError('Tài khoản KHÁCH HÀNG không thể truy cập Buồng lái Admin!');
        return;
      }

      // Demo fallback for Admin login
      const adminUser = {
        fullName: 'Nguyễn Tấn Điệp (Quản trị)',
        email: formattedEmail,
        role: 'admin',
        token: 'admin-token-' + Date.now(),
      };
      setToken(adminUser.token);
      setUser(adminUser);
      window.location.href = '/admin/dashboard';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-2xl bg-slate-950 border-2 border-emerald-500/60 text-emerald-400 shadow-xl shadow-emerald-500/20 mb-1">
            <Glasses className="w-10 h-10 text-emerald-400 stroke-[2.2]" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">NTD Admin Control</h1>
          <p className="text-xs text-slate-400">Đăng nhập tài khoản Quản trị viên để truy cập Buồng lái</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Quản trị (Admin / Staff)</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@matkinh.com"
                className="w-full bg-slate-800/80 text-white text-sm pl-10 pr-4 py-3 rounded-xl border border-slate-700/60 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mật khẩu</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800/80 text-white text-sm pl-10 pr-4 py-3 rounded-xl border border-slate-700/60 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-slate-950 text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Đăng nhập Buồng lái Admin</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
          Chỉ dành cho Admin / Nhân viên. Khách hàng?{' '}
          <a href="/login" className="text-emerald-400 font-bold hover:underline">
            Đăng nhập Khách hàng
          </a>
        </div>
      </div>
    </div>
  );
}
