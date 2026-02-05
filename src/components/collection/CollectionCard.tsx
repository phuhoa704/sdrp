import React from 'react'
import { ProductCollection } from '@/types/product';
import { Card } from '../Card';
import { ChevronRight, FolderOpen, Package } from 'lucide-react';

interface CollectionCardProps {
  collection: ProductCollection;
  onEdit: (collection: ProductCollection) => void;
}

export const CollectionCard = ({ collection, onEdit }: CollectionCardProps) => {
  return (
    <Card className='group relative cursor-pointer' onClick={() => onEdit(collection)}>
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
        <FolderOpen size={120} className='text-slate-600' />
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
            <FolderOpen size={24} />
          </div>
          <span className="text-[9px] font-black px-2 py-1 bg-amber-50 text-amber-600 rounded uppercase tracking-widest">Bộ sưu tập</span>
        </div>
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 group-hover:text-amber-600 transition-colors uppercase tracking-tight">{collection.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mb-8 leading-relaxed">/{collection.handle}</p>
        <div className="pt-6 border-t dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package size={14} className='text-slate-400' />
            <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter">{collection.products?.length || 0} sản phẩm</span>
          </div>
          <ChevronRight size={18} className='text-slate-300 group-hover:translate-x-1 transition-transform' />
        </div>
      </div>
    </Card>
  )
}
