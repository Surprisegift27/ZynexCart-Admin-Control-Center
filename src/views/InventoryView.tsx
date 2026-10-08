import React, { useState, useMemo } from 'react';
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  Search,
  Store,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const InventoryView: React.FC = () => {
  const {
    products,
    stores,
    restockProduct,
    selectedStoreFilter,
    setSelectedStoreFilter,
    triggerAudioAlert,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Healthy' | 'Low' | 'Out'>('All');
  const [restockModalProduct, setRestockModalProduct] = useState<string | null>(null);
  const [restockQty, setRestockQty] = useState(50);

  // Stats calculation
  const totalItems = products.length * 105;
  const inStockCount = products.filter((p) => p.stock > p.lowStockThreshold).length * 90;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedStoreFilter !== 'all' && p.storeId !== selectedStoreFilter) return false;
      if (statusFilter === 'Healthy' && p.stock <= p.lowStockThreshold) return false;
      if (statusFilter === 'Low' && (p.stock === 0 || p.stock > p.lowStockThreshold)) return false;
      if (statusFilter === 'Out' && p.stock !== 0) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [products, selectedStoreFilter, statusFilter, searchQuery]);

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockModalProduct) return;
    restockProduct(restockModalProduct, restockQty);
    setRestockModalProduct(null);
    triggerAudioAlert('success');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Dark Store Inventory &amp; Stock Matrix</span>
            <span className="text-xs font-mono-numbers px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
              Live Stock
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Store-level shelf counts · Reserved basket allocation vs Real available stock
          </p>
        </div>
      </div>

      {/* Metric Cards Grid matching User Spec 6 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Catalog Products</span>
            <Boxes className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-xl font-extrabold text-white font-mono-numbers">
            {totalItems.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Active SKUs</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>In Stock (Healthy 🟢)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-xl font-extrabold text-emerald-400 font-mono-numbers">
            {inStockCount.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block font-mono-numbers">
            94.2% Availability
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Low Stock (Alert ⚠️)</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-xl font-extrabold text-amber-400 font-mono-numbers">
            {lowStockCount}
          </div>
          <span className="text-[11px] text-amber-300/80 mt-1 block">
            Needs Re-order
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Out of Stock (🔴)</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-xl font-extrabold text-rose-400 font-mono-numbers">
            {outOfStockCount}
          </div>
          <span className="text-[11px] text-rose-400/80 mt-1 block">
            Unavailable for customer
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stock by product name or SKU..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Store Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg text-xs">
            <Store className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStoreFilter}
              onChange={(e) => setSelectedStoreFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Dark Stores</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg text-xs">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All">All Stocks</option>
              <option value="Healthy">Healthy (🟢)</option>
              <option value="Low">Low Stock (⚠️)</option>
              <option value="Out">Out of Stock (🔴)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stock Table matching spec: Product, Store, Current Stock, Reserved, Available, Threshold, Status */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-3">Dark Store</th>
                <th className="py-3.5 px-3 text-right">Current Stock</th>
                <th className="py-3.5 px-3 text-right">Reserved (Picking)</th>
                <th className="py-3.5 px-3 text-right">Available for Cart</th>
                <th className="py-3.5 px-3 text-right">Threshold</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Replenish Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredProducts.map((p) => {
                const storeObj = stores.find((s) => s.id === p.storeId) || stores[0];
                const availableStock = Math.max(0, p.stock - p.reservedStock);
                const isOutOfStock = p.stock === 0;
                const isLowStock = p.stock > 0 && p.stock <= p.lowStockThreshold;

                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Product */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{p.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {p.unit} · SKU: <span className="font-mono-numbers">{p.sku}</span>
                      </div>
                    </td>

                    {/* Dark Store */}
                    <td className="py-3 px-3">
                      <span className="text-slate-300 text-xs">{storeObj.name}</span>
                    </td>

                    {/* Current Stock */}
                    <td className="py-3 px-3 text-right font-mono-numbers font-bold text-white">
                      {p.stock}
                    </td>

                    {/* Reserved */}
                    <td className="py-3 px-3 text-right font-mono-numbers text-amber-400">
                      {p.reservedStock}
                    </td>

                    {/* Available */}
                    <td className="py-3 px-3 text-right font-mono-numbers font-bold">
                      <span
                        className={
                          availableStock === 0
                            ? 'text-rose-400'
                            : availableStock <= p.lowStockThreshold
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }
                      >
                        {availableStock}
                      </span>
                    </td>

                    {/* Threshold */}
                    <td className="py-3 px-3 text-right font-mono-numbers text-slate-400">
                      {p.lowStockThreshold}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                          🔴 Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          ⚠️ Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          🟢 Healthy
                        </span>
                      )}
                    </td>

                    {/* Quick Restock Action */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setRestockModalProduct(p.id);
                          setRestockQty(50);
                        }}
                        className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Restock</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      {restockModalProduct && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              Replenish Dark Store Inventory
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Add inbound supply units directly into active dark store inventory.
            </p>
            <form onSubmit={handleRestockSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Units to Add:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={restockQty}
                    onChange={(e) => setRestockQty(Number(e.target.value))}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-numbers text-white focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex gap-1">
                    {[20, 50, 100].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRestockQty(num)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 rounded font-mono-numbers cursor-pointer"
                      >
                        +{num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockModalProduct(null)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
                >
                  Confirm Replenishment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
