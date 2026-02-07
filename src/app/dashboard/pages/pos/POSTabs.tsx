
import React from 'react';
import { Receipt, X, PlusCircle, Loader2 } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
}

interface POSTabsProps {
  tabs: Tab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onAddTab: () => void;
  onRemoveTab: (id: string) => void;
  isAddingTab?: boolean;
  deletingTabIds?: string[];
  loadingTabId?: string | null;
}

export const POSTabs: React.FC<POSTabsProps> = ({ tabs, activeTabId, onSelectTab, onAddTab, onRemoveTab, isAddingTab, deletingTabIds = [], loadingTabId }) => {
  return (
    <div className="flex items-center gap-1 h-full pt-2 overflow-x-auto no-scrollbar max-w-full">
      {tabs.map((tab) => {
        const isDeleting = deletingTabIds.includes(tab.id);
        const isLoadingDetails = loadingTabId === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => !isDeleting && !isLoadingDetails && onSelectTab(tab.id)}
            className={`px-6 h-full flex items-center gap-3 text-xs font-bold rounded-t-2xl transition-all relative border-b-4 shrink-0 
              ${isDeleting ? 'opacity-50 grayscale' : ''}
              ${activeTabId === tab.id ? 'bg-[#F1F5F9] dark:bg-slate-950 border-primary text-primary' : 'text-slate-400 border-transparent hover:text-slate-600 dark:hover:text-slate-200'}`}
          >
            {isLoadingDetails ? (
              <Loader2 size={14} className="animate-spin text-primary" />
            ) : (
              <Receipt size={14} />
            )}
            {`Đơn hàng ${tab.label}`}

            {isDeleting ? (
              <Loader2 size={12} className="animate-spin text-rose-500 ml-1" />
            ) : (
              <X
                size={12}
                className="hover:text-rose-500 ml-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveTab(tab.id);
                }}
              />
            )}
          </button>
        );
      })}

      {/* Optimistic Loading Tab */}
      {isAddingTab && (
        <div className="px-6 h-full flex items-center gap-3 text-xs font-bold rounded-t-2xl bg-slate-50 dark:bg-slate-900/50 text-slate-400 border-b-4 border-transparent animate-pulse shrink-0">
          <Loader2 size={14} className="animate-spin" />
          <span>Đang tạo...</span>
        </div>
      )}

      <button
        onClick={onAddTab}
        disabled={isAddingTab}
        className={`p-3 transition-all shrink-0 ${isAddingTab ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-primary'}`}
      >
        <PlusCircle size={20} />
      </button>
    </div>
  );
};
