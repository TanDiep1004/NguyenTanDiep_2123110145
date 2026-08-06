'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { getToken, getUser, isAdmin } from '@/lib/auth';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = getToken();

    if (!token) {
      router.push('/login');
      return;
    }

    // Check strictly if role is admin or staff
    if (!isAdmin()) {
      alert('YÊU CẦU ĐĂNG NHẬP ADMIN:\nTài khoản hiện tại của bạn không có quyền truy cập. Vui lòng đăng nhập bằng tài khoản Quản trị viên!');
      router.push('/login');
      return;
    }

    setAuthorized(true);
  }, [pathname, router]);

  if (!mounted || !authorized) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-bold">Đang kiểm tra phân quyền Admin NTD...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
