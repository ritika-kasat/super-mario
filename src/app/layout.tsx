import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const pressStart2P = Press_Start_2P({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start"
});

export const metadata: Metadata = {
  title: "Super Mario",
  description: "A retro Mario-style platformer web game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${pressStart2P.variable} font-sans bg-[#1a1a1a] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
