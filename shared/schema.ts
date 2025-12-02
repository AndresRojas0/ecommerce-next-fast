import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, serial, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Collections
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const insertCollectionSchema = createInsertSchema(collections).omit({ id: true });
export const selectCollectionSchema = createSelectSchema(collections);
export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type Collection = typeof collections.$inferSelect;

// Categories
export const categories = pgTable("categories", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  collectionId: integer("collection_id").notNull().references(() => collections.id, { onDelete: "cascade" }),
  image: text("image"),
});

export const insertCategorySchema = createInsertSchema(categories);
export const selectCategorySchema = createSelectSchema(categories);
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Subcollections
export const subcollections = pgTable("subcollections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  categorySlug: text("category_slug").notNull().references(() => categories.slug, { onDelete: "cascade" }),
});

export const insertSubcollectionSchema = createInsertSchema(subcollections).omit({ id: true });
export const selectSubcollectionSchema = createSelectSchema(subcollections);
export type InsertSubcollection = z.infer<typeof insertSubcollectionSchema>;
export type Subcollection = typeof subcollections.$inferSelect;

// Subcategories
export const subcategories = pgTable("subcategories", {
  slug: text("slug").primaryKey(),
  name: text("name").notNull(),
  subcollectionId: integer("subcollection_id").notNull().references(() => subcollections.id, { onDelete: "cascade" }),
  image: text("image"),
});

export const insertSubcategorySchema = createInsertSchema(subcategories);
export const selectSubcategorySchema = createSelectSchema(subcategories);
export type InsertSubcategory = z.infer<typeof insertSubcategorySchema>;
export type Subcategory = typeof subcategories.$inferSelect;

// Suppliers
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contact: text("contact").notNull(),
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({ id: true });
export const selectSupplierSchema = createSelectSchema(suppliers);
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;

// Images
export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
});

export const insertImageSchema = createInsertSchema(images).omit({ id: true });
export const selectImageSchema = createSelectSchema(images);
export type InsertImage = z.infer<typeof insertImageSchema>;
export type Image = typeof images.$inferSelect;

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  supplierId: integer("supplier_id").notNull().references(() => suppliers.id),
  article: text("article"),
  code: text("code"),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  subcategorySlug: text("subcategory_slug").notNull().references(() => subcategories.slug),
  imageId: integer("image_id").references(() => images.id),
  categoryTags: text("category_tags").array(),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const selectProductSchema = createSelectSchema(products);
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Customers
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  taxpayerId: text("taxpayer_id").notNull(),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true });
export const selectCustomerSchema = createSelectSchema(customers);
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

// Purchase Orders
export const purchaseOrders = pgTable("purchase_orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  status: text("status").notNull().default("pending"),
  items: jsonb("items").notNull().$type<{ productId: number; quantity: number }[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPurchaseOrderSchema = createInsertSchema(purchaseOrders).omit({ id: true, createdAt: true });
export const selectPurchaseOrderSchema = createSelectSchema(purchaseOrders);
export type InsertPurchaseOrder = z.infer<typeof insertPurchaseOrderSchema>;
export type PurchaseOrder = typeof purchaseOrders.$inferSelect;

// Delivery Notes
export const deliveryNotes = pgTable("delivery_notes", {
  id: serial("id").primaryKey(),
  purchaseOrderId: integer("purchase_order_id").notNull().references(() => purchaseOrders.id),
  items: jsonb("items").notNull().$type<{ productId: number; quantity: number }[]>(),
  missingItems: jsonb("missing_items").notNull().$type<{ productId: number; missingQuantity: number }[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDeliveryNoteSchema = createInsertSchema(deliveryNotes).omit({ id: true, createdAt: true });
export const selectDeliveryNoteSchema = createSelectSchema(deliveryNotes);
export type InsertDeliveryNote = z.infer<typeof insertDeliveryNoteSchema>;
export type DeliveryNote = typeof deliveryNotes.$inferSelect;
