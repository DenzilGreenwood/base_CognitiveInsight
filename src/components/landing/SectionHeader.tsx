import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  kicker?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  kicker, 
  title, 
  subtitle, 
  className 
}) => (
  <div className={cn("max-w-3xl mx-auto text-center space-y-3", className)}>
    {kicker && (
      <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">{kicker}</p>
    )}
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="text-indigo-100/90 text-base md:text-lg">{subtitle}</p>
    )}
  </div>
);

export { SectionHeader };
