import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/store/auth";
import { AppProvider } from "@/store/app";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WMSU marketplace",
  description: "A private marketplace for WMSU students and faculty",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <AppProvider>
          <body className={inter.className}>{children}</body>
        </AppProvider>
      </AuthProvider>
    </html>
  );
}
