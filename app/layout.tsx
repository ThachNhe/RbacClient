import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MainNav } from "@/components/layout/main-nav";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RBAC Application",
  description: "A power tool help develops NestJS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <div className="min-h-screen bg-background flex flex-col">
          <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
              <MainNav />
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className=""></footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
