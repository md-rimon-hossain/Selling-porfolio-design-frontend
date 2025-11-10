/**
 * NextAuth Session Provider
 *
 * Wraps the app with NextAuth's SessionProvider for NextAuth v4.
 * This enables useSession() hook throughout the app.
 */

"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface NextAuthProviderProps {
  children: ReactNode;
}

export function NextAuthProvider({ children }: NextAuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
