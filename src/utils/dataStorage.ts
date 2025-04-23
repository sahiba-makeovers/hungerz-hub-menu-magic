
import { MenuItem, Order } from '@/types';
import { menuItems as initialMenuItems } from '@/data/menuData';

// Base URLs for the data files
const BASE_API_URL = 'https://www.techshubh.com/api';

// Cache management
let cachedTables: number[] | null = null;
let cachedMenuItems: MenuItem[] | null = null;
let cachedOrders: Order[] | null = null;

// Helper function to fetch data from JSON
export async function fetchData<T>(endpoint: string): Promise<T> {
  try {
    console.log(`Fetching data from ${BASE_API_URL}/${endpoint}.json`);
    const response = await fetch(`${BASE_API_URL}/${endpoint}.json`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${endpoint} data:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [] as unknown as T;
  }
}

// Helper function to save data to JSON via API
export async function saveData<T>(endpoint: string, data: T): Promise<boolean> {
  try {
    console.log(`Saving data to ${BASE_API_URL}/${endpoint}:`, data);
    const response = await fetch(`${BASE_API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save ${endpoint}: ${response.status} ${response.statusText}`);
    }
    
    console.log(`Successfully saved ${endpoint} data`);
    // Update cache after successful save
    if (endpoint === 'tables') cachedTables = data as unknown as number[];
    else if (endpoint === 'menu') cachedMenuItems = data as unknown as MenuItem[];
    else if (endpoint === 'orders') cachedOrders = data as unknown as Order[];
    
    return true;
  } catch (error) {
    console.error(`Error saving ${endpoint}:`, error);
    return false;
  }
}

// Specific functions for tables
export async function fetchTables(): Promise<number[]> {
  if (cachedTables) {
    console.log("Using cached tables data");
    return cachedTables;
  }
  
  const tables = await fetchData<number[]>('tables');
  if (tables && tables.length > 0) {
    cachedTables = tables;
    return tables;
  }
  
  return getInitialTables();
}

export async function saveTables(tables: number[]): Promise<boolean> {
  const success = await saveData('tables', tables);
  if (success) {
    cachedTables = tables;
  }
  return success;
}

// Specific functions for menu items
export async function fetchMenuItems(): Promise<MenuItem[]> {
  if (cachedMenuItems) {
    console.log("Using cached menu items");
    return cachedMenuItems;
  }
  
  const menuItems = await fetchData<MenuItem[]>('menu');
  if (menuItems && menuItems.length > 0) {
    cachedMenuItems = menuItems;
    return menuItems;
  }
  
  return getInitialMenuItems();
}

export async function saveMenuItems(menuItems: MenuItem[]): Promise<boolean> {
  const success = await saveData('menu', menuItems);
  if (success) {
    cachedMenuItems = menuItems;
  }
  return success;
}

// Specific functions for orders
export async function fetchOrders(): Promise<Order[]> {
  if (cachedOrders) {
    console.log("Using cached orders data");
    return cachedOrders;
  }
  
  const orders = await fetchData<Order[]>('orders');
  if (orders) {
    cachedOrders = orders;
    return orders;
  }
  
  return [];
}

export async function saveOrders(orders: Order[]): Promise<boolean> {
  const success = await saveData('orders', orders);
  if (success) {
    cachedOrders = orders;
  }
  return success;
}

// Fallback to initial data if API fails
export const getInitialTables = (): number[] => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
};

export const getInitialMenuItems = (): MenuItem[] => {
  // Use directly imported menuItems instead of require
  return initialMenuItems;
};

// Function to clear cache - useful for debugging or forcing refresh
export const clearCache = () => {
  cachedTables = null;
  cachedMenuItems = null;
  cachedOrders = null;
  console.log("Cache cleared");
};
