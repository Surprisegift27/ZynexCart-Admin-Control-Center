import React from 'react';
import { X, Bike, Zap, Star, CheckCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AssignRiderModal: React.FC = () => {
  const {
    riderAssignTargetOrderId,
    setRiderAssignTargetOrderId,
    orders,
    riders,
    assignRiderToOrder,
  } = useApp();

  if (!riderAssignTargetOrderId) return null;

  const order = orders.find((o) => o.id === riderAssignTargetOrderId);
  if (!order) return null;

  // Find best available rider automatically
  const availableRiders = riders.filter((r) => r.status === 'Available');
  const bestRider = availableRiders.length > 0
    ? [...availableRiders].sort((a, b) => b.batteryOrFuelPercent - a.batteryOrFuelPercent || b.rating - a.rating)[0]
    : riders[0];

  const handleAssign = (riderId: string) => {
    assignRiderToOrder(order.id, riderId);
    setRiderAssignTargetOrderId(null);
  };

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setRiderAssignTargetOrderId(null);
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setRiderAssignTargetOrderId(null);
      }}
      className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#090D16] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden flex flex-col cursor-default"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#172033] bg-[#070A12] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Dispatch Rider for</span>
                <span className="font-mono-numbers text-orange-400">{order.id}</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Distance: {order.deliveryDistanceKm} km · Customer: {order.customerName}
              </p>
            </div>
          </div>
          <button
            onClick={() => setRiderAssignTargetOrderId(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Smart Auto-Assign Banner */}
        {bestRider && (
          <div className="p-3.5 bg-gradient-to-r from-blue-950/40 via-[#0B0F19] to-orange-950/30 border-b border-[#172033] flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-orange-400" />
                Algorithm Recommendation (Optimal Distance + Battery)
              </span>
              <p className="text-xs text-slate-200 font-semibold mt-0.5">
                {bestRider.name} · {bestRider.vehicleType} ({bestRider.batteryOrFuelPercent}% battery)
              </p>
            </div>
            <button
              onClick={() => handleAssign(bestRider.id)}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs shrink-0 shadow-md shadow-orange-500/20 cursor-pointer"
            >
              Auto-Assign Now
            </button>
          </div>
        )}

        {/* Rider List */}
        <div className="p-4 max-h-[55vh] overflow-y-auto space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Available Fleet Near Dark Store Hub
          </div>

          {riders.map((r) => {
            const isAssignedToThisOrder = order.riderId === r.id;
            const isAvailable = r.status === 'Available';

            return (
              <div
                key={r.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isAssignedToThisOrder
                    ? 'bg-orange-500/10 border-orange-500/40'
                    : isAvailable
                    ? 'bg-[#0E1524]/60 hover:bg-[#131C2E] border-[#172033]'
                    : 'bg-black/40 border-[#172033] opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isAvailable ? 'bg-blue-600/20 text-blue-400' : 'bg-[#131C2E] text-slate-400'
                    }`}
                  >
                    <Bike className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-white truncate">{r.name}</span>
                      {r.kycVerified && (
                        <span title="KYC Verified" className="shrink-0 flex items-center">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          r.status === 'Available'
                            ? 'bg-blue-500/20 text-blue-300'
                            : r.status === 'On Delivery'
                            ? 'bg-orange-500/20 text-orange-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span>{r.vehicleType}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5 text-amber-300 font-mono-numbers">
                        <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                        {r.rating}
                      </span>
                      <span>·</span>
                      <span className="font-mono-numbers text-slate-300">{r.batteryOrFuelPercent}%</span>
                      <span>·</span>
                      <span>{r.completedDeliveriesToday} done today</span>
                    </div>

                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                      Loc: {r.currentLocationName}
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {isAssignedToThisOrder ? (
                    <span className="flex items-center gap-1 text-xs text-orange-400 font-bold px-2 py-1 bg-orange-500/10 rounded">
                      <CheckCircle className="w-3.5 h-3.5" /> Assigned
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAssign(r.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#131C2E] hover:bg-orange-500 hover:text-black text-slate-200 text-xs font-semibold border border-[#1E2E4A] transition-colors cursor-pointer"
                    >
                      Assign
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#172033] bg-black/60 text-right">
          <button
            onClick={() => setRiderAssignTargetOrderId(null)}
            className="px-4 py-1.5 rounded-lg bg-[#131C2E] text-slate-300 text-xs cursor-pointer hover:bg-[#1C2942]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
