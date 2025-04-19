
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
