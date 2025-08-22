import * as React from "react";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn("px-6 py-10 border-t border-white/10", className)}>
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-sm text-indigo-200/80">
          © {new Date().getFullYear()} Cognitive Insight™ — All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-indigo-200/80 text-sm">
          <span>Patent-pending • Demo is simulated</span>
          <span className="hidden md:inline">|</span>
          <a className="hover:text-white" href="#">Privacy</a>
          <a className="hover:text-white" href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
