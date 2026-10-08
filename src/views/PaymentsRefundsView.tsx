import React, { useState } from 'react';
import {
  CreditCard,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Search,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PaymentsRefundsView: React.FC = () => {
  const {
    orders,
    refunds,
    approveRefund,
    rejectRefund,
    setSelectedOrderDetailId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'payments' | 'refunds'>('payments');
  const [methodFilter, setMethodFilter] = useState<string>('All');

  // Compute breakdown
  const upiCount = orders.filter((o) => o.paymentMethod === 'UPI').length;
  const codCount = orders.filter((o) => o.paymentMethod === 'COD').length;
  const cardCount = orders.filter((o) => o.paymentMethod === 'Card').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Finance: Payments &amp; Refund Desk</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Gateway transaction ledger · Instant UPI reversal review &amp; audit history
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('payments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'payments'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment Ledger ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('refunds')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'refunds'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Refund Desk ({refunds.length})</span>
        </button>
      </div>

      {/* 1. Payments View */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          {/* Methods Breakdown Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">UPI Volume (GPay / PhonePe / Paytm)</span>
              <strong className="text-base text-emerald-400 font-mono-numbers">
                {upiCount} Transactions (72% Share)
              </strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Cash on Delivery (Doorstep Cash)</span>
              <strong className="text-base text-amber-400 font-mono-numbers">
                {codCount} Transactions (18% Share)
              </strong>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Credit &amp; Debit Cards</span>
              <strong className="text-base text-blue-400 font-mono-numbers">
                {cardCount} Transactions (10% Share)
              </strong>
            </div>
          </div>

          {/* Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Transaction ID</th>
                    <th className="py-3.5 px-3">Linked Order</th>
                    <th className="py-3.5 px-3">Customer</th>
                    <th className="py-3.5 px-3">Method</th>
                    <th className="py-3.5 px-3 text-right">Amount (₹)</th>
                    <th className="py-3.5 px-3">Status</th>
                    <th className="py-3.5 px-4 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono-numbers text-[11px] text-slate-200">
                        {order.transactionId}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => setSelectedOrderDetailId(order.id)}
                          className="font-mono-numbers font-bold text-emerald-400 hover:underline cursor-pointer"
                        >
                          {order.id}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-white font-medium">{order.customerName}</td>
                      <td className="py-3 px-3 text-slate-300">{order.paymentMethod}</td>
                      <td className="py-3 px-3 text-right font-mono-numbers font-bold text-white">
                        ₹{order.totalAmount}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            order.paymentStatus === 'Successful'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : order.paymentStatus === 'Refunded'
                              ? 'bg-purple-500/20 text-purple-300'
                              : order.paymentStatus === 'Failed'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono-numbers text-slate-400">
                        {order.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Refund Center matching Spec 13 */}
      {activeTab === 'refunds' && (
        <div className="space-y-3">
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-xs text-purple-200 flex items-center justify-between">
            <span>
              <strong>Refund Pipeline:</strong> Requested &rarr; Review &rarr; Approved / Rejected &rarr; Processing &rarr; Refunded
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {refunds.map((ref) => (
              <div
                key={ref.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-numbers text-xs font-bold text-purple-400">
                      Refund for {ref.orderId}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ref.status === 'Refunded'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : ref.status === 'Rejected'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {ref.status}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono-numbers">
                      {ref.requestedAt}
                    </span>
                  </div>

                  <p className="text-xs text-white font-medium">{ref.customerName} ({ref.customerPhone})</p>
                  <p className="text-xs text-slate-400">Reason: <span className="text-slate-300">{ref.reason}</span></p>
                  {ref.notes && (
                    <p className="text-[11px] text-slate-400 italic">Notes: {ref.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Claim Amount</span>
                    <span className="text-base font-extrabold text-purple-400 font-mono-numbers">
                      ₹{ref.amount}
                    </span>
                  </div>

                  {ref.status === 'Pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => approveRefund(ref.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer"
                      >
                        Approve &amp; Refund
                      </button>
                      <button
                        onClick={() => rejectRefund(ref.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 text-xs cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedOrderDetailId(ref.orderId)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs cursor-pointer"
                  >
                    View Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
