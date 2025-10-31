export interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface IDownloadableFile {
  /** The unique ID assigned by the cloud storage (Cloudinary public_id). */
  public_id: string;

  /** A secure identifier; the actual signed download URL is generated on demand. */
  secure_url: string;

  /** The format/extension of the source file (e.g., 'zip', 'psd', 'fig'). */
  file_format: string;

  /** The size of the file in bytes. */
  file_size: number;
}

export interface Design {
  _id?: string;
  title: string;
  // 💡 CHANGE 1: Rename the old field to mainCategory
  mainCategory: {
    _id: string;
    name: string;
    description: string;
  };
  // 💡 CHANGE 2: Add a new field for the subcategory
  subCategory: {
    _id: string;
    name: string;
    description: string;
  };
  /** To classify the product (e.g., "Logo", "UI Kit"). */
  designType: "Logo" | "Poster" | "UI Kit" | "Presentation" | "Other";
  
  description: string;
  /** A list of public URLs for images that showcase the design (gallery, mockups). */
  previewImageUrls: string[];
  designer: {
    _id: string;
    name: string;
  }; // Changed to ObjectId to reference User
  usedTools: string[];
  effectsUsed: string[];
  // 💡 Base Price (The original, non-sale price)
  basePrice: number;
  // 💡 Discounted Price (The final price if on sale, otherwise the same as basePrice, or null/undefined)
  discountedPrice?: number;
  currencyDisplay: string;
  currencyCode: string;
  /** Details for the primary secure, downloadable file (e.g., the ZIP file). */
  downloadableFile: IDownloadableFile;
  /** List of files/formats included in the main download (e.g., ["AI", "EPS", "PNG"]). */
  includedFormats: string[];
  processDescription: string;
  complexityLevel: "Basic" | "Intermediate" | "Advanced";
  tags: string[];
  status: "Active" | "Pending" | "Rejected" | "Inactive";
  isDeleted: boolean;
  likesCount: number;
  downloadCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}
