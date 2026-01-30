import React, { useState, useEffect } from 'react';
import { ProductCollection } from '@/types/product';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { cn } from '@/lib/utils';
import { Info, X, Save } from 'lucide-react';
import { collectionService } from '@/lib/api/medusa/collectionService';

interface CollectionFormProps {
    initialData?: ProductCollection | null;
    onCancel: () => void;
    onSave: () => void;
}

export const CollectionForm: React.FC<CollectionFormProps> = ({ initialData, onCancel, onSave }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        handle: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                handle: initialData.handle || '',
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData) {
                await collectionService.updateCollection(initialData.id, formData);
            } else {
                await collectionService.createCollection(formData);
            }
            onSave();
        } catch (error) {
            console.error('Failed to save collection:', error);
            alert('Không thể lưu bộ sưu tập. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full h-12 px-4 rounded-xl bg-slate-900 border border-slate-800 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold text-white placeholder:text-slate-600 shadow-sm";
    const labelClass = "text-[11px] font-black text-slate-500 mb-2 block uppercase tracking-widest";

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                        {initialData ? 'Chỉnh sửa bộ sưu tập' : 'Tạo bộ sưu tập mới'}
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        {initialData ? 'Cập nhật thông tin bộ sưu tập.' : 'Tạo bộ sưu tập mới để nhóm các sản phẩm lại với nhau.'}
                    </p>
                </div>
                <button
                    onClick={onCancel}
                    className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 hover:text-white transition-all shadow-sm"
                >
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card className="bg-slate-900/50 border-slate-800 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className={labelClass}>Tiêu đề bộ sưu tập</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className={inputClass}
                                placeholder="Bộ sưu tập tết"
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5 mb-2">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">Handle</label>
                                <Info size={12} className="text-slate-600" />
                                <span className="text-[10px] text-slate-600 normal-case font-bold">(Optional)</span>
                            </div>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-sm">/</div>
                                <input
                                    type="text"
                                    value={formData.handle}
                                    onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                                    className={cn(inputClass, "pl-8")}
                                    placeholder="bo-suu-tap-tet"
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="flex items-center justify-end gap-4 pb-20">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        className="h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all border border-slate-800"
                        disabled={loading}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        className="h-12 px-10 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                        loading={loading}
                        icon={<Save size={18} />}
                    >
                        Lưu
                    </Button>
                </div>
            </form>
        </div>
    );
};
