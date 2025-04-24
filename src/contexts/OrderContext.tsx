
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, MenuItem, Order, OrderContextType, Coupon } from '@/types';
import { toast } from 'sonner';
import { 
  fetchTables, saveTables, 
  fetchMenuItems, saveMenuItems,
  fetchOrders, saveOrders,
  getInitialTables, getInitialMenuItems,
  clearCache, forceRefresh,
  getCurrentCacheState
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

  // Function to refresh all data from API
  const refreshAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Clear cache to force fresh data
      clearCache();
      
      // Fetch tables
      const apiTables = await fetchTables(true);
      if (apiTables && apiTables.length > 0) {
        setTables(apiTables);
      }

      // Fetch menu items
      const apiMenuItems = await fetchMenuItems(true);
      if (apiMenuItems && apiMenuItems.length > 0) {
        setMenuItems(apiMenuItems);
      }

      // Fetch orders
      const apiOrders = await fetchOrders(true);
      if (apiOrders && apiOrders.length > 0) {
        setOrders(apiOrders);
      }
      
      setDataInitialized(true);
      console.log("All data refreshed, cache state:", getCurrentCacheState());
    } catch (error) {
      console.error("Failed to refresh data:", error);
      toast.error("Failed to refresh data from server. Some features may not work properly.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to refresh only menu items
  const refreshMenuItems = useCallback(async () => {
    try {
      const apiMenuItems = await fetchMenuItems(true);
      if (apiMenuItems && apiMenuItems.length > 0) {
        setMenuItems(apiMenuItems);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to refresh menu items:", error);
      return false;
    }
  }, []);

  // Function to refresh only orders
  const refreshOrders = useCallback(async () => {
    try {
      const apiOrders = await fetchOrders(true);
      if (apiOrders && apiOrders.length > 0) {
        setOrders(apiOrders);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to refresh orders:", error);
      return false;
    }
  }, []);

  // Load data from API on mount
  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Initialize with table ID from URL if available
  useEffect(() => {
    // Check URL parameter
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    
    if (tableParam) {
      const parsedTableId = parseInt(tableParam);
      if (!isNaN(parsedTableId) && parsedTableId >= 1) {
        setTableId(parsedTableId);
        return;
      }
    }
  }, []);

  // Save orders whenever they change
  useEffect(() => {
    if (dataInitialized && orders.length > 0) {
      console.log("Saving updated orders:", orders);
      saveOrders(orders).catch(error => 
        console.error("Failed to save orders:", error)
      );
    }
  }, [orders, dataInitialized]);

  // Save tables whenever they change
  useEffect(() => {
    if (dataInitialized && tables.length > 0) {
      console.log("Saving updated tables:", tables);
      saveTables(tables).catch(error => 
        console.error("Failed to save tables:", error)
      );
    }
  }, [tables, dataInitialized]);
  
  // Save menuItems whenever they change
  useEffect(() => {
    if (dataInitialized && menuItems.length > 0) {
      console.log("Saving updated menu items:", menuItems);
      saveMenuItems(menuItems).catch(error => 
        console.error("Failed to save menu items:", error)
      );
    }
  }, [menuItems, dataInitialized]);

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
      items: [...cart],
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      totalAmount: getDiscountedTotal(),
    };

    try {
      // First refresh to get latest orders
      await refreshOrders();
      
      // Then add the new order
      setOrders((prevOrders) => {
        const updatedOrders = [...prevOrders, newOrder];
        
        // Save orders to server immediately
        saveOrders(updatedOrders).catch(error => 
          console.error("Failed to save new order:", error)
        );
        
        return updatedOrders;
      });
      
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
      
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((order) => {
          if (order.id === orderId) {
            return { ...order, status };
          }
          return order;
        });
        
        // Save updated orders immediately
        saveOrders(updatedOrders).catch(error => 
          console.error("Failed to update order status:", error)
        );
        
        return updatedOrders;
      });
      
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error('Failed to update order status. Please try again.');
    }
  };

  // Add table management
  const addTable = async (tableId: number) => {
    try {
      // First refresh to get latest tables
      const freshTables = await fetchTables(true);
      
      if (freshTables.includes(tableId)) {
        toast.error(`Table ${tableId} already exists`);
        return;
      }
      
      setTables(prev => {
        const updatedTables = [...prev, tableId].sort((a, b) => a - b);
        
        // Save updated tables immediately
        saveTables(updatedTables).catch(error => 
          console.error("Failed to save new table:", error)
        );
        
        return updatedTables;
      });
      
      toast.success(`Table ${tableId} added successfully`);
    } catch (error) {
      console.error("Error adding table:", error);
      toast.error('Failed to add table. Please try again.');
    }
  };

  const deleteTable = async (tableId: number) => {
    try {
      // First refresh to get latest tables
      await fetchTables(true);
      
      setTables(prev => {
        const updatedTables = prev.filter(id => id !== tableId);
        
        // Save updated tables immediately
        saveTables(updatedTables).catch(error => 
          console.error("Failed to delete table:", error)
        );
        
        return updatedTables;
      });
      
      toast.success(`Table ${tableId} removed successfully`);
    } catch (error) {
      console.error("Error removing table:", error);
      toast.error('Failed to remove table. Please try again.');
    }
  };

  // Add menu item management
  const addMenuItem = async (item: MenuItem) => {
    try {
      // First refresh to get latest menu items
      await refreshMenuItems();
      
      setMenuItems(prev => {
        const updatedMenuItems = [...prev, item];
        
        // Save updated menu items immediately
        saveMenuItems(updatedMenuItems).catch(error => 
          console.error("Failed to save new menu item:", error)
        );
        
        return updatedMenuItems;
      });
      
      toast.success(`${item.name} added to menu successfully`);
    } catch (error) {
      console.error("Error adding menu item:", error);
      toast.error('Failed to add menu item. Please try again.');
    }
  };

  const deleteMenuItem = async (itemId: string) => {
    try {
      // First refresh to get latest menu items
      await refreshMenuItems();
      
      setMenuItems(prev => {
        const updatedMenuItems = prev.filter(item => item.id !== itemId);
        
        // Save updated menu items immediately
        saveMenuItems(updatedMenuItems).catch(error => 
          console.error("Failed to delete menu item:", error)
        );
        
        return updatedMenuItems;
      });
      
      toast.success(`Menu item removed successfully`);
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
