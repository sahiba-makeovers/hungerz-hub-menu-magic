
import React from 'react';
import { useOrder } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const TableSelection = () => {
  const { tableId, setTableId, tables } = useOrder();

  const generateTableUrl = (tableId: number) => {
    // Use absolute URL with correct domain
    return `${window.location.protocol}//${window.location.host}/menu?table=${tableId}`;
  };

  const openTableMenu = (tableId: number) => {
    const url = generateTableUrl(tableId);
    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-hungerzblue mb-6 text-center">Select a Table</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {tables.sort((a, b) => a - b).map((table) => (
          <Button
            key={table}
            variant={tableId === table ? "default" : "outline"}
            className={`h-16 text-lg ${tableId === table ? 'bg-hungerzblue text-white' : ''}`}
            onClick={() => setTableId(table)}
          >
            Table {table}
          </Button>
        ))}
      </div>
      
      {tableId && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-medium mb-4">QR Code for Table {tableId}</h3>
              <div className="p-3 bg-white rounded-lg shadow-md">
                <QRCodeSVG
                  value={generateTableUrl(tableId)}
                  size={200}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"L"}
                  includeMargin={false}
                />
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Scan this code to access the menu on Table {tableId}
              </p>
              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-500 text-center">
                  QR code URL: {generateTableUrl(tableId)}
                </p>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => openTableMenu(tableId)}
                >
                  <QrCode size={16} />
                  Open Menu
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TableSelection;
