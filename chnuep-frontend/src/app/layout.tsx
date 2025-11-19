import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import AuthPersist from "./components/AuthPersist";

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
        <StoreProvider>
          <AuthPersist>
            {children}
          </AuthPersist>
        </StoreProvider>
      </body>
    </html>
  );
}
