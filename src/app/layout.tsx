import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Jopi Hostel Katowice Centrum — Noclegi w Centrum Katowic",
    template: "%s | Jopi Hostel Katowice",
  },
  description:
    "Jopi Hostel Katowice Centrum oferuje komfortowe noclegi w samym sercu Katowic. Nowoczesne pokoje, darmowe Wi-Fi, świetna lokalizacja blisko PKP. Zarezerwuj swój pobyt już dziś!",
  keywords: ["hostel katowice", "noclegi katowice", "tanie spanie katowice", "hostel centrum katowice", "jopi hostel", "pokoje katowice"],
  authors: [{ name: "Jopi Hostel" }],
  creator: "Jopi Hostel",
  publisher: "Jopi Hostel",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "Jopi Hostel Katowice Centrum — Noclegi w Centrum Katowic",
    description:
      "Komfortowe pokoje, darmowe Wi-Fi i doskonała lokalizacja w sercu Katowic. Poznaj Jopi Hostel!",
    url: "https://jopihostel.pl",
    siteName: "Jopi Hostel Katowice",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/images/gallery/outside-sign.png",
        width: 1200,
        height: 630,
        alt: "Jopi Hostel Katowice Centrum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jopi Hostel Katowice Centrum",
    description: "Komfortowe noclegi w centrum Katowic. Zarezerwuj online!",
    images: ["/images/gallery/outside-sign.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#2563eb",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Hostel",
              "name": "Jopi Hostel Katowice Centrum",
              "image": "https://jopihostel.pl/images/outside-sign.png",
              "@id": "https://jopihostel.pl",
              "url": "https://jopihostel.pl",
              "telephone": "+48 32 204 34 32",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Plebiscytowa 23",
                "addressLocality": "Katowice",
                "postalCode": "40-063",
                "addressCountry": "PL"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 50.2575,
                "longitude": 19.0194
              },
              "priceRange": "PLN",
              "amenityFeature": [
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Free Wi-Fi",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Shared Kitchen",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Shared Lounge",
                  "value": true
                }
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
