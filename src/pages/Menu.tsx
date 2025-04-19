
import React, { useState, useEffect } from 'react';
import { OrderProvider } from '@/contexts/OrderContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingCart, Home } from 'lucide-react';
import Logo from '@/components/Logo';
import Cart from '@/components/Cart';
import { menuCategories, getMenuItemsByCategory } from '@/data/menuData';
import CategorySection from '@/components/CategorySection';
import { Badge } from '@/components/ui/badge';
import { useOrder } from '@/contexts/OrderContext';
import CategoryNav from '@/components/CategoryNav';

const MenuContent = () => {
  const { cart, tableId } = useOrder();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

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
      </header>

      <div className="container mx-auto px-4 pb-20">
        {tableId && (
          <div className="text-center py-2 bg-hungerzblue text-white mt-2 rounded-md">
            Table #{tableId}
          </div>
        )}

        <div className="mt-6 mb-8">
          <h1 className="text-2xl font-bold text-center text-hungerzblue">Our Menu</h1>
          <p className="text-center text-gray-600 mt-2">Explore our delicious offerings</p>
        </div>

        <CategoryNav />

        <div className="mt-8 space-y-10">
          {menuCategories.map((category) => (
            <CategorySection
              key={category.id}
              categoryName={category.displayName}
              items={getMenuItemsByCategory(category.name)}
            />
          ))}
        </div>
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-3 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-between items-center">
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
            <SheetContent>
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
