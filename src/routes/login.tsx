import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Plane, ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Trip AI" },
      { name: "description", content: "Access your personalized AI travel plans." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      login(data.token, { id: data.id, name: data.name, email: data.email });
      toast.success(`Welcome back, ${data.name}!`);

      // Navigate back to where they were, or home
      const redirectUrl = sessionStorage.getItem("tripai:redirect") || "/";
      sessionStorage.removeItem("tripai:redirect");
      navigate({ to: redirectUrl });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Glow */}
      <div className="glow-orb glow-orb-primary top-10 left-10 size-[350px] sm:size-[500px]" />
      <div className="glow-orb glow-orb-secondary bottom-10 right-10 size-[300px] sm:size-[450px]" />

      <Navbar />

      <div className="mx-auto max-w-md px-6 py-20 relative">
        <div className="glass-panel rounded-3xl p-8 border-white/5 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[image:var(--gradient-hero)]" />

          <div className="text-center mb-8">
            <div className="grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary border border-primary/20 shadow-glow mx-auto mb-4">
              <Plane className="size-6 -rotate-45 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Sign in to manage and view your saved trips
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-11 rounded-xl bg-white/5 border-white/10 text-foreground focus-visible:ring-primary/50"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 rounded-xl bg-white/5 border-white/10 pr-10 text-foreground focus-visible:ring-primary/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[image:var(--gradient-hero)] text-white font-bold shadow-glow hover:brightness-110 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4.5 animate-spin" />
                  Signing you in…
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="ml-1.5 size-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground pt-6 border-t border-white/5">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Create one for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
