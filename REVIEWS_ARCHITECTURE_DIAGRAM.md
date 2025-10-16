# Reviews System Architecture & Flow

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────┐         ┌─────────────────────┐        │
│  │  Customer Portal   │         │    Admin Panel      │        │
│  │  /dashboard/reviews│         │   /admin/reviews    │        │
│  ├────────────────────┤         ├─────────────────────┤        │
│  │ • View purchases   │         │ • Analytics cards   │        │
│  │ • Write reviews    │         │ • Search reviews    │        │
│  │ • Edit reviews     │         │ • Filter by rating  │        │
│  │ • Delete reviews   │         │ • Sort reviews      │        │
│  │ • Star ratings     │         │ • Delete any review │        │
│  │ • Validation       │         │ • Top designs       │        │
│  └────────────────────┘         └─────────────────────┘        │
│           │                               │                      │
│           └───────────────┬───────────────┘                      │
│                           │                                      │
│                  ┌────────▼────────┐                            │
│                  │  API Service    │                            │
│                  │  (RTK Query)    │                            │
│                  ├─────────────────┤                            │
│                  │ • getReviews    │                            │
│                  │ • createReview  │                            │
│                  │ • updateReview  │                            │
│                  │ • deleteReview  │                            │
│                  │ • getAnalytics  │                            │
│                  └────────┬────────┘                            │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                   HTTP Requests
                  (JSON + Cookies)
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      BACKEND (Express.js)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │                   Review Routes                         │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │ POST   /api/reviews              (Auth)                │    │
│  │ PUT    /api/reviews/:id          (Auth, Owner/Admin)   │    │
│  │ DELETE /api/reviews/:id          (Auth, Owner/Admin)   │    │
│  │ GET    /api/reviews               (Auth, Admin)        │    │
│  │ GET    /api/reviews/design/:id   (Public)              │    │
│  │ GET    /api/reviews/analytics    (Auth, Admin)         │    │
│  └────────────────────┬───────────────────────────────────┘    │
│                       │                                          │
│  ┌────────────────────▼───────────────────────────────────┐    │
│  │              Review Controller                          │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │ • Check purchase (status="completed")                  │    │
│  │ • Validate with Zod schemas                            │    │
│  │ • Check authorization                                  │    │
│  │ • Prevent duplicates                                   │    │
│  │ • Calculate analytics                                  │    │
│  │ • Update design ratings                                │    │
│  └────────────────────┬───────────────────────────────────┘    │
│                       │                                          │
│  ┌────────────────────▼───────────────────────────────────┐    │
│  │                MongoDB Database                         │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │                                                         │    │
│  │  Reviews Collection          Purchases Collection      │    │
│  │  ┌──────────────┐           ┌────────────────┐        │    │
│  │  │ _id          │           │ _id            │        │    │
│  │  │ design       │◄──────────┤ design         │        │    │
│  │  │ reviewer     │           │ user           │        │    │
│  │  │ rating (1-5) │           │ status         │        │    │
│  │  │ comment      │           │ purchaseType   │        │    │
│  │  │ title        │           │ ...            │        │    │
│  │  │ isHelpful    │           └────────────────┘        │    │
│  │  │ createdAt    │                  │                  │    │
│  │  │ updatedAt    │                  │                  │    │
│  │  └──────────────┘                  │                  │    │
│  │         │                           │                  │    │
│  │         │         Designs Collection│                  │    │
│  │         │         ┌─────────────────▼──┐               │    │
│  │         └────────►│ _id               │               │    │
│  │                   │ title             │               │    │
│  │                   │ averageRating ⭐  │               │    │
│  │                   │ totalReviews      │               │    │
│  │                   │ ...               │               │    │
│  │                   └───────────────────┘               │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Diagrams

### 1. Create Review Flow

```
Customer Side:
┌──────────────┐
│   Customer   │
│   Logged In  │
└──────┬───────┘
       │
       │ 1. Completes Purchase
       ▼
┌──────────────────┐
│ Admin Approves   │
│ Status→completed │
└──────┬───────────┘
       │
       │ 2. Navigate to /dashboard/reviews
       ▼
┌────────────────────────┐
│  Purchased Designs     │
│  (Only completed)      │
│  ┌──────────────────┐  │
│  │ Design A ✓       │  │
│  │ Design B ✓       │  │
│  └──────────────────┘  │
└──────┬─────────────────┘
       │
       │ 3. Click "Write Review"
       ▼
┌────────────────────────┐
│   Review Modal         │
│  ┌──────────────────┐  │
│  │ Rating: ⭐⭐⭐⭐⭐  │  │
│  │ Title: [5-100]   │  │
│  │ Comment: [10-1K] │  │
│  │ [Submit]         │  │
│  └──────────────────┘  │
└──────┬─────────────────┘
       │
       │ 4. POST /api/reviews
       │    { designId, rating, title, comment }
       ▼
Backend Processing:
┌─────────────────────────────────┐
│ Review Controller               │
├─────────────────────────────────┤
│ ✓ Check auth (JWT cookie)      │
│ ✓ Validate Zod schema          │
│ ✓ Check design exists          │
│ ✓ Check purchase completed     │
│ ✓ Check no duplicate review    │
│ ✓ Save review to DB            │
│ ✓ Update design avgRating      │
│ ✓ Update design totalReviews   │
└─────────────┬───────────────────┘
              │
              │ 5. Return success
              ▼
┌─────────────────────────────────┐
│ Frontend Updates                │
├─────────────────────────────────┤
│ • Close modal                   │
│ • Show success message          │
│ • Refetch reviews (RTK Query)   │
│ • Review appears in list        │
└─────────────────────────────────┘
```

### 2. Admin Analytics Flow

```
Admin Side:
┌──────────────┐
│  Admin User  │
└──────┬───────┘
       │
       │ 1. Navigate to /admin/reviews
       ▼
┌─────────────────────────────────┐
│  GET /api/reviews/analytics     │
│  ?period=monthly                │
└──────┬──────────────────────────┘
       │
       │ 2. Backend calculates
       ▼
┌─────────────────────────────────┐
│  MongoDB Aggregations           │
├─────────────────────────────────┤
│ • Count total reviews           │
│ • Calculate avg rating          │
│ • Group by rating (1-5)         │
│ • Find top reviewed designs     │
│ • Find top reviewers            │
│ • Filter by date period         │
└──────┬──────────────────────────┘
       │
       │ 3. Return analytics data
       ▼
┌─────────────────────────────────┐
│  Frontend Renders               │
├─────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐        │
│ │ Total   │ │ Avg ⭐  │        │
│ │  152    │ │  4.3    │        │
│ └─────────┘ └─────────┘        │
│ ┌─────────┐ ┌─────────┐        │
│ │Helpful  │ │ Distrib │        │
│ │  89     │ │ 5★:45   │        │
│ └─────────┘ └─────────┘        │
│                                 │
│ Top Reviewed Designs:           │
│ 1. Design X - 25 reviews (4.8★) │
│ 2. Design Y - 18 reviews (4.5★) │
│ 3. Design Z - 12 reviews (4.9★) │
└─────────────────────────────────┘
```

### 3. Edit Review Flow

```
┌──────────────┐
│   Customer   │
└──────┬───────┘
       │
       │ 1. Click Edit ✏️ icon
       ▼
┌────────────────────────┐
│  Modal Pre-filled      │
│  ┌──────────────────┐  │
│  │ Rating: ⭐⭐⭐⭐⭐  │  │
│  │ Title: "Great!"  │  │
│  │ Comment: "..."   │  │
│  │ [Update]         │  │
│  └──────────────────┘  │
└──────┬─────────────────┘
       │
       │ 2. Modify and submit
       │    PUT /api/reviews/:id
       ▼
┌─────────────────────────────────┐
│ Backend Checks                  │
├─────────────────────────────────┤
│ ✓ User owns review OR is admin │
│ ✓ Validate new data             │
│ ✓ Update review                 │
│ ✓ Recalculate design avgRating  │
└─────────────┬───────────────────┘
              │
              │ 3. Success
              ▼
┌─────────────────────────────────┐
│ Frontend Updates                │
│ • Close modal                   │
│ • Show success                  │
│ • Review reflects changes       │
└─────────────────────────────────┘
```

### 4. Delete Review Flow

```
┌──────────────┐
│ Customer     │
│ or Admin     │
└──────┬───────┘
       │
       │ 1. Click Delete 🗑️
       ▼
┌────────────────────────┐
│  Confirmation Dialog   │
│  "Are you sure?"       │
│  [Cancel] [Delete]     │
└──────┬─────────────────┘
       │
       │ 2. Confirm
       │    DELETE /api/reviews/:id
       ▼
┌─────────────────────────────────┐
│ Backend Checks                  │
├─────────────────────────────────┤
│ ✓ User owns review OR is admin │
│ ✓ Delete from DB                │
│ ✓ Recalculate design avgRating  │
│ ✓ Decrement design totalReviews │
└─────────────┬───────────────────┘
              │
              │ 3. Success
              ▼
┌─────────────────────────────────┐
│ Frontend Updates                │
│ • Show success                  │
│ • Remove from list              │
│ • Update counts                 │
└─────────────────────────────────┘
```

## 🔐 Authorization Matrix

```
┌──────────────┬──────────┬────────┬─────────┐
│   Action     │ Customer │ Admin  │  Guest  │
├──────────────┼──────────┼────────┼─────────┤
│ View Reviews │    ✅    │   ✅   │   ✅    │
│ Create       │ ✅ (own) │   ✅   │   ❌    │
│ Edit Own     │    ✅    │   ✅   │   ❌    │
│ Edit Others  │    ❌    │   ✅   │   ❌    │
│ Delete Own   │    ✅    │   ✅   │   ❌    │
│ Delete Others│    ❌    │   ✅   │   ❌    │
│ Analytics    │    ❌    │   ✅   │   ❌    │
└──────────────┴──────────┴────────┴─────────┘

Requirements:
• Customer must have COMPLETED purchase to review
• One review per customer per design
• Admin has full control
```

## 📊 Database Relationships

```
┌─────────────────┐
│   Users         │
│  ┌─────────┐   │
│  │ _id     │───────────┐
│  │ name    │           │
│  │ email   │           │
│  │ role    │           │
│  └─────────┘           │
└─────────────────┘      │
                         │
                         │ reviewer
                         │
┌─────────────────┐      │      ┌─────────────────┐
│  Designs        │      │      │   Reviews       │
│  ┌─────────┐   │      │      │  ┌─────────┐   │
│  │ _id     │◄─────────┼──────┼──┤ design  │   │
│  │ title   │   │      │      │  │ reviewer│───┘
│  │ price   │   │      └──────┼─►│ rating  │
│  │ avgRat ⭐│   │             │  │ comment │
│  │ totalR  │   │             │  │ title   │
│  └─────────┘   │             │  │ created │
└─────────────────┘             │  └─────────┘
        ▲                       └─────────────────┘
        │                                ▲
        │                                │
        │ design                         │ purchase check
        │                                │
┌─────────────────┐             ┌─────────────────┐
│  Purchases      │             │ Controller      │
│  ┌─────────┐   │             │ Validates:      │
│  │ design  │───┘             │ • Completed ✓   │
│  │ user    │                 │ • No duplicate  │
│  │ status  │─────────────────┤ • User owns     │
│  │ type    │                 └─────────────────┘
│  └─────────┘   │
└─────────────────┘
```

## 🎯 State Management (RTK Query)

```
Frontend Cache Structure:

api/
├── queries/
│   ├── getReviews (admin list)
│   │   └── cache key: { page, limit, sort, filter }
│   ├── getDesignReviews (public)
│   │   └── cache key: { designId, page }
│   └── getReviewAnalytics (admin)
│       └── cache key: { period }
│
└── mutations/
    ├── createReview
    │   └── invalidates: ["Reviews"]
    ├── updateReview
    │   └── invalidates: ["Reviews"]
    └── deleteReview
        └── invalidates: ["Reviews"]

When mutation happens:
1. Execute mutation
2. Invalidate cache tags
3. Auto-refetch affected queries
4. UI updates automatically
```

## 🚦 Validation Pipeline

```
Frontend Validation:
┌────────────────────────┐
│ User Input             │
└──────┬─────────────────┘
       │
       │ HTML5 validation
       │ minLength, maxLength, required
       ▼
┌────────────────────────┐
│ Runtime Checks         │
│ • Comment ≥ 10 chars   │
│ • Title ≥ 5 chars      │
│ • Rating 1-5           │
└──────┬─────────────────┘
       │
       │ If valid
       ▼
    [Submit]
       │
       │ POST to backend
       ▼
Backend Validation:
┌────────────────────────┐
│ Zod Schema             │
│ • Comment 10-1000      │
│ • Title 5-100          │
│ • Rating integer 1-5   │
│ • designId ObjectId    │
└──────┬─────────────────┘
       │
       │ If valid
       ▼
┌────────────────────────┐
│ Business Logic         │
│ • Design exists?       │
│ • Purchase completed?  │
│ • Already reviewed?    │
│ • User authorized?     │
└──────┬─────────────────┘
       │
       │ All pass
       ▼
    [Save to DB]
```

## 🎨 Component Hierarchy

```
Dashboard Reviews Page
└── MyReviewsPage
    ├── Header
    │   ├── Title
    │   ├── Description
    │   └── "Write Review" Button
    │
    ├── Reviews List
    │   └── For each purchased design:
    │       ├── Design Card
    │       │   ├── Preview Image
    │       │   ├── Title + Category
    │       │   ├── Price
    │       │   └── Avg Rating
    │       │
    │       └── Review Content
    │           ├── Existing Review
    │           │   ├── Stars
    │           │   ├── Title
    │           │   ├── Comment
    │           │   ├── Date
    │           │   └── Edit/Delete buttons
    │           │
    │           └── No Review
    │               └── "Write a review" link
    │
    └── Review Modal (if showModal)
        ├── Title
        ├── Form
        │   ├── Design Select
        │   ├── Rating Picker
        │   ├── Title Input (counter)
        │   └── Comment Textarea (counter)
        │
        └── Actions
            ├── Cancel Button
            └── Submit Button

Admin Reviews Page
└── AdminReviewsPage
    ├── Header
    │   ├── Title
    │   └── Period Selector
    │
    ├── Analytics Cards (Grid 4 cols)
    │   ├── Total Reviews Card
    │   ├── Average Rating Card
    │   ├── Helpful Reviews Card
    │   └── Distribution Card
    │
    ├── Search & Filters
    │   ├── Search Input
    │   └── Filter Panel (collapsible)
    │       ├── Rating Filter
    │       ├── Sort By
    │       └── Sort Order
    │
    ├── Reviews List
    │   └── For each review:
    │       ├── Design Title (link)
    │       ├── Stars + Rating
    │       ├── Reviewer Name
    │       ├── Date + Helpful badge
    │       ├── Title (if exists)
    │       ├── Comment
    │       └── Actions
    │           ├── View Design Button
    │           └── Delete Button
    │
    ├── Pagination
    │   ├── Info (showing X to Y of Z)
    │   ├── Previous Button
    │   ├── Page Numbers (1-5)
    │   └── Next Button
    │
    └── Top Reviewed Designs
        └── For each design (top 5):
            ├── Rank Badge
            ├── Design Title
            ├── Review Count + Avg
            └── Stars
```

## 📱 Responsive Breakpoints

```
Mobile (< 768px):
┌─────────────────┐
│    Analytics    │
│  ┌───────────┐  │
│  │  Card 1   │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │  Card 2   │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │  Card 3   │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │  Card 4   │  │
│  └───────────┘  │
└─────────────────┘

Tablet (768px - 1024px):
┌──────────────────────────┐
│      Analytics           │
│  ┌──────────┬──────────┐ │
│  │  Card 1  │  Card 2  │ │
│  └──────────┴──────────┘ │
│  ┌──────────┬──────────┐ │
│  │  Card 3  │  Card 4  │ │
│  └──────────┴──────────┘ │
└──────────────────────────┘

Desktop (> 1024px):
┌────────────────────────────────────┐
│          Analytics                  │
│  ┌────┬────┬────┬────┐             │
│  │ C1 │ C2 │ C3 │ C4 │             │
│  └────┴────┴────┴────┘             │
└────────────────────────────────────┘
```

---

This architecture ensures:
✅ Clean separation of concerns
✅ Type-safe data flow
✅ Automatic cache management
✅ Secure authorization
✅ Responsive design
✅ Production ready
