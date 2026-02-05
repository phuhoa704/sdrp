import { ProductType } from '@/types/product-type'
import React from 'react'
import { Card } from '../Card'
import { ChevronRight, Grid, Layers3, Package } from 'lucide-react'

interface Props {
  productType: ProductType
  onClick: () => void
}

export const ProductTypeCard = ({ productType, onClick }: Props) => {
  return (
    <Card className='group col-span-1 relative cursor-pointer' onClick={onClick}>
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
        <Layers3 size={120} className='text-slate-600' />
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
            <Grid size={24} />
          </div>
          <span className="text-[9px] font-black px-2 py-1 bg-emerald-50 text-emerald-600 rounded uppercase tracking-widest">active</span>
        </div>
        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
          {productType.value}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mb-8 leading-relaxed">
          {/* {productType.description} */}
        </p>
        <div className="pt-6 border-t dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package size={14} className='text-slate-400' />
            <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter">45 sản phẩm</span>
          </div>
          <ChevronRight size={18} className='text-slate-300 group-hover:translate-x-1 transition-transform' />
        </div>
      </div>
    </Card>
  )
}
