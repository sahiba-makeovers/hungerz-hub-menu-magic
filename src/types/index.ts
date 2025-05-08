
export interface TableData {
  id: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number | { half: number; full: number };
  category: string;
  description?: string;
  image?: string;
  popular?: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  displayName: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  variant?: 'half' | 'full';
  notes?: string;
}

export interface Order {
  id: string;
  tableId: number;
  items: CartItem[];
  status: 'PENDING' | 'COOKING' | 'DELIVERED';
  createdAt: string;
  totalAmount: number;
}

export interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
}

export interface OrderContextType {
  cart: CartItem[];
  tableId: number | null;
  orders: Order[];
  tables: TableData[];
  menuItems: MenuItem[];
  isLoading: boolean;
  discount: number;
  couponCode: string | null;

  addToCart: (item: MenuItem, quantity: number, variant?: 'half' | 'full', notes?: string) => void;
  removeFromCart: (itemId: string, variant?: 'half' | 'full') => void;
  updateCartItemQuantity: (itemId: string, quantity: number, variant?: 'half' | 'full') => void;
  clearCart: () => void;
  placeOrder: () => Promise<void>;
  getCartTotal: () => number;

  setTableId: (id: number) => void;
  setTables: (tables: TableData[]) => void;
  addTable: (tableId: number) => Promise<void>;
  deleteTable: (tableId: number) => Promise<void>;

  addMenuItem: (item: MenuItem) => Promise<void>;
  deleteMenuItem: (itemId: string) => Promise<void>;

  updateOrderStatus: (orderId: string, status: 'PENDING' | 'COOKING' | 'DELIVERED') => Promise<void>;

  applyCoupon: (code: string) => { success: boolean; message: string };

  refreshMenuItems: () => Promise<boolean>;
  refreshOrders: () => Promise<boolean>;
  refreshAllData: () => Promise<void>;
  refreshTables: () => Promise<boolean>;
}
