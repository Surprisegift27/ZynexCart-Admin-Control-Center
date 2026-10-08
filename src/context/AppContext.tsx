import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Order,
  OrderStatus,
  Product,
  Category,
  DarkStore,
  Rider,
  RiderStatus,
  Customer,
  Coupon,
  Offer,
  RefundTicket,
  Review,
  SupportTicket,
  StaffMember,
  NotificationAlert,
  QuickCommerceSettings,
} from '../types';
import {
  initialOrders,
  initialProducts,
  initialCategories,
  initialStores,
  initialRiders,
  initialCustomers,
  initialCoupons,
  initialOffers,
  initialRefunds,
  initialReviews,
  initialSupportTickets,
  initialStaff,
  initialNotifications,
  defaultSettings,
} from '../data/initialData';

export type ActiveSection =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'categories'
  | 'inventory'
  | 'stores'
  | 'riders'
  | 'customers'
  | 'coupons'
  | 'offers'
  | 'payments'
  | 'refunds'
  | 'reviews'
  | 'support'
  | 'analytics'
  | 'staff'
  | 'notifications'
  | 'settings';

interface AppContextType {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  orderFilterStatus: OrderStatus | 'All';
  setOrderFilterStatus: (status: OrderStatus | 'All') => void;
  selectedStoreFilter: string; // 'all' or storeId
  setSelectedStoreFilter: (storeId: string) => void;

  orders: Order[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  assignRiderToOrder: (orderId: string, riderId: string) => void;
  cancelOrder: (orderId: string, reason: string) => void;
  refundOrder: (orderId: string, amount: number, reason: string) => void;
  createQuickOrder: () => void;

  products: Product[];
  updateProduct: (product: Product) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  quickEditProduct: (id: string, fields: Partial<Product>) => void;
  restockProduct: (id: string, addQty: number) => void;

  categories: Category[];
  addCategory: (cat: Omit<Category, 'id' | 'productCount'>) => void;
  toggleCategoryActive: (id: string) => void;

  stores: DarkStore[];
  updateStore: (store: DarkStore) => void;
  addStore: (store: Omit<DarkStore, 'id' | 'activeOrdersCount'>) => void;

  riders: Rider[];
  updateRiderStatus: (riderId: string, status: RiderStatus) => void;
  addRider: (rider: Omit<Rider, 'id' | 'completedDeliveriesToday' | 'earningsToday'>) => void;

  customers: Customer[];
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  toggleCouponActive: (id: string) => void;
  deleteCoupon: (id: string) => void;

  offers: Offer[];
  addOffer: (offer: Omit<Offer, 'id'>) => void;
  toggleOfferActive: (id: string) => void;

  refunds: RefundTicket[];
  approveRefund: (id: string) => void;
  rejectRefund: (id: string) => void;

  reviews: Review[];
  approveReview: (id: string) => void;
  replyToReview: (id: string, reply: string) => void;

  supportTickets: SupportTicket[];
  updateTicketStatus: (id: string, status: SupportTicket['status']) => void;
  addTicketMessage: (id: string, text: string) => void;

  staff: StaffMember[];
  currentStaff: StaffMember;
  setCurrentStaffId: (id: string) => void;

  notifications: NotificationAlert[];
  unreadNotifCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<NotificationAlert, 'id' | 'createdAt' | 'isRead'>) => void;

  settings: QuickCommerceSettings;
  updateSettings: (partial: Partial<QuickCommerceSettings>) => void;
  resetDemoData: () => void;

  // Modals & Drawers state
  selectedOrderDetailId: string | null;
  setSelectedOrderDetailId: (id: string | null) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
  searchOriginSection: ActiveSection;
  openGlobalSearch: () => void;
  closeGlobalSearch: () => void;
  isQuickActionOpen: boolean;
  setIsQuickActionOpen: (open: boolean) => void;
  riderAssignTargetOrderId: string | null;
  setRiderAssignTargetOrderId: (orderId: string | null) => void;

  triggerAudioAlert: (type?: 'chime' | 'alert' | 'success') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Web Audio synthesizer for tactile quick-commerce audio feedback
function playSound(type: 'chime' | 'alert' | 'success' = 'chime') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'chime') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'alert') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(349.23, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'success') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch {
    // Ignore audio permission or blocked playback
  }
}

// Bulletproof safe storage helpers to avoid any iFrame or JSON parse crashes
function safeGetStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const item = window.localStorage.getItem(key);
    if (!item || item === 'undefined' || item === 'null') return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Safe storage read skipped for ${key}:`, err);
    return fallback;
  }
}

function safeSetStorage(key: string, value: any) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.warn(`Safe storage write skipped for ${key}:`, err);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [orderFilterStatus, setOrderFilterStatus] = useState<OrderStatus | 'All'>('All');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState<string>('all');

  // Load from safe storage or seed (Purge old categories if not matching the 21 official categories)
  const [orders, setOrders] = useState<Order[]>(() => safeGetStorage('zynex_orders', initialOrders));
  const [products, setProducts] = useState<Product[]>(() => safeGetStorage('zynex_products', initialProducts));
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = safeGetStorage<Category[]>('zynex_categories', []);
    // If old categories (less than 21 or missing paan), delete old data and replace with fresh 21 categories
    if (saved && saved.length === initialCategories.length && saved.some((c) => c.id === 'paan')) {
      return saved;
    }
    safeSetStorage('zynex_categories', initialCategories);
    return initialCategories;
  });
  const [stores, setStores] = useState<DarkStore[]>(() => safeGetStorage('zynex_stores', initialStores));
  const [riders, setRiders] = useState<Rider[]>(() => safeGetStorage('zynex_riders', initialRiders));
  const [customers] = useState<Customer[]>(initialCustomers);
  const [coupons, setCoupons] = useState<Coupon[]>(() => safeGetStorage('zynex_coupons', initialCoupons));
  const [offers, setOffers] = useState<Offer[]>(() => safeGetStorage('zynex_offers', initialOffers));
  const [refunds, setRefunds] = useState<RefundTicket[]>(() => safeGetStorage('zynex_refunds', initialRefunds));
  const [reviews, setReviews] = useState<Review[]>(() => safeGetStorage('zynex_reviews', initialReviews));
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => safeGetStorage('zynex_tickets', initialSupportTickets));
  const [staff] = useState<StaffMember[]>(initialStaff);
  const [currentStaffId, setCurrentStaffId] = useState<string>('staff-01');
  const [notifications, setNotifications] = useState<NotificationAlert[]>(() => safeGetStorage('zynex_notifications', initialNotifications));
  const [settings, setSettings] = useState<QuickCommerceSettings>(() => {
    const saved = safeGetStorage<Partial<QuickCommerceSettings>>('zynex_settings', {});
    // Ensure default is 'white' as requested: if saved had old 'black-white' or empty, migrate to 'white'
    const themeMode = saved.themeMode === 'dark' ? 'dark' : 'white';
    const initial = { ...defaultSettings, ...saved, themeMode };
    safeSetStorage('zynex_settings', initial);
    return initial;
  });

  // Modal / Drawer states
  const [selectedOrderDetailId, setSelectedOrderDetailId] = useState<string | null>(null);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [searchOriginSection, setSearchOriginSection] = useState<ActiveSection>('dashboard');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [riderAssignTargetOrderId, setRiderAssignTargetOrderId] = useState<string | null>(null);

  const openGlobalSearch = useCallback(() => {
    setSearchOriginSection(activeSection);
    setIsGlobalSearchOpen(true);
  }, [activeSection]);

  const closeGlobalSearch = useCallback(() => {
    setIsGlobalSearchOpen(false);
    setActiveSection(searchOriginSection);
  }, [searchOriginSection]);

  // Sync to localStorage safely
  useEffect(() => {
    safeSetStorage('zynex_orders', orders);
  }, [orders]);

  useEffect(() => {
    safeSetStorage('zynex_products', products);
  }, [products]);

  useEffect(() => {
    safeSetStorage('zynex_categories', categories);
  }, [categories]);

  useEffect(() => {
    safeSetStorage('zynex_stores', stores);
  }, [stores]);

  useEffect(() => {
    safeSetStorage('zynex_riders', riders);
  }, [riders]);

  useEffect(() => {
    safeSetStorage('zynex_coupons', coupons);
  }, [coupons]);

  useEffect(() => {
    safeSetStorage('zynex_offers', offers);
  }, [offers]);

  useEffect(() => {
    safeSetStorage('zynex_refunds', refunds);
  }, [refunds]);

  useEffect(() => {
    safeSetStorage('zynex_reviews', reviews);
  }, [reviews]);

  useEffect(() => {
    safeSetStorage('zynex_tickets', supportTickets);
  }, [supportTickets]);

  useEffect(() => {
    safeSetStorage('zynex_notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    safeSetStorage('zynex_settings', settings);
  }, [settings]);

  const currentStaff = useMemo(() => {
    return staff.find((s) => s.id === currentStaffId) || staff[0];
  }, [staff, currentStaffId]);

  const unreadNotifCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const triggerAudioAlert = useCallback(
    (type: 'chime' | 'alert' | 'success' = 'chime') => {
      if (settings.soundAlertsEnabled) {
        playSound(type);
      }
    },
    [settings.soundAlertsEnabled]
  );

  // Keyboard shortcut Cmd+K or Ctrl+K for Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Order status management
  const updateOrderStatus = useCallback(
    (orderId: string, newStatus: OrderStatus, note?: string) => {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id !== orderId) return order;

          const updatedTimeline = [
            ...order.timeline,
            {
              status: newStatus,
              timestamp: now,
              note: note || `Order updated to ${newStatus} by ${currentStaff.name}`,
              actor: currentStaff.name,
            },
          ];

          let updatedPaymentStatus = order.paymentStatus;
          if (newStatus === 'Delivered' && order.paymentMethod === 'COD') {
            updatedPaymentStatus = 'Successful';
          } else if (newStatus === 'Cancelled' && order.paymentStatus === 'Successful') {
            updatedPaymentStatus = 'Refunded';
          }

          return {
            ...order,
            status: newStatus,
            paymentStatus: updatedPaymentStatus,
            timeline: updatedTimeline,
            estimatedDeliveryTime: newStatus === 'Delivered' ? 'Delivered Just Now' : order.estimatedDeliveryTime,
          };
        })
      );
      triggerAudioAlert('success');
    },
    [currentStaff.name, triggerAudioAlert]
  );

  // Assign Rider to Order
  const assignRiderToOrder = useCallback(
    (orderId: string, riderId: string) => {
      const rider = riders.find((r) => r.id === riderId);
      if (!rider) return;

      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setOrders((prev) =>
        prev.map((order) => {
          if (order.id !== orderId) return order;
          return {
            ...order,
            riderId: rider.id,
            riderName: rider.name,
            riderPhone: rider.phone,
            status: 'Rider Assigned',
            timeline: [
              ...order.timeline,
              {
                status: 'Rider Assigned',
                timestamp: now,
                note: `Rider ${rider.name} (${rider.vehicleType}) assigned`,
                actor: currentStaff.name,
              },
            ],
          };
        })
      );

      setRiders((prev) =>
        prev.map((r) => (r.id === riderId ? { ...r, status: 'On Delivery', currentOrderId: orderId } : r))
      );

      triggerAudioAlert('chime');
    },
    [riders, currentStaff.name, triggerAudioAlert]
  );

  // Cancel order
  const cancelOrder = useCallback(
    (orderId: string, reason: string) => {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id !== orderId) return order;
          return {
            ...order,
            status: 'Cancelled',
            cancelReason: reason,
            refundAmount: order.paymentStatus === 'Successful' ? order.totalAmount : 0,
            paymentStatus: order.paymentStatus === 'Successful' ? 'Refunded' : order.paymentStatus,
            timeline: [
              ...order.timeline,
              {
                status: 'Cancelled',
                timestamp: now,
                note: `Cancelled: ${reason}`,
                actor: currentStaff.name,
              },
            ],
          };
        })
      );
      triggerAudioAlert('alert');
    },
    [currentStaff.name, triggerAudioAlert]
  );

  // Refund Order
  const refundOrder = useCallback(
    (orderId: string, amount: number, reason: string) => {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id !== orderId) return order;
          return {
            ...order,
            paymentStatus: 'Refunded',
            refundAmount: amount,
            timeline: [
              ...order.timeline,
              {
                status: 'Refunded',
                timestamp: now,
                note: `Refund of ₹${amount} processed. Reason: ${reason}`,
                actor: currentStaff.name,
              },
            ],
          };
        })
      );
      triggerAudioAlert('success');
    },
    [currentStaff.name, triggerAudioAlert]
  );

  // Create Quick Simulated / Manual Order
  const createQuickOrder = useCallback(() => {
    const orderNum = Math.floor(10246 + Math.random() * 900);
    const id = `#${orderNum}`;
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    const randomProduct = products[Math.floor(Math.random() * (products.length - 2))];
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id,
      customerId: randomCustomer.id,
      customerName: randomCustomer.name,
      customerPhone: randomCustomer.phone,
      customerAddress: randomCustomer.addresses[0]?.address || 'Flat 301, Palm Court, Mumbai',
      deliveryInstructions: 'Fast delivery requested. Don\'t ring bell.',
      storeId: 'store-01',
      storeName: 'Mumbai Dark Store 01',
      items: [
        {
          id: `item-${Date.now()}`,
          productId: randomProduct.id,
          name: randomProduct.name,
          quantity: 2,
          unit: randomProduct.unit,
          price: randomProduct.price,
          mrp: randomProduct.mrp,
        },
      ],
      subtotal: randomProduct.price * 2,
      deliveryFee: 15,
      discount: 20,
      tip: 10,
      totalAmount: randomProduct.price * 2 + 15 - 20 + 10,
      paymentMethod: 'UPI',
      paymentStatus: 'Successful',
      transactionId: `TXN_SIM_${Date.now()}`,
      status: 'New',
      createdAt: now,
      estimatedDeliveryTime: '9 mins',
      deliveryDistanceKm: +(1.2 + Math.random() * 2).toFixed(1),
      timeline: [
        {
          status: 'New',
          timestamp: now,
          note: 'Order placed by customer via Quick App',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Reserve stock
    setProducts((prev) =>
      prev.map((p) => (p.id === randomProduct.id ? { ...p, reservedStock: p.reservedStock + 2 } : p))
    );

    // Notification
    const notif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      type: 'new_order',
      title: `⚡ Live Order Received ${id}`,
      message: `${randomCustomer.name} ordered ${randomProduct.name} (₹${newOrder.totalAmount}) - 10-Min SLA Active`,
      targetId: id,
      targetView: 'orders',
      isUrgent: false,
      isRead: false,
      createdAt: now,
    };
    setNotifications((prev) => [notif, ...prev]);
    triggerAudioAlert('chime');
  }, [customers, products, triggerAudioAlert]);

  // Product mutations
  const updateProduct = useCallback((product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  }, []);

  const addProduct = useCallback((productData: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    setProducts((prev) => [{ ...productData, id }, ...prev]);
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const quickEditProduct = useCallback((id: string, fields: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...fields } : p)));
  }, []);

  const restockProduct = useCallback((id: string, addQty: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: p.stock + addQty, isActive: true } : p))
    );
  }, []);

  // Category mutations
  const addCategory = useCallback((cat: Omit<Category, 'id' | 'productCount'>) => {
    const id = `cat-${Date.now()}`;
    setCategories((prev) => [...prev, { ...cat, id, productCount: 0 }]);
  }, []);

  const toggleCategoryActive = useCallback((id: string) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
  }, []);

  // Store mutations
  const updateStore = useCallback((store: DarkStore) => {
    setStores((prev) => prev.map((s) => (s.id === store.id ? store : s)));
  }, []);

  const addStore = useCallback((storeData: Omit<DarkStore, 'id' | 'activeOrdersCount'>) => {
    const id = `store-${Date.now()}`;
    setStores((prev) => [...prev, { ...storeData, id, activeOrdersCount: 0 }]);
  }, []);

  // Rider mutations
  const updateRiderStatus = useCallback((riderId: string, status: RiderStatus) => {
    setRiders((prev) =>
      prev.map((r) =>
        r.id === riderId ? { ...r, status, currentOrderId: status === 'Available' ? undefined : r.currentOrderId } : r
      )
    );
  }, []);

  const addRider = useCallback(
    (riderData: Omit<Rider, 'id' | 'completedDeliveriesToday' | 'earningsToday'>) => {
      const id = `rdr-${Date.now()}`;
      setRiders((prev) => [
        { ...riderData, id, completedDeliveriesToday: 0, earningsToday: 0 },
        ...prev,
      ]);
    },
    []
  );

  // Coupon mutations
  const addCoupon = useCallback((cpn: Omit<Coupon, 'id' | 'usedCount'>) => {
    const id = `cpn-${Date.now()}`;
    setCoupons((prev) => [{ ...cpn, id, usedCount: 0 }, ...prev]);
  }, []);

  const toggleCouponActive = useCallback((id: string) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
  }, []);

  const deleteCoupon = useCallback((id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Offer mutations
  const addOffer = useCallback((off: Omit<Offer, 'id'>) => {
    const id = `off-${Date.now()}`;
    setOffers((prev) => [{ ...off, id }, ...prev]);
  }, []);

  const toggleOfferActive = useCallback((id: string) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o)));
  }, []);

  // Refund mutations
  const approveRefund = useCallback((id: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setRefunds((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Refunded', processedAt: now } : r))
    );
    // Also mark order refunded
    const item = refunds.find((r) => r.id === id);
    if (item) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === item.orderId ? { ...o, status: 'Refunded', paymentStatus: 'Refunded' } : o
        )
      );
    }
    playSound('success');
  }, [refunds]);

  const rejectRefund = useCallback((id: string) => {
    setRefunds((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Rejected', notes: 'Rejected by Admin review' } : r))
    );
  }, []);

  // Reviews
  const approveReview = useCallback((id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, isApproved: true } : r)));
  }, []);

  const replyToReview = useCallback((id: string, reply: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, adminReply: reply } : r)));
  }, []);

  // Support
  const updateTicketStatus = useCallback((id: string, status: SupportTicket['status']) => {
    setSupportTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }, []);

  const addTicketMessage = useCallback(
    (id: string, text: string) => {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setSupportTickets((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                messages: [...t.messages, { sender: 'staff', text, timestamp: now }],
              }
            : t
        )
      );
    },
    []
  );

  // Notifications
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const addNotification = useCallback((notif: Omit<NotificationAlert, 'id' | 'createdAt' | 'isRead'>) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const item: NotificationAlert = {
      ...notif,
      id: `notif-${Date.now()}`,
      createdAt: now,
      isRead: false,
    };
    setNotifications((prev) => [item, ...prev]);
  }, []);

  // Settings
  const updateSettings = useCallback((partial: Partial<QuickCommerceSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      safeSetStorage('zynex_settings', next);
      return next;
    });
  }, []);

  const resetDemoData = useCallback(() => {
    localStorage.removeItem('zynex_orders');
    localStorage.removeItem('zynex_products');
    localStorage.removeItem('zynex_categories');
    localStorage.removeItem('zynex_stores');
    localStorage.removeItem('zynex_riders');
    localStorage.removeItem('zynex_coupons');
    localStorage.removeItem('zynex_offers');
    localStorage.removeItem('zynex_refunds');
    localStorage.removeItem('zynex_reviews');
    localStorage.removeItem('zynex_tickets');
    localStorage.removeItem('zynex_notifications');
    localStorage.removeItem('zynex_settings');

    setOrders(initialOrders);
    setProducts(initialProducts);
    setCategories(initialCategories);
    setStores(initialStores);
    setRiders(initialRiders);
    setCoupons(initialCoupons);
    setOffers(initialOffers);
    setRefunds(initialRefunds);
    setReviews(initialReviews);
    setSupportTickets(initialSupportTickets);
    setNotifications(initialNotifications);
    setSettings(defaultSettings);
    triggerAudioAlert('success');
  }, [triggerAudioAlert]);

  // LIVE AUTOMATION SIMULATION TICKER
  // Moves orders along the quick-commerce pipeline automatically when simulation is ON
  useEffect(() => {
    if (!settings.liveSimulationActive) return;

    const interval = setInterval(() => {
      // 1. Advance an active in-flight order
      setOrders((prev) => {
        const activeOrder = prev.find(
          (o) =>
            o.status === 'New' ||
            o.status === 'Confirmed' ||
            o.status === 'Preparing' ||
            o.status === 'Packed' ||
            o.status === 'Rider Assigned' ||
            o.status === 'Picked Up' ||
            o.status === 'Out for Delivery'
        );

        if (!activeOrder) return prev;

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return prev.map((order) => {
          if (order.id !== activeOrder.id) return order;

          if (order.status === 'New') {
            return {
              ...order,
              status: 'Confirmed',
              timeline: [
                ...order.timeline,
                { status: 'Confirmed', timestamp: now, note: 'Payment verified & auto-accepted' },
              ],
            };
          }
          if (order.status === 'Confirmed') {
            return {
              ...order,
              status: 'Preparing',
              pickerName: 'Mahesh (Tray #09)',
              timeline: [
                ...order.timeline,
                { status: 'Preparing', timestamp: now, note: 'Picker Mahesh collecting items from shelf' },
              ],
            };
          }
          if (order.status === 'Preparing') {
            return {
              ...order,
              status: 'Packed',
              packerName: 'Kavita (Bag #B-91)',
              timeline: [
                ...order.timeline,
                { status: 'Packed', timestamp: now, note: 'Scanned, checked & sealed in quick-bag' },
              ],
            };
          }
          if (order.status === 'Packed') {
            // Find an available rider
            const availableRider = riders.find((r) => r.status === 'Available');
            const riderName = availableRider ? availableRider.name : 'Vikram Patel';
            const riderId = availableRider ? availableRider.id : 'rdr-01';

            return {
              ...order,
              status: 'Rider Assigned',
              riderId,
              riderName,
              riderPhone: '+91 98200 11223',
              timeline: [
                ...order.timeline,
                { status: 'Rider Assigned', timestamp: now, note: `Auto-assigned nearest rider ${riderName}` },
              ],
            };
          }
          if (order.status === 'Rider Assigned') {
            return {
              ...order,
              status: 'Picked Up',
              timeline: [
                ...order.timeline,
                { status: 'Picked Up', timestamp: now, note: 'Rider picked up parcel from dark store counter' },
              ],
            };
          }
          if (order.status === 'Picked Up') {
            return {
              ...order,
              status: 'Out for Delivery',
              estimatedDeliveryTime: '3 mins',
              timeline: [
                ...order.timeline,
                { status: 'Out for Delivery', timestamp: now, note: 'Rider speeding to customer doorstep' },
              ],
            };
          }
          if (order.status === 'Out for Delivery') {
            return {
              ...order,
              status: 'Delivered',
              estimatedDeliveryTime: 'Delivered in 8m 42s',
              paymentStatus: order.paymentMethod === 'COD' ? 'Successful' : order.paymentStatus,
              timeline: [
                ...order.timeline,
                { status: 'Delivered', timestamp: now, note: 'Delivered safely at doorstep. Customer signed OTP.' },
              ],
            };
          }
          return order;
        });
      });
    }, settings.simulationSpeedSec * 1000);

    return () => clearInterval(interval);
  }, [settings.liveSimulationActive, settings.simulationSpeedSec, riders]);

  const value = {
    activeSection,
    setActiveSection,
    orderFilterStatus,
    setOrderFilterStatus,
    selectedStoreFilter,
    setSelectedStoreFilter,

    orders,
    updateOrderStatus,
    assignRiderToOrder,
    cancelOrder,
    refundOrder,
    createQuickOrder,

    products,
    updateProduct,
    addProduct,
    deleteProduct,
    quickEditProduct,
    restockProduct,

    categories,
    addCategory,
    toggleCategoryActive,

    stores,
    updateStore,
    addStore,

    riders,
    updateRiderStatus,
    addRider,

    customers,
    coupons,
    addCoupon,
    toggleCouponActive,
    deleteCoupon,

    offers,
    addOffer,
    toggleOfferActive,

    refunds,
    approveRefund,
    rejectRefund,

    reviews,
    approveReview,
    replyToReview,

    supportTickets,
    updateTicketStatus,
    addTicketMessage,

    staff,
    currentStaff,
    setCurrentStaffId,

    notifications,
    unreadNotifCount,
    markNotificationRead,
    markAllNotificationsRead,
    addNotification,

    settings,
    updateSettings,
    resetDemoData,

    selectedOrderDetailId,
    setSelectedOrderDetailId,
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    searchOriginSection,
    openGlobalSearch,
    closeGlobalSearch,
    isQuickActionOpen,
    setIsQuickActionOpen,
    riderAssignTargetOrderId,
    setRiderAssignTargetOrderId,

    triggerAudioAlert,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
