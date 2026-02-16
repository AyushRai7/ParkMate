import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { Providers } from "@/components/Providers";
import "./globals.css";

const notoSans = localFont({
  src: [
    {
      path: "../../public/fonts/NotoSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/NotoSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-noto-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ParkMate",
  description: "Book and manage parking spots easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${notoSans.variable} antialiased`}>
        <Providers>
          <Toaster richColors position="top-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
