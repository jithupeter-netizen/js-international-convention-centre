import { Metadata } from "next";
import { SpacesClient } from "./SpacesClient";

export const metadata: Metadata = {
  title: "Our Spaces | J's International Convention Centre",
  description: "Explore the Grand Auditorium, Banquet Halls, Amphitheatre, and luxurious spaces at J's International Convention Centre.",
  alternates: {
    canonical: '/spaces/',
  },
};

export default function SpacesPage() {
  return <SpacesClient />;
}
