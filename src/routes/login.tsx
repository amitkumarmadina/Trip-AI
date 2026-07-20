import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Plane, ArrowRight, Eye, EyeOff, Mail, Lock } from "lucide-react";
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
    <div className="relative min-h-screen bg-[#070b13] text-foreground overflow-hidden flex flex-col justify-between select-none">
      {/* Background Glow */}
      <div className="glow-orb glow-orb-primary top-10 left-10 size-[350px] sm:size-[500px]" />
      <div className="glow-orb glow-orb-secondary bottom-10 right-10 size-[300px] sm:size-[450px]" />

      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-12 md:py-20 relative z-10 w-full flex items-center justify-center grow">
        <div className="glass-panel w-full rounded-3xl border border-white/5 overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 min-h-[520px] bg-[#0b1220]/80 backdrop-blur-xl">
          
          {/* Left Side: Travelers Scenic Scenery (Visual Mockup) */}
          <div className="relative hidden md:block overflow-hidden min-h-full">
            <img 
              src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80" 
              alt="Scenic Mountain Journey" 
              className="absolute inset-0 size-full object-cover brightness-[0.7] contrast-[1.05]"
            />
            {/* Dark mask overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220]/95 via-black/20 to-black/30" />

            {/* Overlap Text */}
            <div className="absolute inset-0 flex flex-col justify-end p-9 text-left space-y-3.5">
              <h2 className="text-3xl font-black tracking-tight text-white leading-tight font-outfit uppercase">
                Your journey <br />begins with <br />
                <span className="text-[#10B981]">a single plan.</span>
              </h2>
              <p className="text-[13px] text-white/70 leading-relaxed font-outfit font-semibold">
                Sign in to TripAI and unlock the power of AI to plan your perfect trip.
              </p>
            </div>
          </div>

          {/* Right Side: Welcome back Form Panel */}
          <div className="p-8 sm:p-12 flex flex-col justify-center text-left bg-[#0B1220]/50 relative">
            <div className="space-y-6">
              <div>
                <h1 className="text-[25px] font-black text-white tracking-tight font-outfit">Welcome back</h1>
                <p className="text-[12px] text-[#94A3B8] font-bold mt-1 font-outfit uppercase tracking-wider">
                  Sign in to continue your adventures
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-4.5">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8] font-outfit">
                    Email address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                      <Mail className="size-4" />
                    </span>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="youremail@example.com"
                      className="w-full h-11 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/50 text-sm font-outfit transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8] font-outfit">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                      <Lock className="size-4" />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••••••"
                      className="w-full h-11 pl-11 pr-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#10B981]/50 focus:ring-1 focus:ring-[#10B981]/50 text-sm font-outfit transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {/* Forgot password */}
                <div className="text-right">
                  <span 
                    onClick={() => toast.info("Password recovery is under development.")}
                    className="text-[11px] font-extrabold text-[#10B981] hover:underline cursor-pointer font-outfit"
                  >
                    Forgot password?
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 mt-4.5 rounded-xl bg-[#10B981] hover:bg-[#34D399] disabled:opacity-50 text-[#0F172A] font-black text-xs tracking-wider uppercase shadow-glow transition-all duration-300 hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5 font-outfit"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Signing you in…
                    </>
                  ) : (
                    <>
                      Sign in <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Redirect to Register */}
              <div className="text-center text-[12px] text-[#94A3B8] pt-4.5 border-t border-white/5 font-outfit">
                Don't have an account?{" "}
                <Link to="/register" className="text-[#10B981] font-extrabold hover:underline">
                  Create one for free
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
