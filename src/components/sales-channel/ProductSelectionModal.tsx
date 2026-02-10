import React, { useState } from 'react';
import { Modal } from '@/components/Modal';
import { useProducts } from '@/hooks/medusa/useProducts';
import { TableView } from '@/components/TableView';
import { Button } from '@/components/Button';
import { InputSearch } from '@/components/Search';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (productIds: string[]) => void;
  alreadySelectedIds: string[];
  isLoading: boolean;
}

export const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  alreadySelectedIds,
  isLoading: isSubmitting
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const { products, count, loading } = useProducts({
    q: searchTerm || undefined,
    limit,
    offset: (currentPage - 1) * limit,
  });

  const handleToggleProduct = (productId: string) => {
    if (alreadySelectedIds.includes(productId)) return;

    setSelectedIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleConfirm = () => {
    onSelect(selectedIds);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="THÊM SẢN PHẨM VÀO KÊNH BÁN HÀNG"
      maxWidth="6xl"
    >
      <div className="space-y-6 p-4">
        <InputSearch
          placeholder="Tìm sản phẩm..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div className="max-h-[400px] overflow-y-auto pr-2">
          <TableView
            columns={[
              { title: "", className: "w-10" },
              { title: "Sản phẩm" },
              { title: "Bộ sưu tập" },
              { title: "Trạng thái", className: "text-right" }
            ]}
            data={products}
            isLoading={loading}
            emptyMessage={{
              title: "Không tìm thấy sản phẩm",
              description: "Vui lòng thử từ khóa khác"
            }}
            pagination={{
              currentPage,
              totalPages: Math.ceil(count / limit),
              onPageChange: setCurrentPage,
              itemsPerPage: limit,
              totalItems: count
            }}
            renderRow={(product) => {
              const isAlreadyIn = alreadySelectedIds.includes(product.id);
              const isSelected = selectedIds.includes(product.id);

              return (
                <tr
                  key={product.id}
                  className={cn(
                    "border-b border-slate-100 dark:border-slate-800 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50",
                    isAlreadyIn && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => handleToggleProduct(product.id)}
                >
                  <td className="py-4 px-4 text-center">
                    <div className={cn(
                      "w-5 h-5 rounded border flex items-center justify-center transition-all",
                      isSelected ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 dark:border-slate-600",
                      isAlreadyIn && "bg-slate-200 dark:bg-slate-700 border-slate-200 dark:border-slate-700"
                    )}>
                      {(isSelected || isAlreadyIn) && <Check size={14} strokeWidth={4} />}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 shrink-0">
                        <img
                          src={product.thumbnail || '/placeholder.png'}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 dark:text-white leading-tight">{product.title}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{product.handle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-xs font-bold text-slate-500">
                      {product.collection?.title || "N/A"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={cn(
                      "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                      product.status === 'published' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                    )}>
                      {product.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                    </span>
                  </td>
                </tr>
              );
            }}
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t dark:border-slate-800">
          <p className="text-xs font-bold text-slate-400">
            Đã chọn: <span className="text-emerald-500">{selectedIds.length}</span> sản phẩm mới
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              HỦY BỎ
            </Button>
            <Button
              onClick={handleConfirm}
              loading={isSubmitting}
              disabled={selectedIds.length === 0}
            >
              THÊM VÀO KÊNH
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
