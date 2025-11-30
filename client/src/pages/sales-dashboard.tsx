import { Layout } from "@/components/layout";
import { useStore, PurchaseOrder, Product } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function SalesDashboard() {
  const { purchaseOrders, customers, products, createDeliveryNote } = useStore();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [deliveryQuantities, setDeliveryQuantities] = useState<Record<string, number>>({});

  const pendingOrders = purchaseOrders.filter(o => o.status === 'pending');
  const processedOrders = purchaseOrders.filter(o => o.status === 'processed');

  const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || 'Unknown';
  const getProductName = (id: string) => products.find(p => p.id === id)?.name || 'Unknown';

  const handlePrepareDelivery = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    // Initialize delivery quantities with order quantities (default: full delivery)
    const initial: Record<string, number> = {};
    order.items.forEach(item => {
      initial[item.productId] = item.quantity;
    });
    setDeliveryQuantities(initial);
  };

  const handleCreateDeliveryNote = () => {
    if (!selectedOrder) return;

    const deliveredItems = Object.entries(deliveryQuantities).map(([productId, quantity]) => ({
      productId,
      quantity
    }));

    createDeliveryNote(selectedOrder.id, deliveredItems);
    
    toast({
      title: "Delivery Note Created",
      description: "Inventory adjusted and missing items log generated.",
    });
    
    setSelectedOrder(null);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
          <p className="text-muted-foreground">Manage incoming orders and create delivery notes</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Pending Orders */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Pending Purchase Orders</CardTitle>
              <CardDescription>Orders awaiting fulfillment</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No pending orders
                      </TableCell>
                    </TableRow>
                  )}
                  {pendingOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id}</TableCell>
                      <TableCell>{getCustomerName(order.customerId)}</TableCell>
                      <TableCell>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{order.items.reduce((acc, item) => acc + item.quantity, 0)} units</TableCell>
                      <TableCell className="text-right">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button size="sm" onClick={() => handlePrepareDelivery(order)}>
                              Create Delivery Note
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                            <SheetHeader>
                              <SheetTitle>Create Delivery Note</SheetTitle>
                            </SheetHeader>
                            <div className="py-6 space-y-6">
                              <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
                                <div className="text-sm font-medium text-muted-foreground">Order Reference</div>
                                <div className="font-mono">{selectedOrder?.id}</div>
                                <div className="text-sm font-medium text-muted-foreground mt-2">Customer</div>
                                <div>{selectedOrder && getCustomerName(selectedOrder.customerId)}</div>
                              </div>

                              <div className="space-y-4">
                                <h3 className="font-medium border-b pb-2">Confirm Quantities</h3>
                                {selectedOrder?.items.map(item => {
                                  const product = products.find(p => p.id === item.productId);
                                  const missing = Math.max(0, item.quantity - (deliveryQuantities[item.productId] || 0));
                                  
                                  return (
                                    <div key={item.productId} className="space-y-2">
                                      <div className="flex justify-between text-sm">
                                        <span className="font-medium">{product?.name}</span>
                                        <span className="text-muted-foreground">Ordered: {item.quantity}</span>
                                      </div>
                                      <div className="flex gap-4 items-center">
                                        <div className="flex-1">
                                          <Label className="text-xs">Delivered Qty</Label>
                                          <Input 
                                            type="number" 
                                            min="0"
                                            max={item.quantity}
                                            value={deliveryQuantities[item.productId] || 0}
                                            onChange={(e) => setDeliveryQuantities(prev => ({
                                              ...prev,
                                              [item.productId]: parseInt(e.target.value) || 0
                                            }))}
                                          />
                                        </div>
                                        {missing > 0 && (
                                          <div className="text-xs font-medium text-destructive flex items-center gap-1 pt-4">
                                            <AlertTriangle className="w-3 h-3" />
                                            Missing: {missing}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              <Button className="w-full" onClick={handleCreateDeliveryNote}>
                                Generate Note & Log Missing Items
                              </Button>
                            </div>
                          </SheetContent>
                        </Sheet>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Processed Orders History */}
          <Card className="md:col-span-2 opacity-80">
             <CardHeader>
              <CardTitle>Processed Orders</CardTitle>
            </CardHeader>
             <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id}</TableCell>
                      <TableCell>{getCustomerName(order.customerId)}</TableCell>
                      <TableCell>{format(new Date(order.createdAt), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" /> Processed
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
