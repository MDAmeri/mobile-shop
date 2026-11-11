import { MobileProduct, MobileFilterCriteria } from "@/core/entities/mobile.entity";
import { Result, ResultFactory } from "@/core/errors/app-error";

// Query Object for filtering and searching mobiles
export class GetFilteredMobilesQuery {
  constructor(public readonly criteria: MobileFilterCriteria) {}
}

// Query Object for getting random featured mobiles on the landing page
export class GetRandomShowcaseQuery {
  constructor(public readonly count: number = 4) {}
}

export class MobileQueryHandler {
  // Execute filtering, category matching, and sorting logic cleanly
  public static executeFilterQuery(
    allMobiles: MobileProduct[],
    query: GetFilteredMobilesQuery
  ): Result<MobileProduct[]> {
    try {
      const {
        searchQuery,
        category,
        minPrice,
        maxPrice,
        ramOptions,
        storageOptions,
        only5G,
        onlyInStock,
        sortBy,
      } = query.criteria;

      let filtered = [...allMobiles];

      // 1. Apply Brand Category selection
      if (category && category !== "All") {
        filtered = filtered.filter((item) => item.brand === category);
      }

      // 2. Apply Search Query (matches title, brand, or processor)
      if (searchQuery && searchQuery.trim() !== "") {
        const normalizedSearch = searchQuery.trim().toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.title.toLowerCase().includes(normalizedSearch) ||
            item.brand.toLowerCase().includes(normalizedSearch) ||
            item.specs.processor.toLowerCase().includes(normalizedSearch)
        );
      }

      // 3. Apply Price Range Filter
      if (minPrice !== undefined) {
        filtered = filtered.filter((item) => item.discountedPrice >= minPrice);
      }
      if (maxPrice !== undefined) {
        filtered = filtered.filter((item) => item.discountedPrice <= maxPrice);
      }

      // 4. Apply Hardware Specs Filters (RAM, Storage, 5G, Stock)
      if (ramOptions && ramOptions.length > 0) {
        filtered = filtered.filter((item) => ramOptions.includes(item.specs.ramGb));
      }
      if (storageOptions && storageOptions.length > 0) {
        filtered = filtered.filter((item) => storageOptions.includes(item.specs.storageGb));
      }
      if (only5G) {
        filtered = filtered.filter((item) => item.specs.is5G);
      }
      if (onlyInStock) {
        filtered = filtered.filter((item) => item.stock > 0);
      }

      // 5. Apply Sorting
      if (sortBy === "price-asc") {
        filtered.sort((a, b) => a.discountedPrice - b.discountedPrice);
      } else if (sortBy === "price-desc") {
        filtered.sort((a, b) => b.discountedPrice - a.discountedPrice);
      } else if (sortBy === "rating-desc") {
        filtered.sort((a, b) => b.rating - a.rating);
      }

      return ResultFactory.success(filtered);
    } catch (error) {
      return ResultFactory.failure("Failed to execute filter query", "VALIDATION_ERROR");
    }
  }

  // Execute random selection for homepage dynamic showcase
  public static executeRandomShowcaseQuery(
    allMobiles: MobileProduct[],
    query: GetRandomShowcaseQuery
  ): Result<MobileProduct[]> {
    if (!allMobiles.length) {
      return ResultFactory.success([]);
    }
    const shuffled = [...allMobiles].sort(() => 0.5 - Math.random());
    return ResultFactory.success(shuffled.slice(0, query.count));
  }
}