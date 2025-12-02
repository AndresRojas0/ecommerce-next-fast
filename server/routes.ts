import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCollectionSchema, insertCategorySchema, insertSubcollectionSchema, 
  insertSubcategorySchema, insertSupplierSchema, insertImageSchema, 
  insertProductSchema, insertCustomerSchema, insertPurchaseOrderSchema, 
  insertDeliveryNoteSchema 
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Collections
  app.get("/api/collections", async (req, res) => {
    const collections = await storage.getCollections();
    res.json(collections);
  });
  
  app.post("/api/collections", async (req, res) => {
    const result = insertCollectionSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: result.error });
    const collection = await storage.createCollection(result.data);
    res.json(collection);
  });
  
  // Categories
  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });
  
  app.post("/api/categories", async (req, res) => {
    const result = insertCategorySchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: result.error });
    const category = await storage.createCategory(result.data);
    res.json(category);
  });
  
  // Subcollections
  app.get("/api/subcollections", async (req, res) => {
    const subcollections = await storage.getSubcollections();
    res.json(subcollections);
  });
  
  app.post("/api/subcollections", async (req, res) => {
    const result = insertSubcollectionSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: result.error });
    const subcollection = await storage.createSubcollection(result.data);
    res.json(subcollection);
  });
  
  // Subcategories
  app.get("/api/subcategories", async (req, res) => {
    const subcategories = await storage.getSubcategories();
    res.json(subcategories);
  });
  
  app.post("/api/subcategories", async (req, res) => {
    const result = insertSubcategorySchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: result.error });
    const subcategory = await storage.createSubcategory(result.data);
    res.json(subcategory);
  });
  
  // Suppliers
  app.get("/api/suppliers", async (req, res) => {
    const suppliers = await storage.getSuppliers();
    res.json(suppliers);
  });
  
  app.post("/api/suppliers", async (req, res) => {
    const result = insertSupplierSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: result.error });
    const supplier = await storage.createSupplier(result.data);
    res.json(supplier);
  });
  
  // Images
  app.get("/api/images", async (req, res) => {
    const images = await storage.getImages();
    res.json(images);
  });
  
  app.post("/api/images", async (req, res) => {
    const result = insertImageSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: result.error });
    const image = await storage.createImage(result.data);
    res.json(image);
  });
  
  // Products
  app.get("/api/products", async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });
  
  app.post("/api/products", async (req, res) => {
    const result = insertProductSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: result.error });
    const product = await storage.createProduct(result.data);
    res.json(product);
  });
  
  app.post("/api/products/bulk", async (req, res) => {
    const products = await storage.bulkCreateProducts(req.body);
    res.json(products);
  });
  
  // Customers
  app.get("/api/customers", async (req, res) => {
    const customers = await storage.getCustomers();
    res.json(customers);
  });
  
  app.post("/api/customers", async (req, res) => {
    const result = insertCustomerSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: result.error });
    const customer = await storage.createCustomer(result.data);
    res.json(customer);
  });
  
  // Purchase Orders
  app.get("/api/purchase-orders", async (req, res) => {
    const orders = await storage.getPurchaseOrders();
    res.json(orders);
  });
  
  app.post("/api/purchase-orders", async (req, res) => {
    const result = insertPurchaseOrderSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: result.error });
    const order = await storage.createPurchaseOrder(result.data);
    res.json(order);
  });
  
  // Delivery Notes
  app.get("/api/delivery-notes", async (req, res) => {
    const notes = await storage.getDeliveryNotes();
    res.json(notes);
  });
  
  app.post("/api/delivery-notes", async (req, res) => {
    const result = insertDeliveryNoteSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json({ error: result.error });
    
    // Auto-update purchase order status
    await storage.updatePurchaseOrderStatus(result.data.purchaseOrderId, "processed");
    
    const note = await storage.createDeliveryNote(result.data);
    res.json(note);
  });

  return httpServer;
}
