import React from 'react';
import {
  TrendingUp,
  ShoppingCart,
  CheckCircle2,
  Clock,
  Bike,
  AlertTriangle,
  RotateCcw,
  Zap,
  ArrowUpRight,
  Package,
  Store,
  ChevronRight,
  Sparkles,
  Layers,
  Ticket,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';

export const DashboardView: React.FC = () => {
  const {
    orders,
    products,
    riders,
    stores,
    refunds,
    setActiveSection,
    setOrderFilterStatus,
    setSelectedOrderDetailId,
    updateOrderStatus,
    setRiderAssignTargetOrderId,
    currentStaff,
    createQuickOrder,
    setIsQuickActionOpen,
    openGlobalSearch,
    settings,
  } = useApp();

  const isDark = settings.themeMode === 'dark' || settings.themeMode === 'black-white';

  // Metrics computation
  const totalRevenue = orders.reduce((sum, o) => {
    return o.paymentStatus === 'Successful' ? sum + o.totalAmount : sum;
  }, 124560);

  const totalOrdersCount = orders.length + 338;
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length + 308;
  const pendingOrders = orders.filter(
    (o) => o.status === 'New' || o.status === 'Confirmed' || o.status === 'Preparing'
  );
  const preparingOrders = orders.filter((o) => o.status === 'Preparing');
  const outForDeliveryOrders = orders.filter((o) => o.status === 'Out for Delivery');
  const cancelledOrders = orders.filter((o) => o.status === 'Cancelled');
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold);
  const outOfStockProducts = products.filter((p) => p.stock === 0);
  const onlineRiders = riders.filter((r) => r.status === 'Available' || r.status === 'On Delivery');
  const pendingRefunds = refunds.filter((r) => r.status === 'Pending');

  // Clickable card handler that directly filters orders view!
  const handleMetricClick = (statusFilter?: OrderStatus | 'All', section: any = 'orders') => {
    if (statusFilter) {
      setOrderFilterStatus(statusFilter);
    }
    setActiveSection(section);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Quick Action Bar */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border transition-all ${
        isDark
          ? 'bg-gradient-to-r from-[#090D16] via-[#0D1527] to-[#090D16] border-[#1E2E4A] text-white shadow-2xl'
          : 'bg-white border-slate-200 text-slate-800 shadow-xs'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Good Morning, {currentStaff.name.split(' ')[0]} 👋
            </h1>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
              isDark
                ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                : 'bg-orange-50 text-orange-600 border-orange-200'
            }`}>
              <Zap className="w-3 h-3 fill-orange-500" />
              10-Min Live Ops
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            ZynexCart Real-Time Fulfillment Engine · 4 Dark Stores Active · National Network Optimal
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={createQuickOrder}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
              isDark
                ? 'bg-[#0E1524] hover:bg-[#152037] text-slate-200 border-[#1E2E4A]'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="Inject a realistic simulated incoming order"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
            <span>Simulate Order</span>
          </button>

          <button
            onClick={() => setIsQuickActionOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black shadow-orange-500/20 cursor-pointer active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-black" />
            <span>+ Quick Actions</span>
          </button>
        </div>
      </div>

      {/* Prominent Quick Search bar on Dashboard */}
      <div
        onClick={openGlobalSearch}
        className={`w-full flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
          isDark
            ? 'bg-[#090D16] hover:bg-[#0D1527] border-[#172033] hover:border-[#1E2E4A] text-slate-300'
            : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600 shadow-xs'
        }`}
        title="Click to search anything across ZynexCart. Click outside to return to Dashboard."
      >
        <div className="flex items-center gap-3">
          <Search className={`w-4 h-4 shrink-0 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
          <span className="text-xs">
            Search live orders (#10245), customer mobile, product name, SKU, or dark store...
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] hidden sm:inline ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Click outside returns to Dashboard</span>
          <kbd className={`px-2 py-0.5 rounded text-[11px] font-mono-numbers border ${
            isDark ? 'bg-[#131C2E] border-[#1E2E4A] text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Primary KPI Cards Grid (Clickable into filtered views!) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Revenue */}
        <div
          onClick={() => setActiveSection('payments')}
          className={`p-4 rounded-xl border transition-all cursor-pointer group ${
            isDark
              ? 'bg-[#090D16] hover:bg-[#0E1524] border-[#172033] hover:border-orange-500/40'
              : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-orange-300 shadow-xs'
          }`}
        >
          <div className={`flex items-center justify-between text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            <span>Today&apos;s Revenue</span>
            <TrendingUp className={`w-4 h-4 group-hover:scale-110 transition-transform ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
          <div className={`mt-2 text-lg sm:text-xl font-extrabold font-mono-numbers ${isDark ? 'text-white' : 'text-slate-900'}`}>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className={`text-[11px] flex items-center gap-0.5 mt-1 font-semibold ${isDark ? 'text-orange-400' : 'text-emerald-600'}`}>
            <ArrowUpRight className="w-3 h-3" />
            <span>+14.8% vs yday</span>
          </div>
        </div>

        {/* Total Orders */}
        <div
          onClick={() => handleMetricClick('All')}
          className={`p-4 rounded-xl border transition-all cursor-pointer group ${
            isDark
              ? 'bg-[#090D16] hover:bg-[#0E1524] border-[#172033] hover:border-blue-500/40'
              : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-blue-300 shadow-xs'
          }`}
        >
          <div className={`flex items-center justify-between text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            <span>Today&apos;s Orders</span>
            <ShoppingCart className={`w-4 h-4 group-hover:scale-110 transition-transform ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div className={`mt-2 text-lg sm:text-xl font-extrabold font-mono-numbers ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {totalOrdersCount}
          </div>
          <div className={`text-[11px] mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            Across 4 Dark Stores
          </div>
        </div>

        {/* Delivered */}
        <div
          onClick={() => handleMetricClick('Delivered')}
          className={`p-4 rounded-xl border transition-all cursor-pointer group ${
            isDark
              ? 'bg-[#090D16] hover:bg-[#0E1524] border-[#172033] hover:border-emerald-500/40'
              : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-emerald-300 shadow-xs'
          }`}
        >
          <div className={`flex items-center justify-between text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            <span>Delivered</span>
            <CheckCircle2 className={`w-4 h-4 group-hover:scale-110 transition-transform ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
          <div className={`mt-2 text-lg sm:text-xl font-extrabold font-mono-numbers ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {deliveredCount}
          </div>
          <div className={`text-[11px] mt-1 font-mono-numbers ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            Avg SLA: 9.8 mins
          </div>
        </div>

        {/* Pending Orders */}
        <div
          onClick={() => handleMetricClick('New')}
          className={`p-4 rounded-xl border transition-all cursor-pointer group relative overflow-hidden ${
            isDark
              ? 'bg-[#090D16] hover:bg-[#0E1524] border-[#172033] hover:border-orange-500/40'
              : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-orange-300 shadow-xs'
          }`}
        >
          {pendingOrders.length > 0 && (
            <div className={`absolute top-0 right-0 w-2 h-2 rounded-full m-2 ${isDark ? 'bg-orange-400 animate-ping' : 'bg-orange-500 animate-ping'}`} />
          )}
          <div className={`flex items-center justify-between text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            <span>Pending Orders</span>
            <Clock className={`w-4 h-4 group-hover:scale-110 transition-transform ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
          </div>
          <div className={`mt-2 text-lg sm:text-xl font-extrabold font-mono-numbers ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
            {pendingOrders.length}
          </div>
          <div className={`text-[11px] mt-1 ${isDark ? 'text-orange-300/80' : 'text-orange-600'}`}>
            Click to process
          </div>
        </div>

        {/* Low Stock Alert */}
        <div
          onClick={() => setActiveSection('inventory')}
          className={`p-4 rounded-xl border transition-all cursor-pointer group ${
            isDark
              ? 'bg-[#090D16] hover:bg-[#0E1524] border-[#172033] hover:border-rose-500/40'
              : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-rose-300 shadow-xs'
          }`}
        >
          <div className={`flex items-center justify-between text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            <span>Low Stock</span>
            <AlertTriangle className={`w-4 h-4 group-hover:scale-110 transition-transform ${isDark ? 'text-rose-400' : 'text-rose-500'}`} />
          </div>
          <div className={`mt-2 text-lg sm:text-xl font-extrabold font-mono-numbers ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
            {lowStockProducts.length}
          </div>
          <div className={`text-[11px] mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            {outOfStockProducts.length} Out of Stock
          </div>
        </div>

        {/* Online Riders */}
        <div
          onClick={() => setActiveSection('riders')}
          className={`p-4 rounded-xl border transition-all cursor-pointer group ${
            isDark
              ? 'bg-[#090D16] hover:bg-[#0E1524] border-[#172033] hover:border-blue-500/40'
              : 'bg-white hover:bg-slate-50/80 border-slate-200 hover:border-blue-300 shadow-xs'
          }`}
        >
          <div className={`flex items-center justify-between text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            <span>Online Riders</span>
            <Bike className={`w-4 h-4 group-hover:scale-110 transition-transform ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
          </div>
          <div className={`mt-2 text-lg sm:text-xl font-extrabold font-mono-numbers ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            {onlineRiders.length}
          </div>
          <div className={`text-[11px] mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            {riders.filter((r) => r.status === 'Available').length} Available now
          </div>
        </div>
      </div>

      {/* Secondary Status Badges strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => handleMetricClick('Preparing')}
          className={`p-3 rounded-xl border flex items-center justify-between text-left transition-colors cursor-pointer ${
            isDark
              ? 'bg-[#090D16] border-[#172033] hover:border-slate-700'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div>
            <span className={`text-[11px] block ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>In Kitchen / Picking Bay</span>
            <span className={`text-sm font-bold font-mono-numbers ${isDark ? 'text-white' : 'text-slate-900'}`}>{preparingOrders.length} Preparing</span>
          </div>
          <Package className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
        </button>

        <button
          onClick={() => handleMetricClick('Out for Delivery')}
          className={`p-3 rounded-xl border flex items-center justify-between text-left transition-colors cursor-pointer ${
            isDark
              ? 'bg-[#090D16] border-[#172033] hover:border-slate-700'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div>
            <span className={`text-[11px] block ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>On The Road</span>
            <span className={`text-sm font-bold font-mono-numbers ${isDark ? 'text-white' : 'text-slate-900'}`}>{outForDeliveryOrders.length} Out for Delivery</span>
          </div>
          <Bike className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
        </button>

        <button
          onClick={() => handleMetricClick('Cancelled')}
          className={`p-3 rounded-xl border flex items-center justify-between text-left transition-colors cursor-pointer ${
            isDark
              ? 'bg-[#090D16] border-[#172033] hover:border-slate-700'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div>
            <span className={`text-[11px] block ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Cancellations</span>
            <span className={`text-sm font-bold font-mono-numbers ${isDark ? 'text-white' : 'text-slate-900'}`}>{cancelledOrders.length} Cancelled</span>
          </div>
          <AlertTriangle className={`w-4 h-4 ${isDark ? 'text-zinc-400' : 'text-slate-400'}`} />
        </button>

        <button
          onClick={() => setActiveSection('refunds')}
          className={`p-3 rounded-xl border flex items-center justify-between text-left transition-colors cursor-pointer ${
            isDark
              ? 'bg-[#090D16] border-[#172033] hover:border-slate-700'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div>
            <span className={`text-[11px] block ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Pending Refunds</span>
            <span className={`text-sm font-bold font-mono-numbers ${isDark ? 'text-white' : 'text-slate-900'}`}>{pendingRefunds.length} Action Needed</span>
          </div>
          <RotateCcw className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
        </button>
      </div>

      {/* Main Two-Column Layout: Live Order Pipeline & Quick Commerce Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live Orders Feed with 1-Click Operations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-orange-400 animate-ping' : 'bg-orange-500 animate-ping'}`} />
                Live Order Pipeline &amp; Action Station
              </h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Active quick-commerce orders requiring zero-delay dispatch
              </p>
            </div>
            <button
              onClick={() => setActiveSection('orders')}
              className={`text-xs hover:underline flex items-center gap-1 font-semibold cursor-pointer ${
                isDark ? 'text-orange-400' : 'text-orange-600'
              }`}
            >
              <span>View All Orders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className={`border rounded-2xl overflow-hidden divide-y ${
            isDark ? 'bg-[#090D16] border-[#172033] divide-[#172033] shadow-xl' : 'bg-white border-slate-200 divide-slate-100 shadow-xs'
          }`}>
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className={`p-4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDark ? 'hover:bg-[#0E1524]/60' : 'hover:bg-slate-50'
                }`}
              >
                <div
                  onClick={() => setSelectedOrderDetailId(order.id)}
                  className="flex items-start gap-3 cursor-pointer group flex-1 min-w-0"
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-xs font-mono-numbers shrink-0 transition-colors ${
                    isDark
                      ? 'bg-[#0E1524] group-hover:bg-orange-500/10 border-[#1E2E4A] text-orange-400'
                      : 'bg-slate-100 group-hover:bg-orange-50 border-slate-200 text-slate-800 group-hover:text-orange-600'
                  }`}>
                    {order.id.replace('#', '')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold group-hover:underline transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {order.customerName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          order.status === 'Delivered'
                            ? isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : order.status === 'Preparing' || order.status === 'Packed'
                            ? isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-50 text-amber-700 border-amber-200'
                            : order.status === 'Out for Delivery'
                            ? isDark ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200'
                            : isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className={`text-[11px] font-mono-numbers ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>
                        {order.createdAt}
                      </span>
                    </div>

                    <p className={`text-[11px] mt-1 truncate ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                      {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>

                    <div className={`flex items-center gap-3 text-[11px] mt-1.5 font-mono-numbers ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>₹{order.totalAmount}</span>
                      <span>·</span>
                      <span>{order.storeName.replace('Dark Store ', '')}</span>
                      <span>·</span>
                      <span className={`font-semibold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                        {order.estimatedDeliveryTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 1-Click Operational Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {order.status === 'New' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Confirmed')}
                      className="px-3 py-1.5 rounded-lg text-xs font-extrabold shadow-sm cursor-pointer transition-colors bg-orange-500 hover:bg-orange-400 text-black"
                    >
                      Confirm
                    </button>
                  )}
                  {order.status === 'Confirmed' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Preparing')}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm cursor-pointer transition-colors bg-blue-600 hover:bg-blue-500 text-white"
                    >
                      Start Pick
                    </button>
                  )}
                  {order.status === 'Preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Packed')}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm cursor-pointer transition-colors bg-indigo-600 hover:bg-indigo-500 text-white"
                    >
                      Mark Packed
                    </button>
                  )}
                  {order.status === 'Packed' && (
                    <button
                      onClick={() => setRiderAssignTargetOrderId(order.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-extrabold shadow-sm cursor-pointer flex items-center gap-1 transition-colors bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 text-black"
                    >
                      <Bike className="w-3.5 h-3.5" />
                      <span>Assign Rider</span>
                    </button>
                  )}
                  {order.status === 'Out for Delivery' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'Delivered')}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm cursor-pointer transition-colors bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      Mark Delivered
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedOrderDetailId(order.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-colors ${
                      isDark
                        ? 'bg-[#0E1524] hover:bg-[#152037] text-slate-300 border-[#1E2E4A]'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Dark Store Network & Instant Shortcuts */}
        <div className="space-y-6">
          {/* Dark Store Network Status */}
          <div className={`border rounded-2xl p-4 ${
            isDark ? 'bg-[#090D16] border-[#172033] shadow-xl' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Store className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-[#003B82]'}`} />
                <span>Dark Store Hubs</span>
              </h3>
              <button
                onClick={() => setActiveSection('stores')}
                className={`text-xs hover:underline cursor-pointer ${
                  isDark ? 'text-orange-400' : 'text-orange-600'
                }`}
              >
                Manage
              </button>
            </div>

            <div className="space-y-2.5">
              {stores.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setActiveSection('stores')}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-[#0E1524]/60 hover:bg-[#131C2E] border-[#172033]'
                      : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-orange-400' : 'bg-orange-500'}`} />
                      <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.name}</span>
                    </div>
                    <div className={`text-[11px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                      Radius {s.radiusKm} km · {s.ridersCount} riders on shift
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-mono-numbers font-bold ${
                      isDark ? 'text-orange-400' : 'text-orange-600'
                    }`}>
                      {s.activeOrdersCount}
                    </span>
                    <span className={`block text-[10px] ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Commerce 1-Click Control Panel */}
          <div className={`border rounded-2xl p-4 space-y-3 ${
            isDark ? 'bg-[#090D16] border-[#172033] shadow-xl' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Quick Admin Actions
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setIsQuickActionOpen(true)}
                className={`p-2.5 rounded-xl border text-left font-medium transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#0E1524] hover:bg-[#131C2E] border-[#172033] text-white'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <Package className="w-4 h-4 mb-1 text-orange-500" />
                <span>Add Product</span>
              </button>

              <button
                onClick={() => setIsQuickActionOpen(true)}
                className={`p-2.5 rounded-xl border text-left font-medium transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#0E1524] hover:bg-[#131C2E] border-[#172033] text-white'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <Ticket className="w-4 h-4 mb-1 text-blue-500" />
                <span>Create Coupon</span>
              </button>

              <button
                onClick={() => setActiveSection('categories')}
                className={`p-2.5 rounded-xl border text-left font-medium transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#0E1524] hover:bg-[#131C2E] border-[#172033] text-white'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <Layers className="w-4 h-4 mb-1 text-indigo-500" />
                <span>Categories</span>
              </button>

              <button
                onClick={() => setActiveSection('inventory')}
                className={`p-2.5 rounded-xl border text-left font-medium transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-[#0E1524] hover:bg-[#131C2E] border-[#172033] text-white'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <AlertTriangle className="w-4 h-4 mb-1 text-rose-500" />
                <span>Restock Alerts</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
