import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { currentUserRole } = useStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (currentUserRole === 'customer') setLocation('/shop');
    else if (currentUserRole === 'salesperson') setLocation('/sales');
    else if (currentUserRole === 'admin') setLocation('/admin');
  }, [currentUserRole, setLocation]);

  return null;
}
