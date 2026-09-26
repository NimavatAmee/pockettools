import React from "react";
import {
  Receipt,
  Coins,
  Tag,
  Percent,
  Utensils,
  Calculator,
  HeartPulse,
  CalendarDays,
  Clock,
  ArrowLeftRight,
  FileJson,
  KeyRound,
  Wallet,
  Activity,
  Calendar,
  RefreshCw,
  Code,
  Sparkles,
  LucideProps,
} from "lucide-react";

interface ToolIconProps extends LucideProps {
  name: string;
}

const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  Receipt,
  Coins,
  Tag,
  Percent,
  Utensils,
  Calculator,
  HeartPulse,
  CalendarDays,
  Clock,
  ArrowLeftRight,
  FileJson,
  KeyRound,
  Wallet,
  Activity,
  Calendar,
  RefreshCw,
  Code,
  Sparkles,
};

export function ToolIcon({ name, className, ...props }: ToolIconProps) {
  const IconComponent = ICON_MAP[name] || Calculator;
  return <IconComponent className={className} {...props} />;
}
