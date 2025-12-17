import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ximy Vault",
  description: "Curated vintage fashion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
