/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './views/DashboardView';
import { OrdersView } from './views/OrdersView';
import { ProductsView } from './views/ProductsView';
import { CategoriesView } from './views/CategoriesView';
import { InventoryView } from './views/InventoryView';
import { StoresView } from './views/StoresView';
import { RidersView } from './views/RidersView';
import { CustomersView } from './views/CustomersView';
import { CouponsOffersView } from './views/CouponsOffersView';
import { PaymentsRefundsView } from './views/PaymentsRefundsView';
import { ReviewsSupportView } from './views/ReviewsSupportView';
import { AnalyticsView } from './views/AnalyticsView';
import { StaffRolesView } from './views/StaffRolesView';
import { NotificationsView } from './views/NotificationsView';
import { SettingsView } from './views/SettingsView';

// Modals
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { OrderDetailDrawer } from './components/modals/OrderDetailDrawer';
import { AssignRiderModal } from './components/modals/AssignRiderModal';
import { QuickActionModal } from './components/modals/QuickActionModal';

const MainContent: React.FC = () => {
  const { activeSection, settings } = useApp();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isDark = settings.themeMode === 'dark' || settings.themeMode === 'black-white';

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'orders':
        return <OrdersView />;
      case 'products':
        return <ProductsView />;
      case 'categories':
        return <CategoriesView />;
      case 'inventory':
        return <InventoryView />;
      case 'stores':
        return <StoresView />;
      case 'riders':
        return <RidersView />;
      case 'customers':
        return <CustomersView />;
      case 'coupons':
      case 'offers':
        return <CouponsOffersView />;
      case 'payments':
      case 'refunds':
        return <PaymentsRefundsView />;
      case 'reviews':
      case 'support':
        return <ReviewsSupportView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'staff':
        return <StaffRolesView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-sans transition-colors ${
      isDark ? 'bg-[#05080F] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

      {/* Main View Area */}
      <div className={`flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-colors ${
        isDark ? 'bg-[#05080F]' : 'bg-[#F8FAFC]'
      }`}>
        <Header />

        {/* Content Container */}
        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-colors ${
          isDark ? 'bg-[#05080F] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
        }`}>
          <div className="max-w-[1600px] mx-auto pb-12">
            {renderActiveSection()}
          </div>
        </main>
      </div>

      {/* Global Interactive Modals & Drawers */}
      <GlobalSearchModal />
      <OrderDetailDrawer />
      <AssignRiderModal />
      <QuickActionModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
