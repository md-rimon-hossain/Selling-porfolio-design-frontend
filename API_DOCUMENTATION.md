# 🎨 Ecommerce Design Platform - Complete API Documentation

## 📋 Table of Contents
- [🌐 Base Configuration](#-base-configuration)
- [🔐 Authentication (Cookie-Based)](#-authentication-cookie-based)
- [🏥 Health Check](#-health-check)
- [🔐 Authentication Routes](#-authentication-routes)
- [👤 User Routes](#-user-routes)
- [📂 Categories Routes](#-categories-routes)
- [🎨 Designs Routes](#-designs-routes)
- [💰 Pricing Plans Routes](#-pricing-plans-routes)
- [🛒 Purchases Routes](#-purchases-routes)
- [📥 Downloads Routes](#-downloads-routes)
- [⭐ Reviews Routes](#-reviews-routes)
- [🔧 Frontend Integration Examples](#-frontend-integration-examples)
- [🚨 Error Handling](#-error-handling)
- [📱 Frontend Authentication Flow](#-frontend-authentication-flow)
- [📝 TypeScript Interfaces](#-typescript-interfaces)
- [🛡️ Security](#-security)

---

## 🌐 Base Configuration

```typescript
const BASE_URL = 'http://localhost:5000/api'

// IMPORTANT: Use credentials: 'include' for cookie-based auth
const fetchOptions = {
  credentials: 'include' as RequestCredentials,
  headers: {
    'Content-Type': 'application/json'
  }
}
```

---

## 🔐 Authentication (Cookie-Based)

**⚠️ IMPORTANT**: Your API uses **HTTP-only cookies** for authentication, NOT JWT tokens in headers!

- **Login/Register**: Sets secure HTTP-only cookie
- **All requests**: Must include `credentials: 'include'`
- **Logout**: Clears the authentication cookie
- **Token**: Stored server-side in secure HTTP-only cookie (1 day expiry)
- **Security**: HTTP-only, Secure in production, SameSite=strict

---

## 🏥 Health Check

### Get API Health Status
```typescript
GET /api/health
// Public
Response: {
  success: true,
  status: "OK",
  message: "API is healthy and running!😊 you can go with rest of the routes.😉"
}
```

---

## 🔐 Authentication Routes (`/api/auth`)

### Register User
```typescript
POST /api/auth/register
// Public
Body: {
  name: string,           // 2-50 chars
  email: string,          // valid email, lowercase
  password: string,       // min 6 chars, must contain uppercase, lowercase, number
  confirmPassword: string, // must match password
  role?: "admin" | "customer", // default: "customer"
  profileImage?: string   // optional URL
}

Response (201): {
  success: true,
  message: "User registered successfully",
  data: {
    user: {
      id: string,
      name: string,
      email: string,
      profileImage: string,
      role: "customer" | "admin"
    }
  }
}
// Sets HTTP-only cookie automatically
```

### Login User
```typescript
POST /api/auth/login
// Public
Body: {
  email: string,    // user's email
  password: string  // user's password
}

Response (200): {
  success: true,
  message: "Login successful",
  data: {
    user: {
      id: string,
      name: string,
      email: string,
      profileImage: string,
      role: "customer" | "admin"
    }
  }
}
// Sets HTTP-only cookie automatically
```

### Logout User
```typescript
POST /api/auth/logout
// Requires authentication cookie
Response (200): {
  success: true,
  message: "Logout successful"
}
// Clears HTTP-only cookie automatically
```

---

## 👤 User Routes (`/api/users`)

### Get My Profile
```typescript
GET /api/users/myProfile
// Authenticated users only (cookie required)
Response (200): {
  success: true,
  message: "User profile fetched successfully",
  data: {
    _id: string,
    name: string,
    email: string,
    role: "customer" | "admin",
    profileImage?: string,
    isActive: boolean,
    createdAt: string,
    updatedAt: string
  }
}
```

---

## 📂 Categories Routes (`/api/categories`)

### Get All Categories
```typescript
GET /api/categories
// Public
Response (200): {
  success: true,
  message: "Categories retrieved successfully",
  data: Category[] // only active, non-deleted categories
}
```

### Get Single Category
```typescript
GET /api/categories/:id
// Public
Response (200): {
  success: true,
  message: "Category retrieved successfully",
  data: Category
}
```

### Create Category
```typescript
POST /api/categories
// Admin only (cookie required)
Body: {
  name: string,        // 2-50 chars, letters and spaces only
  description: string, // 10-200 chars
  isActive?: boolean,  // default: true
  isDeleted?: boolean  // default: false
}

Response (201): {
  success: true,
  message: "Category created successfully",
  data: Category
}
```

### Update Category
```typescript
PUT /api/categories/:id
// Admin only (cookie required)
Body: {
  name?: string,
  description?: string,
  isActive?: boolean,
  isDeleted?: boolean
}

Response (200): {
  success: true,
  message: "Category updated successfully",
  data: Category
}
```

### Delete Category
```typescript
DELETE /api/categories/:id
// Admin only (cookie required)
Response (200): {
  success: true,
  message: "Category deleted successfully"
}
```

---

## 🎨 Designs Routes (`/api/designs`)

### Get All Designs
```typescript
GET /api/designs
// Public
Query: ?sortBy=createdAt&sortOrder=desc
Response (200): {
  success: true,
  message: "Designs retrieved successfully",
  data: Design[] // only Active status, populated with category info
}
```

### Get Single Design
```typescript
GET /api/designs/:id
// Public
Response (200): {
  success: true,
  message: "Design retrieved successfully",
  data: Design // populated with category info
}
```

### Create Design
```typescript
POST /api/designs
// Admin only (cookie required)
Body: {
  title: string,
  description: string,
  price: number,
  category: string,     // ObjectId of category
  tags: string[],
  images: string[],
  files: string[],
  requirements?: string,
  license?: string,
  status: "Active" | "Inactive"
}

Response (201): {
  success: true,
  message: "Design created successfully",
  data: Design
}
```

### Update Design
```typescript
PUT /api/designs/:id
// Admin only (cookie required)
Body: {
  title?: string,
  description?: string,
  price?: number,
  category?: string,
  tags?: string[],
  images?: string[],
  files?: string[],
  status?: "Active" | "Inactive"
}

Response (200): {
  success: true,
  message: "Design updated successfully",
  data: Design
}
```

### Delete Design
```typescript
DELETE /api/designs/:id
// Admin only (cookie required)
Response (200): {
  success: true,
  message: "Design deleted successfully"
}
```

---

## 💰 Pricing Plans Routes (`/api/pricing-plans`)

### Get All Pricing Plans
```typescript
GET /api/pricing-plans
// Public
Query: 
  ?page=1&limit=10
  &sortBy=priority&sortOrder=asc
  &isActive=true
  &minPrice=10&maxPrice=100
  &search=premium

Response (200): {
  success: true,
  message: "Pricing plans retrieved successfully",
  data: PricingPlan[],
  pagination: {
    currentPage: number,
    totalPages: number,
    totalItems: number,
    itemsPerPage: number,
    hasNextPage: boolean,
    hasPrevPage: boolean
  }
}
```

### Get Active Pricing Plans
```typescript
GET /api/pricing-plans/active
// Public - only active and valid plans
Response (200): {
  success: true,
  message: "Active pricing plans retrieved successfully",
  data: PricingPlan[]
}
```

### Get Single Pricing Plan
```typescript
GET /api/pricing-plans/:id
// Public
Response (200): {
  success: true,
  message: "Pricing plan retrieved successfully",
  data: PricingPlan
}
```

### Create Pricing Plan
```typescript
POST /api/pricing-plans
// Admin only (cookie required)
Body: {
  name: string,
  description: string,
  price: number,
  features: string[],
  duration: string,        // "1 month", "1 year"
  maxDesigns: number,
  maxDownloads: number,
  priority: number,
  isActive: boolean,
  discountPercentage?: number,
  validUntil?: Date
}

Response (201): {
  success: true,
  message: "Pricing plan created successfully",
  data: PricingPlan
}
```

### Update Pricing Plan
```typescript
PUT /api/pricing-plans/:id
// Admin only (cookie required)
Body: {
  name?: string,
  description?: string,
  price?: number,
  features?: string[],
  duration?: string,
  maxDesigns?: number,
  maxDownloads?: number,
  priority?: number,
  isActive?: boolean,
  discountPercentage?: number,
  validUntil?: Date
}

Response (200): {
  success: true,
  message: "Pricing plan updated successfully",
  data: PricingPlan
}
```

### Delete Pricing Plan
```typescript
DELETE /api/pricing-plans/:id
// Admin only (cookie required)
Response (200): {
  success: true,
  message: "Pricing plan deleted successfully"
}
```

---

## 🛒 Purchases Routes (`/api/purchases`)

### Check Subscription Eligibility
```typescript
GET /api/purchases/subscription-eligibility
// Authenticated users (cookie required)
Response (200): {
  success: true,
  message: string,
  data: {
    isEligible: boolean,
    reason?: string
  }
}
```

### Get My Purchases
```typescript
GET /api/purchases/my-purchases
// Authenticated users (cookie required)
Query: ?page=1&limit=10&status=active&purchaseType=subscription

Response (200): {
  success: true,
  message: "Your purchases retrieved successfully",
  data: Purchase[],
  pagination: {
    currentPage: number,
    totalPages: number,
    totalItems: number,
    itemsPerPage: number,
    hasNextPage: boolean,
    hasPrevPage: boolean
  }
}
```

### Create Purchase
```typescript
POST /api/purchases
// Authenticated users (cookie required)
Body: {
  purchaseType: "individual" | "subscription",
  design?: string,      // Required for individual
  pricingPlan?: string, // Required for subscription
  paymentMethod: "credit_card" | "paypal" | "stripe",
  paymentDetails: {
    cardNumber?: string,
    expiryDate?: string,
    cvv?: string,
    cardholderName?: string
  },
  billingAddress: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string
  },
  notes?: string
}

Response (201): {
  success: true,
  message: "Purchase created successfully",
  data: Purchase
}
```

### Get All Purchases (Admin)
```typescript
GET /api/purchases
// Admin only (cookie required)
Query: ?page=1&limit=10&status=active&userId=userObjectId

Response (200): {
  success: true,
  message: "Purchases retrieved successfully",
  data: Purchase[],
  pagination: object
}
```

### Get Purchase Analytics
```typescript
GET /api/purchases/analytics
// Admin only (cookie required)
Query: ?startDate=2025-01-01&endDate=2025-12-31&groupBy=month

Response (200): {
  success: true,
  message: "Purchase analytics retrieved successfully",
  data: {
    totalPurchases: number,
    totalRevenue: number,
    averageOrderValue: number,
    purchasesByType: object,
    purchasesByMonth: object,
    topCustomers: Array,
    period: string
  }
}
```

### Update Purchase Status
```typescript
PUT /api/purchases/:id/status
// Admin only (cookie required)
Body: {
  status: "pending" | "active" | "cancelled" | "expired"
}

Response (200): {
  success: true,
  message: "Purchase status updated successfully",
  data: Purchase
}
```

---

## 📥 Downloads Routes (`/api/downloads`)

### Get Subscription Status
```typescript
GET /api/downloads/subscription-status
// Authenticated users (cookie required)
Response (200): {
  success: true,
  message: string,
  data: {
    hasActiveSubscription: boolean,
    subscription?: {
      _id: string,
      pricingPlan: PricingPlan,
      subscriptionStartDate: Date,
      subscriptionEndDate: Date,
      remainingDownloads: number
    }
  }
}
```

### Download Design
```typescript
POST /api/downloads/design/:designId
// Authenticated users (cookie required)
// Must have purchased the design or have active subscription

Response (200): {
  success: true,
  message: "Download initiated successfully",
  data: {
    download: {
      _id: string,
      user: string,
      design: Design,
      downloadType: "individual" | "subscription",
      downloadDate: Date,
      expiresAt: Date
    },
    downloadUrl: string,
    expiresAt: Date,
    remainingDownloads: number | "Unlimited"
  }
}
```

### Get My Downloads
```typescript
GET /api/downloads/my-downloads
// Authenticated users (cookie required)
Query: ?page=1&limit=10&sortBy=downloadDate&sortOrder=desc

Response (200): {
  success: true,
  message: "Your downloads retrieved successfully",
  data: Download[],
  pagination: object
}
```

### Get Download Analytics
```typescript
GET /api/downloads/analytics
// Admin only (cookie required)
Query: ?startDate=2025-01-01&endDate=2025-12-31&designId=designObjectId

Response (200): {
  success: true,
  message: "Download analytics retrieved successfully",
  data: {
    totalDownloads: number,
    downloadsByDate: object,
    downloadsByDesign: Array,
    downloadsByUser: Array,
    period: string,
    dateRange: object
  }
}
```

---

## ⭐ Reviews Routes (`/api/reviews`)

### Create Review
```typescript
POST /api/reviews
// Authenticated customers (cookie required)
// Must have purchased the design with completed status
Body: {
  designId: string,     // ObjectId
  rating: number,       // 1-5
  comment: string,      // 10-1000 chars
  title?: string,       // max 100 chars
  pros?: string[],      // max 10 items
  cons?: string[]       // max 10 items
}

Response (201): {
  success: true,
  message: "Review created successfully",
  data: Review // populated with design and reviewer info
}
```

### Get Design Reviews
```typescript
GET /api/reviews/design/:designId
// Public
Query: 
  ?page=1&limit=10
  &sortBy=createdAt&sortOrder=desc
  &rating=5
  &minRating=1&maxRating=5

Response (200): {
  success: true,
  message: "Design reviews retrieved successfully",
  data: {
    reviews: Review[],
    statistics: {
      averageRating: number,
      totalReviews: number,
      ratingDistribution: {
        5: number, 
        4: number, 
        3: number, 
        2: number, 
        1: number
      }
    }
  },
  pagination: {
    currentPage: number,
    totalPages: number,
    totalItems: number,
    itemsPerPage: number,
    hasNextPage: boolean,
    hasPrevPage: boolean
  }
}
```

### Get All Reviews
```typescript
GET /api/reviews
// Admin only (cookie required)
Query: 
  ?page=1&limit=10
  &design=designObjectId
  &reviewer=userObjectId
  &rating=5&minRating=1&maxRating=5
  &search=searchTerm

Response (200): {
  success: true,
  message: "Reviews retrieved successfully",
  data: Review[],
  pagination: object
}
```

### Get Single Review
```typescript
GET /api/reviews/:id
// Public
Response (200): {
  success: true,
  message: "Review retrieved successfully",
  data: Review // populated with design and reviewer info
}
```

### Update Review
```typescript
PUT /api/reviews/:id
// Review owner or admin (cookie required)
Body: {
  rating?: number,
  comment?: string,
  title?: string,
  pros?: string[],
  cons?: string[]
}

Response (200): {
  success: true,
  message: "Review updated successfully",
  data: Review
}
```

### Delete Review
```typescript
DELETE /api/reviews/:id
// Review owner or admin (cookie required)
Response (200): {
  success: true,
  message: "Review deleted successfully"
}
```

### Mark Review as Helpful
```typescript
PUT /api/reviews/:id/helpful
// Authenticated users except review owner (cookie required)
Body: {
  isHelpful: boolean
}

Response (200): {
  success: true,
  message: "Review helpfulness updated successfully",
  data: {
    helpfulCount: number,
    userHelpfulStatus: boolean
  }
}
```

### Get Review Analytics
```typescript
GET /api/reviews/analytics
// Admin only (cookie required)
Query: ?period=monthly&startDate=2025-01-01&endDate=2025-12-31&designId=designObjectId

Response (200): {
  success: true,
  message: "Review analytics retrieved successfully",
  data: {
    totalReviews: number,
    averageRating: number,
    ratingDistribution: {
      5: number, 4: number, 3: number, 2: number, 1: number
    },
    topReviewedDesigns: [
      {
        design: Design,
        reviewCount: number,
        averageRating: number
      }
    ],
    topReviewers: [
      {
        user: User,
        reviewCount: number,
        averageRating: number
      }
    ],
    period: string,
    dateRange: {
      startDate: Date,
      endDate: Date
    }
  }
}
```

---

## 🔧 Frontend Integration Examples

### React/Next.js Integration (Cookie-Based Auth)

```typescript
// api/client.ts
const API_BASE = 'http://localhost:5000/api';

class ApiClient {
  private async request(endpoint: string, options: RequestInit = {}) {
    return fetch(`${API_BASE}${endpoint}`, {
      credentials: 'include', // CRITICAL: Always include cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
  }

  // Authentication
  async register(userData: RegisterData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return response.json();
  }

  async login(credentials: LoginData) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    return response.json();
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST'
    });
    return response.json();
  }

  async getProfile() {
    const response = await this.request('/users/myProfile');
    return response.json();
  }

  // Designs
  async getDesigns(params?: DesignQueryParams) {
    const query = new URLSearchParams(params as any).toString();
    const response = await this.request(`/designs?${query}`);
    return response.json();
  }

  async getDesign(id: string) {
    const response = await this.request(`/designs/${id}`);
    return response.json();
  }

  async createDesign(designData: CreateDesignData) {
    const response = await this.request('/designs', {
      method: 'POST',
      body: JSON.stringify(designData)
    });
    return response.json();
  }

  // Categories
  async getCategories() {
    const response = await this.request('/categories');
    return response.json();
  }

  async createCategory(categoryData: CreateCategoryData) {
    const response = await this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
    return response.json();
  }

  // Pricing Plans
  async getPricingPlans(params?: PricingPlanQueryParams) {
    const query = new URLSearchParams(params as any).toString();
    const response = await this.request(`/pricing-plans?${query}`);
    return response.json();
  }

  async getActivePricingPlans() {
    const response = await this.request('/pricing-plans/active');
    return response.json();
  }

  // Purchases
  async createPurchase(purchaseData: PurchaseData) {
    const response = await this.request('/purchases', {
      method: 'POST',
      body: JSON.stringify(purchaseData)
    });
    return response.json();
  }

  async getMyPurchases(params?: PurchaseQueryParams) {
    const query = new URLSearchParams(params as any).toString();
    const response = await this.request(`/purchases/my-purchases?${query}`);
    return response.json();
  }

  async checkSubscriptionEligibility() {
    const response = await this.request('/purchases/subscription-eligibility');
    return response.json();
  }

  // Downloads
  async getSubscriptionStatus() {
    const response = await this.request('/downloads/subscription-status');
    return response.json();
  }

  async downloadDesign(designId: string) {
    const response = await this.request(`/downloads/design/${designId}`, {
      method: 'POST'
    });
    return response.json();
  }

  async getMyDownloads(params?: DownloadQueryParams) {
    const query = new URLSearchParams(params as any).toString();
    const response = await this.request(`/downloads/my-downloads?${query}`);
    return response.json();
  }

  // Reviews
  async createReview(reviewData: ReviewData) {
    const response = await this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
    return response.json();
  }

  async getDesignReviews(designId: string, params?: ReviewQueryParams) {
    const query = new URLSearchParams(params as any).toString();
    const response = await this.request(`/reviews/design/${designId}?${query}`);
    return response.json();
  }

  async updateReview(reviewId: string, updateData: UpdateReviewData) {
    const response = await this.request(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
    return response.json();
  }

  async markReviewHelpful(reviewId: string, isHelpful: boolean) {
    const response = await this.request(`/reviews/${reviewId}/helpful`, {
      method: 'PUT',
      body: JSON.stringify({ isHelpful })
    });
    return response.json();
  }
}

export const apiClient = new ApiClient();
```

### Axios Configuration (Alternative)
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // CRITICAL: Always send cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Example usage
const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const getDesigns = async (params = {}) => {
  try {
    const response = await api.get('/designs', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
```

### React Hook Example
```typescript
// hooks/useAuth.ts
import { useState, useEffect, useContext, createContext } from 'react';
import { apiClient } from '../api/client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await apiClient.getProfile();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await apiClient.login({ email, password });
    if (response.success) {
      setUser(response.data.user);
    } else {
      throw new Error(response.message);
    }
  };

  const logout = async () => {
    await apiClient.logout();
    setUser(null);
  };

  const register = async (userData: RegisterData) => {
    const response = await apiClient.register(userData);
    if (response.success) {
      setUser(response.data.user);
    } else {
      throw new Error(response.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### Custom Hooks for API Data
```typescript
// hooks/useDesigns.ts
import { useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export const useDesigns = (params?: DesignQueryParams) => {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getDesigns(params);
        if (response.success) {
          setDesigns(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('Failed to fetch designs');
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, [JSON.stringify(params)]);

  return { designs, loading, error, refetch: () => fetchDesigns() };
};

// hooks/usePurchases.ts
export const usePurchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchases = async (params?: PurchaseQueryParams) => {
    try {
      setLoading(true);
      const response = await apiClient.getMyPurchases(params);
      if (response.success) {
        setPurchases(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to fetch purchases');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const createPurchase = async (purchaseData: PurchaseData) => {
    const response = await apiClient.createPurchase(purchaseData);
    if (response.success) {
      await fetchPurchases(); // Refresh list
      return response.data;
    } else {
      throw new Error(response.message);
    }
  };

  return { 
    purchases, 
    loading, 
    error, 
    createPurchase,
    refetch: fetchPurchases 
  };
};
```

---

## 🚨 Error Handling

### Standard Error Response Format
```typescript
{
  success: false,
  message: "Detailed error message",
  error?: "Additional error info",
  errorCode?: "SPECIFIC_ERROR_CODE"
}
```

### Validation Error Response
```typescript
{
  success: false,
  message: "Validation failed",
  errors: [
    {
      field: "email",
      message: "Email is already registered"
    },
    {
      field: "password",
      message: "Password must contain uppercase, lowercase, and number"
    }
  ]
}
```

### Common HTTP Status Codes
- **200**: Success
- **201**: Created successfully
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate data)
- **500**: Internal Server Error

### Frontend Error Handling Example
```typescript
const handleApiCall = async (apiFunction: () => Promise<any>) => {
  try {
    const result = await apiFunction();
    return result;
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Redirect to login
      router.push('/login');
    } else if (error.response?.status === 403) {
      // Show permission denied message
      toast.error('You do not have permission to perform this action');
    } else if (error.response?.data?.errors) {
      // Handle validation errors
      error.response.data.errors.forEach((err: any) => {
        toast.error(`${err.field}: ${err.message}`);
      });
    } else {
      // Generic error handling
      toast.error(error.response?.data?.message || 'An error occurred');
    }
    throw error;
  }
};
```

---

## 📱 Frontend Authentication Flow

### 1. Initial App Load
```typescript
// Check if user is authenticated on app startup
useEffect(() => {
  const checkAuth = async () => {
    try {
      const response = await apiClient.getProfile();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      // User not authenticated, redirect to login if needed
    }
  };
  
  checkAuth();
}, []);
```

### 2. Login Process
```typescript
const handleLogin = async (email: string, password: string) => {
  try {
    const response = await apiClient.login({ email, password });
    if (response.success) {
      // Cookie is set automatically
      setUser(response.data.user);
      router.push('/dashboard');
    }
  } catch (error) {
    setError(error.message);
  }
};
```

### 3. Making Authenticated Requests
```typescript
// All requests automatically include the cookie
const fetchUserData = async () => {
  const purchases = await apiClient.getMyPurchases();
  const downloads = await apiClient.getMyDownloads();
  const profile = await apiClient.getProfile();
};
```

### 4. Logout Process
```typescript
const handleLogout = async () => {
  try {
    await apiClient.logout();
    // Cookie is cleared automatically
    setUser(null);
    router.push('/login');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
```

---

## 📝 TypeScript Interfaces

```typescript
// User Types
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: 'customer' | 'admin';
  profileImage?: string;
}

interface LoginData {
  email: string;
  password: string;
}

// Category Types
interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateCategoryData {
  name: string;
  description: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

// Design Types
interface Design {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  tags: string[];
  images: string[];
  files: string[];
  requirements?: string;
  license?: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

interface CreateDesignData {
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  images: string[];
  files: string[];
  requirements?: string;
  license?: string;
  status: 'Active' | 'Inactive';
}

interface DesignQueryParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: 'Active' | 'Inactive';
}

// Pricing Plan Types
interface PricingPlan {
  _id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  duration: string;
  maxDesigns: number;
  maxDownloads: number;
  priority: number;
  isActive: boolean;
  discountPercentage?: number;
  validUntil?: Date;
  createdAt: string;
  updatedAt: string;
}

interface PricingPlanQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isActive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

// Purchase Types
interface Purchase {
  _id: string;
  user: User;
  purchaseType: 'individual' | 'subscription';
  design?: Design;
  pricingPlan?: PricingPlan;
  status: 'pending' | 'active' | 'cancelled' | 'expired';
  paymentMethod: 'credit_card' | 'paypal' | 'stripe';
  paymentDetails: object;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalAmount: number;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  notes?: string;
  purchaseDate: Date;
  createdAt: string;
  updatedAt: string;
}

interface PurchaseData {
  purchaseType: 'individual' | 'subscription';
  design?: string;
  pricingPlan?: string;
  paymentMethod: 'credit_card' | 'paypal' | 'stripe';
  paymentDetails: object;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
}

interface PurchaseQueryParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'active' | 'cancelled' | 'expired';
  purchaseType?: 'individual' | 'subscription';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Download Types
interface Download {
  _id: string;
  user: User;
  design: Design;
  purchase: Purchase;
  downloadType: 'individual' | 'subscription';
  downloadDate: Date;
  expiresAt: Date;
  createdAt: string;
}

interface DownloadQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Review Types
interface Review {
  _id: string;
  user: User;
  design: Design;
  rating: number;
  comment: string;
  title?: string;
  pros?: string[];
  cons?: string[];
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ReviewData {
  designId: string;
  rating: number;
  comment: string;
  title?: string;
  pros?: string[];
  cons?: string[];
}

interface UpdateReviewData {
  rating?: number;
  comment?: string;
  title?: string;
  pros?: string[];
  cons?: string[];
}

interface ReviewQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  rating?: number;
  minRating?: number;
  maxRating?: number;
  search?: string;
}

// API Response Types
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
```

---

## 🛡️ Security

### Authentication Security
- **HTTP-only Cookies**: Secure token storage, not accessible via JavaScript
- **CSRF Protection**: SameSite=strict cookie policy
- **Password Hashing**: bcrypt with configurable salt rounds
- **Token Expiration**: 1 day configurable lifetime
- **Role-based Access**: Admin/Customer permission levels

### Input Validation
- **Zod Schema Validation**: Type-safe input validation
- **SQL Injection Prevention**: MongoDB ODM protection
- **XSS Prevention**: Input sanitization
- **CORS Protection**: Configurable cross-origin policies

### Best Practices for Frontend
```typescript
// 1. Always use credentials: 'include'
fetch('/api/endpoint', {
  credentials: 'include',
  // ... other options
});

// 2. Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 3. Validate user permissions on frontend
const canAccessAdminFeatures = user?.role === 'admin';

// 4. Sanitize user input
const sanitizeInput = (input: string) => {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};
```

### Production Security Checklist
- [ ] Enable HTTPS
- [ ] Set secure cookie flags in production
- [ ] Implement rate limiting
- [ ] Regular security audits
- [ ] Keep dependencies updated
- [ ] Monitor for suspicious activity
- [ ] Implement proper logging
- [ ] Use environment variables for sensitive data

---

## 🚀 Deployment Notes

### Environment Variables
```bash
# Required Environment Variables
PORT=5000
DB_URI=mongodb://localhost:27017/ecommerce-design-platform
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
BCRYPT_SALT_ROUNDS=10
NODE_ENV=production
```

### CORS Configuration for Production
```typescript
app.use(cors({
  origin: [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
    // Add your production frontend URLs
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 200,
}));
```

### Cookie Security in Production
```typescript
res.cookie("token", token, {
  httpOnly: true,
  secure: true, // HTTPS only in production
  sameSite: "strict",
  maxAge: 1000 * 60 * 60 * 24, // 1 day
});
```

---

## 📞 Support and Contact

For API support and documentation updates, please contact:
- **Developer**: Rimon Hossain
- **Repository**: [Selling-porfolio-design-backend](https://github.com/md-rimon-hossain/Selling-porfolio-design-backend)
- **Branch**: rimon

---

*This documentation is generated based on the actual codebase and reflects the current API implementation. Last updated: October 14, 2025*