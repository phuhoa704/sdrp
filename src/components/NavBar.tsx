
import React, { Fragment } from 'react';
import { LogOut, Bell, MonitorPlay, BrainCircuit, Sparkles, BookOpen, Zap } from 'lucide-react';
import { UserRole } from '@/types/enum';

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
}

const NEWS = [
  "Giá lúa gạo xuất khẩu đạt đỉnh mới trong quý 2/2024",
  "Kỹ thuật canh tác lúa hữu cơ giảm 30% chi phí phân bón",
  "Giá lúa gạo xuất khẩu đạt đỉnh mới trong quý 2/2024",
  "Kỹ thuật canh tác lúa hữu cơ giảm 30% chi phí phân bón"
]

export const Header: React.FC<HeaderProps> = ({ title, subtitle, role, onLogout, onGoToPOS, onAIDiagnosis, onDiseaseLookup, avatarUrl = "https://picsum.photos/100/100", onShowNotifications }) => {
  return (
    <header className="flex items-center justify-between py-6 px-8 sticky top-0 bg-[#F8FAFC]/80 dark:bg-slate-950/80 z-40 backdrop-blur-md border-b border-green-50/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="flex items-center gap-2 lg:gap-4 min-w-0 shrink">
        <div className="overflow-hidden">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs font-semibold text-emerald-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="flex-1 max-w-lg mx-2 hidden xl:flex items-center overflow-hidden">
        <div className="flex items-center glass-panel rounded-2xl border border-white/40 dark:border-slate-800/40 shadow-glass overflow-hidden w-full h-11 relative inner-border-glow">
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
            <Fragment>
              <button
                onClick={onAIDiagnosis}
                className="relative flex items-center justify-center h-10 w-10 lg:w-auto lg:px-5 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-xl lg:rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-all border border-white/20 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="relative flex items-center">
                  <BrainCircuit size={18} className='group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500' />
                  <span className="hidden lg:inline ml-2.5 text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap">AI Diagnosis</span>
                  <Sparkles size={10} className='absolute -top-1 -right-2 text-amber-300 animate-bounce hidden lg:block' />
                </div>
              </button>
              <button
                onClick={onDiseaseLookup}
                className="flex items-center justify-center h-10 w-10 lg:w-auto lg:px-5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl lg:rounded-2xl shadow-smooth border border-slate-100 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition-all group"
              >
                <BookOpen size={18} className='group-hover:scale-110 transition-transform' />
                <span className="hidden lg:inline ml-2.5 text-[10px] font-black uppercase tracking-widest">Tra cứu</span>
              </button>
            </Fragment>
          )}
          {role === UserRole.RETAILER && (
            <button className="flex items-center justify-center h-10 w-10 lg:w-auto lg:px-5 bg-gradient-to-br from-[#10B981] to-[#059669] text-white rounded-xl lg:rounded-2xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all border border-white/10 group">
              <MonitorPlay size={18} className='group-hover:scale-110 transition-transform' />
              <span className="hidden lg:inline ml-2.5 text-[10px] font-black uppercase tracking-widest">POS</span>
            </button>
          )}
        </div>

        <button
          onClick={onShowNotifications}
          className="relative p-2.5 bg-white dark:bg-slate-900 rounded-2xl shadow-smooth text-slate-400 dark:text-slate-500 hover:text-primary transition-all border border-transparent dark:border-slate-800"
        >
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-400 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        <button onClick={onLogout} className="p-2.5 bg-white dark:bg-slate-900 rounded-2xl shadow-smooth text-slate-400 dark:text-slate-500 hover:text-rose-400 transition-all border border-transparent dark:border-slate-800">
          <LogOut size={18} />
        </button>
        <div className="w-11 h-11 rounded-2xl border-4 border-white dark:border-slate-800 shadow-smooth overflow-hidden">
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
};
