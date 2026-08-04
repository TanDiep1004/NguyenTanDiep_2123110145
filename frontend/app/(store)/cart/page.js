'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, ArrowRight, TicketPercent, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const {
    cartItems,
    cartSubtotal,
    discountAmount,
    cartTotal,
    removeFromCart,
    updateQuantity,
    applyCouponCode,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = await applyCouponCode(couponInput);
    setCouponSuccess(res.success);
    setCouponMsg(res.message);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-white">Giỏ hàng của bạn đang trống</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Hãy khám phá bộ sưu tập hơn 500+ mẫu kính cận và kính râm thời trang cao cấp tại NTD Eyewear.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/20"
        >
          <span>Khám phá sản phẩm ngay</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-8">
      <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-emerald-400" />
            <span>Giỏ Hàng Mua Sắm ({cartItems.length} món)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Kiểm tra thông số kính, áp dụng mã giảm giá và thanh toán</p>
        </div>
        <Link href="/products" className="text-xs font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Tiếp tục chọn kính
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Cart Items List Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="divide-y divide-slate-800/80">
            {cartItems.map((item, idx) => {
              const itemPrice = item.variant?.price || item.product.price || 1500000;
              const itemTotal = itemPrice * item.quantity;
              const imgUrl =
                item.product.images && item.product.images.length > 0
                  ? item.product.images[0].imageUrl
                  : item.product.imageUrl || 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800';

              return (
                <div key={idx} className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img src={imgUrl} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl border border-slate-800 shrink-0 bg-slate-950" />
                    <div>
                      <h3 className="font-bold text-white text-sm line-clamp-1">{item.product.name}</h3>
                      <div className="text-xs text-emerald-400 font-semibold mt-0.5">
                        Thương hiệu: {item.product.brand?.name || 'Ray-Ban'}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Màu: {item.variant?.color || 'Đen Nhám'}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">Độ: {item.variant?.degree || '0.00'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-slate-800 pt-4 sm:pt-0">
                    <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(idx, -1)}
                        className="w-7 h-7 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600 flex items-center justify-center text-xs"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-xs text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(idx, 1)}
                        className="w-7 h-7 rounded-lg bg-slate-700 text-white font-bold hover:bg-slate-600 flex items-center justify-center text-xs"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-white text-sm">{itemTotal.toLocaleString('vi-VN')} VNĐ</div>
                      <div className="text-[10px] text-slate-500 font-medium">{itemPrice.toLocaleString('vi-VN')} VNĐ / chiếc</div>
                    </div>

                    <button
                      onClick={() => removeFromCart(idx)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Xóa khỏi giỏ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Summary Bill & Coupon Code */}
        <div className="space-y-6">
          {/* Coupon input */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h3 className="font-bold text-white text-xs uppercase flex items-center gap-2">
              <TicketPercent className="w-4 h-4 text-emerald-400" />
              <span>Mã Giảm Giá / Voucher</span>
            </h3>

            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập mã (VD: SALE50K)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                className="flex-1 bg-slate-800 text-white text-xs px-3.5 py-2.5 rounded-xl border border-slate-700 font-mono focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shrink-0 cursor-pointer"
              >
                Áp dụng
              </button>
            </form>

            {couponMsg && (
              <p className={`text-xs font-semibold ${couponSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                {couponMsg}
              </p>
            )}
          </div>

          {/* Bill breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-xs">
            <h3 className="font-bold text-white text-sm border-b border-slate-800 pb-3">Tóm tắt hóa đơn</h3>

            <div className="space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span>Tiền hàng (Tạm tính):</span>
                <span className="font-bold text-white">{cartSubtotal.toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className="flex justify-between">
                <span>Giảm giá Voucher:</span>
                <span className="font-bold text-emerald-400">-{discountAmount.toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="font-bold text-emerald-400">Miễn phí (0 VNĐ)</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline">
              <span className="font-bold text-white text-sm">Tổng thanh toán:</span>
              <span className="font-black text-emerald-400 text-xl">{cartTotal.toLocaleString('vi-VN')} VNĐ</span>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
            >
              <span>TIẾN HÀNH THANH TOÁN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
