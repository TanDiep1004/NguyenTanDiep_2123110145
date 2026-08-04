'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, CreditCard, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { orderService } from '@/services/orderService';
import { getUser, getToken } from '@/lib/auth';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartSubtotal, discountAmount, cartTotal, clearCart } = useCart();
  const currentUser = getUser();

  const [receiverName, setReceiverName] = useState(currentUser?.fullName || 'Nguyễn Tấn Điệp');
  const [receiverPhone, setReceiverPhone] = useState(currentUser?.phone || '0912345678');
  const [shippingAddress, setShippingAddress] = useState('123 Nguyễn Trãi, Phường 2, Quận 5, TP. Hồ Chí Minh');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert('VUI LÒNG ĐĂNG NHẬP!\nBạn cần đăng nhập tài khoản trước khi tiến hành thanh toán đơn hàng.');
      router.push('/login');
    }
  }, [router]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      alert('VUI LÒNG ĐĂNG NHẬP!\nBạn cần đăng nhập tài khoản trước khi đặt hàng.');
      router.push('/login');
      return;
    }

    if (!receiverName || !receiverPhone || !shippingAddress) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng!');
      return;
    }

    setLoading(true);
    const generatedId = Math.floor(Math.random() * 90000) + 10000;

    const newOrderObj = {
      id: generatedId,
      receiverName,
      receiverPhone,
      shippingAddress,
      note,
      paymentMethod,
      totalAmount: cartSubtotal,
      discountAmount,
      finalAmount: cartTotal,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      items: cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        color: item.variant?.color || 'Đen Nhám',
        degree: item.variant?.degree || '0.00',
        quantity: item.quantity,
        price: item.variant?.price || item.product.price || 1500000,
      })),
    };

    // Save order into localStorage placed_orders array
    try {
      const existingOrders = JSON.parse(localStorage.getItem('placed_orders') || '[]');
      existingOrders.unshift(newOrderObj);
      localStorage.setItem('placed_orders', JSON.stringify(existingOrders));
    } catch (err) {}

    try {
      await orderService.checkout(newOrderObj);
    } catch (err) {
      console.log("Backend sync note:", err.message);
    }

    clearCart();
    setLoading(false);
    router.push(`/order-success/${generatedId}`);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-white">Giỏ hàng của bạn đang trống</h2>
        <button onClick={() => router.push('/products')} className="px-6 py-3 bg-emerald-500 font-bold text-slate-950 rounded-xl cursor-pointer">
          Quay lại mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-8">
      <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-emerald-400" />
            <span>Thanh Toán Đơn Hàng NTD Eyewear</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Xác nhận thông tin giao hàng và chọn phương thức thanh toán</p>
        </div>
        <button onClick={() => router.back()} className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Quay lại giỏ hàng
        </button>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Delivery Info & Payment Methods */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>Thông tin người nhận hàng</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Họ và tên người nhận *</label>
                <input
                  type="text"
                  required
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Số điện thoại liên hệ *</label>
                <input
                  type="text"
                  required
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Địa chỉ giao hàng chi tiết *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Ghi chú cho cửa hàng (Ví dụ: Đặt kính độ cận riêng)</label>
                <textarea
                  rows="2"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Điền độ cận mắt trái/mắt phải hoặc thời gian nhận hàng mong muốn..."
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <span>Phương thức thanh toán</span>
            </h3>

            <div className="space-y-3 text-xs">
              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'COD' ? 'bg-emerald-500/10 border-emerald-500/50 text-white' : 'bg-slate-800/60 border-slate-700 text-slate-400'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="accent-emerald-500"
                />
                <div>
                  <div className="font-bold text-white">Thanh toán khi nhận hàng (COD)</div>
                  <div className="text-[11px] text-slate-400">Khách hàng kiểm tra kính đúng mẫu mã mới thanh toán tiền mặt cho shipper</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'BANK' ? 'bg-emerald-500/10 border-emerald-500/50 text-white' : 'bg-slate-800/60 border-slate-700 text-slate-400'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="BANK"
                  checked={paymentMethod === 'BANK'}
                  onChange={() => setPaymentMethod('BANK')}
                  className="accent-emerald-500"
                />
                <div>
                  <div className="font-bold text-white">Chuyển khoản Ngân hàng (QR Code VietQR)</div>
                  <div className="text-[11px] text-slate-400">Quét mã QR thanh toán nhanh qua ứng dụng ngân hàng</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl sticky top-24">
          <h3 className="font-extrabold text-white text-base border-b border-slate-800 pb-3">Tóm tắt đơn hàng ({cartItems.length} kính)</h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-800/50">
            {cartItems.map((item, idx) => {
              const itemPrice = item.variant?.price || item.product.price || 1500000;
              return (
                <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">{item.product.name}</div>
                    <div className="text-[11px] text-slate-400">
                      Màu: {item.variant?.color || 'Đen'} | Độ: {item.variant?.degree || '0.00'} | x{item.quantity}
                    </div>
                  </div>
                  <div className="font-bold text-emerald-400">
                    {(itemPrice * item.quantity).toLocaleString('vi-VN')} VNĐ
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 border-t border-slate-800 pt-4 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Tạm tính kính:</span>
              <span>{cartSubtotal.toLocaleString('vi-VN')} VNĐ</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-rose-400 font-semibold">
                <span>Giảm giá khuyến mãi:</span>
                <span>-{discountAmount.toLocaleString('vi-VN')} VNĐ</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Phí vận chuyển:</span>
              <span className="text-emerald-400 font-bold">Miễn phí 100%</span>
            </div>
            <div className="flex justify-between text-base font-black text-white border-t border-slate-800 pt-3">
              <span>Tổng thanh toán:</span>
              <span className="text-emerald-400">{cartTotal.toLocaleString('vi-VN')} VNĐ</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>XÁC NHẬN ĐẶT HÀNG</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
