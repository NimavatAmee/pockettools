"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Tool } from "@/types";
import { TOOLS } from "@/lib/constants/tools";
import { ToolIcon } from "@/components/shared/ToolIcon";
import { useToolPreferences } from "@/hooks/useToolPreferences";
import { ChevronRight, Star, HelpCircle, BookOpen, Layers } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";

interface ToolLayoutProps {
  tool: Tool;
  children: React.ReactNode;
}

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  const { isFavorite, toggleFavorite, addRecent } = useToolPreferences();
  const favorite = isFavorite(tool.id);

  useEffect(() => {
    addRecent(tool.id);
  }, [tool.id, addRecent]);

  // Find related tools from same category
  const relatedTools = TOOLS.filter(
    (t) => t.category === tool.category && t.id !== tool.id
  ).slice(0, 3);

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-text-secondary">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <Link
          href={`/#${tool.categorySlug}`}
          className="hover:text-primary transition-colors"
        >
          {tool.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text font-medium">{tool.name}</span>
      </nav>

      {/* 2. Tool Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-btn bg-primary-light text-primary flex items-center justify-center">
              <ToolIcon name={tool.icon} className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
              {tool.name}
            </h1>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {tool.category}
            </Badge>
          </div>
          <p className="text-sm sm:text-base text-text-secondary max-w-2xl">
            {tool.description}
          </p>
        </div>

        <Button
          variant={favorite ? "primary" : "outline"}
          size="sm"
          onClick={() => toggleFavorite(tool.id)}
          className="self-start sm:self-auto gap-2"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star className={`w-4 h-4 ${favorite ? "fill-current" : ""}`} />
          <span>{favorite ? "Saved in Favorites" : "Save Tool"}</span>
        </Button>
      </div>

      {/* 3. Interactive Calculator Grid (Desktop: 2-column, Mobile: Stacked) */}
      <div className="mb-14">{children}</div>

      {/* 4. Formula & How It Works */}
      {tool.formula && (
        <section className="mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 border-b border-border">
              <BookOpen className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">How to Calculate {tool.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="p-4 rounded-btn bg-surface-secondary border border-border/80 font-mono text-xs sm:text-sm text-text overflow-x-auto">
                <p className="font-semibold text-primary mb-1">{tool.formula.title}</p>
                <p className="whitespace-pre-wrap leading-relaxed">{tool.formula.expression}</p>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {tool.formula.explanation}
              </p>

              {tool.formula.steps && tool.formula.steps.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text">Step-by-Step Guide:</h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-sm text-text-secondary">
                    {tool.formula.steps.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* 5. Worked Examples */}
      {tool.examples && tool.examples.length > 0 && (
        <section className="mb-12">
          <h3 className="text-lg font-bold text-text mb-4">Calculation Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tool.examples.map((eg, idx) => (
              <Card key={idx} className="border-border">
                <CardHeader>
                  <CardTitle className="text-base text-text">{eg.title}</CardTitle>
                  <p className="text-xs text-text-secondary">{eg.description}</p>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="bg-surface-secondary/60 p-3 rounded-btn space-y-1">
                    <span className="font-semibold text-text-secondary uppercase tracking-wider text-[10px]">Inputs</span>
                    {Object.entries(eg.inputs).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-text">
                        <span>{k}:</span>
                        <span className="font-medium">{v}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-primary/5 p-3 rounded-btn space-y-1 border border-primary/20">
                    <span className="font-semibold text-primary uppercase tracking-wider text-[10px]">Calculated Output</span>
                    {Object.entries(eg.result).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-text font-medium">
                        <span>{k}:</span>
                        <span className="text-primary font-bold">{v}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 6. Frequently Asked Questions */}
      {tool.faqs && tool.faqs.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-text">Frequently Asked Questions</h3>
          </div>
          <div className="space-y-3">
            {tool.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-btn border border-border bg-surface space-y-1.5 transition-colors hover:border-border/80"
              >
                <h4 className="font-semibold text-sm text-text">{faq.question}</h4>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Related Tools */}
      {relatedTools.length > 0 && (
        <section className="pt-8 border-t border-border">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-text">Related {tool.category} Tools</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedTools.map((rel) => (
              <Link
                key={rel.id}
                href={`/${rel.slug}`}
                className="group p-4 rounded-card border border-border bg-surface hover:border-primary/50 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-btn bg-primary-light text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    <ToolIcon name={rel.icon} className="w-4 h-4" />
                  </div>
                  <h4 className="font-semibold text-sm text-text group-hover:text-primary transition-colors">
                    {rel.name}
                  </h4>
                  <p className="text-xs text-text-secondary line-clamp-2">
                    {rel.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-xs font-medium text-primary gap-1">
                  <span>Open tool</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
