import { MobileProduct, BrandCategory, MobileSpecs } from "@/core/entities/mobile.entity";
import { Result, ResultFactory } from "@/core/errors/app-error";

// Raw response structure returned by DummyJSON Smartphones API
interface DummyJsonProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
}

interface DummyJsonResponse {
  products: DummyJsonProduct[];
}

const API_ENDPOINT = "https://dummyjson.com/products/category/smartphones";

// Normalize brand string into strongly-typed BrandCategory
function normalizeBrand(rawBrand?: string, title?: string): Exclude<BrandCategory, "All"> {
  const source = `${rawBrand ?? ""} ${title ?? ""}`.toLowerCase();
  if (source.includes("apple") || source.includes("iphone")) return "Apple";
  if (source.includes("samsung") || source.includes("galaxy")) return "Samsung";
  if (source.includes("oppo")) return "Oppo";
  if (source.includes("realme")) return "Realme";
  return "Vivo";
}

// Deterministically enrich raw API data with detailed hardware specs based on product ID and price
function generateHardwareSpecs(id: number, brand: Exclude<BrandCategory, "All">, price: number): MobileSpecs {
  const isApple = brand === "Apple";
  const ramPool: MobileSpecs["ramGb"][] = price > 800 ? [8, 12, 16] : [4, 6, 8];
  const storagePool: MobileSpecs["storageGb"][] = price > 800 ? [256, 512, 1024] : [64, 128, 256];

  return {
    processor: isApple
      ? price > 900 ? "Apple A17 Pro Bionic" : "Apple A15 Bionic"
      : price > 700 ? "Snapdragon 8 Gen 3" : "Dimensity 8200 Ultra",
    ramGb: ramPool[id % ramPool.length],
    storageGb: storagePool[id % storagePool.length],
    displaySizeInch: Number((6.1 + (id % 7) * 0.1).toFixed(1)),
    refreshRateHz: price > 600 ? 120 : 90,
    batteryMah: 4500 + (id % 6) * 150,
    cameraMp: price > 800 ? 108 : 50,
    os: isApple ? "iOS" : "Android",
    is5G: price > 350 || id % 2 === 0,
  };
}

export class MobileRepository {
  // Fetch all smartphones with error handling and caching support
  public static async fetchAllMobiles(): Promise<Result<MobileProduct[]>> {
    try {
      const response = await fetch(API_ENDPOINT, {
        next: { revalidate: 3600 }, // Cache for 1 hour to maximize Next.js performance
      });

      if (!response.ok) {
        return ResultFactory.failure(
          `Failed to fetch mobiles from server (Status: ${response.status})`,
          "NETWORK_ERROR",
          response.status
        );
      }

      const data: DummyJsonResponse = await response.json();

      if (!data.products || !Array.isArray(data.products)) {
        return ResultFactory.failure("Invalid data format received from API", "VALIDATION_ERROR");
      }

      // Map raw API items to clean Domain Entities
      const mappedProducts: MobileProduct[] = data.products.map((raw) => {
        const brand = normalizeBrand(raw.brand, raw.title);
        const discountedPrice = Math.round(raw.price * (1 - raw.discountPercentage / 100));

        return {
          id: raw.id,
          title: raw.title,
          brand,
          description: raw.description,
          price: raw.price,
          discountPercentage: raw.discountPercentage,
          discountedPrice,
          rating: raw.rating,
          stock: raw.stock,
          thumbnail: raw.thumbnail,
          images: raw.images?.length ? raw.images : [raw.thumbnail],
          specs: generateHardwareSpecs(raw.id, brand, raw.price),
        };
      });

      return ResultFactory.success(mappedProducts);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network connection failed";
      return ResultFactory.failure(message, "NETWORK_ERROR");
    }
  }
}