'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Glasses, 
  Layers, 
  Tag, 
  Sliders, 
  ShoppingBag, 
  TicketPercent, 
  Users, 
  Settings, 
  LogOut,
  FileText,
  Image as ImageIcon,
  Mail,
  Globe
} from 'lucide-react';
import { logout } from '@/lib/auth';

export default function Sidebar() {
  const pathname = usePathname();

  const menuGroups = [
    {
      title: 'WEBSITE',
      items: [
        { name: 'Landing Page', href: '/', icon: Globe }
      ]
    },
    {
      title: 'DASHBOARDS',
      items: [
        { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'QUẢN LÝ CỬA HÀNG',
      items: [
        { name: 'Sản phẩm', href: '/admin/products', icon: Glasses },
        { name: 'Danh mục', href: '/admin/categories', icon: Layers },
        { name: 'Thương hiệu', href: '/admin/brands', icon: Tag },
        { name: 'Thuộc tính & Giá', href: '/admin/attributes', icon: Sliders },
        { name: 'Đơn hàng', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Mã khuyến mãi', href: '/admin/promotions', icon: TicketPercent },
      ]
    },
    {
      title: 'NỘI DUNG & LIÊN HỆ',
      items: [
        { name: 'Bài viết tin tức', href: '/admin/articles', icon: FileText },
        { name: 'Banner quảng cáo', href: '/admin/banners', icon: ImageIcon },
        { name: 'Liên hệ khách hàng', href: '/admin/contacts', icon: Mail },
      ]
    },
    {
      title: 'HỆ THỐNG (18 BẢNG)',
      items: [
        { name: 'Tài khoản & Địa chỉ', href: '/admin/users', icon: Users },
        { name: 'Cấu hình hệ thống', href: '/admin/settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-30">
      <div>
        {/* Brand Logo Header with custom Green Eyeglasses Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-slate-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-500/10">
            <Glasses className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
            NTD <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">ADMIN</span>
          </span>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {menuGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && item.href !== '/' && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-slate-800/90 text-emerald-400 font-semibold shadow-inner border-l-2 border-emerald-500 pl-3.5'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-800/80">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
