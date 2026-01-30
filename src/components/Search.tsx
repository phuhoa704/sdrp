import { Search } from 'lucide-react'
import React from 'react'

interface Props {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputSearch = ({ placeholder, value, onChange }: Props) => {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all shadow-sm dark:text-slate-200"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  )
}