import mongoose, { Schema, model, models } from "mongoose";

const PriceSchema = new Schema(
  {
    mrp: { type: Number, required: true },
    selling: { type: Number, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    price: { type: PriceSchema, required: true },
    images: { type: [String], default: [] },
    category: { type: String, default: "Shirts", index: true },
    sizes: { type: [String], default: ["S", "M", "L", "XL"] },
    colors: { type: [String], default: [] },
    stock: { type: Number, default: 100 },
    badge: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export type ProductDoc = mongoose.InferSchemaType<typeof ProductSchema> & { _id: mongoose.Types.ObjectId };

export const Product = models.Product || model("Product", ProductSchema);
