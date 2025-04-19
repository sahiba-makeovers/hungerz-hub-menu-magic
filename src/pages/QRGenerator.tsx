
import React from 'react';
import { OrderProvider } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/Logo';
import TableSelection from '@/components/TableSelection';

const QRGenerator = () => {
  return (
    <OrderProvider>
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
        
        <main className="container mx-auto p-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-hungerzblue mb-2">QR Code Generator</h1>
            <p className="text-gray-600">
              Create and print QR codes for your restaurant tables
            </p>
          </div>
          
          <TableSelection />
          
          <div className="mt-10 max-w-md mx-auto">
            <div className="bg-blue-50 border-l-4 border-hungerzblue p-4 rounded">
              <h3 className="font-medium text-hungerzblue">How to use:</h3>
              <ol className="list-decimal ml-5 mt-2 text-sm text-gray-700 space-y-1">
                <li>Select a table number from above</li>
                <li>Generate the QR code for that table</li>
                <li>Download or print the QR code</li>
                <li>Place the printed QR code on the corresponding table</li>
                <li>Customers can scan it to access the digital menu</li>
              </ol>
            </div>
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

export default QRGenerator;
