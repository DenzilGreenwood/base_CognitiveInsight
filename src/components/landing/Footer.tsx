import * as React from "react";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn("px-6 py-10 border-t border-white/10", className)}>
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="text-sm text-indigo-200/80 flex flex-col md:flex-row items-center gap-2">
          <p>
            © {new Date().getFullYear()} Cognitive Insight™ — All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full">
              Demonstration only
            </span>
            <span className="hidden md:inline text-indigo-300/60">•</span>
            <span className="text-indigo-300/60">No sensitive data processed</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-indigo-200/80 text-sm">
          <a className="hover:text-white" href="/privacy" title="Privacy Policy">Privacy</a>
          <a className="hover:text-white" href="/contact" title="Contact Us">Contact</a>
          <a className="hover:text-white text-xs opacity-60" href="/login" title="Admin Portal">Admin</a>
        </div>
      </div>
      
      {/* Additional trust-building footer */}
      <div className="container mx-auto max-w-6xl mt-6 pt-4 border-t border-white/5">
        <div className="text-center text-xs text-indigo-300/50">
          <p>
            Your privacy matters. Data collection limited to contact forms only. 
            GDPR compliant. Contact removal available on request.
          </p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
