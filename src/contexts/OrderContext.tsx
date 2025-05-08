import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, MenuItem, Order, OrderContextType, Coupon } from '@/types';
import { toast } from 'sonner';
import {
  fetchTables, addTable, deleteTable,
  fetchMenuItems, addMenuItem, deleteMenuItem,
  fetchOrders, addOrder,
  getInitialTables, getInitialMenuItems,
  clearCache, forceRefresh
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

  const availableCoupons: Coupon[] = [
    { code: 'SHUBHAM50', discount: 50, type: 'percentage' },
    { code: 'PRINCE10', discount: 10, type: 'percentage' },
  ];

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

  const refreshTables = useCallback(async (): Promise<boolean> => {
    try {
      const data = await fetchTables();
      setTables(data);
      return true;
    } catch (error) {
      console.error("Failed to refresh tables:", error);
      return false;
    }
  }, []);

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

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  const addToCart = (item: MenuItem, quantity: number, variant?: 'half' | 'full', notes?: string) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => 
          cartItem.menuItem.id === item.id && 
          (typeof item.price !== 'object' || cartItem.variant === variant)
      );

      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        toast.success(`Added ${item.name} to cart`);
        return updatedCart;
      } else {
        toast.success(`Added ${item.name} to cart`);
        return [...prevCart, { menuItem: item, quantity, variant, notes }];
      }
    });
  };

  const removeFromCart = (itemId: string, variant?: 'half' | 'full') => {
    setCart((prevCart) => {
      return prevCart.filter(
        (item) => 
          !(item.menuItem.id === itemId && 
            (typeof item.menuItem.price !== 'object' || item.variant === variant))
      );
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

  const getDiscountedTotal = () => {
    const total = getCartTotal();
    return discount > 0 ? total * (1 - discount / 100) : total;
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
      items: JSON.parse(JSON.stringify(cart)),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      totalAmount: getDiscountedTotal(),
    };

    try {
      await addOrder(newOrder);
      setOrders((prev) => [...prev, newOrder]);
      clearCart();
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
      const updatedOrders = orders.map(order =>
        order.id === orderId ? { ...order, status } : order
      );
      setOrders(updatedOrders);
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error('Failed to update order status. Please try again.');
    }
  };

  const handleAddTable = async (id: number) => {
    try {
      await addTable(id);
      await refreshTables();
      toast.success(`Table ${id} added successfully`);
    } catch {
      toast.error('Failed to add table');
    }
  };

  const handleDeleteTable = async (id: number) => {
    try {
      await deleteTable(id);
      await refreshTables();
      toast.success(`Table ${id} removed successfully`);
    } catch {
      toast.error('Failed to remove table');
    }
  };

  const handleAddMenuItem = async (item: MenuItem) => {
    try {
      await addMenuItem(item);
      await refreshMenuItems();
      toast.success(`${item.name} added to menu`);
    } catch {
      toast.error('Failed to add menu item');
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      await deleteMenuItem(id);
      await refreshMenuItems();
      toast.success(`Menu item removed successfully`);
    } catch {
      toast.error('Failed to remove menu item');
    }
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const coupon = availableCoupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    if (!coupon) return { success: false, message: `Invalid coupon code: ${code}` };
    setDiscount(coupon.discount);
    setCouponCode(coupon.code);
    return { success: true, message: `${coupon.discount}% discount applied` };
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
        addTable: handleAddTable,
        deleteTable: handleDeleteTable,
        menuItems,
        addMenuItem: handleAddMenuItem,
        deleteMenuItem: handleDeleteMenuItem,
        applyCoupon,
        discount,
        couponCode,
        isLoading,
        refreshMenuItems,
        refreshOrders,
        refreshAllData,
        refreshTables
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