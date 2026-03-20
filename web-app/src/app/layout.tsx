import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Cinzel, Syne } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Label Reeha | Handcrafted Assamese Jewellery & Textiles",
  description: "Label Reeha creates modern handcrafted jewellery that honors Assamese roots and textiles. Discover our unique collections woven in Assam.",
  keywords: "Assam jewellery, handcrafted jewellery, traditional Assamese textile, Toss Muga, Majuli mask, Label Reeha",
  openGraph: {
    title: "Label Reeha | Handcrafted Assamese Jewellery",
    description: "Assam in every thread. Modern handcrafted jewellery honoring Assamese heritage.",
    url: "https://labelreeha.com",
    siteName: "Label Reeha",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </head>
        <body
          className={`${playfair.variable} ${montserrat.variable} ${cinzel.variable} ${syne.variable} antialiased`}
        >
          <WishlistProvider>
            <CartProvider>
              <CustomCursor />
              <Navbar />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </WishlistProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
