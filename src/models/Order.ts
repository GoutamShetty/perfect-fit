import mongoose, { Schema, model, models } from "mongoose";

const OrderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    size: { type: String, default: "" },
    color: { type: String, default: "" },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
  },
  { _id: false }
);

function generateOrderId(): string {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `PF-${Date.now().toString().slice(-6)}${rand}`;
}

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true, default: generateOrderId },
    items: { type: [OrderItemSchema], required: true },
    customer: { type: CustomerSchema, required: true },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    amount: { type: Number, required: true },
    couponCode: { type: String, default: "" },
    paymentMethod: { type: String, enum: ["razorpay", "cod"], required: true },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "COD_PENDING"],
      default: "PENDING",
    },
    razorpay: {
      orderId: { type: String, default: "" },
      paymentId: { type: String, default: "" },
      signature: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
  },
  { timestamps: true }
);

export type OrderDoc = mongoose.InferSchemaType<typeof OrderSchema> & { _id: mongoose.Types.ObjectId };

export const Order = models.Order || model("Order", OrderSchema);
