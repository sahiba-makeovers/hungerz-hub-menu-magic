
export interface MenuItem {
  id: string;
  name: string;
  price: number | { half: number; full: number };
  category: string;
  description?: string;
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

export type MenuCategory = {
  id: string;
  name: string;
  displayName: string;
};

export interface Coupon {
  code: string;
  discount: number;
  type: 'percentage';
}

// Add OrderContextType interface to ensure consistency between components
export interface OrderContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity: number, variant?: 'half' | 'full', notes?: string) => void;
  updateCartItemQuantity: (itemId: string, newQuantity: number, variant?: 'half' | 'full') => void;
  removeFromCart: (itemId: string, variant?: 'half' | 'full') => void;
  clearCart: () => void;
  tableId: number | null;
  setTableId: (id: number) => void;
  placeOrder: () => void;
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getCartTotal: () => number;
  
  // Add missing properties
  tables: number[];
  addTable: (tableId: number) => void;
  deleteTable: (tableId: number) => void;
  menuItems: MenuItem[];
  addMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (itemId: string) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  discount: number;
  couponCode: string | null;
  isLoading: boolean;
}
