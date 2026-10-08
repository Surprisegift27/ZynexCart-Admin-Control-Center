import React, { useState, useMemo } from 'react';
import {
  Plus,
  Layers,
  Search,
  Check,
  X,
  Tag,
  Eye,
  Settings,
  Code,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Category } from '../types';

export const CategoriesView: React.FC = () => {
  const { categories, addCategory, toggleCategoryActive, products, triggerAudioAlert } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'admin' | 'storefrontPreview'>('admin');
  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newSubcats, setNewSubcats] = useState('');

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q)) ||
          c.slug.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [categories, searchQuery]);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const subs = newSubcats
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addCategory({
      name: newCatName,
      slug,
      description: newCatDesc || 'Everyday essentials',
      image: `assets/categories/${slug}.jpg`,
      iconName: 'Package',
      isActive: true,
      order: categories.length + 1,
      subcategories: subs.length > 0 ? subs : ['General'],
    });

    setNewCatName('');
    setNewCatDesc('');
    setNewSubcats('');
    setShowAddForm(false);
    triggerAudioAlert('success');
  };

  const handleCopyCode = () => {
    const codeSnippet = `/* =========================================
   ZYNEXCART — CATEGORY DATA & RENDERER
   Public Integration API
========================================= */
const categories = ${JSON.stringify(
      categories.map((c) => ({
        id: c.id,
        name: c.name,
        image: c.image || `assets/categories/${c.slug}.jpg`,
        description: c.description || '',
      })),
      null,
      2
    )};`;

    navigator.clipboard?.writeText(codeSnippet);
    setCopiedCode(true);
    triggerAudioAlert('chime');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>ZynexCart Category Architecture</span>
            <span className="text-xs font-mono-numbers px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
              {categories.length} Official Categories
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            21 Quick-commerce departments · Customer website renderer &amp; catalog taxonomy sync
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('admin')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'admin'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Management</span>
            </button>
            <button
              onClick={() => setViewMode('storefrontPreview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'storefrontPreview'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Storefront Grid Preview</span>
            </button>
          </div>

          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            title="Export ZynexCart public categories array"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copiedCode ? 'Copied!' : 'Export API'}</span>
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Category</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories by name, slug or description..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>Active in API: <strong className="text-white font-mono-numbers">{categories.filter(c => c.isActive).length}</strong></span>
          <span>·</span>
          <span>Hidden: <strong className="text-white font-mono-numbers">{categories.filter(c => !c.isActive).length}</strong></span>
        </div>
      </div>

      {/* Add Category Drawer/Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreateCategory}
          className="p-4 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-xl space-y-3 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Create New Department / Category
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Category Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Gourmet &amp; Imported"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Description</label>
              <input
                type="text"
                placeholder="e.g. Premium chocolates &amp; imported treats"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Subcategories (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Imported Chips, Belgian Chocolates"
                value={newSubcats}
                onChange={(e) => setNewSubcats(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Publish Category
            </button>
          </div>
        </form>
      )}

      {/* 1. ADMIN MANAGEMENT VIEW */}
      {viewMode === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((cat, index) => {
            const liveCount = products.filter(
              (p) => p.category.toLowerCase() === cat.name.toLowerCase()
            ).length;

            return (
              <div
                key={cat.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-950 to-teal-900 border border-emerald-500/30 flex items-center justify-center font-bold text-xs text-emerald-400 shrink-0">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{cat.name}</h3>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{cat.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCategoryActive(cat.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors shrink-0 ${
                        cat.isActive
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {cat.isActive ? 'Active' : 'Hidden'}
                    </button>
                  </div>

                  {/* Subcategories Tags */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Subcategories ({cat.subcategories?.length || 0})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(cat.subcategories || ['General']).slice(0, 4).map((sub, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-medium flex items-center gap-1"
                        >
                          <Tag className="w-2.5 h-2.5 text-emerald-400" />
                          <span>{sub}</span>
                        </span>
                      ))}
                      {(cat.subcategories?.length || 0) > 4 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{cat.subcategories.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer info */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono-numbers">
                    ID: <strong className="text-slate-200">{cat.id}</strong>
                  </span>
                  <span className="font-mono-numbers text-emerald-400 font-semibold">
                    {liveCount || cat.productCount} SKUs
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. LIVE CUSTOMER STOREFRONT GRID PREVIEW (Matches user's exact renderCategories code) */}
      {viewMode === 'storefrontPreview' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>
                Simulated live preview of <code>renderCategories()</code> output on customer website grid.
              </span>
            </span>
            <span className="font-mono-numbers text-emerald-400">#categoriesGrid</span>
          </div>

          <div
            id="categoriesGrid"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5"
          >
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                data-category={cat.id}
                className="category-card p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between text-center group shadow-md"
              >
                <div className="category-image w-full aspect-square rounded-xl bg-gradient-to-tr from-slate-950 to-slate-800 flex items-center justify-center mb-2.5 overflow-hidden border border-slate-800/80 group-hover:scale-102 transition-transform">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg">
                    {cat.name.charAt(0)}
                  </div>
                </div>

                <div className="category-content">
                  <h3 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {cat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
