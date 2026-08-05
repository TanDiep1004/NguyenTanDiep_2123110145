'use client';

import { use } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function OrderSuccessPage({ params }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center space-y-8">
      <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
        <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full bg-slate-900 text-emerald-400 font-bold text-xs border border-slate-800">
          Mã đơn hàng: #{orderId}
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-white">ĐẶT HÀNG THÀNH CÔNG!</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Cảm ơn bạn đã tin tưởng mua sắm tại <strong>NTD Eyewear</strong>. Nhân viên chăm sóc khách hàng sẽ liên hệ xác nhận đơn hàng và chuẩn bị đóng gói kính cho bạn ngay lập tức.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-left space-y-3 text-xs text-slate-300 max-w-md mx-auto shadow-xl">
        <div className="flex justify-between border-b border-slate-800 pb-2">
          <span className="text-slate-400">Trạng thái đơn hàng:</span>
          <span className="font-bold text-emerald-400">Pending (Đã tiếp nhận)</span>
        </div>
        <div className="flex justify-between border-b border-slate-800 pb-2">
          <span className="text-slate-400">Thời gian giao dự kiến:</span>
          <span className="font-bold text-white">2 - 3 ngày làm việc</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Chính sách bảo hành:</span>
          <span className="font-bold text-white">12 tháng đổi mới gọng kính</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link
          href="/products"
          className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/20 flex items-center gap-2"
        >
          <span>Tiếp tục mua sắm</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/orders"
          className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-800"
        >
          Xem lịch sử đơn hàng
        </Link>
      </div>
    </div>
  );
}
