
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Table } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { TableData } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface TablesManagerProps {
  tables: TableData[];
  addTable: (tableId: number) => Promise<void>;
  deleteTable: (tableId: number) => Promise<void>;
  refreshTables: () => Promise<boolean>;
}

const tableFormSchema = z.object({
  tableNumber: z.string().refine(
    (val) => {
      const num = parseInt(val);
      return !isNaN(num) && num > 0;
    },
    { message: "Please enter a valid table number" }
  ),
});

const TablesManager: React.FC<TablesManagerProps> = ({ 
  tables, 
  addTable, 
  deleteTable, 
  refreshTables 
}) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof tableFormSchema>>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: {
      tableNumber: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof tableFormSchema>) => {
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
    await refreshTables();
    form.reset();
    
    toast({
      title: "Success",
      description: `Table ${tableNumber} has been added`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Tables</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col sm:flex-row gap-4"
            >
              <FormField
                control={form.control}
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
            .slice()
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
  );
};

export default TablesManager;
