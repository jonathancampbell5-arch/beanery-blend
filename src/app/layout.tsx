import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beanery Blend",
  description: "Where flavor transcends — Beanery Blend coffee.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
