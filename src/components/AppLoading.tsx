import { Loader2, Zap } from 'lucide-react'
import React from 'react'

export const AppLoading = () => {
  return (
    <div className="absolute inset-0 z-[1000] bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center animate-fade-in w-screen h-screen">
      <div className="relative mb-8">
        <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 animate-pulse">
          <Zap size={48} className="text-white" fill="currentColor" />
        </div>
        <div className="absolute -inset-4 border-2 border-primary/20 rounded-full animate-[spin_3s_linear_infinite]" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight">Đang đồng bộ dữ liệu</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-2">
          Vui lòng chờ trong giây lát <Loader2 size={16} className="animate-spin" />
        </p>
      </div>
    </div>
  )
}
