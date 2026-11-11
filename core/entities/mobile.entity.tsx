// Distinct brand categories for primary navigation
export type BrandCategory = "All" | "Apple" | "Samsung" | "Oppo" | "Realme" | "Vivo";

// Detailed hardware specifications for each mobile device
export interface MobileSpecs {
  processor: string;
  ramGb: 4 | 6 | 8 | 12 | 16;
  storageGb: 64 | 128 | 256 | 512 | 1024;
  displaySizeInch: number;
  refreshRateHz: 60 | 90 | 120 | 144;
  batteryMah: number;
  cameraMp: number;
  os: "iOS" | "Android";
  is5G: boolean;
}

// Core Mobile Entity representing a product in the store
export interface MobileProduct {
  id: number;
  title: string;
  brand: Exclude<BrandCategory, "All">;
  description: string;
  price: number;
  discountPercentage: number;
  discountedPrice: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
  specs: MobileSpecs;
}

// Filter criteria (distinct from high-level Category browsing)
export interface MobileFilterCriteria {
  searchQuery?: string;
  category?: BrandCategory;
  minPrice?: number;
  maxPrice?: number;
  ramOptions?: number[];
  storageOptions?: number[];
  only5G?: boolean;
  onlyInStock?: boolean;
  sortBy?: "price-asc" | "price-desc" | "rating-desc";
}

// Shopping Cart Item Entity (includes 'selected' flag for bulk removal)
export interface CartItem {
  product: MobileProduct;
  quantity: number;
  selectedForRemoval: boolean;
}

// Overall Shopping Cart State
export interface CartState {
  items: CartItem[];
  totalItemsCount: number;
  totalOriginalPrice: number;
  totalPayablePrice: number;
}