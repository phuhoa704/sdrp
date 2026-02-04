import { Breadcrumb, Button, Card } from '@/components'
import { ChevronRight, Grid, Layers, Layers3, Package, Plus } from 'lucide-react'
import React, { Fragment, useState } from 'react'
import { DataGroupsForm } from '@/components/form/datagroup/DataGroupsForm';

export const DataGroups = () => {
  const [isCreating, setIsCreating] = useState(false);

  if (isCreating) {
    return <DataGroupsForm onCancel={() => setIsCreating(false)} />;
  }

  return (
    <Fragment>
      <div className="pb-32 animate-fade-in space-y-8 min-h-full relative">
        <Breadcrumb
          items={[
            { label: 'KHO HÀNG', href: '#' },
            { label: 'PHÂN LOẠI HÀNG HÓA', href: '#' }
          ]}
        />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
          <div className="shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                Master Data Groups
              </span>
              <Layers size={12} className='text-amber-500 animate-pulse' />
            </div>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
              Phân Loại <span className="text-emerald-600 font-black">Sản Phẩm</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Tổ chức hàng hóa theo các nhóm chức năng chính</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              className="h-14 rounded-2xl bg-white text-primary border-2 border-primary"
              icon={<Plus size={20} />}
              onClick={() => setIsCreating(true)}
            >
              THÊM PHÂN LOẠI
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className='group col-span-1 relative cursor-pointer' onClick={() => setIsCreating(true)}>
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
                Thuốc trừ sâu
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-2 mb-8 leading-relaxed">
                Các loại hóa chất diệt trừ sâu hại cây trồng
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
        </div>
      </div>
    </Fragment>
  )
}
