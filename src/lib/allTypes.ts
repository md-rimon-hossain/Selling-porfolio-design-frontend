export interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Design {
  _id: string;
  title: string;
  category: Category;
  description: string;
  previewImageUrl?: string;
  designerName?: string;
  usedTools?: string[];
  effectsUsed?: string[];
  processDescription?: string;
  complexityLevel?: string;
  status: "Active" | "Inactive";
  price: number;
  tags: string[];
  likesCount: number;
  downloadCount: number;
  avgRating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
}
