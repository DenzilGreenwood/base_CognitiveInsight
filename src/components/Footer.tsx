// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm">
            <span>© {new Date().getFullYear()} Cognitive Insight™</span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="/about" className="hover:underline">About</a>
            <a href="/contact" className="hover:underline">Contact</a>
            <a href="/privacy" className="hover:underline">Privacy</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
