import { Layout } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SupplierManager from "@/components/crud/supplier-manager";
import CustomerManager from "@/components/crud/customer-manager";
import CategoryTree from "@/components/crud/category-tree";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function AdminEntities() {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState("suppliers");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Entity Management</h1>
          <p className="text-muted-foreground">Manage base data and catalog structure</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="catalog">Catalog Structure</TabsTrigger>
          </TabsList>
          
          <TabsContent value="suppliers" className="space-y-4">
            <SupplierManager />
          </TabsContent>
          
          <TabsContent value="customers" className="space-y-4">
            <CustomerManager />
          </TabsContent>
          
          <TabsContent value="catalog" className="space-y-4">
            <CategoryTree />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
