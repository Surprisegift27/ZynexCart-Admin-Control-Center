export type OrderStatus =
  | 'New'
  | 'Confirmed'
  | 'Preparing'
  | 'Packed'
  | 'Rider Assigned'
  | 'Picked Up'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Payment Failed'
  | 'Refund Pending'
  | 'Refunded';

export type PaymentMethod = 'UPI' | 'COD' | 'Card' | 'Net Banking' | 'Wallet';
export type PaymentStatus = 'Successful' | 'Pending' | 'Failed' | 'Refunded' | 'Partial Refund';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unit: string;
  variant?: string;
  price: number;
  mrp: number;
  image?: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  note: string;
  actor?: string;
}

export interface Order {
  id: string; // e.g., "#10245"
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  deliveryInstructions?: string;
  storeId: string;
  storeName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponCode?: string;
  tip?: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string;
  status: OrderStatus;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  pickerName?: string;
  packerName?: string;
  createdAt: string;
  estimatedDeliveryTime: string; // e.g. "8 mins" or "10:58 AM"
  deliveryDistanceKm: number;
  timeline: OrderTimelineEvent[];
  cancelReason?: string;
  refundAmount?: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  mrp: number;
  sku: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  image: string;
  unit: string; // e.g. "500g", "1 kg", "1 L"
  price: number;
  mrp: number;
  discountPercentage: number;
  sku: string;
  isActive: boolean;
  stock: number;
  reservedStock: number;
  lowStockThreshold: number;
  storeId: string;
  variants?: ProductVariant[];
  isVeg: boolean;
  barcode?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  iconName?: string;
  productCount: number;
  isActive: boolean;
  order: number;
  subcategories: string[];
}

export interface DarkStore {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  operatingHours: string;
  radiusKm: number;
  isActive: boolean;
  pickersCount: number;
  packersCount: number;
  ridersCount: number;
  activeOrdersCount: number;
  healthScore: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export type RiderStatus = 'Available' | 'On Delivery' | 'Online' | 'Offline' | 'Suspended';

export interface Rider {
  id: string;
  name: string;
  phone: string;
  status: RiderStatus;
  currentOrderId?: string;
  completedDeliveriesToday: number;
  rating: number;
  earningsToday: number;
  vehicleType: 'EV Bike' | 'Motorcycle' | 'Bicycle' | 'Electric Scooter';
  batteryOrFuelPercent: number;
  cancellationRate: number;
  currentLocationName: string;
  kycVerified: boolean;
  joinedDate: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  cancelledOrders: number;
  registeredDate: string;
  lastOrderDate: string;
  addresses: {
    label: string;
    address: string;
    isDefault: boolean;
  }[];
  isVip: boolean;
  status: 'Active' | 'Blocked' | 'Suspicious';
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'Percentage' | 'Flat';
  discountValue: number;
  minOrderValue: number;
  maxDiscountCap: number;
  totalUsageLimit: number;
  usedCount: number;
  perUserLimit: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
  applicableCategories?: string[];
}

export interface Offer {
  id: string;
  title: string;
  type: 'BOGO' | 'Buy2Save' | 'PercentageOff' | 'FlashSale' | 'Combo';
  description: string;
  discountTag: string;
  badgeColor: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  storeId?: string;
}

export interface RefundTicket {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  reason: string;
  paymentMethod: PaymentMethod;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Processing' | 'Refunded';
  requestedAt: string;
  processedAt?: string;
  notes?: string;
}

export interface Review {
  id: string;
  orderId: string;
  productName: string;
  customerName: string;
  rating: number; // 1 to 5
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string;
  adminReply?: string;
}

export interface SupportTicket {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  category:
    | 'Missing item'
    | 'Wrong item'
    | 'Damaged item'
    | 'Late delivery'
    | 'Payment issue'
    | 'Refund issue'
    | 'Rider issue'
    | 'Product issue';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'New' | 'Assigned' | 'In Progress' | 'Waiting Customer' | 'Resolved' | 'Closed';
  subject: string;
  messages: {
    sender: 'customer' | 'staff' | 'system';
    text: string;
    timestamp: string;
  }[];
  assignedStaffId?: string;
  createdAt: string;
}

export type StaffRole =
  | 'Super Admin'
  | 'Store Manager'
  | 'Inventory Manager'
  | 'Order Manager'
  | 'Rider Dispatcher'
  | 'Support Staff'
  | 'Finance Manager';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  storeId?: string;
  isActive: boolean;
  lastLogin: string;
  phone: string;
}

export interface RolePermissionMatrix {
  role: StaffRole;
  description: string;
  permissions: {
    orders: { view: boolean; edit: boolean; cancel: boolean; refund: boolean };
    products: { view: boolean; edit: boolean; delete: boolean; create: boolean };
    inventory: { view: boolean; edit: boolean; restock: boolean };
    stores: { view: boolean; edit: boolean; manage: boolean };
    riders: { view: boolean; assign: boolean; manage: boolean };
    coupons: { view: boolean; create: boolean; delete: boolean };
    payments: { view: boolean; refund: boolean; export: boolean };
    support: { view: boolean; resolve: boolean };
    staff: { view: boolean; manage: boolean };
  };
}

export interface NotificationAlert {
  id: string;
  type: 'order_delayed' | 'low_stock' | 'payment_failed' | 'refund_requested' | 'new_order' | 'rider_alert';
  title: string;
  message: string;
  targetId?: string;
  targetView?: string;
  isUrgent: boolean;
  isRead: boolean;
  createdAt: string;
}

export interface QuickCommerceSettings {
  storeName: string;
  targetDeliveryMinutes: number;
  deliveryRadiusKm: number;
  baseDeliveryFee: number;
  freeDeliveryThreshold: number;
  lowStockThresholdDefault: number;
  autoAssignRiderEnabled: boolean;
  autoAcceptOrders: boolean;
  soundAlertsEnabled: boolean;
  liveSimulationActive: boolean;
  simulationSpeedSec: number;
  themeMode: 'white' | 'dark' | 'brand' | 'black-white';
}
