import { Metadata } from "next";
import { TourClient } from "./TourClient";

export const metadata: Metadata = {
  title: "Virtual Tour | J's International Convention Centre",
  description: "Take an immersive 360-degree virtual tour of J's International Convention Centre. Explore our grand auditorium, green rooms, and beautiful outdoor spaces.",
};

export default function TourPage() {
  return <TourClient />;
}
