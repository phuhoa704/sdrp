import { Search } from 'lucide-react'
import React from 'react'

interface Props {
  searchTerm: string;
  handleSearchChange: (searchTerm: string) => void;
  placeholder?: string;
}

export const SearchFilter = ({ searchTerm, handleSearchChange, placeholder }: Props) => {
  return (
    <div className="relative flex-1 group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
      <input
        type="text"
        placeholder={placeholder || "Tìm kiếm..."}
        className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white text-slate-800 font-bold"
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
    </div>
  )
}