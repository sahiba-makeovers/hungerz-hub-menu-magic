
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Order } from '@/types';
import { useOrder } from '@/contexts/OrderContext';
import { Clock, CreditCard, Check, X } from 'lucide-react';

interface OrderItemProps {
  order: Order;
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  const { updateOrderStatus, updateOrderPayment } = useOrder();
  
  const formattedTime = new Date(order.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'COOKING':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'UNPAID':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const nextStatusButton = () => {
    if (order.status === 'PENDING') {
      return (
        <Button
          onClick={() => updateOrderStatus(order.id, 'COOKING')}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Start Cooking
        </Button>
      );
    } else if (order.status === 'COOKING') {
      return (
        <Button
          onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
          className="bg-green-500 hover:bg-green-600"
        >
          Mark as Delivered
        </Button>
      );
    }
    return null;
  };
  
  const paymentButton = () => {
    if (!order.paymentStatus || order.paymentStatus === 'UNPAID') {
      return (
        <Button
          onClick={() => updateOrderPayment(order.id, 'PAID', 'Cash')}
          className="bg-hungerzorange hover:bg-hungerzorange/90 flex items-center gap-1"
          size="sm"
        >
          <CreditCard size={16} /> Mark as Paid
        </Button>
      );
    }
    return null;
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold">Table {order.tableId}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Clock size={14} className="mr-1" />
              {formattedTime}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
              {order.paymentStatus || 'UNPAID'}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <ul className="space-y-1">
          {order.items.map((item, index) => {
            const price =
              typeof item.menuItem.price === 'object'
                ? item.variant === 'half'
                  ? item.menuItem.price.half
                  : item.menuItem.price.full
                : item.menuItem.price;

            return (
              <li key={index} className="flex justify-between text-sm">
                <span>
                  {item.quantity} × {item.menuItem.name}
                  {typeof item.menuItem.price === 'object' && ` (${item.variant})`}
                  {item.notes && <span className="text-xs text-gray-500 block ml-4">Note: {item.notes}</span>}
                </span>
                <span>₹{price * item.quantity}</span>
              </li>
            );
          })}
        </ul>
        
        {order.paymentMethod && (
          <div className="mt-3 text-xs text-gray-500 flex items-center">
            <CreditCard size={12} className="mr-1" />
            Paid via {order.paymentMethod}
            {order.paymentDate && ` • ${new Date(order.paymentDate).toLocaleDateString()}`}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 pb-4 flex flex-col items-stretch gap-2">
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>₹{order.totalAmount}</span>
        </div>
        <div className="flex gap-2">
          {nextStatusButton()}
          {paymentButton()}
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderItem;
