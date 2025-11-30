import { Layout } from "@/components/layout";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Upload, FileSpreadsheet } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { products, suppliers, customers, purchaseOrders } = useStore();

  const stats = [
    { label: "Total Products", value: products.length },
    { label: "Active Suppliers", value: suppliers.length },
    { label: "Customers", value: customers.length },
    { label: "Total Orders", value: purchaseOrders.length },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
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
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start">
                <Plus className="w-4 h-4 mr-2" /> Add New Supplier
              </Button>
              <Button variant="outline" className="justify-start">
                <Plus className="w-4 h-4 mr-2" /> Register Customer
              </Button>
              <Button variant="outline" className="justify-start">
                <FileSpreadsheet className="w-4 h-4 mr-2" /> Export Reports
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Inventory Additions</CardTitle>
              <CardDescription>Last 5 products added</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {products.slice(-5).reverse().map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-right">${p.price.toFixed(2)}</TableCell>
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
