import { db } from "./db";
import * as schema from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Collections
  const [col1, col2] = await db.insert(schema.collections).values([
    { name: "Electronics", slug: "electronics" },
    { name: "Home & Garden", slug: "home-garden" },
  ]).returning();

  // Categories
  const [cat1, cat2, cat3] = await db.insert(schema.categories).values([
    { slug: "smartphones", name: "Smartphones", collectionId: col1.id },
    { slug: "laptops", name: "Laptops", collectionId: col1.id },
    { slug: "furniture", name: "Furniture", collectionId: col2.id },
  ]).returning();

  // Subcollections
  const [subcol1, subcol2, subcol3, subcol4] = await db.insert(schema.subcollections).values([
    { name: "Android Phones", categorySlug: "smartphones" },
    { name: "iOS Phones", categorySlug: "smartphones" },
    { name: "Gaming Laptops", categorySlug: "laptops" },
    { name: "Living Room", categorySlug: "furniture" },
  ]).returning();

  // Subcategories
  await db.insert(schema.subcategories).values([
    { slug: "samsung", name: "Samsung", subcollectionId: subcol1.id },
    { slug: "pixel", name: "Google Pixel", subcollectionId: subcol1.id },
    { slug: "iphone", name: "Apple iPhone", subcollectionId: subcol2.id },
    { slug: "razer", name: "Razer", subcollectionId: subcol3.id },
    { slug: "sofas", name: "Sofas", subcollectionId: subcol4.id },
  ]);

  // Suppliers
  const [sup1, sup2] = await db.insert(schema.suppliers).values([
    { name: "TechGiant Distro", contact: "sales@techgiant.com" },
    { name: "HomeStyle Corp", contact: "info@homestyle.com" },
  ]).returning();

  // Customers
  await db.insert(schema.customers).values([
    { name: "John Doe", address: "123 Main St", phone: "555-0123", taxpayerId: "TAX-001" },
    { name: "Jane Smith", address: "456 Oak Ave", phone: "555-0199", taxpayerId: "TAX-002" },
  ]);

  // Products
  await db.insert(schema.products).values([
    {
      slug: "samsung-s24",
      supplierId: sup1.id,
      name: "Samsung Galaxy S24",
      description: "The latest Galaxy smartphone with AI features.",
      price: 799.99,
      subcategorySlug: "samsung",
      article: "SAM-S24",
      code: "8809",
    },
    {
      slug: "iphone-15",
      supplierId: sup1.id,
      name: "iPhone 15",
      description: "New camera. New design. Newphoria.",
      price: 899.99,
      subcategorySlug: "iphone",
      article: "APL-15",
      code: "1901",
    },
    {
      slug: "leather-sofa",
      supplierId: sup2.id,
      name: "Classic Leather Sofa",
      description: "Premium leather 3-seater sofa in brown.",
      price: 1299.00,
      subcategorySlug: "sofas",
      article: "FUR-SOFA-01",
      code: "5005",
    },
  ]);

  console.log("✅ Database seeded successfully!");
}

seed().catch(console.error).finally(() => process.exit());
