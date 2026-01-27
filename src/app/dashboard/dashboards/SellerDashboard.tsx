'use client';

import { TrendingUp, Users, Package, Clock } from 'lucide-react';

export default function SellerDashboard() {
  const metrics = [
    { label: 'Doanh số tháng', value: '4.2tỷ', change: '+12.3%', icon: TrendingUp, color: 'blue' },
    { label: 'Chỉ tiêu (KPI)', value: '85%', change: 'Đạt 8/9 chỉ tiêu', icon: TrendingUp, color: 'purple' },
    { label: 'Đại lý hoạt động', value: '128', change: '+3 đại lý mới', icon: Users, color: 'emerald' },
    { label: 'Tồn kho hệ thống', value: '15.6k', change: 'Trong tháng', icon: Package, color: 'amber' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const colorMap: Record<string, string> = {
            blue: 'bg-blue-500 text-blue-500',
            purple: 'bg-purple-500 text-purple-500',
            emerald: 'bg-emerald-500 text-emerald-500',
            amber: 'bg-amber-500 text-amber-500',
          };
          const colorClasses = colorMap[metric.color] || 'bg-gray-500 text-gray-500';

          return (
            <div key={index} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
              <div className="flex items-start justify-between mb-4">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {metric.label}
                </p>
                <div className={`w-12 h-12 ${colorClasses.split(' ')[0]}/10 rounded-xl flex items-center justify-center`}>
                  <Icon size={24} className={colorClasses.split(' ')[1]} />
                </div>
              </div>
              <p className="text-3xl font-black text-slate-800 dark:text-slate-100 mb-2">{metric.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{metric.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-8 text-white h-full">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                CHƯƠNG TRÌNH QUÝ 2
              </div>

              <h2 className="text-5xl font-black mb-4 leading-tight">
                Mùa Vàng Kết Nối
              </h2>
              <p className="text-2xl font-bold text-emerald-300 mb-4">
                Tăng 15% cho NPP mới
              </p>
              <p className="text-white/90 text-sm leading-relaxed mb-6 max-w-lg">
                Áp dụng cho đơn hàng sỉ trên 500 triệu đồng. Catalogue sản phẩm bảo vệ<br />
                thực vật 2024 đã sẵn sàng tải về.
              </p>

              <div className="flex gap-3">
                <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors">
                  THAM GIA NGAY
                </button>
                <button className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl border border-white/20 transition-colors">
                  TẢI CATALOGUE
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Clock size={16} className="text-blue-500" />
                LỊCH CÔNG TÁC
              </h3>
              <button className="text-blue-500 text-xs font-bold">+</button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs font-bold text-blue-600 dark:text-blue-400">THỨ</p>
                      <p className="text-lg font-black text-blue-600 dark:text-blue-400">18</p>
                    </div>
                  </div>
                  <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-700 mt-2"></div>
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">Ghé thăm đại lý Ánh Bảo</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Thăm khách, Đồng Tháp</p>
                  <button className="mt-2 text-xs text-blue-500 font-bold">Xem chi tiết →</button>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-400">THỨ</p>
                      <p className="text-lg font-black text-slate-400">20</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">Họp NPP miền Tây</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Cần Thơ, Hội trường</p>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
              XEM TOÀN BỘ LỊCH
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <span className="text-amber-500">📝</span>
              GHI CHÚ NHANH
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed">
              Ghi lại các yêu cầu đặc biệt từ đại lý hoặc hoạc NPP...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
