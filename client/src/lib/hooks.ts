import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "./api";
import type { 
  InsertSupplier, InsertCustomer, InsertPurchaseOrder, InsertDeliveryNote, InsertProduct,
  InsertCollection, InsertCategory, InsertSubcollection, InsertSubcategory
} from "@shared/schema";

// Query Keys
export const queryKeys = {
  collections: ["collections"],
  categories: ["categories"],
  subcollections: ["subcollections"],
  subcategories: ["subcategories"],
  suppliers: ["suppliers"],
  images: ["images"],
  products: ["products"],
  customers: ["customers"],
  purchaseOrders: ["purchase-orders"],
  deliveryNotes: ["delivery-notes"],
};

// Collections
export const useCollections = () => useQuery({
  queryKey: queryKeys.collections,
  queryFn: api.collectionsAPI.getAll,
});

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertCollection) => api.collectionsAPI.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.collections }),
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertCollection> }) => 
      api.collectionsAPI.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.collections }),
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.collectionsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcollections });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcategories });
    },
  });
};

// Categories
export const useCategories = () => useQuery({
  queryKey: queryKeys.categories,
  queryFn: api.categoriesAPI.getAll,
});

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertCategory) => api.categoriesAPI.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.categories }),
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Partial<InsertCategory> }) => 
      api.categoriesAPI.update(slug, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.categories }),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => api.categoriesAPI.delete(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcollections });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcategories });
    },
  });
};

// Subcollections
export const useSubcollections = () => useQuery({
  queryKey: queryKeys.subcollections,
  queryFn: api.subcollectionsAPI.getAll,
});

export const useCreateSubcollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertSubcollection) => api.subcollectionsAPI.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.subcollections }),
  });
};

export const useUpdateSubcollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertSubcollection> }) => 
      api.subcollectionsAPI.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.subcollections }),
  });
};

export const useDeleteSubcollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.subcollectionsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcollections });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcategories });
    },
  });
};

// Subcategories
export const useSubcategories = () => useQuery({
  queryKey: queryKeys.subcategories,
  queryFn: api.subcategoriesAPI.getAll,
});

export const useCreateSubcategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertSubcategory) => api.subcategoriesAPI.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.subcategories }),
  });
};

export const useUpdateSubcategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Partial<InsertSubcategory> }) => 
      api.subcategoriesAPI.update(slug, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.subcategories }),
  });
};

export const useDeleteSubcategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => api.subcategoriesAPI.delete(slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.subcategories }),
  });
};

// Suppliers
export const useSuppliers = () => useQuery({
  queryKey: queryKeys.suppliers,
  queryFn: api.suppliersAPI.getAll,
});

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertSupplier) => api.suppliersAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suppliers });
    },
  });
};

// Products
export const useProducts = () => useQuery({
  queryKey: queryKeys.products,
  queryFn: api.productsAPI.getAll,
});

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertProduct) => api.productsAPI.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.products }),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsertProduct> }) => 
      api.productsAPI.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.products }),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.productsAPI.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.products }),
  });
};

export const useBulkCreateProducts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertProduct[]) => api.productsAPI.bulkCreate(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.products }),
  });
};

// Customers
export const useCustomers = () => useQuery({
  queryKey: queryKeys.customers,
  queryFn: api.customersAPI.getAll,
});

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertCustomer) => api.customersAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers });
    },
  });
};

// Purchase Orders
export const usePurchaseOrders = () => useQuery({
  queryKey: queryKeys.purchaseOrders,
  queryFn: api.purchaseOrdersAPI.getAll,
});

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertPurchaseOrder) => api.purchaseOrdersAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrders });
    },
  });
};

// Delivery Notes
export const useDeliveryNotes = () => useQuery({
  queryKey: queryKeys.deliveryNotes,
  queryFn: api.deliveryNotesAPI.getAll,
});

export const useCreateDeliveryNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertDeliveryNote) => api.deliveryNotesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryNotes });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrders });
    },
  });
};
