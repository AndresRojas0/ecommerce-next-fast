import type {
  Collection, Category, Subcollection, Subcategory,
  Supplier, Image, Product, Customer,
  PurchaseOrder, DeliveryNote,
  InsertSupplier, InsertCustomer, InsertPurchaseOrder, InsertDeliveryNote, InsertProduct
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
  create: (data: Omit<Collection, "id">) => fetchAPI<Collection>("/collections", {
    method: "POST",
    body: JSON.stringify(data),
  }),
};

// Categories
export const categoriesAPI = {
  getAll: () => fetchAPI<Category[]>("/categories"),
  create: (data: Category) => fetchAPI<Category>("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  }),
};

// Subcollections
export const subcollectionsAPI = {
  getAll: () => fetchAPI<Subcollection[]>("/subcollections"),
  create: (data: Omit<Subcollection, "id">) => fetchAPI<Subcollection>("/subcollections", {
    method: "POST",
    body: JSON.stringify(data),
  }),
};

// Subcategories
export const subcategoriesAPI = {
  getAll: () => fetchAPI<Subcategory[]>("/subcategories"),
  create: (data: Subcategory) => fetchAPI<Subcategory>("/subcategories", {
    method: "POST",
    body: JSON.stringify(data),
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
