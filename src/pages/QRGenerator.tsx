
import React, { useEffect, useState, useCallback } from 'react';
import { OrderProvider, useOrder } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import Logo from '@/components/Logo';
import TableSelection from '@/components/TableSelection';
import { toast } from 'sonner';

const QRGeneratorContent = () => {
  const { isLoading, refreshAllData } = useOrder();
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Function to refresh tables data from context
  const refreshTablesData = useCallback(async () => {
    if (refreshing) return; // Prevent multiple simultaneous refreshes
    
    try {
      setRefreshing(true);
      toast.info("Refreshing tables data...");
      await refreshAllData();
      toast.success("Tables data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing tables:", error);
      toast.error("Failed to refresh tables data");
    } finally {
      setRefreshing(false);
    }
  }, [refreshAllData, refreshing]);

  // Refresh data only once when the component is first loaded
  useEffect(() => {
    if (!isLoading && !initialLoadDone) {
      refreshTablesData().then(() => {
        setInitialLoadDone(true);
      });
    }
  }, [isLoading, initialLoadDone, refreshTablesData]);

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
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={refreshTablesData}
            disabled={refreshing}
          >
            {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw size={16} />}
            Refresh
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto p-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-hungerzblue mb-2">QR Code Generator</h1>
          <p className="text-gray-600">
            Create and print QR codes for your restaurant tables
          </p>
        </div>
        
        {isLoading || refreshing ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-hungerzblue" />
            <p className="mt-4 text-gray-600">Loading tables data...</p>
          </div>
        ) : (
          <TableSelection onRefresh={refreshTablesData} />
        )}
        
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
          <p className="text-sm mt-1">Mid Town Plaza, 12, Safidon Gate, Rani Talab, Jind, Haryana 126102</p>
          <p className="text-sm mt-1">+91 80923 00100</p>
        </div>
      </footer>
    </div>
  );
};

const QRGenerator = () => {
  return (
    <OrderProvider>
      <QRGeneratorContent />
    </OrderProvider>
  );
};

export default QRGenerator;
