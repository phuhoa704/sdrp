'use client';

import { cn } from '@/lib/utils';
import { TrendingUp, Users, Package, Shield, Filter, Download, LayoutDashboard, FileCheck } from 'lucide-react';
import { useState } from 'react';

export default function AdminDashboard() {
  const systemMetrics = [
    { label: 'Tổng GMV toàn hệ thống', value: '18.2tỷ', change: '+18.5%', icon: TrendingUp, color: 'blue' },
    { label: 'Đại lý hoạt động', value: '1,420', change: '+8.2%', icon: Users, color: 'emerald' },
    { label: 'Sản phẩm Master Data', value: '856', change: '+2.1%', icon: Package, color: 'amber' },
    { label: 'Tỷ lệ phê duyệt', value: '94.2%', change: '+4.1%', icon: Shield, color: 'purple' },
  ];

  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="space-y-6">
      <div className="flex p-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 max-w-sm mx-auto transition-all sticky top-4 z-50">
        <button
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black transition-all shadow-lg uppercase text-slate-500",
            activeTab === 'dashboard' && 'bg-indigo-600 text-white'
          )}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={14} />
          Dashboard
        </button>
        <button
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black transition-all shadow-lg uppercase text-slate-500",
            activeTab === 'master-data' && 'bg-indigo-600 text-white'
          )}
          onClick={() => setActiveTab('master-data')}
        >
          <FileCheck size={14} />
          Master Data
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            SYSTEM CONTROL CENTER
          </div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 mb-2">
            SDRP <span className="text-blue-600">Command Center</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Giám sát hoạt động chuỗi cung ứng nông nghiệp toàn hệ thống
          </p>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2">
            <Filter size={18} />
            LỌC DỮ LIỆU
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <Download size={18} />
            XUẤT BÁO CÁO
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric, index) => {
          const Icon = metric.icon;
          const colorMap: Record<string, string> = {
            blue: 'bg-blue-500 text-blue-500',
            emerald: 'bg-emerald-500 text-emerald-500',
            amber: 'bg-amber-500 text-amber-500',
            purple: 'bg-purple-500 text-purple-500',
          };
          const colorClasses = colorMap[metric.color] || 'bg-gray-500 text-gray-500';

          return (
            <div key={index} className="bg-slate-900 dark:bg-slate-950 rounded-2xl p-6 border border-slate-800">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${colorClasses.split(' ')[0]}/20 rounded-xl flex items-center justify-center`}>
                  <Icon size={24} className={colorClasses.split(' ')[1]} />
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                  {metric.change}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {metric.label}
              </p>
              <p className="text-3xl font-black text-white">{metric.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">TĂNG TRƯỞNG DOANH THU & ĐƠN HÀNG</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Số liệu tổng hợp từ B2B Marketplace & B2C POS</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold">
                6 THÁNG
              </button>
              <button className="px-3 py-1 text-slate-500 dark:text-slate-400 rounded-lg text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800">
                1 NĂM
              </button>
            </div>
          </div>

          <div className="h-64 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950/20 dark:to-emerald-950/20 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800">
            <div className="text-center">
              <TrendingUp size={48} className="text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Revenue Growth Chart</p>
              <p className="text-xs text-slate-500 dark:text-slate-500">Integrate chart library here</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">KHU VỰC TRỌNG ĐIỂM</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Phân bổ doanh số theo tỉnh thành</p>
            </div>
          </div>

          <div className="h-64 flex items-center justify-center">
            <div className="relative">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-black text-slate-800 dark:text-slate-200">85%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Coverage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Đồng bằng sông Cửu Long</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Đông Nam Bộ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Tây Nguyên</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Miền Trung</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">TOP SELLING CATEGORY</p>
          <p className="text-2xl font-black text-slate-800 dark:text-slate-200">Thuốc trừ sâu</p>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mt-1">+24% vs tháng trước</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">AVG ORDER VALUE</p>
          <p className="text-2xl font-black text-slate-800 dark:text-slate-200">12.8 triệu</p>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-bold mt-1">B2B Marketplace</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">ACTIVE USERS (30D)</p>
          <p className="text-2xl font-black text-slate-800 dark:text-slate-200">2,847</p>
          <p className="text-sm text-purple-600 dark:text-purple-400 font-bold mt-1">+156 new users</p>
        </div>
      </div>
    </div>
  );
}
