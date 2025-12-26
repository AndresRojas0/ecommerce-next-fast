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
  const [location, setLocation] = useLocation();

  const roleDefaultRoutes = {
    customer: "/shop",
    salesperson: "/sales",
    admin: "/admin",
  };

  const handleRoleSwitch = (role: 'customer' | 'salesperson' | 'admin') => {
    setCurrentUserRole(role);
    setLocation(roleDefaultRoutes[role]);
  };

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

  const RoleSwitcher = () => (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground hidden sm:inline">SWITCH ROLE:</span>
      <div className="flex gap-1">
        {(['customer', 'salesperson', 'admin'] as const).map((role) => (
          <Button
            key={role}
            variant={currentUserRole === role ? "default" : "outline"}
            size="sm"
            className="text-xs h-7 px-2 capitalize"
            onClick={() => handleRoleSwitch(role)}
            data-testid={`button-role-${role}`}
          >
            {role === 'salesperson' ? 'Sales' : role.charAt(0).toUpperCase() + role.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between h-14 px-4 md:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon"><Menu className="w-5 h-5" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-sidebar text-sidebar-foreground border-r-sidebar-border p-0">
                <div className="p-6 border-b border-sidebar-border">
                  <h1 className="text-xl font-bold">Enterprise</h1>
                </div>
                <nav className="p-4 space-y-1">
                  {currentNav.map((item, idx) => (
                    <Link key={`${item.href}-${idx}`} href={item.href}>
                      <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-sidebar-accent/50 cursor-pointer">
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </div>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
                E
              </div>
              <span className="font-bold text-lg hidden sm:inline">Enterprise</span>
              <Badge variant="outline" className="text-[10px] ml-1">
                {currentUserRole.toUpperCase()}
              </Badge>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 ml-6">
              {currentNav.map((item, idx) => (
                <Link key={`${item.href}-${idx}`} href={item.href}>
                  <Button 
                    variant={location === item.href ? "secondary" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {item.label === 'My Cart' && cart.length > 0 && (
                      <Badge variant="destructive" className="h-5 px-1.5 min-w-[1.25rem]">{cart.length}</Badge>
                    )}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Role Switcher in Navbar */}
          <RoleSwitcher />
        </div>
      </header>

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
