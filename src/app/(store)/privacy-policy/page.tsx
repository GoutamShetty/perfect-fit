import LegalPage from "@/components/LegalPage";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      sections={[
        { heading: "Information We Collect", body: "We collect information you provide at checkout such as your name, contact details and shipping address, solely to fulfil and deliver your orders." },
        { heading: "How We Use It", body: "Your information is used to process orders, provide customer support, and send order updates. We never sell your personal data to third parties." },
        { heading: "Payments", body: "Online payments are processed securely by Razorpay. We do not store your card or banking details on our servers." },
        { heading: "Contact", body: "For any privacy-related questions or requests to delete your data, please reach out through our Contact page." },
      ]}
    />
  );
}
