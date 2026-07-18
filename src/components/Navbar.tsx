import { Link } from "@tanstack/react-router";
import { Plane, Bookmark } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="grid size-9 place-items-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-soft)]">
            <Plane className="size-5" />
          </span>
          <span className="tracking-tight">Voyagr</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="rounded-full px-4 py-2 text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Plan
          </Link>
          <Link
            to="/saved"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            <Bookmark className="size-4" /> Saved
          </Link>
        </nav>
      </div>
    </header>
  );
}
