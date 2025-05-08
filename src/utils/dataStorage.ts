import { MenuItem, Order } from '@/types';

const BASE_URL = 'http://localhost:5000';

const runtimeCache = {
  tables: [] as number[],
  menuItems: [] as MenuItem[],
  orders: [] as Order[]
};

// Tables operations
export async function fetchTables(): Promise<number[]> {
  try {
    const res = await fetch(`${BASE_URL}/tables`);
    const data = await res.json();
    const tableIds = data.map((table: { id: number }) => table.id);
    runtimeCache.tables = tableIds;
    return tableIds;
  } catch (error) {
    console.error("Error fetching tables:", error);
    return runtimeCache.tables;
  }
}

export async function addTable(tableId: number): Promise<boolean> {
  try {
    await fetch(`${BASE_URL}/tables`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: tableId })
    });
    runtimeCache.tables.push(tableId);
    return true;
  } catch (error) {
    console.error("Error adding table:", error);
    return false;
  }
}

export async function deleteTable(tableId: number): Promise<boolean> {
  try {
    await fetch(`${BASE_URL}/tables/${tableId}`, { method: 'DELETE' });
    runtimeCache.tables = runtimeCache.tables.filter(table => table.id !== tableId);
    return true;
  } catch (error) {
    console.error("Error deleting table:", error);
    return false;
  }
}


// Menu items operations
export async function fetchMenuItems(): Promise<MenuItem[]> {
  try {
    const res = await fetch(`${BASE_URL}/menuItems`);
    const data = await res.json();
    runtimeCache.menuItems = data;
    return data;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return runtimeCache.menuItems;
  }
}

export async function addMenuItem(item: MenuItem): Promise<boolean> {
  try {
    await fetch(`${BASE_URL}/menuItems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    runtimeCache.menuItems.push(item);
    return true;
  } catch (error) {
    console.error("Error saving menu item:", error);
    return false;
  }
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  try {
    await fetch(`${BASE_URL}/menuItems/${id}`, { method: 'DELETE' });
    runtimeCache.menuItems = runtimeCache.menuItems.filter(item => item.id !== id);
    return true;
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return false;
  }
}

// Orders operations
export async function fetchOrders(): Promise<Order[]> {
  try {
    const res = await fetch(`${BASE_URL}/orders`);
    const data = await res.json();
    runtimeCache.orders = data;
    return data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return runtimeCache.orders;
  }
}

export async function addOrder(order: Order): Promise<boolean> {
  try {
    await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    runtimeCache.orders.push(order);
    return true;
  } catch (error) {
    console.error("Error saving order:", error);
    return false;
  }
}

// Initial data getters
export const getInitialTables = (): number[] => [...runtimeCache.tables];
export const getInitialMenuItems = (): MenuItem[] => [...runtimeCache.menuItems];

// Force refresh all data
export const forceRefresh = async (): Promise<boolean> => {
  try {
    const [tables, menuItems, orders] = await Promise.all([
      fetchTables(),
      fetchMenuItems(),
      fetchOrders()
    ]);
    runtimeCache.tables = tables;
    runtimeCache.menuItems = menuItems;
    runtimeCache.orders = orders;
    return true;
  } catch (error) {
    console.error("Error during force refresh:", error);
    return false;
  }
};

// Clear cache
export const clearCache = () => {
  runtimeCache.tables = [];
  runtimeCache.menuItems = [];
  runtimeCache.orders = [];
  console.log("Runtime cache cleared");
};
