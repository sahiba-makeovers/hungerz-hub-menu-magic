
export interface VariantPrice {
  half: number;
  full: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number | VariantPrice;
  category: string;
  description?: string;
  image?: string;
  popular?: boolean;
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
  addToCart: (item: MenuItem, quantity: number, variant?: 'half' | 'full', notes?: string) => void;
  removeFromCart: (itemId: string, variant?: 'half' | 'full') => void;
  updateCartItemQuantity: (itemId: string, quantity: number, variant?: 'half' | 'full') => void;
  clearCart: () => void;
  placeOrder: () => void;
  setTableId: React.Dispatch<React.SetStateAction<number | null>>;
  updateOrderStatus: (orderId: string, status: 'PENDING' | 'COOKING' | 'DELIVERED') => void;
  getCartTotal: () => number;
  tables: number[];
  setTables: React.Dispatch<React.SetStateAction<number[]>>;
  addTable: (tableId: number) => void;
  deleteTable: (tableId: number) => void;
  menuItems: MenuItem[];
  addMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (itemId: string) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  discount: number;
  couponCode: string | null;
  isLoading: boolean;
  refreshMenuItems: () => Promise<boolean>;
  refreshOrders: () => Promise<boolean>;
  refreshAllData: () => Promise<void>;
}
