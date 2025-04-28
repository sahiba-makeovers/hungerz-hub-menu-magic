
import { MenuItem, Order } from '@/types';
import { menuItems as initialMenuItems } from '@/data/menuData';
import { tables as initialTables } from '@/data/tablesData';
import { orders as initialOrders } from '@/data/ordersData';

// Runtime memory cache
const runtimeCache = {
  tables: [...initialTables],
  menuItems: [...initialMenuItems],
  orders: [...initialOrders]
};

// Tables operations
export async function fetchTables(): Promise<number[]> {
  return [...runtimeCache.tables];
}

export async function saveTables(tables: number[]): Promise<boolean> {
  try {
    // Update the runtime cache
    runtimeCache.tables = [...tables];
    
    // Here we would update the file directly if we were in a Node.js environment
    // For frontend-only app, we'll have to simulate this behavior
    console.log("Tables updated:", tables);
    
    // In a real implementation, this would send an API request to update the file
    // For now, we'll just return true to simulate success
    return true;
  } catch (error) {
    console.error("Error saving tables:", error);
    return false;
  }
}

// Menu items operations
export async function fetchMenuItems(): Promise<MenuItem[]> {
  return [...runtimeCache.menuItems];
}

export async function saveMenuItems(menuItems: MenuItem[]): Promise<boolean> {
  try {
    // Update the runtime cache
    runtimeCache.menuItems = [...menuItems];
    
    // Simulate file update
    console.log("Menu items updated:", menuItems);
    
    return true;
  } catch (error) {
    console.error("Error saving menu items:", error);
    return false;
  }
}

// Orders operations
export async function fetchOrders(): Promise<Order[]> {
  return [...runtimeCache.orders];
}

export async function saveOrders(orders: Order[]): Promise<boolean> {
  try {
    // Update the runtime cache
    runtimeCache.orders = [...orders];
    
    // Simulate file update
    console.log("Orders updated:", orders);
    
    return true;
  } catch (error) {
    console.error("Error saving orders:", error);
    return false;
  }
}

// Initial data getters
export const getInitialTables = (): number[] => {
  return [...initialTables];
};

export const getInitialMenuItems = (): MenuItem[] => {
  return [...initialMenuItems];
};

// Force refresh all data
export const forceRefresh = async () => {
  try {
    runtimeCache.tables = [...initialTables];
    runtimeCache.menuItems = [...initialMenuItems];
    runtimeCache.orders = [...initialOrders];
    return true;
  } catch (error) {
    console.error("Error during force refresh:", error);
    return false;
  }
};

// Clear cache
export const clearCache = () => {
  runtimeCache.tables = [...initialTables];
  runtimeCache.menuItems = [...initialMenuItems];
  runtimeCache.orders = [...initialOrders];
  console.log("Runtime cache cleared");
};

// Cache state information for debugging
export const getCurrentCacheState = () => {
  return {
    tables: runtimeCache.tables.length,
    menuItems: runtimeCache.menuItems.length,
    orders: runtimeCache.orders.length
  };
};

// Mock subscription function - in a real app this would set up event listeners
export const subscribeToDataChanges = () => {
  console.log("Subscribed to data changes");
  return () => console.log("Unsubscribed from data changes");
};
