import mongoose, { Schema, model, models } from "mongoose";

const HomeContentSchema = new Schema(
  {
    key: { type: String, default: "singleton", unique: true },
    hero: {
      title: { type: String, default: "Style That Fits. Confidence That Shows." },
      subtitle: {
        type: String,
        default: "Luxury tailored fashion, proudly made in Karnataka.",
      },
      ctaText: { type: String, default: "Shop the Collection" },
      ctaLink: { type: String, default: "/shop" },
      image: { type: String, default: "" },
    },
    marquee: {
      type: [String],
      default: ["Made in Karnataka", "Free Shipping over ₹1999", "Premium Fabrics", "Tailored to Perfection"],
    },
    story: {
      title: { type: String, default: "Crafted for the Modern Individual" },
      body: {
        type: String,
        default:
          "Perfect Fit is a house of dreamers and makers. Every piece is more than fabric — it is confidence, tailored to you. We blend premium materials with meticulous craftsmanship, right here in Karnataka.",
      },
      image: { type: String, default: "" },
    },
    featuredIds: { type: [String], default: [] },
  },
  { timestamps: true }
);

export type HomeContentDoc = mongoose.InferSchemaType<typeof HomeContentSchema>;

export const HomeContent = models.HomeContent || model("HomeContent", HomeContentSchema);
