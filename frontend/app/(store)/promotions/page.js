'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tag, CalendarDays, Copy, CheckCircle2, TicketPercent, Loader2, ArrowRight } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    async function loadPromotions() {
      try {
        setLoading(true);
        const res = await fetchApi('/public/promotions');
        if (res.code === 200 && res.data) {
          setPromotions(res.data);
        }
      } catch (err) {
        console.error('Failed to load promotions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPromotions();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Không thời hạn';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-400" />
        <p className="text-slate-400 font-medium">Đang tải danh sách khuyến mãi...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-full mb-2">
          <TicketPercent className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-black text-white">Siêu Khuyến Mãi HOT</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Săn ngay các mã giảm giá hấp dẫn nhất từ NTD Eyewear. Số lượng có hạn, nhanh tay áp dụng ngay hôm nay!
        </p>
      </div>

      {promotions.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-2">Chưa có chương trình khuyến mãi</h3>
          <p className="text-slate-400 text-sm">
            Hiện tại chúng tôi đang chuẩn bị cho các đợt khuyến mãi sắp tới. Bạn hãy quay lại sau nhé!
          </p>
          <Link href="/products" className="inline-block mt-6 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-colors">
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <div key={promo.id} className="group relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-emerald-500/10 transition-all hover:-translate-y-1">
              {/* Decorative ticket notch */}
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-slate-950 rounded-full border-r border-slate-800"></div>
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-slate-950 rounded-full border-l border-slate-800"></div>
              
              <div className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-lg mb-2">
                      {promo.discountType === 'percent' ? 'Giảm phần trăm' : 'Giảm trực tiếp'}
                    </span>
                    <h3 className="text-2xl font-black text-white leading-tight">
                      {promo.discountType === 'percent' 
                        ? `Giảm ${promo.discountValue}%` 
                        : `Giảm ${(promo.discountValue / 1000).toLocaleString('vi-VN')}K`}
                    </h3>
                  </div>
                  <Tag className="w-8 h-8 text-slate-700 group-hover:text-emerald-400 transition-colors" />
                </div>

                <p className="text-slate-400 text-sm font-medium">
                  {promo.name}
                </p>

                <div className="space-y-3 pt-6 border-t border-slate-800 border-dashed">
                  <div className="flex flex-col gap-1.5 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="w-3.5 h-3.5" /> 
                      Có hiệu lực từ: <span className="text-slate-300">{formatDate(promo.startDatetime)}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <CalendarDays className="w-3.5 h-3.5" /> 
                      Hết hạn vào: <span className="text-rose-400">{formatDate(promo.endDatetime)}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex-1 bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-center py-2.5 rounded-xl border-dashed">
                      {promo.code}
                    </div>
                    <button 
                      onClick={() => handleCopyCode(promo.code)}
                      className={`p-3 rounded-xl transition-all ${
                        copiedCode === promo.code 
                          ? 'bg-emerald-500 text-slate-950' 
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                      title="Sao chép mã"
                    >
                      {copiedCode === promo.code ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <Link href="/products" className="block w-full py-4 text-center bg-slate-950 hover:bg-emerald-500 text-slate-400 hover:text-slate-950 font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                Dùng Ngay <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
