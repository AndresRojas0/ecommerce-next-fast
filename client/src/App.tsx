import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import CustomerShop from "@/pages/customer-shop";
import CustomerCart from "@/pages/customer-cart";
import SalesDashboard from "@/pages/sales-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminInventory from "@/pages/admin-inventory";
import AdminEntities from "@/pages/admin-entities";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={CustomerShop} />
      <Route path="/cart" component={CustomerCart} />
      <Route path="/sales" component={SalesDashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/inventory" component={AdminInventory} />
      <Route path="/entities" component={AdminEntities} />
      
      {/* Catch-all for 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
