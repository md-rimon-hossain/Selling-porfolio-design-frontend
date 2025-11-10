import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/store/ReduxProvider";
import { AuthWrapper } from "@/components/AuthWrapper";
import ConditionalLayout from "../components/ConditionalLayout";
import ToastProvider from "@/components/ToastProvider";
import ConfirmProvider from "@/components/ConfirmProvider";
import { SessionSync } from "@/components/SessionSync";
import { NextAuthProvider } from "@/components/NextAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Design Portfolio - Beautiful Templates & Designs",
  description:
    "Discover amazing design templates and portfolios created by talented designers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <ReduxProvider>
            <SessionSync />
            <AuthWrapper>
              <ToastProvider>
                <ConfirmProvider>
                  <ConditionalLayout>{children}</ConditionalLayout>
                </ConfirmProvider>
              </ToastProvider>
            </AuthWrapper>
          </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
