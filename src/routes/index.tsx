import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import {
  Home,
  Plane,
  Bookmark,
  Calendar,
  FileText,
  Sliders,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  Search,
  Plus,
  Bell,
  MapPin,
  Users,
  ArrowRight,
  Sparkles,
  Compass,
  Wallet,
  CheckCircle2,
  Cloud,
  CloudRain,
  SunDim,
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  LogOut,
  User,
  Info,
  Loader2,
  Trash2,
  CreditCard,
  Check,
  UploadCloud,
  File,
  Download,
  Key,
  UserCheck,
  MessageSquare,
  LifeBuoy,
  Play,
  Star,
  Globe2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  INTEREST_OPTIONS,
  STYLE_OPTIONS,
  ACCOMMODATION_OPTIONS,
  TRANSPORT_OPTIONS,
  CURRENCY_OPTIONS,
  type TripInput,
  type SavedTrip,
  type TravelStyle,
} from "@/lib/trip-types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trip AI — Plan Smarter, Travel Better" },
      { name: "description", content: "AI-powered travel companion that creates custom itineraries, finds the best options, and lets you book anywhere." },
    ],
  }),
  component: Index,
});

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
}

interface TravelDocument {
  id: string;
  name: string;
  category: "Passport" | "Visa" | "Ticket" | "Insurance" | "Other";
  size: string;
  date: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  text: string;
  status: "Open" | "Closed" | "Resolved";
  date: string;
  replies: { sender: "user" | "agent"; text: string; date: string }[];
}

function daysBetween(a: string | undefined, b: string | undefined) {
  if (!a || !b) return 1;
  const d = Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000) + 1;
  return Math.max(1, isFinite(d) ? d : 1);
}

function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-[#10b981]" />
        <span className="text-sm text-slate-400 font-semibold">Loading Trip AI...</span>
      </div>
    );
  }

  if (user) {
    return <DashboardView />;
  }

  return <LandingPageView />;
}

// -------------------------------------------------------------
// PUBLIC LANDING PAGE VIEW (For Logged-Out Users)
// -------------------------------------------------------------
function LandingPageView() {
  const navigate = useNavigate();

  // Landing Page Planner Modal trigger
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [loadingTrip, setLoadingTrip] = useState(false);

  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [tripDates, setTripDates] = useState("");
  const [travelers, setTravelers] = useState(2);

  const [extendedForm, setExtendedForm] = useState<TripInput>({
    from: "",
    destination: "",
    budget: 15000,
    currency: "INR",
    travelers: 2,
    startDate: "2026-05-20",
    endDate: "2026-05-24",
    days: 5,
    style: "Couple",
    interests: ["Nature"],
    accommodation: "Hotel",
    transport: "Car",
    notes: "",
  });

  const handleStartPlanning = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromCity.trim() || !toCity.trim() || !tripDates.trim()) {
      toast.info("Please fill departing location, destination, and dates to plan.");
      setPlannerOpen(true);
      return;
    }

    setExtendedForm((prev) => ({
      ...prev,
      from: fromCity.trim(),
      destination: toCity.trim(),
      travelers: travelers,
      startDate: tripDates.split(" - ")[0]?.trim() || "2026-05-20",
      endDate: tripDates.split(" - ")[1]?.trim() || "2026-05-24",
      days: daysBetween(tripDates.split(" - ")[0], tripDates.split(" - ")[1]),
    }));

    setPlannerOpen(true);
  };

  const handleGenerateItinerary = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingTrip(true);
    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extendedForm),
      });

      if (!res.ok) throw new Error("Failed to generate");

      const { itinerary } = await res.json();
      const newTrip: SavedTrip = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        input: extendedForm,
        itinerary,
      };

      sessionStorage.setItem("voyagr:current", JSON.stringify(newTrip));
      // Save locally for guest users
      const saved = JSON.parse(localStorage.getItem("voyagr:saved") || "[]");
      saved.unshift(newTrip);
      localStorage.setItem("voyagr:saved", JSON.stringify(saved));

      toast.success("AI generated itinerary successfully!");
      navigate({ to: "/itinerary" });
    } catch {
      toast.error("Error generating trip. Please register or add custom API keys.");
    } finally {
      setLoadingTrip(false);
      setPlannerOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 font-sans selection:bg-[#10b981]/30 selection:text-white">
      {/* Header bar navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0f172a]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="group flex items-center gap-3">
            <div className="shrink-0 overflow-hidden rounded-xl border border-slate-800 bg-white p-1 shadow-md transition-transform duration-300 group-hover:scale-105">
              <img src="/logo.png" alt="Trip AI Logo" className="size-8 object-contain" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-md font-black tracking-tight text-white leading-none">
                Trip
                <span className="text-[#10b981] ml-0.5">AI</span>
              </span>
              <span className="text-[6.5px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                Plan here, book anywhere
              </span>
            </div>
          </Link>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#destinations" className="hover:text-white transition-colors">Destinations</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">Blog</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
          </nav>

          {/* Right link actions */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 border border-slate-800 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-400 bg-slate-900/50">
              <Globe2 className="size-3.5" />
              <span>EN</span>
            </div>
            <Link to="/login" className="text-xs font-extrabold text-slate-400 hover:text-white transition-colors">
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-[#10b981] hover:bg-[#34d399] text-[#0f172a] text-xs font-black px-4 py-2.5 transition-all shadow-[0_4px_15px_rgba(16,185,129,0.2)]"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Main Landing content */}
      <main className="space-y-24 py-16">
        
        {/* 1. HERO SECTION */}
        <section className="mx-auto max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Texts */}
          <div className="lg:col-span-6 text-left space-y-6">
            <h1 className="text-4xl sm:text-6xl font-black leading-[1.05] tracking-tight text-white">
              Plan smarter.<br />
              Travel better.<br />
              <span className="text-[#10b981]">Plan here, book</span> anywhere.
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg">
              TripAI is your AI travel companion that creates custom itineraries, finds the best options, and lets you book from any platform you love.
            </p>

            {/* Quick Form */}
            <form onSubmit={handleStartPlanning} className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_auto] gap-2 p-2 bg-slate-900 border border-slate-800 rounded-2xl items-center shadow-2xl">
              <input
                type="text"
                required
                placeholder="From: e.g. Delhi"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="bg-slate-800/50 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10b981] font-semibold"
              />
              <input
                type="text"
                required
                placeholder="To: e.g. Manali"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="bg-slate-800/50 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10b981] font-semibold"
              />
              <button
                type="submit"
                className="col-span-2 sm:col-span-1 rounded-xl bg-[#10b981] text-[#0f172a] text-xs font-black py-2 px-4 shadow-[0_4px_15px_rgba(16,185,129,0.25)] hover:brightness-110 transition-all shrink-0 cursor-pointer"
              >
                Plan Your Trip
              </button>
            </form>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 items-start sm:items-center">
              <div className="flex gap-4">
                <button
                  onClick={() => setPlannerOpen(true)}
                  className="rounded-xl bg-[#10b981] text-[#0f172a] text-xs font-black px-5 py-3 shadow-[0_4px_15px_rgba(16,185,129,0.25)] hover:brightness-110 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="size-4" /> Plan Your Trip
                </button>
                <button
                  onClick={() => toast.info("Check out the quick guide down below!")}
                  className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold px-5 py-3 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Play className="size-4 text-[#10b981]" /> See How It Works
                </button>
              </div>

              {/* Star reviews */}
              <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
                <div className="flex -space-x-2">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80",
                    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&h=80&q=80",
                  ].map((src, idx) => (
                    <img key={idx} src={src} alt="Traveler" className="size-7.5 rounded-full border-2 border-[#0f172a] object-cover" />
                  ))}
                </div>
                <div className="text-left text-[11px] leading-tight">
                  <div className="flex text-amber-500 gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-3 fill-current" />)}
                  </div>
                  <span className="text-slate-400 font-bold">Loved by 10,000+ travelers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Card Overlay */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Main Mockup Cover */}
            <div className="w-full max-w-md rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl relative h-[360px]">
              <img
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80"
                alt="Manali landscape"
                className="size-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Floating Plan Overlay */}
              <div className="absolute bottom-6 right-6 left-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-4 backdrop-blur shadow-2xl animate-pulse">
                <div className="flex items-center gap-2 text-xs font-bold text-[#10b981]">
                  <Sparkles className="size-3.5" /> AI Generated Plan
                </div>

                <div className="space-y-3">
                  {[
                    { day: "Day 1", title: "Explore Manali", desc: "Hadimba Temple, Mall Road, Local markets", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=80&h=80&q=70" },
                    { day: "Day 2", title: "Solang Valley Adventure", desc: "Paragliding, soft trek & scenic vistas", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=80&h=80&q=70" },
                  ].map((s, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <img src={s.img} alt={s.title} className="size-8 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <span className="text-[9px] text-[#10b981] font-bold block">{s.day}</span>
                        <h5 className="text-xs font-bold text-white truncate leading-tight">{s.title}</h5>
                        <p className="text-[9px] text-slate-400 truncate mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400 text-[10px]">5 Days · 2 Travelers</span>
                  <span className="text-white">Total Budget <span className="text-[#10b981]">₹18,500</span></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. BRANDS COMPARISON BAR */}
        <section className="border-y border-slate-800 bg-slate-900/35 py-8 select-none">
          <div className="mx-auto max-w-7xl px-6 text-center space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#10b981]">We compare across 50+ platforms</span>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60 text-slate-300 font-extrabold text-sm tracking-wide">
              <span>make 🛠️ trip</span>
              <span>Booking.com</span>
              <span>agoda 🟢🟢</span>
              <span>airbnb</span>
              <span>Expedia</span>
              <span>cleartrip</span>
              <span>Trip.com</span>
              <span className="text-xs text-slate-500 font-bold">and more...</span>
            </div>
          </div>
        </section>

        {/* 3. FEATURES GRID */}
        <section id="features" className="mx-auto max-w-7xl px-6 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight sm:text-4xl">
              Everything you need for the <span className="text-[#10b981]">perfect trip</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              TripAI simplifies travel planning with the power of artificial intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "AI-Powered Itineraries", desc: "Get personalized day-by-day itineraries in seconds.", icon: Sparkles, bg: "bg-[#10b981]/10 text-[#10b981]" },
              { title: "Best Options, Everywhere", desc: "We find the best flights, stays, and activities across the web.", icon: Compass, bg: "bg-[#34d399]/10 text-[#34d399]" },
              { title: "Book Anywhere", desc: "You book where you want. We guide, you decide.", icon: Wallet, bg: "bg-amber-500/10 text-amber-500" },
              { title: "Smart Budgeting", desc: "Optimize your budget with AI recommendations and tips.", icon: TrendingUp, bg: "bg-[#10b981]/10 text-[#10b981]" },
              { title: "Discover & Explore", desc: "Explore top destinations, hidden gems, and local experiences.", icon: MapPin, bg: "bg-indigo-500/10 text-indigo-400" },
              { title: "Your Data, Your Way", desc: "Secure, private, and built for travelers like you.", icon: UserCheck, bg: "bg-pink-500/10 text-pink-400" },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all text-left space-y-4">
                <div className={`size-10 rounded-xl flex items-center justify-center ${f.bg}`}>
                  <f.icon className="size-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white">{f.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. HOW IT WORKS */}
        <section id="how-it-works" className="border-t border-b border-slate-800 bg-slate-900/20 py-20">
          <div className="mx-auto max-w-7xl px-6 space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-white tracking-tight">How <span className="text-[#10b981]">TripAI</span> works</h2>
              <p className="text-slate-400 text-xs font-bold">Plan your dream trip in 3 simple steps</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {[
                { step: "1", title: "Tell us your plan", desc: "Share your destination, dates, budget, and preferences.", icon: FileText, bg: "bg-[#10b981]/10 text-[#10b981]" },
                { step: "2", title: "AI creates your trip", desc: "Our AI builds a personalized itinerary just for you.", icon: Sparkles, bg: "bg-[#34d399]/10 text-[#34d399]" },
                { step: "3", title: "You book anywhere", desc: "Choose what you like and book where you prefer.", icon: Plane, bg: "bg-[#10b981]/10 text-[#10b981]" },
              ].map((s, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 text-left space-y-4 relative">
                  <div className={`size-11 rounded-xl flex items-center justify-center ${s.bg}`}>
                    <s.icon className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-[#10b981]">Step {s.step}</span>
                    <h4 className="text-sm font-black text-white">{s.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-semibold">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. POPULAR DESTINATIONS */}
        <section id="destinations" className="mx-auto max-w-7xl px-6 space-y-8 select-none">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xl font-black text-white tracking-tight">Popular Destinations</h3>
            <span className="text-xs font-bold text-slate-400 cursor-pointer hover:text-white transition-colors">View all</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Manali", price: "6,200", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=300&q=70" },
              { name: "Goa", price: "4,800", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=70" },
              { name: "Kerala", price: "7,500", img: "https://images.unsplash.com/photo-1596761301588-915ccaec3e83?auto=format&fit=crop&w=300&q=70" },
              { name: "Ladakh", price: "9,900", img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=300&q=70" },
            ].map((d) => (
              <article key={d.name} className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl transition-all duration-300">
                <div className="h-40 overflow-hidden relative">
                  <img src={d.img} alt={d.name} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
                </div>
                <div className="p-4 text-left relative z-10 leading-tight">
                  <h4 className="text-sm font-bold text-white group-hover:text-[#10b981] transition-colors">{d.name}</h4>
                  <div className="flex items-center justify-between mt-3.5 border-t border-slate-800 pt-2">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Starting</span>
                    <span className="text-xs font-black text-white">₹{d.price}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 6. CALL TO ACTION & BRAND INFO */}
        <section id="pricing" className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-2xl text-left relative overflow-hidden">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-white leading-tight">
              Ready to plan your next adventure?
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed font-semibold max-w-md">
              Join thousands of smart travelers who plan with TripAI and book with confidence. It creates custom itineraries and locates best rates in seconds.
            </p>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#10b981] hover:bg-[#34d399] text-[#0f172a] text-xs font-black px-6 py-3 shadow-[0_4px_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
            >
              Get Started for Free <ArrowRight className="size-4" />
            </Link>

            <div className="flex gap-6 text-[10px] text-slate-400 font-bold">
              <span className="flex items-center gap-1.5"><Check className="size-3 text-[#10b981]" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><Check className="size-3 text-[#10b981]" /> Free forever plan</span>
            </div>
          </div>

          <div className="hidden md:flex justify-center relative">
            {/* Luggage mockup illustration */}
            <div className="relative border border-slate-800 bg-[#0f172a] rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 w-[280px]">
              <div className="size-16 rounded-2xl bg-[#10b981]/10 text-[#10b981] flex items-center justify-center">
                <Plane className="size-8" />
              </div>
              <div className="text-center space-y-1">
                <span className="text-xs font-black text-white">Your Trip Package</span>
                <p className="text-[10px] text-slate-400">Secure digital boarding passes</p>
              </div>
              <span className="text-xs font-extrabold text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20 rounded-full px-4 py-1 animate-pulse">
                Ready to Pack
              </span>
            </div>
          </div>
        </section>

        {/* 7. FOOTER INFO TILES */}
        <section className="mx-auto max-w-7xl px-6 grid grid-cols-2 lg:grid-cols-4 gap-6 select-none border-t border-slate-800 pt-16">
          {[
            { title: "Save Time", desc: "AI finds the best options in seconds", icon: Sparkles },
            { title: "Save Money", desc: "Compare across platforms for the best deals", icon: Wallet },
            { title: "Travel Confidently", desc: "Plan better, book anywhere with full control", icon: Compass },
            { title: "24/7 Support", desc: "We're here whenever you need us", icon: LifeBuoy },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 text-left">
              <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-[#10b981] shrink-0">
                <item.icon className="size-4.5" />
              </div>
              <div className="leading-tight space-y-1">
                <h5 className="text-xs font-bold text-white">{item.title}</h5>
                <p className="text-[10px] text-slate-400 font-semibold">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

      </main>

      {/* Footer copyright */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 select-none mt-16 text-slate-500 text-xs font-semibold">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="shrink-0 overflow-hidden rounded-lg bg-white p-0.5 border border-slate-800">
              <img src="/logo.png" alt="Trip AI Logo" className="size-5 object-contain" />
            </div>
            <span className="font-bold text-white">TripAI</span>
            <span>© {new Date().getFullYear()} Voyagr Inc.</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span>Made with 💚 for travelers</span>
          </div>
        </div>
      </footer>

      {/* Landing Planner Overlay Modal */}
      {plannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPlannerOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-left space-y-1 mb-6">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="size-5 text-[#10b981]" /> Plan Your Next Journey
              </h3>
              <p className="text-xs text-slate-400 font-medium">Configure your preferences for customized AI outputs.</p>
            </div>

            <form onSubmit={handleGenerateItinerary} className="space-y-4 text-left">
              {/* departing -> destination */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Departing From</label>
                  <input
                    type="text"
                    required
                    value={extendedForm.from}
                    onChange={(e) => setExtendedForm((prev) => ({ ...prev, from: e.target.value }))}
                    placeholder="e.g. Delhi"
                    className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10b981]"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Destination</label>
                  <input
                    type="text"
                    required
                    value={extendedForm.destination}
                    onChange={(e) => setExtendedForm((prev) => ({ ...prev, destination: e.target.value }))}
                    placeholder="e.g. Manali"
                    className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10b981]"
                  />
                </div>
              </div>

              {/* Dates & Travelers */}
              <div className="grid grid-cols-3 gap-3 items-end">
                <div className="col-span-2 flex flex-col">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Dates (Start - End)</label>
                  <input
                    type="text"
                    required
                    value={`${extendedForm.startDate} - ${extendedForm.endDate}`}
                    onChange={(e) => {
                      const dates = e.target.value.split(" - ");
                      setExtendedForm((prev) => ({
                        ...prev,
                        startDate: dates[0]?.trim() || prev.startDate,
                        endDate: dates[1]?.trim() || prev.endDate,
                        days: daysBetween(dates[0], dates[1]),
                      }));
                    }}
                    placeholder="2026-05-20 - 2026-05-24"
                    className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10b981] font-semibold"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Travelers</label>
                  <select
                    value={extendedForm.travelers}
                    onChange={(e) => setExtendedForm((prev) => ({ ...prev, travelers: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#10b981] cursor-pointer"
                  >
                    <option value={1}>1 Traveler</option>
                    <option value={2}>2 Travelers</option>
                    <option value={3}>3 Travelers</option>
                    <option value={4}>4 Travelers</option>
                    <option value={5}>5+ Persons</option>
                  </select>
                </div>
              </div>

              {/* Lodging & Transit */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Preferred Lodging</label>
                  <select
                    value={extendedForm.accommodation}
                    onChange={(e) => setExtendedForm((prev) => ({ ...prev, accommodation: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#10b981] cursor-pointer"
                  >
                    {ACCOMMODATION_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Preferred Transit</label>
                  <select
                    value={extendedForm.transport}
                    onChange={(e) => setExtendedForm((prev) => ({ ...prev, transport: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#10b981] cursor-pointer"
                  >
                    {TRANSPORT_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Style & Budget */}
              <div className="grid grid-cols-3 gap-3 items-end">
                <div className="col-span-2 flex flex-col">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Budget Limit</label>
                  <input
                    type="number"
                    value={extendedForm.budget}
                    onChange={(e) => setExtendedForm((prev) => ({ ...prev, budget: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10b981] font-semibold"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Currency</label>
                  <select
                    value={extendedForm.currency}
                    onChange={(e) => setExtendedForm((prev) => ({ ...prev, currency: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#10b981] cursor-pointer"
                  >
                    {CURRENCY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Interests Toggles */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Interests</label>
                <div className="flex flex-wrap gap-1.5">
                  {INTEREST_OPTIONS.map((interest) => {
                    const isSelected = extendedForm.interests.includes(interest);
                    return (
                      <button
                        type="button"
                        key={interest}
                        onClick={() => {
                          setExtendedForm((prev) => ({
                            ...prev,
                            interests: isSelected
                              ? prev.interests.filter((i) => i !== interest)
                              : [...prev.interests, interest],
                          }));
                        }}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#10b981] text-[#0f172a] border-[#10b981] font-bold shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                            : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-6 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPlannerOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingTrip}
                  className="flex-1 py-2.5 rounded-xl bg-[#10b981] text-[#0f172a] text-xs font-black hover:brightness-110 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(16,185,129,0.25)] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {loadingTrip ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-[#0f172a]" /> Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3.5" /> Generate Itinerary
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// PRIVATE DASHBOARD VIEW (For Logged-In Users)
// -------------------------------------------------------------
function DashboardView() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<string>("Home");

  // Pro Subscription States
  const [isProMember, setIsProMember] = useState<boolean>(() => {
    return localStorage.getItem("voyagr:ispro") === "true";
  });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"pricing" | "billing" | "success">("pricing");
  const [cardForm, setCardForm] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [paying, setPaying] = useState(false);

  // Active / Mocked Bookings list state
  const [bookings, setBookings] = useState([
    {
      id: "b-1",
      type: "flight",
      title: "Flight to Ranchi",
      carrier: "Indigo Airlines",
      code: "6E-534",
      status: "Confirmed",
      date: "20 May 2026",
      cost: "₹4,000",
      from: "IXR (Ranchi)",
      gate: "04B",
      seat: "12A",
    },
    {
      id: "b-2",
      type: "hotel",
      title: "Radisson Hotel Ranchi",
      carrier: "Radisson Blu Ranchi",
      code: "RD-99042",
      status: "Active",
      date: "20 May – 24 May 2026",
      cost: "₹3,000",
      address: "Main Road, Ranchi",
      room: "Double Deluxe",
    },
  ]);

  const handleCancelBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b))
    );
    toast.success("Booking cancelled successfully.");
  };

  const [calendarHover, setCalendarHover] = useState<string | null>(null);

  // Document Vault State
  const [documents, setDocuments] = useState<TravelDocument[]>([
    { id: "d-1", name: "Passport_Scan_Copy.pdf", category: "Passport", size: "1.2 MB", date: "2 weeks ago" },
    { id: "d-2", name: "Travel_Insurance_Certificate.pdf", category: "Insurance", size: "840 KB", date: "3 days ago" },
    { id: "d-3", name: "Flight_Ticket_Ranchi.pdf", category: "Ticket", size: "2.1 MB", date: "Yesterday" },
  ]);
  const [docForm, setDocForm] = useState({ name: "", category: "Passport" as TravelDocument["category"] });
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.name.trim()) return;

    const newDoc: TravelDocument = {
      id: `d-${Date.now()}`,
      name: docForm.name.endsWith(".pdf") ? docForm.name.trim() : `${docForm.name.trim()}.pdf`,
      category: docForm.category,
      size: `${(Math.random() * 2 + 0.3).toFixed(1)} MB`,
      date: "Just now",
    };

    setDocuments((prev) => [newDoc, ...prev]);
    setDocForm({ name: "", category: "Passport" });
    setIsDocModalOpen(false);
    toast.success("Document uploaded.");
  };

  // Travel Checklist State
  const [checklist, setChecklist] = useState([
    { id: "c-1", task: "Passport", completed: true },
    { id: "c-2", task: "Flight Tickets", completed: true },
    { id: "c-3", task: "Hotel Booking", completed: true },
    { id: "c-4", task: "Travel Insurance", completed: false },
    { id: "c-5", task: "Local SIM Card", completed: false },
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
  };

  const [weatherCity] = useState("Ranchi");

  // Saved Trips State (dynamically fetched or fallbacks to mocks)
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  // Search Filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Hero form planning fields
  const [heroFrom, setHeroFrom] = useState("");
  const [heroTo, setHeroTo] = useState("");
  const [heroDates, setHeroDates] = useState("");
  const [heroTravelers, setHeroTravelers] = useState(1);

  // Planner Overlay Modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // User details settings
  const [profileName, setProfileName] = useState("Guest");
  const [profileEmail, setProfileEmail] = useState("");

  // Local Storage preferences configuration
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem("voyagr:preferences");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      currency: "INR",
      accommodation: "Hotel",
      transport: "Car",
      style: "Couple" as TravelStyle,
      pace: "Balanced",
      diet: "None",
    };
  });

  // API custom keys
  const [apiKeys, setApiKeys] = useState(() => {
    return {
      groq: localStorage.getItem("voyagr:key_groq") || "",
      gemini: localStorage.getItem("voyagr:key_gemini") || "",
    };
  });

  // Planner Modal extended fields
  const [modalForm, setModalForm] = useState<TripInput>({
    from: "",
    destination: "",
    budget: 10000,
    currency: "INR",
    travelers: 2,
    startDate: "2026-05-20",
    endDate: "2026-05-24",
    days: 5,
    style: "Couple",
    interests: ["Nature"],
    accommodation: "Hotel",
    transport: "Car",
    notes: "",
  });

  // Assistant chatbot state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Support Tickets State
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: "t-1",
      subject: "API Connection issue",
      text: "Getting a connection timeout when generating a trip with Gemini.",
      status: "Closed",
      date: "3 days ago",
      replies: [
        { sender: "agent", text: "Hi Ak, this was a temporary Google server hiccup. It has been resolved. Let us know if it persists!", date: "3 days ago" },
      ],
    },
  ]);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);

  // Mobile menu control
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dark/Light Mode state
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Sync profile details and chatbot welcome message when auth state loads
  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
    } else {
      setProfileName("Guest");
      setProfileEmail("");
    }

    const name = user ? user.name : "Traveler";
    setMessages([
      {
        id: "bot-init",
        sender: "bot",
        text: `Hi ${name}! 👋 I can help you plan your trips, find the best options, manage your bookings, and more. What would you like to do today?`,
      },
    ]);
  }, [user]);

  // Fetch saved trips on mount
  useEffect(() => {
    if (token) {
      setLoadingTrips(true);
      fetch("/api/trips", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data: SavedTrip[]) => {
          setSavedTrips(data);
        })
        .catch(() => {
          setSavedTrips([]);
        })
        .finally(() => {
          setLoadingTrips(false);
        });
    } else {
      setSavedTrips([]);
      setLoadingTrips(false);
    }
  }, [token]);

  // Scroll chatbot to bottom on message change
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Trigger modal planning with hero fields pre-populated, incorporating user preferences
  const handleHeroPlan = (e: React.FormEvent) => {
    e.preventDefault();

    if (!heroFrom.trim()) {
      toast.error("Please enter a departure city.");
      return;
    }
    if (!heroTo.trim()) {
      toast.error("Please enter a destination.");
      return;
    }
    if (!heroDates.trim()) {
      toast.error("Please enter trip dates (e.g. 2026-05-20 - 2026-05-24).");
      return;
    }

    let start = "2026-05-20";
    let end = "2026-05-24";
    if (heroDates.includes(" - ")) {
      const parts = heroDates.split(" - ");
      start = parts[0]?.trim();
      end = parts[1]?.trim();
    }

    const calculatedDays = daysBetween(start, end);

    setModalForm({
      from: heroFrom,
      destination: heroTo,
      budget: heroTo.toLowerCase() === "ranchi" ? 10000 : 25000,
      currency: preferences.currency,
      travelers: heroTravelers,
      startDate: start,
      endDate: end,
      days: calculatedDays,
      style: preferences.style,
      interests: ["Nature", "Adventure"],
      accommodation: preferences.accommodation,
      transport: preferences.transport,
      notes: `Lodging: ${preferences.accommodation}. Transit: ${preferences.transport}. Dietary restrictions: ${preferences.diet}. Travel Pace: ${preferences.pace}.`,
    });

    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKeys.groq) headers["x-groq-key"] = apiKeys.groq;
      if (apiKeys.gemini) headers["x-gemini-key"] = apiKeys.gemini;

      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers,
        body: JSON.stringify(modalForm),
      });

      if (!res.ok) throw new Error("Failed to generate itinerary");

      const { itinerary } = await res.json();
      const tripId = crypto.randomUUID();

      const newTrip: SavedTrip = {
        id: tripId,
        createdAt: Date.now(),
        input: modalForm,
        itinerary,
      };

      sessionStorage.setItem("voyagr:current", JSON.stringify(newTrip));

      if (token) {
        try {
          await fetch("/api/trips", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newTrip),
          });
          toast.success("Trip generated and saved to your dashboard!");
        } catch {
          toast.info("Generated trip saved locally");
        }
      } else {
        const saved = JSON.parse(localStorage.getItem("voyagr:saved") || "[]");
        saved.unshift(newTrip);
        localStorage.setItem("voyagr:saved", JSON.stringify(saved));
        toast.success("Itinerary generated successfully!");
      }

      navigate({ to: "/itinerary" });
    } catch (err) {
      console.error(err);
      toast.error("Error generating trip. Please check your API keys.");
    } finally {
      setModalLoading(false);
      setIsModalOpen(false);
    }
  };

  // Support ticketing submission
  const handleOpenTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDescription.trim()) return;

    const newTicket: SupportTicket = {
      id: `t-${Date.now()}`,
      subject: ticketSubject.trim(),
      text: ticketDescription.trim(),
      status: "Open",
      date: "Just now",
      replies: [],
    };

    setTickets((prev) => [newTicket, ...prev]);
    setActiveTicket(newTicket);
    setTicketSubject("");
    setTicketDescription("");
    toast.success("Support ticket created!");

    // Simulated support response after 1.5 seconds
    setTimeout(() => {
      const responseText = `Hi ${profileName}, thanks for reaching out. We have logged your ticket: "${newTicket.subject}". An Atlas agent has been assigned and is looking into this. Feel free to add any screenshots or notes here!`;
      setTickets((prev) =>
        prev.map((t) =>
          t.id === newTicket.id
            ? {
                ...t,
                replies: [...t.replies, { sender: "agent", text: responseText, date: "Just now" }],
              }
            : t
        )
      );
      setActiveTicket((prev) =>
        prev && prev.id === newTicket.id
          ? {
              ...prev,
              replies: [...prev.replies, { sender: "agent", text: responseText, date: "Just now" }],
            }
          : prev
      );
      toast.info("New message from Support Concierge");
    }, 1500);
  };

  // Support chat ticket reply
  const [ticketReplyText, setTicketReplyText] = useState("");
  const handleSendTicketReply = () => {
    if (!activeTicket || !ticketReplyText.trim()) return;

    const reply = { sender: "user" as const, text: ticketReplyText.trim(), date: "Just now" };
    setTickets((prev) =>
      prev.map((t) => (t.id === activeTicket.id ? { ...t, replies: [...t.replies, reply] } : t))
    );
    setActiveTicket((prev) => (prev ? { ...prev, replies: [...prev.replies, reply] } : null));
    setTicketReplyText("");

    // Simulated reply from Atlas Help Desk
    setTimeout(() => {
      const responseText = "Got it! We have passed this details to the engineering team. We will notify you once we have an update.";
      const botReply = { sender: "agent" as const, text: responseText, date: "Just now" };
      setTickets((prev) =>
        prev.map((t) => (t.id === activeTicket.id ? { ...t, replies: [...t.replies, botReply] } : t))
      );
      setActiveTicket((prev) => (prev ? { ...prev, replies: [...prev.replies, botReply] } : null));
    }, 1200);
  };

  // Save Travel Preferences
  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("voyagr:preferences", JSON.stringify(preferences));
    toast.success("Travel preferences updated! AI will apply this default context.");
  };

  // Save Settings Config
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("voyagr:key_groq", apiKeys.groq.trim());
    localStorage.setItem("voyagr:key_gemini", apiKeys.gemini.trim());
    toast.success("Settings & API keys saved successfully.");
  };

  // Upgrade Pro Simulator Handler
  const handleUpgradeCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardForm.number || !cardForm.name) {
      toast.error("Please fill in card details.");
      return;
    }
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setIsProMember(true);
      localStorage.setItem("voyagr:ispro", "true");
      setCheckoutStep("success");
      toast.success("Welcome to Trip AI Pro!");
    }, 2000);
  };

  // Handle chatbot concierge messages
  const sendChatMessage = async (customMessage?: string) => {
    const userMsg = (customMessage || chatInput).trim();
    if (!userMsg) return;

    if (!customMessage) setChatInput("");
    setChatLoading(true);

    const userMsgId = Math.random().toString();
    setMessages((prev) => [...prev, { id: userMsgId, sender: "user", text: userMsg }]);

    try {
      const res = await fetch("/api/itinerary/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itinerary: "",
          message: userMsg,
          history: messages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to talk to AI assistant");

      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), sender: "bot", text: data.reply || "I am processing your query!" },
      ]);
    } catch (err: any) {
      let replyText = `I would be happy to help you with that! However, it seems the backend is offline. Let me know if you would like me to plan a custom trip to Ranchi, Manali, or Goa instead!`;
      const query = userMsg.toLowerCase();

      if (query.includes("manali") || query.includes("hotel")) {
        replyText = "Manali offers fantastic stays! For budget-friendly options under ₹2,000/night, check out the Riverside Cottages or Zostel Manali. For premium luxury, Wildflower Hall and Solang Valley Resort offer breathtaking mountain backdrops.";
      } else if (query.includes("kerala")) {
        replyText = "The best time to visit Kerala is between October and March when the weather is cool and dry. This period is perfect for cruising backwaters in Alleppey, visiting Munnar tea estates, or relaxing at Kovalam beach.";
      } else if (query.includes("europe") || query.includes("itinerary")) {
        replyText = "An itinerary for Europe sounds exciting! A classic 10-day trip could cover Rome, Florence, and Venice. Or, explore Western Europe covering Paris, Amsterdam, and Brussels. Would you like a detailed day-by-day plan?";
      } else if (query.includes("ranchi") || query.includes("weekend")) {
        replyText = "Ranchi has beautiful waterfalls! A perfect weekend getaway could start with visiting Hundru Falls on Day 1, followed by sunset at Patratu Valley. Day 2 is perfect for Pahari Mandir and shopping for local wooden handicrafts.";
      }

      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), sender: "bot", text: replyText },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSuggestionClick = (text: string) => {
    sendChatMessage(text);
  };

  const handleViewTrip = (trip: SavedTrip) => {
    sessionStorage.setItem("voyagr:current", JSON.stringify(trip));
    navigate({ to: "/itinerary" });
  };

  const filteredTrips = savedTrips.filter((t) => {
    const term = searchQuery.toLowerCase();
    return (
      t.input.from.toLowerCase().includes(term) ||
      t.input.destination.toLowerCase().includes(term) ||
      (t.input.notes && t.input.notes.toLowerCase().includes(term))
    );
  });

  return (
    <div className={`relative min-h-screen bg-[#0f172a] text-foreground flex ${isDarkMode ? "dark" : ""}`}>
      {/* Background neon visual grids */}
      <div className="glow-orb glow-orb-primary top-[-100px] left-[-50px] size-[500px]" />
      <div className="glow-orb glow-orb-secondary bottom-[-200px] right-[-100px] size-[600px]" />

      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800 bg-[#0b0f19] h-screen sticky top-0 shrink-0 select-none">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="group flex items-center gap-3">
            <div className="shrink-0 overflow-hidden rounded-xl border border-slate-850 bg-white p-1 shadow-md transition-transform duration-300 group-hover:scale-105">
              <img src="/logo.png" alt="Trip AI Logo" className="size-8 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-md font-black tracking-tight text-white flex items-center leading-none">
                Trip
                <span className="text-[#10b981] ml-0.5">
                  AI
                </span>
              </span>
              <span className="text-[6.5px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                Plan here, book anywhere
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {[
            { name: "Home", icon: Home },
            { name: "Bookings", icon: Plane },
            { name: "Calendar", icon: Calendar },
            { name: "Documents", icon: FileText },
            { name: "Preferences", icon: Sliders },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActiveTab(item.name);
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === item.name
                  ? "text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent"
              }`}
            >
              <item.icon className="size-4.5" />
              {item.name}
            </button>
          ))}
          <Link
            to="/saved"
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/40"
          >
            <Bookmark className="size-4.5" />
            Saved Trips
          </Link>
        </nav>

        {/* Upgrade Card / Premium VIP Member Widget */}
        <div className="px-4 py-4">
          {isProMember ? (
            <div className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-amber-500/5 p-4 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
              <div className="relative">
                <span className="absolute top-0 right-0 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-2.5 py-0.5 text-[8px] font-bold text-yellow-400 uppercase tracking-widest animate-pulse">
                  VIP
                </span>
                <h4 className="text-sm font-bold text-yellow-400 flex items-center gap-1.5">
                  ⭐ Pro Member
                </h4>
                <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                  You have unlimited AI trip generations, priority support, and premium layouts active!
                </p>
                <div className="mt-3 flex items-center justify-between text-[8px] text-yellow-500 font-bold border-t border-yellow-500/10 pt-2.5">
                  <span>BILLING ACTIVE</span>
                  <span>RENUES MAY 2027</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-[#10b981]/25 bg-gradient-to-br from-[#10b981]/15 to-[#34d399]/5 p-4 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
              <div className="absolute inset-0 bg-white/[0.01] backdrop-blur-[2px] -z-10" />
              <div className="relative">
                <span className="absolute top-0 right-0 bg-[#10b981]/20 border border-[#10b981]/30 rounded-full px-2 py-0.5 text-[8px] font-bold text-[#10b981]">
                  PRO
                </span>
                <h4 className="text-sm font-bold text-white">Upgrade to Pro</h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Unlock exclusive features and get the best travel experience.
                </p>
                <button
                  onClick={() => {
                    setCheckoutStep("pricing");
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full mt-3 rounded-xl bg-gradient-to-r from-[#10b981] to-[#34d399] text-[#0f172a] text-xs font-extrabold py-2 shadow-glow hover:brightness-110 transition-all duration-300 cursor-pointer"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 space-y-1">
          <button
            onClick={() => setActiveTab("Settings")}
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "Settings" ? "text-[#10b981] bg-[#10b981]/5" : "text-slate-400 hover:text-white"
            }`}
          >
            <Settings className="size-4" />
            Settings
          </button>
          <button
            onClick={() => setActiveTab("Help & Support")}
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "Help & Support" ? "text-[#10b981] bg-[#10b981]/5" : "text-slate-400 hover:text-white"
            }`}
          >
            <HelpCircle className="size-4" />
            Help & Support
          </button>

          {/* Dark Mode Switcher */}
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-2">
              <Moon className="size-3.5" /> Dark Mode
            </span>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[#10b981]/25 transition-colors duration-200 ease-in-out focus:outline-none"
            >
              <span
                className={`pointer-events-none inline-block size-4 transform rounded-full bg-[#10b981] shadow ring-0 transition duration-200 ease-in-out ${
                  isDarkMode ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0f172a]/90 backdrop-blur-xl shrink-0 select-none">
          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800"
            >
              <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Trip AI Logo" className="size-6 object-contain" />
              <span className="text-sm font-black text-white">
                Trip<span className="text-[#10b981]">AI</span>
              </span>
            </Link>
          </div>

          {/* Title Banner or Search based on tab */}
          {activeTab === "Home" ? (
            <div className="relative hidden md:block w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search trips, destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-12 py-2 rounded-xl bg-slate-850 border border-slate-800 text-xs text-white placeholder:text-slate-450 focus:outline-none focus:border-[#10b981] focus:bg-slate-800 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 border border-slate-800 rounded px-1.5 py-0.5 text-[8px] font-bold text-slate-400 bg-slate-900">
                ⌘ K
              </span>
            </div>
          ) : (
            <div className="text-left font-bold text-sm text-slate-400 flex items-center gap-2">
              <span>Dashboard</span>
              <ChevronRight className="size-3.5" />
              <span className="text-white font-extrabold">{activeTab}</span>
            </div>
          )}

          {/* Profile controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setHeroFrom("");
                setHeroTo("");
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#10b981] to-[#34d399] text-[#0f172a] text-xs font-black px-4 py-2.5 shadow-glow hover:brightness-110 transition-all duration-300 shrink-0 cursor-pointer"
            >
              <Plus className="size-3.5" /> Plan New Trip
            </button>

            <button
              onClick={() => toast.info("No new notifications")}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-all duration-300 relative shrink-0"
            >
              <Bell className="size-4" />
              <span className="absolute top-1 right-1 size-1.5 rounded-full bg-[#10b981]" />
            </button>

            {/* User Profile Info / Sign In Button */}
            {user ? (
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
                <div className="shrink-0 overflow-hidden rounded-full border border-[#10b981]/30 size-9 bg-card">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
                    alt="Profile"
                    className="size-full object-cover"
                  />
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight max-w-[120px]">
                  <span className="text-xs font-bold text-white flex items-center gap-1 truncate">
                    {profileName} {isProMember && <span className="text-[7px] text-yellow-500 font-extrabold tracking-wide uppercase">Pro</span>}
                  </span>
                  <span className="text-[9px] text-slate-400 font-semibold">Traveler</span>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors ml-1"
                >
                  <LogOut className="size-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white text-xs font-extrabold px-4 py-2.5 transition-colors shrink-0"
              >
                Sign In
              </Link>
            )}
          </div>
        </header>

        {/* Scrollable Dashboard Grid */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {activeTab === "Home" && (
            <>
              {/* 1. Hero Mountains Banner */}
              <section className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl h-[280px] sm:h-[320px] flex flex-col justify-end p-6 md:p-8 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80')` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
                <div className="absolute inset-0 bg-black/25 pointer-events-none" />

                <div className="relative z-10 w-full max-w-4xl space-y-6">
                  <div>
                    <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                      Where to next?
                    </h1>
                    <p className="text-sm md:text-md text-white/95 mt-1 font-semibold tracking-wide drop-shadow-sm">
                      Let AI craft your perfect journey
                    </p>
                  </div>

                  {/* Floating Form */}
                  <form onSubmit={handleHeroPlan} className="grid grid-cols-2 md:grid-cols-[1.1fr_1.1fr_1.4fr_1fr_auto] gap-2 md:gap-3 p-2 bg-slate-900/90 border border-slate-800 rounded-2xl backdrop-blur-md shadow-2xl items-center w-full">
                    <div className="flex flex-col text-left px-3 py-1 bg-slate-800/20 border border-slate-850 rounded-xl">
                      <span className="text-[8px] font-bold text-[#10b981] uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="size-2" /> From
                      </span>
                      <input
                        type="text"
                        required
                        value={heroFrom}
                        onChange={(e) => setHeroFrom(e.target.value)}
                        placeholder="Departure"
                        className="w-full bg-transparent text-xs text-white font-semibold placeholder:text-slate-500 focus:outline-none mt-0.5"
                      />
                    </div>

                    <div className="flex flex-col text-left px-3 py-1 bg-slate-800/20 border border-slate-850 rounded-xl">
                      <span className="text-[8px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="size-2 text-[#34d399]" /> To
                      </span>
                      <input
                        type="text"
                        required
                        value={heroTo}
                        onChange={(e) => setHeroTo(e.target.value)}
                        placeholder="Destination"
                        className="w-full bg-transparent text-xs text-white font-semibold placeholder:text-slate-500 focus:outline-none mt-0.5"
                      />
                    </div>

                    <div className="flex flex-col text-left px-3 py-1 bg-slate-800/20 border border-slate-850 rounded-xl col-span-2 md:col-span-1">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="size-2 text-amber-500" /> Dates
                      </span>
                      <input
                        type="text"
                        required
                        value={heroDates}
                        onChange={(e) => setHeroDates(e.target.value)}
                        placeholder="20 May – 24 May"
                        className="w-full bg-transparent text-xs text-white font-semibold placeholder:text-slate-500 focus:outline-none mt-0.5"
                      />
                    </div>

                    <div className="flex flex-col text-left px-3 py-1 bg-slate-800/20 border border-slate-850 rounded-xl col-span-2 md:col-span-1">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Users className="size-2 text-[#10b981]" /> Travelers
                      </span>
                      <select
                        value={heroTravelers}
                        onChange={(e) => setHeroTravelers(Number(e.target.value))}
                        className="w-full bg-transparent text-xs text-white font-semibold focus:outline-none mt-0.5 cursor-pointer border-none p-0"
                      >
                        <option value={1} className="bg-[#0f172a]">1 Traveler</option>
                        <option value={2} className="bg-[#0f172a]">2 Travelers</option>
                        <option value={3} className="bg-[#0f172a]">3 Travelers</option>
                        <option value={4} className="bg-[#0f172a]">4 Travelers</option>
                        <option value={5} className="bg-[#0f172a]">5+ Travelers</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="size-11 rounded-xl bg-gradient-to-tr from-[#10b981] to-[#34d399] text-[#0f172a] hover:brightness-110 flex items-center justify-center shadow-glow transition-all shrink-0 cursor-pointer col-span-2 md:col-span-1 justify-self-center md:justify-self-start mt-2 md:mt-0"
                    >
                      <ArrowRight className="size-5" />
                    </button>
                  </form>
                </div>
              </section>

              {/* 2. Pillars section */}
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
                {[
                  { title: "AI-Powered Plans", desc: "Customized itineraries in seconds", icon: Sparkles, color: "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20" },
                  { title: "Best Options", desc: "Top flights, hotels & activities", icon: Compass, color: "text-[#34d399] bg-[#34d399]/10 border-[#34d399]/20" },
                  { title: "Book Anywhere", desc: "You book, we guide", icon: Wallet, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
                  { title: "Smart Budgeting", desc: "Plan smart, spend smart", icon: TrendingUp, color: "text-indigo-400 bg-indigo-400/10 border-indigo-450/20" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/40 border border-slate-800 shadow-soft hover:border-slate-700 transition-all duration-300">
                    <div className={`p-3 rounded-xl border ${p.color} shrink-0`}>
                      <p.icon className="size-4.5" />
                    </div>
                    <div className="text-left leading-tight min-w-0">
                      <h5 className="text-xs font-bold text-white truncate">{p.title}</h5>
                      <p className="text-[9px] text-slate-400 mt-0.5 truncate">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </section>

              {/* 3. Trips & Assistant Grid */}
              <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Left 2/3: Saved Trips list */}
                <div className="xl:col-span-2 space-y-4 flex flex-col">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 select-none">
                    <h3 className="text-lg font-bold text-white tracking-tight">Your Saved Trips</h3>
                    <Link to="/saved" className="text-xs font-bold text-slate-400 hover:text-[#10b981] transition-colors flex items-center gap-1">
                      View All <ChevronRight className="size-3" />
                    </Link>
                  </div>

                  {!user ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 gap-4 rounded-2xl bg-slate-900/20 border border-dashed border-slate-800 text-center">
                      <Bookmark className="size-8 text-[#10b981]" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">Sign in to view your saved trips</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                          Keep your generated itineraries synchronised in the cloud and access them from any device.
                        </p>
                      </div>
                      <Link
                        to="/login"
                        className="rounded-xl bg-[#10b981] hover:brightness-110 text-[#0f172a] text-xs font-bold px-5 py-2.5 shadow-glow transition-all"
                      >
                        Sign In Now
                      </Link>
                    </div>
                  ) : loadingTrips ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-2.5">
                      <Loader2 className="size-6 animate-spin text-[#10b981]" />
                      <span className="text-xs text-slate-400 font-semibold">Retrieving your trips...</span>
                    </div>
                  ) : filteredTrips.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl bg-slate-900/20 border border-dashed border-slate-800">
                      <Bookmark className="size-8 text-slate-500" />
                      <p className="text-xs text-slate-400">No saved trips found. Try planning a new trip above!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTrips.map((trip) => {
                        const tag = trip.id.startsWith("mock-1") ? "Upcoming" : trip.id.startsWith("mock-2") ? "Saved" : "Draft";
                        const badgeColor = tag === "Upcoming" ? "bg-green-500/10 text-green-400 border-green-500/20" : tag === "Saved" ? "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20";
                        const imgUrl = trip.input.destination.toLowerCase() === "ranchi" ? "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=150&h=150&q=70" : trip.input.destination.toLowerCase() === "manali" ? "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=150&h=150&q=70" : "https://images.unsplash.com/photo-1596761301588-915ccaec3e83?auto=format&fit=crop&w=150&h=150&q=70";

                        return (
                          <article key={trip.id} className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 p-4 flex flex-col sm:flex-row gap-4 hover:border-slate-700 transition-all duration-300">
                            <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden bg-slate-800 shrink-0 relative">
                              <img src={imgUrl} alt={trip.input.destination} className="size-full object-cover" />
                              <span className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[8px] font-bold border ${badgeColor}`}>
                                {tag}
                              </span>
                            </div>

                            <div className="flex-1 flex flex-col justify-between text-left min-w-0">
                              <div>
                                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                                  {trip.input.from} <ArrowRight className="size-3 text-slate-550" /> {trip.input.destination}
                                </h4>
                                <p className="text-[10px] text-slate-450 mt-0.5">
                                  {trip.input.startDate ? new Date(trip.input.startDate).toLocaleDateString("en-US", { day: "numeric", month: "short" }) : "May 20"} – {trip.input.endDate ? new Date(trip.input.endDate).toLocaleDateString("en-US", { day: "numeric", month: "short" }) : "May 24"} · {trip.input.travelers} Travelers
                                </p>
                                <p className="text-xs text-slate-400 mt-2 line-clamp-1 italic">
                                  "{trip.input.notes || `Explore the beautiful vistas of ${trip.input.destination}.`}"
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-3 mt-3 border-t border-slate-800 pt-2">
                                <div className="flex gap-4 text-[10px] text-slate-400 font-semibold">
                                  <span>⏱️ {trip.input.days} Days</span>
                                  <span>💰 {trip.input.currency === "INR" ? "₹" : "$"}{trip.input.budget.toLocaleString()}</span>
                                  <span>👥 {trip.input.style}</span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleViewTrip(trip)}
                                    className="rounded-lg bg-[#10b981]/10 hover:bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/20 text-[10px] font-extrabold px-3 py-1.5 transition-colors cursor-pointer"
                                  >
                                    View Itinerary
                                  </button>
                                  <button
                                    onClick={() => toast.info("No options available")}
                                    className="p-1.5 rounded-lg border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                                  >
                                    <MoreHorizontal className="size-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right 1/3: Trip AI Assistant Chatbot */}
                <div className="space-y-4 flex flex-col h-full">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-2 select-none">
                    <Sparkles className="size-4.5 text-[#10b981]" />
                    <h3 className="text-lg font-bold text-white tracking-tight text-left">Trip AI Assistant</h3>
                  </div>

                  <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900/40 p-4 flex flex-col h-[400px] overflow-hidden">
                    <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin">
                      {messages.map((m) => {
                        const isBot = m.sender === "bot";
                        return (
                          <div key={m.id} className={`flex gap-2.5 text-left items-start ${!isBot ? "flex-row-reverse" : ""}`}>
                            <div className={`shrink-0 overflow-hidden rounded-full border size-7.5 bg-card ${isBot ? "border-[#10b981]/30 p-0.5" : "border-slate-700"}`}>
                              <img
                                src={isBot ? "/logo.png" : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"}
                                alt={isBot ? "AI" : "User"}
                                className="size-full object-contain rounded-full"
                              />
                            </div>
                            <div className={`rounded-2xl px-3 py-2 text-xs max-w-[80%] leading-relaxed ${
                              isBot ? "bg-slate-800/40 text-slate-100 border border-slate-800" : "bg-[#10b981] text-[#0f172a] font-semibold"
                            }`}>
                              {m.text}
                            </div>
                          </div>
                        );
                      })}
                      {chatLoading && (
                        <div className="flex gap-2.5 items-center text-left">
                          <div className="shrink-0 overflow-hidden rounded-full border border-[#10b981]/30 size-7.5 bg-card p-0.5">
                            <img src="/logo.png" alt="AI" className="size-full object-contain rounded-full" />
                          </div>
                          <div className="flex items-center gap-1 bg-slate-800/40 border border-slate-800 rounded-2xl px-3 py-2.5">
                            <span className="size-1.5 rounded-full bg-[#10b981] animate-bounce [animation-delay:-0.3s]" />
                            <span className="size-1.5 rounded-full bg-[#10b981] animate-bounce [animation-delay:-0.15s]" />
                            <span className="size-1.5 rounded-full bg-[#10b981] animate-bounce" />
                          </div>
                        </div>
                      )}
                      <div ref={chatBottomRef} />
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-1.5 text-left border-t border-slate-800 pt-3">
                      {[
                        "Plan a weekend trip",
                        "Find budget hotels in Manali",
                        "Best time to visit Kerala",
                        "Create an itinerary for Europe",
                      ].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSuggestionClick(s)}
                          className="text-[10px] text-slate-400 hover:text-white font-semibold bg-slate-800/20 border border-slate-800 hover:border-[#10b981]/30 px-2.5 py-1.5 rounded-xl transition-all text-left truncate cursor-pointer"
                        >
                          💡 {s}
                        </button>
                      ))}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask me anything..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") sendChatMessage();
                        }}
                        className="flex-1 bg-slate-800/40 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#10b981]/50 focus:bg-slate-800 transition-all"
                      />
                      <button
                        onClick={() => sendChatMessage()}
                        className="size-8.5 bg-[#10b981] rounded-xl text-[#0f172a] hover:brightness-110 flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-glow animate-pulse"
                      >
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Popular Destinations Grid */}
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 select-none">
                  <h3 className="text-lg font-bold text-white tracking-tight">Popular Destinations</h3>
                  <span className="text-xs font-bold text-slate-400 hover:text-[#10b981] transition-colors flex items-center gap-1 cursor-pointer">
                    Explore All <ChevronRight className="size-3" />
                  </span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: "Manali", desc: "Himachal Pradesh", price: "12,500", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=300&q=70" },
                    { name: "Goa", desc: "Beach Paradise", price: "8,200", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=70" },
                    { name: "Kerala", desc: "God's Own Country", price: "9,800", img: "https://images.unsplash.com/photo-1596761301588-915ccaec3e83?auto=format&fit=crop&w=300&q=70" },
                    { name: "Ladakh", desc: "Land of High Passes", price: "15,900", img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=300&q=70" },
                  ].map((d) => (
                    <article
                      key={d.name}
                      onClick={() => {
                        setHeroTo(d.name);
                        toast.success(`Selected destination: ${d.name}`);
                      }}
                      className="group cursor-pointer relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/30 shadow-xl transition-all duration-500 hover:border-[#10b981]/30 hover:shadow-glow hover:-translate-y-1"
                    >
                      <div className="h-40 overflow-hidden relative">
                        <img src={d.img} alt={d.name} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent pointer-events-none" />
                      </div>
                      <div className="p-4 text-left relative z-10 leading-tight">
                        <h4 className="text-sm font-bold text-white group-hover:text-[#10b981] transition-colors">{d.name}</h4>
                        <p className="text-[10px] text-slate-450 mt-0.5">{d.desc}</p>
                        <div className="flex items-center justify-between mt-3.5 border-t border-slate-800 pt-2">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Starting</span>
                          <span className="text-xs font-black text-white">₹{d.price}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* 5. Bottom widgets row */}
              <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                
                {/* Donut Budget chart */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 flex flex-col h-[340px]">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 select-none">
                    <h4 className="text-sm font-bold text-white">Budget Overview</h4>
                    <TrendingUp className="size-4 text-[#10b981]" />
                  </div>

                  <div className="flex-1 flex items-center justify-center py-4 relative">
                    <svg className="size-40 transform -rotate-90">
                      <circle cx="80" cy="80" r="40" stroke="var(--color-primary)" strokeWidth="14" fill="transparent" strokeDasharray="100.48 251.2" strokeDashoffset="0" />
                      <circle cx="80" cy="80" r="40" stroke="var(--color-secondary)" strokeWidth="14" fill="transparent" strokeDasharray="75.36 251.2" strokeDashoffset="-100.48" />
                      <circle cx="80" cy="80" r="40" stroke="var(--color-chart-5)" strokeWidth="14" fill="transparent" strokeDasharray="37.68 251.2" strokeDashoffset="-175.84" />
                      <circle cx="80" cy="80" r="40" stroke="var(--color-chart-4)" strokeWidth="14" fill="transparent" strokeDasharray="25.12 251.2" strokeDashoffset="-213.52" />
                      <circle cx="80" cy="80" r="40" stroke="#10b981" strokeWidth="14" fill="transparent" strokeDasharray="12.56 251.2" strokeDashoffset="-238.64" />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center leading-tight">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                      <span className="text-md font-black text-white">₹10,000</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-y-1.5 gap-x-2 text-[10px] text-slate-450 font-semibold border-t border-slate-800 pt-3">
                    <div className="flex items-center gap-1.5 truncate"><span className="size-2 rounded bg-[#10b981] shrink-0" /> Transport 40%</div>
                    <div className="flex items-center gap-1.5 truncate"><span className="size-2 rounded bg-[#34d399] shrink-0" /> Stay 30%</div>
                    <div className="flex items-center gap-1.5 truncate"><span className="size-2 rounded bg-[var(--color-chart-5)] shrink-0" /> Food 15%</div>
                    <div className="flex items-center gap-1.5 truncate"><span className="size-2 rounded bg-[var(--color-chart-4)] shrink-0" /> Activities 10%</div>
                    <div className="flex items-center gap-1.5 truncate"><span className="size-2 rounded bg-emerald-500 shrink-0" /> Others 5%</div>
                  </div>
                </div>

                {/* Travel checklist */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 flex flex-col h-[340px]">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 select-none">
                    <h4 className="text-sm font-bold text-white">Travel Checklist</h4>
                    <span className="text-[9px] text-[#10b981] font-bold">INTERACTIVE</span>
                  </div>

                  <div className="flex-1 py-4 space-y-3 overflow-y-auto">
                    {checklist.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800/30 bg-slate-800/10 hover:bg-slate-800/30 transition-all cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleChecklist(item.id)}
                            className="rounded border-slate-700 text-primary focus:ring-primary size-4 cursor-pointer"
                          />
                          <span className={`text-xs font-semibold ${item.completed ? "text-slate-450 line-through" : "text-white"}`}>
                            {item.task}
                          </span>
                        </div>
                        {item.completed && <CheckCircle2 className="size-4 text-green-500 shrink-0" />}
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      const pending = checklist.filter((c) => !c.completed).length;
                      toast.info(`You have ${pending} tasks pending before your trip!`);
                    }}
                    className="w-full rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800 text-xs font-extrabold py-2 transition-colors cursor-pointer text-white"
                  >
                    Check Checklist Status
                  </button>
                </div>

                {/* Ranchi Weather widget */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-5 flex flex-col h-[340px] md:col-span-2 xl:col-span-1">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 select-none">
                    <h4 className="text-sm font-bold text-white">Weather in {weatherCity}</h4>
                    <Cloud className="size-4 text-[#34d399]" />
                  </div>

                  <div className="flex-1 flex items-center justify-between py-4 select-none">
                    <div className="text-left">
                      <div className="text-4xl font-black text-white">28°C</div>
                      <div className="text-xs text-slate-405 font-semibold mt-1">Partly Cloudy</div>
                      <div className="flex gap-4 text-[10px] text-slate-450 font-medium mt-3">
                        <span>💧 Hum: 65%</span>
                        <span>💨 Wind: 12 km/h</span>
                      </div>
                    </div>
                    <div className="relative shrink-0 pr-4">
                      <SunDim className="size-16 text-yellow-500 animate-pulse" />
                      <Cloud className="size-10 text-white/80 absolute bottom-[-4px] right-[-6px]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5 border-t border-slate-800 pt-3 pb-2 select-none">
                    {[
                      { day: "Mon", temp: "28°", icon: SunDim, color: "text-yellow-500" },
                      { day: "Tue", temp: "26°", icon: Cloud, color: "text-sky-400" },
                      { day: "Wed", temp: "27°", icon: CloudRain, color: "text-indigo-400" },
                      { day: "Thu", temp: "29°", icon: SunDim, color: "text-yellow-500" },
                      { day: "Fri", temp: "30°", icon: SunDim, color: "text-yellow-500" },
                    ].map((f, i) => (
                      <div key={i} className="flex flex-col items-center bg-slate-800/10 border border-slate-800 rounded-lg py-2">
                        <span className="text-[9px] font-bold text-slate-400">{f.day}</span>
                        <f.icon className={`size-4.5 my-1.5 ${f.color}`} />
                        <span className="text-[10px] font-extrabold text-white">{f.temp}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => toast.info("Weather forecast updated for Ranchi region.")}
                    className="w-full rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800 text-xs font-extrabold py-2 transition-colors cursor-pointer mt-2 text-white"
                  >
                    More Details
                  </button>
                </div>
              </section>

              {/* 6. Footer Banner CTA */}
              <section className="relative overflow-hidden rounded-3xl border border-[#10b981]/20 bg-gradient-to-r from-[#10b981]/15 to-[#34d399]/15 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                <div className="absolute inset-0 bg-white/[0.01] backdrop-blur-[1px] -z-10" />
                <div className="text-left space-y-1">
                  <h2 className="text-lg md:text-xl font-black text-white">Plan here, book anywhere</h2>
                  <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                    We find the best options, you book what works for you. Safe, customized, and smart itineraries.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-xl bg-[#10b981] hover:brightness-110 text-[#0f172a] text-xs font-extrabold px-6 py-3 transition-all shrink-0 cursor-pointer shadow-glow flex items-center gap-2"
                >
                  Plan Your Next Trip <ArrowRight className="size-4" />
                </button>
              </section>
            </>
          )}

          {/* Bookings sub-view */}
          {activeTab === "Bookings" && (
            <div className="space-y-6 text-left max-w-4xl">
              <div>
                <h2 className="text-xl font-black text-white">Active Bookings</h2>
                <p className="text-xs text-slate-400 mt-1">Manage and view your flight and hotel confirmations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.map((b) => (
                  <div key={b.id} className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 flex flex-col justify-between h-[220px]">
                    <div className="p-5 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold border ${
                          b.status === "Confirmed" || b.status === "Active"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                          {b.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{b.date}</span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-md font-extrabold text-white flex items-center gap-2">
                          {b.type === "flight" ? "✈️" : "🏨"} {b.title}
                        </h4>
                        <p className="text-xs text-slate-400">{b.carrier} ({b.code})</p>
                      </div>

                      {b.type === "flight" ? (
                        <div className="grid grid-cols-3 gap-2 text-xs font-bold pt-2 border-t border-slate-800">
                          <div>
                            <span className="text-[8px] text-slate-400 block uppercase">Route</span>
                            <span className="text-white">{b.from}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-400 block uppercase">Gate</span>
                            <span className="text-white">{b.gate}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-400 block uppercase">Seat</span>
                            <span className="text-white">{b.seat}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2 border-t border-slate-800">
                          <div>
                            <span className="text-[8px] text-slate-400 block uppercase">Address</span>
                            <span className="text-white truncate block max-w-[120px]">{b.address}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-400 block uppercase">Room Type</span>
                            <span className="text-white">{b.room}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-800/40 border-t border-slate-800 px-5 py-3 flex items-center justify-between">
                      <div className="flex gap-0.5 h-6 w-32 bg-slate-900 px-1 py-1 rounded">
                        {Array.from({ length: 28 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="h-full bg-slate-400"
                            style={{ width: idx % 3 === 0 ? "3px" : idx % 5 === 0 ? "1px" : "1.5px" }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold text-white">{b.cost}</span>
                        {b.status !== "Cancelled" && (
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[9px] font-extrabold px-2.5 py-1.5 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calendar sub-view */}
          {activeTab === "Calendar" && (
            <div className="space-y-6 text-left max-w-4xl select-none">
              <div>
                <h2 className="text-xl font-black text-white">Travel Calendar</h2>
                <p className="text-xs text-slate-400 mt-1">Timeline of your upcoming trips and draft schedules.</p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold text-white">May 2026</h3>
                  <div className="flex gap-4 text-[10px] text-slate-400 font-bold">
                    <span className="flex items-center gap-1.5"><span className="size-2 rounded bg-[#10b981]" /> Ranchi (Confirmed)</span>
                    <span className="flex items-center gap-1.5"><span className="size-2 rounded bg-secondary" /> Manali (Saved)</span>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-400 uppercase border-b border-slate-800 pb-2">
                  <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center mt-3 text-xs font-bold">
                  <span className="py-3 text-slate-600/30">26</span>
                  <span className="py-3 text-slate-600/30">27</span>
                  <span className="py-3 text-slate-600/30">28</span>
                  <span className="py-3 text-slate-600/30">29</span>
                  <span className="py-3 text-slate-600/30">30</span>
                  
                  {Array.from({ length: 31 }).map((_, idx) => {
                    const day = idx + 1;
                    const isRanchi = day >= 20 && day <= 24;
                    const isManali = day >= 10 && day <= 16;

                    let bgClass = "hover:bg-slate-800/40 border border-transparent";
                    if (isRanchi) {
                      bgClass = "bg-[#10b981]/20 border border-[#10b981]/40 text-[#10b981] cursor-pointer shadow-[0_0_8px_rgba(16,185,129,0.15)]";
                    } else if (isManali) {
                      bgClass = "bg-secondary/20 border border-secondary/40 text-secondary cursor-pointer";
                    }

                    return (
                      <div
                        key={day}
                        onMouseEnter={() => {
                          if (isRanchi) setCalendarHover("Ranchi Getaway (20-24 May): 2 Travelers, Musabani departure.");
                          if (isManali) setCalendarHover("Manali Trip Plan (10-16 Jun): Family plan from Delhi.");
                        }}
                        onMouseLeave={() => setCalendarHover(null)}
                        className={`py-3.5 rounded-xl transition-all relative ${bgClass}`}
                      >
                        {day}
                        {isRanchi && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-[#10b981]" />}
                        {isManali && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-secondary" />}
                      </div>
                    );
                  })}
                  <span className="py-3 text-slate-600/30">1</span>
                  <span className="py-3 text-slate-600/30">2</span>
                  <span className="py-3 text-slate-600/30">3</span>
                </div>

                {calendarHover && (
                  <div className="mt-5 p-3 rounded-xl border border-[#10b981]/20 bg-[#10b981]/10 text-xs font-semibold text-white text-center animate-in fade-in duration-200">
                    ℹ️ {calendarHover}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Documents sub-view */}
          {activeTab === "Documents" && (
            <div className="space-y-6 text-left max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-white">Document Vault</h2>
                  <p className="text-xs text-slate-400 mt-1">Keep digital copies of your passport, flight tickets, and visa letters safe.</p>
                </div>
                <button
                  onClick={() => setIsDocModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#10b981]/10 hover:bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/20 text-xs font-extrabold px-4 py-2.5 transition-colors cursor-pointer"
                >
                  <UploadCloud className="size-4" /> Upload Document
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/40 flex flex-col justify-between h-[140px] hover:border-slate-700 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] shrink-0">
                        <File className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{doc.name}</h4>
                        <span className="text-[8px] text-slate-400 bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 mt-1.5 inline-block uppercase font-bold">{doc.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-[10px] text-slate-400 font-semibold">
                      <span>{doc.size} · {doc.date}</span>
                      <button
                        onClick={() => toast.success(`Downloading ${doc.name}`)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Download className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {isDocModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                  <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-[#0d0f1f] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                    <div className="text-left space-y-1 mb-4">
                      <h4 className="text-md font-black text-white font-outfit">Upload Document</h4>
                      <p className="text-xs text-slate-400 font-medium">Add a digital scan of your travel document.</p>
                    </div>
                    <form onSubmit={handleAddDocument} className="space-y-4 text-left font-sans">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Document Name</label>
                        <input
                          type="text"
                          required
                          value={docForm.name}
                          onChange={(e) => setDocForm((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Visa_Approval_Letter"
                          className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10b981] font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Category</label>
                        <select
                          value={docForm.category}
                          onChange={(e) => setDocForm((prev) => ({ ...prev, category: e.target.value as TravelDocument["category"] }))}
                          className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#10b981] cursor-pointer"
                        >
                          <option value="Passport">Passport Copy</option>
                          <option value="Visa">Visa Letter</option>
                          <option value="Ticket">E-Ticket PDF</option>
                          <option value="Insurance">Travel Insurance</option>
                          <option value="Other">Other Docs</option>
                        </select>
                      </div>
                      <div className="flex gap-3 pt-3">
                        <button
                          type="button"
                          onClick={() => setIsDocModalOpen(false)}
                          className="flex-1 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold hover:bg-slate-700 text-slate-350 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2 rounded-xl bg-[#10b981] text-[#0f172a] text-xs font-black hover:brightness-115 shadow-glow cursor-pointer"
                        >
                          Upload
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preferences sub-view */}
          {activeTab === "Preferences" && (
            <div className="space-y-6 text-left max-w-2xl select-none">
              <div>
                <h2 className="text-xl font-black text-white">Travel Preferences</h2>
                <p className="text-xs text-slate-400 mt-1">AI will automatically utilize these default settings when planning new itineraries.</p>
              </div>

              <form onSubmit={handleSavePreferences} className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Preferred Lodging</label>
                    <select
                      value={preferences.accommodation}
                      onChange={(e) => setPreferences((prev: any) => ({ ...prev, accommodation: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      {ACCOMMODATION_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Preferred Transit</label>
                    <select
                      value={preferences.transport}
                      onChange={(e) => setPreferences((prev: any) => ({ ...prev, transport: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      {TRANSPORT_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Travel Style</label>
                    <select
                      value={preferences.style}
                      onChange={(e) => setPreferences((prev: any) => ({ ...prev, style: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      {STYLE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Preferred Currency</label>
                    <select
                      value={preferences.currency}
                      onChange={(e) => setPreferences((prev: any) => ({ ...prev, currency: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      {CURRENCY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Travel Pace</label>
                    <select
                      value={preferences.pace}
                      onChange={(e) => setPreferences((prev: any) => ({ ...prev, pace: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="Relaxed">Slow (Relaxed)</option>
                      <option value="Balanced">Medium (Balanced)</option>
                      <option value="Fast">Fast (Sightseeing-heavy)</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Dietary Preference</label>
                    <select
                      value={preferences.diet}
                      onChange={(e) => setPreferences((prev: any) => ({ ...prev, diet: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="None">None</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Halal">Halal</option>
                      <option value="Kosher">Kosher</option>
                      <option value="Gluten-Free">Gluten-Free</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-3 rounded-xl bg-[#10b981] text-[#0f172a] text-xs font-black py-2.5 shadow-glow hover:brightness-110 transition-all cursor-pointer"
                >
                  Save Travel Preferences
                </button>
              </form>
            </div>
          )}

          {/* Settings sub-view */}
          {activeTab === "Settings" && (
            <div className="space-y-6 text-left max-w-2xl select-none">
              <div>
                <h2 className="text-xl font-black text-white font-outfit">Account Settings</h2>
                <p className="text-xs text-slate-400 mt-1 font-semibold">Update your profile parameters and custom API credentials.</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); toast.success("Profile parameters updated!"); }} className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2.5 mb-2.5">
                  <UserCheck className="size-4 text-[#10b981]" /> Profile Parameters
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Display Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="bg-slate-800 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white font-semibold focus:outline-none focus:border-[#10b981]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="bg-slate-800 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white font-semibold focus:outline-none focus:border-[#10b981]"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-extrabold px-6 py-2 transition-colors cursor-pointer"
                >
                  Save Profile Details
                </button>
              </form>

              {/* API Keys Configuration */}
              <form onSubmit={handleSaveSettings} className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 space-y-4 mt-6">
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2.5 mb-2.5">
                  <Key className="size-4 text-[#34d399]" /> Custom API Credentials (Client-Side)
                </h3>
                <div className="p-3 bg-[#10b981]/15 border border-[#10b981]/25 rounded-xl flex gap-3 text-xs leading-relaxed text-[#10b981] font-semibold mb-3">
                  <Info className="size-4 shrink-0 mt-0.5" />
                  <p>
                    Provide your own API keys to bypass the server limits. These credentials are saved securely in your local browser storage and never touch our servers except for direct API queries.
                  </p>
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Groq API Token</label>
                  <input
                    type="password"
                    value={apiKeys.groq}
                    onChange={(e) => setApiKeys((prev) => ({ ...prev, groq: e.target.value }))}
                    placeholder="gsk_..."
                    className="bg-slate-800 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white font-semibold focus:outline-none focus:border-[#10b981]"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Google Gemini API Key</label>
                  <input
                    type="password"
                    value={apiKeys.gemini}
                    onChange={(e) => setApiKeys((prev) => ({ ...prev, gemini: e.target.value }))}
                    placeholder="AIzaSy..."
                    className="bg-slate-800 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-white font-semibold focus:outline-none focus:border-[#10b981]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#10b981] text-[#0f172a] text-xs font-black py-2.5 shadow-glow hover:brightness-110 transition-all cursor-pointer"
                >
                  Save API Configuration
                </button>
              </form>
            </div>
          )}

          {/* Help & Support sub-view */}
          {activeTab === "Help & Support" && (
            <div className="space-y-6 text-left max-w-4xl">
              <div>
                <h2 className="text-xl font-black text-white">Help Center</h2>
                <p className="text-xs text-slate-400 mt-1">Search frequently asked questions or open a ticket with support.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.8fr] gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">FAQs</h3>
                  {[
                    { q: "How does AI create itineraries?", a: "We compile your constraints (budget, location, travelers) and relay them to advanced models (Llama 3/Gemini) with targeted structured formatting prompts." },
                    { q: "Can I edit an itinerary?", a: "Yes! Use Atlas AI Chat inside the itinerary viewer. You can ask to delete days, insert new spots, or swap lodgings." },
                    { q: "Where can I find saved trips?", a: "All saved plans are catalogued under the 'Saved Trips' link on the sidebar." },
                  ].map((faq, i) => (
                    <div key={i} className="p-4 rounded-xl border border-slate-800 bg-slate-900/30">
                      <h4 className="text-xs font-black text-white flex items-center gap-1.5">❓ {faq.q}</h4>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-semibold">{faq.a}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex justify-between items-center">
                    <span>Support Ticket Console</span>
                    <button
                      onClick={() => setActiveTicket(null)}
                      className="text-[10px] text-[#10b981] font-bold hover:underline"
                    >
                      New Ticket
                    </button>
                  </h3>

                  {activeTicket ? (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 flex flex-col h-[360px]">
                      <div className="border-b border-slate-800 pb-2.5 mb-2.5 flex items-center justify-between text-xs">
                        <span className="font-extrabold text-white truncate max-w-[200px]">🎟. {activeTicket.subject}</span>
                        <span className="text-[9px] text-yellow-400 font-bold bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/20 uppercase tracking-wide">
                          {activeTicket.status}
                        </span>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                        <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-800/10 text-xs">
                          <span className="text-[9px] text-[#10b981] block font-bold uppercase mb-1">YOUR DESCRIPTION:</span>
                          {activeTicket.text}
                        </div>

                        {activeTicket.replies.map((r, idx) => {
                          const isAgent = r.sender === "agent";
                          return (
                            <div key={idx} className={`flex gap-2 text-left items-start ${!isAgent ? "flex-row-reverse" : ""}`}>
                              <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed max-w-[85%] ${
                                isAgent ? "bg-slate-800/50 text-slate-100 border border-slate-800" : "bg-[#10b981] text-[#0f172a] font-semibold"
                              }`}>
                                {r.text}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-3 flex gap-2 border-t border-slate-800 pt-3">
                        <input
                          type="text"
                          value={ticketReplyText}
                          onChange={(e) => setTicketReplyText(e.target.value)}
                          placeholder="Send message to Support..."
                          className="flex-1 bg-slate-800 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10b981]"
                        />
                        <button
                          onClick={handleSendTicketReply}
                          className="px-3 bg-[#10b981] text-[#0f172a] text-xs font-black rounded-xl hover:brightness-110 cursor-pointer shadow-glow"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleOpenTicket} className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Ticket Topic</label>
                        <input
                          type="text"
                          required
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          placeholder="e.g. Can't save itinerary"
                          className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10b981] font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Describe Your Problem</label>
                        <textarea
                          required
                          value={ticketDescription}
                          onChange={(e) => setTicketDescription(e.target.value)}
                          placeholder="Please explain what is going wrong with details..."
                          rows={4}
                          className="w-full bg-slate-800 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#10b981] transition-all resize-none font-semibold"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full rounded-xl bg-[#10b981] text-[#0f172a] text-xs font-black py-2.5 shadow-glow hover:brightness-110 transition-all cursor-pointer"
                      >
                        Submit Support Ticket
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Mobile Drawer Sidebar Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm select-none animate-in fade-in duration-200">
          <div className="relative flex flex-col w-64 bg-[#0b0f19] h-full border-r border-slate-800 p-4 animate-in slide-in-from-left duration-250">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="pb-6 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <div className="shrink-0 overflow-hidden rounded-xl border border-slate-800 bg-white p-1 shadow-md">
                  <img src="/logo.png" alt="Trip AI Logo" className="size-8 object-contain" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-md font-black text-white">
                    Trip<span className="text-[#10b981]">AI</span>
                  </span>
                  <span className="text-[6.5px] font-bold uppercase tracking-wider text-slate-400">
                    Plan here, book anywhere
                  </span>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-1.5">
              {[
                { name: "Home", icon: Home },
                { name: "Bookings", icon: Plane },
                { name: "Calendar", icon: Calendar },
                { name: "Documents", icon: FileText },
                { name: "Preferences", icon: Sliders },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setActiveTab(item.name);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold text-left transition-all ${
                    activeTab === item.name
                      ? "text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/20"
                      : "text-slate-450 hover:text-white"
                  }`}
                >
                  <item.icon className="size-4" />
                  {item.name}
                </button>
              ))}
              <Link
                to="/saved"
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold text-left text-slate-400 hover:text-white"
              >
                <Bookmark className="size-4" />
                Saved Trips
              </Link>
            </nav>

            <div className="border-t border-slate-800 pt-4 space-y-2 text-left">
              <div className="flex items-center justify-between px-2">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-2">
                  <Moon className="size-3.5" /> Dark Mode
                </span>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[#10b981]/25 transition-colors duration-200 ease-in-out focus:outline-none"
                >
                  <span
                    className={`pointer-events-none inline-block size-4 transform rounded-full bg-[#10b981] shadow transition duration-200 ease-in-out ${
                      isDarkMode ? "translate-x-4" : "translate-x-0"
                }`}
                  />
                </button>
              </div>

              {user && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="size-4" />
                  Log Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Planner Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto select-none">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-[#0d0f1f]/95 p-6 md:p-8 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-left space-y-1 mb-6">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Sparkles className="size-5 text-[#10b981]" /> Complete Your Plan
              </h3>
              <p className="text-xs text-slate-450 font-medium">
                Define details to generate your optimized itinerary.
              </p>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4 text-left font-sans">
              <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-between text-xs font-bold text-white">
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-450 uppercase">Departing</span>
                  <span>{modalForm.from || "Empty"}</span>
                </div>
                <ArrowRight className="size-4 text-[#10b981]" />
                <div className="flex flex-col text-right">
                  <span className="text-[8px] text-slate-450 uppercase">Destination</span>
                  <span>{modalForm.destination || "Empty"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col text-xs font-bold text-white">
                  <span className="text-[8px] text-slate-450 uppercase">Duration</span>
                  <span>{modalForm.days} Days ({modalForm.startDate} – {modalForm.endDate})</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col text-xs font-bold text-white">
                  <span className="text-[8px] text-slate-450 uppercase">Travelers</span>
                  <span>{modalForm.travelers} Persons</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 items-end">
                <div className="col-span-2 flex flex-col">
                  <label className="text-[10px] font-bold text-slate-450 uppercase mb-1.5">Budget Limit</label>
                  <input
                    type="number"
                    value={modalForm.budget}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, budget: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#10b981] font-semibold"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-450 uppercase mb-1.5">Currency</label>
                  <select
                    value={modalForm.currency}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, currency: e.target.value }))}
                    className="w-full bg-[#0a0c16] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#10b981] cursor-pointer"
                  >
                    {CURRENCY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-450 uppercase mb-1.5">Lodging</label>
                  <select
                    value={modalForm.accommodation}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, accommodation: e.target.value }))}
                    className="w-full bg-[#0a0c16] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#10b981] cursor-pointer"
                  >
                    {ACCOMMODATION_OPTIONS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-slate-450 uppercase mb-1.5">Transit Mode</label>
                  <select
                    value={modalForm.transport}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, transport: e.target.value }))}
                    className="w-full bg-[#0a0c16] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#10b981] cursor-pointer"
                  >
                    {TRANSPORT_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-450 uppercase mb-1.5">Travel Style</label>
                <select
                  value={modalForm.style}
                  onChange={(e) => setModalForm((prev) => ({ ...prev, style: e.target.value as TravelStyle }))}
                  className="w-full bg-[#0a0c16] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#10b981] cursor-pointer"
                >
                  {STYLE_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-450 uppercase mb-1.5">Interests</label>
                <div className="flex flex-wrap gap-1.5">
                  {INTEREST_OPTIONS.map((interest) => {
                    const isSelected = modalForm.interests.includes(interest);
                    return (
                      <button
                        type="button"
                        key={interest}
                        onClick={() => {
                          setModalForm((prev) => ({
                            ...prev,
                            interests: isSelected
                              ? prev.interests.filter((i) => i !== interest)
                              : [...prev.interests, interest],
                          }));
                        }}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#10b981] text-[#0f172a] border-[#10b981] font-bold shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                            : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white"
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-450 uppercase mb-1.5">Special requests (Notes)</label>
                <textarea
                  value={modalForm.notes}
                  onChange={(e) => setModalForm((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g. Vegetarian restaurants, slow pace, kids-friendly spots..."
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#10b981] focus:bg-slate-850 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 mt-6 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#10b981] to-[#34d399] text-[#0f172a] text-xs font-extrabold hover:brightness-110 flex items-center justify-center gap-2 shadow-glow transition-all disabled:opacity-50 cursor-pointer animate-pulse"
                >
                  {modalLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-[#0f172a]" /> Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-3.5" /> Generate Itinerary
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pro Membership Checkout Simulator Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-[#0d0f1f]/95 p-6 md:p-8 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {checkoutStep === "pricing" && (
              <div className="text-left space-y-6">
                <div>
                  <h3 className="text-lg font-black text-white font-outfit flex items-center gap-2">
                    🚀 Unlock Trip AI Premium Tiers
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-semibold">Choose a layout that fits your travel style.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-slate-800 bg-white/[0.01] flex flex-col justify-between h-[200px]">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase">Basic Plan</h4>
                      <div className="text-lg font-black text-white mt-2">Free</div>
                      <ul className="text-[10px] text-slate-400 mt-3 space-y-1 font-medium">
                        <li>• Up to 3 AI generations/month</li>
                        <li>• Standard fallback routing</li>
                        <li>• Basic travel checklists</li>
                      </ul>
                    </div>
                    <button
                      disabled
                      className="w-full mt-4 rounded-xl border border-slate-800 text-slate-500 text-xs font-bold py-2 bg-transparent opacity-60"
                    >
                      Current Plan
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-amber-500/5 flex flex-col justify-between h-[200px] shadow-[0_4px_30px_rgba(234,179,8,0.05)] relative">
                    <span className="absolute top-3 right-3 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-2.5 py-0.5 text-[7px] font-bold text-yellow-400">
                      POPULAR
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-yellow-400 uppercase">Voyagr Pro</h4>
                      <div className="text-lg font-black text-white mt-2">₹499 <span className="text-[10px] text-slate-400 font-semibold">/ year</span></div>
                      <ul className="text-[10px] text-white mt-3 space-y-1 font-semibold">
                        <li>⭐ Unlimited AI trip planning</li>
                        <li>⭐ Access to live Atlas AI chat</li>
                        <li>⭐ Upload unlimited vault docs</li>
                        <li>⭐ Real-time forecast modules</li>
                      </ul>
                    </div>
                    <button
                      onClick={() => setCheckoutStep("billing")}
                      className="w-full mt-4 rounded-xl bg-yellow-500 hover:brightness-110 text-neutral-950 text-xs font-black py-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(234,179,8,0.2)] animate-pulse"
                    >
                      Subscribe Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {checkoutStep === "billing" && (
              <div className="text-left space-y-6">
                <div>
                  <h3 className="text-lg font-black text-white font-outfit flex items-center gap-2">
                    💳 Secure Checkout
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-semibold font-sans">Enter card details to complete your simulation upgrade.</p>
                </div>

                <form onSubmit={handleUpgradeCheckout} className="space-y-4">
                  <div className="p-4 rounded-2xl border border-slate-800 bg-[#0a0c16] flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400 uppercase text-[8px]">TOTAL DUE</span>
                    <span className="text-white text-sm font-black">₹499 / Year</span>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-455" />
                      <input
                        type="text"
                        required
                        value={cardForm.number}
                        onChange={(e) => setCardForm((prev) => ({ ...prev, number: e.target.value.replace(/\D/g, "").slice(0, 16) }))}
                        placeholder="4242 4242 4242 4242"
                        className="w-full pl-9 bg-slate-800 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-semibold focus:border-[#10b981]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Expiry Date</label>
                      <input
                        type="text"
                        required
                        value={cardForm.expiry}
                        onChange={(e) => setCardForm((prev) => ({ ...prev, expiry: e.target.value.slice(0, 5) }))}
                        placeholder="MM/YY"
                        className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-semibold text-center focus:border-[#10b981]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">CVC / CVV</label>
                      <input
                        type="password"
                        required
                        value={cardForm.cvc}
                        onChange={(e) => setCardForm((prev) => ({ ...prev, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) }))}
                        placeholder="•••"
                        className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-semibold text-center focus:border-[#10b981]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={cardForm.name}
                      onChange={(e) => setCardForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder={profileName}
                      className="w-full bg-slate-800 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-semibold focus:border-[#10b981]"
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-800 mt-6 font-sans">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep("pricing")}
                      className="flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-700 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={paying}
                      className="flex-1 py-2.5 rounded-xl bg-yellow-500 text-neutral-950 text-xs font-black hover:brightness-110 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(234,179,8,0.2)] cursor-pointer"
                    >
                      {paying ? (
                        <>
                          <Loader2 className="size-4 animate-spin text-neutral-950" /> Processing...
                        </>
                      ) : (
                        <>
                          <Check className="size-4" /> Simulate Purchase
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {checkoutStep === "success" && (
              <div className="text-center space-y-6 py-6 select-none animate-in zoom-in-95 duration-200">
                <div className="mx-auto size-16 bg-yellow-500/10 border border-yellow-500/30 rounded-full flex items-center justify-center text-yellow-500 text-3xl animate-bounce">
                  🎉
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-yellow-400 font-outfit">Subscription Activated!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Thank you, {cardForm.name || profileName}! You are now registered as a **Voyagr Pro Member** with infinite generations unlocked.
                  </p>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs font-extrabold px-8 py-2.5 transition-colors cursor-pointer text-white"
                >
                  Let's Travel!
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
