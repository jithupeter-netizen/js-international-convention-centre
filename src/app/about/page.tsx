import { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | J's International Convention Centre",
  description: "Learn about the history, vision, and mission of J's International Convention Centre in Kollam. A destination where celebrations find their perfect setting.",
};

export default function AboutPage() {
  return <AboutClient />;
}
