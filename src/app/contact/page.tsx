import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | J's International Convention Centre",
  description: "Get in touch with J's International Convention Centre in Kollam. Book your dream event, wedding, or conference today.",
};

export default function ContactPage() {
  return <ContactClient />;
}
