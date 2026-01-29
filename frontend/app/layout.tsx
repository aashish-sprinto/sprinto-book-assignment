import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "../lib/apollo-wrapper";
import { AuthProvider } from "../lib/auth-context";
import { ToastProvider } from "../lib/toast-context";
import { ToastContainer } from "../components/ToastContainer";

import NavBar from "../components/NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sprinto Books Library",
  description: "Manage your books and authors efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ApolloWrapper>
            <ToastProvider>
              <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
                <NavBar />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {children}
                </main>
              </div>
              <ToastContainer />
            </ToastProvider>
          </ApolloWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
