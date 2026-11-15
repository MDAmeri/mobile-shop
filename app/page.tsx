import React from "react";
import { MobileRepository } from "@/infrastructure/api/mobile.repository";
import StoreClientShell from "@/components/layout/StoreClientShell";

// Next.js Server Component: Fetches mobile data on the server for optimal SEO and initial load speed
export default async function HomePage() {
  const result = await MobileRepository.fetchAllMobiles();

  return (
    <StoreClientShell
      initialMobiles={result.isSuccess ? result.data : []}
      serverError={result.isSuccess ? null : result.error.message}
    />
  );
}