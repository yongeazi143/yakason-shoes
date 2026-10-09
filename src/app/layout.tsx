import type { Metadata } from "next";
import "./globals.css";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: SITE.seo.title,
  description: SITE.seo.description,
  keywords: [...SITE.seo.keywords],
  openGraph: {
    title: SITE.seo.openGraph.title,
    description: SITE.seo.openGraph.description,
    images: [...SITE.seo.openGraph.images],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400..900;1,400..900&family=Orbitron:wght@500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen relative selection:bg-[#D4A24C] selection:text-[#3B1E16]">
        <div className="grain-overlay" />
        {children}
      </body>
    </html>
  );
}
