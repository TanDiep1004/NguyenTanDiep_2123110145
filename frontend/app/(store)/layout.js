'use client';

import { CartProvider } from '@/context/CartContext';
import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';

export default function StoreLayout({ children }) {
  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}
