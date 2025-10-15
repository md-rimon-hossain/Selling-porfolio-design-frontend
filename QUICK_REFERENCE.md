# 🚀 Quick Reference Guide

## Start Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit
http://localhost:3000
```

## Environment Setup

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME="Graphic Lab"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Default Users

### Admin Account

```
Email: admin@example.com
Password: (create via backend)
Role: admin
Access: /admin/*
```

### Customer Account

```
Email: customer@example.com
Password: (create via backend)
Role: customer
Access: /dashboard/*
```

## API Endpoints Summary

### Auth (4)

- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user
- POST `/auth/logout` - Logout user
- GET `/users/myProfile` - Get profile

### Categories (5)

- GET `/categories` - List all
- GET `/categories/:id` - Get one
- POST `/categories` - Create (admin)
- PUT `/categories/:id` - Update (admin)
- DELETE `/categories/:id` - Delete (admin)

### Designs (5)

- GET `/designs` - List with filters
- GET `/designs/:id` - Get one
- POST `/designs` - Create (admin)
- PUT `/designs/:id` - Update (admin)
- DELETE `/designs/:id` - Delete (admin)

### Pricing Plans (7)

- GET `/pricing-plans/active` - Public plans
- GET `/pricing-plans` - All plans (admin)
- GET `/pricing-plans/:id` - Get one
- POST `/pricing-plans` - Create (admin)
- PUT `/pricing-plans/:id` - Update (admin)
- DELETE `/pricing-plans/:id` - Delete (admin)
- GET `/pricing-plans/analytics/overview` - Analytics (admin)

### Purchases (8)

- POST `/purchases` - Create purchase
- GET `/purchases` - All purchases (admin)
- GET `/purchases/my-purchases` - User purchases
- GET `/purchases/:id` - Get one
- PUT `/purchases/:id/status` - Update status (admin)
- DELETE `/purchases/:id` - Cancel purchase
- GET `/purchases/subscription-eligibility` - Check eligibility
- GET `/purchases/analytics` - Analytics (admin)

### Reviews (8)

- GET `/reviews/design/:designId` - Design reviews
- GET `/reviews` - All reviews (admin)
- GET `/reviews/:id` - Get one
- POST `/reviews` - Create review
- PUT `/reviews/:id` - Update review
- DELETE `/reviews/:id` - Delete review
- PUT `/reviews/:id/helpful` - Mark helpful
- GET `/reviews/analytics/overview` - Analytics (admin)

### Downloads (4)

- GET `/downloads/subscription-status` - Subscription info
- GET `/downloads/my-downloads` - Download history
- POST `/downloads/design/:designId` - Download design
- GET `/downloads/analytics` - Analytics (admin)

## Key Routes

### Public

- `/` - Homepage
- `/designs` - Browse designs
- `/designs/[id]` - Design details
- `/pricing` - Pricing plans
- `/auth/login` - Login page
- `/auth/register` - Register page

### Admin (Protected)

- `/admin` - Dashboard
- `/admin/categories` - Manage categories
- `/admin/designs` - Manage designs
- `/admin/pricing-plans` - Manage pricing
- `/admin/purchases` - View purchases
- `/admin/reviews` - Moderate reviews

### Customer (Protected)

- `/dashboard` - Overview
- `/dashboard/purchases` - Purchase history
- `/dashboard/downloads` - Download history
- `/dashboard/reviews` - Manage reviews

## Common Tasks

### Create Category

```typescript
const [createCategory] = useCreateCategoryMutation();

await createCategory({
  name: "Web Design",
  description: "Modern web design templates",
  isActive: true,
}).unwrap();
```

### Create Design

```typescript
const [createDesign] = useCreateDesignMutation();

await createDesign({
  title: "Modern Landing Page",
  category: "categoryId",
  description: "Clean and modern design",
  previewImageUrl: "https://...",
  designerName: "John Doe",
  usedTools: ["Figma", "Photoshop"],
  effectsUsed: ["Gradient", "Shadow"],
  price: 29.99,
  processDescription: "Created using...",
  complexityLevel: "Intermediate",
  tags: ["web", "modern", "landing"],
  status: "Active",
}).unwrap();
```

### Make Purchase

```typescript
const [createPurchase] = useCreatePurchaseMutation();

await createPurchase({
  purchaseType: "individual",
  design: "designId",
  paymentMethod: "credit_card",
  paymentDetails: {
    cardNumber: "4111111111111111",
    expiryDate: "12/25",
    cvv: "123",
    cardholderName: "John Doe",
  },
  currency: "USD",
  billingAddress: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
  },
}).unwrap();
```

### Create Review

```typescript
const [createReview] = useCreateReviewMutation();

await createReview({
  designId: "designId",
  rating: 5,
  title: "Amazing design!",
  comment: "Very professional and easy to use",
  pros: ["Clean", "Modern", "Well documented"],
  cons: [],
}).unwrap();
```

## Response Format

All API responses follow this structure:

```typescript
{
  success: boolean,
  message: string,
  data: T,
  pagination?: {
    total: number,
    page: number,
    pages: number,
    limit: number
  }
}
```

Access data: `response.data`
Access pagination: `response.pagination`

## Error Handling

```typescript
try {
  const result = await mutation(data).unwrap();
  alert(result.message);
} catch (error: any) {
  alert(error?.data?.message || "An error occurred");
}
```

## Status Values

### Purchase Status

- `pending` - Payment processing
- `completed` - Purchase successful
- `expired` - Subscription expired
- `cancelled` - User cancelled
- `refunded` - Refund issued

### Design Status

- `Active` - Visible to public
- `Draft` - Not yet published
- `Archived` - Hidden from public

### Complexity Levels

- `Basic` - Simple designs
- `Intermediate` - Medium complexity
- `Advanced` - Complex designs

## Payment Methods

- `credit_card` - Credit/debit card
- `paypal` - PayPal
- `stripe` - Stripe
- `bank_transfer` - Bank transfer
- `free` - Free item

## Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint

# Type check
npm run type-check
```

## Common Issues

### CORS Error

- Ensure backend CORS_ORIGIN includes frontend URL
- Check credentials: 'include' in API config

### Auth Not Working

- Verify cookies are being set
- Check cookie settings (secure, sameSite)
- Ensure API URL is correct

### Build Fails

- Clear cache: `rm -rf .next node_modules`
- Reinstall: `npm install`
- Check TypeScript errors: `npm run type-check`

## Documentation Files

- `README.md` - Project overview
- `DASHBOARD_IMPLEMENTATION.md` - Technical implementation
- `QUICK_START.md` - User guide
- `PRODUCTION_DEPLOYMENT.md` - Deployment guide
- `API_INTEGRATION_CHECKLIST.md` - API verification
- `FIXES_SUMMARY.md` - Recent fixes

## Support

For issues, check:

1. Browser console for errors
2. Network tab for failed requests
3. Backend API logs
4. Environment variables

---

**Status:** Production Ready ✅
**Last Updated:** January 2025
