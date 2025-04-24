
import { MenuItem, Order } from '@/types';
import { menuItems as initialMenuItems } from '@/data/menuData';

// Base URLs for the data files
const BASE_API_URL = 'https://www.techshubh.com/api';

// Runtime memory cache with last fetch timestamps and data versions
const runtimeCache = {
  tables: null as number[] | null,
  menuItems: null as MenuItem[] | null,
  orders: null as Order[] | null,
  lastFetchTime: {
    tables: 0,
    menuItems: 0,
    orders: 0
  },
  dataVersion: {
    tables: 0,
    menuItems: 0,
    orders: 0
  }
};

// Enhanced fetch with automatic retry and better caching
export async function fetchData<T>(endpoint: string, forceRefresh = false): Promise<T> {
  try {
    const now = Date.now();
    const cacheKey = endpoint.split('.')[0] as 'tables' | 'menu' | 'orders';
    const mappedKey = cacheKey === 'menu' ? 'menuItems' : cacheKey;
    
    // Use cache only if not forcing refresh and cache is valid (5 seconds max age)
    if (
      !forceRefresh && 
      runtimeCache[mappedKey] !== null && 
      (now - runtimeCache.lastFetchTime[cacheKey]) < 5000
    ) {
      console.log(`Using runtime cache for ${endpoint}, age: ${(now - runtimeCache.lastFetchTime[cacheKey]) / 1000}s`);
      return JSON.parse(JSON.stringify(runtimeCache[mappedKey])) as T;
    }
    
    // Always add timestamp to prevent browser caching
    const cacheBuster = `?t=${now}`;
    const url = `${BASE_API_URL}/${endpoint}.json${cacheBuster}`;
    
    console.log(`Fetching fresh data from ${url}`);
    
    // Implement retry logic
    let retries = 3;
    let response = null;
    
    while (retries > 0) {
      try {
        response = await fetch(url, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
          // Shorter timeout for better user experience
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) break;
        retries--;
      } catch (err) {
        console.warn(`Fetch attempt failed, retries left: ${retries}`, err);
        retries--;
        if (retries === 0) throw err;
        // Wait before retry
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    
    if (!response || !response.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${response?.status} ${response?.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched ${endpoint} data:`, data);
    
    // Validate data before caching
    if (Array.isArray(data)) {
      // Update runtime cache atomically
      if (cacheKey === 'tables') {
        runtimeCache.tables = [...data];
        runtimeCache.lastFetchTime.tables = now;
        runtimeCache.dataVersion.tables++;
      } else if (cacheKey === 'menu') {
        runtimeCache.menuItems = [...data];
        runtimeCache.lastFetchTime.menuItems = now;
        runtimeCache.dataVersion.menuItems++;
      } else if (cacheKey === 'orders') {
        runtimeCache.orders = [...data];
        runtimeCache.lastFetchTime.orders = now;
        runtimeCache.dataVersion.orders++;
      }
      
      return JSON.parse(JSON.stringify(data)) as T;
    } else {
      console.error(`Invalid data format for ${endpoint}:`, data);
      throw new Error(`Invalid data format for ${endpoint}`);
    }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    // Return default values if API fails, but don't update cache
    return getDefaultData(endpoint) as unknown as T;
  }
}

// Enhanced save with optimistic updates and background sync
export async function saveData<T>(endpoint: string, data: T): Promise<boolean> {
  try {
    console.log(`Saving data to ${BASE_API_URL}/${endpoint}:`, data);
    
    // Immediately update runtime cache for optimistic UI updates
    updateRuntimeCache(endpoint, data);
    
    // Add cache-busting query param
    const cacheBuster = `?t=${Date.now()}`;
    const url = `${BASE_API_URL}/${endpoint}${cacheBuster}`;
    
    // Implement retry logic
    let retries = 3;
    let response = null;
    
    while (retries > 0) {
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
          },
          body: JSON.stringify(data),
          // Shorter timeout for better user experience
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) break;
        retries--;
      } catch (err) {
        console.warn(`Save attempt failed, retries left: ${retries}`, err);
        retries--;
        if (retries === 0) throw err;
        // Wait before retry
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    
    if (!response || !response.ok) {
      throw new Error(`Failed to save ${endpoint}: ${response?.status} ${response?.statusText}`);
    }
    
    console.log(`Successfully saved ${endpoint} data`);
    return true;
  } catch (error) {
    console.error(`Error saving ${endpoint}:`, error);
    return false;
  }
}

// Get default data with improved validation
function getDefaultData(endpoint: string): any {
  switch (endpoint) {
    case 'tables': return getInitialTables();
    case 'menu': return getInitialMenuItems();
    case 'orders': return [];
    default: return [];
  }
}

// Update runtime cache atomically
function updateRuntimeCache<T>(endpoint: string, data: T): void {
  const now = Date.now();
  
  if (endpoint === 'tables') {
    runtimeCache.tables = JSON.parse(JSON.stringify(data)) as number[];
    runtimeCache.lastFetchTime.tables = now;
    runtimeCache.dataVersion.tables++;
  } else if (endpoint === 'menu') {
    runtimeCache.menuItems = JSON.parse(JSON.stringify(data)) as MenuItem[];
    runtimeCache.lastFetchTime.menuItems = now;
    runtimeCache.dataVersion.menuItems++;
  } else if (endpoint === 'orders') {
    runtimeCache.orders = JSON.parse(JSON.stringify(data)) as Order[];
    runtimeCache.lastFetchTime.orders = now;
    runtimeCache.dataVersion.orders++;
  }
}

// Tables API with improved error handling
export async function fetchTables(forceRefresh = false): Promise<number[]> {
  try {
    const tables = await fetchData<number[]>('tables', forceRefresh);
    return tables && tables.length > 0 ? [...tables] : getInitialTables();
  } catch (error) {
    console.error("Error in fetchTables:", error);
    return getInitialTables();
  }
}

export async function saveTables(tables: number[]): Promise<boolean> {
  try {
    return await saveData('tables', tables);
  } catch (error) {
    console.error("Error in saveTables:", error);
    return false;
  }
}

// Menu items API with improved error handling
export async function fetchMenuItems(forceRefresh = false): Promise<MenuItem[]> {
  try {
    const menuItems = await fetchData<MenuItem[]>('menu', forceRefresh);
    return menuItems && menuItems.length > 0 ? [...menuItems] : getInitialMenuItems();
  } catch (error) {
    console.error("Error in fetchMenuItems:", error);
    return getInitialMenuItems();
  }
}

export async function saveMenuItems(menuItems: MenuItem[]): Promise<boolean> {
  try {
    return await saveData('menu', menuItems);
  } catch (error) {
    console.error("Error in saveMenuItems:", error);
    return false;
  }
}

// Orders API with improved error handling
export async function fetchOrders(forceRefresh = false): Promise<Order[]> {
  try {
    const orders = await fetchData<Order[]>('orders', forceRefresh);
    return orders ? [...orders] : [];
  } catch (error) {
    console.error("Error in fetchOrders:", error);
    return [];
  }
}

export async function saveOrders(orders: Order[]): Promise<boolean> {
  try {
    return await saveData('orders', orders);
  } catch (error) {
    console.error("Error in saveOrders:", error);
    return false;
  }
}

// Initial data
export const getInitialTables = (): number[] => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
};

export const getInitialMenuItems = (): MenuItem[] => {
  return initialMenuItems;
};

// Cache management utilities
export const clearCache = () => {
  runtimeCache.tables = null;
  runtimeCache.menuItems = null;
  runtimeCache.orders = null;
  runtimeCache.lastFetchTime.tables = 0;
  runtimeCache.lastFetchTime.menuItems = 0;
  runtimeCache.lastFetchTime.orders = 0;
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

// Helper function to get current cached state
export const getCurrentCacheState = () => {
  return {
    tables: runtimeCache.tables ? runtimeCache.tables.length : 0,
    menuItems: runtimeCache.menuItems ? runtimeCache.menuItems.length : 0,
    orders: runtimeCache.orders ? runtimeCache.orders.length : 0,
    dataVersions: { ...runtimeCache.dataVersion },
    lastFetchTime: {
      tables: new Date(runtimeCache.lastFetchTime.tables).toISOString(),
      menuItems: new Date(runtimeCache.lastFetchTime.menuItems).toISOString(),
      orders: new Date(runtimeCache.lastFetchTime.orders).toISOString()
    }
  };
};

// Subscribe to data changes
export const subscribeToDataChanges = (callback: () => void) => {
  // This is a placeholder for a more advanced implementation
  // In a real app, we could use WebSockets or Server-Sent Events
  const intervalId = setInterval(() => {
    const promises = [
      fetchTables(true),
      fetchMenuItems(true), 
      fetchOrders(true)
    ];
    
    Promise.all(promises)
      .then(() => callback())
      .catch(error => console.error("Error in data subscription:", error));
  }, 10000); // Poll every 10 seconds
  
  return () => clearInterval(intervalId); // Return unsubscribe function
};
