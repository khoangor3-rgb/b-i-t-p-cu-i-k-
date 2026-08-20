import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, CheckCheck, Calendar, ShieldCheck, 
  DollarSign, AlertCircle, Info, Sparkles 
} from 'lucide-react';
import { NotificationType } from '../../types';

export const NotificationDropdown: React.FC = () => {
  const { currentUser, getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (!currentUser) return null;

  const notifications = getUserNotifications(currentUser.id);
  const unreadCount = notifications.filter(n => !n.is_read).length;
  const filteredNotifications = activeFilter === 'unread' 
    ? notifications.filter(n => !n.is_read) 
    : notifications;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'payment':
        return <DollarSign className="w-4 h-4 text-teal-600" />;
      case 'payout':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'dispute':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-sky-600" />;
      case 'system':
      default:
        return <Info className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getBgForType = (type: NotificationType) => {
    switch (type) {
      case 'booking':
        return 'bg-emerald-50';
      case 'payment':
        return 'bg-teal-50';
      case 'payout':
        return 'bg-amber-50';
      case 'dispute':
        return 'bg-rose-50';
      case 'verification':
        return 'bg-sky-50';
      case 'system':
      default:
        return 'bg-indigo-50';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell trigger button */}
      <button
        id="btn_notifications_trigger"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors flex items-center justify-center focus:outline-none"
        title="Thông báo"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span 
            id="badge_unread_notif_count"
            className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          id="notifications_dropdown_menu"
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800 text-sm">Thông Báo</span>
              {unreadCount > 0 && (
                <span className="text-[11px] font-semibold px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full">
                  {unreadCount} mới
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                id="btn_mark_all_read"
                onClick={() => markAllNotificationsAsRead(currentUser.id)}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center space-x-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Đã đọc tất cả</span>
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <div className="flex border-b border-slate-100 bg-white px-3 pt-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeFilter === 'all'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              onClick={() => setActiveFilter('unread')}
              className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeFilter === 'unread'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Chưa đọc ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                <p className="text-xs font-medium">Không có thông báo nào</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  id={`notif_item_${notif.id}`}
                  onClick={() => {
                    if (!notif.is_read) {
                      markNotificationAsRead(notif.id);
                    }
                  }}
                  className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-start space-x-3 ${
                    !notif.is_read ? 'bg-emerald-50/30' : ''
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${getBgForType(notif.type)}`}>
                    {getIconForType(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4 className={`text-xs leading-tight truncate ${!notif.is_read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                        {notif.title}
                      </h4>
                      {!notif.is_read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {notif.created_at}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
