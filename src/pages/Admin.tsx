
import React, { useState, useEffect } from "react";
import { OrderProvider, useOrder } from "@/contexts/OrderContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminFooter from "@/components/admin/AdminFooter";
import OrdersList from "@/components/admin/OrdersList";
import TablesManager from "@/components/admin/TablesManager";
import MenuItemManager from "@/components/admin/MenuItemManager";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminContent = () => {
  const {
    orders,
    tables,
    addTable,
    deleteTable,
    addMenuItem,
    deleteMenuItem,
    menuItems,
    refreshTables,
    refreshMenuItems,
  } = useOrder();
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  const pendingOrders = orders.filter((order) => order.status === "PENDING");
  const cookingOrders = orders.filter((order) => order.status === "COOKING");
  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED"
  );

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onLogout={handleLogout} />

      <main className="container mx-auto p-2 sm:p-4 py-4 sm:py-8 max-w-6xl">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-hungerzblue mb-1 sm:mb-2">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Manage orders, tables, and menu items</p>
        </div>

        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className={`grid ${isMobile ? 'grid-cols-3 mb-3' : 'sm:grid-cols-5 mb-6'} w-full`}>
            <TabsTrigger value="pending" className="relative text-xs sm:text-sm">
              Pending
              {pendingOrders.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-hungerzorange text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs">
                  {pendingOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="cooking" className="relative text-xs sm:text-sm">
              Cooking
              {cookingOrders.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs">
                  {cookingOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="delivered" className="text-xs sm:text-sm">Delivered</TabsTrigger>
            {!isMobile && (
              <>
                <TabsTrigger value="tables" className="text-xs sm:text-sm">Tables</TabsTrigger>
                <TabsTrigger value="menu" className="text-xs sm:text-sm">Menu</TabsTrigger>
              </>
            )}
          </TabsList>

          {isMobile && (
            <TabsList className="grid grid-cols-2 mb-3 w-full">
              <TabsTrigger value="tables" className="text-xs sm:text-sm">Tables</TabsTrigger>
              <TabsTrigger value="menu" className="text-xs sm:text-sm">Menu</TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="pending">
            <OrdersList orders={orders} status="PENDING" />
          </TabsContent>

          <TabsContent value="cooking">
            <OrdersList orders={orders} status="COOKING" />
          </TabsContent>

          <TabsContent value="delivered">
            <OrdersList orders={orders} status="DELIVERED" />
          </TabsContent>

          <TabsContent value="tables">
            <TablesManager 
              tables={tables} 
              addTable={addTable} 
              deleteTable={deleteTable} 
              refreshTables={refreshTables} 
            />
          </TabsContent>

          <TabsContent value="menu">
            <MenuItemManager 
              menuItems={menuItems} 
              addMenuItem={addMenuItem} 
              deleteMenuItem={deleteMenuItem} 
              refreshMenuItems={refreshMenuItems} 
            />
          </TabsContent>
        </Tabs>
      </main>

      <AdminFooter />
    </div>
  );
};

const Admin = () => {
  return (
    <OrderProvider>
      <AdminContent />
    </OrderProvider>
  );
};

export default Admin;
