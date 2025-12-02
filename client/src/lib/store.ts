import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Cart state only - all other data comes from API
interface AppState {
  // User Context
  currentUserRole: 'admin' | 'salesperson' | 'customer';
  setCurrentUserRole: (role: 'admin' | 'salesperson' | 'customer') => void;
  
  // Cart (Local to session)
  cart: { productId: number; quantity: number }[];
  addToCart: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

// --- Store Implementation ---

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentUserRole: 'customer',
      cart: [],

      setCurrentUserRole: (role) => set({ currentUserRole: role }),

      addToCart: (productId, quantity) => set((state) => {
        const existingItem = state.cart.find(item => item.productId === productId);
        if (existingItem) {
          return {
            cart: state.cart.map(item => 
              item.productId === productId 
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          };
        }
        return { cart: [...state.cart, { productId, quantity }] };
      }),
      
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.productId !== productId)
      })),
      
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'ecommerce-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
