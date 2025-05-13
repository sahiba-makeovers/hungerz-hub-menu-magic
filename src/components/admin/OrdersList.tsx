
import React from "react";
import { Info } from "lucide-react";
import { Order } from "@/types";
import OrderItem from "@/components/OrderItem";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrdersListProps {
  orders: Order[];
  status: "PENDING" | "COOKING" | "DELIVERED";
}

const OrdersList: React.FC<OrdersListProps> = ({ orders, status }) => {
  const filteredOrders = orders.filter((order) => order.status === status);
  const isMobile = useIsMobile();
  
  const getStatusMessage = () => {
    switch (status) {
      case "PENDING":
        return {
          title: "No pending orders",
          description: "New orders will appear here"
        };
      case "COOKING":
        return {
          title: "No orders in cooking",
          description: "Orders being prepared will appear here"
        };
      case "DELIVERED":
        return {
          title: "No delivered orders",
          description: "Completed orders will appear here"
        };
    }
  };

  return (
    <div className={`grid gap-3 sm:gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
      {filteredOrders.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-8 sm:py-12 text-gray-500">
          <Info size={40} className="mb-3 text-gray-400" />
          <h3 className="text-lg font-medium">{getStatusMessage().title}</h3>
          <p className="text-sm">{getStatusMessage().description}</p>
        </div>
      ) : (
        filteredOrders.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))
      )}
    </div>
  );
};

export default OrdersList;
