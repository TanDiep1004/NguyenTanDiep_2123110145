'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Glasses, AlertCircle } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { setToken, setUser, getToken, getUser } from '@/lib/auth';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const doRedirect = (role) => {
    if (role === 'admin' || role === 'staff' || role === 'role_admin' || role === 'role_staff') {
      window.location.href = '/admin/dashboard';
      return;
    }
    
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get('redirect');
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      window.location.href = '/';
    }
  };

  useEffect(() => {
    const token = getToken();
    const currentUser = getUser();
    if (token) {
      if (typeof window !== 'undefined') {
        setToken(token); // Sync cookie just in case it was missing
        const role = currentUser?.role?.toLowerCase();
        doRedirect(role);
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!emailInput || !password) {
      setError('Vui lòng điền đầy đủ Email/Tên đăng nhập và Mật khẩu!');
      return;
    }

    setLoading(true);

    const formattedEmail = emailInput.includes('@') ? emailInput : `${emailInput}@gmail.com`;

    try {
      const res = await fetchApi('/public/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: formattedEmail, password }),
      });

      if (res.data && res.data.token) {
        setToken(res.data.token);
        setUser(res.data);
        alert(`Đăng nhập thành công! Xin chào ${res.data.fullName || res.data.email}`);
        const role = (res.data.role || 'customer').toLowerCase();
        doRedirect(role);
        return;
      }
      } catch (err) {
        // 1. Check local registered users list
        try {
          const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
          const matched = registeredUsers.find(
            (u) =>
              u.email.toLowerCase() === formattedEmail.toLowerCase() && u.password === password
          );

          if (matched) {
            setToken(matched.token || 'customer-token-' + Date.now());
            setUser(matched);
            alert(`Đăng nhập thành công! Xin chào ${matched.fullName}`);
            doRedirect(matched.role?.toLowerCase());
            return;
          }
        } catch (localErr) {}
        
        setError('Email hoặc mật khẩu không chính xác!');
      } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-slate-950 border border-emerald-500/50 text-emerald-400 mb-1">
            <Glasses className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black text-white">Đăng Nhập Hệ Thống</h1>
          <p className="text-xs text-slate-400">Đăng nhập tài khoản để mua sắm hoặc quản lý hệ thống</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Địa chỉ Email / Tên đăng nhập *</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                placeholder="Ví dụ: diep123 hoặc khachhang@gmail.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Mật khẩu *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-slate-950 text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>ĐĂNG NHẬP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400 space-y-2">
          <div>
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-emerald-400 font-bold hover:underline">
              Đăng ký tài khoản mới ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
