
import { MenuItem, Order } from '@/types';
import { menuItems as initialMenuItems } from '@/data/menuData';

// Base URLs for the data files
const BASE_API_URL = 'https://www.techshubh.com/api';

// Runtime memory cache to ensure data consistency across components
let runtimeCache = {
  tables: null as number[] | null,
  menuItems: null as MenuItem[] | null,
  orders: null as Order[] | null,
  lastFetchTime: {
    tables: 0,
    menuItems: 0,
    orders: 0
  }
};

// Fetch data with cache control
export async function fetchData<T>(endpoint: string, forceRefresh = false): Promise<T> {
  try {
    // Get current time
    const now = Date.now();
    
    // Check if we should use cached data (cache valid for 10 seconds unless force refresh)
    const cacheKey = endpoint.split('.')[0] as 'tables' | 'menu' | 'orders';
    const mappedKey = cacheKey === 'menu' ? 'menuItems' : cacheKey;
    
    if (
      !forceRefresh && 
      runtimeCache[mappedKey] !== null && 
      (now - runtimeCache.lastFetchTime[cacheKey]) < 10000
    ) {
      console.log(`Using runtime cache for ${endpoint}, age: ${(now - runtimeCache.lastFetchTime[cacheKey]) / 1000}s`);
      return [...runtimeCache[mappedKey]] as unknown as T;
    }
    
    // Add cache-busting query param
    const cacheBuster = `?t=${Date.now()}`;
    const url = `${BASE_API_URL}/${endpoint}.json${cacheBuster}`;
    
    console.log(`Fetching fresh data from ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${endpoint} data:`, data);
    
    // Update runtime cache
    if (cacheKey === 'tables') {
      runtimeCache.tables = [...data];
      runtimeCache.lastFetchTime.tables = now;
    } else if (cacheKey === 'menu') {
      runtimeCache.menuItems = [...data];
      runtimeCache.lastFetchTime.menuItems = now;
    } else if (cacheKey === 'orders') {
      runtimeCache.orders = [...data];
      runtimeCache.lastFetchTime.orders = now;
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    // Return default values if API fails
    return getDefaultData(endpoint) as unknown as T;
  }
}

// Save data with immediate cache update
export async function saveData<T>(endpoint: string, data: T): Promise<boolean> {
  try {
    console.log(`Saving data to ${BASE_API_URL}/${endpoint}:`, data);
    
    // Add cache-busting query param
    const cacheBuster = `?t=${Date.now()}`;
    const url = `${BASE_API_URL}/${endpoint}${cacheBuster}`;
    
    const response = await fetch(url, {
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
    
    // Immediately update runtime cache to ensure consistency
    updateRuntimeCache(endpoint, data);
    return true;
  } catch (error) {
    console.error(`Error saving ${endpoint}:`, error);
    // Still update runtime cache even if API fails to ensure UI consistency
    updateRuntimeCache(endpoint, data);
    return false;
  }
}

// Get default data
function getDefaultData(endpoint: string): any {
  switch (endpoint) {
    case 'tables': return getInitialTables();
    case 'menu': return getInitialMenuItems();
    case 'orders': return [];
    default: return [];
  }
}

// Update runtime cache
function updateRuntimeCache<T>(endpoint: string, data: T): void {
  const now = Date.now();
  
  if (endpoint === 'tables') {
    runtimeCache.tables = [...data as unknown as number[]];
    runtimeCache.lastFetchTime.tables = now;
  } else if (endpoint === 'menu') {
    runtimeCache.menuItems = [...data as unknown as MenuItem[]];
    runtimeCache.lastFetchTime.menuItems = now;
  } else if (endpoint === 'orders') {
    runtimeCache.orders = [...data as unknown as Order[]];
    runtimeCache.lastFetchTime.orders = now;
  }
}

// Tables API
export async function fetchTables(forceRefresh = false): Promise<number[]> {
  const tables = await fetchData<number[]>('tables', forceRefresh);
  return tables && tables.length > 0 ? [...tables] : getInitialTables();
}

export async function saveTables(tables: number[]): Promise<boolean> {
  return await saveData('tables', tables);
}

// Menu items API
export async function fetchMenuItems(forceRefresh = false): Promise<MenuItem[]> {
  const menuItems = await fetchData<MenuItem[]>('menu', forceRefresh);
  return menuItems && menuItems.length > 0 ? [...menuItems] : getInitialMenuItems();
}

export async function saveMenuItems(menuItems: MenuItem[]): Promise<boolean> {
  return await saveData('menu', menuItems);
}

// Orders API
export async function fetchOrders(forceRefresh = false): Promise<Order[]> {
  const orders = await fetchData<Order[]>('orders', forceRefresh);
  return orders ? [...orders] : [];
}

export async function saveOrders(orders: Order[]): Promise<boolean> {
  return await saveData('orders', orders);
}

// Initial data
export const getInitialTables = (): number[] => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
};

export const getInitialMenuItems = (): MenuItem[] => {
  return initialMenuItems;
};

// Clear runtime cache
export const clearCache = () => {
  runtimeCache = {
    tables: null,
    menuItems: null,
    orders: null,
    lastFetchTime: {
      tables: 0,
      menuItems: 0,
      orders: 0
    }
  };
  console.log("Runtime cache cleared");
};

// Force refresh all data
export const forceRefresh = async () => {
  clearCache();
  
  // Fetch fresh data with force refresh flag
  console.log("Forcing refresh of all data...");
  
  try {
    await Promise.all([
      fetchTables(true),
      fetchMenuItems(true),
      fetchOrders(true)
    ]);
    console.log("All data refreshed successfully");
    return true;
  } catch (error) {
    console.error("Error during force refresh:", error);
    return false;
  }
};

// Helper function to get current cached state (useful for debugging)
export const getCurrentCacheState = () => {
  return {
    tables: runtimeCache.tables ? runtimeCache.tables.length : 0,
    menuItems: runtimeCache.menuItems ? runtimeCache.menuItems.length : 0,
    orders: runtimeCache.orders ? runtimeCache.orders.length : 0,
    lastFetchTime: {
      tables: new Date(runtimeCache.lastFetchTime.tables).toISOString(),
      menuItems: new Date(runtimeCache.lastFetchTime.menuItems).toISOString(),
      orders: new Date(runtimeCache.lastFetchTime.orders).toISOString()
    }
  };
};
