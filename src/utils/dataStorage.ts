
import { MenuItem, Order } from '@/types';
import * as fileStorage from './fileStorage';

// Initial data paths
const FILES = {
  TABLES: '/data/tables.json',
  MENU_ITEMS: '/data/menu.json',
  ORDERS: '/data/orders.json'
};

// Runtime memory cache
const runtimeCache = {
  tables: [] as number[],
  menuItems: [] as MenuItem[],
  orders: [] as Order[]
};

// Initialize storage
const initializeStorage = async () => {
  try {
    // Load data from JSON files
    const [tables, menuItems, orders] = await Promise.all([
      fileStorage.fetchTables(),
      fileStorage.fetchMenuItems(),
      fileStorage.fetchOrders()
    ]);
    
    // Initialize runtime cache
    runtimeCache.tables = [...tables];
    runtimeCache.menuItems = [...menuItems];
    runtimeCache.orders = [...orders];
    
    console.log('Storage initialized with data from JSON files');
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
    
    // Save to JSON file (simulated)
    await fileStorage.saveTables(tables);
    
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
    runtimeCache.menuItems = [...menuItems];
    return menuItems;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return runtimeCache.menuItems;
  }
}

export async function saveMenuItems(menuItems: MenuItem[]): Promise<boolean> {
  try {
    // Update the runtime cache
    runtimeCache.menuItems = [...menuItems];
    
    // Save to JSON file (simulated)
    await fileStorage.saveMenuItems(menuItems);
    
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
    runtimeCache.orders = [...orders];
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return runtimeCache.orders;
  }
}

export async function saveOrders(orders: Order[]): Promise<boolean> {
  try {
    // Update the runtime cache
    runtimeCache.orders = [...orders];
    
    // Save to JSON file (simulated)
    await fileStorage.saveOrders(orders);
    
    console.log("Orders updated:", orders);
    
    return true;
  } catch (error) {
    console.error("Error saving orders:", error);
    return false;
  }
}

// Initial data getters
export const getInitialTables = (): number[] => {
  return [...runtimeCache.tables];
};

export const getInitialMenuItems = (): MenuItem[] => {
  return [...runtimeCache.menuItems];
};

// Force refresh all data from JSON files
export const forceRefresh = async () => {
  try {
    // Reload from JSON files
    const [tables, menuItems, orders] = await Promise.all([
      fileStorage.fetchTables(),
      fileStorage.fetchMenuItems(),
      fileStorage.fetchOrders()
    ]);
    
    // Update runtime cache
    runtimeCache.tables = [...tables];
    runtimeCache.menuItems = [...menuItems];
    runtimeCache.orders = [...orders];
    
    return true;
  } catch (error) {
    console.error("Error during force refresh:", error);
    return false;
  }
};

// Clear cache and reset to initial data from JSON files
export const clearCache = () => {
  runtimeCache.tables = [];
  runtimeCache.menuItems = [];
  runtimeCache.orders = [];
  
  // Clear localStorage
  fileStorage.clearStorage();
  
  // Reinitialize from JSON files
  initializeStorage();
  
  console.log("Runtime cache cleared");
};
