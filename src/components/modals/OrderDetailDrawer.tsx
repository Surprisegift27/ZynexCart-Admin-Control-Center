import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  MapPin,
  Clock,
  Bike,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Ban,
  Package,
  Store,
  CreditCard,
  FileText,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';

export const OrderDetailDrawer: React.FC = () => {
  const {
    selectedOrderDetailId,
    setSelectedOrderDetailId,
    orders,
    updateOrderStatus,
    cancelOrder,
    refundOrder,
    setRiderAssignTargetOrderId,
    settings,
  } = useApp();

  const isDark = settings.themeMode === 'dark' || settings.themeMode === 'black-white';

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState('');

  const order = orders.find((o) => o.id === selectedOrderDetailId);

  if (!selectedOrderDetailId || !order) return null;

  // Next logical status pipeline helper
  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    switch (current) {
      case 'New':
        return 'Confirmed';
      case 'Confirmed':
        return 'Preparing';
      case 'Preparing':
        return 'Packed';
      case 'Packed':
        return 'Rider Assigned';
      case 'Rider Assigned':
        return 'Picked Up';
      case 'Picked Up':
        return 'Out for Delivery';
      case 'Out for Delivery':
        return 'Delivered';
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus(order.status);

  const handlePrintSlip = () => {
    try {
      window.print();
    } catch {
      // In sandboxed iframe print might be disallowed
    }
  };

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setSelectedOrderDetailId(null);
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedOrderDetailId(null);
      }}
      className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl border-l h-full flex flex-col shadow-2xl overflow-hidden cursor-default transition-all ${
          isMonochrome
            ? 'bg-zinc-950 border-zinc-800 text-white'
            : 'bg-[#090D16] border-[#172033] text-slate-100'
        }`}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
          isMonochrome ? 'bg-black border-zinc-800' : 'bg-[#070A12] border-[#172033]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
              isMonochrome ? 'bg-white text-black' : 'bg-blue-600/20 text-blue-400'
            }`}>
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-base font-bold font-mono-numbers ${isMonochrome ? 'text-white' : 'text-orange-400'}`}>{order.id}</h2>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                    isMonochrome
                      ? order.status === 'Delivered'
                        ? 'bg-zinc-800 text-white border-zinc-600'
                        : 'bg-white text-black border-white'
                      : order.status === 'Delivered'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : order.status === 'Cancelled'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      : order.status === 'Preparing' || order.status === 'Packed'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : order.status === 'Out for Delivery'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Placed at {order.createdAt} · ETA: <span className={isMonochrome ? 'text-white font-semibold' : 'text-orange-400 font-semibold'}>{order.estimatedDeliveryTime}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintSlip}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isMonochrome ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-400 hover:text-white hover:bg-[#131C2E]'
              }`}
              title="Print Order Manifest"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedOrderDetailId(null)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isMonochrome ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-slate-400 hover:text-white hover:bg-[#131C2E]'
              }`}
              title="Close Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Quick Commerce Delivery SLA Banner */}
          <div className="p-3.5 rounded-xl bg-black/60 border border-[#172033] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-200">10-Minute SLA Tracker</span>
                <p className="text-[11px] text-slate-400">
                  Store distance: <span className="font-mono-numbers text-slate-300">{order.deliveryDistanceKm} km</span> · Est: {order.estimatedDeliveryTime}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono-numbers font-bold text-orange-400">
                {order.status === 'Delivered' ? 'Completed' : 'Live In Flight'}
              </span>
            </div>
          </div>

          {/* Section 1: Customer & Destination Details */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Customer & Delivery Address</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Customer Name:</span>
                <p className="font-semibold text-white mt-0.5">{order.customerName}</p>
              </div>
              <div>
                <span className="text-slate-400">Phone:</span>
                <p className="font-semibold text-emerald-400 mt-0.5 flex items-center gap-1 font-mono-numbers">
                  <Phone className="w-3 h-3" />
                  {order.customerPhone}
                </p>
              </div>
            </div>

            <div className="text-xs pt-1 border-t border-slate-800">
              <span className="text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" /> Delivery Address:
              </span>
              <p className="font-medium text-slate-200 mt-1">{order.customerAddress}</p>
            </div>

            {order.deliveryInstructions && (
              <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                <span className="text-slate-400 font-semibold">Special Instructions:</span>
                <p className="text-amber-300/90 mt-0.5">{order.deliveryInstructions}</p>
              </div>
            )}
          </div>

          {/* Section 2: Order Items & Pricing Breakdown */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Package className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ordered Items ({order.items.length})</span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">Fulfilled from {order.storeName}</span>
            </div>

            <div className="divide-y divide-slate-800/60">
              {order.items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-100">{item.name}</p>
                    <p className="text-[11px] text-slate-400">
                      Unit: {item.unit} · Qty: <span className="font-bold text-white font-mono-numbers">{item.quantity}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono-numbers font-bold text-slate-200">
                      ₹{item.price * item.quantity}
                    </span>
                    {item.mrp > item.price && (
                      <span className="block text-[10px] text-slate-400 line-through font-mono-numbers">
                        ₹{item.mrp * item.quantity}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Summary */}
            <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Items Subtotal:</span>
                <span className="font-mono-numbers text-slate-200">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Charge (10-Min SLA):</span>
                <span className="font-mono-numbers text-slate-200">
                  {order.deliveryFee === 0 ? <span className="text-emerald-400">FREE</span> : `₹${order.deliveryFee}`}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Coupon Discount ({order.couponCode || 'PROMO'}):</span>
                  <span className="font-mono-numbers">-₹{order.discount}</span>
                </div>
              )}
              {order.tip && order.tip > 0 ? (
                <div className="flex justify-between text-slate-400">
                  <span>Rider Tip:</span>
                  <span className="font-mono-numbers text-slate-200">₹{order.tip}</span>
                </div>
              ) : null}
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-white">
                <span>Total Paid / Payable:</span>
                <span className="font-mono-numbers text-emerald-400">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Fulfillment Team (Dark Store, Picker, Packer, Rider) */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fulfilment & Fleet Assignment</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Dark Store:</span>
                <p className="font-semibold text-slate-200 mt-0.5">{order.storeName}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Picker: <span className="text-slate-300 font-medium">{order.pickerName || 'Auto-Allocating'}</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Packer: <span className="text-slate-300 font-medium">{order.packerName || 'Auto-Allocating'}</span>
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Assigned Rider:</span>
                  {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                    <button
                      onClick={() => setRiderAssignTargetOrderId(order.id)}
                      className="text-[10px] text-emerald-400 hover:underline font-semibold cursor-pointer"
                    >
                      {order.riderName ? 'Change Rider' : '+ Assign Rider'}
                    </button>
                  )}
                </div>
                {order.riderName ? (
                  <>
                    <p className="font-semibold text-white mt-0.5 flex items-center gap-1.5">
                      <Bike className="w-3.5 h-3.5 text-cyan-400" />
                      {order.riderName}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 font-mono-numbers">
                      Phone: {order.riderPhone}
                    </p>
                  </>
                ) : (
                  <p className="text-amber-400 text-xs mt-1 font-medium">
                    No rider assigned yet (In packing bay)
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Payment & Transaction Details */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Payment Details</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400">Method:</span>
                <p className="font-semibold text-white mt-0.5">{order.paymentMethod}</p>
              </div>
              <div>
                <span className="text-slate-400">Payment Status:</span>
                <p
                  className={`font-semibold mt-0.5 ${
                    order.paymentStatus === 'Successful'
                      ? 'text-emerald-400'
                      : order.paymentStatus === 'Refunded'
                      ? 'text-purple-400'
                      : order.paymentStatus === 'Failed'
                      ? 'text-rose-400'
                      : 'text-amber-400'
                  }`}
                >
                  {order.paymentStatus}
                </p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400">Transaction ID:</span>
                <p className="font-mono-numbers text-[11px] text-slate-300 mt-0.5 truncate">
                  {order.transactionId}
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Visual Step-by-Step Timeline */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fulfillment & Dispatch Timeline</span>
            </div>

            <div className="relative pl-6 space-y-4 border-l-2 border-slate-800">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="relative group">
                  <div
                    className={`absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full border-2 ${
                      idx === order.timeline.length - 1
                        ? 'bg-emerald-500 border-slate-900 ring-2 ring-emerald-500/30'
                        : 'bg-slate-800 border-slate-700'
                    }`}
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{event.status}</span>
                    <span className="font-mono-numbers text-[11px] text-slate-400">{event.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{event.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 shrink-0 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
              <button
                onClick={() => setCancelModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel Order</span>
              </button>
            )}

            {order.paymentStatus === 'Successful' && order.status !== 'Refunded' && (
              <button
                onClick={() => {
                  setRefundAmount(order.totalAmount);
                  setRefundModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Issue Refund</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {nextStatus && (
              <button
                onClick={() => {
                  if (nextStatus === 'Rider Assigned' && !order.riderName) {
                    setRiderAssignTargetOrderId(order.id);
                  } else {
                    updateOrderStatus(order.id, nextStatus);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black text-xs font-extrabold transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Advance to {nextStatus}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {order.status === 'Delivered' && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
                Delivered
              </span>
            )}
          </div>
        </div>

        {/* Cancellation Submodal */}
        {cancelModalOpen && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-2xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                Confirm Cancellation for {order.id}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Cancelling will restore inventory back to dark store shelves and initiate payment reversal.
              </p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason (e.g. Customer requested, stock shortage, address out of bounds)..."
                rows={3}
                className="w-full mt-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-rose-500"
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setCancelModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
                >
                  Keep Order
                </button>
                <button
                  onClick={() => {
                    cancelOrder(order.id, cancelReason || 'Admin cancelled');
                    setCancelModalOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
                >
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Refund Submodal */}
        {refundModalOpen && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-5 shadow-2xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-purple-400" />
                Process Refund for {order.id}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter refund amount to return to customer&apos;s original payment method ({order.paymentMethod}).
              </p>
              <div className="mt-3">
                <label className="text-[11px] text-slate-400 block mb-1">Refund Amount (₹):</label>
                <input
                  type="number"
                  max={order.totalAmount}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono-numbers text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="mt-3">
                <label className="text-[11px] text-slate-400 block mb-1">Reason for refund:</label>
                <input
                  type="text"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="e.g. Damaged item, late delivery compensation, item missing..."
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setRefundModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    refundOrder(order.id, refundAmount, refundReason || 'Refund approved by admin');
                    setRefundModalOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold cursor-pointer"
                >
                  Approve &amp; Refund ₹{refundAmount}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
