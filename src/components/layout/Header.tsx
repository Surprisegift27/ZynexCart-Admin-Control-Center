import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Store,
  ChevronDown,
  Bell,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Plus,
  Zap,
  Palette,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const {
    openGlobalSearch,
    setIsQuickActionOpen,
    selectedStoreFilter,
    setSelectedStoreFilter,
    stores,
    unreadNotifCount,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveSection,
    settings,
    updateSettings,
    currentStaff,
    staff,
    setCurrentStaffId,
    createQuickOrder,
    triggerAudioAlert,
  } = useApp();

  const isDark = settings.themeMode === 'dark' || settings.themeMode === 'black-white';

  const [isStoreMenuOpen, setIsStoreMenuOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const storeRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (storeRef.current && !storeRef.current.contains(e.target as Node)) {
        setIsStoreMenuOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setIsRoleMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeStoreName =
    selectedStoreFilter === 'all'
      ? 'All Dark Stores (National Hub)'
      : stores.find((s) => s.id === selectedStoreFilter)?.name || 'Store';

  return (
    <header className={`h-16 px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 select-none backdrop-blur-md border-b transition-colors ${
      isDark
        ? 'bg-[#090D16]/95 border-[#172033] text-slate-100'
        : 'bg-white/95 border-slate-200 text-slate-800 shadow-xs'
    }`}>
      {/* Zone 1: Store Selector & Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative" ref={storeRef}>
          <button
            onClick={() => setIsStoreMenuOpen(!isStoreMenuOpen)}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#0E1524] hover:bg-[#152037] border-[#1E2E4A] text-slate-200'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <Store className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-blue-400' : 'text-[#003B82]'}`} />
            <span className="truncate max-w-[150px] sm:max-w-[210px] font-semibold">
              {activeStoreName}
            </span>
            <span className="w-2 h-2 rounded-full shrink-0 bg-emerald-500 animate-pulse" />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {isStoreMenuOpen && (
            <div className={`absolute left-0 mt-1.5 w-64 rounded-xl shadow-2xl p-1.5 z-50 border ${
              isDark ? 'bg-[#0B0F19] border-[#1E293B] text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Fulfillment Dark Stores
              </div>
              <button
                onClick={() => {
                  setSelectedStoreFilter('all');
                  setIsStoreMenuOpen(false);
                }}
                className={`w-full text-left px-2.5 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                  selectedStoreFilter === 'all'
                    ? isDark
                      ? 'bg-blue-600/20 text-orange-400 font-semibold border border-orange-500/30'
                      : 'bg-orange-50 text-orange-600 font-bold border border-orange-200'
                    : isDark
                    ? 'text-slate-300 hover:bg-[#131C2E]'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>All Dark Stores (Aggregated)</span>
                <span className={`text-[10px] ${selectedStoreFilter === 'all' ? (isDark ? 'text-orange-400' : 'text-orange-600 font-bold') : 'text-slate-400'}`}>
                  4 Stores
                </span>
              </button>
              {stores.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedStoreFilter(s.id);
                    setIsStoreMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                    selectedStoreFilter === s.id
                      ? isDark
                        ? 'bg-blue-600/20 text-orange-400 font-semibold border border-orange-500/30'
                        : 'bg-orange-50 text-orange-600 font-bold border border-orange-200'
                      : isDark
                      ? 'text-slate-300 hover:bg-[#131C2E]'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{s.name}</span>
                  <span className={`text-[10px] font-mono-numbers shrink-0 ${
                    selectedStoreFilter === s.id ? (isDark ? 'text-orange-400' : 'text-orange-600 font-bold') : (isDark ? 'text-slate-400' : 'text-slate-500')
                  }`}>
                    {s.activeOrdersCount} orders
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 10-Minute SLA indicator */}
        <div className={`hidden lg:flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-md border ${
          isDark
            ? 'bg-black/60 text-slate-400 border-[#172033]'
            : 'bg-slate-50 text-slate-600 border-slate-200'
        }`}>
          <Zap className={`w-3 h-3 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
          <span>SLA Target:</span>
          <span className={`font-semibold font-mono-numbers ${isDark ? 'text-orange-400' : 'text-slate-900 font-bold'}`}>
            {settings.targetDeliveryMinutes} Mins
          </span>
        </div>
      </div>

      {/* Zone 2: Global Search Trigger & Simulator Controls */}
      <div className="flex items-center gap-3 flex-1 justify-center max-w-xl">
        <button
          onClick={openGlobalSearch}
          className={`w-full max-w-md flex items-center justify-between px-3.5 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer shadow-2xs ${
            isDark
              ? 'bg-black/80 hover:bg-black border-[#172033] hover:border-blue-900/60 text-slate-400'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300 text-slate-600'
          }`}
          title="Global Quick Search (Click to open, click outside to return)"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
            <span className="truncate">Search order #, customer, product, SKU...</span>
          </div>
          <kbd className={`hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono-numbers rounded border ${
            isDark
              ? 'bg-[#131C2E] border-[#1E2E4A] text-slate-300'
              : 'bg-white border-slate-200 text-slate-600'
          }`}>
            ⌘K
          </kbd>
        </button>

        {/* Live Simulation Engine Toggle */}
        <div className={`hidden md:flex items-center gap-1 p-1 rounded-lg border ${
          isDark
            ? 'bg-black/80 border-[#172033]'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <button
            onClick={() => {
              updateSettings({ liveSimulationActive: !settings.liveSimulationActive });
              triggerAudioAlert('chime');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              settings.liveSimulationActive
                ? isDark
                  ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                  : 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                : (isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
            }`}
            title="Auto-progress incoming quick orders"
          >
            {settings.liveSimulationActive ? (
              <>
                <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-orange-400 animate-ping' : 'bg-emerald-600 animate-ping'}`} />
                <span>Sim: Live</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-zinc-500" />
                <span>Sim: Paused</span>
              </>
            )}
          </button>

          <button
            onClick={createQuickOrder}
            className={`p-1 rounded transition-colors cursor-pointer ${
              isDark
                ? 'hover:bg-[#131C2E] text-amber-400'
                : 'hover:bg-slate-200 text-amber-600'
            }`}
            title="Simulate instant new incoming customer order"
          >
            <Play className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Zone 3: Theme Toggle, Sound toggle, Quick Action & Notifications & Staff Switcher */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Theme Switcher (White Page vs Dark Mode) */}
        <button
          onClick={() => {
            const nextMode = isDark ? 'white' : 'dark';
            updateSettings({ themeMode: nextMode });
            triggerAudioAlert('chime');
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
            isDark
              ? 'bg-[#131C2E] text-slate-200 border-[#1E2E4A] hover:bg-[#1E2E4A]'
              : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
          }`}
          title={isDark ? 'Switch to Clean White Page' : 'Switch to Dark Mode'}
        >
          <Palette className={`w-3.5 h-3.5 ${isDark ? 'text-orange-400' : 'text-[#FF7A00]'}`} />
          <span className="hidden xl:inline">{isDark ? 'Dark Mode' : 'White Page'}</span>
        </button>

        {/* Sound toggle */}
        <button
          onClick={() => {
            updateSettings({ soundAlertsEnabled: !settings.soundAlertsEnabled });
            if (!settings.soundAlertsEnabled) triggerAudioAlert('chime');
          }}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            isDark
              ? 'text-slate-400 hover:text-white hover:bg-[#131C2E]'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title={settings.soundAlertsEnabled ? 'Audio Alerts Enabled' : 'Audio Alerts Muted'}
          aria-label={settings.soundAlertsEnabled ? 'Audio Alerts Enabled' : 'Audio Alerts Muted'}
        >
          {settings.soundAlertsEnabled ? (
            <Volume2 className={`w-4 h-4 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
          ) : (
            <VolumeX className="w-4 h-4 text-zinc-500" />
          )}
        </button>

        {/* Quick Action Button */}
        <button
          onClick={() => setIsQuickActionOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer active:scale-95 shadow-md bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black shadow-orange-500/20"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Quick Action</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-300 hover:text-white hover:bg-[#131C2E]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Notifications & Ops Alerts"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center font-mono-numbers bg-orange-500 text-white">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-xl shadow-2xl overflow-hidden z-50 border ${
              isDark ? 'bg-slate-900 border-slate-700/80 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className={`p-3 border-b flex items-center justify-between ${
                isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-100 bg-slate-50'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Live Operations Alerts</span>
                  {unreadNotifCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono-numbers font-semibold bg-rose-500/20 text-rose-600">
                      {unreadNotifCount} new
                    </span>
                  )}
                </div>
                {unreadNotifCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className={`text-[11px] underline cursor-pointer ${isDark ? 'text-zinc-300 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className={`max-h-80 overflow-y-auto divide-y ${
                isDark ? 'divide-slate-800/60' : 'divide-slate-100'
              }`}>
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-400">
                    No active operations alerts. All systems running smooth!
                  </div>
                ) : (
                  notifications.slice(0, 6).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.targetView) {
                          setActiveSection(notif.targetView as any);
                          setIsNotifOpen(false);
                        }
                      }}
                      className={`p-3 transition-colors cursor-pointer ${
                        isDark
                          ? notif.isRead ? 'hover:bg-slate-800/70' : 'bg-slate-800/30 hover:bg-slate-800'
                          : notif.isRead ? 'hover:bg-slate-50' : 'bg-orange-50/40 hover:bg-orange-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-zinc-400 shrink-0 font-mono-numbers">
                          {notif.createdAt}
                        </span>
                      </div>
                      <p className={`text-[11px] mt-1 line-clamp-2 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className={`p-2 border-t text-center ${
                isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50'
              }`}>
                <button
                  onClick={() => {
                    setActiveSection('notifications');
                    setIsNotifOpen(false);
                  }}
                  className={`text-xs hover:underline font-semibold cursor-pointer ${isDark ? 'text-white' : 'text-orange-600'}`}
                >
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Staff Role Switcher */}
        <div className="relative" ref={roleRef}>
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className={`flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg border text-xs transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-200'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <div className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] bg-[#003B82] text-white">
              {currentStaff.name.charAt(0)}
            </div>
            <span className="hidden md:inline font-medium text-xs">
              {currentStaff.role}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isRoleMenuOpen && (
            <div className={`absolute right-0 mt-1.5 w-56 rounded-xl shadow-2xl p-1.5 z-50 border ${
              isDark ? 'bg-slate-900 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-800'
            }`}>
              <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Switch Admin View Role
              </div>
              {staff.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentStaffId(s.id);
                    setIsRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between transition-colors ${
                    currentStaff.id === s.id
                      ? isDark
                        ? 'bg-orange-500/20 text-orange-300 font-semibold'
                        : 'bg-orange-50 text-orange-600 font-bold border border-orange-200'
                      : isDark
                      ? 'text-slate-300 hover:bg-slate-800'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <div className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.name}</div>
                    <div className={`text-[10px] ${currentStaff.id === s.id ? (isDark ? 'text-orange-300' : 'text-orange-600') : 'text-slate-400'}`}>
                      {s.role}
                    </div>
                  </div>
                  {currentStaff.id === s.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
