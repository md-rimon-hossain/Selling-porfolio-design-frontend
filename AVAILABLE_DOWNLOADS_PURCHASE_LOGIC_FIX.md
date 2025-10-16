# Available Downloads - Purchase Logic Fix

## Overview

Updated the Available Downloads page to correctly handle purchase status validation based on actual backend implementation.

---

## Key Changes

### 1. **Removed Subscription Status API Call**

**Before:**

```typescript
const { data: subscriptionData } = useGetSubscriptionStatusQuery();
const hasActiveSubscription = subscriptionData?.data?.hasActiveSubscription;
```

**After:**

```typescript
// Check directly from purchases array
const activeSubscription = purchases.find(
  (p: Purchase) =>
    p.purchaseType === "subscription" &&
    p.status === "completed" && // Must be completed, not just "active"
    p.subscriptionEndDate &&
    new Date(p.subscriptionEndDate) > new Date()
);
const hasActiveSubscription = !!activeSubscription;
```

**Reason:** Backend uses `status: "completed"` for active subscriptions, not `status: "active"`. The subscription status endpoint was redundant since we already fetch all purchases.

---

### 2. **Fixed Individual Purchase Validation**

**Before:**

```typescript
// Accepted both "completed" and "pending"
p.status === "completed" || p.status === "pending";
```

**After:**

```typescript
// Only completed purchases
p.status === "completed";
```

**Reason:** According to backend controller, only **completed** individual purchases should allow downloads. Pending purchases are still awaiting payment confirmation.

---

### 3. **Subscription Validation Logic**

The subscription is considered **active** if:

1. ✅ `purchaseType === "subscription"`
2. ✅ `status === "completed"` (backend sets this when payment is confirmed)
3. ✅ `subscriptionEndDate` exists
4. ✅ `subscriptionEndDate > current date` (not expired)

**Backend Flow:**

```typescript
// Backend purchase.controller.ts - updatePurchaseStatus
if (status === "completed" && purchase.status !== "completed") {
  updateData.activatedAt = new Date();

  if (purchase.purchaseType === "subscription") {
    // Set subscription dates
    updateData.subscriptionStartDate = subscriptionStartDate;
    updateData.subscriptionEndDate = subscriptionEndDate;
    updateData.remainingDownloads = plan.maxDownloads || 999999;
  }
}
```

---

### 4. **Updated Subscription Banner**

**Before:**

- Used `subscriptionData.data` from separate API call
- Complex nested checks

**After:**

```typescript
<div className={hasActiveSubscription ? "green-gradient" : "blue-gradient"}>
  {hasActiveSubscription && activeSubscription ? (
    <>
      {activeSubscription.remainingDownloads === 999999
        ? "Unlimited downloads"
        : `${activeSubscription.remainingDownloads} downloads remaining`}
      • {activeSubscription.pricingPlan?.name}
      Expires:{" "}
      {new Date(activeSubscription.subscriptionEndDate).toLocaleDateString()}
    </>
  ) : (
    "Subscribe to get unlimited access"
  )}
</div>
```

**Benefits:**

- Shows actual data from purchases
- Displays correct remaining downloads
- Shows subscription end date
- Shows plan name

---

### 5. **Updated Type Definitions**

**File:** `src/types/dashboard.ts`

**Added Fields:**

```typescript
export interface Purchase {
  // ... existing fields
  subscriptionStartDate?: string; // NEW
  subscriptionEndDate?: string; // NEW
  remainingDownloads?: number; // NEW
  pricingPlan?: {
    _id: string;
    name: string;
    description?: string; // NEW
    duration?: string; // NEW
  };
}
```

---

## Backend Purchase Status Flow

### Individual Purchase:

```
1. User creates purchase → status: "pending"
2. Admin updates status → status: "completed"
3. User can now download the design
```

### Subscription Purchase:

```
1. User creates purchase → status: "pending"
2. Admin updates to "completed":
   - Sets subscriptionStartDate = now
   - Sets subscriptionEndDate = now + duration
   - Sets remainingDownloads = plan.maxDownloads
   - Sets activatedAt = now
3. User can now download ALL designs
4. Downloads decrement remainingDownloads
5. When subscriptionEndDate < now → expired
```

---

## Download Permission Logic

### For Individual Purchases:

```typescript
// Backend download.controller.ts - checkDownloadPermission
const individualPurchase = await Purchase.findOne({
  user: userId,
  design: designId,
  purchaseType: "individual",
  status: "completed", // ONLY completed
});

if (individualPurchase) {
  return { allowed: true, downloadType: "individual_purchase" };
}
```

### For Subscription:

```typescript
const activeSubscription = await Purchase.findOne({
  user: userId,
  purchaseType: "subscription",
  status: "active", // Note: Backend uses "active"
  subscriptionEndDate: { $gt: new Date() },
  remainingDownloads: { $gt: 0 },
});

if (activeSubscription) {
  return { allowed: true, downloadType: "subscription" };
}
```

**⚠️ Important Note:** There's a discrepancy between the purchase controller and download controller:

- **Purchase Controller** uses `status: "completed"` when activating subscription
- **Download Controller** checks for `status: "active"`

This needs to be aligned in the backend. For now, the frontend checks for `"completed"`.

---

## Testing Checklist

### Individual Purchase Flow:

- [ ] Create individual purchase (status: pending)
- [ ] Design should NOT appear in available downloads
- [ ] Admin updates status to "completed"
- [ ] Design should NOW appear with "Purchased" badge
- [ ] Click download button
- [ ] Download should succeed
- [ ] Design remains available for unlimited downloads

### Subscription Flow:

- [ ] User has no subscription
- [ ] Banner shows "No Active Subscription"
- [ ] Only purchased designs visible
- [ ] Purchase subscription (status: pending)
- [ ] Subscription should NOT be active yet
- [ ] Admin updates status to "completed"
- [ ] Banner should show "Active Subscription"
- [ ] ALL designs should be available
- [ ] Each design shows "Subscription" badge
- [ ] Click download on any design
- [ ] Download should succeed
- [ ] remainingDownloads should decrement
- [ ] When subscriptionEndDate expires
- [ ] Banner should show "No Active Subscription"
- [ ] Only individually purchased designs remain

### Filter Tests:

- [ ] "All Designs" shows all available (purchased + subscription)
- [ ] "Purchased" shows only individually purchased designs
- [ ] "Subscription Access" (only visible with active sub) shows all designs
- [ ] Search filter works
- [ ] Category filter works
- [ ] Clear filters resets everything

---

## API Endpoints Used

1. **GET /api/v1/purchases/my-purchases**

   - Fetches all user purchases
   - No status filter (gets all)
   - Used to check both individual and subscription purchases

2. **GET /api/v1/designs**

   - Fetches designs with filters
   - Used to show available designs

3. **POST /api/v1/downloads/design/:designId**
   - Initiates download
   - Backend validates permission
   - Returns download URL and remaining info

---

## Status Values Explained

### Purchase Status:

- `pending` - Payment not confirmed, awaiting admin approval
- `completed` - Payment confirmed, purchase is active
- `expired` - Subscription end date has passed
- `cancelled` - User or admin cancelled the purchase
- `refunded` - Purchase was refunded

### When Downloads Are Allowed:

- **Individual**: Only `completed` status
- **Subscription**: `completed` status + not expired + remainingDownloads > 0

---

## Benefits of This Approach

1. ✅ **Single Source of Truth**: Uses purchases array for everything
2. ✅ **Accurate Status**: Reflects actual purchase completion status
3. ✅ **Real-time Data**: Shows correct remaining downloads
4. ✅ **Backend Aligned**: Matches purchase controller logic
5. ✅ **Simplified Code**: Removed redundant subscription status API call
6. ✅ **Better UX**: Shows why designs are available (purchased vs subscription)

---

## Backend Recommendation

Consider updating the backend to use consistent status values:

**Option 1: Use "completed" everywhere**

```typescript
// In download.controller.ts
const activeSubscription = await Purchase.findOne({
  status: "completed", // Change from "active"
  subscriptionEndDate: { $gt: new Date() },
});
```

**Option 2: Use "active" everywhere**

```typescript
// In purchase.controller.ts
if (status === "active") {
  // Change from "completed"
  updateData.activatedAt = new Date();
}
```

**Recommended:** Use `"completed"` as it's more accurate for payment confirmation status.

---

## Summary

The Available Downloads page now correctly:

- ✅ Shows only **completed** individual purchases
- ✅ Validates subscriptions with **completed** status and expiry check
- ✅ Displays accurate remaining downloads from purchase data
- ✅ Shows subscription expiry date
- ✅ Enables downloads only when purchase is completed
- ✅ Differentiates between purchased and subscription access with badges

All logic is now aligned with the backend purchase controller implementation! 🚀
