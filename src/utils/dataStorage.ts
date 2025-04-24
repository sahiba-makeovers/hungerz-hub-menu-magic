
import { MenuItem, Order } from '@/types';
import { menuItems as initialMenuItems } from '@/data/menuData';

// Base URLs for the data files
const BASE_API_URL = 'https://www.techshubh.com/api';

// Cache management
let cachedTables: number[] | null = null;
let cachedMenuItems: MenuItem[] | null = null;
let cachedOrders: Order[] | null = null;

// Local storage keys
const LOCAL_STORAGE_KEYS = {
  TABLES: 'hungerzhub_tables',
  MENU_ITEMS: 'hungerzhub_menu_items',
  ORDERS: 'hungerzhub_orders'
};

// Helper function to fetch data from JSON with fallback to localStorage
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
    
    // Save to localStorage as backup
    localStorage.setItem(getLocalStorageKey(endpoint), JSON.stringify(data));
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    
    // Try to get from localStorage
    const localData = localStorage.getItem(getLocalStorageKey(endpoint));
    if (localData) {
      console.log(`Retrieving ${endpoint} from localStorage`);
      return JSON.parse(localData) as T;
    }
    
    // Return default values if nothing in localStorage
    return getDefaultData(endpoint) as unknown as T;
  }
}

// Helper function to save data to JSON via API with localStorage fallback
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
    updateCache(endpoint, data);
    
    // Always save to localStorage as backup
    localStorage.setItem(getLocalStorageKey(endpoint), JSON.stringify(data));
    
    return true;
  } catch (error) {
    console.error(`Error saving ${endpoint}:`, error);
    
    // Even if API fails, save to localStorage
    localStorage.setItem(getLocalStorageKey(endpoint), JSON.stringify(data));
    
    // Update cache even on API failure
    updateCache(endpoint, data);
    
    // We return true because we've saved to localStorage
    // This ensures the UI will update even if the API call fails
    return true;
  }
}

// Helper function to get the appropriate localStorage key
function getLocalStorageKey(endpoint: string): string {
  switch (endpoint) {
    case 'tables': return LOCAL_STORAGE_KEYS.TABLES;
    case 'menu': return LOCAL_STORAGE_KEYS.MENU_ITEMS;
    case 'orders': return LOCAL_STORAGE_KEYS.ORDERS;
    default: return `hungerzhub_${endpoint}`;
  }
}

// Helper function to get default data
function getDefaultData(endpoint: string): any {
  switch (endpoint) {
    case 'tables': return getInitialTables();
    case 'menu': return getInitialMenuItems();
    case 'orders': return [];
    default: return [];
  }
}

// Helper function to update cache
function updateCache<T>(endpoint: string, data: T): void {
  switch (endpoint) {
    case 'tables': 
      cachedTables = data as unknown as number[];
      break;
    case 'menu': 
      cachedMenuItems = data as unknown as MenuItem[];
      break;
    case 'orders': 
      cachedOrders = data as unknown as Order[];
      break;
  }
}

// Specific functions for tables
export async function fetchTables(): Promise<number[]> {
  if (cachedTables) {
    console.log("Using cached tables data");
    return [...cachedTables]; // Return a copy to prevent modification
  }
  
  const tables = await fetchData<number[]>('tables');
  if (tables && tables.length > 0) {
    cachedTables = [...tables]; // Store a copy
    return tables;
  }
  
  return getInitialTables();
}

export async function saveTables(tables: number[]): Promise<boolean> {
  const success = await saveData('tables', tables);
  if (success) {
    cachedTables = [...tables]; // Store a copy
    // Immediately sync with localStorage
    localStorage.setItem(LOCAL_STORAGE_KEYS.TABLES, JSON.stringify(tables));
  }
  return success;
}

// Specific functions for menu items
export async function fetchMenuItems(): Promise<MenuItem[]> {
  if (cachedMenuItems) {
    console.log("Using cached menu items");
    return [...cachedMenuItems]; // Return a copy
  }
  
  const menuItems = await fetchData<MenuItem[]>('menu');
  if (menuItems && menuItems.length > 0) {
    cachedMenuItems = [...menuItems]; // Store a copy
    return menuItems;
  }
  
  return getInitialMenuItems();
}

export async function saveMenuItems(menuItems: MenuItem[]): Promise<boolean> {
  const success = await saveData('menu', menuItems);
  if (success) {
    cachedMenuItems = [...menuItems]; // Store a copy
    // Immediately sync with localStorage
    localStorage.setItem(LOCAL_STORAGE_KEYS.MENU_ITEMS, JSON.stringify(menuItems));
  }
  return success;
}

// Specific functions for orders
export async function fetchOrders(): Promise<Order[]> {
  if (cachedOrders) {
    console.log("Using cached orders data");
    return [...cachedOrders]; // Return a copy
  }
  
  const orders = await fetchData<Order[]>('orders');
  if (orders) {
    cachedOrders = [...orders]; // Store a copy
    return orders;
  }
  
  return [];
}

export async function saveOrders(orders: Order[]): Promise<boolean> {
  const success = await saveData('orders', orders);
  if (success) {
    cachedOrders = [...orders]; // Store a copy
    // Immediately sync with localStorage
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }
  return success;
}

// Fallback to initial data if API fails
export const getInitialTables = (): number[] => {
  // Try localStorage first
  const localData = localStorage.getItem(LOCAL_STORAGE_KEYS.TABLES);
  if (localData) {
    try {
      return JSON.parse(localData);
    } catch (e) {
      console.error("Error parsing tables from localStorage:", e);
    }
  }
  // Default tables
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
};

export const getInitialMenuItems = (): MenuItem[] => {
  // Try localStorage first
  const localData = localStorage.getItem(LOCAL_STORAGE_KEYS.MENU_ITEMS);
  if (localData) {
    try {
      return JSON.parse(localData);
    } catch (e) {
      console.error("Error parsing menu items from localStorage:", e);
    }
  }
  // Use directly imported menuItems as fallback
  return initialMenuItems;
};

// Function to clear cache and localStorage - useful for debugging or forcing refresh
export const clearCache = () => {
  cachedTables = null;
  cachedMenuItems = null;
  cachedOrders = null;
  console.log("Cache cleared");
};

// Function to force a full refresh of the data from API
export const forceRefresh = async () => {
  clearCache();
  
  // Clear localStorage as well
  localStorage.removeItem(LOCAL_STORAGE_KEYS.TABLES);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.MENU_ITEMS);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.ORDERS);
  
  // Fetch fresh data
  await Promise.all([
    fetchTables(),
    fetchMenuItems(),
    fetchOrders()
  ]);
  
  console.log("All data refreshed");
};
