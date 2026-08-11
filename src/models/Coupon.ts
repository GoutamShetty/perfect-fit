import mongoose, { Schema, model, models } from "mongoose";

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    type: { type: String, enum: ["flat", "percent"], required: true },
    value: { type: Number, required: true },
    minCart: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export type CouponDoc = mongoose.InferSchemaType<typeof CouponSchema> & { _id: mongoose.Types.ObjectId };

export const Coupon = models.Coupon || model("Coupon", CouponSchema);
