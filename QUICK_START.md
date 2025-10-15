# 🚀 Quick Start Guide

## Admin Dashboard Access

### Login as Admin

1. Navigate to `http://localhost:3000/login`
2. Login with admin credentials
3. You'll be automatically redirected to `/admin`

### Admin Features Available:

#### 📊 Dashboard (`/admin`)

- View analytics and KPIs
- Recent purchases overview
- Review statistics
- Quick action buttons

#### 🏷️ Categories (`/admin/categories`)

- **Create**: Click "Add Category" button
- **Edit**: Click pencil icon on any category
- **Delete**: Click trash icon
- **Search**: Use search bar to filter

#### 🎨 Designs (`/admin/designs`)

- **Create**: Click "Add Design" → Fill form with:
  - Title, Category, Description
  - Price, Preview Image URL
  - Designer Name, Tools, Effects
  - Complexity Level, Tags, Status
- **Edit**: Click pencil icon on design card
- **Delete**: Click trash icon
- **Filter**: By status, category, search term
- **Pagination**: Navigate through pages

#### 💰 Pricing Plans (`/admin/pricing-plans`)

- **Create**: Click "Add Pricing Plan" → Fill:
  - Name, Description
  - Price, Discount %
  - Duration (monthly/yearly)
  - Features (one per line)
  - Max Downloads, Active status
- **Edit**: Click pencil icon on plan card
- **Delete**: Click trash icon

#### 🛒 Purchases (`/admin/purchases`)

- View all customer orders
- **Update Status**: Use dropdown (Pending → Completed)
- **View Details**: Click eye icon
- Filter and pagination available

#### ⭐ Reviews (`/admin/reviews`)

- View all customer reviews
- **Delete**: Click trash icon
- See rating, comment, design info

---

## Customer Dashboard Access

### Login as Customer

1. Navigate to `http://localhost:3000/login`
2. Login with customer credentials
3. You'll be automatically redirected to `/dashboard`

### Customer Features Available:

#### 🏠 Dashboard (`/dashboard`)

- View your stats (purchases, downloads, subscription)
- Recent purchases list
- Account information

#### 🛍️ My Purchases (`/dashboard/purchases`)

- View all your orders
- **Filter**: By status (Pending, Completed, etc.)
- See purchase details:
  - Order ID
  - Amount paid
  - Purchase date
  - Type (subscription/individual)
  - Status
- Pagination for history

#### 📥 My Downloads (`/dashboard/downloads`)

- **Subscription Status**: See remaining downloads
- **Download History**: All previously downloaded designs
- **Re-download**: Click "Download Again" button
- Filter by download type

#### ✍️ My Reviews (`/dashboard/reviews`)

- **Write Review**: Click "Write Review" button
  - Select design (from purchased)
  - Choose rating (1-5 stars)
  - Add title and comment
- **Edit Review**: Click pencil icon
- **Delete Review**: Click trash icon
- See all your reviews in one place

---

## Making a Purchase (Customer Flow)

### Individual Design Purchase:

1. Go to `/designs`
2. Click on any design
3. Click "Purchase Now" button
4. **If not logged in**: Redirected to login
5. **If logged in**: Purchase modal opens
6. **Step 1 - Payment**:
   - Select payment method (Credit Card, PayPal, Stripe)
   - Enter payment details
   - Click "Continue to Billing"
7. **Step 2 - Billing**:
   - Enter billing address
   - Add optional notes
   - Review order summary
   - Click "Complete Purchase"
8. Success! Order created

### Subscription Purchase:

1. Go to `/pricing`
2. Choose a plan
3. Click "Get Started" button
4. Follow same checkout flow
5. Success! Subscription active

---

## Navigation

### Header Links (Role-based):

**For Admins:**

- Home
- Categories Dropdown
- All Designs
- Pricing
- **Admin Panel** (purple button)
- About
- Contact

**For Customers:**

- Home
- Categories Dropdown
- All Designs
- Pricing
- **My Dashboard** (blue button)
- About
- Contact

---

## API Endpoints Used

### Admin Operations:

```
POST   /categories              Create category
PUT    /categories/:id          Update category
DELETE /categories/:id          Delete category

POST   /designs                 Create design
PUT    /designs/:id             Update design
DELETE /designs/:id             Delete design

POST   /pricing-plans           Create plan
PUT    /pricing-plans/:id       Update plan
DELETE /pricing-plans/:id       Delete plan

GET    /purchases               All purchases
PUT    /purchases/:id/status    Update status

GET    /reviews                 All reviews
DELETE /reviews/:id             Delete review

GET    /purchases/analytics     Purchase analytics
GET    /reviews/analytics       Review analytics
GET    /downloads/analytics     Download analytics
```

### Customer Operations:

```
GET    /purchases/my-purchases  My purchases
POST   /purchases               Create purchase

GET    /downloads/my-downloads  My downloads
POST   /downloads/design/:id    Download design
GET    /downloads/subscription-status  Subscription info

GET    /reviews/design/:id      Design reviews
POST   /reviews                 Create review
PUT    /reviews/:id             Update review
DELETE /reviews/:id             Delete review
```

---

## Environment Setup

### Required Environment Variable:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend Must Be Running:

- Backend API: `http://localhost:5000`
- Frontend: `http://localhost:3000`

---

## Common Operations

### As Admin - Add a New Design:

1. Go to `/admin/designs`
2. Click "Add Design"
3. Fill all required fields (\*)
4. Select category from dropdown
5. Set price and complexity level
6. Add tags (comma separated)
7. Click "Create"

### As Admin - Create Pricing Plan:

1. Go to `/admin/pricing-plans`
2. Click "Add Pricing Plan"
3. Enter name, description, price
4. Set discount percentage (optional)
5. Choose duration (monthly/yearly)
6. Add features (one per line)
7. Set max downloads
8. Click "Create"

### As Customer - Write a Review:

1. Go to `/dashboard/reviews`
2. Click "Write Review"
3. Select purchased design
4. Choose star rating (1-5)
5. Add title and detailed comment
6. Click "Submit"

---

## Troubleshooting

### "Not authorized" error:

- ✅ Check if logged in
- ✅ Verify role (admin vs customer)
- ✅ Check cookie is set
- ✅ Try logging out and back in

### API errors:

- ✅ Ensure backend is running
- ✅ Check NEXT_PUBLIC_API_URL in .env.local
- ✅ Verify backend is on port 5000
- ✅ Check browser console for details

### Design not loading:

- ✅ Check image URLs are valid
- ✅ Ensure design status is "Active"
- ✅ Verify category is set

---

## Testing Checklist

### Admin Tests:

- [ ] Create a category
- [ ] Edit the category
- [ ] Create a design with that category
- [ ] Create a pricing plan
- [ ] View purchases list
- [ ] Change purchase status
- [ ] View analytics dashboard

### Customer Tests:

- [ ] Purchase an individual design
- [ ] Purchase a subscription
- [ ] View purchases in dashboard
- [ ] Download a design
- [ ] Write a review
- [ ] Edit the review
- [ ] View downloads history

---

## 🎉 You're All Set!

Everything is production-ready and fully functional. Start exploring the dashboards!

**Admin Dashboard**: http://localhost:3000/admin  
**Customer Dashboard**: http://localhost:3000/dashboard

Happy coding! 🚀
