import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "./api";
import type { InsertSupplier, InsertCustomer, InsertPurchaseOrder, InsertDeliveryNote, InsertProduct } from "@shared/schema";

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

// Categories
export const useCategories = () => useQuery({
  queryKey: queryKeys.categories,
  queryFn: api.categoriesAPI.getAll,
});

// Subcollections
export const useSubcollections = () => useQuery({
  queryKey: queryKeys.subcollections,
  queryFn: api.subcollectionsAPI.getAll,
});

// Subcategories
export const useSubcategories = () => useQuery({
  queryKey: queryKeys.subcategories,
  queryFn: api.subcategoriesAPI.getAll,
});

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

export const useBulkCreateProducts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: InsertProduct[]) => api.productsAPI.bulkCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
    },
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
