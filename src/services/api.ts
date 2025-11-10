/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/store/store";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    credentials: "include", // sends httpOnly cookies
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux store (for OAuth users)
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Users",
    "Categories",
    "Designs",
    "PricingPlans",
    "Purchases",
    "Reviews",
    "Downloads",
    "Likes",
    "Payments",
  ],
  endpoints: (builder) => ({
    // ==================== AUTH ====================
    getProfile: builder.query<any, void>({
      query: () => "/users/myProfile",
      providesTags: ["User"],
    }),
    login: builder.mutation<any, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation<
      any,
      {
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
        role?: "admin" | "customer";
      }
    >({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    logout: builder.mutation<any, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: [
        "User",
        "Categories",
        "Designs",
        "PricingPlans",
        "Purchases",
        "Reviews",
        "Downloads",
      ],
      // Clear all API cache on logout
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Reset API state completely
          dispatch(api.util.resetApiState());
        } catch {
          // Even if logout fails on backend, still reset API state
          dispatch(api.util.resetApiState());
        }
      },
    }),

    // ==================== USERS ====================
    getAllUsers: builder.query<
      any,
      {
        role?: "admin" | "customer";
        isActive?: boolean;
        search?: string;
        page?: number;
        limit?: number;
        sortBy?: "name" | "email" | "createdAt" | "updatedAt";
        sortOrder?: "asc" | "desc";
      }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.role) searchParams.append("role", params.role);
        if (params.isActive !== undefined)
          searchParams.append("isActive", params.isActive.toString());
        if (params.search) searchParams.append("search", params.search);
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.sortBy) searchParams.append("sortBy", params.sortBy);
        if (params.sortOrder)
          searchParams.append("sortOrder", params.sortOrder);
        return `/users?${searchParams.toString()}`;
      },
      providesTags: ["Users"],
    }),
    getUser: builder.query<any, string>({
      query: (id) => `/users/${id}`,
      providesTags: ["Users"],
    }),
    updateUser: builder.mutation<
      any,
      { id: string; name?: string; email?: string; profileImage?: string }
    >({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users", "User"],
    }),
    deleteUser: builder.mutation<any, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    changePassword: builder.mutation<
      any,
      {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
      }
    >({
      query: (data) => ({
        url: "/users/change-password",
        method: "PUT",
        body: data,
      }),
    }),

    // ==================== CATEGORIES ====================
    getCategories: builder.query<any, void>({
      query: () => "/categories",
      providesTags: ["Categories"],
    }),
    getCategory: builder.query<any, string>({
      query: (id) => `/categories/${id}`,
      providesTags: ["Categories"],
    }),
    createCategory: builder.mutation<
      any,
      { name: string; description: string; isActive?: boolean }
    >({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation<
      any,
      {
        id: string;
        name: string;
        description: string;
        parentCategory: string | null;
        isActive?: boolean;
      }
    >({
      query: ({ id, ...data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation<any, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),

    // ==================== DESIGNS ====================
    getDesigns: builder.query<
      any,
      | {
          mainCategory?: string;
          subCategory?: string;
          complexityLevel?: string;
          status?: string;
          minPrice?: number;
          maxPrice?: number;
          search?: string;
          page?: number;
          limit?: number;
        }
      | undefined
    >({
      query: (params) => {
        if (!params) return "/designs";

        const searchParams = new URLSearchParams();

        if (params.mainCategory)
          searchParams.append("mainCategory", params.mainCategory);
        if (params.subCategory)
          searchParams.append("subCategory", params.subCategory);
        if (params.complexityLevel)
          searchParams.append("complexityLevel", params.complexityLevel);
        if (params.status) searchParams.append("status", params.status);
        if (params.search) searchParams.append("search", params.search);
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.minPrice !== undefined)
          searchParams.append("minPrice", params.minPrice.toString());
        if (params.maxPrice !== undefined)
          searchParams.append("maxPrice", params.maxPrice.toString());

        return `/designs?${searchParams.toString()}`;
      },
      providesTags: ["Designs"],
    }),
    getDesign: builder.query<any, string>({
      query: (id) => `/designs/${id}`,
      providesTags: ["Designs"],
    }),
    createDesign: builder.mutation<any, any>({
      query: (data) => ({
        url: "/designs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Designs"],
    }),
    updateDesign: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/designs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Designs"],
    }),
    deleteDesign: builder.mutation<any, string>({
      query: (id) => ({
        url: `/designs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Designs"],
    }),

    // ==================== PRICING PLANS ====================
    getPricingPlans: builder.query<
      any,
      | {
          page?: number;
          limit?: number;
          sortBy?: string;
          sortOrder?: "asc" | "desc";
          isActive?: boolean;
          minPrice?: number;
          maxPrice?: number;
          search?: string;
        }
      | undefined
    >({
      query: (params) => {
        if (!params) return "/pricing-plans";

        const searchParams = new URLSearchParams();

        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.sortBy) searchParams.append("sortBy", params.sortBy);
        if (params.sortOrder)
          searchParams.append("sortOrder", params.sortOrder);
        if (params.isActive !== undefined)
          searchParams.append("isActive", params.isActive.toString());
        if (params.minPrice !== undefined)
          searchParams.append("minPrice", params.minPrice.toString());
        if (params.maxPrice !== undefined)
          searchParams.append("maxPrice", params.maxPrice.toString());
        if (params.search) searchParams.append("search", params.search);

        return `/pricing-plans?${searchParams.toString()}`;
      },
      providesTags: ["PricingPlans"],
    }),
    getActivePricingPlans: builder.query<any, void>({
      query: () => "/pricing-plans/active",
      providesTags: ["PricingPlans"],
    }),
    getPricingPlan: builder.query<any, string>({
      query: (id) => `/pricing-plans/${id}`,
      providesTags: ["PricingPlans"],
    }),
    createPricingPlan: builder.mutation<any, any>({
      query: (data) => ({
        url: "/pricing-plans",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PricingPlans"],
    }),
    updatePricingPlan: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/pricing-plans/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["PricingPlans"],
    }),
    deletePricingPlan: builder.mutation<
      any,
      { id: string; permanent?: boolean }
    >({
      query: ({ id, permanent }) => ({
        url: `/pricing-plans/${id}${permanent ? "?permanent=true" : ""}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PricingPlans"],
    }),
    getPricingPlanAnalytics: builder.query<
      any,
      {
        period?: "daily" | "weekly" | "monthly" | "yearly";
        startDate?: string;
        endDate?: string;
      }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.period) searchParams.append("period", params.period);
        if (params.startDate)
          searchParams.append("startDate", params.startDate);
        if (params.endDate) searchParams.append("endDate", params.endDate);
        return `/pricing-plans/analytics/overview?${searchParams.toString()}`;
      },
    }),

    // ==================== PURCHASES ====================
    createPurchase: builder.mutation<
      any,
      {
        purchaseType: "individual" | "subscription";
        design?: string;
        course?: string;
        pricingPlan?: string;
        paymentMethod:
          | "credit_card"
          | "paypal"
          | "stripe"
          | "bank_transfer"
          | "free"
          | "bkash"
          | "nagad"
          | "rocket";
        // transaction id provided by user for MFS payments
        userProvidedTransactionId?: string;
        paymentDetails?:
          | Record<string, unknown>
          | {
              cardNumber?: string;
              expiryDate?: string;
              cvv?: string;
              cardholderName?: string;
            };
        currency?: string;
        billingAddress: {
          street: string;
          city: string;
          state: string;
          zipCode: string;
          country: string;
        };
        notes?: string;
      }
    >({
      query: (purchaseData) => ({
        url: "/purchases",
        method: "POST",
        body: purchaseData,
      }),
      invalidatesTags: ["Purchases", "Downloads"],
    }),
    getAllPurchases: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        sortBy?: "purchaseDate" | "createdAt" | "updatedAt";
        sortOrder?: "asc" | "desc";
        status?: "pending" | "completed" | "expired" | "cancelled" | "refunded";
        paymentMethod?:
          | "credit_card"
          | "paypal"
          | "stripe"
          | "bank_transfer"
          | "free"
          | "bkash"
          | "nagad"
          | "rocket";
        minAmount?: number;
        maxAmount?: number;
        startDate?: string;
        endDate?: string;
        search?: string;
        purchaseType?: "individual" | "subscription";
      }
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.sortBy) searchParams.append("sortBy", params.sortBy);
        if (params.sortOrder)
          searchParams.append("sortOrder", params.sortOrder);
        if (params.status) searchParams.append("status", params.status);
        if (params.paymentMethod)
          searchParams.append("paymentMethod", params.paymentMethod);
        if (params.minAmount !== undefined)
          searchParams.append("minAmount", params.minAmount.toString());
        if (params.maxAmount !== undefined)
          searchParams.append("maxAmount", params.maxAmount.toString());
        if (params.startDate)
          searchParams.append("startDate", params.startDate);
        if (params.endDate) searchParams.append("endDate", params.endDate);
        if (params.search) searchParams.append("search", params.search);
        if (params.purchaseType)
          searchParams.append("purchaseType", params.purchaseType);
        return `/purchases?${searchParams.toString()}`;
      },
      providesTags: ["Purchases"],
    }),
    getMyPurchases: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        sortBy?: "purchaseDate" | "createdAt" | "updatedAt";
        sortOrder?: "asc" | "desc";
        status?: "pending" | "completed" | "expired" | "cancelled" | "refunded";
        purchaseType?: "individual" | "subscription";
      }
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.sortBy) searchParams.append("sortBy", params.sortBy);
        if (params.sortOrder)
          searchParams.append("sortOrder", params.sortOrder);
        if (params.status) searchParams.append("status", params.status);
        if (params.purchaseType)
          searchParams.append("purchaseType", params.purchaseType);
        return `/purchases/my-purchases?${searchParams.toString()}`;
      },
      providesTags: ["Purchases"],
    }),
    getPurchase: builder.query<any, string>({
      query: (id) => `/purchases/${id}`,
      providesTags: ["Purchases"],
    }),
    updatePurchaseStatus: builder.mutation<
      any,
      {
        id: string;
        status: "pending" | "completed" | "expired" | "cancelled" | "refunded";
        adminNotes?: string;
      }
    >({
      query: ({ id, ...data }) => ({
        url: `/purchases/${id}/status`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Purchases"],
    }),
    cancelPurchase: builder.mutation<
      any,
      { id: string; cancelReason?: string }
    >({
      query: ({ id, cancelReason }) => ({
        url: `/purchases/${id}`,
        method: "DELETE",
        body: { cancelReason },
      }),
      invalidatesTags: ["Purchases"],
    }),
    checkSubscriptionEligibility: builder.query<any, void>({
      query: () => "/purchases/subscription-eligibility",
    }),
    getPurchaseAnalytics: builder.query<
      any,
      {
        period?: "daily" | "weekly" | "monthly" | "yearly";
        startDate?: string;
        endDate?: string;
        designId?: string;
      }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.period) searchParams.append("period", params.period);
        if (params.startDate)
          searchParams.append("startDate", params.startDate);
        if (params.endDate) searchParams.append("endDate", params.endDate);
        if (params.designId) searchParams.append("designId", params.designId);
        return `/purchases/analytics?${searchParams.toString()}`;
      },
    }),

    // ==================== REVIEWS ====================
    getReviews: builder.query<
      any,
      { page?: number; limit?: number } | undefined
    >({
      query: (params) => {
        if (!params) return "/reviews";
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        return `/reviews?${searchParams.toString()}`;
      },
      providesTags: ["Reviews"],
    }),
    getDesignReviews: builder.query<
      any,
      { designId: string; page?: number; limit?: number }
    >({
      query: ({ designId, page, limit }) => {
        const searchParams = new URLSearchParams();
        if (page) searchParams.append("page", page.toString());
        if (limit) searchParams.append("limit", limit.toString());
        return `/reviews/design/${designId}?${searchParams.toString()}`;
      },
      providesTags: ["Reviews"],
    }),
    getReview: builder.query<any, string>({
      query: (id) => `/reviews/${id}`,
      providesTags: ["Reviews"],
    }),
    createReview: builder.mutation<
      any,
      {
        designId: string;
        rating: number;
        comment: string;
      }
    >({
      query: (data) => ({
        url: "/reviews",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Reviews"],
    }),
    updateReview: builder.mutation<
      any,
      {
        id: string;
        rating?: number;
        comment?: string;
        pros?: string[];
        cons?: string[];
      }
    >({
      query: ({ id, ...data }) => ({
        url: `/reviews/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Reviews"],
    }),
    deleteReview: builder.mutation<any, string>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),
    markReviewHelpful: builder.mutation<
      any,
      { id: string; isHelpful: boolean }
    >({
      query: ({ id, isHelpful }) => ({
        url: `/reviews/${id}/helpful`,
        method: "PUT",
        body: { isHelpful },
      }),
      invalidatesTags: ["Reviews"],
    }),
    getReviewAnalytics: builder.query<
      any,
      { period?: string; designId?: string }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.period) searchParams.append("period", params.period);
        if (params.designId) searchParams.append("designId", params.designId);
        return `/reviews/analytics/overview?${searchParams.toString()}`;
      },
    }),

    // ==================== DOWNLOADS ====================
    getMyDownloads: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        sortBy?: "downloadDate" | "createdAt";
        sortOrder?: "asc" | "desc";
        downloadType?: "individual_purchase" | "subscription";
      }
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.sortBy) searchParams.append("sortBy", params.sortBy);
        if (params.sortOrder)
          searchParams.append("sortOrder", params.sortOrder);
        if (params.downloadType)
          searchParams.append("downloadType", params.downloadType);
        return `/downloads/my-downloads?${searchParams.toString()}`;
      },
      providesTags: ["Downloads"],
    }),
    getSubscriptionStatus: builder.query<any, void>({
      query: () => "/downloads/subscription-status",
      providesTags: ["Downloads"],
    }),
    downloadDesign: builder.mutation<any, string>({
      query: (designId) => ({
        url: `/downloads/design/${designId}`,
        method: "POST",
        responseHandler: (response) => response.blob(), // Return blob directly
      }),
      invalidatesTags: ["Downloads"],
    }),
    getDownloadAnalytics: builder.query<
      any,
      { period?: string; startDate?: string; endDate?: string }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.period) searchParams.append("period", params.period);
        if (params.startDate)
          searchParams.append("startDate", params.startDate);
        if (params.endDate) searchParams.append("endDate", params.endDate);
        return `/downloads/analytics?${searchParams.toString()}`;
      },
    }),
    getAllDownloads: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        sortBy?: "downloadDate" | "createdAt";
        sortOrder?: "asc" | "desc";
        downloadType?: "individual_purchase" | "subscription";
        userId?: string;
        designId?: string;
        search?: string;
        startDate?: string;
        endDate?: string;
      }
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.sortBy) searchParams.append("sortBy", params.sortBy);
        if (params.sortOrder)
          searchParams.append("sortOrder", params.sortOrder);
        if (params.downloadType)
          searchParams.append("downloadType", params.downloadType);
        if (params.userId) searchParams.append("userId", params.userId);
        if (params.designId) searchParams.append("designId", params.designId);
        if (params.search) searchParams.append("search", params.search);
        if (params.startDate)
          searchParams.append("startDate", params.startDate);
        if (params.endDate) searchParams.append("endDate", params.endDate);
        return `/downloads?${searchParams.toString()}`;
      },
      providesTags: ["Downloads"],
    }),

    // ==================== LIKES ====================
    toggleLike: builder.mutation<any, string>({
      query: (designId) => ({
        url: `/likes/${designId}`,
        method: "POST",
      }),
      invalidatesTags: ["Likes"],
      // Note: Removed Designs tag invalidation and optimistic update
      // to prevent double counting. Optimistic updates are now handled
      // in the useLike hook for better control.
    }),
    getMyLikes: builder.query<any, { page?: number; limit?: number }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        return `/likes/my-likes?${searchParams.toString()}`;
      },
      providesTags: ["Likes"],
    }),
    checkIfLiked: builder.query<any, string>({
      query: (designId) => `/likes/${designId}/check`,
      providesTags: (result, error, designId) => [
        { type: "Likes", id: designId },
      ],
    }),
    getDesignLikers: builder.query<
      any,
      { designId: string; page?: number; limit?: number }
    >({
      query: ({ designId, page, limit }) => {
        const searchParams = new URLSearchParams();
        if (page) searchParams.append("page", page.toString());
        if (limit) searchParams.append("limit", limit.toString());
        return `/likes/${designId}/likers?${searchParams.toString()}`;
      },
      providesTags: (result, error, { designId }) => [
        { type: "Likes", id: `${designId}-likers` },
      ],
    }),

    // ==================== STRIPE PAYMENTS ====================
    createPaymentIntent: builder.mutation<
      any,
      {
        productType: "design" | "course" | "subscription";
        productId: string;
        currency?: string;
      }
    >({
      query: (data) => ({
        url: "/payments/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payments"],
    }),
    getPaymentStatus: builder.query<any, string>({
      query: (paymentIntentId) => `/payments/status/${paymentIntentId}`,
      providesTags: (result, error, id) => [{ type: "Payments", id }],
    }),
    getUserPayments: builder.query<
      any,
      { page?: number; limit?: number } | undefined
    >({
      query: (params) => {
        if (!params) return "/payments/my-payments";
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        return `/payments/my-payments?${searchParams.toString()}`;
      },
      providesTags: ["Payments"],
    }),
    getAllPaymentsAdmin: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        status?: "pending" | "succeeded" | "failed" | "canceled" | "refunded";
        productType?: "design" | "course" | "subscription";
        userId?: string;
        startDate?: string;
        endDate?: string;
        sortBy?: "createdAt" | "amount" | "status";
        sortOrder?: "asc" | "desc";
      }
    >({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.status) searchParams.append("status", params.status);
        if (params.productType)
          searchParams.append("productType", params.productType);
        if (params.userId) searchParams.append("userId", params.userId);
        if (params.startDate)
          searchParams.append("startDate", params.startDate);
        if (params.endDate) searchParams.append("endDate", params.endDate);
        if (params.sortBy) searchParams.append("sortBy", params.sortBy);
        if (params.sortOrder)
          searchParams.append("sortOrder", params.sortOrder);
        return `/payments/admin/all?${searchParams.toString()}`;
      },
      providesTags: ["Payments"],
    }),
    getPaymentStatisticsAdmin: builder.query<
      any,
      { startDate?: string; endDate?: string } | undefined
    >({
      query: (params) => {
        if (!params) return "/payments/admin/statistics";
        const searchParams = new URLSearchParams();
        if (params.startDate)
          searchParams.append("startDate", params.startDate);
        if (params.endDate) searchParams.append("endDate", params.endDate);
        return `/payments/admin/statistics?${searchParams.toString()}`;
      },
      providesTags: ["Payments"],
    }),
    refundPayment: builder.mutation<
      any,
      {
        paymentIntentId: string;
        amount?: number;
        reason?: string;
      }
    >({
      query: (data) => ({
        url: "/payments/refund",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payments", "Purchases"],
    }),
  }),
});

export const {
  // Auth
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  // Users
  useGetAllUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangePasswordMutation,
  // Categories
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  // Designs
  useGetDesignsQuery,
  useGetDesignQuery,
  useCreateDesignMutation,
  useUpdateDesignMutation,
  useDeleteDesignMutation,
  // Pricing Plans
  useGetPricingPlansQuery,
  useGetActivePricingPlansQuery,
  useGetPricingPlanQuery,
  useCreatePricingPlanMutation,
  useUpdatePricingPlanMutation,
  useDeletePricingPlanMutation,
  useGetPricingPlanAnalyticsQuery,
  // Purchases
  useCreatePurchaseMutation,
  useGetAllPurchasesQuery,
  useGetMyPurchasesQuery,
  useGetPurchaseQuery,
  useUpdatePurchaseStatusMutation,
  useCancelPurchaseMutation,
  useCheckSubscriptionEligibilityQuery,
  useGetPurchaseAnalyticsQuery,
  // Reviews
  useGetReviewsQuery,
  useGetDesignReviewsQuery,
  useGetReviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useMarkReviewHelpfulMutation,
  useGetReviewAnalyticsQuery,
  // Downloads
  useGetMyDownloadsQuery,
  useGetSubscriptionStatusQuery,
  useDownloadDesignMutation,
  useGetDownloadAnalyticsQuery,
  useGetAllDownloadsQuery,
  // Likes
  useToggleLikeMutation,
  useGetMyLikesQuery,
  useCheckIfLikedQuery,
  useGetDesignLikersQuery,
  // Stripe Payments
  useCreatePaymentIntentMutation,
  useGetPaymentStatusQuery,
  useGetUserPaymentsQuery,
  useGetAllPaymentsAdminQuery,
  useGetPaymentStatisticsAdminQuery,
  useRefundPaymentMutation,
} = api;
