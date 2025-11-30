import { Layout } from "@/components/layout";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, ArrowRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useLocation } from "wouter";

export default function CustomerCart() {
  const { cart, products, removeFromCart, clearCart, submitOrder, customers } = useStore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product
    };
  }).filter(item => item.product);

  const total = cartItems.reduce((sum, item) => {
    return sum + (item.product ? item.product.price * item.quantity : 0);
  }, 0);

  const handleSubmit = () => {
    if (!selectedCustomer) {
      toast({
        variant: "destructive",
        title: "Customer Required",
        description: "Please select a customer profile to place the order.",
      });
      return;
    }
    
    submitOrder(selectedCustomer);
    toast({
      title: "Order Submitted",
      description: "Your purchase order has been sent to sales.",
    });
    setLocation('/shop');
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-muted-foreground">Your cart is empty</h2>
          <Button className="mt-4" onClick={() => setLocation('/shop')}>Browse Products</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="w-[100px]">Price</TableHead>
                      <TableHead className="w-[100px]">Qty</TableHead>
                      <TableHead className="w-[100px]">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell className="font-medium">
                          {item.product?.name}
                          <div className="text-xs text-muted-foreground">{item.product?.article}</div>
                        </TableCell>
                        <TableCell>${item.product?.price.toFixed(2)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${(item.product!.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.productId)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (Est.)</span>
                  <span>${(total * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(total * 1.1).toFixed(2)}</span>
                </div>

                <div className="pt-4 space-y-2">
                  <label className="text-sm font-medium">Select Customer Profile</label>
                  <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" onClick={handleSubmit}>
                  Submit Order <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
