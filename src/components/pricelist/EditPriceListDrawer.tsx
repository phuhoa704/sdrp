import { PriceList } from "@/types/price";
import { Button } from "../Button";
import { Drawer } from "../Drawer";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface EditPriceListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  priceList: PriceList;
  onSave: (data: any) => void;
}

export const EditPriceListDrawer: React.FC<EditPriceListDrawerProps> = ({ isOpen, onClose, priceList, onSave }) => {
  const [title, setTitle] = useState(priceList.title);
  const [description, setDescription] = useState(priceList.description);
  const [type, setType] = useState(priceList.type);
  const [status, setStatus] = useState(priceList.status);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave({ title, description, type, status });
    setIsSaving(false);
  };

  const inputStyle = "w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 text-sm font-medium transition-all text-slate-800 dark:text-white";
  const labelStyle = "text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block";

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="CHỈNH SỬA BẢNG GIÁ"
      footer={
        <div className="flex gap-3 w-full">
          <Button variant="secondary" fullWidth onClick={onClose} className="rounded-2xl font-black">HỦY BỎ</Button>
          <Button variant="primary" fullWidth onClick={handleSave} loading={isSaving} className="rounded-2xl font-black">LƯU THAY ĐỔI</Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <label className={labelStyle}>Loại</label>
          <div className="grid grid-cols-1 gap-3">
            <div
              onClick={() => setType('sale')}
              className={cn(
                "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4",
                type === 'sale' ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600"
              )}
            >
              <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", type === 'sale' ? "border-white" : "border-slate-300")}>
                {type === 'sale' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div>
                <p className="text-xs font-black uppercase">Sale</p>
                <p className={cn("text-[10px] font-medium opacity-80", type === 'sale' ? "text-white" : "text-slate-400")}>Dùng cho các chương trình khuyến mãi tạm thời.</p>
              </div>
            </div>
            <div
              onClick={() => setType('override')}
              className={cn(
                "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4",
                type === 'override' ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600"
              )}
            >
              <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", type === 'override' ? "border-white" : "border-slate-300")}>
                {type === 'override' && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div>
                <p className="text-xs font-black uppercase">Override</p>
                <p className={cn("text-[10px] font-medium opacity-80", type === 'override' ? "text-white" : "text-slate-400")}>Dùng để ghi đè giá hệ thống vĩnh viễn.</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className={labelStyle}>Tiêu đề</label>
          <input className={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label className={labelStyle}>Trạng thái</label>
          <select className={cn(inputStyle, "appearance-none")} value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="active">Hoạt động</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>

        <div>
          <label className={labelStyle}>Mô tả</label>
          <textarea className={cn(inputStyle, "h-32 py-4 resize-none")} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>
    </Drawer>
  );
};