import { Link } from "@tanstack/react-router";
import { Plane, Bookmark, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white p-1 shadow-md transition-transform duration-300 group-hover:scale-105">
            <img src="/logo.png" alt="Trip AI Logo" className="size-9 object-contain" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-lg font-black tracking-tight text-foreground leading-tight flex items-center">
              Trip
              <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent ml-0.5">
                AI
              </span>
            </span>
            <span className="text-[7.5px] font-bold uppercase tracking-wider text-muted-foreground leading-none mt-1">
              Plan your trip here & book anywhere
            </span>
          </div>
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

          {user ? (
            <div className="flex items-center gap-2 border-l border-white/10 pl-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 text-xs font-semibold text-foreground border border-white/5 max-w-[120px] truncate">
                <User className="size-3.5 text-primary shrink-0" />
                <span className="truncate">{user.name}</span>
              </span>
              <button
                onClick={logout}
                title="Log Out"
                className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/15 border border-transparent hover:border-destructive/10 transition-all duration-300"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-1 rounded-full px-4 py-2 bg-[image:var(--gradient-hero)] text-white text-xs font-bold shadow-glow hover:brightness-110 transition-all duration-300"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
