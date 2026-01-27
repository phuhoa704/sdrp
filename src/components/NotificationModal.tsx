'use client';

import { Bell } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectNotifications } from '@/store/selectors';
import { removeNotification } from '@/store/slices/uiSlice';
import { Modal } from './Modal';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-500';
      case 'success':
        return 'bg-emerald-500';
      case 'warning':
        return 'bg-amber-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thông báo"
      icon={Bell}
      iconColor="text-emerald-500"
      iconBgColor="bg-emerald-500/20"
      footer={
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors uppercase tracking-wider text-sm"
        >
          Đóng
        </button>
      }
    >
      <div className="p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell size={48} className="text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Không có thông báo mới</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-slate-800/50 rounded-2xl p-4 hover:bg-slate-800 transition-colors group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-white text-sm flex-1">
                  {notification.message.split('.')[0]}
                </h3>
                <span className="text-xs text-slate-500 ml-2 whitespace-nowrap">
                  {getTimeAgo(notification.timestamp)}
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-3">
                {notification.message}
              </p>
              <div className="flex items-center justify-between">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(notification.type)}`} />
                <button
                  onClick={() => dispatch(removeNotification(notification.id))}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
