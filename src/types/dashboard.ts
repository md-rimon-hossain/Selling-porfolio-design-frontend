// Additional types for dashboard and downloads

export interface Purchase {
  _id: string;
  purchaseType: "individual" | "subscription";
  design?: {
    _id: string;
    title: string;
    description?: string;
    previewImageUrl?: string;
    category?: {
      _id: string;
      name: string;
    };
    createdAt: string;
  };
  pricingPlan?: {
    _id: string;
    name: string;
  };
  status: "pending" | "completed" | "expired" | "cancelled" | "refunded";
  amount: number;
  createdAt: string;
  expiresAt?: string;
}

export interface DownloadRecord {
  _id: string;
  design: {
    _id: string;
    title: string;
    description?: string;
    previewImageUrl?: string;
    category?: {
      _id: string;
      name: string;
    };
  };
  downloadType: "individual_purchase" | "subscription";
  createdAt: string;
}

export interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  remainingDownloads: number;
  currentPlan?: {
    _id: string;
    name: string;
    duration: string;
  };
}

export interface DesignForDownload {
  _id: string;
  title: string;
  description: string;
  previewImageUrl?: string;
  category?: {
    _id: string;
    name: string;
  };
  price: number;
  status: string;
  createdAt: string;
}
