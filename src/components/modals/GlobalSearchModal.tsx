import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, ShoppingCart, Package, Users, Store, Bike, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isGlobalSearchOpen,
    closeGlobalSearch,
    searchOriginSection,
    orders,
    products,
    customers,
    stores,
    riders,
    setSelectedOrderDetailId,
    setActiveSection,
    settings,
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isDark = settings.themeMode === 'dark' || settings.themeMode === 'black-white';

  useEffect(() => {
    if (isGlobalSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isGlobalSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isGlobalSearchOpen) {
        closeGlobalSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, closeGlobalSearch]);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase().trim();

    const matchingOrders = orders
      .filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          o.transactionId.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const matchingProducts = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const matchingCustomers = customers
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q)
      )
      .slice(0, 3);

    const matchingStores = stores
      .filter((s) => s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q))
      .slice(0, 2);

    const matchingRiders = riders
      .filter((r) => r.name.toLowerCase().includes(q) || r.phone.includes(q))
      .slice(0, 3);

    return {
      orders: matchingOrders,
      products: matchingProducts,
      customers: matchingCustomers,
      stores: matchingStores,
      riders: matchingRiders,
      totalCount:
        matchingOrders.length +
        matchingProducts.length +
        matchingCustomers.length +
        matchingStores.length +
        matchingRiders.length,
    };
  }, [query, orders, products, customers, stores, riders]);

  if (!isGlobalSearchOpen) return null;

  return (
    <div
      onMouseDown={(e) => {
        // When clicking outside the search card, immediately close and return to the originating view
        if (e.target === e.currentTarget) {
          e.preventDefault();
          e.stopPropagation();
          closeGlobalSearch();
        }
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
          e.stopPropagation();
          closeGlobalSearch();
        }
      }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4 bg-black/85 backdrop-blur-md cursor-pointer select-none animate-in fade-in duration-150"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col cursor-default border transition-all ${
          isDark
            ? 'bg-[#090D16] border-[#1E293B] text-slate-100 shadow-black'
            : 'bg-white border-slate-200 text-slate-800 shadow-2xl'
        }`}
      >
        {/* Originating Page Indicator Bar */}
        <div className={`px-4 py-2 border-b flex items-center justify-between text-xs ${
          isDark
            ? 'bg-[#070A12] border-[#172033] text-slate-400'
            : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          <div className="flex items-center gap-1.5">
            <span>Searching from:</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
              isDark
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                : 'bg-orange-50 text-orange-600 border border-orange-200'
            }`}>
              {searchOriginSection}
            </span>
          </div>

          <button
            onClick={closeGlobalSearch}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#131C2E] hover:bg-[#1F2C46] text-slate-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
            title={`Close and return to ${searchOriginSection}`}
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
            <span>Return to {searchOriginSection} (Esc)</span>
          </button>
        </div>

        {/* Search Input Bar */}
        <div className={`p-4 border-b flex items-center gap-3 ${
          isDark ? 'border-[#172033] bg-[#0B0F19]' : 'border-slate-200 bg-white'
        }`}>
          <Search className={`w-5 h-5 shrink-0 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order #10245, customer name, mobile, product, SKU, dark store..."
            className={`flex-1 bg-transparent text-sm focus:outline-none ${
              isDark ? 'text-slate-100 placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
            }`}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className={`p-1 cursor-pointer ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-700'}`}
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={closeGlobalSearch}
            className={`p-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              isDark
                ? 'bg-[#131C2E] hover:bg-[#1F2C46] text-slate-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results View */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query.trim() && (
            <div className={`py-8 text-center text-xs ${isMonochrome ? 'text-zinc-400' : 'text-slate-400'}`}>
              <p className={`font-bold mb-1 text-sm ${isMonochrome ? 'text-white' : 'text-slate-200'}`}>
                ZynexCart Global Search
              </p>
              <p>Type an order ID (e.g. 10245), customer phone, product name, or SKU to jump directly.</p>
              <p className="mt-2 text-[11px] text-zinc-500">
                Clicking outside the modal card or pressing ESC will return you directly to the <strong>{searchOriginSection}</strong> page.
              </p>
            </div>
          )}

          {results && results.totalCount === 0 && (
            <div className={`py-8 text-center text-xs ${isMonochrome ? 'text-zinc-400' : 'text-slate-400'}`}>
              No results found matching &quot;{query}&quot;.
            </div>
          )}

          {/* Orders Match */}
          {results && results.orders.length > 0 && (
            <div>
              <div className={`text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <ShoppingCart className="w-3.5 h-3.5 text-orange-500" />
                <span>Orders ({results.orders.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.orders.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setSelectedOrderDetailId(o.id);
                      closeGlobalSearch();
                    }}
                    className={`w-full text-left p-2.5 rounded-lg border flex items-center justify-between transition-colors cursor-pointer group ${
                      isDark
                        ? 'bg-[#0E1524]/60 hover:bg-[#131C2E] border-[#172033]'
                        : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono-numbers font-bold text-xs ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                          {o.id}
                        </span>
                        <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{o.customerName}</span>
                        <span className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>· {o.customerPhone}</span>
                      </div>
                      <div className={`text-[11px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        {o.items.length} items · ₹{o.totalAmount} · Status: <span className={isDark ? 'text-zinc-200 font-medium' : 'text-slate-800 font-medium'}>{o.status}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products Match */}
          {results && results.products.length > 0 && (
            <div>
              <div className={`text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <Package className="w-3.5 h-3.5 text-blue-500" />
                <span>Products ({results.products.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveSection('products');
                      closeGlobalSearch();
                    }}
                    className={`w-full text-left p-2.5 rounded-lg border flex items-center justify-between transition-colors cursor-pointer group ${
                      isDark
                        ? 'bg-[#0E1524]/60 hover:bg-[#131C2E] border-[#172033]'
                        : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{p.name}</span>
                        <span className={`text-[10px] font-mono-numbers ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>SKU: {p.sku}</span>
                      </div>
                      <div className={`text-[11px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        ₹{p.price} (MRP ₹{p.mrp}) · Stock: <span className={p.stock <= p.lowStockThreshold ? (isDark ? 'text-rose-400 font-bold' : 'text-rose-600 font-bold') : (isDark ? 'text-zinc-300' : 'text-slate-700')}>{p.stock}</span> · {p.category}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customers Match */}
          {results && results.customers.length > 0 && (
            <div>
              <div className={`text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <Users className="w-3.5 h-3.5 text-orange-400" />
                <span>Customers ({results.customers.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.customers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveSection('customers');
                      closeGlobalSearch();
                    }}
                    className={`w-full text-left p-2.5 rounded-lg border flex items-center justify-between transition-colors cursor-pointer group ${
                      isDark
                        ? 'bg-[#0E1524]/60 hover:bg-[#131C2E] border-[#172033]'
                        : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{c.name}</span>
                        <span className={`text-[10px] font-mono-numbers ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>{c.phone}</span>
                      </div>
                      <div className={`text-[11px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        {c.totalOrders} total orders · Spent ₹{c.totalSpent.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dark Stores / Riders Match */}
          {results && (results.stores.length > 0 || results.riders.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.stores.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection('stores');
                    closeGlobalSearch();
                  }}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                    isDark
                      ? 'bg-[#0E1524]/60 hover:bg-[#131C2E] border-[#172033]'
                      : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className={`flex items-center gap-1.5 text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Store className="w-3.5 h-3.5 text-blue-500" />
                    <span>{s.name}</span>
                  </div>
                  <div className={`text-[10px] mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    {s.city} · {s.activeOrdersCount} live orders
                  </div>
                </button>
              ))}

              {results.riders.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setActiveSection('riders');
                    closeGlobalSearch();
                  }}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                    isDark
                      ? 'bg-[#0E1524]/60 hover:bg-[#131C2E] border-[#172033]'
                      : 'bg-slate-50/80 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className={`flex items-center gap-1.5 text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Bike className="w-3.5 h-3.5 text-blue-500" />
                    <span>{r.name}</span>
                  </div>
                  <div className={`text-[10px] mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    Status: {r.status} · {r.completedDeliveriesToday} deliveries today
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className={`p-3 border-t flex items-center justify-between text-[11px] ${
          isDark
            ? 'bg-[#070A12] border-[#172033] text-slate-400'
            : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          <span>Click outside anywhere to return to <strong>{searchOriginSection}</strong></span>
          <span className="font-mono-numbers">ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
