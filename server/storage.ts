import { db } from "./db";
import { eq } from "drizzle-orm";
import * as schema from "@shared/schema";
import type {
  Collection, InsertCollection,
  Category, InsertCategory,
  Subcollection, InsertSubcollection,
  Subcategory, InsertSubcategory,
  Supplier, InsertSupplier,
  Image, InsertImage,
  Product, InsertProduct,
  Customer, InsertCustomer,
  PurchaseOrder, InsertPurchaseOrder,
  DeliveryNote, InsertDeliveryNote
} from "@shared/schema";

export interface IStorage {
  // Collections
  getCollections(): Promise<Collection[]>;
  getCollection(id: number): Promise<Collection | undefined>;
  createCollection(data: InsertCollection): Promise<Collection>;
  updateCollection(id: number, data: Partial<InsertCollection>): Promise<Collection>;
  deleteCollection(id: number): Promise<void>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(slug: string): Promise<Category | undefined>;
  createCategory(data: InsertCategory): Promise<Category>;
  updateCategory(slug: string, data: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(slug: string): Promise<void>;
  
  // Subcollections
  getSubcollections(): Promise<Subcollection[]>;
  getSubcollection(id: number): Promise<Subcollection | undefined>;
  createSubcollection(data: InsertSubcollection): Promise<Subcollection>;
  updateSubcollection(id: number, data: Partial<InsertSubcollection>): Promise<Subcollection>;
  deleteSubcollection(id: number): Promise<void>;
  
  // Subcategories
  getSubcategories(): Promise<Subcategory[]>;
  getSubcategory(slug: string): Promise<Subcategory | undefined>;
  createSubcategory(data: InsertSubcategory): Promise<Subcategory>;
  updateSubcategory(slug: string, data: Partial<InsertSubcategory>): Promise<Subcategory>;
  deleteSubcategory(slug: string): Promise<void>;
  
  // Suppliers
  getSuppliers(): Promise<Supplier[]>;
  getSupplier(id: number): Promise<Supplier | undefined>;
  createSupplier(data: InsertSupplier): Promise<Supplier>;
  
  // Images
  getImages(): Promise<Image[]>;
  createImage(data: InsertImage): Promise<Image>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(data: InsertProduct): Promise<Product>;
  updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  bulkCreateProducts(data: InsertProduct[]): Promise<Product[]>;
  
  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(data: InsertCustomer): Promise<Customer>;
  
  // Purchase Orders
  getPurchaseOrders(): Promise<PurchaseOrder[]>;
  getPurchaseOrder(id: number): Promise<PurchaseOrder | undefined>;
  createPurchaseOrder(data: InsertPurchaseOrder): Promise<PurchaseOrder>;
  updatePurchaseOrderStatus(id: number, status: string): Promise<void>;
  
  // Delivery Notes
  getDeliveryNotes(): Promise<DeliveryNote[]>;
  createDeliveryNote(data: InsertDeliveryNote): Promise<DeliveryNote>;
}

export class DatabaseStorage implements IStorage {
  // Collections
  async getCollections(): Promise<Collection[]> {
    return db.select().from(schema.collections);
  }
  
  async getCollection(id: number): Promise<Collection | undefined> {
    const [result] = await db.select().from(schema.collections).where(eq(schema.collections.id, id));
    return result;
  }
  
  async createCollection(data: InsertCollection): Promise<Collection> {
    const [result] = await db.insert(schema.collections).values(data).returning();
    return result;
  }
  
  async updateCollection(id: number, data: Partial<InsertCollection>): Promise<Collection> {
    const [result] = await db.update(schema.collections).set(data).where(eq(schema.collections.id, id)).returning();
    return result;
  }
  
  async deleteCollection(id: number): Promise<void> {
    await db.delete(schema.collections).where(eq(schema.collections.id, id));
  }
  
  // Categories
  async getCategories(): Promise<Category[]> {
    return db.select().from(schema.categories);
  }
  
  async getCategory(slug: string): Promise<Category | undefined> {
    const [result] = await db.select().from(schema.categories).where(eq(schema.categories.slug, slug));
    return result;
  }
  
  async createCategory(data: InsertCategory): Promise<Category> {
    const [result] = await db.insert(schema.categories).values(data).returning();
    return result;
  }
  
  async updateCategory(slug: string, data: Partial<InsertCategory>): Promise<Category> {
    const [result] = await db.update(schema.categories).set(data).where(eq(schema.categories.slug, slug)).returning();
    return result;
  }
  
  async deleteCategory(slug: string): Promise<void> {
    await db.delete(schema.categories).where(eq(schema.categories.slug, slug));
  }
  
  // Subcollections
  async getSubcollections(): Promise<Subcollection[]> {
    return db.select().from(schema.subcollections);
  }
  
  async getSubcollection(id: number): Promise<Subcollection | undefined> {
    const [result] = await db.select().from(schema.subcollections).where(eq(schema.subcollections.id, id));
    return result;
  }
  
  async createSubcollection(data: InsertSubcollection): Promise<Subcollection> {
    const [result] = await db.insert(schema.subcollections).values(data).returning();
    return result;
  }
  
  async updateSubcollection(id: number, data: Partial<InsertSubcollection>): Promise<Subcollection> {
    const [result] = await db.update(schema.subcollections).set(data).where(eq(schema.subcollections.id, id)).returning();
    return result;
  }
  
  async deleteSubcollection(id: number): Promise<void> {
    await db.delete(schema.subcollections).where(eq(schema.subcollections.id, id));
  }
  
  // Subcategories
  async getSubcategories(): Promise<Subcategory[]> {
    return db.select().from(schema.subcategories);
  }
  
  async getSubcategory(slug: string): Promise<Subcategory | undefined> {
    const [result] = await db.select().from(schema.subcategories).where(eq(schema.subcategories.slug, slug));
    return result;
  }
  
  async createSubcategory(data: InsertSubcategory): Promise<Subcategory> {
    const [result] = await db.insert(schema.subcategories).values(data).returning();
    return result;
  }
  
  async updateSubcategory(slug: string, data: Partial<InsertSubcategory>): Promise<Subcategory> {
    const [result] = await db.update(schema.subcategories).set(data).where(eq(schema.subcategories.slug, slug)).returning();
    return result;
  }
  
  async deleteSubcategory(slug: string): Promise<void> {
    await db.delete(schema.subcategories).where(eq(schema.subcategories.slug, slug));
  }
  
  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    return db.select().from(schema.suppliers);
  }
  
  async getSupplier(id: number): Promise<Supplier | undefined> {
    const [result] = await db.select().from(schema.suppliers).where(eq(schema.suppliers.id, id));
    return result;
  }
  
  async createSupplier(data: InsertSupplier): Promise<Supplier> {
    const [result] = await db.insert(schema.suppliers).values(data).returning();
    return result;
  }
  
  // Images
  async getImages(): Promise<Image[]> {
    return db.select().from(schema.images);
  }
  
  async createImage(data: InsertImage): Promise<Image> {
    const [result] = await db.insert(schema.images).values(data).returning();
    return result;
  }
  
  // Products
  async getProducts(): Promise<Product[]> {
    return db.select().from(schema.products);
  }
  
  async getProduct(id: number): Promise<Product | undefined> {
    const [result] = await db.select().from(schema.products).where(eq(schema.products.id, id));
    return result;
  }
  
  async createProduct(data: InsertProduct): Promise<Product> {
    const [result] = await db.insert(schema.products).values(data).returning();
    return result;
  }
  
  async updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product> {
    const [result] = await db.update(schema.products).set(data).where(eq(schema.products.id, id)).returning();
    return result;
  }
  
  async deleteProduct(id: number): Promise<void> {
    await db.delete(schema.products).where(eq(schema.products.id, id));
  }
  
  async bulkCreateProducts(data: InsertProduct[]): Promise<Product[]> {
    if (data.length === 0) return [];
    return db.insert(schema.products).values(data).returning();
  }
  
  // Customers
  async getCustomers(): Promise<Customer[]> {
    return db.select().from(schema.customers);
  }
  
  async getCustomer(id: number): Promise<Customer | undefined> {
    const [result] = await db.select().from(schema.customers).where(eq(schema.customers.id, id));
    return result;
  }
  
  async createCustomer(data: InsertCustomer): Promise<Customer> {
    const [result] = await db.insert(schema.customers).values(data).returning();
    return result;
  }
  
  // Purchase Orders
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    return db.select().from(schema.purchaseOrders);
  }
  
  async getPurchaseOrder(id: number): Promise<PurchaseOrder | undefined> {
    const [result] = await db.select().from(schema.purchaseOrders).where(eq(schema.purchaseOrders.id, id));
    return result;
  }
  
  async createPurchaseOrder(data: InsertPurchaseOrder): Promise<PurchaseOrder> {
    const [result] = await db.insert(schema.purchaseOrders).values(data).returning();
    return result;
  }
  
  async updatePurchaseOrderStatus(id: number, status: string): Promise<void> {
    await db.update(schema.purchaseOrders)
      .set({ status })
      .where(eq(schema.purchaseOrders.id, id));
  }
  
  // Delivery Notes
  async getDeliveryNotes(): Promise<DeliveryNote[]> {
    return db.select().from(schema.deliveryNotes);
  }
  
  async createDeliveryNote(data: InsertDeliveryNote): Promise<DeliveryNote> {
    const [result] = await db.insert(schema.deliveryNotes).values(data).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
