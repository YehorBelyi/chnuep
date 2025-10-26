import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHNUEP",
  description: "Petro Mohyla Black Sea National University Educational Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="flex flex-col min-h-screen"
      >
        {children}
      </body>
    </html>
  );
}
