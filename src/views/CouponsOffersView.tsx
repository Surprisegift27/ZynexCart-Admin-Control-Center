import React, { useState } from 'react';
import { Ticket, Flame, Plus, Check, Trash2, Calendar, Tag, Percent } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CouponsOffersView: React.FC = () => {
  const {
    coupons,
    toggleCouponActive,
    deleteCoupon,
    offers,
    toggleOfferActive,
    setIsQuickActionOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'coupons' | 'offers'>('coupons');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Marketing Promotions: Coupons &amp; Offers</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure checkout discount promo codes and dynamic storefront lightning deals
          </p>
        </div>

        <button
          onClick={() => setIsQuickActionOpen(true)}
          className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{activeTab === 'coupons' ? 'Create Coupon' : 'Create Offer'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('coupons')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'coupons'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Promo Coupons ({coupons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'offers'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Store Deals &amp; BOGO Offers ({offers.length})</span>
        </button>
      </div>

      {/* 1. Coupons View */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map((cpn) => {
            const usagePercent = Math.min(
              100,
              Math.round((cpn.usedCount / cpn.totalUsageLimit) * 100)
            );

            return (
              <div
                key={cpn.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono-numbers font-extrabold text-sm text-amber-400 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      {cpn.code}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCouponActive(cpn.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          cpn.isActive
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {cpn.isActive ? 'Active' : 'Disabled'}
                      </button>
                      <button
                        onClick={() => deleteCoupon(cpn.id)}
                        className="text-slate-400 hover:text-rose-400 p-1 cursor-pointer"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 font-medium">{cpn.description}</p>

                  <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Discount</span>
                      <strong className="text-white font-mono-numbers">
                        {cpn.discountType === 'Flat' ? `₹${cpn.discountValue} OFF` : `${cpn.discountValue}% OFF`}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Min Basket Value</span>
                      <strong className="text-white font-mono-numbers">₹{cpn.minOrderValue}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Max Discount Cap</span>
                      <strong className="text-white font-mono-numbers">₹{cpn.maxDiscountCap}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Per User Limit</span>
                      <strong className="text-white font-mono-numbers">{cpn.perUserLimit} order(s)</strong>
                    </div>
                  </div>

                  {/* Usage Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Redemption Usage</span>
                      <span className="font-mono-numbers">
                        {cpn.usedCount} / {cpn.totalUsageLimit} ({usagePercent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-mono-numbers">
                    <Calendar className="w-3 h-3" /> Valid till {cpn.expiryDate}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Offers View */}
      {activeTab === 'offers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offers.map((off) => (
            <div
              key={off.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {off.discountTag}
                  </span>
                  <button
                    onClick={() => toggleOfferActive(off.id)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      off.isActive
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {off.isActive ? 'Active on App' : 'Paused'}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-white mt-2">{off.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{off.description}</p>

                <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <span className="text-[10px] text-slate-400 block">Offer Structure</span>
                  <strong className="text-emerald-400">{off.type} Mechanism</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono-numbers">
                Running active campaign
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
