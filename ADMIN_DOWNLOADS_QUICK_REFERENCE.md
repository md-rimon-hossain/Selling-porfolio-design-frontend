# Admin Downloads - Quick Reference

## 🚀 Quick Start

### Access the Page

```
URL: /admin/downloads
Role Required: admin
```

### Key Features

1. **Analytics Dashboard** - 4 metric cards (Total, Users, Individual, Subscription)
2. **Download Trends** - Visual chart with period selection
3. **Search & Filters** - Text search, type filter, date range, sorting
4. **Downloads Table** - Complete list with user, design, type, date, IP
5. **Top Designs** - Ranking of most downloaded designs

---

## 📊 Analytics Periods

| Period    | Description                   |
| --------- | ----------------------------- |
| `daily`   | Downloads per day             |
| `weekly`  | Downloads per week            |
| `monthly` | Downloads per month (default) |
| `yearly`  | Downloads per year            |

---

## 🔍 Filter Options

### Download Type

- **All Types** - Show everything
- **Individual Purchase** - One-time design purchases
- **Subscription** - Subscription-based downloads

### Sort Options

- **Download Date** - When design was downloaded (default)
- **Created Date** - When download record was created

### Sort Order

- **Newest First** - Descending (default)
- **Oldest First** - Ascending

---

## 🎯 Quick Actions

| Action        | Icon | Description              |
| ------------- | ---- | ------------------------ |
| View Design   | 👁️   | Opens design detail page |
| View User     | 👤   | Opens user profile page  |
| Refresh       | 📈   | Reloads all data         |
| Clear Filters | ❌   | Resets all filters       |

---

## 📱 Response Structure

### Downloads List

```typescript
{
  success: true,
  data: [{
    _id: string,
    user: { name, email },
    design: { title, category, previewImageUrl },
    downloadType: "individual_purchase" | "subscription",
    downloadDate: Date,
    ipAddress: string
  }],
  pagination: {
    currentPage: number,
    totalPages: number,
    totalItems: number,
    hasNextPage: boolean,
    hasPrevPage: boolean
  }
}
```

### Analytics

```typescript
{
  success: true,
  data: {
    overview: {
      totalDownloads: number,
      uniqueUsers: number,
      individualDownloads: number,
      subscriptionDownloads: number
    },
    downloadTrends: [{ _id: string, count: number }],
    topDownloadedDesigns: [{
      _id: string,
      title: string,
      downloadCount: number,
      price: number
    }]
  }
}
```

---

## 🎨 UI Components

### Analytics Cards

```
┌─────────────────┐ ┌─────────────────┐
│ 🔵 Total        │ │ 🟢 Unique       │
│    Downloads    │ │    Users        │
│    1,547        │ │    423          │
└─────────────────┘ └─────────────────┘
┌─────────────────┐ ┌─────────────────┐
│ 🟣 Individual   │ │ 🟠 Subscription │
│    Purchases    │ │    Downloads    │
│    890          │ │    657          │
└─────────────────┘ └─────────────────┘
```

### Download Trends

```
2025-01  ████████████████░░░░  245 downloads
2025-02  ████████████████████  312 downloads
2025-03  ██████████░░░░░░░░░░  156 downloads
```

---

## 🔧 API Hooks

### Get All Downloads

```typescript
const { data, isLoading, refetch } = useGetAllDownloadsQuery({
  page: 1,
  limit: 15,
  sortBy: "downloadDate",
  sortOrder: "desc",
  downloadType: "individual_purchase", // optional
  search: "logo", // optional
  startDate: "2025-01-01", // optional
  endDate: "2025-12-31", // optional
});
```

### Get Analytics

```typescript
const { data } = useGetDownloadAnalyticsQuery({
  period: "monthly",
  startDate: "2025-01-01", // optional
  endDate: "2025-12-31", // optional
});
```

---

## 💡 Common Use Cases

### 1. View Recent Activity

```
1. Navigate to /admin/downloads
2. Default view shows latest downloads
```

### 2. Track Subscription Usage

```
1. Click "Filters"
2. Select "Subscription" from Download Type
3. View filtered results
```

### 3. Find User Downloads

```
1. Type user name in search bar
2. View all downloads by that user
```

### 4. Monthly Performance

```
1. Select "Monthly" from period dropdown
2. Review download trends chart
```

### 5. Popular Designs

```
1. Scroll to "Top Downloaded Designs"
2. See ranking of most popular designs
```

---

## 🎯 Status Badges

| Type         | Color  | Badge           |
| ------------ | ------ | --------------- |
| Individual   | Blue   | 📄 Individual   |
| Subscription | Purple | 📦 Subscription |

---

## 📏 Pagination

```
Showing 1 to 15 of 147 downloads

[Previous] [1] [2] [3] [4] [5] [Next]
```

**Settings**:

- Items per page: `15`
- Max page buttons: `5`
- Scroll to top on page change: ✅

---

## 🔐 Security

### Required Permissions

- ✅ User must be logged in
- ✅ User must have `role: "admin"`
- ✅ Backend validates admin JWT token

### Protected Routes

```typescript
// Automatically redirects non-admins
if (user?.role !== "admin") {
  redirect("/login");
}
```

---

## 🎨 Color Guide

| Metric          | Gradient | Hex Colors        |
| --------------- | -------- | ----------------- |
| Total Downloads | Blue     | #3B82F6 → #2563EB |
| Unique Users    | Green    | #10B981 → #059669 |
| Individual      | Purple   | #8B5CF6 → #7C3AED |
| Subscription    | Orange   | #F97316 → #EA580C |

---

## 📊 Data Refresh

### Manual

```typescript
<Button onClick={() => refetch()}>Refresh</Button>
```

### Automatic (Optional)

```typescript
useGetAllDownloadsQuery(params, {
  pollingInterval: 30000, // 30 seconds
});
```

---

## ⚡ Performance

- ✅ Memoized query params
- ✅ Next.js Image optimization
- ✅ Paginated results (15 per page)
- ✅ Lazy loading for images
- ✅ Conditional rendering

---

## 🐛 Error States

### Loading

```
Spinner animation while fetching data
```

### Empty

```
📥 No downloads found
"Try adjusting your filters"
```

### No Trends

```
Hidden if downloadTrends.length === 0
```

---

## 📱 Mobile Responsive

| Breakpoint       | Layout                        |
| ---------------- | ----------------------------- |
| `< 768px`        | Single column, stacked cards  |
| `768px - 1024px` | 2-column grid                 |
| `> 1024px`       | 4-column grid, inline filters |

---

## 🔗 Quick Links

- [Full Documentation](./ADMIN_DOWNLOADS_COMPLETE.md)
- [API Service](../src/services/api.ts)
- [Page Component](../src/app/admin/downloads/page.tsx)

---

**Last Updated**: October 16, 2025  
**Status**: ✅ Production Ready
