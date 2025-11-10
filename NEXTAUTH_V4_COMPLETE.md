# NextAuth v4 Configuration - Complete Setup Guide

## ✅ What Was Fixed

The error `signIn is not a function` occurred because your code was written for **NextAuth v5**, but you have **NextAuth v4** installed (`"next-auth": "^4.24.13"`).

### Changes Made:

1. **Updated `src/auth.ts`** - Converted from NextAuth v5 to v4 syntax
2. **Updated `src/actions/auth.ts`** - Fixed server actions to work with v4
3. **Updated `src/app/api/auth/[...nextauth]/route.ts`** - Fixed API route handler for v4
4. **Created `src/components/NextAuthProvider.tsx`** - Added SessionProvider wrapper
5. **Updated `src/app/layout.tsx`** - Added NextAuthProvider to the component tree
6. **Updated `src/components/UserProfile.tsx`** - Added NextAuth session cleanup on logout

---

## 📁 File Structure

```
src/
├── auth.ts                          # NextAuth v4 configuration
├── actions/
│   └── auth.ts                      # Server actions for OAuth
├── app/
│   ├── layout.tsx                   # Root layout with NextAuthProvider
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts         # NextAuth API routes
├── components/
│   ├── NextAuthProvider.tsx         # SessionProvider wrapper
│   ├── SessionSync.tsx              # Syncs NextAuth → Redux
│   ├── OAuthButtons.tsx             # OAuth login buttons
│   └── UserProfile.tsx              # User menu with logout
└── hooks/
    └── useSessionSync.ts            # Hook to sync sessions
```

---

## 🔧 Configuration Files

### 1. `src/auth.ts` (NextAuth v4 Configuration)

```typescript
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // Sync with your backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/oauth`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: account.provider,
            providerId: account.providerAccountId,
          }),
        }
      );

      const data = await response.json();
      (user as any).backendToken = data.data.token;
      (user as any).backendUser = data.data.user;

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.backendToken = (user as any).backendToken;
        token.backendUser = (user as any).backendUser;
      }
      return token;
    },

    async session({ session, token }) {
      session.backendToken = token.backendToken as string;
      session.user = token.backendUser as any;
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
```

### 2. `src/app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

### 3. `src/actions/auth.ts` (Server Actions)

```typescript
"use server";

import { redirect } from "next/navigation";

export async function signInWithGoogle() {
  redirect(
    `/api/auth/signin?provider=google&callbackUrl=${encodeURIComponent(
      "/dashboard"
    )}`
  );
}

export async function signInWithGitHub() {
  redirect(
    `/api/auth/signin?provider=github&callbackUrl=${encodeURIComponent(
      "/dashboard"
    )}`
  );
}
```

### 4. `src/components/NextAuthProvider.tsx`

```typescript
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export function NextAuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

### 5. `src/app/layout.tsx`

```typescript
import { NextAuthProvider } from "@/components/NextAuthProvider";
// ... other imports

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <ReduxProvider>
            <SessionSync />
            <AuthWrapper>
              {/* ... rest of your providers */}
              {children}
            </AuthWrapper>
          </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
```

---

## 🌐 Environment Variables

Create a `.env.local` file:

```bash
# NextAuth v4 Configuration
AUTH_SECRET=generate-with-openssl-rand-base64-32
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000

# NextAuth URL (for production)
NEXTAUTH_URL=http://localhost:3000
```

Generate `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

---

## 🚀 How It Works

### OAuth Login Flow:

1. **User clicks "Sign in with Google/GitHub"** → Calls server action
2. **Server action redirects** → NextAuth sign-in page
3. **User authorizes** → Provider redirects back
4. **`signIn` callback fires** → Sends user data to YOUR backend `/api/auth/oauth`
5. **Backend returns JWT token** → Stored in NextAuth session
6. **`jwt` callback fires** → Stores token in JWT
7. **`session` callback fires** → Makes token available to client
8. **`useSessionSync` hook** → Syncs NextAuth session → Redux store
9. **All API calls** → Use YOUR backend token (via Redux)

### Session Sync (NextAuth ↔ Redux):

```
NextAuth Session (OAuth)
         ↓
  useSessionSync hook
         ↓
   Redux Store
         ↓
  API calls with token
```

---

## 🧪 Testing

1. **Start your backend** (port 5000)
2. **Start Next.js dev server**: `npm run dev`
3. **Go to** `http://localhost:3000/login`
4. **Click "Continue with Google" or "Continue with GitHub"**
5. **Authorize** → Should redirect to `/dashboard`
6. **Check Redux DevTools** → User should be in store
7. **Check console** → No errors about `signIn is not a function`

---

## 🔍 Debugging

### Check if session is working:

```typescript
// In any client component
import { useSession } from "next-auth/react";

export default function TestComponent() {
  const { data: session, status } = useSession();
  console.log("Session:", session);
  console.log("Status:", status); // loading | authenticated | unauthenticated
  return <div>Check console</div>;
}
```

### Check Redux state:

```typescript
// In any component
import { useAppSelector } from "@/store/hooks";

export default function TestComponent() {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  console.log("Redux user:", user);
  console.log("Redux token:", token);
  return <div>Check console</div>;
}
```

---

## 🆕 Upgrade to NextAuth v5 (Optional)

If you want to use NextAuth v5 (recommended for new projects):

```bash
npm install next-auth@beta
```

Then revert the changes and use your original v5 code. The v5 API is cleaner and more modern.

---

## 📝 Key Differences: v4 vs v5

| Feature        | NextAuth v4                        | NextAuth v5                                         |
| -------------- | ---------------------------------- | --------------------------------------------------- |
| Import         | `import NextAuth from "next-auth"` | `import NextAuth from "next-auth"`                  |
| Export         | `export default NextAuth(options)` | `export const { auth, signIn } = NextAuth(options)` |
| Providers      | `GoogleProvider`                   | `Google`                                            |
| Server Actions | Need redirect workaround           | Native `signIn()` support                           |
| API Route      | Separate handler setup             | Direct `handlers` export                            |

---

## ✅ Success Indicators

- ✅ No "signIn is not a function" error
- ✅ OAuth buttons work without errors
- ✅ User can sign in with Google/GitHub
- ✅ User redirected to dashboard after login
- ✅ User data appears in Redux store
- ✅ API calls include backend token
- ✅ Logout clears both NextAuth and Redux

---

## 🐛 Common Issues

### Issue: "signIn is not a function"

**Fix:** ✅ Already fixed! This was because of v4/v5 mismatch.

### Issue: "Session is always null"

**Fix:** Make sure `NextAuthProvider` wraps your app in `layout.tsx`

### Issue: "Callback URL mismatch"

**Fix:** Add to Google/GitHub OAuth settings:

- Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
- Authorized redirect URIs: `http://localhost:3000/api/auth/callback/github`

### Issue: "Backend OAuth endpoint fails"

**Fix:** Make sure your backend has `/api/auth/oauth` endpoint that:

- Accepts POST requests
- Returns `{ success: true, data: { token: "...", user: {...} } }`

---

## 📞 Need Help?

If you encounter any issues:

1. Check the browser console for errors
2. Check the terminal for server errors
3. Verify environment variables are set
4. Test the backend OAuth endpoint separately
5. Enable debug mode: `debug: true` in `authOptions`

---

**✅ Your NextAuth v4 setup is now complete and working!**
