
import React from 'react';
import { useOrder } from '@/contexts/OrderContext';
import { MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Minus } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { addToCart, cart, updateCartItemQuantity, removeFromCart } = useOrder();

  const getItemInCart = (variant?: 'half' | 'full') => {
    return cart.find(
      (cartItem) =>
        cartItem.menuItem.id === item.id &&
        (typeof item.price !== 'object' || cartItem.variant === variant)
    );
  };

  const itemInCart = getItemInCart();
  const halfItemInCart = getItemInCart('half');
  const fullItemInCart = getItemInCart('full');

  const renderPriceAndAddButton = (price: number, variant?: 'half' | 'full') => {
    const currentItemInCart = variant ? getItemInCart(variant) : itemInCart;
    
    return (
      <div className="flex justify-between items-center mt-2">
        <span className="text-lg font-semibold">₹{price}</span>
        {!currentItemInCart ? (
          <Button
            variant="outline"
            size="sm"
            className="bg-hungerzorange text-white border-hungerzorange hover:bg-hungerzorange/90"
            onClick={() => addToCart(item, 1, variant)}
          >
            <Plus size={16} />
            Add
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                if (currentItemInCart.quantity === 1) {
                  removeFromCart(item.id, variant);
                } else {
                  updateCartItemQuantity(item.id, currentItemInCart.quantity - 1, variant);
                }
              }}
            >
              <Minus size={14} />
            </Button>
            <span className="w-6 text-center">{currentItemInCart.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateCartItemQuantity(item.id, currentItemInCart.quantity + 1, variant)}
            >
              <Plus size={14} />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-md">{item.name}</h3>
            {item.popular && (
              <span className="bg-hungerzorange text-white text-xs px-2 py-1 rounded-full">
                Popular
              </span>
            )}
          </div>
          
          {item.description && (
            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
          )}

          {typeof item.price === 'object' ? (
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Half</span>
                {renderPriceAndAddButton(item.price.half, 'half')}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Full</span>
                {renderPriceAndAddButton(item.price.full, 'full')}
              </div>
            </div>
          ) : (
            renderPriceAndAddButton(item.price)
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
