import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Check,
  X,
  Lock,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { rolePermissionsList } from '../data/initialData';
import { StaffRole } from '../types';

export const StaffRolesView: React.FC = () => {
  const { staff, currentStaff, setCurrentStaffId, stores } = useApp();
  const [selectedRole, setSelectedRole] = useState<StaffRole>('Super Admin');

  const roleMatrix =
    rolePermissionsList.find((r) => r.role === selectedRole) || rolePermissionsList[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Staff Management &amp; Role-Based Access Control (RBAC)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Principle of least privilege · Store managers, dispatchers &amp; support agents
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs">
          <span className="text-slate-400">Viewing as:</span>
          <select
            value={currentStaff.id}
            onChange={(e) => setCurrentStaffId(e.target.value)}
            className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer"
          >
            {staff.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Personnel Directory */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Active Staff Members ({staff.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {staff.map((member) => {
            const isCurrent = member.id === currentStaff.id;
            const assignedStore = stores.find((s) => s.id === member.storeId);

            return (
              <div
                key={member.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{member.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                    {member.role}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 mt-1.5 space-y-0.5">
                  <p>{member.email}</p>
                  <p className="font-mono-numbers">{member.phone}</p>
                  {assignedStore && (
                    <p className="text-slate-300">Hub: {assignedStore.name.replace('Dark Store ', '')}</p>
                  )}
                  <p className="text-[10px] text-slate-400 pt-1">Last Active: {member.lastLogin}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Granular Permission Matrix matching Spec 17 & 18 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Granular Permissions Matrix</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{roleMatrix.description}</p>
          </div>

          <div className="flex gap-1.5 overflow-x-auto">
            {rolePermissionsList.map((r) => (
              <button
                key={r.role}
                onClick={() => setSelectedRole(r.role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedRole === r.role
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {r.role}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Module / Entity</th>
                <th className="py-2.5 px-3 text-center">View</th>
                <th className="py-2.5 px-3 text-center">Create / Edit</th>
                <th className="py-2.5 px-3 text-center">Delete / Cancel</th>
                <th className="py-2.5 px-3 text-center">Approve / Refund</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {/* Orders */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-3 font-bold text-white">Orders &amp; Dispatch</td>
                <td className="py-3 px-3 text-center">
                  <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                </td>
                <td className="py-3 px-3 text-center">
                  {roleMatrix.permissions.orders.edit ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 mx-auto" />
                  )}
                </td>
                <td className="py-3 px-3 text-center">
                  {roleMatrix.permissions.orders.cancel ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 mx-auto" />
                  )}
                </td>
                <td className="py-3 px-3 text-center">
                  {roleMatrix.permissions.orders.refund ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 mx-auto" />
                  )}
                </td>
              </tr>

              {/* Products */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-3 font-bold text-white">Products &amp; Pricing</td>
                <td className="py-3 px-3 text-center">
                  <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                </td>
                <td className="py-3 px-3 text-center">
                  {roleMatrix.permissions.products.edit ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 mx-auto" />
                  )}
                </td>
                <td className="py-3 px-3 text-center">
                  {roleMatrix.permissions.products.delete ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 mx-auto" />
                  )}
                </td>
                <td className="py-3 px-3 text-center text-slate-400">—</td>
              </tr>

              {/* Inventory */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-3 font-bold text-white">Inventory &amp; Restock</td>
                <td className="py-3 px-3 text-center">
                  {roleMatrix.permissions.inventory.view ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 mx-auto" />
                  )}
                </td>
                <td className="py-3 px-3 text-center">
                  {roleMatrix.permissions.inventory.edit ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 mx-auto" />
                  )}
                </td>
                <td className="py-3 px-3 text-center text-slate-400">—</td>
                <td className="py-3 px-3 text-center">
                  {roleMatrix.permissions.inventory.restock ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 mx-auto" />
                  )}
                </td>
              </tr>

              {/* Fleet / Riders */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-3 font-bold text-white">Rider Fleet Dispatch</td>
                <td className="py-3 px-3 text-center">
                  {roleMatrix.permissions.riders.view ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 mx-auto" />
                  )}
                </td>
                <td className="py-3 px-3 text-center">
                  {roleMatrix.permissions.riders.assign ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 mx-auto" />
                  )}
                </td>
                <td className="py-3 px-3 text-center">
                  {roleMatrix.permissions.riders.manage ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 mx-auto" />
                  )}
                </td>
                <td className="py-3 px-3 text-center text-slate-400">—</td>
              </tr>

              {/* Payments & Refunds */}
              <tr className="hover:bg-slate-800/30">
                <td className="py-3 px-3 font-bold text-white">Finance &amp; Reversals</td>
                <td className="py-3 px-3 text-center">
                  {roleMatrix.permissions.payments.view ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 mx-auto" />
                  )}
                </td>
                <td className="py-3 px-3 text-center text-slate-400">—</td>
                <td className="py-3 px-3 text-center text-slate-400">—</td>
                <td className="py-3 px-3 text-center">
                  {roleMatrix.permissions.payments.refund ? (
                    <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-rose-500 mx-auto" />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
