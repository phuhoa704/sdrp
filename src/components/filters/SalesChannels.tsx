import { useSalesChannels } from '@/hooks';
import { cn } from '@/lib/utils';
import { Layers, Loader2, Store } from 'lucide-react';
import React from 'react'

interface Props {
  selectedChannelId: string;
  handleChannelSelect: (channelId: string) => void;
}

export const SalesChannelsFilter = ({ selectedChannelId, handleChannelSelect }: Props) => {
  const { salesChannels, loading: channelsLoading } = useSalesChannels({ isDisabled: false });
  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl items-center overflow-x-auto no-scrollbar">
      <span className="text-[10px] font-black text-slate-400 uppercase px-3 hidden md:block">Lọc kênh:</span>
      {channelsLoading ? (
        <div className="flex items-center gap-2 px-6 py-2 text-xs text-slate-400">
          <Loader2 size={16} className="animate-spin" />
        </div>
      ) : (
        <>
          <button
            key={"all"}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 transition-all whitespace-nowrap",
              selectedChannelId === "all"
                ? "bg-white dark:bg-slate-700 text-emerald-600 shadow-sm"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
            onClick={() => handleChannelSelect("all")}
          >
            <Layers size={14} />
            <span className="hidden sm:inline">Tất cả kênh</span>
          </button>
          {salesChannels.map((channel) => (
            <button
              key={channel.id}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 transition-all whitespace-nowrap",
                selectedChannelId === channel.id
                  ? "bg-white dark:bg-slate-700 text-emerald-600 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
              onClick={() => handleChannelSelect(channel.id)}
            >
              <Store size={14} />
              <span className="hidden sm:inline">{channel.name}</span>
            </button>
          ))}
        </>
      )}
    </div>
  )
}
