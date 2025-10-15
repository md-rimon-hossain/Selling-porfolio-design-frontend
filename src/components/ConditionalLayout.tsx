"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Pages where header and footer should be hidden
  const hideHeaderFooter = pathname === "/login" || pathname === "/register";
  const hideHeaderWhenDashboard = pathname?.startsWith("/dashboard");

  if (hideHeaderFooter) {
    return <>{children}</>;
  }

  if (hideHeaderWhenDashboard) {
    return <>{children} <Footer/></>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
