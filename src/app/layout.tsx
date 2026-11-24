import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import { FloatingNav, MobileMenu } from "@/components/layout/site-nav";
import { Footer } from "@/components/layout/footer";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { ViewportFx } from "@/components/layout/viewport-fx";
import { site } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Advisor Technologies",
    "general order supplier Pakistan",
    "plant and machinery Islamabad",
    "government supplier Pakistan",
    "IT solutions Islamabad",
    "CCTV and access control Pakistan",
    "office furniture supplier Islamabad",
  ],
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: site.url,
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.tagline}`,
    description: site.description,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  viewportFit: "cover",
};

/** Structured data for search engines, built only from src/lib/site.ts. */
const localBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  description: site.description,
  url: site.url,
  logo: `${site.url}/logos/logo-without-text-removebg.webp`,
  image: `${site.url}/og.jpg`,
  email: site.contact.email,
  telephone: site.contact.phone,
  taxID: site.registration.ntn,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.contact.address.line1}, ${site.contact.address.line2}`,
    addressLocality: site.contact.address.city,
    addressCountry: "PK",
  },
  openingHours: ["Mo-Fr 09:00-18:00", "Sa 10:00-14:00"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${sora.variable} h-full antialiased`}
    >
      <body
        className="flex min-h-full flex-col"
        // Browser extensions inject attributes onto <body> before React
        // hydrates, which otherwise reports a false attribute mismatch.
        suppressHydrationWarning
      >
        {/* Without JS the reveal observer never runs, so un-hide that content. */}
        <noscript>
          <style>{`.reveal,.motion-hide,[data-intro]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-full focus:bg-sky focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <ViewportFx />
        <FloatingNav />
        <MobileMenu />
        <script
          type="application/ld+json"
          // Not user input; `<` escaped anyway, as Next recommends.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness).replace(/</g, "\\u003c") }}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
