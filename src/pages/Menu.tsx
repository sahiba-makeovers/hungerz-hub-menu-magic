
import React, { useState, useEffect } from 'react';
import { OrderProvider, useOrder } from '@/contexts/OrderContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingCart, Home, Percent, RefreshCw, Loader2 } from 'lucide-react';
import Logo from '@/components/Logo';
import Cart from '@/components/Cart';
import { menuCategories } from '@/data/menuData';
import CategorySection from '@/components/CategorySection';
import { Badge } from '@/components/ui/badge';
import CategoryNav from '@/components/CategoryNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { fetchMenuItems, getCurrentCacheState } from '@/utils/dataStorage';

const MenuContent = () => {
  const { cart, tableId, applyCoupon, discount, couponCode, menuItems, refreshMenuItems } = useOrder();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponDialogOpen, setCouponDialogOpen] = useState(false);
  const [inputCoupon, setInputCoupon] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [notification, setNotification] = useState<string | null>(null);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Get menu items by category from OrderContext
  const getMenuItemsByCategory = (categoryName: string) => {
    return menuItems.filter(item => item.category === categoryName);
  };

  // Handle URL table parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tableParam = params.get('table');
    
    if (tableParam && !tableId) {
      // Display a welcome notification
      setNotification(`Welcome to Table ${tableParam}! Browse our menu and place your order.`);
      
      // Hide notification after 5 seconds
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [tableId]);

  // Function to refresh menu data
  const refreshMenuData = async () => {
    try {
      setRefreshing(true);
      toast({
        title: "Refreshing menu",
        description: "Fetching the latest menu items..."
      });
      
      // Use the refreshMenuItems function from OrderContext
      await refreshMenuItems();
      
      console.log("Cache state after menu refresh:", getCurrentCacheState());
      
      toast({
        title: "Menu refreshed",
        description: "Menu items updated successfully"
      });
    } catch (error) {
      console.error("Error refreshing menu:", error);
      toast({
        title: "Error",
        description: "Failed to refresh menu data",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Refresh menu data when component mounts
  useEffect(() => {
    refreshMenuData();
  }, []);

  const handleApplyCoupon = () => {
    if (inputCoupon.trim() === '') {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }
    
    const result = applyCoupon(inputCoupon);
    if (result.success) {
      toast({
        title: "Coupon Applied",
        description: result.message,
      });
      setCouponDialogOpen(false);
    } else {
      toast({
        title: "Invalid Coupon",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4 sticky top-0 z-20">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <Home className="text-hungerzblue" />
            </Button>
          </Link>
          <Logo />
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size={isMobile ? "icon" : "default"}
              className={`text-hungerzblue border-hungerzblue ${refreshing ? 'opacity-70' : ''}`}
              onClick={refreshMenuData}
              disabled={refreshing}
            >
              {refreshing ? 
                <Loader2 className="h-4 w-4 animate-spin" /> : 
                <RefreshCw size={isMobile ? 20 : 16} />
              }
              {!isMobile && <span className="ml-2">Refresh</span>}
            </Button>
            <Button 
              variant="outline" 
              size={isMobile ? "icon" : "default"}
              className="text-hungerzblue border-hungerzblue"
              onClick={() => setCouponDialogOpen(true)}
            >
              <Percent size={isMobile ? 20 : 16} />
              {!isMobile && <span className="ml-2">Coupons</span>}
            </Button>
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="text-hungerzblue" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-hungerzorange px-1.5 min-w-5 h-5">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <Cart onClose={() => setIsCartOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-24">
        {tableId && (
          <div className="text-center py-2 bg-hungerzblue text-white mt-2 rounded-md">
            Table #{tableId}
          </div>
        )}

        {notification && (
          <div className="mt-4 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded relative">
            {notification}
          </div>
        )}

        <div className="mt-6 mb-8">
          <h1 className="text-2xl font-bold text-center text-hungerzblue">Our Menu</h1>
          <p className="text-center text-gray-600 mt-2">Explore our delicious offerings</p>
          {couponCode && (
            <div className="mt-3 text-center">
              <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">
                Coupon applied: {couponCode} ({discount}% off)
              </Badge>
            </div>
          )}
        </div>

        <CategoryNav />

        <div className="mt-8 space-y-10">
          {refreshing ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-hungerzblue" />
              <p className="mt-4 text-gray-600">Refreshing menu data...</p>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <p className="text-gray-600">No menu items available.</p>
              <Button 
                onClick={refreshMenuData} 
                className="mt-4 bg-hungerzblue hover:bg-hungerzblue/90"
              >
                Refresh Menu
              </Button>
            </div>
          ) : (
            menuCategories.map((category) => {
              const items = getMenuItemsByCategory(category.name);
              // Only render categories that have menu items
              return items.length > 0 ? (
                <CategorySection
                  key={category.id}
                  categoryName={category.displayName}
                  items={items}
                />
              ) : null;
            })
          )}
        </div>
      </div>

      {/* Coupon Dialog */}
      <Dialog open={couponDialogOpen} onOpenChange={setCouponDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply Coupon</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Input 
                id="coupon" 
                value={inputCoupon}
                onChange={(e) => setInputCoupon(e.target.value)}
                placeholder="Enter coupon code" 
                className="col-span-3"
              />
              <Button onClick={handleApplyCoupon} className="bg-hungerzorange hover:bg-hungerzorange/90">
                Apply
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              <p>Available coupons:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>SHUBHAM50 - 50% off your order</li>
                <li>PRINCE10 - 10% off your order</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-3 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-between items-center z-10">
          <div>
            <p className="font-semibold">{totalItems} item(s)</p>
            <p className="text-sm text-gray-600">View cart for details</p>
          </div>
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <Button className="bg-hungerzorange hover:bg-hungerzorange/90">
                View Cart
              </Button>
            </SheetTrigger>
            <SheetContent className="md:max-w-md">
              <Cart onClose={() => setIsCartOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  );
};

const Menu = () => {
  return (
    <OrderProvider>
      <MenuContent />
    </OrderProvider>
  );
};

export default Menu;
