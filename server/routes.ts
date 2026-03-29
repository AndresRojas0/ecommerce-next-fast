import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCollectionSchema, insertCategorySchema, insertSubcollectionSchema, 
  insertSubcategorySchema, insertSupplierSchema, insertImageSchema, 
  insertProductSchema, insertCustomerSchema, insertPurchaseOrderSchema, 
  insertDeliveryNoteSchema 
} from "@shared/schema";

function asyncHandler(fn: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next);
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Collections
  app.get("/api/collections", asyncHandler(async (req, res) => {
    const collections = await storage.getCollections();
    res.json(collections);
  }));
  
  app.post("/api/collections", asyncHandler(async (req, res) => {
    const result = insertCollectionSchema.safeParse(req.body);
    if (!result.success) return void res.status(400).json({ error: result.error });
    const collection = await storage.createCollection(result.data);
    res.json(collection);
  }));
  
  app.put("/api/collections/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const collection = await storage.updateCollection(id, req.body);
    res.json(collection);
  }));
  
  app.delete("/api/collections/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteCollection(id);
    res.json({ success: true });
  }));
  
  // Categories
  app.get("/api/categories", asyncHandler(async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  }));
  
  app.post("/api/categories", asyncHandler(async (req, res) => {
    const result = insertCategorySchema.safeParse(req.body);
    if (!result.success) return void res.status(400).json({ error: result.error });
    const category = await storage.createCategory(result.data);
    res.json(category);
  }));
  
  app.put("/api/categories/:slug", asyncHandler(async (req, res) => {
    const slug = req.params.slug;
    const category = await storage.updateCategory(slug, req.body);
    res.json(category);
  }));
  
  app.delete("/api/categories/:slug", asyncHandler(async (req, res) => {
    const slug = req.params.slug;
    await storage.deleteCategory(slug);
    res.json({ success: true });
  }));
  
  // Subcollections
  app.get("/api/subcollections", asyncHandler(async (req, res) => {
    const subcollections = await storage.getSubcollections();
    res.json(subcollections);
  }));
  
  app.post("/api/subcollections", asyncHandler(async (req, res) => {
    const result = insertSubcollectionSchema.safeParse(req.body);
    if (!result.success) return void res.status(400).json({ error: result.error });
    const subcollection = await storage.createSubcollection(result.data);
    res.json(subcollection);
  }));
  
  app.put("/api/subcollections/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const subcollection = await storage.updateSubcollection(id, req.body);
    res.json(subcollection);
  }));
  
  app.delete("/api/subcollections/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteSubcollection(id);
    res.json({ success: true });
  }));
  
  // Subcategories
  app.get("/api/subcategories", asyncHandler(async (req, res) => {
    const subcategories = await storage.getSubcategories();
    res.json(subcategories);
  }));
  
  app.post("/api/subcategories", asyncHandler(async (req, res) => {
    const result = insertSubcategorySchema.safeParse(req.body);
    if (!result.success) return void res.status(400).json({ error: result.error });
    const subcategory = await storage.createSubcategory(result.data);
    res.json(subcategory);
  }));
  
  app.put("/api/subcategories/:slug", asyncHandler(async (req, res) => {
    const slug = req.params.slug;
    const subcategory = await storage.updateSubcategory(slug, req.body);
    res.json(subcategory);
  }));
  
  app.delete("/api/subcategories/:slug", asyncHandler(async (req, res) => {
    const slug = req.params.slug;
    await storage.deleteSubcategory(slug);
    res.json({ success: true });
  }));
  
  // Suppliers
  app.get("/api/suppliers", asyncHandler(async (req, res) => {
    const suppliers = await storage.getSuppliers();
    res.json(suppliers);
  }));
  
  app.post("/api/suppliers", asyncHandler(async (req, res) => {
    const result = insertSupplierSchema.safeParse(req.body);
    if (!result.success) return void res.status(400).json({ error: result.error });
    const supplier = await storage.createSupplier(result.data);
    res.json(supplier);
  }));
  
  // Images
  app.get("/api/images", asyncHandler(async (req, res) => {
    const images = await storage.getImages();
    res.json(images);
  }));
  
  app.post("/api/images", asyncHandler(async (req, res) => {
    const result = insertImageSchema.safeParse(req.body);
    if (!result.success) return void res.status(400).json({ error: result.error });
    const image = await storage.createImage(result.data);
    res.json(image);
  }));
  
  // Products
  app.get("/api/products", asyncHandler(async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  }));
  
  app.post("/api/products", asyncHandler(async (req, res) => {
    const result = insertProductSchema.safeParse(req.body);
    if (!result.success) return void res.status(400).json({ error: result.error });
    const product = await storage.createProduct(result.data);
    res.json(product);
  }));
  
  app.post("/api/products/bulk", asyncHandler(async (req, res) => {
    const products = await storage.bulkCreateProducts(req.body);
    res.json(products);
  }));
  
  app.put("/api/products/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const product = await storage.updateProduct(id, req.body);
    res.json(product);
  }));
  
  app.delete("/api/products/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteProduct(id);
    res.json({ success: true });
  }));
  
  // Customers
  app.get("/api/customers", asyncHandler(async (req, res) => {
    const customers = await storage.getCustomers();
    res.json(customers);
  }));
  
  app.post("/api/customers", asyncHandler(async (req, res) => {
    const result = insertCustomerSchema.safeParse(req.body);
    if (!result.success) return void res.status(400).json({ error: result.error });
    const customer = await storage.createCustomer(result.data);
    res.json(customer);
  }));
  
  // Purchase Orders
  app.get("/api/purchase-orders", asyncHandler(async (req, res) => {
    const orders = await storage.getPurchaseOrders();
    res.json(orders);
  }));
  
  app.post("/api/purchase-orders", asyncHandler(async (req, res) => {
    const result = insertPurchaseOrderSchema.safeParse(req.body);
    if (!result.success) return void res.status(400).json({ error: result.error });
    const order = await storage.createPurchaseOrder(result.data);
    res.json(order);
  }));
  
  // Delivery Notes
  app.get("/api/delivery-notes", asyncHandler(async (req, res) => {
    const notes = await storage.getDeliveryNotes();
    res.json(notes);
  }));
  
  app.post("/api/delivery-notes", asyncHandler(async (req, res) => {
    const result = insertDeliveryNoteSchema.safeParse(req.body);
    if (!result.success) return void res.status(400).json({ error: result.error });
    
    await storage.updatePurchaseOrderStatus(result.data.purchaseOrderId, "processed");
    
    const note = await storage.createDeliveryNote(result.data);
    res.json(note);
  }));

  return httpServer;
}
