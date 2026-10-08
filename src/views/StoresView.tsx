import React, { useState } from 'react';
import {
  Store,
  MapPin,
  Clock,
  Phone,
  Bike,
  Package,
  Activity,
  CheckCircle2,
  Plus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StoresView: React.FC = () => {
  const { stores, setIsQuickActionOpen } = useApp();
  const [selectedStore, setSelectedStore] = useState<string>(stores[0]?.id || 'store-01');

  const activeStore = stores.find((s) => s.id === selectedStore) || stores[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Dark Store Operations &amp; Fulfillment Hubs</span>
            <span className="text-xs font-mono-numbers px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
              {stores.length} Hubs Active
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Hyperlocal micro-fulfillment centers · Automated store routing &amp; stock availability
          </p>
        </div>

        <button
          onClick={() => setIsQuickActionOpen(true)}
          className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Provision Dark Store</span>
        </button>
      </div>

      {/* Automated Allocation Logic Diagram matching Spec 7 */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            ZynexCart Automated Store Allocation Algorithm
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          The system dynamically assigns orders without admin intervention:
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 font-medium">
            1. Customer GPS Pin
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 font-medium">
            2. Radius &le; 3.5 km Match
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 font-medium">
            3. Real-Time Stock Check
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
            YES &rarr; Auto-Allocate Store
          </div>
          <span className="text-slate-400 text-[11px]">(If stock missing &rarr; fallback nearest store)</span>
        </div>
      </div>

      {/* Store Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stores.map((store) => {
          const isSelected = selectedStore === store.id;

          return (
            <div
              key={store.id}
              onClick={() => setSelectedStore(store.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/5'
                  : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                    {store.code}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{store.healthScore}% SLA Health</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mt-2.5">{store.name}</h3>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{store.address}</span>
                </p>

                <div className="mt-3 grid grid-cols-3 gap-1.5 p-2 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Pickers</span>
                    <strong className="text-xs text-white font-mono-numbers">{store.pickersCount}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Packers</span>
                    <strong className="text-xs text-white font-mono-numbers">{store.packersCount}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Riders</span>
                    <strong className="text-xs text-cyan-400 font-mono-numbers">{store.ridersCount}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Radius: <strong className="text-slate-200">{store.radiusKm} km</strong>
                </span>
                <span className="font-mono-numbers text-emerald-400 font-bold">
                  {store.activeOrdersCount} live orders
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Dark Store Inspection Panel */}
      {activeStore && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{activeStore.name}</h2>
                <span className="text-xs font-mono-numbers text-slate-400">({activeStore.code})</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{activeStore.address}, {activeStore.city}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Operational Status: Nominal
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Operating Window:
              </span>
              <p className="text-sm font-bold text-white">{activeStore.operatingHours}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Dispatch Hotline:
              </span>
              <p className="text-sm font-bold text-emerald-400 font-mono-numbers">{activeStore.phone}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Bike className="w-3.5 h-3.5 text-cyan-400" /> Active Fleet Capacity:
              </span>
              <p className="text-sm font-bold text-white">
                {activeStore.ridersCount} on shift · {activeStore.activeOrdersCount} in delivery
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
