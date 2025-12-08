import type {
  Collection, Category, Subcollection, Subcategory,
  Supplier, Image, Product, Customer,
  PurchaseOrder, DeliveryNote,
  InsertSupplier, InsertCustomer, InsertPurchaseOrder, InsertDeliveryNote, InsertProduct,
  InsertCollection, InsertCategory, InsertSubcollection, InsertSubcategory
} from "@shared/schema";

const API_BASE = "/api";

// Generic fetch wrapper
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
}

// Collections
export const collectionsAPI = {
  getAll: () => fetchAPI<Collection[]>("/collections"),
  create: (data: InsertCollection) => fetchAPI<Collection>("/collections", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<InsertCollection>) => fetchAPI<Collection>(`/collections/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchAPI<{ success: boolean }>(`/collections/${id}`, {
    method: "DELETE",
  }),
};

// Categories
export const categoriesAPI = {
  getAll: () => fetchAPI<Category[]>("/categories"),
  create: (data: InsertCategory) => fetchAPI<Category>("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (slug: string, data: Partial<InsertCategory>) => fetchAPI<Category>(`/categories/${slug}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  delete: (slug: string) => fetchAPI<{ success: boolean }>(`/categories/${slug}`, {
    method: "DELETE",
  }),
};

// Subcollections
export const subcollectionsAPI = {
  getAll: () => fetchAPI<Subcollection[]>("/subcollections"),
  create: (data: InsertSubcollection) => fetchAPI<Subcollection>("/subcollections", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<InsertSubcollection>) => fetchAPI<Subcollection>(`/subcollections/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchAPI<{ success: boolean }>(`/subcollections/${id}`, {
    method: "DELETE",
  }),
};

// Subcategories
export const subcategoriesAPI = {
  getAll: () => fetchAPI<Subcategory[]>("/subcategories"),
  create: (data: InsertSubcategory) => fetchAPI<Subcategory>("/subcategories", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (slug: string, data: Partial<InsertSubcategory>) => fetchAPI<Subcategory>(`/subcategories/${slug}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  delete: (slug: string) => fetchAPI<{ success: boolean }>(`/subcategories/${slug}`, {
    method: "DELETE",
  }),
};

// Suppliers
export const suppliersAPI = {
  getAll: () => fetchAPI<Supplier[]>("/suppliers"),
  create: (data: InsertSupplier) => fetchAPI<Supplier>("/suppliers", {
    method: "POST",
    body: JSON.stringify(data),
  }),
};

// Images
export const imagesAPI = {
  getAll: () => fetchAPI<Image[]>("/images"),
};

// Products
export const productsAPI = {
  getAll: () => fetchAPI<Product[]>("/products"),
  create: (data: InsertProduct) => fetchAPI<Product>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (id: number, data: Partial<InsertProduct>) => fetchAPI<Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  delete: (id: number) => fetchAPI<{ success: boolean }>(`/products/${id}`, {
    method: "DELETE",
  }),
  bulkCreate: (data: InsertProduct[]) => fetchAPI<Product[]>("/products/bulk", {
    method: "POST",
    body: JSON.stringify(data),
  }),
};

// Customers
export const customersAPI = {
  getAll: () => fetchAPI<Customer[]>("/customers"),
  create: (data: InsertCustomer) => fetchAPI<Customer>("/customers", {
    method: "POST",
    body: JSON.stringify(data),
  }),
};

// Purchase Orders
export const purchaseOrdersAPI = {
  getAll: () => fetchAPI<PurchaseOrder[]>("/purchase-orders"),
  create: (data: InsertPurchaseOrder) => fetchAPI<PurchaseOrder>("/purchase-orders", {
    method: "POST",
    body: JSON.stringify(data),
  }),
};

// Delivery Notes
export const deliveryNotesAPI = {
  getAll: () => fetchAPI<DeliveryNote[]>("/delivery-notes"),
  create: (data: InsertDeliveryNote) => fetchAPI<DeliveryNote>("/delivery-notes", {
    method: "POST",
    body: JSON.stringify(data),
  }),
};
