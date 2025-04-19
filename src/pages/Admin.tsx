
import React, { useState } from 'react';
import { OrderProvider } from '@/contexts/OrderContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info } from 'lucide-react';
import Logo from '@/components/Logo';
import { useOrder } from '@/contexts/OrderContext';
import OrderItem from '@/components/OrderItem';

const AdminContent = () => {
  const { orders } = useOrder();

  const pendingOrders = orders.filter(order => order.status === 'PENDING');
  const cookingOrders = orders.filter(order => order.status === 'COOKING');
  const deliveredOrders = orders.filter(order => order.status === 'DELIVERED');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-1 text-hungerzblue hover:text-hungerzorange">
              <ArrowLeft size={18} />
              Back to Home
            </Button>
          </Link>
          <Logo />
          <div className="w-24"></div>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-hungerzblue mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage orders and track restaurant activities</p>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingOrders.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-hungerzorange text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {pendingOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="cooking">
              Cooking
              {cookingOrders.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {cookingOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingOrders.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                  <Info size={48} className="mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium">No pending orders</h3>
                  <p className="text-sm">New orders will appear here</p>
                </div>
              ) : (
                pendingOrders.map(order => (
                  <OrderItem key={order.id} order={order} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="cooking">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cookingOrders.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                  <Info size={48} className="mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium">No orders in cooking</h3>
                  <p className="text-sm">Orders being prepared will appear here</p>
                </div>
              ) : (
                cookingOrders.map(order => (
                  <OrderItem key={order.id} order={order} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="delivered">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deliveredOrders.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                  <Info size={48} className="mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium">No delivered orders</h3>
                  <p className="text-sm">Completed orders will appear here</p>
                </div>
              ) : (
                deliveredOrders.map(order => (
                  <OrderItem key={order.id} order={order} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-hungerzblue text-white py-4 mt-10">
        <div className="container mx-auto text-center">
          <p>© 2025 Hungerz Hub - The taste what you want...</p>
        </div>
      </footer>
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
