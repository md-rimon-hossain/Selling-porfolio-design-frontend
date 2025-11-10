# 🎨 Design Portfolio Marketplace - Frontend

> A modern, responsive Next.js 15 application for a design marketplace platform with OAuth authentication, Stripe payments, and real-time updates.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## 🌟 Overview

This is a full-featured frontend application for a design marketplace where users can:

- Browse and search design templates
- Purchase designs with Stripe
- OAuth login with Google/GitHub
- Like and review designs
- Download purchased designs
- Manage profile and purchases
- Admin dashboard for management

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.5 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4.1
- **State Management**: Redux Toolkit with Redux Persist
- **API Layer**: RTK Query
- **Authentication**: NextAuth v4 (OAuth)
- **Payment**: Stripe Elements & Payment Intents
- **UI Components**: shadcn/ui with Radix UI
- **Icons**: Lucide React
- **Type Safety**: TypeScript

---

## ✨ Features

### Authentication

- ✅ Email/Password registration and login
- ✅ OAuth with Google and GitHub
- ✅ JWT token-based authentication
- ✅ Persistent sessions with Redux Persist
- ✅ Automatic token refresh
- ✅ Protected routes

### Design Browsing

- ✅ Grid/List view of designs
- ✅ Category filtering
- ✅ Search functionality
- ✅ Price range filtering
- ✅ Sorting options
- ✅ Pagination
- ✅ Like/Unlike designs
- ✅ View design details

### Payment System

- ✅ Stripe checkout integration
- ✅ Payment Intent flow
- ✅ Multiple currency support
- ✅ Secure card processing
- ✅ Payment confirmation
- ✅ Purchase history

### User Dashboard

- ✅ View purchased designs
- ✅ Download files
- ✅ Track download history
- ✅ View payment history
- ✅ Profile management
- ✅ Liked designs collection

### Reviews & Ratings

- ✅ Write reviews for purchased designs
- ✅ Star rating system (1-5)
- ✅ Edit/Delete own reviews
- ✅ View all reviews for a design
- ✅ Average rating display

### Admin Features

- ✅ User management
- ✅ Design management
- ✅ Payment monitoring
- ✅ Analytics dashboard
- ✅ Category management

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18+ (LTS recommended)
- **npm** or **yarn** or **pnpm**
- **Backend API**: Running backend server (see backend README)
- **Google OAuth**: Client ID & Secret
- **GitHub OAuth**: Client ID & Secret

### Installation

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables** (see [Environment Variables](#environment-variables))

5. **Start development server**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`

---

## 🔐 Environment Variables

Create a `.env.local` file in the frontend root directory:

```bash
# Backend API URL (Required)
# Point this to your backend API server
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# App Configuration
NEXT_PUBLIC_APP_NAME="Graphic Lab"
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production Configuration (update these for production)
# NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
# NEXT_PUBLIC_APP_URL=https://your-domain.com

# ============================================
# NextAuth Configuration (OAuth)
# ============================================

# NextAuth Secret (Required)
# Generate with: openssl rand -base64 32
AUTH_SECRET=your-random-secret-here-change-in-production

# Trust host (Required for NextAuth v5)
AUTH_TRUST_HOST=true

# Google OAuth Credentials
# Get from: https://console.cloud.google.com/apis/credentials
AUTH_GOOGLE_ID=your-google-client-id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=your-google-client-secret

# GitHub OAuth Credentials
# Get from: https://github.com/settings/developers
AUTH_GITHUB_ID=your-github-client-id
AUTH_GITHUB_SECRET=your-github-client-secret
```

### 🔑 Getting OAuth Credentials

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Application type: "Web application"
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret

#### GitHub OAuth

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in details:
   - Application name: Your App Name
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Register application
5. Copy Client ID and generate Client Secret

#### Generate AUTH_SECRET

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/             # Login page
│   │   │   └── register/          # Registration page
│   │   ├── about/                 # About page
│   │   ├── admin/                 # Admin dashboard
│   │   │   ├── users/
│   │   │   ├── designs/
│   │   │   ├── payments/
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   └── auth/              # NextAuth API routes
│   │   ├── categories/            # Category pages
│   │   ├── contact/               # Contact page
│   │   ├── dashboard/             # User dashboard
│   │   │   ├── purchases/
│   │   │   ├── downloads/
│   │   │   ├── likes/
│   │   │   └── layout.tsx
│   │   ├── designs/               # Design pages
│   │   │   └── [id]/             # Design detail page
│   │   ├── payment/               # Payment pages
│   │   ├── pricing/               # Pricing plans
│   │   ├── privacy/               # Privacy policy
│   │   ├── terms/                 # Terms of service
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Home page
│   │   └── globals.css            # Global styles
│   ├── components/                # React components
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── AuthButtons.tsx
│   │   ├── AuthWrapper.tsx
│   │   ├── CategoriesSection.tsx
│   │   ├── ConditionalLayout.tsx
│   │   ├── DesignCard.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── LikeButton.tsx
│   │   ├── NextAuthProvider.tsx
│   │   ├── ReviewForm.tsx
│   │   ├── ReviewList.tsx
│   │   ├── SessionSync.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ToastProvider.tsx
│   │   └── UserProfile.tsx
│   ├── hooks/                     # Custom React hooks
│   │   ├── useLike.ts
│   │   └── useToast.ts
│   ├── lib/                       # Utility libraries
│   │   └── utils.ts
│   ├── services/                  # API services
│   │   └── api.ts                # RTK Query API
│   ├── store/                     # Redux store
│   │   ├── authSlice.ts
│   │   ├── cartSlice.ts
│   │   ├── ReduxProvider.tsx
│   │   └── store.ts
│   ├── types/                     # TypeScript types
│   │   ├── auth.ts
│   │   ├── design.ts
│   │   ├── payment.ts
│   │   └── next-auth.d.ts
│   └── auth.ts                    # NextAuth configuration
├── public/                        # Static assets
│   └── images/
├── .env.local                     # Environment variables
├── .env.example                   # Example env file
├── next.config.ts                 # Next.js configuration
├── tailwind.config.ts             # Tailwind CSS config
├── tsconfig.json                  # TypeScript config
├── components.json                # shadcn/ui config
└── package.json
```

---

## 🎯 Key Features

### 1. Authentication Flow

The app uses a hybrid authentication system:

1. **NextAuth** handles OAuth (Google/GitHub)
2. **Backend JWT** handles all API requests
3. **Redux Persist** maintains auth state

```typescript
// Login Flow
User clicks "Login with Google"
  → NextAuth redirects to Google
  → User authorizes
  → Google redirects back to app
  → NextAuth calls backend /auth/oauth
  → Backend creates/updates user, returns JWT
  → JWT stored in Redux + NextAuth session
  → All API calls use backend JWT token
```

### 2. State Management

- **Redux Toolkit** for global state
- **Redux Persist** for localStorage persistence
- **RTK Query** for API caching and optimistic updates

```typescript
// Store Structure
{
  auth: {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean
  },
  cart: {
    items: CartItem[]
  },
  api: {
    // RTK Query cache
  }
}
```

### 3. Payment Flow

```typescript
// Stripe Payment Flow
1. User clicks "Buy Now"
2. Frontend calls /payments/create-payment-intent
3. Backend creates Stripe PaymentIntent
4. Frontend shows Stripe card form
5. User enters card details
6. Stripe validates card
7. Frontend confirms payment
8. Stripe webhook notifies backend
9. Backend creates Purchase record
10. User redirected to success page
```

### 4. Like System

- Optimistic UI updates (instant feedback)
- Atomic database operations
- Processing lock to prevent double-clicks
- Automatic state rollback on error

### 5. Review System

- Star rating (1-5 stars)
- Text review
- Edit/Delete own reviews
- Average rating calculation
- Review count display

---

## 💻 Development

### Available Scripts

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

### Adding New Components

This project uses **shadcn/ui**. To add new components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

### Environment-Specific Behavior

```typescript
// Development
- Verbose logging
- Debug mode enabled
- Hot reload with Turbopack
- Source maps

// Production
- Minified code
- No console logs
- Optimized bundle
- Static generation where possible
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Push code to GitHub**

   ```bash
   git push origin main
   ```

2. **Import project in Vercel**

   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Select `frontend` as root directory

3. **Configure environment variables**

   - Add all variables from `.env.local`
   - Make sure to update URLs for production

4. **Deploy**
   - Vercel automatically deploys on push
   - Custom domain available in settings

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Docker

```dockerfile
# Dockerfile (create this)
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t design-marketplace-frontend .
docker run -p 3000:3000 design-marketplace-frontend
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. OAuth Redirect Error

```
Error: Redirect URI mismatch
```

**Solution**:

- Check OAuth redirect URIs match exactly
- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

#### 2. API Connection Failed

```
Error: Network request failed
```

**Solution**:

- Ensure backend is running on `http://localhost:5000`
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS settings in backend

#### 3. Redux Persist Hydration Error

```
Warning: Text content did not match
```

**Solution**:

- This is normal on first load
- Redux Persist rehydrates state from localStorage
- Error should disappear after hydration

#### 4. Stripe Elements Not Loading

```
Error: Stripe.js failed to load
```

**Solution**:

- Check internet connection
- Verify Stripe publishable key in backend
- Check browser console for errors

#### 5. Session Not Persisting

```
User logged out after page refresh
```

**Solution**:

- Check Redux Persist is configured
- Verify `AUTH_SECRET` is set
- Clear browser localStorage and try again

#### 6. Image Upload Failed

```
Error: Cloudinary upload failed
```

**Solution**:

- Check backend Cloudinary credentials
- Verify file size is under limit
- Check file format is supported

---

## 🎨 Customization

### Changing Theme Colors

Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#your-color',
        50: '#lighter',
        // ... more shades
      }
    }
  }
}
```

### Changing App Name

Update `.env.local`:

```bash
NEXT_PUBLIC_APP_NAME="Your App Name"
```

### Adding New Pages

```bash
# Create new page
src/app/your-page/page.tsx
```

```typescript
// src/app/your-page/page.tsx
export default function YourPage() {
  return (
    <div>
      <h1>Your Page</h1>
    </div>
  );
}
```

---

## 🔒 Security Best Practices

- ✅ Environment variables for sensitive data
- ✅ NextAuth for OAuth security
- ✅ HTTPS in production
- ✅ JWT tokens with expiration
- ✅ Input validation on frontend
- ✅ XSS protection with React
- ✅ CSRF protection with NextAuth
- ✅ Secure cookies with httpOnly flag

---

## 📱 Responsive Design

The app is fully responsive with breakpoints:

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl, 2xl)

All components adapt to screen size automatically.

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Register new user
- [ ] Login with email/password
- [ ] Login with Google
- [ ] Login with GitHub
- [ ] Browse designs
- [ ] Filter by category
- [ ] Search designs
- [ ] Like/unlike design
- [ ] View design details
- [ ] Add review
- [ ] Purchase design
- [ ] Download purchased design
- [ ] View dashboard
- [ ] Logout

---

## 📊 Performance Optimization

- ✅ Next.js App Router for optimal routing
- ✅ Image optimization with `next/image`
- ✅ Code splitting by route
- ✅ React Server Components where possible
- ✅ Redux Persist for offline capability
- ✅ Optimistic UI updates
- ✅ Lazy loading components
- ✅ Turbopack for fast builds

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Rimon Hossain**

---

## 📞 Support

For issues or questions:

- Check [Troubleshooting](#troubleshooting) section
- Verify environment variables are set correctly
- Check backend is running
- Review browser console for errors

---

## 🎯 Quick Start Checklist

- [ ] Node.js v18+ installed
- [ ] Backend API running at `http://localhost:5000`
- [ ] `.env.local` file created with all variables
- [ ] Dependencies installed (`npm install`)
- [ ] OAuth credentials configured (Google + GitHub)
- [ ] Frontend running (`npm run dev`)
- [ ] Can access app at `http://localhost:3000`
- [ ] Can register and login

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

---

**Made with ❤️ for designers and developers**
