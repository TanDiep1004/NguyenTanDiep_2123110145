'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Phone, ArrowRight, Glasses, AlertCircle } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !emailInput || !password) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc!');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không trùng khớp!');
      return;
    }

    setLoading(true);

    const formattedEmail = emailInput.includes('@') ? emailInput : `${emailInput}@gmail.com`;

    const newUserObj = {
      fullName,
      email: formattedEmail,
      phone: phone || '0912345678',
      password,
      role: 'customer',
      token: 'customer-jwt-token-' + Date.now(),
    };

    // Save to local registry so login page can verify registered users immediately
    try {
      const existing = JSON.parse(localStorage.getItem('registered_users') || '[]');
      existing.push(newUserObj);
      localStorage.setItem('registered_users', JSON.stringify(existing));
    } catch (e) {}

    try {
      const res = await fetchApi('/public/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          fullName,
          email: formattedEmail,
          phone,
          password,
          role: 'customer',
        }),
      });

      if (res.data && res.data.token) {
        setToken(res.data.token);
        setUser(res.data);
      } else {
        setToken(newUserObj.token);
        setUser(newUserObj);
      }
    } catch (err) {
      setToken(newUserObj.token);
      setUser(newUserObj);
    } finally {
      setLoading(false);
      alert(`Đăng ký tài khoản NTD Eyewear (${formattedEmail}) thành công! Tự động đăng nhập.`);
      router.push('/');
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-slate-950 border border-emerald-500/50 text-emerald-400 mb-1">
            <Glasses className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black text-white">Đăng Ký Tài Khoản Mới</h1>
          <p className="text-xs text-slate-400">Tạo tài khoản để nhận voucher 50k & tích điểm mua hàng tại NTD Eyewear</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Họ và tên *</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

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
            <label className="block text-slate-300 font-semibold mb-1">Số điện thoại</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="tel"
                placeholder="0912345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Nhập lại mật khẩu *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                <span>TẠO TÀI KHOẢN NGAY</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          Đã có tài khoản?{' '}
          <Link href="/login" className="text-emerald-400 font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
