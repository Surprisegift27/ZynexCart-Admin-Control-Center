import React, { useState } from 'react';
import { X, Package, Ticket, Store, Bike, Flame, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickActionModal: React.FC = () => {
  const {
    isQuickActionOpen,
    setIsQuickActionOpen,
    addProduct,
    addCoupon,
    addStore,
    addRider,
    addOffer,
    categories,
    stores,
    triggerAudioAlert,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'product' | 'coupon' | 'store' | 'rider' | 'offer'>('product');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    category: categories[0]?.name || 'Dairy, Bread & Eggs',
    subcategory: 'Milk & Cream',
    description: '',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
    unit: '500g',
    price: 45,
    mrp: 50,
    discountPercentage: 10,
    sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
    isActive: true,
    stock: 50,
    reservedStock: 0,
    lowStockThreshold: 15,
    storeId: stores[0]?.id || 'store-01',
    isVeg: true,
  });

  const [couponForm, setCouponForm] = useState({
    code: '',
    description: '',
    discountType: 'Percentage' as 'Percentage' | 'Flat',
    discountValue: 20,
    minOrderValue: 299,
    maxDiscountCap: 100,
    totalUsageLimit: 1000,
    perUserLimit: 1,
    startDate: '2025-01-01',
    expiryDate: '2026-12-31',
    isActive: true,
  });

  const [storeForm, setStoreForm] = useState({
    name: '',
    code: '',
    address: '',
    city: 'Mumbai',
    phone: '+91 98200 99887',
    operatingHours: '06:00 AM - 01:00 AM',
    radiusKm: 3.5,
    isActive: true,
    pickersCount: 4,
    packersCount: 3,
    ridersCount: 10,
    healthScore: 95,
    coordinates: { lat: 19.076, lng: 72.8777 },
  });

  const [riderForm, setRiderForm] = useState({
    name: '',
    phone: '',
    status: 'Available' as const,
    rating: 4.8,
    vehicleType: 'EV Bike' as const,
    batteryOrFuelPercent: 90,
    cancellationRate: 1.0,
    currentLocationName: 'Dark Store Hub (Gate 1)',
    kycVerified: true,
    joinedDate: 'Today',
  });

  const [offerForm, setOfferForm] = useState({
    title: '',
    type: 'Buy2Save' as const,
    description: '',
    discountTag: 'SAVE ₹50',
    badgeColor: 'emerald',
    isActive: true,
    startDate: '2025-01-01',
    endDate: '2026-12-31',
  });

  if (!isQuickActionOpen) return null;

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name) return;
    addProduct(productForm);
    setSuccessMsg('Product added successfully to catalog!');
    triggerAudioAlert('success');
    setTimeout(() => {
      setSuccessMsg('');
      setIsQuickActionOpen(false);
    }, 1200);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code) return;
    addCoupon(couponForm);
    setSuccessMsg('Coupon created successfully!');
    triggerAudioAlert('success');
    setTimeout(() => {
      setSuccessMsg('');
      setIsQuickActionOpen(false);
    }, 1200);
  };

  const handleStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeForm.name) return;
    addStore(storeForm);
    setSuccessMsg('Dark Store provisioned!');
    triggerAudioAlert('success');
    setTimeout(() => {
      setSuccessMsg('');
      setIsQuickActionOpen(false);
    }, 1200);
  };

  const handleRiderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!riderForm.name) return;
    addRider(riderForm);
    setSuccessMsg('Rider onboarded to fleet!');
    triggerAudioAlert('success');
    setTimeout(() => {
      setSuccessMsg('');
      setIsQuickActionOpen(false);
    }, 1200);
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerForm.title) return;
    addOffer(offerForm);
    setSuccessMsg('Promotional offer created!');
    triggerAudioAlert('success');
    setTimeout(() => {
      setSuccessMsg('');
      setIsQuickActionOpen(false);
    }, 1200);
  };

  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setIsQuickActionOpen(false);
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsQuickActionOpen(false);
      }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#090D16] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] cursor-default"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#172033] bg-[#070A12] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-orange-400">⚡</span> Quick Actions Center
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Rapid operational changes in 1-2 clicks</p>
          </div>
          <button
            onClick={() => setIsQuickActionOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Tabs */}
        <div className="flex border-b border-[#172033] bg-black/50 overflow-x-auto p-1.5 gap-1">
          <button
            onClick={() => setActiveTab('product')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'product'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-orange-400" />
            <span>Add Product</span>
          </button>

          <button
            onClick={() => setActiveTab('coupon')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'coupon'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Ticket className="w-3.5 h-3.5 text-blue-400" />
            <span>Create Coupon</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'store'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-orange-400" />
            <span>Add Dark Store</span>
          </button>

          <button
            onClick={() => setActiveTab('rider')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'rider'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>Onboard Rider</span>
          </button>

          <button
            onClick={() => setActiveTab('offer')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'offer'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Create Offer</span>
          </button>
        </div>

        {/* Success toast inside modal */}
        {successMsg && (
          <div className="m-4 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab Form Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* 1. Add Product Form */}
          {activeTab === 'product' && (
            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-slate-400 block mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Amul Malai Paneer Block"
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Unit / Packaging</label>
                  <input
                    type="text"
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    placeholder="e.g. 200g, 1 Litre, Pack of 4"
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono-numbers text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">MRP Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.mrp}
                    onChange={(e) => setProductForm({ ...productForm, mrp: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono-numbers text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Initial Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono-numbers text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">SKU Identifier</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono-numbers text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuickActionOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  Save &amp; Publish Product
                </button>
              </div>
            </form>
          )}

          {/* 2. Create Coupon Form */}
          {activeTab === 'coupon' && (
            <form onSubmit={handleCouponSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FLASH50"
                    value={couponForm.code}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })
                    }
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono-numbers font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 uppercase"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Discount Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) =>
                      setCouponForm({
                        ...couponForm,
                        discountType: e.target.value as 'Percentage' | 'Flat',
                      })
                    }
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="Percentage">Percentage Discount (%)</option>
                    <option value="Flat">Flat Cash Off (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={couponForm.discountValue}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, discountValue: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono-numbers text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Minimum Order Value (₹)</label>
                  <input
                    type="number"
                    value={couponForm.minOrderValue}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, minOrderValue: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono-numbers text-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] text-slate-400 block mb-1">Offer Description</label>
                  <input
                    type="text"
                    placeholder="e.g. 20% off on all fresh fruits above ₹299"
                    value={couponForm.description}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, description: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuickActionOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          )}

          {/* 3. Add Store Form */}
          {activeTab === 'store' && (
            <form onSubmit={handleStoreSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-slate-400 block mb-1">Dark Store Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune Dark Store 05 - Koregaon Park"
                    value={storeForm.name}
                    onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Store Code</label>
                  <input
                    type="text"
                    placeholder="e.g. PUN-KOR-05"
                    value={storeForm.code}
                    onChange={(e) => setStoreForm({ ...storeForm, code: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono-numbers text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">City</label>
                  <input
                    type="text"
                    value={storeForm.city}
                    onChange={(e) => setStoreForm({ ...storeForm, city: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] text-slate-400 block mb-1">Physical Address</label>
                  <input
                    type="text"
                    placeholder="Unit 14, Industrial Galaxy, Lane 5"
                    value={storeForm.address}
                    onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Delivery Radius (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={storeForm.radiusKm}
                    onChange={(e) =>
                      setStoreForm({ ...storeForm, radiusKm: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono-numbers text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={storeForm.phone}
                    onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono-numbers text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuickActionOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs shadow-md shadow-indigo-500/20 cursor-pointer"
                >
                  Provision Dark Store
                </button>
              </div>
            </form>
          )}

          {/* 4. Onboard Rider Form */}
          {activeTab === 'rider' && (
            <form onSubmit={handleRiderSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Rider Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Manish Tiwari"
                    value={riderForm.name}
                    onChange={(e) => setRiderForm({ ...riderForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98200 12345"
                    value={riderForm.phone}
                    onChange={(e) => setRiderForm({ ...riderForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono-numbers text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Vehicle Type</label>
                  <select
                    value={riderForm.vehicleType}
                    onChange={(e) =>
                      setRiderForm({
                        ...riderForm,
                        vehicleType: e.target.value as any,
                      })
                    }
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="EV Bike">EV Bike (Eco High Speed)</option>
                    <option value="Electric Scooter">Electric Scooter</option>
                    <option value="Motorcycle">Motorcycle (Petrol)</option>
                    <option value="Bicycle">Bicycle (Hyper-local)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Battery / Fuel (%)</label>
                  <input
                    type="number"
                    value={riderForm.batteryOrFuelPercent}
                    onChange={(e) =>
                      setRiderForm({
                        ...riderForm,
                        batteryOrFuelPercent: Number(e.target.value),
                      })
                    }
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono-numbers text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuickActionOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  Onboard to Fleet
                </button>
              </div>
            </form>
          )}

          {/* 5. Create Offer Form */}
          {activeTab === 'offer' && (
            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[11px] text-slate-400 block mb-1">Offer Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flash Deal: 20% OFF on Exotic Cold Drinks"
                    value={offerForm.title}
                    onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Offer Mechanism</label>
                  <select
                    value={offerForm.type}
                    onChange={(e) =>
                      setOfferForm({ ...offerForm, type: e.target.value as any })
                    }
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                  >
                    <option value="BOGO">Buy 1 Get 1 Free (BOGO)</option>
                    <option value="Buy2Save">Buy 2 Save ₹50</option>
                    <option value="PercentageOff">Percentage Flat Off</option>
                    <option value="FlashSale">Flash Sale (Time-limited)</option>
                    <option value="Combo">Combo Meal / Pack</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. FLASH 25% OFF"
                    value={offerForm.discountTag}
                    onChange={(e) => setOfferForm({ ...offerForm, discountTag: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-amber-400 focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuickActionOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-md shadow-rose-500/20 cursor-pointer"
                >
                  Launch Offer
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
