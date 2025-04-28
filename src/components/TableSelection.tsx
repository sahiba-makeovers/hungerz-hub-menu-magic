
import React, { useState, useEffect } from 'react';
import { useOrder } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

interface TableSelectionProps {
  onRefresh?: () => Promise<void>;
}

const TableSelection: React.FC<TableSelectionProps> = ({ onRefresh }) => {
  const { tableId, setTableId, tables } = useOrder();
  const [downloadQR, setDownloadQR] = useState<boolean>(false);
  const [localTables, setLocalTables] = useState<number[]>([]);

  // Initialize with tables from context
  useEffect(() => {
    if (tables && tables.length > 0) {
      setLocalTables(tables);
    }
  }, [tables]);

  const generateTableUrl = (tableId: number) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/menu?table=${tableId}`;
  };

  const openTableMenu = (tableId: number) => {
    const url = generateTableUrl(tableId);
    window.open(url, '_blank');
  };

  const downloadQRCode = () => {
    if (!tableId) {
      toast.error("Please select a table first");
      return;
    }

    try {
      setDownloadQR(true);
      
      setTimeout(() => {
        const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
        if (!canvas) {
          toast.error("Error generating QR code");
          setDownloadQR(false);
          return;
        }
        
        const pngUrl = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `table-${tableId}-qr.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        toast.success(`QR code for Table ${tableId} downloaded`);
        setDownloadQR(false);
      }, 300);
    } catch (error) {
      console.error("Error downloading QR code:", error);
      toast.error("Failed to download QR code");
      setDownloadQR(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-hungerzblue">Select a Table</h2>
      </div>
      
      {localTables.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tables found. Please add tables in the Admin panel.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {localTables.sort((a, b) => a - b).map((table) => (
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
      )}
      
      {tableId && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-medium mb-4">QR Code for Table {tableId}</h3>
              <div className="p-3 bg-white rounded-lg shadow-md">
                <QRCodeSVG
                  id="qr-canvas"
                  value={window.location.origin + generateTableUrl(tableId)}
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
                  QR code URL: {window.location.origin + generateTableUrl(tableId)}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => openTableMenu(tableId)}
                  >
                    <QrCode size={16} />
                    View Menu
                  </Button>
                  <Button 
                    variant="default"
                    className="flex items-center gap-2 bg-hungerzblue hover:bg-hungerzblue/90"
                    onClick={downloadQRCode}
                    disabled={downloadQR}
                  >
                    <Download size={16} />
                    {downloadQR ? 'Processing...' : 'Download QR'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TableSelection;
