
import { MenuItem, Order } from '@/types';
import { menuItems as initialMenuItems } from '@/data/menuData';

// Base URLs for the data files
const BASE_API_URL = 'https://www.techshubh.com/api';

// Helper function to fetch data from JSON
export async function fetchData<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${BASE_API_URL}/${endpoint}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [] as unknown as T;
  }
}

// Helper function to save data to JSON via API
export async function saveData<T>(endpoint: string, data: T): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save ${endpoint}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error saving ${endpoint}:`, error);
    return false;
  }
}

// Specific functions for tables
export async function fetchTables(): Promise<number[]> {
  return fetchData<number[]>('tables');
}

export async function saveTables(tables: number[]): Promise<boolean> {
  return saveData('tables', tables);
}

// Specific functions for menu items
export async function fetchMenuItems(): Promise<MenuItem[]> {
  return fetchData<MenuItem[]>('menu');
}

export async function saveMenuItems(menuItems: MenuItem[]): Promise<boolean> {
  return saveData('menu', menuItems);
}

// Specific functions for orders
export async function fetchOrders(): Promise<Order[]> {
  return fetchData<Order[]>('orders');
}

export async function saveOrders(orders: Order[]): Promise<boolean> {
  return saveData('orders', orders);
}

// Fallback to initial data if API fails
export const getInitialTables = (): number[] => {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
};

export const getInitialMenuItems = (): MenuItem[] => {
  // Use directly imported menuItems instead of require
  return initialMenuItems;
};
