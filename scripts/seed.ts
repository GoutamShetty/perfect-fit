import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Product } from "../src/models/Product";
import { Admin } from "../src/models/Admin";
import { HomeContent } from "../src/models/HomeContent";
import { slugify } from "../src/lib/format";

const SAMPLE_PRODUCTS = [
  { name: "Classic Oxford White Shirt", category: "Shirts", mrp: 2499, selling: 1799, badge: "Bestseller", featured: true, colors: ["White", "Sky Blue"], desc: "A timeless oxford shirt tailored from breathable premium cotton. The everyday essential for effortless style." },
  { name: "Midnight Black Formal Shirt", category: "Shirts", mrp: 2699, selling: 1999, badge: "New", featured: true, colors: ["Black"], desc: "Sharp, sleek and made for statement evenings. Wrinkle-resistant premium weave." },
  { name: "Royal Navy Blazer", category: "Suits", mrp: 7999, selling: 5999, badge: "Premium", featured: true, colors: ["Navy"], desc: "A structured navy blazer with a modern slim fit. Crafted for boardrooms and celebrations alike." },
  { name: "Charcoal Two-Piece Suit", category: "Suits", mrp: 12999, selling: 9499, badge: "Premium", featured: true, colors: ["Charcoal"], desc: "The complete power ensemble. Fine wool-blend, impeccably tailored for the perfect silhouette." },
  { name: "Essential Cotton Tee - Beige", category: "T-Shirts", mrp: 1299, selling: 899, featured: true, colors: ["Beige", "Olive", "Black"], desc: "Soft, heavyweight cotton tee with a relaxed premium fit. Your new everyday favourite." },
  { name: "Luxe Pima Crew Tee", category: "T-Shirts", mrp: 1499, selling: 1099, badge: "New", featured: true, colors: ["White", "Grey"], desc: "Ultra-soft Pima cotton crew neck with a refined drape that feels as good as it looks." },
  { name: "Leather Formal Belt", category: "Accessories", mrp: 1999, selling: 1299, colors: ["Brown", "Black"], desc: "Genuine full-grain leather belt with a brushed gold buckle. The finishing touch." },
  { name: "Silk Pocket Square", category: "Accessories", mrp: 899, selling: 599, badge: "New", colors: ["Gold", "Maroon"], desc: "Hand-rolled silk pocket square to elevate any blazer with a touch of luxury." },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("\n[seed] MONGODB_URI is not set. Add it to .env.local (see .env.example).\n");
    process.exit(1);
  }
  await mongoose.connect(uri);
  console.log("[seed] Connected to MongoDB");

  // Admin
  const email = (process.env.ADMIN_EMAIL || "admin@perfectfit.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "changeme123";
  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.findOneAndUpdate({ email }, { email, passwordHash }, { upsert: true });
  console.log(`[seed] Admin ready -> ${email} / ${password}`);

  // Home content
  await HomeContent.findOneAndUpdate({ key: "singleton" }, { key: "singleton" }, { upsert: true });
  console.log("[seed] Home content ready");

  // Products (reset + insert)
  await Product.deleteMany({});
  let i = 1;
  for (const p of SAMPLE_PRODUCTS) {
    await Product.create({
      name: p.name,
      slug: `${slugify(p.name)}-${Math.random().toString(36).slice(2, 6)}`,
      description: p.desc,
      price: { mrp: p.mrp, selling: p.selling },
      images: [
        `https://picsum.photos/seed/perfectfit${i}a/600/800`,
        `https://picsum.photos/seed/perfectfit${i}b/600/800`,
      ],
      category: p.category,
      sizes: p.category === "Accessories" ? ["One Size"] : ["S", "M", "L", "XL"],
      colors: p.colors,
      stock: 100,
      badge: p.badge || "",
      featured: p.featured || false,
      isActive: true,
    });
    i++;
  }
  console.log(`[seed] Inserted ${SAMPLE_PRODUCTS.length} products`);

  await mongoose.disconnect();
  console.log("[seed] Done.\n");
  process.exit(0);
}

seed().catch((e) => {
  console.error("[seed] Failed:", e);
  process.exit(1);
});
