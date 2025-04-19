
import React from 'react';
import { useOrder } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface CartProps {
  onClose?: () => void;
}

const Cart: React.FC<CartProps> = ({ onClose }) => {
  const { cart, updateCartItemQuantity, removeFromCart, clearCart, placeOrder, getCartTotal, tableId } = useOrder();

  const handlePlaceOrder = () => {
    if (!tableId) {
      toast.error('Please select a table before placing an order');
      return;
    }
    placeOrder();
    if (onClose) onClose();
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <ShoppingCart size={48} className="text-gray-300 mb-4" />
        <p className="text-lg font-medium text-gray-500">Your cart is empty</p>
        <p className="text-sm text-gray-400">Add some delicious items to get started</p>
      </div>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-hungerzblue text-white">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShoppingCart size={20} />
            Your Order
          </span>
          {tableId && <span className="text-sm">Table {tableId}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {cart.map((item, index) => {
            const price = typeof item.menuItem.price === 'object'
              ? (item.variant === 'half' ? item.menuItem.price.half : item.menuItem.price.full)
              : item.menuItem.price;
            
            const itemTotal = price * item.quantity;
            
            return (
              <div key={`${item.menuItem.id}-${item.variant || 'default'}`} className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.menuItem.name}</span>
                    <span className="font-semibold">₹{itemTotal}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-sm text-gray-500">
                      {typeof item.menuItem.price === 'object' && (
                        <span>{item.variant === 'half' ? 'Half' : 'Full'} · </span>
                      )}
                      <span>₹{price} × {item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateCartItemQuantity(item.menuItem.id, item.quantity - 1, item.variant)}
                      >
                        <Minus size={12} />
                      </Button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateCartItemQuantity(item.menuItem.id, item.quantity + 1, item.variant)}
                      >
                        <Plus size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-500 hover:text-red-700"
                        onClick={() => removeFromCart(item.menuItem.id, item.variant)}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="p-4 flex flex-col gap-3">
        <div className="flex justify-between w-full text-lg font-semibold">
          <span>Total</span>
          <span>₹{getCartTotal()}</span>
        </div>
        <div className="flex w-full gap-2">
          <Button variant="outline" className="flex-1" onClick={() => clearCart()}>
            Clear Cart
          </Button>
          <Button 
            className="flex-1 bg-hungerzorange hover:bg-hungerzorange/90" 
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Cart;
