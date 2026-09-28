"use client";

import { useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

export function useShareableUrl(params: Record<string, string | number | boolean>) {
  const searchParams = useSearchParams();

  // Read initial param from URL
  const getInitialParam = useCallback(
    (key: string, fallback: string): string => {
      const val = searchParams.get(key);
      return val !== null && val !== undefined && val !== "" ? val : fallback;
    },
    [searchParams]
  );

  // Sync state to URL without reloading page
  useEffect(() => {
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        url.searchParams.set(key, String(val));
      } else {
        url.searchParams.delete(key);
      }
    });

    window.history.replaceState(null, "", url.toString());
  }, [params]);

  return { getInitialParam };
}
