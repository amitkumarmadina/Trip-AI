import { Link } from "@tanstack/react-router";
import { Plane, Bookmark } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="group flex items-center gap-2 text-lg font-semibold">
          <span className="grid size-9 place-items-center rounded-xl bg-[image:var(--gradient-hero)] text-secondary shadow-[var(--shadow-glow)] transition-transform duration-300 group-hover:scale-105">
            <Plane className="size-5 -rotate-45 text-white transition-transform duration-500 group-hover:rotate-0" />
          </span>
          <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-xl font-bold tracking-tight text-transparent">
            Trip AI
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-medium">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="rounded-full px-4 py-2 text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-white/5"
            activeProps={{
              className:
                "text-foreground bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/5",
            }}
          >
            Plan
          </Link>
          <Link
            to="/saved"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-white/5"
            activeProps={{
              className:
                "text-foreground bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/5",
            }}
          >
            <Bookmark className="size-4" /> Saved
          </Link>
        </nav>
      </div>
    </header>
  );
}
