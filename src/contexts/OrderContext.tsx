
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, Order, OrderContextType, Coupon } from '@/types';
import { toast } from 'sonner';
import { menuItems as initialMenuItems } from '@/data/menuData';

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableId, setTableId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [discount, setDiscount] = useState<number>(0);
  const [couponCode, setCouponCode] = useState<string | null>(null);

  // Define available coupons
  const availableCoupons: Coupon[] = [
    { code: 'SHUBHAM50', discount: 50, type: 'percentage' },
    { code: 'PRINCE10', discount: 10, type: 'percentage' },
  ];

  // Initialize with table ID from URL if available and localStorage
  useEffect(() => {
    // First check URL parameter
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    
    if (tableParam) {
      const parsedTableId = parseInt(tableParam);
      if (!isNaN(parsedTableId) && parsedTableId >= 1) {
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
      if (!isNaN(parsedStoredId)) {
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

  // Load orders, tables, and menuItems from localStorage on mount
  useEffect(() => {
    const storedOrders = localStorage.getItem('hungerzhub_orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
    
    const storedTables = localStorage.getItem('hungerzhub_tables');
    if (storedTables) {
      setTables(JSON.parse(storedTables));
    }
    
    const storedMenuItems = localStorage.getItem('hungerzhub_menuItems');
    if (storedMenuItems) {
      setMenuItems(JSON.parse(storedMenuItems));
    }
  }, []);

  // Save orders, tables, and menuItems to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hungerzhub_orders', JSON.stringify(orders));
  }, [orders]);
  
  useEffect(() => {
    localStorage.setItem('hungerzhub_tables', JSON.stringify(tables));
  }, [tables]);
  
  useEffect(() => {
    localStorage.setItem('hungerzhub_menuItems', JSON.stringify(menuItems));
  }, [menuItems]);

  const addToCart = (item: MenuItem, quantity: number, variant?: 'half' | 'full', notes?: string) => {
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
        return [...prevCart, { menuItem: item, quantity, variant, notes }];
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

  // Apply discount based on coupon
  const getDiscountedTotal = () => {
    const total = getCartTotal();
    if (discount > 0) {
      return total * (1 - discount / 100);
    }
    return total;
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
      totalAmount: getDiscountedTotal(),
    };

    setOrders((prevOrders) => [...prevOrders, newOrder]);
    clearCart();
    // Reset discount after order is placed
    setDiscount(0);
    setCouponCode(null);
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

  // Add table management
  const addTable = (tableId: number) => {
    if (tables.includes(tableId)) {
      toast.error(`Table ${tableId} already exists`);
      return;
    }
    setTables(prev => [...prev, tableId].sort((a, b) => a - b));
    toast.success(`Table ${tableId} added successfully`);
  };

  const deleteTable = (tableId: number) => {
    setTables(prev => prev.filter(id => id !== tableId));
    toast.success(`Table ${tableId} removed successfully`);
  };

  // Add menu item management
  const addMenuItem = (item: MenuItem) => {
    setMenuItems(prev => [...prev, item]);
    toast.success(`${item.name} added to menu successfully`);
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
    toast.success(`Menu item removed successfully`);
  };

  // Add coupon management
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const coupon = availableCoupons.find(
      c => c.code.toLowerCase() === code.toLowerCase()
    );
    
    if (!coupon) {
      return { success: false, message: `Invalid coupon code: ${code}` };
    }

    setDiscount(coupon.discount);
    setCouponCode(coupon.code);
    return { 
      success: true, 
      message: `${coupon.discount}% discount applied successfully` 
    };
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
        // Add new properties
        tables,
        addTable,
        deleteTable,
        menuItems,
        addMenuItem,
        deleteMenuItem,
        applyCoupon,
        discount,
        couponCode,
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
