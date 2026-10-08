import React, { useState, useMemo } from 'react';
import {
  Search,
  Bike,
  Eye,
  Check,
  ChevronRight,
  Filter,
  Package,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus, PaymentMethod } from '../types';

export const OrdersView: React.FC = () => {
  const {
    orders,
    orderFilterStatus,
    setOrderFilterStatus,
    selectedStoreFilter,
    setSelectedStoreFilter,
    stores,
    updateOrderStatus,
    setSelectedOrderDetailId,
    setRiderAssignTargetOrderId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'All' | PaymentMethod>('All');
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  const statuses: (OrderStatus | 'All')[] = [
    'All',
    'New',
    'Confirmed',
    'Preparing',
    'Packed',
    'Rider Assigned',
    'Picked Up',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
    'Payment Failed',
    'Refund Pending',
  ];

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (orderFilterStatus !== 'All' && order.status !== orderFilterStatus) {
        return false;
      }
      // Store filter
      if (selectedStoreFilter !== 'all' && order.storeId !== selectedStoreFilter) {
        return false;
      }
      // Payment filter
      if (paymentFilter !== 'All' && order.paymentMethod !== paymentFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesCustomer =
          order.customerName.toLowerCase().includes(q) || order.customerPhone.includes(q);
        const matchesItem = order.items.some((i) => i.name.toLowerCase().includes(q));
        if (!matchesId && !matchesCustomer && !matchesItem) return false;
      }
      return true;
    });
  }, [orders, orderFilterStatus, selectedStoreFilter, paymentFilter, searchQuery]);

  // Bulk actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkAdvance = () => {
    selectedOrderIds.forEach((id) => {
      const order = orders.find((o) => o.id === id);
      if (!order) return;
      if (order.status === 'New') updateOrderStatus(id, 'Confirmed');
      else if (order.status === 'Confirmed') updateOrderStatus(id, 'Preparing');
      else if (order.status === 'Preparing') updateOrderStatus(id, 'Packed');
    });
    setSelectedOrderIds([]);
  };

  return (
    <div className="space-y-4">
      {/* Title & Pipeline Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Quick-Commerce Orders Station</span>
            <span className="text-xs font-mono-numbers px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
              {filteredOrders.length} orders
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            10-minute dispatch pipeline · 1-click status transitions &amp; fleet routing
          </p>
        </div>

        {/* Bulk Action Controls */}
        {selectedOrderIds.length > 0 && (
          <div className="flex items-center gap-2 bg-[#090D16] border border-orange-500/40 p-1.5 rounded-xl animate-in fade-in">
            <span className="text-xs font-semibold text-orange-400 px-2 font-mono-numbers">
              {selectedOrderIds.length} selected
            </span>
            <button
              onClick={handleBulkAdvance}
              className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black text-xs font-extrabold rounded-lg cursor-pointer transition-colors"
            >
              Advance Pipeline
            </button>
            <button
              onClick={() => setSelectedOrderIds([])}
              className="text-xs text-slate-400 hover:text-white px-2 cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Horizontal Status Pipeline Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[#172033] scrollbar-none">
        {statuses.map((status) => {
          const count =
            status === 'All'
              ? orders.length
              : orders.filter((o) => o.status === status).length;
          const isActive = orderFilterStatus === status;

          return (
            <button
              key={status}
              onClick={() => setOrderFilterStatus(status)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#131C2E]'
              }`}
            >
              <span>{status}</span>
              <span
                className={`text-[10px] font-mono-numbers px-1.5 py-0.5 rounded font-bold ${
                  isActive ? 'bg-orange-500 text-black font-extrabold' : 'bg-[#131C2E] text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Secondary Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#090D16] p-3 rounded-xl border border-[#172033]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-orange-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by #10245, customer name, phone or product..."
            className="w-full pl-9 pr-3 py-1.5 bg-black border border-[#172033] rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Dark Store Filter */}
          <div className="flex items-center gap-1.5 bg-black border border-[#172033] px-2.5 py-1.5 rounded-lg text-xs">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={selectedStoreFilter}
              onChange={(e) => setSelectedStoreFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Dark Stores</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Filter */}
          <div className="flex items-center gap-1.5 bg-black border border-[#172033] px-2.5 py-1.5 rounded-lg text-xs">
            <span className="text-slate-400">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as any)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="COD">Cash on Delivery</option>
              <option value="Card">Cards</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#090D16] border border-[#172033] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredOrders.length > 0 &&
                      selectedOrderIds.length === filteredOrders.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-3">Order ID</th>
                <th className="py-3.5 px-3">Customer</th>
                <th className="py-3.5 px-3">Store</th>
                <th className="py-3.5 px-3">Items</th>
                <th className="py-3.5 px-3 text-right">Amount</th>
                <th className="py-3.5 px-3">Payment</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Rider</th>
                <th className="py-3.5 px-3">ETA</th>
                <th className="py-3.5 px-3 text-right">1-Click Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-xs text-slate-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isSelected = selectedOrderIds.includes(order.id);

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-slate-800/50 transition-colors ${
                        isSelected ? 'bg-emerald-500/5' : ''
                      }`}
                    >
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(order.id)}
                          className="rounded border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* Order ID */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => setSelectedOrderDetailId(order.id)}
                          className="font-mono-numbers font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>{order.id}</span>
                        </button>
                        <span className="text-[10px] text-slate-400 block font-mono-numbers">
                          {order.createdAt}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white truncate max-w-[140px]">
                          {order.customerName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono-numbers">
                          {order.customerPhone}
                        </div>
                      </td>

                      {/* Store */}
                      <td className="py-3 px-3">
                        <span className="text-[11px] text-slate-300 truncate max-w-[120px] block">
                          {order.storeName.replace('Dark Store ', '')}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="py-3 px-3">
                        <div className="truncate max-w-[160px]" title={order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}>
                          <span className="font-bold text-white font-mono-numbers mr-1">
                            {order.items.length}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            ({order.items[0]?.name})
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-3 text-right">
                        <div className="font-mono-numbers font-bold text-white">
                          ₹{order.totalAmount}
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-300 text-[11px]">{order.paymentMethod}</span>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              order.paymentStatus === 'Successful'
                                ? 'bg-emerald-400'
                                : order.paymentStatus === 'Failed'
                                ? 'bg-rose-400'
                                : 'bg-amber-400'
                            }`}
                          />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : order.status === 'Cancelled'
                              ? 'bg-rose-500/20 text-rose-300'
                              : order.status === 'Preparing' || order.status === 'Packed'
                              ? 'bg-amber-500/20 text-amber-300'
                              : order.status === 'Out for Delivery'
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* Rider */}
                      <td className="py-3 px-3">
                        {order.riderName ? (
                          <div className="flex items-center gap-1 text-[11px] text-slate-200 font-semibold truncate max-w-[120px]">
                            <Bike className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span className="truncate">{order.riderName}</span>
                          </div>
                        ) : order.status === 'Delivered' ? (
                          <span className="text-[11px] text-slate-400">Delivered</span>
                        ) : (
                          <button
                            onClick={() => setRiderAssignTargetOrderId(order.id)}
                            className="text-[10px] text-cyan-400 hover:underline font-semibold cursor-pointer"
                          >
                            + Assign
                          </button>
                        )}
                      </td>

                      {/* ETA */}
                      <td className="py-3 px-3">
                        <span className="text-[11px] font-mono-numbers text-emerald-400 font-bold whitespace-nowrap">
                          {order.estimatedDeliveryTime}
                        </span>
                      </td>

                      {/* 1-Click Action Buttons */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {order.status === 'New' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'Confirmed')}
                              className="px-2.5 py-1 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] shadow-sm cursor-pointer"
                              title="Accept & Confirm Order"
                            >
                              Confirm
                            </button>
                          )}

                          {order.status === 'Confirmed' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'Preparing')}
                              className="px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shadow-sm cursor-pointer"
                              title="Send pick slip to store bay"
                            >
                              Start Pick
                            </button>
                          )}

                          {order.status === 'Preparing' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'Packed')}
                              className="px-2.5 py-1 rounded-md bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-[11px] shadow-sm cursor-pointer flex items-center gap-1"
                              title="Mark order bagged & sealed"
                            >
                              <Package className="w-3 h-3" />
                              <span>Packed</span>
                            </button>
                          )}

                          {order.status === 'Packed' && (
                            <button
                              onClick={() => setRiderAssignTargetOrderId(order.id)}
                              className="px-2.5 py-1 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] shadow-sm cursor-pointer flex items-center gap-1"
                              title="Assign available rider"
                            >
                              <Bike className="w-3 h-3" />
                              <span>Assign Rider</span>
                            </button>
                          )}

                          {order.status === 'Rider Assigned' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'Picked Up')}
                              className="px-2.5 py-1 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] shadow-sm cursor-pointer"
                              title="Rider picked parcel from counter"
                            >
                              Picked Up
                            </button>
                          )}

                          {order.status === 'Picked Up' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'Out for Delivery')}
                              className="px-2.5 py-1 rounded-md bg-blue-500 hover:bg-blue-400 text-white font-bold text-[11px] shadow-sm cursor-pointer"
                              title="Rider on way"
                            >
                              En Route
                            </button>
                          )}

                          {order.status === 'Out for Delivery' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'Delivered')}
                              className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm cursor-pointer flex items-center gap-1"
                              title="Confirm Doorstep Handover"
                            >
                              <Check className="w-3 h-3" />
                              <span>Delivered</span>
                            </button>
                          )}

                          {/* View Order Drawer */}
                          <button
                            onClick={() => setSelectedOrderDetailId(order.id)}
                            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                            title="View Full Order Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
