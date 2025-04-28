
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

// Function to simulate saving data to a JSON file
// In a real app, this would make an API call to a backend that would update the file
export async function saveData<T>(filePath: string, data: T): Promise<boolean> {
  try {
    console.log(`Saving data to ${filePath}:`, data);
    
    // In a real application with a backend, we would call an API endpoint to save the data
    // For now, we'll use localStorage as a temporary solution since we can't directly
    // write to files from the browser
    localStorage.setItem(filePath, JSON.stringify(data));
    
    return true;
  } catch (error) {
    console.error(`Error saving data to ${filePath}:`, error);
    return false;
  }
}

// Function to get data directly from JSON files
export async function getData<T>(filePath: string, initialData: T): Promise<T> {
  try {
    // Always try to load from the JSON file first
    return await loadData<T>(filePath);
  } catch (error) {
    console.error(`Failed to load from ${filePath}, falling back to initial data:`, error);
    // If loading from file fails, initialize with the provided data
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
