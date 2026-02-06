import { Package } from 'lucide-react'
import React from 'react'

export const Empty = ({ title, description }: { title: string, description: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 opacity-40">
      <div className="w-20 h-20 rounded-[32px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-400">
        <Package size={40} />
      </div>
      <div className="space-y-1 text-center">
        <p className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-slate-100">
          {title}
        </p>
        <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">
          {description}
        </p>
      </div>
    </div>
  )
}
