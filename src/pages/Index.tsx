
import React from 'react';
import { OrderProvider } from '@/contexts/OrderContext';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { QrCode, Utensils, Server } from 'lucide-react';

const Index = () => {
  return (
    <OrderProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm p-4">
          <div className="container mx-auto flex justify-center items-center">
            <Logo />
          </div>
        </header>
        
        <main className="container mx-auto p-4 py-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-hungerzblue mb-4">
              Hungerz Hub <span className="text-hungerzorange">Menu Magic</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Welcome to our restaurant menu system! Generate QR codes for tables and manage orders efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <QrCode size={28} className="text-hungerzblue" />
                </div>
                <h2 className="text-xl font-semibold mb-2">QR Code Generator</h2>
                <p className="text-gray-600 mb-4">
                  Generate unique QR codes for each table that customers can scan to view the menu.
                </p>
                <Link to="/qr-generator" className="mt-auto">
                  <Button className="bg-hungerzblue hover:bg-hungerzblue/90">
                    Generate QR Codes
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Utensils size={28} className="text-hungerzorange" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Customer Menu</h2>
                <p className="text-gray-600 mb-4">
                  Browse the digital menu, add items to cart, and place orders directly from the table.
                </p>
                <Link to="/menu" className="mt-auto">
                  <Button className="bg-hungerzorange hover:bg-hungerzorange/90">
                    View Menu
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Server size={28} className="text-green-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
                <p className="text-gray-600 mb-4">
                  Manage incoming orders, update order statuses, and keep track of all restaurant activities.
                </p>
                <Link to="/login" className="mt-auto">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Admin Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>

        <footer className="bg-hungerzblue text-white py-4 mt-10">
          <div className="container mx-auto text-center">
            <p>© 2025 Hungerz Hub - The taste what you want...</p>
          </div>
        </footer>
      </div>
    </OrderProvider>
  );
};

export default Index;
