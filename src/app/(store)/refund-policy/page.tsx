import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund & Return Policy"
      sections={[
        { heading: "Returns", body: "We accept returns within 7 days of delivery. Items must be unworn, unwashed and in their original condition with tags attached." },
        { heading: "Refunds", body: "Once we receive and inspect your return, your refund will be processed to the original payment method within 5-7 business days." },
        { heading: "Exchanges", body: "Need a different size or colour? We are happy to exchange eligible items subject to availability. Reach out via the Contact page." },
        { heading: "Non-Returnable Items", body: "For hygiene reasons, certain items such as innerwear and accessories may not be eligible for return. This will be indicated on the product page." },
      ]}
    />
  );
}
