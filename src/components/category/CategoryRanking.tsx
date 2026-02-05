import { ArrowLeft, Zap, GripVertical, Folder, Tags } from 'lucide-react';
import React, { useState, useMemo } from 'react'
import { Button } from '../Button';
import { ProductCategory } from '@/types/product';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  categories: ProductCategory[];
  onCancel: () => void;
  onSave: () => void;
}

interface SortableItemProps {
  category: ProductCategory;
  index: number;
  isChild: boolean;
}

const SortableItem = ({ category, index, isChild }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 p-5 flex items-center gap-4 transition-all hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800",
        isDragging && "opacity-50 shadow-2xl scale-105 z-50",
        isChild && "ml-16"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
      >
        <GripVertical size={20} className="text-slate-400" />
      </div>

      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <span className="text-sm font-black text-slate-600 dark:text-slate-400">{index + 1}</span>
      </div>

      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
        isChild ? "bg-blue-50 dark:bg-blue-900/20 text-blue-500" : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
      )}>
        {isChild ? <Tags size={20} /> : <Folder size={20} className="fill-current opacity-20" />}
        {!isChild && <Folder size={20} className="absolute" />}
      </div>

      <div className="flex-1">
        <h3 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-wide">{category.name}</h3>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          {isChild ? 'Danh mục con' : 'Danh mục chính'} • ID: {category.id.slice(category.id.length - 8, category.id.length)}
        </p>
      </div>

      <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Display Order: {index + 1}
        </p>
      </div>
    </div>
  );
};

export const CategoryRanking = ({ categories, onCancel, onSave }: Props) => {
  // Organize categories once on mount
  const initialOrganized = useMemo(() => {
    const getRank = (c: ProductCategory) => (c as any).rank ?? (c as any).metadata?.rank ?? 0;

    const catMap = new Map(categories.map(c => [c.id, c]));
    const roots = categories.filter(c => !c.parent_category_id || !catMap.has(c.parent_category_id));

    const childMap = new Map<string, ProductCategory[]>();
    categories.forEach(c => {
      if (c.parent_category_id && catMap.has(c.parent_category_id)) {
        const existing = childMap.get(c.parent_category_id) || [];
        existing.push(c);
        childMap.set(c.parent_category_id, existing);
      }
    });

    const sortFn = (a: ProductCategory, b: ProductCategory) => getRank(a) - getRank(b);
    roots.sort(sortFn);

    const result: ProductCategory[] = [];

    const traverse = (cat: ProductCategory) => {
      result.push(cat);
      const children = childMap.get(cat.id);
      if (children) {
        children.sort(sortFn);
        children.forEach(traverse);
      }
    };

    roots.forEach(traverse);

    return result;
  }, [categories]);

  const [organizedCategories, setOrganizedCategories] = useState<ProductCategory[]>(initialOrganized);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [isUpdating, setIsUpdating] = useState(false);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = organizedCategories.findIndex((item) => item.id === active.id);
      const newIndex = organizedCategories.findIndex((item) => item.id === over.id);

      const reordered = arrayMove(organizedCategories, oldIndex, newIndex);
      setOrganizedCategories(reordered);

      setIsUpdating(true);
      try {
        const categoryService = await import('@/lib/api/medusa/categoryService').then(m => m.categoryService);

        const updatePromises = reordered.map((cat, index) => {
          return categoryService.updateCategory(cat.id, {
            rank: index,
            parent_category_id: cat.parent_category_id || undefined,
          });
        });

        await Promise.all(updatePromises);

        onSave();
      } catch (error) {
        console.error('Failed to update category ranks:', error);
        setOrganizedCategories(organizedCategories);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className="animate-fade-in space-y-10 pb-32">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={onCancel} className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:bg-slate-50 transition-all border border-slate-200 dark:border-slate-800">
            <ArrowLeft size={24} className="text-slate-500" />
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none">Chỉnh sửa thứ tự (Ranking)</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Kéo thả để sắp xếp lại thứ tự hiển thị</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={onCancel}>Hủy bỏ</Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-3">
        {isUpdating && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border-2 border-blue-100 dark:border-blue-900/30 rounded-2xl flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-blue-700 dark:text-blue-300">Đang cập nhật thứ tự...</p>
          </div>
        )}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={organizedCategories.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {organizedCategories.map((category, index) => (
              <SortableItem
                key={category.id}
                category={category}
                index={index}
                isChild={!!category.parent_category_id}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      <div className="max-w-4xl mx-auto p-8 bg-emerald-50 dark:bg-emerald-900/10 border-2 border-emerald-100 dark:border-emerald-900/30 rounded-[32px] flex items-center gap-6">
        <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
          <Zap size={28} className="text-white fill-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-black uppercase mb-1 text-emerald-900 dark:text-emerald-100">Mẹo sắp xếp</p>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium leading-relaxed">
            Loại hàng ở Rank 1 sẽ xuất hiện đầu tiên trên Tab Navigation của Mobile App. Bạn nên đặt các loại hàng bán chạy hoặc chiến dịch mùa vụ lên đầu.
          </p>
        </div>
      </div>
    </div>
  )
}
