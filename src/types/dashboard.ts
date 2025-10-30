// Additional types for dashboard and downloads

export interface Purchase {
  _id: string;
  purchaseType: "individual" | "subscription";
  design?: {
    _id: string;
    title: string;
    price: number;
  };
  
  pricingPlan?: {
    _id: string;
    name: string;
    description?: string;
    duration?: string;
  };
  status: "pending" | "completed" | "expired" | "cancelled" | "refunded";
  amount: number;
  createdAt: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  remainingDownloads?: number;
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
  subscription?: {
    _id: string;
    subscriptionEndDate: string;
    remainingDownloads: number;
    status: string;
    pricingPlan?: {
      name: string;
      description: string;
      features: string[];
      maxDownloads: number;
      duration: number;
    };
  };
  downloadStats?: {
    totalDownloaded: number;
    remainingDownloads: number;
    downloadLimitReached: boolean;
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
