import { ChevronRight } from 'lucide-react'
import React from 'react'

interface Props {
  items: { label: string; href: string, onClick?: () => void }[];
}

export const Breadcrumb = ({ items }: Props) => {
  return (
    <div className="flex items-center gap-2 px-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span className="hover:text-primary cursor-pointer transition-colors" onClick={item.onClick}>{item.label}</span>
          {index < items.length - 1 && <ChevronRight size={10} />}
        </React.Fragment>
      ))}
    </div>
  )
}
