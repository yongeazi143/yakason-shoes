import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yakason Shoes | Quality Express in Footwears · Since 2005",
  description: "Bespoke corporate shoes, handcrafted school wear, and tactical safety boots made with pride in Lagos, Nigeria. CAC (RC 9908327) & SON Registered.",
  keywords: ["Yakason Shoes", "Nigerian handmade shoes", "Corporate Oxford", "Bespoke shoes Lagos", "School shoes bulk Nigeria", "Military Boots Lagos"],
  openGraph: {
    title: "Yakason Shoes | Handcrafted Footwear Since 2005",
    description: "Quality Express in Footwears. Cut, closed, lasted and finished by trained hands in Lagos.",
    images: ["/brand/logo.png"],
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
