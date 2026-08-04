'use client';

import { useState, useEffect } from 'react';
import WelcomeBanner from '@/components/admin/WelcomeBanner';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import Link from 'next/link';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: '48.250.000',
    totalOrders: 1284,
    totalCustomers: 892,
    conversionRate: '6.45%',
    lowStockCount: 4
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const res = await fetchApi('/admin/orders');
        if (res.data) {
          setRecentOrders(res.data.slice(0, 5));
        }
      } catch (e) {
        // Fallback demo data if no backend orders yet
        setRecentOrders([
          { id: 101, receiverName: 'Nguyễn Văn An', finalAmount: 1450000, status: 'Pending', createdAt: '2026-07-29T08:30:00' },
          { id: 102, receiverName: 'Trần Thị Mai', finalAmount: 2200000, status: 'Confirmed', createdAt: '2026-07-29T07:15:00' },
          { id: 103, receiverName: 'Lê Hoàng Nam', finalAmount: 980000, status: 'Shipping', createdAt: '2026-07-28T18:40:00' },
          { id: 104, receiverName: 'Phạm Minh Tuấn', finalAmount: 3100000, status: 'Delivered', createdAt: '2026-07-28T14:20:00' },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Step 5: Welcome Hero Banner matching sample image */}
      <WelcomeBanner username="Aigars Silkalns" newOrdersCount={12} revenueToday="4.200.000" />

      {/* Top Main Cards matching sample image */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue Card */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</p>
              <h2 className="text-3xl font-black text-white mt-1">${stats.totalRevenue}</h2>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md mt-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12.5% from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-xl">
              $
            </div>
          </div>

          {/* SVG Line Chart SVG preview matching screenshot */}
          <div className="h-32 w-full mt-4">
            <svg className="w-full h-full" viewBox="0 0 500 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 70 Q 50 60, 100 65 T 200 50 T 300 45 T 400 35 T 500 20 L 500 100 L 0 100 Z"
                fill="url(#revenueGradient)"
              />
              <path
                d="M 0 70 Q 50 60, 100 65 T 200 50 T 300 45 T 400 35 T 500 20"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>

        {/* Monthly Goal Radial Card matching sample image */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 stroke-current transition-all duration-1000"
                strokeWidth="3.2"
                strokeDasharray="72, 100"
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black text-white">72%</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Monthly Goal</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-slate-400 font-medium">$48.2K of $67K target</p>
          </div>
        </div>
      </div>

      {/* Middle Row: Orders Chart & Conversion Funnel matching sample image */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Orders Bar Chart Card */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Orders</p>
              <h3 className="text-2xl font-extrabold text-white mt-0.5">1,284</h3>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">+8.2%</span>
          </div>
          {/* Status Indicators Legend */}
          <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-6 flex-wrap">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Completed</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500"></span> Processing</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending</span>
          </div>
          {/* Simulated Bar Chart */}
          <div className="h-40 flex items-end justify-between gap-2 pt-4">
            {[45, 65, 80, 55, 90, 75, 85].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className="w-full bg-emerald-500 rounded-t-md hover:bg-emerald-400 transition-all cursor-pointer"
                  style={{ height: `${val}%` }}
                ></div>
                <span className="text-[10px] text-slate-500 font-medium">Mon</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customers Growth Card */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase">Customers</p>
              <h3 className="text-2xl font-extrabold text-white mt-0.5">892</h3>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">+5.1%</span>
          </div>
          <div className="h-40 w-full flex items-end">
            <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
              <path d="M 0 80 Q 50 70, 100 50 T 200 40 T 300 20" fill="none" stroke="#10b981" strokeWidth="3" />
            </svg>
          </div>
        </div>

        {/* Conversion Funnel Card */}
        <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400 uppercase">Conversion Funnel</p>
            <span className="text-xs text-slate-500">This month</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-white">6.45%</h3>
            <p className="text-xs text-slate-400">Overall conversion rate</p>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Visitors</span>
                <span className="font-bold">10,000</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Leads</span>
                <span className="font-bold">2,400</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full w-[60%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Customers</span>
                <span className="font-bold">892</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full w-[35%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Orders */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Đơn hàng vừa phát sinh</h3>
            <p className="text-xs text-slate-400">Danh sách đơn mua mới nhất từ khách hàng</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Xem tất cả đơn hàng</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/50 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Mã đơn</th>
                <th className="p-3.5">Khách hàng</th>
                <th className="p-3.5">Tổng tiền</th>
                <th className="p-3.5">Trạng thái</th>
                <th className="p-3.5 text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-bold text-emerald-400">#{order.id}</td>
                  <td className="p-3.5 font-medium text-white">{order.receiverName}</td>
                  <td className="p-3.5 font-semibold">{order.finalAmount?.toLocaleString('vi-VN')} VNĐ</td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        order.status === 'Pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : order.status === 'Confirmed'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right text-slate-400">
                    {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
