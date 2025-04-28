
import { MenuItem, Order } from '@/types';
import { menuItems as initialMenuItems } from '@/data/menuData';
import { tables as initialTables } from '@/data/tablesData';
import { orders as initialOrders } from '@/data/ordersData';
import * as fileStorage from './fileStorage';

// Runtime memory cache
const runtimeCache = {
  tables: [...initialTables],
  menuItems: [...initialMenuItems],
  orders: [...initialOrders]
};

// Initialize storage with initial data
const initializeStorage = async () => {
  try {
    // Check if we have stored data
    const storedTables = localStorage.getItem('/data/tables.json');
    const storedMenu = localStorage.getItem('/data/menu.json');
    const storedOrders = localStorage.getItem('/data/orders.json');
    
    // If no stored data, initialize with defaults
    if (!storedTables) {
      await fileStorage.saveTables(initialTables);
    }
    
    if (!storedMenu) {
      await fileStorage.saveMenuItems(initialMenuItems);
    }
    
    if (!storedOrders) {
      await fileStorage.saveOrders(initialOrders);
    }
  } catch (error) {
    console.error("Error initializing storage:", error);
  }
};

// Run initialization
initializeStorage();

// Tables operations
export async function fetchTables(): Promise<number[]> {
  try {
    const tables = await fileStorage.fetchTables();
    runtimeCache.tables = [...tables];
    return tables;
  } catch (error) {
    console.error("Error fetching tables:", error);
    return runtimeCache.tables;
  }
}

export async function saveTables(tables: number[]): Promise<boolean> {
  try {
    // Update the runtime cache
    runtimeCache.tables = [...tables];
    
    // Save to persistent storage
    await fileStorage.saveTables(tables);
    
    // Simulate file update for debugging
    console.log("Tables updated:", tables);
    
    return true;
  } catch (error) {
    console.error("Error saving tables:", error);
    return false;
  }
}

// Menu items operations
export async function fetchMenuItems(): Promise<MenuItem[]> {
  try {
    const menuItems = await fileStorage.fetchMenuItems();
    if (menuItems && menuItems.length > 0) {
      runtimeCache.menuItems = [...menuItems];
      return menuItems;
    }
    return runtimeCache.menuItems;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return runtimeCache.menuItems;
  }
}

export async function saveMenuItems(menuItems: MenuItem[]): Promise<boolean> {
  try {
    // Update the runtime cache
    runtimeCache.menuItems = [...menuItems];
    
    // Save to persistent storage
    await fileStorage.saveMenuItems(menuItems);
    
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
  try {
    const orders = await fileStorage.fetchOrders();
    if (orders && orders.length > 0) {
      runtimeCache.orders = [...orders];
      return orders;
    }
    return runtimeCache.orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return runtimeCache.orders;
  }
}

export async function saveOrders(orders: Order[]): Promise<boolean> {
  try {
    // Update the runtime cache
    runtimeCache.orders = [...orders];
    
    // Save to persistent storage
    await fileStorage.saveOrders(orders);
    
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
    
    // Reset persistent storage to defaults
    await fileStorage.saveTables(initialTables);
    await fileStorage.saveMenuItems(initialMenuItems);
    await fileStorage.saveOrders(initialOrders);
    
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
  
  // Clear persistent storage
  fileStorage.clearStorage();
  
  console.log("Runtime cache cleared");
};
