import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppWrapper } from ".";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "store"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
