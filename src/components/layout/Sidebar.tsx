import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Layers,
  Boxes,
  Store,
  Bike,
  Users,
  Ticket,
  Flame,
  CreditCard,
  RotateCcw,
  Star,
  Headphones,
  TrendingUp,
  ShieldCheck,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp, ActiveSection } from '../../context/AppContext';
import { ZynexLogo } from '../common/ZynexLogo';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const {
    activeSection,
    setActiveSection,
    orders,
    products,
    riders,
    refunds,
    supportTickets,
    unreadNotifCount,
    currentStaff,
    settings,
  } = useApp();

  const isDark = settings.themeMode === 'dark' || settings.themeMode === 'black-white';

  // Compute live counter badges for critical ops
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'New' || o.status === 'Confirmed' || o.status === 'Preparing'
  ).length;
  const lowStockCount = products.filter((p) => p.stock <= p.lowStockThreshold).length;
  const onlineRidersCount = riders.filter((r) => r.status === 'Available' || r.status === 'On Delivery').length;
  const pendingRefundsCount = refunds.filter((r) => r.status === 'Pending').length;
  const openTicketsCount = supportTickets.filter((t) => t.status === 'New' || t.status === 'In Progress').length;

  const navItems: {
    id: ActiveSection;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingCart,
      badge: pendingOrdersCount,
      badgeColor: isMonochrome ? 'bg-zinc-800 text-white border border-zinc-700' : 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
    },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Layers },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Boxes,
      badge: lowStockCount,
      badgeColor: isMonochrome ? 'bg-zinc-800 text-white border border-zinc-700' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
    { id: 'stores', label: 'Stores', icon: Store },
    {
      id: 'riders',
      label: 'Riders',
      icon: Bike,
      badge: onlineRidersCount,
      badgeColor: isMonochrome ? 'bg-zinc-800 text-white border border-zinc-700' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'coupons', label: 'Coupons', icon: Ticket },
    { id: 'offers', label: 'Offers', icon: Flame },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    {
      id: 'refunds',
      label: 'Refunds',
      icon: RotateCcw,
      badge: pendingRefundsCount > 0 ? pendingRefundsCount : undefined,
      badgeColor: isMonochrome ? 'bg-zinc-800 text-white border border-zinc-700' : 'bg-rose-500/20 text-rose-300',
    },
    { id: 'reviews', label: 'Reviews', icon: Star },
    {
      id: 'support',
      label: 'Support',
      icon: Headphones,
      badge: openTicketsCount > 0 ? openTicketsCount : undefined,
      badgeColor: isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-800 border border-indigo-300',
    },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'staff', label: 'Staff & Roles', icon: ShieldCheck },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifCount > 0 ? unreadNotifCount : undefined,
      badgeColor: 'bg-orange-500 text-white font-extrabold',
    },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col transition-all duration-200 select-none z-20 shrink-0 border-r ${
        isDark
          ? 'bg-[#090D16] border-[#172033] text-slate-100'
          : 'bg-white border-slate-200 text-slate-800 shadow-sm'
      } ${isCollapsed ? 'w-16' : 'w-64'}`}
    >
      {/* Brand Header */}
      <div className={`h-16 flex items-center justify-between px-3 border-b ${
        isDark ? 'bg-[#070A12] border-[#172033]' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <ZynexLogo collapsed={isCollapsed} size={isCollapsed ? 'sm' : 'md'} lightText={isDark} />
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
            isDark
              ? 'text-slate-400 hover:text-white hover:bg-[#131C2E]'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all group relative cursor-pointer ${
                isActive
                  ? isDark
                    ? 'bg-gradient-to-r from-blue-900/30 via-orange-950/20 to-orange-500/10 text-orange-400 border border-orange-500/40 shadow-sm'
                    : 'bg-orange-50 text-orange-600 font-bold border border-orange-200 shadow-xs'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-[#131C2E]/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive
                    ? 'text-orange-500'
                    : isDark
                    ? 'text-slate-400 group-hover:text-blue-400'
                    : 'text-slate-500 group-hover:text-slate-900'
                }`}
              />

              {!isCollapsed && (
                <span className="truncate flex-1 text-left tracking-normal font-medium text-[13px]">
                  {item.label}
                </span>
              )}

              {item.badge !== undefined && (
                <span
                  className={`text-[11px] font-mono-numbers px-1.5 py-0.5 rounded font-bold shrink-0 ${
                    item.badgeColor || (isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700 border border-slate-200')
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Active Indicator Bar */}
              {isActive && (
                <div className={`absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r ${
                  isDark
                    ? 'bg-orange-500 shadow-[0_0_8px_rgba(255,122,0,0.8)]'
                    : 'bg-orange-500'
                }`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Admin Profile Footer */}
      <div className={`p-3 border-t ${
        isDark ? 'bg-[#070A12] border-[#172033]' : 'bg-slate-50 border-slate-200'
      }`}>
        <div
          onClick={() => setActiveSection('staff')}
          className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer group ${
            isDark ? 'hover:bg-[#131C2E]' : 'hover:bg-slate-200/60'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
            isDark
              ? 'bg-blue-600/25 border border-blue-500/40 text-blue-300 group-hover:border-orange-500/50 group-hover:text-orange-300'
              : 'bg-[#003B82] text-white shadow-2xs'
          }`}>
            {currentStaff.name.slice(0, 2).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate flex-1">
              <span className={`text-xs font-bold truncate transition-colors ${
                isDark ? 'text-white group-hover:text-orange-400' : 'text-slate-900 group-hover:text-orange-600'
              }`}>
                {currentStaff.name}
              </span>
              <span className={`text-[11px] truncate ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                {currentStaff.role}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
