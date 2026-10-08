import React, { useState } from 'react';
import { Search, User, Phone, Mail, MapPin, ShoppingCart, Award, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';

export const CustomersView: React.FC = () => {
  const { customers, orders } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Customer Directory &amp; Lifetime Value</span>
            <span className="text-xs font-mono-numbers px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
              {customers.length} Profiles
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Spending history · Saved delivery addresses · Quick commerce loyalty
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer by name, mobile number or email..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-3">Phone</th>
                <th className="py-3.5 px-3 text-right">Total Orders</th>
                <th className="py-3.5 px-3 text-right">Total Spent (₹)</th>
                <th className="py-3.5 px-3 text-right">Avg Order Value</th>
                <th className="py-3.5 px-3">Account Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {cust.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white">{cust.name}</span>
                          {cust.isVip && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                              VIP
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{cust.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono-numbers text-slate-300 text-xs">
                    {cust.phone}
                  </td>

                  <td className="py-3 px-3 text-right font-mono-numbers font-bold text-white">
                    {cust.totalOrders}
                  </td>

                  <td className="py-3 px-3 text-right font-mono-numbers font-bold text-emerald-400">
                    ₹{cust.totalSpent.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-3 text-right font-mono-numbers text-slate-300">
                    ₹{cust.averageOrderValue}
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {cust.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedCustomer.name}</h3>
                  <span className="text-xs text-slate-400">Member since {selectedCustomer.registeredDate}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2.5 text-center bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 block">Total Orders</span>
                <strong className="text-sm font-mono-numbers text-white">{selectedCustomer.totalOrders}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Lifetime Spend</span>
                <strong className="text-sm font-mono-numbers text-emerald-400">
                  ₹{selectedCustomer.totalSpent.toLocaleString('en-IN')}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Average Basket</span>
                <strong className="text-sm font-mono-numbers text-white">
                  ₹{selectedCustomer.averageOrderValue}
                </strong>
              </div>
            </div>

            {/* Saved Addresses */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Saved Delivery Addresses
              </span>
              <div className="space-y-2">
                {selectedCustomer.addresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-start gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white">{addr.label}</span>
                      <p className="text-slate-300 text-[11px] mt-0.5">{addr.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
