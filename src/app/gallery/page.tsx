import { Metadata } from "next";
import { GalleryClient } from "./GalleryClient";

export const metadata: Metadata = {
  title: "Gallery | J's International Convention Centre",
  description: "Browse the photo gallery of J's International Convention Centre in Kollam. See beautiful weddings, elegant events, and our stunning facilities.",
};

export default function GalleryPage() {
  return <GalleryClient />;
}
