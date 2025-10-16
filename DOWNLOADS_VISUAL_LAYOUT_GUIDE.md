# Downloads Pages - Visual Layout Guide

## Available Downloads Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                     AVAILABLE DOWNLOADS                          │
│          Access all designs you can download                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 🟢 ACTIVE SUBSCRIPTION                                   │   │
│  │ ∞ downloads remaining • Premium Plan                     │   │
│  │ 🕐 Expires: 12/31/2025                          [   ∞   ]│   │
│  │                                                Downloads  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────┐         │
│  │ [All Designs] [Purchased (5)] [⭐ Subscription]    │ [🔄]   │
│  │                                                     │         │
│  │ [Search designs...]  [Filter by category...] [✖ Clear]      │
│  └────────────────────────────────────────────────────┘         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ [IMAGE]  │  │ [IMAGE]  │  │ [IMAGE]  │                      │
│  │ 🔵Purchased│  │ 🟣Subscription│ │ 🔵Purchased│               │
│  │          │  │          │  │          │                      │
│  │ Design 1 │  │ Design 2 │  │ Design 3 │                      │
│  │ Category │  │ Category │  │ Category │                      │
│  │ 📅 Date  │  │ 📅 Date  │  │ 📅 Date  │                      │
│  │          │  │          │  │          │                      │
│  │[⬇Download]│  │[⬇Download]│  │[⬇Download]│                   │
│  └──────────┘  └──────────┘  └──────────┘                      │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ [IMAGE]  │  │ [IMAGE]  │  │ [IMAGE]  │                      │
│  │ 🟣Subscription│ │ 🔵Purchased│  │ 🟣Subscription│              │
│  │ ...      │  │ ...      │  │ ...      │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│              [← Previous]  Page 1 of 5  [Next →]                │
└─────────────────────────────────────────────────────────────────┘
```

## Downloads History Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                     DOWNLOADS HISTORY                            │
│          View and track all your design downloads                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ 📥 TOTAL     │  │ ⭐ SUBSCRIPTION│  │ 🛒 INDIVIDUAL│         │
│  │              │  │                │  │              │         │
│  │     42       │  │      28        │  │      14      │         │
│  │  Downloads   │  │   Downloads    │  │  Purchases   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────┐         │
│  │ [🔍 Filters ▼]                    42 total downloads│ [🔄]   │
│  │ ─────────────────────────────────────────────────── │         │
│  │ [Download Type] [Sort By] [Sort Order] [✖ Clear]   │         │
│  └────────────────────────────────────────────────────┘         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ [IMAGE]  │  │ [IMAGE]  │  │ [IMAGE]  │                      │
│  │🔵Purchase │  │🟣Subscription│ │🔵Purchase │                   │
│  │          │  │          │  │          │                      │
│  │ Design 1 │  │ Design 2 │  │ Design 3 │                      │
│  │by Designer│  │by Designer│  │by Designer│                   │
│  │          │  │          │  │          │                      │
│  │📅 12/01   │  │📅 12/02   │  │📅 12/03   │                   │
│  │💰 $29.99  │  │💰 $99.99  │  │💰 $19.99  │                   │
│  │          │  │          │  │          │                      │
│  │[View] [🛒]│  │[View] [🛒]│  │[View] [🛒]│                    │
│  └──────────┘  └──────────┘  └──────────┘                      │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│    [← Prev] [1] [2] [3] [4] [5] ... of 12 [Next →]             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### Available Downloads Page

#### 1. **Header Section**

```tsx
<div>
  <h1>Available Downloads</h1>
  <p>Access all designs you can download</p>
</div>
```

#### 2. **Subscription Banner** (Conditional)

```tsx
{
  subStatus && (
    <div className="gradient-card">
      <CheckCircle /> or <Sparkles />
      <div>
        <h3>Active/No Subscription</h3>
        <p>Downloads info • Plan name</p>
        <Clock /> Expires: Date
      </div>
      <div>
        <Infinity /> or Number Downloads
      </div>
    </div>
  );
}
```

#### 3. **Filter Controls**

```tsx
<div className="filter-panel">
  {/* Tab Filters */}
  <div className="tabs">
    <button>All Designs</button>
    <button>Purchased (count)</button>
    <button>⭐ Subscription</button>
  </div>
  <RefreshCw />

  {/* Search and Category */}
  <input placeholder="Search designs..." />
  <input placeholder="Filter by category..." />
  <button>✖ Clear Filters</button>
</div>
```

#### 4. **Designs Grid**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {designs.map((design) => (
    <div className="design-card">
      <Link href={`/designs/${id}`}>
        <Image /> or <Package />
        <Badge>Purchased/Subscription</Badge>
      </Link>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
        <Calendar /> {date}
        <span>{category}</span>
        <button onClick={handleDownload}>
          <Download /> Download Now
        </button>
      </div>
    </div>
  ))}
</div>
```

#### 5. **Pagination**

```tsx
{
  pagination && (
    <div className="pagination">
      <button>Previous</button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button>Next</button>
    </div>
  );
}
```

---

### Downloads History Page

#### 1. **Header Section**

```tsx
<div>
  <h1>Downloads History</h1>
  <p>View and track all your design downloads</p>
</div>
```

#### 2. **Statistics Cards**

```tsx
<div className="grid grid-cols-1 md:grid-cols-3">
  <div className="stat-card blue">
    <div>
      <p>Total Downloads</p>
      <p className="text-3xl">{total}</p>
    </div>
    <FileDown />
  </div>

  <div className="stat-card purple">
    <div>
      <p>Subscription Downloads</p>
      <p className="text-3xl">{subscription}</p>
    </div>
    <Sparkles />
  </div>

  <div className="stat-card green">
    <div>
      <p>Individual Purchases</p>
      <p className="text-3xl">{individual}</p>
    </div>
    <ShoppingBag />
  </div>
</div>
```

#### 3. **Filter Panel** (Collapsible)

```tsx
<div className="filter-section">
  <button onClick={toggleFilters}>
    <Filter /> Filters <ChevronDown/Up />
  </button>
  <div>
    <span>{totalItems} total downloads</span>
    <RefreshCw />
  </div>

  {showFilters && (
    <div className="grid grid-cols-4">
      <select>Download Type</select>
      <select>Sort By</select>
      <select>Sort Order</select>
      <button>✖ Clear</button>
    </div>
  )}
</div>
```

#### 4. **Download Cards Grid**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {downloads.map((download) => (
    <div className="download-card">
      <Link href={`/designs/${id}`}>
        <Image /> or <Package />
        <Badge icon={Icon}>{type}</Badge>
      </Link>
      <div>
        <h3>{design.title}</h3>
        <p>by {designer}</p>
        <div>
          <Calendar /> {downloadDate}
          <TrendingUp /> ${amount}
        </div>
        <div className="actions">
          <Link>View Design</Link>
          <Link>
            <ShoppingBag />
          </Link>
        </div>
      </div>
    </div>
  ))}
</div>
```

#### 5. **Advanced Pagination**

```tsx
<div className="pagination-advanced">
  <button disabled={!hasPrev}>Previous</button>
  <div>
    {[1, 2, 3, 4, 5].map((num) => (
      <button className={page === num ? "active" : ""}>{num}</button>
    ))}
    {totalPages > 5 && (
      <>
        <span>...</span>
        <span>of {totalPages}</span>
      </>
    )}
  </div>
  <button disabled={!hasNext}>Next</button>
</div>
```

---

## Color Scheme

### Subscription Banner

- **Active**: `from-green-500 to-emerald-600`
- **Inactive**: `from-blue-500 to-purple-600`

### Download Type Badges

- **Individual Purchase**: `bg-blue-100 text-blue-700`
- **Subscription**: `bg-purple-100 text-purple-700`

### Statistics Cards

- **Total**: `from-blue-500 to-blue-600`
- **Subscription**: `from-purple-500 to-purple-600`
- **Individual**: `from-green-500 to-green-600`

### Action Buttons

- **Primary**: `from-blue-600 to-purple-600` (gradient)
- **Secondary**: `border-gray-300 hover:bg-gray-50`
- **Clear/Reset**: `bg-gray-100 hover:bg-gray-200`

---

## Icons Used

### Available Downloads

- `CheckCircle` - Active subscription
- `Sparkles` - Subscription features
- `Download` - Download button
- `Calendar` - Date display
- `Package` - Image placeholder
- `RefreshCw` - Refresh button
- `X` - Clear filters
- `Clock` - Expiry date
- `Infinity` - Unlimited downloads
- `AlertCircle` - Empty state

### Downloads History

- `FileDown` - Total downloads stat
- `Sparkles` - Subscription stat
- `ShoppingBag` - Individual purchases stat
- `Filter` - Filter toggle
- `ChevronDown/Up` - Collapsible toggle
- `RefreshCw` - Refresh button
- `Calendar` - Download date
- `TrendingUp` - Purchase amount
- `Package` - Image placeholder
- `X` - Clear filters
- `AlertCircle` - Empty state

---

## Responsive Breakpoints

```css
/* Mobile First */
grid-cols-1         /* < 768px */
md:grid-cols-2      /* ≥ 768px */
lg:grid-cols-3      /* ≥ 1024px */
```

### Filter Panel

- **Mobile**: Stacked vertically
- **Tablet**: 2 columns
- **Desktop**: 4 columns

### Statistics Cards

- **Mobile**: Stacked (1 column)
- **Tablet**: 3 columns
- **Desktop**: 3 columns

---

## Loading States

### Skeleton Loader

```tsx
<div className="flex items-center justify-center h-64">
  <Loader2 className="animate-spin" />
  <p>Loading your downloads...</p>
</div>
```

### Button Loading

```tsx
<button disabled={isDownloading}>
  {isDownloading ? (
    <>
      <Loader2 className="animate-spin" />
      <span>Downloading...</span>
    </>
  ) : (
    <>
      <Download />
      <span>Download Now</span>
    </>
  )}
</button>
```

---

## Empty States

### Available Downloads

```tsx
<div className="empty-state">
  <AlertCircle />
  <h3>No designs available</h3>
  <p>Purchase or subscribe to start downloading!</p>
  <div>
    <Link>Browse Designs</Link>
    <Link>View Pricing</Link>
  </div>
</div>
```

### Downloads History

```tsx
<div className="empty-state">
  <AlertCircle />
  <h3>No downloads yet</h3>
  <p>Start downloading designs to see history</p>
  <div>
    <Link>Browse Available Downloads</Link>
    <Link>View Pricing</Link>
  </div>
</div>
```

---

## Hover Effects

### Design/Download Cards

```css
.card:hover {
  shadow: xl
  transform: subtle lift
}

.card img:hover {
  scale: 110%
  transition: 300ms
}
```

### Buttons

```css
.button:hover {
  shadow: lg
  transform: scale-105
}
```

---

This visual guide provides a complete reference for the layout, styling, and component structure of both downloads pages! 🎨
