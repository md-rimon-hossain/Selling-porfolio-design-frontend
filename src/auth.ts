/**
 * NextAuth v4 Configuration for Google & GitHub OAuth
 *
 * This handles OAuth authentication and syncs with your backend.
 * Your backend JWT token is used for all API requests.
 *
 * Flow:
 * 1. User clicks "Login with Google/GitHub"
 * 2. NextAuth redirects to provider (Google/GitHub)
 * 3. User authorizes, provider redirects back
 * 4. signIn callback sends user data to YOUR backend /auth/oauth
 * 5. Backend creates/updates user, returns JWT token
 * 6. JWT token stored in NextAuth session
 * 7. Frontend uses YOUR token for all API calls
 */

import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login", // Your custom login page
    error: "/login", // Redirect to login on error
  },

  callbacks: {
    /**
     * Called after successful OAuth authentication
     * Syncs user data with YOUR backend
     */
    async signIn({ user, account, profile }) {
      try {
        console.log("🔐 OAuth Sign-In Started:", {
          provider: account?.provider,
          email: user.email,
        });

        if (!account) {
          console.error("❌ No account provided");
          return false;
        }

        // Prepare data for your backend
        const oauthData = {
          name: user.name || profile?.name || user.email?.split("@")[0],
          email: user.email,
          image:
            user.image ||
            (profile as any)?.avatar_url ||
            (profile as any)?.picture,
          provider: account.provider, // 'google' or 'github'
          providerId: account.providerAccountId,
        };

        console.log("📤 Sending to backend:", {
          url: `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth`,
          provider: oauthData.provider,
          email: oauthData.email,
        });

        // Call YOUR backend OAuth sync endpoint
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(oauthData),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Backend OAuth sync failed:", {
            status: response.status,
            error: errorText,
          });
          return false;
        }

        const data = await response.json();
        console.log("✅ Backend response:", {
          success: data.success,
          hasToken: !!data.data?.token,
          hasUser: !!data.data?.user,
        });

        if (!data.success || !data.data?.token) {
          console.error("❌ Invalid response from backend:", data);
          return false;
        }

        // Store YOUR backend data in the user object
        // This will be passed to jwt() callback
        (user as any).backendToken = data.data.token;
        (user as any).backendUser = data.data.user;

        console.log("✅ OAuth sign-in successful");
        return true;
      } catch (error) {
        console.error("❌ OAuth sign-in error:", error);
        return false;
      }
    },

    /**
     * Called whenever a JWT token is created or updated
     * Stores your backend token in the JWT
     */
    async jwt({ token, user, trigger, session }) {
      // Initial sign in - store backend data
      if (user) {
        token.backendToken = (user as any).backendToken;
        token.backendUser = (user as any).backendUser;
      }

      // Handle session updates (if needed)
      if (trigger === "update" && session) {
        token.backendUser = session.user;
      }

      return token;
    },

    /**
     * Called whenever session is checked (useSession, getSession, etc.)
     * Makes your backend data available in the session
     */
    async session({ session, token }) {
      if (token.backendUser) {
        session.user = token.backendUser as any;
        session.backendToken = token.backendToken as string;
      }

      return session;
    },
  },

  session: {
    strategy: "jwt", // Use JWT for sessions (works with serverless)
    maxAge: 7 * 24 * 60 * 60, // 7 days (matches your backend token expiry)
  },

  secret: process.env.AUTH_SECRET,

  debug: process.env.NODE_ENV === "development", // Enable debug logs in development
};

export default NextAuth(authOptions);
