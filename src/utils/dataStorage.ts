
import { MenuItem, Order, TableData } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

const runtimeCache = {
  tables: [] as TableData[],
  menuItems: [] as MenuItem[],
  orders: [] as Order[]
};

// Tables operations
export async function fetchTables(): Promise<TableData[]> {
  try {
    const { data, error } = await supabase
      .from('tables')
      .select('*')
      .order('id');
      
    if (error) {
      console.error("Error fetching tables:", error);
      return runtimeCache.tables;
    }
    
    // Transform to match the expected TableData structure
    const formattedData: TableData[] = data.map(table => ({ 
      id: table.id 
    }));
    
    runtimeCache.tables = formattedData;
    return formattedData;
  } catch (error) {
    console.error("Error fetching tables:", error);
    return runtimeCache.tables;
  }
}

export async function addTable(tableId: number): Promise<boolean> {
  try {
    const newTable: TableData = { id: tableId };
    const { error } = await supabase
      .from('tables')
      .insert([{ id: tableId }]);
    
    if (error) {
      console.error("Error adding table:", error);
      return false;
    }
    
    runtimeCache.tables.push(newTable);
    return true;
  } catch (error) {
    console.error("Error adding table:", error);
    return false;
  }
}

export async function deleteTable(tableId: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('tables')
      .delete()
      .eq('id', tableId);
    
    if (error) {
      console.error("Error deleting table:", error);
      return false;
    }
    
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
    const { data, error } = await supabase
      .from('menu_items')
      .select('*');
      
    if (error) {
      console.error("Error fetching menu items:", error);
      return runtimeCache.menuItems;
    }
    
    // Transform to match the expected MenuItem structure
    const formattedData: MenuItem[] = data.map(item => {
      // Handle price based on whether it's a number or an object with half/full
      let price: number | { half: number; full: number };
      
      if (typeof item.price === 'number') {
        price = item.price;
      } else if (item.price && typeof item.price === 'object') {
        // Safely access properties with type checking
        const priceObj = item.price as { [key: string]: any };
        price = {
          half: priceObj.half ? Number(priceObj.half) : 0,
          full: priceObj.full ? Number(priceObj.full) : 0
        };
      } else {
        // Default to 0 if price is not set properly
        price = 0;
      }

      return {
        id: item.id,
        name: item.name,
        price: price,
        category: item.category,
        description: item.description || undefined,
        image: item.image || undefined,
        popular: item.popular || false
      };
    });
    
    runtimeCache.menuItems = formattedData;
    return formattedData;
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return runtimeCache.menuItems;
  }
}

export async function addMenuItem(item: MenuItem): Promise<boolean> {
  try {
    // Transform the price to store in Supabase
    let priceToStore;
    if (typeof item.price === 'number') {
      priceToStore = item.price;
    } else {
      priceToStore = {
        half: item.price.half,
        full: item.price.full
      };
    }

    // Don't include the ID field, let Supabase generate a proper UUID
    const { error } = await supabase
      .from('menu_items')
      .insert([{
        name: item.name,
        price: priceToStore,
        category: item.category,
        description: item.description,
        image: item.image,
        popular: item.popular || false
      }]);
    
    if (error) {
      console.error("Error saving menu item:", error);
      return false;
    }
    
    // After successful insert, refresh the menu items to get the server-generated ID
    await fetchMenuItems();
    return true;
  } catch (error) {
    console.error("Error saving menu item:", error);
    return false;
  }
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting menu item:", error);
      return false;
    }
    
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
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching orders:", error);
      return runtimeCache.orders;
    }
    
    // Transform to match the expected Order structure
    const formattedData: Order[] = data.map(order => {
      // Parse items from JSON to CartItem array
      const itemsData = typeof order.items === 'string' 
        ? JSON.parse(order.items) 
        : order.items;

      return {
        id: order.id,
        tableId: order.table_id,
        items: Array.isArray(itemsData) ? itemsData : [],
        status: order.status as 'PENDING' | 'COOKING' | 'DELIVERED',
        createdAt: order.created_at,
        totalAmount: Number(order.total_amount),
        paymentStatus: (order.payment_status || 'UNPAID') as 'PAID' | 'UNPAID',
        paymentMethod: order.payment_method,
        paymentDate: order.payment_date
      };
    });
    
    runtimeCache.orders = formattedData;
    return formattedData;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return runtimeCache.orders;
  }
}

export async function addOrder(order: Order): Promise<boolean> {
  try {
    // We need to stringify the items to make sure they're stored properly in the JSON field
    const orderData = {
      id: order.id,
      table_id: order.tableId,
      items: JSON.stringify(order.items),
      status: order.status,
      total_amount: order.totalAmount,
      payment_status: order.paymentStatus || 'UNPAID',
      payment_method: order.paymentMethod,
      payment_date: order.paymentDate
    };

    const { error } = await supabase
      .from('orders')
      .insert([orderData]);
    
    if (error) {
      console.error("Error saving order:", error);
      return false;
    }
    
    runtimeCache.orders.push(order);
    return true;
  } catch (error) {
    console.error("Error saving order:", error);
    return false;
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: 'PENDING' | 'COOKING' | 'DELIVERED'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
      
    if (error) {
      console.error("Error updating order status:", error);
      return false;
    }
    
    // Update local cache
    const orderIndex = runtimeCache.orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      runtimeCache.orders[orderIndex].status = status;
    }
    
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    return false;
  }
}

// Update order payment
export async function updateOrderPayment(
  orderId: string, 
  paymentStatus: 'PAID' | 'UNPAID',
  paymentMethod?: string
): Promise<boolean> {
  try {
    const updateData: any = { 
      payment_status: paymentStatus 
    };
    
    if (paymentStatus === 'PAID') {
      updateData.payment_date = new Date().toISOString();
      if (paymentMethod) {
        updateData.payment_method = paymentMethod;
      }
    }
    
    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);
      
    if (error) {
      console.error("Error updating payment status:", error);
      return false;
    }
    
    // Update local cache
    const orderIndex = runtimeCache.orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      runtimeCache.orders[orderIndex].paymentStatus = paymentStatus;
      if (paymentMethod) {
        runtimeCache.orders[orderIndex].paymentMethod = paymentMethod;
      }
      if (paymentStatus === 'PAID') {
        runtimeCache.orders[orderIndex].paymentDate = new Date().toISOString();
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error updating payment status:", error);
    return false;
  }
}

// Initial data getters
export const getInitialTables = (): TableData[] => [...runtimeCache.tables];
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
