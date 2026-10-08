import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Package,
  Layers,
  ArrowUpDown,
  AlertTriangle,
  Upload,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const ProductsView: React.FC = () => {
  const {
    products,
    categories,
    quickEditProduct,
    deleteProduct,
    updateProduct,
    setIsQuickActionOpen,
    triggerAudioAlert,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<'All' | 'Low' | 'OutOfStock' | 'InStock'>('All');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // In-line quick edit state
  const [inlinePrice, setInlinePrice] = useState<{ [id: string]: number }>({});
  const [inlineStock, setInlineStock] = useState<{ [id: string]: number }>({});

  // Full Edit Product Modal State
  const [fullEditProduct, setFullEditProduct] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (stockFilter === 'Low' && (p.stock === 0 || p.stock > p.lowStockThreshold)) return false;
      if (stockFilter === 'OutOfStock' && p.stock !== 0) return false;
      if (stockFilter === 'InStock' && p.stock <= p.lowStockThreshold) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [products, selectedCategory, stockFilter, searchQuery]);

  const handleSaveInline = (id: string) => {
    const changes: Partial<Product> = {};
    if (inlinePrice[id] !== undefined) changes.price = inlinePrice[id];
    if (inlineStock[id] !== undefined) changes.stock = inlineStock[id];
    quickEditProduct(id, changes);
    setEditingProductId(null);
    triggerAudioAlert('success');
  };

  const handleFullEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullEditProduct) return;
    updateProduct(fullEditProduct);
    setFullEditProduct(null);
    triggerAudioAlert('success');
  };

  return (
    <div className="space-y-4">
      {/* Header with Title and Add Product */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Dynamic Catalog &amp; Products</span>
            <span className="text-xs font-mono-numbers px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
              {filteredProducts.length} items
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time catalog pricing &amp; stock sync · In-line Quick Edit enabled
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsQuickActionOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, brand or SKU code..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2.5 py-1.5 rounded-lg text-xs">
            <span className="text-slate-400">Stock Status:</span>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All">All Stocks</option>
              <option value="InStock">Healthy Stock (🟢)</option>
              <option value="Low">Low Stock Alert (⚠️)</option>
              <option value="OutOfStock">Out of Stock (🔴)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table with Quick Edit In-line */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Item Details</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">SKU</th>
                <th className="py-3.5 px-3">Price ₹ (Quick Edit ✏️)</th>
                <th className="py-3.5 px-3">MRP</th>
                <th className="py-3.5 px-3">Stock (Quick Edit ✏️)</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-slate-400">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isEditing = editingProductId === product.id;
                  const currentP =
                    inlinePrice[product.id] !== undefined
                      ? inlinePrice[product.id]
                      : product.price;
                  const currentS =
                    inlineStock[product.id] !== undefined
                      ? inlineStock[product.id]
                      : product.stock;

                  return (
                    <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Product Name & Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-700/60"
                          />
                          <div className="min-w-0 max-w-[240px]">
                            <p className="font-bold text-white truncate">{product.name}</p>
                            <span className="text-[11px] text-slate-400">
                              Unit: {product.unit}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="text-slate-300 text-xs">{product.category}</span>
                        <span className="text-[10px] text-slate-400 block">{product.subcategory}</span>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-3">
                        <span className="font-mono-numbers text-[11px] text-slate-400">
                          {product.sku}
                        </span>
                      </td>

                      {/* Quick Edit Price */}
                      <td className="py-3 px-3">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <span className="text-slate-400 font-mono-numbers">₹</span>
                            <input
                              type="number"
                              value={currentP}
                              onChange={(e) =>
                                setInlinePrice({
                                  ...inlinePrice,
                                  [product.id]: Number(e.target.value),
                                })
                              }
                              className="w-18 p-1 bg-slate-950 border border-emerald-500 rounded text-xs font-mono-numbers text-white focus:outline-none"
                            />
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingProductId(product.id);
                              setInlinePrice({ ...inlinePrice, [product.id]: product.price });
                              setInlineStock({ ...inlineStock, [product.id]: product.stock });
                            }}
                            className="group flex items-center gap-1.5 hover:text-emerald-400 cursor-pointer"
                            title="Click to Quick Edit Price"
                          >
                            <span className="font-mono-numbers font-bold text-white text-xs">
                              ₹{product.price}
                            </span>
                            <Edit2 className="w-3 h-3 text-slate-400 opacity-60 group-hover:opacity-100 group-hover:text-emerald-400" />
                          </button>
                        )}
                      </td>

                      {/* MRP */}
                      <td className="py-3 px-3 font-mono-numbers text-slate-400 text-xs">
                        ₹{product.mrp}
                      </td>

                      {/* Quick Edit Stock */}
                      <td className="py-3 px-3">
                        {isEditing ? (
                          <input
                            type="number"
                            value={currentS}
                            onChange={(e) =>
                              setInlineStock({
                                ...inlineStock,
                                [product.id]: Number(e.target.value),
                              })
                            }
                            className="w-18 p-1 bg-slate-950 border border-emerald-500 rounded text-xs font-mono-numbers text-white focus:outline-none"
                          />
                        ) : (
                          <button
                            onClick={() => {
                              setEditingProductId(product.id);
                              setInlinePrice({ ...inlinePrice, [product.id]: product.price });
                              setInlineStock({ ...inlineStock, [product.id]: product.stock });
                            }}
                            className="group flex items-center gap-1.5 cursor-pointer"
                            title="Click to Quick Edit Stock"
                          >
                            <span
                              className={`font-mono-numbers font-bold text-xs ${
                                product.stock === 0
                                  ? 'text-rose-400'
                                  : product.stock <= product.lowStockThreshold
                                  ? 'text-amber-400'
                                  : 'text-slate-200'
                              }`}
                            >
                              {product.stock}
                            </span>
                            {product.stock <= product.lowStockThreshold && (
                              <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                            )}
                            <Edit2 className="w-3 h-3 text-slate-400 opacity-60 group-hover:opacity-100 group-hover:text-emerald-400" />
                          </button>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() =>
                            quickEditProduct(product.id, { isActive: !product.isActive })
                          }
                          className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                            product.isActive
                              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveInline(product.id)}
                                className="p-1 rounded bg-emerald-500 text-slate-950 hover:bg-emerald-400 cursor-pointer"
                                title="Save quick changes"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingProductId(null)}
                                className="p-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setFullEditProduct(product)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                                title="Edit Full Details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteProduct(product.id)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Edit Modal */}
      {fullEditProduct && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Edit Product Details</h3>
            <form onSubmit={handleFullEditSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Product Name</label>
                <input
                  type="text"
                  value={fullEditProduct.name}
                  onChange={(e) =>
                    setFullEditProduct({ ...fullEditProduct, name: e.target.value })
                  }
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={fullEditProduct.price}
                    onChange={(e) =>
                      setFullEditProduct({ ...fullEditProduct, price: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-numbers text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={fullEditProduct.mrp}
                    onChange={(e) =>
                      setFullEditProduct({ ...fullEditProduct, mrp: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-numbers text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={fullEditProduct.stock}
                    onChange={(e) =>
                      setFullEditProduct({ ...fullEditProduct, stock: Number(e.target.value) })
                    }
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-numbers text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Low Stock Threshold</label>
                  <input
                    type="number"
                    value={fullEditProduct.lowStockThreshold}
                    onChange={(e) =>
                      setFullEditProduct({
                        ...fullEditProduct,
                        lowStockThreshold: Number(e.target.value),
                      })
                    }
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono-numbers text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={fullEditProduct.image}
                  onChange={(e) =>
                    setFullEditProduct({ ...fullEditProduct, image: e.target.value })
                  }
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setFullEditProduct(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
