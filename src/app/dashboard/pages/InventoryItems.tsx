import { Breadcrumb, Button, Card } from '@/components'
import { SearchFilter } from '@/components/filters/Search';
import { Boxes, Download, Info, Plus } from 'lucide-react';
import React, { Fragment, useState } from 'react'
import { useInventoryItems } from '@/hooks/medusa/useInventory';
import { TableView } from '@/components/TableView';
import { noImage } from '@/configs';
import { InventoryItem } from '@/types/inventory-item';
import { InventoryItemsDetail } from '@/components/inventory-items/InventoryItemsDetail';

export const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const offset = (currentPage - 1) * limit;
  const { inventoryItems, loading, error, count } = useInventoryItems({ q: searchTerm, limit, offset });
  return (
    <Fragment>
      <div className="pb-32 animate-fade-in space-y-8 min-h-full relative">
        <Breadcrumb
          items={[
            { label: 'KHO HÀNG', href: '#' },
            { label: 'DANH MỤC TỒN KHO (SKU)', href: '#' }
          ]}
        />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
          <div className="shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                SKU INVENTORY HUB
              </span>
              <Boxes size={12} className='text-amber-500 animate-pulse' />
            </div>
            <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
              Quản Lý <span className="text-blue-600 font-black">Tồn Kho Biến Thể</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Theo dõi chi tiết theo từng mã SKU và vị trí kho thực tế</p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant='secondary' className='text-xs'>
              <Download size={16} />
              Xuất báo cáo
            </Button>
            <Button
              className="h-12 rounded-2xl bg-white text-primary text-xs border-2 border-primary"
              icon={<Plus size={16} />}
              onClick={() => { }}>
              TẠO PHIẾU NHẬP HÀNG
            </Button>
          </div>
        </div>
        <Card className='flex flex-col xl:flex-row gap-4'>
          <SearchFilter
            searchTerm={searchTerm}
            handleSearchChange={setSearchTerm}
            placeholder='Tìm kiếm theo mã SKU, tên sản phẩm, hoặc quy cách...'
          />
        </Card>
        <TableView
          columns={[
            { title: "Mã SKU" },
            { title: "Tên sản phẩm" },
            { title: "Quy cách" },
            { title: "Tồn kho", className: "text-center" },
            { title: "Thao tác", className: "text-right" }
          ]}
          headerClassName='bg-blue-600 dark:bg-slate-800/50'
          data={inventoryItems}
          isLoading={loading}
          emptyMessage={{
            title: "Không tìm thấy danh mục hàng hóa",
            description: "Hãy thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc.",
          }}
          pagination={{
            currentPage,
            totalPages: Math.ceil(count / limit),
            onPageChange: (page) => setCurrentPage(page),
            itemsPerPage: limit,
            totalItems: count,
          }}
          renderRow={(item, idx) => (
            <tr
              key={idx}
              onClick={() => setSelectedItem(item)}
              className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-800/50 last:border-none"
            >
              <td className='py-5 px-4 pl-8'>
                <span className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800/50 uppercase tracking-tighter">{item.sku}</span>
              </td>
              <td className='py-5 px-4'>
                <div className="flex items-center gap-4">
                  <img src={item.thumbnail || noImage} alt="" className='w-10 h-10 rounded-xl object-cover shadow-sm' />
                  <div className="">
                    <p className="font-black text-slate-800 dark:text-white text-xs uppercase tracking-tight leading-none mb-1">{item.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{item.material || ""}</p>
                  </div>
                </div>
              </td>
              <td className='py-5 px-4'>{""}</td>
              <td className='py-5 px-4 text-center'>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100">{item.stocked_quantity}</span>
              </td>
              <td className='py-5 px-4 text-right'>
                <button className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-300 group-hover:text-blue-600 group-hover:bg-white transition-all shadow-sm">
                  <Info size={18} />
                </button>
              </td>
            </tr>
          )}
        />
      </div>
      <InventoryItemsDetail
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </Fragment>
  )
}
