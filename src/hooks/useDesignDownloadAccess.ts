// Helper hook to check if user can download a design
import { useAppSelector } from "@/store/hooks";
import {
  useGetMyPurchasesQuery,
  useGetSubscriptionStatusQuery,
} from "@/services/api";
import { useMemo } from "react";
import { Purchase, SubscriptionStatus } from "@/types/dashboard";

export interface DownloadAccess {
  canDownload: boolean;
  reason: "purchased" | "subscription" | "no_access";
  status?: "completed" | "pending";
  message: string;
}

export const useDesignDownloadAccess = (
  designId: string
): {
  access: DownloadAccess;
  isLoading: boolean;
  refetch: () => void;
} => {
  const user = useAppSelector((state) => state.auth.user);

  // Fetch user's purchases
  const {
    data: purchasesData,
    isLoading: purchasesLoading,
    refetch: refetchPurchases,
  } = useGetMyPurchasesQuery({ limit: 100 }, { skip: !user });

  // Fetch subscription status
  const {
    data: subscriptionData,
    isLoading: subscriptionLoading,
    refetch: refetchSubscription,
  } = useGetSubscriptionStatusQuery(undefined, { skip: !user });

  const access = useMemo((): DownloadAccess => {
    if (!user) {
      return {
        canDownload: false,
        reason: "no_access",
        message: "Please login to download designs",
      };
    }

    // Check if user has purchased this specific design
    const purchases = (purchasesData?.data || []) as Purchase[];

    const hasPurchased = purchases.some(
      (purchase: Purchase) =>
        purchase.purchaseType === "individual" &&
        purchase.design?._id === designId &&
        (purchase.status === "completed" || purchase.status === "pending")
    );

    if (hasPurchased) {
      const purchaseStatus = purchases.find(
        (purchase) =>
          purchase.purchaseType === "individual" &&
          purchase.design?._id === designId
      )?.status as "completed" | "pending";

      return {
        canDownload: purchaseStatus === "completed",
        reason: "purchased",
        status: purchaseStatus,
        message: `Design purchased (${purchaseStatus})`,
      };
    }

    // Check if user has active subscription
    const subStatus = subscriptionData?.data as SubscriptionStatus | undefined;

    if (subStatus?.hasActiveSubscription) {
      const remaining = subStatus?.downloadStats?.remainingDownloads ?? 0;
      if (remaining === -1 || remaining > 0) {
        return {
          canDownload: true,
          reason: "subscription",
          status: "completed",
          message:
            remaining === -1
              ? "Unlimited downloads with your subscription"
              : `${remaining} downloads remaining`,
        };
      }
    }

    return {
      canDownload: false,
      reason: "no_access",
      message: "Purchase this design or subscribe to download",
    };
  }, [user, designId, purchasesData, subscriptionData]);

  return {
    access,
    isLoading: purchasesLoading || subscriptionLoading,
    refetch: () => {
      refetchPurchases();
      refetchSubscription();
    },
  };
};
