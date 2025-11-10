import NextAuth, { DefaultSession } from "next-auth";

/**
 * Extend NextAuth types to include your custom backend data
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      profileImage: string | null;
      authProvider: string;
    };
    backendToken: string;
  }

  interface User {
    backendToken?: string;
    backendUser?: {
      id: string;
      name: string;
      email: string;
      role: string;
      profileImage: string | null;
      authProvider: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    backendUser?: {
      id: string;
      name: string;
      email: string;
      role: string;
      profileImage: string | null;
      authProvider: string;
    };
  }
}
