import React from 'react';
import {
  Bell,
  AlertTriangle,
  CreditCard,
  RotateCcw,
  ShoppingCart,
  Boxes,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveSection,
    setSelectedOrderDetailId,
  } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'low_stock':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'payment_failed':
        return <CreditCard className="w-4 h-4 text-rose-400" />;
      case 'refund_requested':
        return <RotateCcw className="w-4 h-4 text-purple-400" />;
      case 'new_order':
        return <ShoppingCart className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Operations Notifications Center</span>
            <span className="text-xs font-mono-numbers px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">
              {notifications.filter((n) => !n.isRead).length} Unread
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational exceptions · Delayed orders, stock dips &amp; payment anomalies
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer self-start sm:self-auto"
        >
          Mark all as read
        </button>
      </div>

      {/* Notifications List matching Spec 20 */}
      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => {
              markNotificationRead(notif.id);
              if (notif.targetId && notif.targetId.startsWith('#')) {
                setSelectedOrderDetailId(notif.targetId);
              } else if (notif.targetView) {
                setActiveSection(notif.targetView as any);
              }
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 group ${
              !notif.isRead
                ? 'bg-slate-900 border-emerald-500/30 hover:border-emerald-500/60 shadow-lg shadow-emerald-500/5'
                : 'bg-slate-900/50 hover:bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                {getIcon(notif.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {notif.title}
                  </h3>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  )}
                  {notif.isUrgent && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                      URGENT
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1">{notif.message}</p>
                <span className="text-[11px] text-slate-400 font-mono-numbers mt-1.5 block">
                  Reported at {notif.createdAt}
                </span>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1 text-xs text-slate-400 group-hover:text-emerald-400 font-semibold self-center">
              <span>Resolve</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
