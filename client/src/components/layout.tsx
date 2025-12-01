import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Settings, 
  LogOut,
  Menu,
  ShoppingCart
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/toaster";

export function Layout({ children }: { children: React.ReactNode }) {
  const { currentUserRole, setCurrentUserRole, cart } = useStore();
  const [location] = useLocation();

  const navItems = {
    customer: [
      { href: "/shop", label: "Shop", icon: ShoppingBag },
      { href: "/cart", label: "My Cart", icon: ShoppingCart },
    ],
    salesperson: [
      { href: "/sales", label: "Dashboard", icon: LayoutDashboard },
      { href: "/sales", label: "Orders", icon: ShoppingBag }, // Re-using sales dashboard for now as it has the order list
      { href: "/sales", label: "Deliveries", icon: Package }, // Re-using sales dashboard for now
    ],
    admin: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/inventory", label: "Inventory", icon: Package },
      { href: "/entities", label: "Entities", icon: Settings },
    ]
  };

  const currentNav = navItems[currentUserRole];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
              E
            </div>
            Enterprise
          </h1>
          <p className="text-xs text-sidebar-accent-foreground mt-1">
            {currentUserRole.toUpperCase()} PORTAL
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {currentNav.map((item) => (
            <Link key={item.href} href={item.href}>
              <div 
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  location === item.href 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.label === 'My Cart' && cart.length > 0 && (
                  <Badge variant="secondary" className="ml-auto h-5 px-1.5 min-w-[1.25rem]">{cart.length}</Badge>
                )}
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="space-y-2">
            <p className="text-xs font-medium text-sidebar-accent-foreground mb-2">SWITCH ROLE (DEMO)</p>
            <div className="grid grid-cols-3 gap-1">
              {(['customer', 'salesperson', 'admin'] as const).map((role) => (
                <Button
                  key={role}
                  variant={currentUserRole === role ? "default" : "secondary"}
                  size="sm"
                  className="text-[10px] h-7 px-0 capitalize"
                  onClick={() => setCurrentUserRole(role)}
                >
                  {role.slice(0, 4)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-background">
        <h1 className="font-bold">Enterprise</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon"><Menu className="w-5 h-5" /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-sidebar text-sidebar-foreground border-r-sidebar-border p-0">
             <div className="p-6 border-b border-sidebar-border">
              <h1 className="text-xl font-bold">Enterprise</h1>
            </div>
            <nav className="p-4 space-y-1">
              {currentNav.map((item) => (
                <Link key={item.href} href={item.href}>
                   <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-sidebar-accent/50 cursor-pointer">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-muted/20 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
