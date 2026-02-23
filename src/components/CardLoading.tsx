import React from 'react'

export const CardLoading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800" />
            <div className="w-16 h-4 bg-slate-100 dark:bg-slate-800 rounded" />
          </div>
          <div className="w-3/4 h-6 bg-slate-100 dark:bg-slate-800 rounded mb-4" />
          <div className="w-full h-12 bg-slate-100 dark:bg-slate-800 rounded mb-8" />
          <div className="pt-6 border-t dark:border-slate-800 flex justify-between items-center">
            <div className="w-24 h-4 bg-slate-100 dark:bg-slate-800 rounded" />
            <div className="w-5 h-5 bg-slate-100 dark:bg-slate-800 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
