# 🚀 Quick Start - OAuth Implementation

## Installation

Run this command to install NextAuth:

```bash
npm install next-auth@beta
```

## Environment Setup

1. **Copy environment template:**

   ```bash
   cp .env.example .env.local
   ```

2. **Generate AUTH_SECRET:**

   ```bash
   # macOS/Linux
   openssl rand -base64 32

   # Windows PowerShell
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

3. **Add to `.env.local`:**

   ```env
   # NextAuth
   AUTH_SECRET=paste-your-generated-secret-here
   AUTH_TRUST_HOST=true

   # Google OAuth (get from console.cloud.google.com)
   AUTH_GOOGLE_ID=your-google-client-id
   AUTH_GOOGLE_SECRET=your-google-client-secret

   # GitHub OAuth (get from github.com/settings/developers)
   AUTH_GITHUB_ID=your-github-client-id
   AUTH_GITHUB_SECRET=your-github-client-secret

   # Backend API
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

## Get OAuth Credentials

### Google OAuth

1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID
3. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Client Secret

### GitHub OAuth

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Add callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and generate Client Secret

## Test It

1. Start backend: `cd ../backend && npm run dev`
2. Start frontend: `npm run dev`
3. Go to http://localhost:3000/login
4. Click "Continue with Google" or "Continue with GitHub"

## Full Documentation

See **OAUTH_SETUP_GUIDE.md** for complete setup instructions.

## ✅ What Works Now

- ✅ Login with Google
- ✅ Login with GitHub
- ✅ User data synced to Redux
- ✅ Backend JWT token used for API calls
- ✅ Role-based access control
- ✅ Session persistence

🎉 You're ready to go!
