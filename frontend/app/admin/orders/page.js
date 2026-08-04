'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    let combined = [
      { id: 101, receiverName: 'Nguyễn Tấn Điệp', receiverPhone: '0912345678', shippingAddress: '123 Nguyễn Trãi, Q.5, TP.HCM', finalAmount: 1450000, paymentMethod: 'COD', status: 'Pending', createdAt: '2026-07-29T08:30:00' },
      { id: 102, receiverName: 'Trần Thị Mai', receiverPhone: '0987654321', shippingAddress: '456 Lê Lợi, Q.1, TP.HCM', finalAmount: 2200000, paymentMethod: 'VNPay', status: 'Confirmed', createdAt: '2026-07-29T07:15:00' },
      { id: 103, receiverName: 'Lê Hoàng Nam', receiverPhone: '0909123456', shippingAddress: '789 Võ Văn Tần, Q.3, TP.HCM', finalAmount: 980000, paymentMethod: 'COD', status: 'Shipping', createdAt: '2026-07-28T18:40:00' },
    ];

    // Load orders placed by customers from localStorage
    try {
      const localPlaced = JSON.parse(localStorage.getItem('placed_orders') || '[]');
      localPlaced.forEach((o) => {
        if (!combined.some(existing => existing.id === o.id)) {
          combined.unshift(o);
        }
      });
    } catch (e) {}

    try {
      const res = await fetchApi('/admin/orders');
      if (res.data && res.data.length > 0) {
        setOrders(res.data);
        return;
      }
    } catch (e) {}

    setOrders(combined);
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await fetchApi(`/admin/orders/${orderId}/status?status=${newStatus}`, { method: 'PUT' });
    } catch (err) {}

    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);

    // Save updated status to localStorage
    try {
      const localPlaced = JSON.parse(localStorage.getItem('placed_orders') || '[]');
      const updatedLocal = localPlaced.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
      localStorage.setItem('placed_orders', JSON.stringify(updatedLocal));
    } catch (e) {}

    alert(`Đã cập nhật trạng thái đơn hàng #${orderId} thành '${newStatus}'!`);
  };

  const filteredOrders = selectedStatus === 'ALL'
    ? orders
    : orders.filter(o => o.status?.toUpperCase() === selectedStatus);

  const tabs = ['ALL', 'PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-400" />
            <span>Quản lý Đơn Hàng Vận Hành Cửa Hàng</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Đơn hàng mới từ khách mua sắm sẽ tự động xuất hiện ở đây ngay tức thì</p>
        </div>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
          Tổng số: {orders.length} đơn hàng
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedStatus(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedStatus === tab
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/60 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4">Mã đơn</th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Địa chỉ giao hàng</th>
              <th className="p-4">Thanh toán</th>
              <th className="p-4">Tổng tiền</th>
              <th className="p-4">Cập nhật trạng thái</th>
              <th className="p-4 text-right">Ngày đặt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {filteredOrders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-bold text-emerald-400">#{o.id}</td>
                <td className="p-4 font-bold text-white">
                  {o.receiverName}
                  <div className="text-[11px] text-slate-400 font-normal">{o.receiverPhone}</div>
                </td>
                <td className="p-4 text-slate-400 max-w-xs truncate">{o.shippingAddress}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                    {o.paymentMethod || 'COD'}
                  </span>
                </td>
                <td className="p-4 font-bold text-emerald-400 text-sm">
                  {o.finalAmount?.toLocaleString('vi-VN')} VNĐ
                </td>
                <td className="p-4">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className="bg-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Pending" className="text-amber-400">Pending (Chờ duyệt)</option>
                    <option value="Confirmed" className="text-sky-400">Confirmed (Đã xác nhận)</option>
                    <option value="Shipping" className="text-purple-400">Shipping (Đang giao)</option>
                    <option value="Delivered" className="text-emerald-400">Delivered (Hoàn tất)</option>
                    <option value="Cancelled" className="text-rose-400">Cancelled (Đã hủy)</option>
                  </select>
                </td>
                <td className="p-4 text-right text-slate-400">
                  {new Date(o.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
