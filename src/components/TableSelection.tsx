
import React, { useState } from 'react';
import { useOrder } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Download, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface TableSelectionProps {
  onRefresh?: () => Promise<void>;
}

const TableSelection: React.FC<TableSelectionProps> = ({ onRefresh }) => {
  const { tableId, setTableId, tables, refreshAllData } = useOrder();
  const [downloadQR, setDownloadQR] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const generateTableUrl = (tableId: number) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/menu?table=${tableId}`;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshAllData();
      toast.success("Tables refreshed successfully");
    } catch (error) {
      console.error("Error refreshing tables:", error);
      toast.error("Failed to refresh tables");
    } finally {
      setIsRefreshing(false);
    }
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
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Tables'}
        </Button>
      </div>
      
      {tables.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tables found. Please add tables in the Admin panel.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {tables
            .slice()
            .sort((a, b) => a.id - b.id)
            .map((table) => (
              <Button
                key={table.id}
                variant={tableId === table.id ? "default" : "outline"}
                className={`h-16 text-lg ${tableId === table.id ? 'bg-hungerzblue text-white' : ''}`}
                onClick={() => setTableId(table.id)}
              >
                Table {table.id}
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
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link to={`/menu?table=${tableId}`} target="_blank">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                    >
                      <QrCode size={16} />
                      View Menu
                    </Button>
                  </Link>
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
