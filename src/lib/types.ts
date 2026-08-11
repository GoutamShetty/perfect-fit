export type ProductJSON = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: { mrp: number; selling: number };
  images: string[];
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  badge: string;
  featured: boolean;
  isActive: boolean;
};

export type OrderItemJSON = {
  productId: string;
  name: string;
  image?: string;
  size?: string;
  color?: string;
  qty: number;
  price: number;
};

export type OrderJSON = {
  _id: string;
  orderId: string;
  items: OrderItemJSON[];
  customer: {
    name: string;
    email?: string;
    phone: string;
    address: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  subtotal: number;
  discount: number;
  shipping: number;
  amount: number;
  couponCode?: string;
  paymentMethod: "razorpay" | "cod";
  paymentStatus: string;
  status: string;
  createdAt: string;
};

export type CouponJSON = {
  _id: string;
  code: string;
  type: "flat" | "percent";
  value: number;
  minCart: number;
  maxDiscount: number;
  active: boolean;
  expiresAt?: string;
};

export function serialize<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc)) as T;
}
