import type { Metadata } from "next";
import Link from "next/link";
import { TOOLS, CATEGORIES } from "@/lib/constants/tools";
import { ToolIcon } from "@/components/shared/ToolIcon";
import { ChevronRight, Layers } from "lucide-react";
import { Card, Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "All Calculators & Tools Directory — Pocket Tools",
  description:
    "Explore our complete catalog of free online calculators: GST, EMI, Discount, Percentage, Tip, BMI, Age, Unit Converter, and Developer Tools.",
  alternates: {
    canonical: "https://pockettools.app/calculators",
  },
};

export default function AllCalculatorsPage() {
  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-text font-medium">All Tools</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text">
          All Tools & Calculators
        </h1>
        <p className="text-sm sm:text-base text-text-secondary max-w-2xl">
          Browse our complete catalog of 100% private, browser-based calculators and utility tools.
        </p>
      </div>

      {/* Grouped by Categories */}
      <div className="space-y-12">
        {CATEGORIES.map((cat) => {
          const catTools = TOOLS.filter(
            (t) => t.category.toLowerCase() === cat.name.toLowerCase()
          );

          return (
            <section key={cat.slug} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-btn bg-primary-light text-primary flex items-center justify-center">
                    <ToolIcon name={cat.icon} className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-bold text-text">{cat.name}</h2>
                </div>
                <Badge variant="secondary">{catTools.length} Tools</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/${tool.slug}`}
                    className="p-5 rounded-card border border-border bg-surface hover:border-primary/50 transition-all hover:shadow-md flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-btn bg-primary-light text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                          <ToolIcon name={tool.icon} className="w-4 h-4" />
                        </div>
                        {tool.featured && <Badge variant="default">Popular</Badge>}
                      </div>
                      <h3 className="font-bold text-base text-text group-hover:text-primary transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-medium text-primary">
                      <span>Open tool</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
