# 🔐 OAuth Setup Guide (Google & GitHub Login)

## ✅ What's Been Implemented

Your application now has **production-ready OAuth authentication** with Google and GitHub! Here's what was added:

### 📁 New Files Created

1. **`auth.ts`** - NextAuth v5 configuration
2. **`src/app/api/auth/[...nextauth]/route.ts`** - API route handler
3. **`src/types/next-auth.d.ts`** - TypeScript definitions
4. **`src/actions/auth.ts`** - Server actions for OAuth sign-in
5. **`src/hooks/useSessionSync.ts`** - Redux-NextAuth sync hook
6. **`src/components/OAuthButtons.tsx`** - Login buttons component
7. **`src/components/SessionSync.tsx`** - Session sync wrapper

### 🔄 Modified Files

1. **`src/store/ReduxProvider.tsx`** - Added NextAuth SessionProvider
2. **`src/app/layout.tsx`** - Added SessionSync component
3. **`src/app/login/page.tsx`** - Integrated OAuth buttons
4. **`.env.example`** - Added OAuth environment variables

---

## 📋 Prerequisites

Before you start, make sure:

✅ Your backend `/api/auth/oauth` endpoint is deployed and working  
✅ You have Node.js 18+ installed  
✅ You have access to Google Cloud Console and GitHub Settings

---

## 🚀 Step-by-Step Setup

### Step 1: Install Dependencies

```bash
npm install next-auth@beta
```

> **Note:** We're using NextAuth v5 (beta) for Next.js 14 App Router compatibility.

---

### Step 2: Generate AUTH_SECRET

Run this command to generate a secure secret:

```bash
# On macOS/Linux
openssl rand -base64 32

# On Windows PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output - you'll need it for `.env.local`.

---

### Step 3: Set Up Google OAuth

#### 3.1 Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Create a new project or select existing one
3. Navigate to **APIs & Services** > **Credentials**

#### 3.2 Create OAuth 2.0 Client ID

1. Click **Create Credentials** > **OAuth client ID**
2. Choose **Web application**
3. Configure:

   - **Name:** "Your App Name - OAuth"
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (development)
     - `https://your-production-domain.com` (production)
   - **Authorized redirect URIs:**
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://your-production-domain.com/api/auth/callback/google` (production)

4. Click **Create**
5. Copy **Client ID** and **Client Secret**

#### 3.3 Configure OAuth Consent Screen

1. Go to **OAuth consent screen**
2. Choose **External** (for public apps) or **Internal** (for workspace apps)
3. Fill in:
   - **App name:** Your App Name
   - **User support email:** your-email@example.com
   - **Developer contact information:** your-email@example.com
4. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
5. Save and continue

---

### Step 4: Set Up GitHub OAuth

#### 4.1 Go to GitHub Settings

1. Visit: https://github.com/settings/developers
2. Click **New OAuth App**

#### 4.2 Register OAuth Application

1. Fill in:

   - **Application name:** "Your App Name"
   - **Homepage URL:** `http://localhost:3000` (development) or `https://your-domain.com` (production)
   - **Authorization callback URL:**
     - `http://localhost:3000/api/auth/callback/github` (development)
     - `https://your-domain.com/api/auth/callback/github` (production)

2. Click **Register application**
3. Copy **Client ID**
4. Click **Generate a new client secret**
5. Copy **Client Secret** (you won't see it again!)

---

### Step 5: Configure Environment Variables

Create `.env.local` in your frontend root:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000

# NextAuth Secret (from Step 2)
AUTH_SECRET=your-generated-secret-from-step-2
AUTH_TRUST_HOST=true

# Google OAuth (from Step 3)
AUTH_GOOGLE_ID=123456789-abcdef.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=GOCSPX-your-google-secret

# GitHub OAuth (from Step 4)
AUTH_GITHUB_ID=Iv1.your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret
```

**⚠️ Important:** Never commit `.env.local` to git!

---

### Step 6: Update Backend API URL (if needed)

Make sure `NEXT_PUBLIC_API_URL` in `.env.local` points to your backend:

```env
# Development
NEXT_PUBLIC_API_URL=http://localhost:5000

# Production
# NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

---

### Step 7: Test OAuth Login

1. **Start your backend server:**

   ```bash
   cd ../backend
   npm run dev
   ```

2. **Start your frontend server:**

   ```bash
   npm run dev
   ```

3. **Test the login flow:**
   - Go to `http://localhost:3000/login`
   - Click "Continue with Google" or "Continue with GitHub"
   - Authorize the app
   - You should be redirected to `/dashboard`
   - Check Redux DevTools - user data and token should be stored

---

## 🔍 How It Works

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User clicks "Login with Google/GitHub"                  │
│    (OAuthButtons.tsx)                                       │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. NextAuth redirects to OAuth provider                     │
│    (Google/GitHub authorization page)                       │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. User authorizes app                                      │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Provider redirects back to NextAuth callback             │
│    /api/auth/callback/google or /github                     │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. NextAuth signIn callback executes (auth.ts)             │
│    - Sends user data to YOUR backend /api/auth/oauth       │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. YOUR backend processes OAuth data                        │
│    - Finds or creates user in MongoDB                       │
│    - Generates JWT token (same as regular login)            │
│    - Returns { token, user: { id, name, email, role } }    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. NextAuth stores YOUR token in session                    │
│    (jwt and session callbacks)                              │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. SessionSync component syncs to Redux                     │
│    - useSessionSync hook reads NextAuth session             │
│    - Calls dispatch(setCredentials({ user, token }))        │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. All API calls use YOUR backend token                     │
│    - RTK Query prepareHeaders adds: Authorization: Bearer   │
│    - Backend validates token → knows user & role            │
└─────────────────────────────────────────────────────────────┘
```

### Key Points

1. **NextAuth handles OAuth complexity** (redirects, state, PKCE)
2. **Your backend controls authentication** (user creation, JWT generation)
3. **Redux stores YOUR token** (not NextAuth's session token)
4. **Backend receives standard Authorization header** (no NextAuth dependency)
5. **Works exactly like email/password login** after initial OAuth

---

## 🧪 Testing Checklist

- [ ] Google login works
- [ ] GitHub login works
- [ ] User redirected to `/dashboard` after login
- [ ] Redux store contains user data and token
- [ ] API calls include `Authorization: Bearer <token>` header
- [ ] Backend recognizes user and role
- [ ] Refresh page doesn't log user out
- [ ] Logout works correctly

---

## 🐛 Troubleshooting

### Error: "Invalid callback URL"

**Solution:** Make sure redirect URIs in Google/GitHub exactly match:

```
http://localhost:3000/api/auth/callback/google
http://localhost:3000/api/auth/callback/github
```

### Error: "Backend OAuth sync failed"

**Check:**

1. Backend is running on correct port
2. `NEXT_PUBLIC_API_URL` is correct
3. Backend endpoint is `/api/auth/oauth` (not `/auth/oauth`)
4. Backend accepts POST requests with JSON body

### Error: "Module not found: next-auth"

**Solution:**

```bash
npm install next-auth@beta
```

### OAuth works but user not in Redux

**Check:**

1. `SessionSync` component is in layout
2. `SessionProvider` wraps app (in ReduxProvider.tsx)
3. Console for any errors in useSessionSync hook

### Backend doesn't recognize OAuth users

**Check:**

1. User model has `googleId`, `githubId`, `authProvider` fields
2. Backend OAuth endpoint returns correct format:
   ```json
   {
     "success": true,
     "data": {
       "token": "jwt-token-here",
       "user": { "id": "...", "role": "customer", ... }
     }
   }
   ```

---

## 🔒 Security Best Practices

### ✅ DO:

- ✅ Use HTTPS in production
- ✅ Keep `AUTH_SECRET` secure (32+ characters)
- ✅ Validate OAuth tokens on backend
- ✅ Use environment variables for secrets
- ✅ Enable CORS properly on backend
- ✅ Set secure cookie options in production

### ❌ DON'T:

- ❌ Commit `.env.local` to git
- ❌ Use development credentials in production
- ❌ Share OAuth client secrets
- ❌ Skip email verification for OAuth users
- ❌ Trust OAuth data without backend validation

---

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)

1. Add environment variables in dashboard:

   ```
   AUTH_SECRET=your-prod-secret
   AUTH_GOOGLE_ID=prod-google-id
   AUTH_GOOGLE_SECRET=prod-google-secret
   AUTH_GITHUB_ID=prod-github-id
   AUTH_GITHUB_SECRET=prod-github-secret
   NEXT_PUBLIC_API_URL=https://your-api.com
   AUTH_TRUST_HOST=true
   ```

2. Update Google OAuth redirect URIs:

   ```
   https://your-domain.com/api/auth/callback/google
   ```

3. Update GitHub OAuth callback URL:
   ```
   https://your-domain.com/api/auth/callback/github
   ```

### Backend

1. Ensure `/api/auth/oauth` endpoint is accessible
2. Enable CORS for your frontend domain
3. Use HTTPS (required for production OAuth)

---

## 📚 Additional Resources

- **NextAuth v5 Docs:** https://authjs.dev/getting-started/introduction
- **Google OAuth Guide:** https://developers.google.com/identity/protocols/oauth2
- **GitHub OAuth Guide:** https://docs.github.com/en/apps/oauth-apps/building-oauth-apps
- **Redux Toolkit:** https://redux-toolkit.js.org/

---

## 🎉 You're Done!

Your application now supports:

- ✅ Google OAuth login
- ✅ GitHub OAuth login
- ✅ Seamless Redux integration
- ✅ Backend JWT authentication
- ✅ Role-based access control
- ✅ Session persistence

Users can now sign in with one click! 🚀

---

## 💬 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all environment variables are correct
3. Check browser console for errors
4. Check backend logs for OAuth endpoint errors
5. Ensure all callback URLs match exactly

Happy coding! 🎨
