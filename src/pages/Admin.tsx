import React, { useState, useEffect } from "react";
import { OrderProvider, useOrder } from "@/contexts/OrderContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, Plus, Edit, Trash, Table } from "lucide-react";
import Logo from "@/components/Logo";
import OrderItem from "@/components/OrderItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { menuCategories, getMenuItemsByCategory } from "@/data/menuData";
import { useToast } from "@/hooks/use-toast";
import { MenuItem } from "@/types";

const tableFormSchema = z.object({
  tableNumber: z.string().refine(
    (val) => {
      const num = parseInt(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Please enter a valid table number" }
  ),
});

const menuItemFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  price: z.string().refine(
    (val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Please enter a valid price" }
  ),
  category: z.string().min(1, { message: "Please select a category" }),
  description: z.string().optional(),
});

const AdminContent = () => {
  const {
    orders,
    tables,
    addTable,
    deleteTable,
    addMenuItem,
    deleteMenuItem,
    menuItems,
    refreshTables,
    refreshMenuItems,
  } = useOrder();
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();
  const { toast } = useToast();

  const tableForm = useForm<z.infer<typeof tableFormSchema>>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: {
      tableNumber: "",
    },
  });

  const menuItemForm = useForm<z.infer<typeof menuItemFormSchema>>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: "",
      price: "",
      category: "",
      description: "",
    },
  });

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("adminLoggedIn");
    if (adminLoggedIn !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  const pendingOrders = orders.filter((order) => order.status === "PENDING");
  const cookingOrders = orders.filter((order) => order.status === "COOKING");
  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED"
  );

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/login");
  };

  const onTableSubmit = async (data: z.infer<typeof tableFormSchema>) => {
    const tableNumber = parseInt(data.tableNumber);
  
    const alreadyExists = tables.some((table) => table.id === tableNumber);
    if (alreadyExists) {
      toast({
        title: "Error",
        description: `Table ${tableNumber} already exists`,
        variant: "destructive",
      });
      return;
    }
  
    await addTable(tableNumber);
    await refreshTables(); // not refreshMenuItems()
    tableForm.reset();
  
    toast({
      title: "Success",
      description: `Table ${tableNumber} has been added`,
    });
  };
  

  const onMenuItemSubmit = async (data: z.infer<typeof menuItemFormSchema>) => {
    const newItem: MenuItem = {
      id: `custom-${Date.now()}`,
      name: data.name,
      price: parseFloat(data.price),
      category: data.category,
      description: data.description || "",
    };
    await addMenuItem(newItem);
    await refreshMenuItems();
    menuItemForm.reset();
    toast({
      title: "Success",
      description: `${data.name} has been added to the menu`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/">
            <Button
              variant="ghost"
              className="flex items-center gap-1 text-hungerzblue hover:text-hungerzorange"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Button>
          </Link>
          <Logo />
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-hungerzblue mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage orders, tables, and menu items</p>
        </div>

        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 mb-6">
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingOrders.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-hungerzorange text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {pendingOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="cooking">
              Cooking
              {cookingOrders.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {cookingOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingOrders.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                  <Info size={48} className="mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium">No pending orders</h3>
                  <p className="text-sm">New orders will appear here</p>
                </div>
              ) : (
                pendingOrders.map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="cooking">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cookingOrders.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                  <Info size={48} className="mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium">No orders in cooking</h3>
                  <p className="text-sm">
                    Orders being prepared will appear here
                  </p>
                </div>
              ) : (
                cookingOrders.map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="delivered">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deliveredOrders.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                  <Info size={48} className="mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium">No delivered orders</h3>
                  <p className="text-sm">Completed orders will appear here</p>
                </div>
              ) : (
                deliveredOrders.map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="tables">
            <Card>
              <CardHeader>
                <CardTitle>Manage Tables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Form {...tableForm}>
                    <form
                      onSubmit={tableForm.handleSubmit(onTableSubmit)}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <FormField
                        control={tableForm.control}
                        name="tableNumber"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder="Enter table number"
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="bg-hungerzblue hover:bg-hungerzblue/90"
                      >
                        Add Table
                      </Button>
                    </form>
                  </Form>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {tables
                    .slice() // Create a copy to avoid mutating original
                    .sort((a, b) => a.id - b.id)
                    .map((table) => (
                      <Card key={`table-${table.id}`} className="relative">
                        <CardContent className="flex flex-col items-center justify-center p-4">
                          <Table size={24} className="mb-2 text-hungerzblue" />
                          <p className="text-lg font-semibold">
                            Table {table.id}
                          </p>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="mt-2"
                            onClick={async () => {
                              try {
                                await deleteTable(table.id);
                                await refreshTables();
                              } catch (err) {
                                console.error("Failed to delete table:", err);
                              }
                            }}
                          >
                            Remove
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu">
            <Card>
              <CardHeader>
                <CardTitle>Manage Menu Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mb-6 bg-hungerzblue hover:bg-hungerzblue/90">
                      <Plus size={16} className="mr-2" />
                      Add Menu Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Menu Item</DialogTitle>
                    </DialogHeader>
                    <Form {...menuItemForm}>
                      <form
                        onSubmit={menuItemForm.handleSubmit(onMenuItemSubmit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={menuItemForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Item Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter item name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={menuItemForm.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter price"
                                  type="number"
                                  step="0.01"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={menuItemForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {menuCategories.map((category) => (
                                    <SelectItem
                                      key={`${category.id}-${category.name}`}
                                      value={category.name}
                                    >
                                      {category.displayName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={menuItemForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter description"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <DialogFooter>
                          <Button
                            type="submit"
                            className="w-full bg-hungerzblue hover:bg-hungerzblue/90"
                          >
                            Add Item
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

                <div className="space-y-6">
                  {menuCategories.map((category) => {
                    const itemsInCategory = menuItems.filter(
                      (item) => item.category === category.name
                    );
                    if (itemsInCategory.length === 0) return null;

                    return (
                      <div
                        key={`${category.id}-${category.name}`}
                        className="border rounded-lg p-4"
                      >
                        <h3 className="font-bold text-hungerzblue text-lg mb-4">
                          {category.displayName}
                        </h3>
                        <div className="divide-y">
                          {itemsInCategory.map((item) => (
                            <div
                              key={item.id}
                              className="py-3 flex justify-between items-center"
                            >
                              <div>
                                <h4 className="font-medium">{item.name}</h4>
                                {item.description && (
                                  <p className="text-sm text-gray-600">
                                    {item.description}
                                  </p>
                                )}
                                <p className="text-hungerzorange">
                                  ₹
                                  {typeof item.price === "object"
                                    ? `${item.price.half} (Half) / ₹${item.price.full} (Full)`
                                    : item.price}
                                </p>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  deleteMenuItem(item.id);
                                  toast({
                                    title: "Item deleted",
                                    description: `${item.name} has been removed from the menu`,
                                  });
                                }}
                              >
                                <Trash size={16} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-hungerzblue text-white py-4 mt-10">
        <div className="container mx-auto text-center">
          <p>© 2025 Hungerz Hub - The taste what you want...</p>
        </div>
      </footer>
    </div>
  );
};

const Admin = () => {
  return (
    <OrderProvider>
      <AdminContent />
    </OrderProvider>
  );
};

export default Admin;
