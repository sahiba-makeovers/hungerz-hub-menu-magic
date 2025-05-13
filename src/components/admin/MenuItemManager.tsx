import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MenuItem, MenuCategory } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { menuCategories } from "@/data/menuData";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface MenuItemManagerProps {
  menuItems: MenuItem[];
  addMenuItem: (item: MenuItem) => Promise<void>;
  deleteMenuItem: (itemId: string) => Promise<void>;
  refreshMenuItems: () => Promise<boolean>;
}

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

const MenuItemManager: React.FC<MenuItemManagerProps> = ({
  menuItems,
  addMenuItem,
  deleteMenuItem,
  refreshMenuItems,
}) => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof menuItemFormSchema>>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: "",
      price: "",
      category: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof menuItemFormSchema>) => {
    const newItem: MenuItem = {
      id: "", // Empty ID, Supabase will generate a UUID
      name: data.name,
      price: parseFloat(data.price),
      category: data.category,
      description: data.description || "",
    };
    await addMenuItem(newItem);
    await refreshMenuItems();
    form.reset();
    toast({
      title: "Success",
      description: `${data.name} has been added to the menu`,
    });
  };

  return (
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                        <Trash2 size={16} />
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
  );
};

export default MenuItemManager;
