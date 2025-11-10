# ✅ OAuth Setup Checklist

Complete these steps to activate Google & GitHub login in your app.

---

## 📦 Step 1: Install Dependencies

```bash
npm install next-auth@beta
```

**Status:** [ ]

---

## 🔑 Step 2: Generate AUTH_SECRET

### macOS/Linux:

```bash
openssl rand -base64 32
```

### Windows PowerShell:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Copy the output** - you'll add it to `.env.local`

**Status:** [ ]

---

## 🌐 Step 3: Set Up Google OAuth

1. **Go to Google Cloud Console**

   - URL: https://console.cloud.google.com/apis/credentials
   - **Status:** [ ]

2. **Create OAuth 2.0 Client ID**

   - Click "Create Credentials" > "OAuth client ID"
   - Type: Web application
   - **Status:** [ ]

3. **Configure URLs**

   - **Authorized JavaScript origins:**
     - `http://localhost:3000`
   - **Authorized redirect URIs:**
     - `http://localhost:3000/api/auth/callback/google`
   - **Status:** [ ]

4. **Copy Credentials**

   - Client ID: **************\_\_\_\_**************
   - Client Secret: ************\_\_\_\_************
   - **Status:** [ ]

5. **Configure OAuth Consent Screen**
   - App name: Your App Name
   - User support email: your-email@example.com
   - Scopes: userinfo.email, userinfo.profile
   - **Status:** [ ]

---

## 🐙 Step 4: Set Up GitHub OAuth

1. **Go to GitHub Settings**

   - URL: https://github.com/settings/developers
   - **Status:** [ ]

2. **Create New OAuth App**

   - Click "New OAuth App"
   - **Status:** [ ]

3. **Configure App**

   - Application name: Your App Name
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
   - **Status:** [ ]

4. **Copy Credentials**
   - Client ID: **************\_\_\_\_**************
   - Client Secret: ************\_\_\_\_************
   - **Status:** [ ]

---

## 📝 Step 5: Create .env.local

Create `.env.local` file in frontend root:

```env
# NextAuth Secret (from Step 2)
AUTH_SECRET=paste-your-generated-secret-here
AUTH_TRUST_HOST=true

# Google OAuth (from Step 3)
AUTH_GOOGLE_ID=paste-google-client-id-here
AUTH_GOOGLE_SECRET=paste-google-client-secret-here

# GitHub OAuth (from Step 4)
AUTH_GITHUB_ID=paste-github-client-id-here
AUTH_GITHUB_SECRET=paste-github-client-secret-here

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Status:** [ ]

---

## 🔧 Step 6: Verify Backend Ready

Check your backend has the OAuth endpoint:

- [ ] Endpoint exists: `POST /api/auth/oauth`
- [ ] Accepts: `{ provider, providerId, email, name, image }`
- [ ] Returns: `{ success: true, data: { token, user } }`
- [ ] User model has: `googleId`, `githubId`, `authProvider`

**Status:** [ ]

---

## 🧪 Step 7: Test Everything

1. **Start Backend**

   ```bash
   cd ../backend
   npm run dev
   ```

   **Status:** [ ]

2. **Start Frontend**

   ```bash
   npm run dev
   ```

   **Status:** [ ]

3. **Test Google Login**

   - Go to: http://localhost:3000/login
   - Click "Continue with Google"
   - Authorize the app
   - Should redirect to /dashboard
   - **Status:** [ ]

4. **Test GitHub Login**

   - Go to: http://localhost:3000/login
   - Click "Continue with GitHub"
   - Authorize the app
   - Should redirect to /dashboard
   - **Status:** [ ]

5. **Verify Redux State**

   - Open Redux DevTools
   - Check: `auth.user` has data
   - Check: `auth.token` exists
   - Check: `auth.isAuthenticated` is true
   - **Status:** [ ]

6. **Test API Calls**

   - Make any API request
   - Check Network tab
   - Verify: `Authorization: Bearer <token>` header present
   - **Status:** [ ]

7. **Test Session Persistence**

   - Login with OAuth
   - Refresh the page
   - Should still be logged in
   - **Status:** [ ]

8. **Test Logout**
   - Click logout
   - Redux state should clear
   - Should be logged out
   - **Status:** [ ]

---

## 🚀 Step 8: Production Deployment

### Frontend (Vercel/Netlify)

1. **Add Environment Variables**

   ```
   AUTH_SECRET=<production-secret>
   AUTH_GOOGLE_ID=<prod-google-id>
   AUTH_GOOGLE_SECRET=<prod-google-secret>
   AUTH_GITHUB_ID=<prod-github-id>
   AUTH_GITHUB_SECRET=<prod-github-secret>
   NEXT_PUBLIC_API_URL=https://your-api.com
   AUTH_TRUST_HOST=true
   ```

   **Status:** [ ]

2. **Update Google OAuth**

   - Add production redirect URI:
   - `https://yourdomain.com/api/auth/callback/google`
   - **Status:** [ ]

3. **Update GitHub OAuth**

   - Add production callback URL:
   - `https://yourdomain.com/api/auth/callback/github`
   - **Status:** [ ]

4. **Deploy & Test**
   - Deploy frontend
   - Test Google login
   - Test GitHub login
   - **Status:** [ ]

---

## ✅ Final Verification

- [ ] All dependencies installed
- [ ] AUTH_SECRET generated
- [ ] Google OAuth configured
- [ ] GitHub OAuth configured
- [ ] .env.local created
- [ ] Backend OAuth endpoint working
- [ ] Google login works
- [ ] GitHub login works
- [ ] Redux state synced
- [ ] API calls authenticated
- [ ] Session persists on refresh
- [ ] Logout works
- [ ] Production deployed (if ready)

---

## 📚 Documentation Reference

- **Quick Start:** `OAUTH_QUICK_START.md`
- **Full Guide:** `OAUTH_SETUP_GUIDE.md`
- **Summary:** `OAUTH_IMPLEMENTATION_COMPLETE.md`

---

## 🐛 Troubleshooting

If something doesn't work:

1. **Check `.env.local` has all variables**
2. **Verify redirect URIs match exactly**
3. **Ensure backend is running**
4. **Check browser console for errors**
5. **Check backend logs**
6. **Read `OAUTH_SETUP_GUIDE.md` troubleshooting section**

---

## 🎉 Success!

When all checkboxes are checked, your OAuth implementation is complete! 🚀

Users can now sign in with one click using Google or GitHub!
