
import { MenuItem, Order } from '@/types';

// Initial data paths
const FILES = {
  TABLES: '/data/tables.json',
  MENU_ITEMS: '/data/menu.json',
  ORDERS: '/data/orders.json'
};

// Function to load data from JSON file
export async function loadData<T>(filePath: string): Promise<T> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load data from ${filePath}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading data from ${filePath}:`, error);
    throw error;
  }
}

// Function to simulate saving data (in a real app, this would make API calls)
export async function saveData<T>(filePath: string, data: T): Promise<boolean> {
  try {
    // In a browser environment, we can't directly write to files
    // This would be an API call in a real app
    console.log(`Data would be saved to ${filePath}:`, data);
    
    // Store in localStorage as a temporary solution
    localStorage.setItem(filePath, JSON.stringify(data));
    
    return true;
  } catch (error) {
    console.error(`Error saving data to ${filePath}:`, error);
    return false;
  }
}

// Function to get data with localStorage fallback
export async function getData<T>(filePath: string, initialData: T): Promise<T> {
  try {
    // First try localStorage
    const storedData = localStorage.getItem(filePath);
    if (storedData) {
      return JSON.parse(storedData);
    }
    
    // If not in localStorage, try to fetch from file
    return await loadData<T>(filePath);
  } catch (error) {
    // If both fail, return initial data and save it
    console.log(`Initializing data for ${filePath}`);
    await saveData(filePath, initialData);
    return initialData;
  }
}

// Tables operations
export async function fetchTables(): Promise<number[]> {
  const initialTables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return await getData<number[]>(FILES.TABLES, initialTables);
}

export async function saveTables(tables: number[]): Promise<boolean> {
  return await saveData(FILES.TABLES, tables);
}

// Menu items operations
export async function fetchMenuItems(): Promise<MenuItem[]> {
  return await getData<MenuItem[]>(FILES.MENU_ITEMS, []);
}

export async function saveMenuItems(menuItems: MenuItem[]): Promise<boolean> {
  return await saveData(FILES.MENU_ITEMS, menuItems);
}

// Orders operations
export async function fetchOrders(): Promise<Order[]> {
  return await getData<Order[]>(FILES.ORDERS, []);
}

export async function saveOrders(orders: Order[]): Promise<boolean> {
  return await saveData(FILES.ORDERS, orders);
}

// Reset all data
export const clearStorage = (): void => {
  localStorage.removeItem(FILES.TABLES);
  localStorage.removeItem(FILES.MENU_ITEMS);
  localStorage.removeItem(FILES.ORDERS);
  console.log("Storage cleared");
};
