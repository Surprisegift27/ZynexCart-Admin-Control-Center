import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  Bike,
  Store,
  DollarSign,
  Package,
  Award,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { stores, riders, products } = useApp();
  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');

  // Top selling quick-commerce items
  const bestSellers = [
    { name: 'Amul Taaza Milk 1L', orders: 184, revenue: 9936, velocity: 'High' },
    { name: 'Aashirvaad Atta 5kg', orders: 92, revenue: 22816, velocity: 'High' },
    { name: 'Britannia Brown Bread 400g', orders: 86, revenue: 3870, velocity: 'High' },
    { name: 'Maggi 2-Min Noodles 4pk', orders: 74, revenue: 4144, velocity: 'Medium' },
    { name: 'Farm Fresh Bananas 1kg', orders: 68, revenue: 3536, velocity: 'Medium' },
  ];

  // Hourly rush hour distribution (breakfast 7-10 AM, evening 6-10 PM)
  const hourlyData = [
    { hour: '07:00 AM', orders: 28, height: '40%' },
    { hour: '08:00 AM', orders: 54, height: '75%' },
    { hour: '09:00 AM', orders: 72, height: '100%' },
    { hour: '10:00 AM', orders: 48, height: '65%' },
    { hour: '12:00 PM', orders: 22, height: '30%' },
    { hour: '04:00 PM', orders: 35, height: '50%' },
    { hour: '07:00 PM', orders: 66, height: '90%' },
    { hour: '09:00 PM', orders: 58, height: '80%' },
    { hour: '11:00 PM', orders: 30, height: '42%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Quick-Commerce Intelligence &amp; SLA Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            10-minute dispatch efficiency · Hourly demand peaks · Micro-warehouse volume
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          {(['Daily', 'Weekly', 'Monthly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                timeframe === t
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* SLA Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Average Doorstep Delivery Time</span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-400 font-mono-numbers">
            9m 42s
          </div>
          <span className="text-[11px] text-emerald-300/80 mt-1 block">
            Target SLA: 10m 00s (Within Target)
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Picking &amp; Packing Speed</span>
          <div className="mt-2 text-2xl font-extrabold text-cyan-400 font-mono-numbers">
            2m 15s
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Order placed &rarr; Sealed in bag
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Fleet Fulfillment Rate</span>
          <div className="mt-2 text-2xl font-extrabold text-white font-mono-numbers">
            99.2%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            0.8% Cancellation rate
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Repeat Customer Rate</span>
          <div className="mt-2 text-2xl font-extrabold text-amber-300 font-mono-numbers">
            78.4%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            &ge; 3 orders per week
          </span>
        </div>
      </div>

      {/* Hourly Rush Hour Bar Chart */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Hourly Rush Hour Order Inflow (Breakfast &amp; Evening Surges)</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Identifies picker/rider staffing peak demand periods
            </p>
          </div>
          <span className="text-xs font-mono-numbers text-emerald-400 font-bold">
            Peak: 09:00 AM (72 Orders/Hr)
          </span>
        </div>

        <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-800">
          {hourlyData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <span className="text-[10px] font-mono-numbers text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {d.orders}
              </span>
              <div
                className="w-full max-w-[36px] bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t group-hover:from-emerald-500 group-hover:to-teal-300 transition-all cursor-pointer"
                style={{ height: d.height }}
              />
              <span className="text-[10px] text-slate-400 font-mono-numbers truncate mt-1">
                {d.hour.replace(':00', '')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Top Products vs Store Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" />
            <span>Fastest Moving Quick-Commerce Essentials</span>
          </h3>

          <div className="divide-y divide-slate-800/80">
            {bestSellers.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white">{item.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono-numbers">
                    {item.orders} units sold today
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-400 font-mono-numbers block">
                    ₹{item.revenue.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{item.velocity} Velocity</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Store Performance */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Store className="w-4 h-4 text-cyan-400" />
            <span>Dark Store Performance Breakdown</span>
          </h3>

          <div className="divide-y divide-slate-800/80">
            {stores.map((s) => (
              <div key={s.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white">{s.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {s.city} · {s.radiusKm} km radius
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white font-mono-numbers block">
                    {s.activeOrdersCount} live / {s.ridersCount} riders
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold font-mono-numbers">
                    {s.healthScore}% SLA Score
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
