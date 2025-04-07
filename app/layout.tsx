import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Color Picker Scheme",
  description: "Pick a color and get colors to match!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme='dark' className="dark:bg-slate-400">
      <body
        className={`${inter.variable} antialiased min-h-dvh grid grid-rows-[auto_1fr] grid-cols-1`}
      >
        {children}
      </body>
    </html>
  );
}
