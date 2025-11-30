import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';

// --- Types based on Drizzle Schema ---

export interface Collection {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  slug: string;
  name: string;
  collectionId: string;
  image?: string;
}

export interface Subcollection {
  id: string;
  name: string;
  categorySlug: string;
}

export interface Subcategory {
  slug: string;
  name: string;
  subcollectionId: string;
  image?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
}

export interface Image {
  id: string;
  title: string;
  url: string;
}

export interface Product {
  id: string;
  slug: string;
  supplierId: string;
  article?: string;
  code?: string;
  name: string;
  description: string;
  price: number;
  subcategorySlug: string;
  imageId?: string;
  categoryTags?: string[]; // For the Excel upload requirement
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  taxpayerId: string;
}

export interface PurchaseOrder {
  id: string;
  customerId: string;
  status: 'pending' | 'processed';
  items: {
    productId: string;
    quantity: number;
  }[];
  createdAt: string;
}

export interface DeliveryNote {
  id: string;
  purchaseOrderId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  missingItems: {
    productId: string;
    missingQuantity: number;
  }[];
  createdAt: string;
}

// --- Store Interface ---

interface AppState {
  // Data
  collections: Collection[];
  categories: Category[];
  subcollections: Subcollection[];
  subcategories: Subcategory[];
  products: Product[];
  suppliers: Supplier[];
  customers: Customer[];
  images: Image[];
  purchaseOrders: PurchaseOrder[];
  deliveryNotes: DeliveryNote[];

  // User Context
  currentUserRole: 'admin' | 'salesperson' | 'customer';
  setCurrentUserRole: (role: 'admin' | 'salesperson' | 'customer') => void;
  
  // Cart (Local to session, but kept in store for simplicity)
  cart: { productId: string; quantity: number }[];
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  submitOrder: (customerId: string) => void;

  // Actions
  addCollection: (collection: Collection) => void;
  addCategory: (category: Category) => void;
  addSubcollection: (sub: Subcollection) => void;
  addSubcategory: (sub: Subcategory) => void;
  addProduct: (product: Product) => void;
  addSupplier: (supplier: Supplier) => void;
  createDeliveryNote: (orderId: string, deliveredItems: { productId: string; quantity: number }[]) => void;
  
  // Bulk Import Logic
  bulkUpsertProducts: (products: Partial<Product>[]) => void;
  
  // Reset
  resetStore: () => void;
}

// --- Initial Mock Data ---

const INITIAL_COLLECTIONS: Collection[] = [
  { id: 'col-1', name: 'Electronics', slug: 'electronics' },
  { id: 'col-2', name: 'Home & Garden', slug: 'home-garden' },
];

const INITIAL_CATEGORIES: Category[] = [
  { slug: 'smartphones', name: 'Smartphones', collectionId: 'col-1' },
  { slug: 'laptops', name: 'Laptops', collectionId: 'col-1' },
  { slug: 'furniture', name: 'Furniture', collectionId: 'col-2' },
];

const INITIAL_SUBCOLLECTIONS: Subcollection[] = [
  { id: 'subcol-1', name: 'Android Phones', categorySlug: 'smartphones' },
  { id: 'subcol-2', name: 'iOS Phones', categorySlug: 'smartphones' },
  { id: 'subcol-3', name: 'Gaming Laptops', categorySlug: 'laptops' },
  { id: 'subcol-4', name: 'Living Room', categorySlug: 'furniture' },
];

const INITIAL_SUBCATEGORIES: Subcategory[] = [
  { slug: 'samsung', name: 'Samsung', subcollectionId: 'subcol-1' },
  { slug: 'pixel', name: 'Google Pixel', subcollectionId: 'subcol-1' },
  { slug: 'iphone', name: 'Apple iPhone', subcollectionId: 'subcol-2' },
  { slug: 'razer', name: 'Razer', subcollectionId: 'subcol-3' },
  { slug: 'sofas', name: 'Sofas', subcollectionId: 'subcol-4' },
];

const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 'sup-1', name: 'TechGiant Distro', contact: 'sales@techgiant.com' },
  { id: 'sup-2', name: 'HomeStyle Corp', contact: 'info@homestyle.com' },
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'cust-1', name: 'John Doe', address: '123 Main St', phone: '555-0123', taxpayerId: 'TAX-001' },
  { id: 'cust-2', name: 'Jane Smith', address: '456 Oak Ave', phone: '555-0199', taxpayerId: 'TAX-002' },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    slug: 'samsung-s24',
    supplierId: 'sup-1',
    name: 'Samsung Galaxy S24',
    description: 'The latest Galaxy smartphone with AI features.',
    price: 799.99,
    subcategorySlug: 'samsung',
    article: 'SAM-S24',
    code: '8809',
  },
  {
    id: 'prod-2',
    slug: 'iphone-15',
    supplierId: 'sup-1',
    name: 'iPhone 15',
    description: 'New camera. New design. Newphoria.',
    price: 899.99,
    subcategorySlug: 'iphone',
    article: 'APL-15',
    code: '1901',
  },
  {
    id: 'prod-3',
    slug: 'leather-sofa',
    supplierId: 'sup-2',
    name: 'Classic Leather Sofa',
    description: 'Premium leather 3-seater sofa in brown.',
    price: 1299.00,
    subcategorySlug: 'sofas',
    article: 'FUR-SOFA-01',
    code: '5005',
  }
];

// --- Store Implementation ---

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial Data
      collections: INITIAL_COLLECTIONS,
      categories: INITIAL_CATEGORIES,
      subcollections: INITIAL_SUBCOLLECTIONS,
      subcategories: INITIAL_SUBCATEGORIES,
      products: INITIAL_PRODUCTS,
      suppliers: INITIAL_SUPPLIERS,
      customers: INITIAL_CUSTOMERS,
      images: [],
      purchaseOrders: [],
      deliveryNotes: [],
      
      currentUserRole: 'customer', // Default
      cart: [],

      // Setters
      setCurrentUserRole: (role) => set({ currentUserRole: role }),

      // Actions
      addCollection: (col) => set((state) => ({ collections: [...state.collections, col] })),
      addCategory: (cat) => set((state) => ({ categories: [...state.categories, cat] })),
      addSubcollection: (sub) => set((state) => ({ subcollections: [...state.subcollections, sub] })),
      addSubcategory: (sub) => set((state) => ({ subcategories: [...state.subcategories, sub] })),
      addProduct: (prod) => set((state) => ({ products: [...state.products, prod] })),
      addSupplier: (sup) => set((state) => ({ suppliers: [...state.suppliers, sup] })),

      // Cart Logic
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

      submitOrder: (customerId) => set((state) => {
        if (state.cart.length === 0) return state;
        
        const newOrder: PurchaseOrder = {
          id: `ord-${nanoid(6)}`,
          customerId,
          status: 'pending',
          items: [...state.cart],
          createdAt: new Date().toISOString(),
        };

        return {
          purchaseOrders: [...state.purchaseOrders, newOrder],
          cart: [] // Clear cart after submission
        };
      }),

      createDeliveryNote: (orderId, deliveredItems) => set((state) => {
        const order = state.purchaseOrders.find(o => o.id === orderId);
        if (!order) return state;

        // Calculate missing items
        const missingItems = order.items.map(orderItem => {
          const delivered = deliveredItems.find(d => d.productId === orderItem.productId);
          const deliveredQty = delivered ? delivered.quantity : 0;
          const missingQty = Math.max(0, orderItem.quantity - deliveredQty);
          
          return missingQty > 0 
            ? { productId: orderItem.productId, missingQuantity: missingQty }
            : null;
        }).filter((item): item is { productId: string; missingQuantity: number } => item !== null);

        const newNote: DeliveryNote = {
          id: `dn-${nanoid(6)}`,
          purchaseOrderId: orderId,
          items: deliveredItems,
          missingItems,
          createdAt: new Date().toISOString(),
        };

        // Update order status
        const updatedOrders = state.purchaseOrders.map(o => 
          o.id === orderId ? { ...o, status: 'processed' as const } : o
        );

        return {
          deliveryNotes: [...state.deliveryNotes, newNote],
          purchaseOrders: updatedOrders
        };
      }),

      bulkUpsertProducts: (newProducts) => set((state) => {
        // Simple implementation: Add new, update if ID matches (though ID gen is tricky in bulk without logic)
        // For this prototype, we'll just append valid ones with new IDs
        const processedProducts: Product[] = newProducts.map(p => ({
          ...p,
          id: p.id || `prod-${nanoid(6)}`,
          price: p.price || 0,
          slug: p.slug || `prod-${nanoid(6)}`,
          supplierId: p.supplierId || state.suppliers[0]?.id || 'unknown',
          subcategorySlug: p.subcategorySlug || state.subcategories[0]?.slug || 'unknown',
          name: p.name || 'Imported Product',
          description: p.description || '',
        } as Product));
        
        return { products: [...state.products, ...processedProducts] };
      }),

      resetStore: () => set({
        collections: INITIAL_COLLECTIONS,
        categories: INITIAL_CATEGORIES,
        subcollections: INITIAL_SUBCOLLECTIONS,
        subcategories: INITIAL_SUBCATEGORIES,
        products: INITIAL_PRODUCTS,
        suppliers: INITIAL_SUPPLIERS,
        customers: INITIAL_CUSTOMERS,
        images: [],
        purchaseOrders: [],
        deliveryNotes: [],
        cart: [],
      })
    }),
    {
      name: 'ecommerce-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
