'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Glasses, Search, ShoppingBag, User, Phone, ChevronDown, Shield, Tag, UserPlus, LogOut, Package, ClipboardList } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { fetchApi } from '@/lib/api';
import { getUser, getToken, isAdmin, logout } from '@/lib/auth';

export default function Header() {
  const router = useRouter();
  const { cartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUserState] = useState(null);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [sysSettings, setSysSettings] = useState({
    hotline: '0329526730',
    logo_url: '',
  });

  useEffect(() => {


    async function loadSettings() {
      // Try local storage first
      try {
        const saved = localStorage.getItem('system_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          setSysSettings((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {}

      // Fetch from API
      try {
        const res = await fetchApi('/public/settings');
        if (res.data && res.data.length > 0) {
          const obj = {};
          res.data.forEach((item) => {
            if (item.keyName) obj[item.keyName] = item.keyValue;
          });
          setSysSettings((prev) => ({ ...prev, ...obj }));
        }
      } catch (e) {}
    }


    loadSettings();
    setUserState(getUser());
    setUserIsAdmin(isAdmin());
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleCartClick = (e) => {
    const token = getToken();
    if (!token) {
      e.preventDefault();
      alert('VUI LÒNG ĐĂNG NHẬP!\nBạn cần đăng nhập tài khoản trước khi truy cập giỏ hàng.');
      router.push('/login');
    }
  };

  const hasCustomLogo = sysSettings.logo_url && (sysSettings.logo_url.startsWith('http') || sysSettings.logo_url.startsWith('data:image'));

  return (
    <header className="sticky top-0 z-40 w-full shadow-lg">
      {/* Top Banner Bar */}
      <div className="bg-slate-950 text-slate-400 text-xs py-2 px-6 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Phone className="w-3.5 h-3.5" /> Hotline Đặt Hàng: <strong className="text-white ml-1">{sysSettings.hotline || '0329526730'}</strong>
          </span>
          <span className="hidden sm:inline-block text-slate-400">
            ✨ Miễn phí đo mắt vi tính & Bảo hành gọng kính 12 tháng
          </span>
        </div>
        <div className="flex items-center gap-4">
          {userIsAdmin ? (
            <Link href="/admin/dashboard" className="text-slate-300 hover:text-emerald-400 font-bold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Buồng lái Admin
            </Link>
          ) : (
            <span className="text-slate-400 text-[11px]">
              Chào mừng bạn đến với Mắt Kính NTD Eyewear
            </span>
          )}
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 py-4 px-6 md:px-12 flex items-center justify-between gap-6">
        {/* Logo NTD Eyewear */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          {hasCustomLogo ? (
            <div className="bg-white p-1.5 rounded-xl border border-slate-700 shadow-md flex items-center justify-center">
              <img src={sysSettings.logo_url} alt="Logo Cửa Hàng" className="h-9 w-auto max-w-[140px] object-contain" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-slate-950 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Glasses className="w-6 h-6 text-emerald-400 stroke-[2.2]" />
            </div>
          )}
          <div>
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
              NTD <span className="text-emerald-400">EYEWEAR</span>
            </span>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase font-semibold">Cửa hàng mắt kính cao cấp</p>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Tìm kiếm mẫu gọng kính, kính râm Ray-Ban, Gucci..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/90 text-white text-xs pl-4 pr-10 py-2.5 rounded-full border border-slate-700/60 focus:outline-none focus:border-emerald-500"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 cursor-pointer">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Action Controls: User Account + Cart */}
        <div className="flex items-center gap-4">
          {/* User Account Controls */}
          <div className="relative">
            {user ? (
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-white cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/40">
                  {user.fullName?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:inline-block font-bold">{user.fullName || 'Khách hàng'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/60 transition-colors"
                >
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>Đăng nhập</span>
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 px-3 py-2 rounded-xl shadow-md transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Đăng ký</span>
                </Link>
              </div>
            )}

            {showUserDropdown && user && (
              <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-800">
                  <div className="font-bold text-white text-xs">{user.fullName}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                  <div className="text-[10px] text-emerald-400 font-bold uppercase mt-0.5">Role: {user.role || 'customer'}</div>
                </div>

                {userIsAdmin && (
                  <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Buồng lái Admin</span>
                  </Link>
                )}

                <Link href="/orders" className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800">
                  <ClipboardList className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lịch sử đơn hàng</span>
                </Link>

                <Link href="/cart" onClick={handleCartClick} className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-800">
                  <Package className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Giỏ hàng của tôi</span>
                </Link>

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-rose-400 hover:bg-slate-800 flex items-center gap-2 cursor-pointer border-t border-slate-800/80 mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>

          {/* Cart Icon Counter Badge */}
          <Link
            href="/cart"
            onClick={handleCartClick}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-slate-950 text-emerald-400 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-emerald-500">
                  {cartCount}
                </span>
              )}
            </div>
            <span>Giỏ hàng ({cartCount})</span>
          </Link>
        </div>
      </div>

      {/* Navigation Categories Menu Bar */}
      <nav className="bg-slate-900 border-b border-slate-800/80 px-6 md:px-12">
        <ul className="flex items-center gap-8 overflow-x-auto text-xs font-bold uppercase tracking-wider py-3 text-slate-300">
          <li>
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              Trang Chủ
            </Link>
          </li>
          <li>
            <Link href="/products" className="hover:text-emerald-400 transition-colors">
              Tất Cả Mắt Kính
            </Link>
          </li>
          <li>
            <Link href="/articles" className="hover:text-emerald-400 transition-colors">
              Tin Tức
            </Link>
          </li>
          <li className="ml-auto">
            <Link href="/cart" onClick={handleCartClick} className="text-emerald-400 flex items-center gap-1 hover:text-emerald-300">
              <Tag className="w-3.5 h-3.5" /> Mã Khuyến Mãi HOT
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
