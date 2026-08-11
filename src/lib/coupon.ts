import { Coupon } from "@/models/Coupon";

export type CouponResult = {
  valid: boolean;
  discount: number;
  code?: string;
  message: string;
};

export async function computeCouponDiscount(rawCode: string, subtotal: number): Promise<CouponResult> {
  const code = String(rawCode || "").toUpperCase().trim();
  if (!code) return { valid: false, discount: 0, message: "Enter a coupon code" };

  const coupon = await Coupon.findOne({ code }).lean<{
    code: string;
    type: "flat" | "percent";
    value: number;
    minCart: number;
    maxDiscount: number;
    active: boolean;
    expiresAt?: Date;
  }>();

  if (!coupon || !coupon.active) return { valid: false, discount: 0, message: "Invalid coupon code" };
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, discount: 0, message: "This coupon has expired" };
  }
  if (subtotal < (coupon.minCart || 0)) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum cart of ₹${coupon.minCart} required for this coupon`,
    };
  }

  let discount = coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
  if (coupon.maxDiscount && coupon.maxDiscount > 0) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.min(discount, subtotal);

  return { valid: true, discount, code, message: `Coupon applied — you saved ₹${discount}` };
}
