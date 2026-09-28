"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { TOOLS, CATEGORIES, searchTools, getFeaturedTools } from "@/lib/constants/tools";
import { ToolIcon } from "@/components/shared/ToolIcon";
import { useToolPreferences } from "@/hooks/useToolPreferences";
import { Search, Star, Clock, ChevronRight, Sparkles, Layers, ShieldCheck, Zap } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Input } from "@/components/ui";

export function HomeClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { favorites, recents, isFavorite, toggleFavorite } = useToolPreferences();

  // Filtered tools based on search and category tab
  const filteredTools = useMemo(() => {
    let result = searchTools(searchQuery);
    if (selectedCategory !== "All") {
      result = result.filter(
        (t) => t.category.toLowerCase() === selectedCategory.toLowerCase() || t.categorySlug.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    return result;
  }, [searchQuery, selectedCategory]);

  // Favorite Tools
  const favoriteToolsList = useMemo(() => {
    return TOOLS.filter((t) => favorites.includes(t.id));
  }, [favorites]);

  // Recent Tools
  const recentToolsList = useMemo(() => {
    return recents
      .map((id) => TOOLS.find((t) => t.id === id))
      .filter((t): t is typeof TOOLS[0] => Boolean(t));
  }, [recents]);

  const featuredTools = useMemo(() => getFeaturedTools(), []);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-content mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-xs font-semibold text-accent mb-6 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Free • Client-Side • Privacy-First</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-text max-w-4xl mx-auto leading-[1.15]">
          Everything You Need, <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-primary via-[#00C2A8] to-primary bg-clip-text text-transparent">
            All in One Place.
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
          Fast, simple and free online tools for everyday calculations and utilities.
        </p>

        {/* Global Search Bar */}
        <div className="mt-8 max-w-xl mx-auto relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-text-muted select-none pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools by name, keyword (e.g. GST, EMI, BMI, Password)..."
              className="w-full h-14 pl-12 pr-4 rounded-full border-2 border-border bg-surface shadow-md text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 text-xs font-semibold text-text-muted hover:text-text px-2 py-1 bg-surface-secondary rounded-full"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
          {["All", ...CATEGORIES.map((c) => c.name)].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-surface text-text-secondary border-border hover:bg-surface-secondary hover:text-text"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Search Results / All Filtered Tools */}
      {searchQuery || selectedCategory !== "All" ? (
        <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text">
              {searchQuery ? `Search Results for "${searchQuery}"` : `${selectedCategory} Tools`}
            </h2>
            <span className="text-xs text-text-secondary">{filteredTools.length} tool(s) found</span>
          </div>

          {filteredTools.length === 0 ? (
            <div className="p-12 text-center rounded-card border border-dashed border-border bg-surface/50">
              <p className="text-sm font-medium text-text">No matching tools found.</p>
              <p className="text-xs text-text-secondary mt-1">Try searching for &quot;GST&quot;, &quot;Discount&quot;, &quot;Password&quot;, or &quot;Unit&quot;.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-4"
              >
                Reset Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFav={isFavorite(tool.id)}
                  onToggleFav={() => toggleFavorite(tool.id)}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* 3. Favorites Section (if any) */}
          {favoriteToolsList.length > 0 && (
            <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h2 className="text-xl font-bold text-text">Your Favorite Tools</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {favoriteToolsList.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isFav={true}
                    onToggleFav={() => toggleFavorite(tool.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 4. Recent Tools Section (if any) */}
          {recentToolsList.length > 0 && (
            <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-text">Recently Used</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentToolsList.slice(0, 4).map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/${tool.slug}`}
                    className="p-4 rounded-card border border-border bg-surface hover:border-primary/50 transition-all hover:shadow-sm flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-btn bg-primary-light text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <ToolIcon name={tool.icon} className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-semibold text-xs text-text truncate group-hover:text-primary transition-colors">
                        {tool.name}
                      </h4>
                      <span className="text-[11px] text-text-muted">{tool.category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 5. Featured / Popular Tools Grid */}
          <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-text">Popular Utility Tools</h2>
                <p className="text-xs text-text-secondary mt-0.5">Most frequently used calculators and converters</p>
              </div>
              <Link
                href="/calculators"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>View all {TOOLS.length} tools</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFav={isFavorite(tool.id)}
                  onToggleFav={() => toggleFavorite(tool.id)}
                />
              ))}
            </div>
          </section>

          {/* 6. Explore by Category */}
          <section id="categories" className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-text">Browse by Category</h2>
              <p className="text-xs text-text-secondary mt-0.5">Find calculators and converters grouped by purpose</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CATEGORIES.map((cat) => {
                const categoryTools = TOOLS.filter(
                  (t) => t.category.toLowerCase() === cat.name.toLowerCase()
                );
                return (
                  <div
                    key={cat.slug}
                    id={cat.slug}
                    className="p-5 rounded-card border border-border bg-surface flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-btn bg-primary-light text-primary flex items-center justify-center">
                          <ToolIcon name={cat.icon} className="w-5 h-5" />
                        </div>
                        <Badge variant="secondary">{categoryTools.length} Tools</Badge>
                      </div>
                      <h3 className="font-bold text-base text-text mb-1">{cat.name}</h3>
                      <p className="text-xs text-text-secondary leading-relaxed mb-4">
                        {cat.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-3 border-t border-border">
                      {categoryTools.map((t) => (
                        <Link
                          key={t.id}
                          href={`/${t.slug}`}
                          className="flex items-center justify-between py-1 px-2 rounded-md hover:bg-surface-secondary text-xs text-text hover:text-primary transition-colors group"
                        >
                          <span className="font-medium">{t.name}</span>
                          <ChevronRight className="w-3 h-3 text-text-muted group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 7. Why Pocket Tools Feature Banner */}
          <section className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div className="p-8 rounded-card border border-border bg-surface grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text">Instant In-Browser Execution</h4>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    Zero latency. All calculations run strictly in your browser using pure math algorithms.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text">100% Private & Anonymous</h4>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    No sign-in, no tracking databases, and passwords are never persisted anywhere.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text">Responsive & Accessible</h4>
                  <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                    Optimized for desktop, tablet, and mobile with light/dark modes and keyboard shortcuts.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function getCategoryTheme(categorySlug: string) {
  switch (categorySlug) {
    case "finance":
      return {
        iconBg: "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white",
        badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      };
    case "math":
      return {
        iconBg: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white",
        badge: "bg-primary/10 text-primary border-primary/20",
      };
    case "health":
      return {
        iconBg: "bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white",
        badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      };
    case "date-time":
      return {
        iconBg: "bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white",
        badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      };
    case "converters":
      return {
        iconBg: "bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white",
        badge: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
      };
    case "developer-tools":
      return {
        iconBg: "bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white",
        badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      };
    default:
      return {
        iconBg: "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white",
        badge: "bg-surface-secondary text-text-secondary border-border",
      };
  }
}

function ToolCard({
  tool,
  isFav,
  onToggleFav,
}: {
  tool: typeof TOOLS[0];
  isFav: boolean;
  onToggleFav: () => void;
}) {
  const catTheme = getCategoryTheme(tool.categorySlug);

  return (
    <Card className="border-border hover:border-primary/50 transition-all hover:shadow-md flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between pb-3">
          <div className={`w-10 h-10 rounded-btn flex items-center justify-center transition-all duration-200 ${catTheme.iconBg}`}>
            <ToolIcon name={tool.icon} className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${catTheme.badge}`}>
              {tool.category}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleFav();
              }}
              className="p-1.5 text-text-muted hover:text-amber-500 transition-colors"
              title={isFav ? "Remove from favorites" : "Add to favorites"}
              aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              <Star
                className={`w-4 h-4 ${
                  isFav ? "text-amber-500 fill-amber-500" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <Link href={`/${tool.slug}`} className="block">
          <h3 className="font-bold text-base text-text group-hover:text-primary transition-colors">
            {tool.name}
          </h3>
          <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
            {tool.description}
          </p>
        </Link>
      </div>

      <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs">
        <span className="text-text-muted text-[11px] font-mono">Free & Instant</span>
        <Link
          href={`/${tool.slug}`}
          className="font-semibold text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-1"
        >
          <span>Use Tool</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  );
}
