
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
    runtimeCache.tables = [...tables];
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
    runtimeCache.menuItems = [...menuItems];
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
    runtimeCache.orders = [...orders];
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

