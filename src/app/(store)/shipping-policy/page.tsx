import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      title="Shipping Policy"
      sections={[
        { heading: "Processing Time", body: "Orders are processed within 1-2 business days. You will receive a confirmation with your order ID once your order is placed." },
        { heading: "Delivery Time", body: "Standard delivery takes 3-7 business days depending on your location within India. Remote areas may take slightly longer." },
        { heading: "Shipping Charges", body: "We offer FREE shipping on all orders above ₹1999. A flat shipping fee of ₹99 applies to orders below this amount." },
        { heading: "Order Tracking", body: "Once shipped, you can track your order status anytime from the Track Order page using your order ID and registered phone number." },
      ]}
    />
  );
}
