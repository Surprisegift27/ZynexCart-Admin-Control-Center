import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Zap,
  Truck,
  RotateCcw,
  Check,
  Palette,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ZynexLogo } from '../components/common/ZynexLogo';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, resetDemoData, triggerAudioAlert } = useApp();
  const [savedToast, setSavedToast] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const isMonochrome = settings.themeMode === 'black-white';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    triggerAudioAlert('success');
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Brand & Theme Showcase */}
      <div className={`p-6 rounded-2xl border shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 transition-all ${
        isMonochrome
          ? 'bg-zinc-950 border-zinc-800 text-white'
          : 'bg-gradient-to-r from-[#090D16] via-[#0E1524] to-[#090D16] border-[#1E2E4A] text-slate-100'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl border shadow-inner ${
            isMonochrome ? 'bg-black border-zinc-800' : 'bg-black/60 border-[#1E2E4A]'
          }`}>
            <ZynexLogo size="lg" lightText={true} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${
                isMonochrome ? 'text-white' : 'text-orange-400'
              }`}>
                {isMonochrome ? 'Black & White Edition' : 'Official Brand Identity'}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${isMonochrome ? 'bg-white' : 'bg-orange-400'}`} />
              <span className="text-xs text-zinc-400">Quick-Commerce Engine</span>
            </div>
            <p className="text-sm font-semibold text-white mt-1">
              ZynexCart Control Center
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              {isMonochrome
                ? 'Monochrome Pure Black (#000000) & Crisp White (#FFFFFF) Theme'
                : 'Royal Blue (#003B82) & Vibrant Orange (#FF7A00) Palette'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isMonochrome ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black border border-zinc-800 text-xs font-mono-numbers">
              <span className="w-3.5 h-3.5 rounded-full bg-black border border-zinc-600" title="Pure OLED Black" />
              <span className="w-3.5 h-3.5 rounded-full bg-zinc-800 border border-zinc-600" title="Obsidian Grey" />
              <span className="w-3.5 h-3.5 rounded-full bg-white border border-zinc-300" title="Pure White" />
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 border border-[#172033] text-xs font-mono-numbers">
              <span className="w-3.5 h-3.5 rounded-full bg-[#003B82] border border-white/20" title="Royal Blue" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#FF7A00] border border-white/20" title="Vibrant Orange" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#05080F] border border-white/20" title="Obsidian Black" />
            </div>
          )}
        </div>
      </div>

      {/* Theme Selection Card */}
      <div className={`p-5 rounded-2xl border shadow-xl space-y-4 ${
        isMonochrome ? 'bg-zinc-950 border-zinc-800' : 'bg-[#090D16] border-[#172033]'
      }`}>
        <div className={`flex items-center gap-2 border-b pb-3 ${
          isMonochrome ? 'border-zinc-800' : 'border-[#172033]'
        }`}>
          <Palette className={`w-4 h-4 ${isMonochrome ? 'text-white' : 'text-orange-400'}`} />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Display Theme &amp; Color Scheme
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              updateSettings({ themeMode: 'black-white' });
              triggerAudioAlert('chime');
            }}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between ${
              isMonochrome
                ? 'bg-white text-black border-white shadow-lg'
                : 'bg-black/60 hover:bg-black border-zinc-800 text-zinc-300'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 font-bold text-sm">
                <span>Black &amp; White (Monochrome)</span>
                {isMonochrome && <span className="text-[10px] px-2 py-0.5 rounded-full bg-black text-white font-extrabold">Active</span>}
              </div>
              <p className={`text-xs mt-1.5 ${isMonochrome ? 'text-zinc-800' : 'text-zinc-400'}`}>
                Ultra-clean dark obsidian and pure white typography, high contrast, minimal and luxury.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              updateSettings({ themeMode: 'brand' });
              triggerAudioAlert('chime');
            }}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between ${
              !isMonochrome
                ? 'bg-gradient-to-r from-blue-950/60 to-orange-950/40 text-white border-orange-500/50 shadow-lg'
                : 'bg-black/60 hover:bg-black border-zinc-800 text-zinc-300'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 font-bold text-sm">
                <span>Zynex Brand (Orange &amp; Blue)</span>
                {!isMonochrome && <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500 text-black font-extrabold">Active</span>}
              </div>
              <p className={`text-xs mt-1.5 ${!isMonochrome ? 'text-orange-200/90' : 'text-zinc-400'}`}>
                Official ZynexCart Royal Blue &amp; Vibrant Orange brand accents with dark obsidian black.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Control Center &amp; Quick-Commerce SLA Settings</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            10-minute dispatch thresholds, delivery fees, simulation parameters
          </p>
        </div>

        {savedToast && (
          <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 animate-in fade-in ${
            isMonochrome
              ? 'bg-white text-black border-white'
              : 'bg-orange-500/20 text-orange-400 border-orange-500/40'
          }`}>
            <Check className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section 1: Quick-Commerce 10-Min SLA Engine */}
        <div className={`p-5 rounded-2xl border shadow-xl space-y-4 ${
          isMonochrome ? 'bg-zinc-950 border-zinc-800' : 'bg-[#090D16] border-[#172033]'
        }`}>
          <div className={`flex items-center gap-2 border-b pb-3 ${
            isMonochrome ? 'border-zinc-800' : 'border-[#172033]'
          }`}>
            <Zap className={`w-4 h-4 ${isMonochrome ? 'text-white' : 'text-orange-400'}`} />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              10-Minute SLA &amp; Dispatch Rules
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">
                Target Delivery SLA (Minutes)
              </label>
              <input
                type="number"
                value={settings.targetDeliveryMinutes}
                onChange={(e) =>
                  updateSettings({ targetDeliveryMinutes: Number(e.target.value) })
                }
                className={`w-full p-2.5 rounded-lg text-xs font-mono-numbers text-white focus:outline-none border ${
                  isMonochrome
                    ? 'bg-black border-zinc-700 focus:border-white'
                    : 'bg-black border-[#172033] focus:border-orange-500'
                }`}
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">
                Maximum Dark Store Delivery Radius (km)
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.deliveryRadiusKm}
                onChange={(e) =>
                  updateSettings({ deliveryRadiusKm: Number(e.target.value) })
                }
                className={`w-full p-2.5 rounded-lg text-xs font-mono-numbers text-white focus:outline-none border ${
                  isMonochrome
                    ? 'bg-black border-zinc-700 focus:border-white'
                    : 'bg-black border-[#172033] focus:border-orange-500'
                }`}
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">
                Base Delivery Fee (₹)
              </label>
              <input
                type="number"
                value={settings.baseDeliveryFee}
                onChange={(e) =>
                  updateSettings({ baseDeliveryFee: Number(e.target.value) })
                }
                className={`w-full p-2.5 rounded-lg text-xs font-mono-numbers text-white focus:outline-none border ${
                  isMonochrome
                    ? 'bg-black border-zinc-700 focus:border-white'
                    : 'bg-black border-[#172033] focus:border-orange-500'
                }`}
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 block mb-1">
                Free Delivery Cart Threshold (₹)
              </label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={(e) =>
                  updateSettings({ freeDeliveryThreshold: Number(e.target.value) })
                }
                className={`w-full p-2.5 rounded-lg text-xs font-mono-numbers text-white focus:outline-none border ${
                  isMonochrome
                    ? 'bg-black border-zinc-700 focus:border-white'
                    : 'bg-black border-[#172033] focus:border-orange-500'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Automation & Dispatch Logic */}
        <div className={`p-5 rounded-2xl border shadow-xl space-y-4 ${
          isMonochrome ? 'bg-zinc-950 border-zinc-800' : 'bg-[#090D16] border-[#172033]'
        }`}>
          <div className={`flex items-center gap-2 border-b pb-3 ${
            isMonochrome ? 'border-zinc-800' : 'border-[#172033]'
          }`}>
            <Truck className={`w-4 h-4 ${isMonochrome ? 'text-white' : 'text-blue-400'}`} />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Autonomous Dispatch &amp; Simulation Engine
            </h3>
          </div>

          <div className="space-y-3">
            <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
              isMonochrome ? 'bg-black border-zinc-800' : 'bg-black/60 border-[#172033]'
            }`}>
              <div>
                <span className="text-xs font-semibold text-white block">
                  Smart Auto-Dispatch Rider Allocation
                </span>
                <span className="text-[11px] text-zinc-400">
                  Automatically pairs nearest available rider with ready packed orders
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoAssignRiderEnabled}
                onChange={(e) =>
                  updateSettings({ autoAssignRiderEnabled: e.target.checked })
                }
                className="w-4 h-4 rounded cursor-pointer accent-white"
              />
            </label>

            <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
              isMonochrome ? 'bg-black border-zinc-800' : 'bg-black/60 border-[#172033]'
            }`}>
              <div>
                <span className="text-xs font-semibold text-white block">
                  Live Quick-Commerce Order Simulation
                </span>
                <span className="text-[11px] text-zinc-400">
                  Automatically moves in-flight orders along the 10-minute pipeline every 15s
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.liveSimulationActive}
                onChange={(e) =>
                  updateSettings({ liveSimulationActive: e.target.checked })
                }
                className="w-4 h-4 rounded cursor-pointer accent-white"
              />
            </label>

            <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
              isMonochrome ? 'bg-black border-zinc-800' : 'bg-black/60 border-[#172033]'
            }`}>
              <div>
                <span className="text-xs font-semibold text-white block">
                  Tactile Audio Notifications (Synthesized Web Audio)
                </span>
                <span className="text-[11px] text-zinc-400">
                  Chimes for new orders, completion alerts &amp; delayed orders
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.soundAlertsEnabled}
                onChange={(e) =>
                  updateSettings({ soundAlertsEnabled: e.target.checked })
                }
                className="w-4 h-4 rounded cursor-pointer accent-white"
              />
            </label>
          </div>
        </div>

        {/* Section 3: Reset Demo Data */}
        <div className={`p-5 rounded-2xl border shadow-xl space-y-3 ${
          isMonochrome ? 'bg-zinc-950 border-zinc-800' : 'bg-[#090D16] border-[#172033]'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-zinc-400" />
                <span>Reset Demo System State</span>
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Restores original seeded Indian quick-commerce orders, products, and rider fleet.
              </p>
            </div>
            {confirmReset ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs cursor-pointer hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetDemoData();
                    setConfirmReset(false);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-white text-black hover:bg-zinc-200 text-xs font-bold cursor-pointer"
                >
                  Yes, Reset Everything
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                  isMonochrome
                    ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700'
                    : 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border-rose-500/40'
                }`}
              >
                Reset All Demo Data
              </button>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className={`px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-lg cursor-pointer active:scale-95 transition-all ${
              isMonochrome
                ? 'bg-white hover:bg-zinc-200 text-black border border-white'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black shadow-orange-500/20'
            }`}
          >
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
};
