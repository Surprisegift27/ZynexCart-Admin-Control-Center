import React, { useState } from 'react';
import {
  Bike,
  Star,
  ShieldCheck,
  Battery,
  TrendingUp,
  AlertCircle,
  Plus,
  Search,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RiderStatus } from '../types';

export const RidersView: React.FC = () => {
  const { riders, updateRiderStatus, setIsQuickActionOpen } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | RiderStatus>('All');

  const filteredRiders = riders.filter((r) => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!r.name.toLowerCase().includes(q) && !r.phone.includes(q)) return false;
    }
    return true;
  });

  const availableCount = riders.filter((r) => r.status === 'Available').length;
  const onDeliveryCount = riders.filter((r) => r.status === 'On Delivery').length;
  const totalDeliveriesToday = riders.reduce((s, r) => s + r.completedDeliveriesToday, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Quick-Commerce Delivery Fleet (Riders)</span>
            <span className="text-xs font-mono-numbers px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
              {riders.length} Fleet Personnel
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-dispatch algorithm active · Workload balancing &amp; battery monitoring
          </p>
        </div>

        <button
          onClick={() => setIsQuickActionOpen(true)}
          className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Onboard Rider</span>
        </button>
      </div>

      {/* Fleet KPI Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Available For Immediate Dispatch</span>
          <span className="text-xl font-extrabold text-emerald-400 font-mono-numbers">
            {availableCount} Riders Idle
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Active On Road (En Route)</span>
          <span className="text-xl font-extrabold text-cyan-400 font-mono-numbers">
            {onDeliveryCount} In Flight
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Deliveries Completed Today</span>
          <span className="text-xl font-extrabold text-white font-mono-numbers">
            {totalDeliveriesToday} Completed
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Average Fleet Rating</span>
          <span className="text-xl font-extrabold text-amber-300 font-mono-numbers flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
            4.84 / 5.0
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rider by name or phone..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="All">All Fleet</option>
            <option value="Available">Available</option>
            <option value="On Delivery">On Delivery</option>
            <option value="Offline">Offline</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Riders Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRiders.map((rider) => {
          return (
            <div
              key={rider.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                      <Bike className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-white">{rider.name}</h3>
                        {rider.kycVerified && (
                          <span title="KYC Approved" className="shrink-0 flex items-center">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono-numbers">
                        {rider.phone}
                      </span>
                    </div>
                  </div>

                  <select
                    value={rider.status}
                    onChange={(e) => updateRiderStatus(rider.id, e.target.value as any)}
                    className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer border ${
                      rider.status === 'Available'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : rider.status === 'On Delivery'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : rider.status === 'Offline'
                        ? 'bg-slate-800 text-slate-400 border-slate-700'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    <option value="Available">Available</option>
                    <option value="On Delivery">On Delivery</option>
                    <option value="Offline">Offline</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                {/* Details Breakdown */}
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Vehicle</span>
                    <strong className="text-slate-200">{rider.vehicleType}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Battery / Fuel</span>
                    <strong className="text-emerald-400 font-mono-numbers">
                      {rider.batteryOrFuelPercent}%
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Deliveries Today</span>
                    <strong className="text-white font-mono-numbers">
                      {rider.completedDeliveriesToday}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Today&apos;s Earnings</span>
                    <strong className="text-emerald-400 font-mono-numbers">
                      ₹{rider.earningsToday}
                    </strong>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-slate-400 truncate">
                  Loc: {rider.currentLocationName}
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-amber-300 font-mono-numbers font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>{rider.rating} Rating</span>
                </div>

                {rider.currentOrderId && (
                  <span className="text-[11px] text-cyan-400 font-mono-numbers font-semibold">
                    Delivering {rider.currentOrderId}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
