/**
 * NextAuth API Route Handler (NextAuth v4)
 *
 * This file exports the NextAuth handlers for the App Router.
 * Handles all OAuth routes: /api/auth/signin, /api/auth/callback, etc.
 */

import NextAuth from "next-auth";
import { authOptions } from "@/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
