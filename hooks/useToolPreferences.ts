"use client";

import { useState, useEffect, useCallback } from "react";

const FAVORITES_KEY = "pocket_tools_favorites";
const RECENTS_KEY = "pocket_tools_recents";
const MAX_RECENTS = 10;

export function useToolPreferences() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedFavs = localStorage.getItem(FAVORITES_KEY);
      const storedRecents = localStorage.getItem(RECENTS_KEY);

      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      }
      if (storedRecents) {
        setRecents(JSON.parse(storedRecents));
      }
    } catch {
      // Ignore localStorage errors in private browsing
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const toggleFavorite = useCallback((toolId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(toolId)
        ? prev.filter((id) => id !== toolId)
        : [...prev, toolId];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (toolId: string) => favorites.includes(toolId),
    [favorites]
  );

  const addRecent = useCallback((toolId: string) => {
    setRecents((prev) => {
      // Remove if already present, then prepend to top
      const filtered = prev.filter((id) => id !== toolId);
      const next = [toolId, ...filtered].slice(0, MAX_RECENTS);
      try {
        localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return {
    favorites,
    recents,
    isLoaded,
    toggleFavorite,
    isFavorite,
    addRecent,
  };
}
