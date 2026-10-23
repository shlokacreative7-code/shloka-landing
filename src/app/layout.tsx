import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { headScript } from "@/lib/theme-script";
import { Intro } from "@/components/layout/intro";
import { SmoothScroll } from "@/components/layout/smooth-scroll";

// Instrument Serif for big editorial headings, Plus Jakarta Sans for everything else.
const display = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const sans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const title = `${site.name} · ${site.descriptor}`;

export const metadata: Metadata = {
  ...(site.url && { metadataBase: new URL(site.url), alternates: { canonical: "/" } }),
  title: { default: title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "hospital attendant Lucknow",
    "elderly care Lucknow",
    "patient care companion",
    "verified caregiver Lucknow",
    "hospital assistance service",
    "care for parents in Lucknow",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    title,
    description: site.description,
  },
  twitter: {
    card: "summary",
    title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1f3a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The head script sets data-theme and data-intro before paint, hence suppressHydrationWarning.
    <html lang="en-IN" data-theme="light" suppressHydrationWarning className={`${display.variable} ${sans.variable} antialiased`}>
      <head>
        {/* Browser extensions often inject their own <script> into <head> before React hydrates, which
            React then matches against this one. The script has already run by then, so keep the DOM as is. */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: headScript }} />
      </head>
      <body className="min-h-svh overflow-x-clip">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-xl focus:bg-primary focus:px-5 focus:py-3 focus:font-semibold focus:text-on-primary"
        >
          Skip to content
        </a>
        <Intro />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
