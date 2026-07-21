import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plane, Bookmark, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user, logout } = useAuth();
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    // Load profile photo from localStorage
    const savedPic = localStorage.getItem("tripai:profile_pic");
    if (savedPic) {
      setProfilePic(savedPic);
    }

    // Also listen to storage events or custom event to keep it updated when user uploads a new picture
    const handleStorageChange = () => {
      setProfilePic(localStorage.getItem("tripai:profile_pic"));
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("tripai:profile_pic_updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tripai:profile_pic_updated", handleStorageChange);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4">
        <Link to="/" className="group flex items-center gap-2 sm:gap-3">
          <div className="relative shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white p-1 shadow-md transition-transform duration-300 group-hover:scale-105">
            <img src="/logo.png" alt="Trip AI Logo" className="size-8 sm:size-9 object-contain" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-base sm:text-lg font-black tracking-tight text-foreground leading-tight flex items-center">
              Trip
              <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent ml-0.5">
                AI
              </span>
            </span>
            <span className="text-[7.5px] font-bold uppercase tracking-wider text-muted-foreground leading-none mt-1 hidden sm:block">
              Plan your trip here & book anywhere
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-white/5"
            activeProps={{
              className:
                "text-foreground bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/5",
            }}
          >
            Plan
          </Link>
          <Link
            to="/saved"
            className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-white/5"
            activeProps={{
              className:
                "text-foreground bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/5",
            }}
          >
            <Bookmark className="size-3.5 sm:size-4" />
            <span className="hidden xs:inline">Saved</span>
          </Link>

          {user ? (
            <div className="flex items-center gap-1 sm:gap-2 border-l border-white/10 pl-1.5 sm:pl-2">
              <span 
                title={user.name}
                className="inline-flex items-center gap-1 px-1.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white/5 text-xs font-semibold text-foreground border border-white/5 max-w-[40px] sm:max-w-[120px] truncate"
              >
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt={user.name}
                    className="size-4.5 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <User className="size-3.5 text-primary shrink-0" />
                )}
                <span className="truncate hidden sm:inline">{user.name}</span>
              </span>
              <button
                onClick={logout}
                title="Log Out"
                className="p-1.5 sm:p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/15 border border-transparent hover:border-destructive/10 transition-all duration-300"
              >
                <LogOut className="size-3.5 sm:size-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-1 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 bg-[image:var(--gradient-hero)] text-white text-xs font-bold shadow-glow hover:brightness-110 transition-all duration-300"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
