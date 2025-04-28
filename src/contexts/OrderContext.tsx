import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, MenuItem, Order, OrderContextType, Coupon } from '@/types';
import { toast } from 'sonner';
import { 
  fetchTables, saveTables, 
  fetchMenuItems, saveMenuItems,
  fetchOrders, saveOrders,
  getInitialTables, getInitialMenuItems,
  clearCache, forceRefresh,
  getCurrentCacheState,
  subscribeToDataChanges
} from '@/utils/dataStorage';

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableId, setTableId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<number[]>(getInitialTables());
  const [menuItems, setMenuItems] = useState<MenuItem[]>(getInitialMenuItems());
  const [discount, setDiscount] = useState<number>(0);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataInitialized, setDataInitialized] = useState<boolean>(false);

  // Define available coupons
  const availableCoupons: Coupon[] = [
    { code: 'SHUBHAM50', discount: 50, type: 'percentage' },
    { code: 'PRINCE10', discount: 10, type: 'percentage' },
  ];

  // Function to refresh all data
  const refreshAllData = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const [apiTables, apiMenuItems, apiOrders] = await Promise.all([
        fetchTables(),
        fetchMenuItems(),
        fetchOrders()
      ]);

      setTables(apiTables);
      setMenuItems(apiMenuItems);
      setOrders(apiOrders);
      setDataInitialized(true);
    } catch (error) {
      console.error("Failed to refresh data:", error);
      toast.error("Failed to refresh data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to refresh only menu items
  const refreshMenuItems = useCallback(async (): Promise<boolean> => {
    try {
      const items = await fetchMenuItems();
      setMenuItems(items);
      return true;
    } catch (error) {
      console.error("Failed to refresh menu items:", error);
      return false;
    }
  }, []);

  // Function to refresh only orders
  const refreshOrders = useCallback(async (): Promise<boolean> => {
    try {
      const newOrders = await fetchOrders();
      setOrders(newOrders);
      return true;
    } catch (error) {
      console.error("Failed to refresh orders:", error);
      return false;
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Save orders whenever they change
  useEffect(() => {
    if (dataInitialized && orders.length > 0) {
      saveOrders(orders);
    }
  }, [orders, dataInitialized]);

  // Save tables whenever they change
  useEffect(() => {
    if (dataInitialized && tables.length > 0) {
      saveTables(tables);
    }
  }, [tables, dataInitialized]);
  
  // Save menuItems whenever they change
  useEffect(() => {
    if (dataInitialized && menuItems.length > 0) {
      saveMenuItems(menuItems);
    }
  }, [menuItems, dataInitialized]);

  // Cart operations
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

  // Enhanced order placement with better synchronization
  const placeOrder = async () => {
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
      items: JSON.parse(JSON.stringify(cart)),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      totalAmount: getDiscountedTotal(),
    };

    try {
      // First refresh to get latest orders
      await refreshOrders();
      
      // Then add the new order to both state and storage
      const updatedOrders = [...orders, newOrder];
      setOrders(updatedOrders);
      
      // Save orders to server immediately
      try {
        await saveOrders(updatedOrders);
      } catch (error) {
        console.error("Failed to save new order:", error);
        toast.error('Order saved locally but not synced to server. Please try refreshing.');
      }
      
      clearCart();
      // Reset discount after order is placed
      setDiscount(0);
      setCouponCode(null);
      toast.success('Order placed successfully');
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  const updateOrderStatus = async (orderId: string, status: 'PENDING' | 'COOKING' | 'DELIVERED') => {
    try {
      // First refresh to get latest orders
      await refreshOrders();
      
      // Update the order in state
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return { ...order, status };
        }
        return order;
      });
      
      // Update state immediately
      setOrders(updatedOrders);
      
      // Save updated orders
      try {
        await saveOrders(updatedOrders);
        toast.success(`Order status updated to ${status}`);
      } catch (error) {
        console.error("Failed to update order status:", error);
        toast.error('Status updated locally but not synced to server. Please refresh.');
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error('Failed to update order status. Please try again.');
    }
  };

  // Enhanced table management with better synchronization
  const addTable = async (tableId: number) => {
    try {
      // First refresh to get latest tables
      const freshTables = await fetchTables(true);
      
      if (freshTables.includes(tableId)) {
        toast.error(`Table ${tableId} already exists`);
        return;
      }
      
      // Update state immediately
      const updatedTables = [...tables, tableId].sort((a, b) => a - b);
      setTables(updatedTables);
      
      // Save updated tables
      try {
        await saveTables(updatedTables);
        toast.success(`Table ${tableId} added successfully`);
      } catch (error) {
        console.error("Failed to save new table:", error);
        toast.error('Table added locally but not synced to server. Please refresh.');
      }
    } catch (error) {
      console.error("Error adding table:", error);
      toast.error('Failed to add table. Please try again.');
    }
  };

  const deleteTable = async (tableId: number) => {
    try {
      // First refresh to get latest tables
      await fetchTables(true);
      
      // Update state immediately
      const updatedTables = tables.filter(id => id !== tableId);
      setTables(updatedTables);
      
      // Save updated tables
      try {
        await saveTables(updatedTables);
        toast.success(`Table ${tableId} removed successfully`);
      } catch (error) {
        console.error("Failed to delete table:", error);
        toast.error('Table removed locally but not synced to server. Please refresh.');
      }
    } catch (error) {
      console.error("Error removing table:", error);
      toast.error('Failed to remove table. Please try again.');
    }
  };

  // Enhanced menu item management with better synchronization
  const addMenuItem = async (item: MenuItem) => {
    try {
      // First refresh to get latest menu items
      await refreshMenuItems();
      
      // Update state immediately
      const updatedMenuItems = [...menuItems, item];
      setMenuItems(updatedMenuItems);
      
      // Save updated menu items
      try {
        await saveMenuItems(updatedMenuItems);
        toast.success(`${item.name} added to menu successfully`);
      } catch (error) {
        console.error("Failed to save new menu item:", error);
        toast.error('Menu item added locally but not synced to server. Please refresh.');
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
      toast.error('Failed to add menu item. Please try again.');
    }
  };

  const deleteMenuItem = async (itemId: string) => {
    try {
      // First refresh to get latest menu items
      await refreshMenuItems();
      
      // Update state immediately
      const updatedMenuItems = menuItems.filter(item => item.id !== itemId);
      setMenuItems(updatedMenuItems);
      
      // Save updated menu items
      try {
        await saveMenuItems(updatedMenuItems);
        toast.success(`Menu item removed successfully`);
      } catch (error) {
        console.error("Failed to delete menu item:", error);
        toast.error('Menu item removed locally but not synced to server. Please refresh.');
      }
    } catch (error) {
      console.error("Error removing menu item:", error);
      toast.error('Failed to remove menu item. Please try again.');
    }
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
        tables,
        setTables,
        addTable,
        deleteTable,
        menuItems,
        addMenuItem,
        deleteMenuItem,
        applyCoupon,
        discount,
        couponCode,
        isLoading,
        refreshMenuItems,
        refreshOrders,
        refreshAllData
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
