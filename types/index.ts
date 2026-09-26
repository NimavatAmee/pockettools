export type ToolCategory =
  | "Finance"
  | "Math"
  | "Health"
  | "Date & Time"
  | "Converters"
  | "Developer Tools";

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolExample {
  title: string;
  description: string;
  inputs: Record<string, string | number>;
  result: Record<string, string | number>;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  category: ToolCategory;
  categorySlug: string;
  description: string;
  icon: string;
  keywords: string[];
  featured?: boolean;
  formula?: {
    title: string;
    expression: string;
    explanation: string;
    steps?: string[];
  };
  examples?: ToolExample[];
  faqs?: ToolFAQ[];
}

export interface CategoryInfo {
  name: ToolCategory;
  slug: string;
  description: string;
  icon: string;
  toolCount?: number;
}
