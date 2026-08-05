'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, CreditCard, CheckCircle2, ArrowLeft, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { orderService } from '@/services/orderService';
import { fetchApi } from '@/lib/api';
import { getUser, getToken } from '@/lib/auth';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartSubtotal, discountAmount, cartTotal, clearCart, promotion } = useCart();
  const currentUser = getUser();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New address form state
  const [newAddress, setNewAddress] = useState({
    receiverName: currentUser?.fullName || '',
    phoneNumber: currentUser?.phone || '',
    addressDetail: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false
  });

  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [fetchingAddresses, setFetchingAddresses] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert('VUI LÒNG ĐĂNG NHẬP!\nBạn cần đăng nhập tài khoản trước khi tiến hành thanh toán đơn hàng.');
      router.push('/login');
      return;
    }

    const user = getUser();
    const currentUserId = user?.userId || user?.id || 1;
    if (currentUserId) {
      loadAddresses(currentUserId);
    } else {
      setFetchingAddresses(false);
    }
  }, [router]);

  const loadAddresses = async (userId) => {
    try {
      setFetchingAddresses(true);
      const res = await fetchApi(`/user-addresses/user/${userId}`);
      const data = res.data || (Array.isArray(res) ? res : null);
      if (data) {
        setAddresses(data);
        const defaultAddr = data.find(a => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (data.length > 0) {
          setSelectedAddressId(data[0].id);
        } else {
          setShowAddForm(true); // If no addresses, show form automatically
        }
      }
    } catch (error) {
      console.error('Lỗi tải sổ địa chỉ:', error);
    } finally {
      setFetchingAddresses(false);
    }
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    try {
      const user = getUser();
      const currentUserId = user?.userId || user?.id || 1; // Fallback to 1 for demo accounts
      
      const payload = {
        ...newAddress,
        user: { id: currentUserId }
      };
      const res = await fetchApi('/user-addresses', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      const added = res.data || res;
      if (added && added.id) {
        await loadAddresses(currentUserId);
        setSelectedAddressId(added.id);
        setShowAddForm(false);
        setNewAddress({ ...newAddress, addressDetail: '', ward: '', district: '', city: '' });
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi thêm địa chỉ mới!');
    }
  };

  const handleSetDefault = async (e, addressId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await fetchApi(`/user-addresses/${addressId}/default`, { method: 'PUT' });
      const user = getUser();
      const currentUserId = user?.userId || user?.id || 1;
      await loadAddresses(currentUserId);
    } catch (err) {
      alert('Không thể cập nhật địa chỉ mặc định!');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    const token = getToken();
    if (!token) {
      alert('VUI LÒNG ĐĂNG NHẬP!\nBạn cần đăng nhập tài khoản trước khi đặt hàng.');
      router.push('/login');
      return;
    }

    if (!selectedAddressId) {
      alert('Vui lòng chọn hoặc thêm địa chỉ giao hàng!');
      return;
    }

    setLoading(true);
    const generatedId = Math.floor(Math.random() * 90000) + 10000;

    const user = getUser();
    const currentUserId = user?.userId || user?.id || 1;

    const newOrderObj = {
      id: generatedId,
      userId: currentUserId,
      addressId: selectedAddressId,
      note,
      paymentMethod,
      totalAmount: cartSubtotal,
      discountAmount,
      finalAmount: cartTotal,
      promotionCode: promotion?.code || null,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      items: cartItems.map((item) => {
        // Find a valid variant ID from the product's variants if item.variant.id is missing
        let validVariantId = item.variant?.id;
        if (!validVariantId) {
          validVariantId = item.product?.variants?.[0]?.id || 101; 
        }
        return {
          productId: item.product.id,
          variantId: validVariantId,
          productName: item.product.name,
          color: item.variant?.color || item.product?.variants?.[0]?.color || 'Đen Nhám',
          degree: item.variant?.degree || item.product?.variants?.[0]?.degree || '0.00',
          quantity: item.quantity,
          price: item.variant?.price || item.product.price || 1500000,
        };
      }),
    };

    // Save order into localStorage placed_orders array
    try {
      const existingOrders = JSON.parse(localStorage.getItem('placed_orders') || '[]');
      existingOrders.unshift(newOrderObj);
      localStorage.setItem('placed_orders', JSON.stringify(existingOrders));
    } catch (err) {}

    try {
      const res = await orderService.checkout(newOrderObj);
      if (res && res.data && res.data.orderId) {
        newOrderObj.id = res.data.orderId;
      }
      clearCart();
      setLoading(false);
      router.push(`/order-success/${newOrderObj.id}`);
    } catch (err) {
      console.log("Backend sync note:", err.message);
      alert('Lỗi đặt hàng: ' + err.message);
      setLoading(false);
    }
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Delivery Info & Payment Methods */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-white text-base flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>Sổ địa chỉ giao hàng</span>
              </div>
              {!showAddForm && (
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(true)}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm địa chỉ
                </button>
              )}
            </h3>

            {fetchingAddresses ? (
              <div className="text-xs text-slate-400 py-4 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                Đang tải sổ địa chỉ...
              </div>
            ) : (
              <div className="space-y-4">
                {/* List of saved addresses */}
                {!showAddForm && addresses.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map(addr => (
                      <label 
                        key={addr.id} 
                        className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedAddressId === addr.id ? 'bg-emerald-500/10 border-emerald-500 text-white' : 'bg-slate-800/40 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input 
                            type="radio" 
                            name="address" 
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="mt-1 accent-emerald-500"
                          />
                          <div className="text-xs space-y-1">
                            <div className="font-bold text-sm flex items-center gap-2">
                              {addr.receiverName}
                              {addr.isDefault ? (
                                <span className="bg-emerald-500 text-slate-950 text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase">Mặc định</span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => handleSetDefault(e, addr.id)}
                                  className="border border-slate-600 text-slate-400 hover:text-emerald-400 hover:border-emerald-500 text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase transition-colors cursor-pointer"
                                >
                                  Đặt mặc định
                                </button>
                              )}
                            </div>
                            <div className="text-slate-400">{addr.phoneNumber}</div>
                            <div className="text-slate-400 line-clamp-2">
                              {addr.addressDetail}, {addr.ward}, {addr.district}, {addr.city}
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* Add new address form */}
                {showAddForm && (
                  <form onSubmit={handleAddNewAddress} className="bg-slate-800/40 border border-slate-700 rounded-xl p-5 space-y-4 text-xs">
                    <div className="font-bold text-emerald-400 flex items-center justify-between mb-2">
                      Thêm địa chỉ mới
                      {addresses.length > 0 && (
                         <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white cursor-pointer">Hủy</button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Họ tên người nhận *</label>
                        <input type="text" required value={newAddress.receiverName} onChange={e => setNewAddress({...newAddress, receiverName: e.target.value})} className="w-full bg-slate-900 text-white p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Số điện thoại *</label>
                        <input type="text" required value={newAddress.phoneNumber} onChange={e => setNewAddress({...newAddress, phoneNumber: e.target.value})} className="w-full bg-slate-900 text-white p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-slate-300 font-semibold mb-1">Địa chỉ chi tiết (Số nhà, đường) *</label>
                        <input type="text" required value={newAddress.addressDetail} onChange={e => setNewAddress({...newAddress, addressDetail: e.target.value})} className="w-full bg-slate-900 text-white p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Tỉnh/Thành phố *</label>
                        <input type="text" required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full bg-slate-900 text-white p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Quận/Huyện *</label>
                        <input type="text" required value={newAddress.district} onChange={e => setNewAddress({...newAddress, district: e.target.value})} className="w-full bg-slate-900 text-white p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Phường/Xã *</label>
                        <input type="text" required value={newAddress.ward} onChange={e => setNewAddress({...newAddress, ward: e.target.value})} className="w-full bg-slate-900 text-white p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500" />
                      </div>
                      <div className="flex items-end">
                         <label className="flex items-center gap-2 cursor-pointer text-slate-300 mb-2">
                           <input type="checkbox" checked={newAddress.isDefault} onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})} className="accent-emerald-500 w-4 h-4" />
                           <span>Đặt làm địa chỉ mặc định</span>
                         </label>
                      </div>
                    </div>
                    <button type="submit" className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg cursor-pointer transition-colors">
                      Lưu địa chỉ
                    </button>
                  </form>
                )}

              </div>
            )}
            
            <div className="mt-4 border-t border-slate-800 pt-4">
              <label className="block text-slate-300 text-xs font-semibold mb-1">Ghi chú cho cửa hàng (Ví dụ: Đặt kính độ cận riêng)</label>
              <textarea
                rows="2"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Điền độ cận mắt trái/mắt phải hoặc thời gian nhận hàng mong muốn..."
                className="w-full text-xs bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
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
            type="button"
            onClick={handlePlaceOrder}
            disabled={loading || (!selectedAddressId && !showAddForm)}
            className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </div>
  );
}
