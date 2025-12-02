import { Layout } from "@/components/layout";
import { useProducts, useSuppliers, useCustomers, usePurchaseOrders } from "@/lib/hooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Upload, FileSpreadsheet, TrendingUp, Users, Package, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export default function AdminDashboard() {
  const { data: products = [] } = useProducts();
  const { data: suppliers = [] } = useSuppliers();
  const { data: customers = [] } = useCustomers();
  const { data: purchaseOrders = [] } = usePurchaseOrders();

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, change: "+12%" },
    { label: "Active Suppliers", value: suppliers.length, icon: Users, change: "+2" },
    { label: "Total Customers", value: customers.length, icon: Users, change: "+5%" },
    { label: "Total Orders", value: purchaseOrders.length, icon: ShoppingCart, change: "+18%" },
  ];

  // Mock data for the chart
  const data = [
    { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
    { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">System overview and management</p>
          </div>
          <div className="flex gap-2">
             <Link href="/inventory">
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Import / Manage Inventory
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500 font-medium">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Recent Inventory Additions</CardTitle>
              <CardDescription>Latest products added to catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {products.slice(-5).reverse().map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{p.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{p.article}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">${p.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  {products.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                        No products found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Link href="/entities?tab=suppliers">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" /> Add New Supplier
                </Button>
              </Link>
              <Link href="/entities?tab=customers">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-2" /> Register Customer
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start" onClick={() => alert("Report export simulation started...")}>
                <FileSpreadsheet className="w-4 h-4 mr-2" /> Export Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
