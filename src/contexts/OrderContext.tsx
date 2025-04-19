
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, Order } from '@/types';
import { toast } from 'sonner';

type OrderContextType = {
  cart: CartItem[];
  tableId: number | null;
  orders: Order[];
  addToCart: (item: MenuItem, quantity: number, variant?: 'half' | 'full') => void;
  removeFromCart: (itemId: string, variant?: 'half' | 'full') => void;
  updateCartItemQuantity: (itemId: string, quantity: number, variant?: 'half' | 'full') => void;
  clearCart: () => void;
  placeOrder: () => void;
  setTableId: (id: number | null) => void;
  updateOrderStatus: (orderId: string, status: 'PENDING' | 'COOKING' | 'DELIVERED') => void;
  getCartTotal: () => number;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableId, setTableId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Initialize with table ID from URL if available and localStorage
  useEffect(() => {
    // First check URL parameter
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    
    if (tableParam) {
      const parsedTableId = parseInt(tableParam);
      if (!isNaN(parsedTableId) && parsedTableId >= 1 && parsedTableId <= 10) {
        setTableId(parsedTableId);
        // Save to localStorage for persistence
        localStorage.setItem('hungerzhub_tableId', parsedTableId.toString());
        return;
      }
    }
    
    // If no URL param, try to get from localStorage
    const storedTableId = localStorage.getItem('hungerzhub_tableId');
    if (storedTableId) {
      const parsedStoredId = parseInt(storedTableId);
      if (!isNaN(parsedStoredId) && parsedStoredId >= 1 && parsedStoredId <= 10) {
        setTableId(parsedStoredId);
      }
    }
  }, []);

  // Update localStorage whenever tableId changes
  useEffect(() => {
    if (tableId) {
      localStorage.setItem('hungerzhub_tableId', tableId.toString());
    }
  }, [tableId]);

  // Load orders from localStorage on mount
  useEffect(() => {
    const storedOrders = localStorage.getItem('hungerzhub_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hungerzhub_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (item: MenuItem, quantity: number, variant?: 'half' | 'full') => {
    setCart((prevCart) => {
      // Check if the item is already in the cart with the same variant
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => 
          cartItem.menuItem.id === item.id && 
          (typeof item.price !== 'object' || cartItem.variant === variant)
      );

      if (existingItemIndex !== -1) {
        // If item exists, update its quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        toast.success(`Added ${item.name} to cart`);
        return updatedCart;
      } else {
        // If item doesn't exist, add it to the cart
        toast.success(`Added ${item.name} to cart`);
        return [...prevCart, { menuItem: item, quantity, variant }];
      }
    });
  };

  const removeFromCart = (itemId: string, variant?: 'half' | 'full') => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(
        (item) => 
          !(item.menuItem.id === itemId && 
            (typeof item.menuItem.price !== 'object' || item.variant === variant))
      );
      return updatedCart;
    });
  };

  const updateCartItemQuantity = (itemId: string, quantity: number, variant?: 'half' | 'full') => {
    if (quantity <= 0) {
      removeFromCart(itemId, variant);
      return;
    }

    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (
          item.menuItem.id === itemId &&
          (typeof item.menuItem.price !== 'object' || item.variant === variant)
        ) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      let price = 0;
      if (typeof item.menuItem.price === 'object') {
        price = item.variant === 'half' ? item.menuItem.price.half : item.menuItem.price.full;
      } else {
        price = item.menuItem.price;
      }
      return total + price * item.quantity;
    }, 0);
  };

  const placeOrder = () => {
    if (!tableId) {
      toast.error('Please select a table before placing an order');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      tableId: tableId,
      items: [...cart],
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      totalAmount: getCartTotal(),
    };

    setOrders((prevOrders) => [...prevOrders, newOrder]);
    clearCart();
    toast.success('Order placed successfully');
  };

  const updateOrderStatus = (orderId: string, status: 'PENDING' | 'COOKING' | 'DELIVERED') => {
    setOrders((prevOrders) => {
      return prevOrders.map((order) => {
        if (order.id === orderId) {
          return { ...order, status };
        }
        return order;
      });
    });
    toast.success(`Order status updated to ${status}`);
  };

  return (
    <OrderContext.Provider
      value={{
        cart,
        tableId,
        orders,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        placeOrder,
        setTableId,
        updateOrderStatus,
        getCartTotal,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
};
