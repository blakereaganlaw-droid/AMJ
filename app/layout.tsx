import type { Metadata } from "next";
import { APP_NAME } from "@/lib/constants/app";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "A calm, private health journal and tracker for your daily wellness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
