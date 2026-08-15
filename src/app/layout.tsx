import type { Metadata } from "next";
import { Geist, Montserrat } from "next/font/google";
import "./globals.css";
import SmoothScroll from '@/components/layout/SmoothScroll';
import Butterfly from '@/components/ui/Butterfly';
import WhatsAppWidget from '@/components/ui/WhatsAppWidget';
import { PreloaderProvider } from "@/context/PreloaderContext";
import { AudioProvider } from "@/context/AudioContext";
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import AudioWidget from '@/components/ui/AudioWidget';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://jsconvention.com'),
  title: "J's International Convention Centre | Kalluvathukkal, Kollam",
  description: "A destination where celebrations find their perfect setting. Blending contemporary architecture with the beauty of nature for weddings, conferences, and events.",
  icons: {
    icon: "/pix/icon.svg",
  },
  openGraph: {
    title: "J's International Convention Centre",
    description: "A premier wedding venue and convention centre in Kollam, Kerala.",
    url: 'https://jsconvention.com',
    siteName: "J's International Convention Centre",
    images: [
      {
        url: '/pix/main.webp',
        width: 1920,
        height: 1080,
        alt: "J's International Convention Centre",
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "J's International Convention Centre",
    description: "A premier wedding venue and convention centre in Kollam, Kerala.",
    images: ['/pix/main.webp'],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${montserrat.variable} h-full antialiased bg-luxury-light text-luxury-dark`}
      suppressHydrationWarning
    >
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="preload" href="/pix/main.webp" as="image" />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EventVenue",
              "name": "J's International Convention Centre",
              "image": "https://jsconvention.com/pix/main.webp",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Kalluvathukkal",
                "addressLocality": "Kollam",
                "addressRegion": "Kerala",
                "postalCode": "691578",
                "addressCountry": "IN"
              },
              "telephone": "+911234567890",
              "url": "https://jsconvention.com"
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-luxury-dark focus:text-luxury-light focus:rounded-full focus:outline-none focus:ring-2 focus:ring-luxury-gold"
        >
          Skip to main content
        </a>
        <PreloaderProvider>
          <AudioProvider>
            <Butterfly />
            <WhatsAppWidget />
            <AudioWidget />
            <LoadingIndicator />
            <SmoothScroll>
              {children}
            </SmoothScroll>
          </AudioProvider>
        </PreloaderProvider>
      </body>
    </html>
  );
}
