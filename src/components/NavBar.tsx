
import React, { Fragment, useState } from 'react';
import { ConfirmModal } from '@/components';
import { LogOut, Bell, MonitorPlay, BrainCircuit, Sparkles, BookOpen, Zap, User, Wrench, ChevronDown, Info, Settings, Menu } from 'lucide-react';
import { UserRole } from '@/types/enum';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
  role: UserRole | null;
  onLogout: () => void;
  onGoToPOS: () => void;
  onAIDiagnosis: () => void;
  onDiseaseLookup: () => void;
  avatarUrl?: string;
  onShowNotifications: () => void;
  onToggleMobileMenu?: () => void;
}

const NEWS = [
  "Giá lúa gạo xuất khẩu đạt đỉnh mới trong quý 2/2024",
  "Kỹ thuật canh tác lúa hữu cơ giảm 30% chi phí phân bón",
  "Giá lúa gạo xuất khẩu đạt đỉnh mới trong quý 2/2024",
  "Kỹ thuật canh tác lúa hữu cơ giảm 30% chi phí phân bón"
]

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  role,
  onLogout,
  onGoToPOS,
  onAIDiagnosis,
  onDiseaseLookup,
  avatarUrl = "https://picsum.photos/100/100",
  onShowNotifications,
  onToggleMobileMenu
}) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="flex items-center justify-between py-4 px-4 lg:px-8 sticky top-0 bg-[#F8FAFC]/80 dark:bg-slate-950/80 z-[90] backdrop-blur-2xl border-b border-white/80 dark:border-slate-800/40 transition-all duration-500 h-16 lg:h-20 inner-border-glow">
      <div className="flex items-center gap-2 lg:gap-4 min-w-0 shrink">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 lg:hidden text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="overflow-hidden">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs font-semibold text-emerald-500 mt-0.5 line-clamp-1">{subtitle}</p>}
        </div>
      </div>
      <div className="flex-1 max-w-lg mx-2 hidden xl:flex items-center overflow-hidden">
        <div className="flex items-center glass-panel rounded-2xl border border-white/40 dark:border-slate-800/40 shadow-glass overflow-hidden w-full h-11 relative inner-border-glow bg-white dark:bg-transparent">
          <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-white px-4 h-full flex items-center gap-2 z-10 shrink-0 relative after:content-[''] after:absolute after:left-full after:top-0 after:border-y-[22px] after:border-y-transparent after:border-l-[12px] after:border-l-amber-600">
            <Zap size={14} className='animate-pulse' />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap">Tin mới</span>
          </div>
          <div className="flex-1 overflow-hidden relative flex items-center">
            <div className="whitespace-nowrap flex items-center animate-marquee">
              {NEWS.map((news, index) => (
                <button key={index} className="flex items-center gap-3 px-6 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 group-hover:scale-125 transition-transform"></span>
                  <span className="truncate max-w-xs">{news}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-auto">
        <div className="flex items-center gap-2 md:gap-3">
          {role !== UserRole.ADMIN && (
            <div className="relative">
              {isToolsOpen && (
                <div className="fixed inset-0 z-10" onClick={() => setIsToolsOpen(false)} />
              )}
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={`relative z-20 flex items-center gap-2.5 h-10 px-4 rounded-2xl transition-all duration-300 border ${isToolsOpen
                  ? 'bg-slate-800 text-white border-slate-800 shadow-xl'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600 shadow-sm'
                  }`}
              >
                <Wrench size={18} className={cn("transition-transform duration-300 ease-linear", isToolsOpen ? 'text-emerald-400 rotate-[135deg]' : '')} />
                <span className="text-[10px] font-black uppercase tracking-widest hidden lg:inline">Công cụ</span>
                <ChevronDown size={14} className={cn("transition-transform duration-300 ease-linear", isToolsOpen ? 'rotate-180 text-emerald-400' : 'opacity-50')} />
              </button>

              {isToolsOpen && (
                <div className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-6 pb-2">
                    <div className="flex items-center gap-2 mb-6 text-slate-400">
                      <Wrench size={14} className="text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Hộp dụng cụ nông nghiệp</span>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          onAIDiagnosis();
                          setIsToolsOpen(false);
                        }}
                        className="w-full p-4 bg-slate-50 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-900/20 rounded-[24px] flex items-center gap-4 group transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                          <BrainCircuit size={24} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 uppercase tracking-wide">Chẩn đoán AI</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5 group-hover:text-indigo-400/70">Mắt thần chẩn trị</p>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          onDiseaseLookup();
                          setIsToolsOpen(false);
                        }}
                        className="w-full p-4 bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-900/20 rounded-[24px] flex items-center gap-4 group transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-300">
                          <BookOpen size={24} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 uppercase tracking-wide">Tra cứu Wiki</p>
                          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5 group-hover:text-emerald-400/70">Thư viện phác đồ</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="py-4 px-6 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-start gap-3 mt-2">
                    <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                      Bộ công cụ hỗ trợ ra quyết định kỹ thuật dựa trên dữ liệu chuẩn quốc tế.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          {role === UserRole.RETAILER && (
            <button
              onClick={onGoToPOS}
              className="flex items-center justify-center h-10 w-10 lg:w-auto lg:px-5 bg-gradient-to-br from-[#10B981] to-[#059669] text-white rounded-xl lg:rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all border border-white/10 group"
            >
              <MonitorPlay size={18} className='group-hover:scale-110 transition-transform' />
              <span className="hidden lg:inline ml-2.5 text-[10px] font-black uppercase tracking-widest">POS</span>
            </button>
          )}
        </div>
        <div className="h-7 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block opacity-50"></div>
        <button
          onClick={onShowNotifications}
          className="relative p-2.5 bg-white dark:bg-slate-900 rounded-2xl shadow-smooth text-slate-400 dark:text-slate-500 hover:text-primary transition-all border border-transparent dark:border-slate-800"
        >
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-400 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        <div className="relative">
          {isProfileOpen && (
            <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
          )}
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-11 h-11 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 rounded-2xl shadow-smooth overflow-hidden flex justify-center items-center relative z-20 hover:scale-105 active:scale-95 transition-all border border-transparent dark:border-slate-800"
          >
            <img src={avatarUrl} alt="" className='w-full h-full object-cover' />
          </button>

          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-3 w-64 backdrop-blur-xs bg-white/80 dark:bg-slate-900/80 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-5 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100/50 dark:border-emerald-800/20">
                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">Tài khoản quản trị</p>
                <p className="text-sm font-black text-slate-800 dark:text-slate-100">{title}</p>
              </div>

              <div className="p-2">
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all group uppercase tracking-widest"
                >
                  <Settings size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
                  Thiết lập hệ thống
                </button>
                <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-1 mx-2" />
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all group uppercase tracking-widest"
                >
                  <LogOut size={16} className="text-rose-400 group-hover:scale-110 transition-transform" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          onLogout();
        }}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?"
        confirmText="Đăng xuất"
        cancelText="Hủy"
        variant="danger"
      />
    </header>
  );
};
