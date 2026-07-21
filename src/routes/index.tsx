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
  Globe2,
  ShieldCheck,
  Play,
  Heart,
  Star,
  Camera,
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

function daysBetween(a: string, b: string) {
  const d1 = new Date(a);
  const d2 = new Date(b);
  const diff = d2.getTime() - d1.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TripAI — Plan your next adventure with AI" },
      { name: "description", content: "Personalized itineraries in seconds. Plan here, book anywhere." },
    ],
  }),
  component: RootIndexPage,
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

const MOCK_SAVED_TRIPS: SavedTrip[] = [
  {
    id: "mock-1",
    createdAt: Date.now() - 86400000 * 2,
    input: {
      from: "Musabani",
      destination: "Ranchi",
      budget: 10000,
      currency: "INR",
      travelers: 2,
      startDate: "2026-05-20",
      endDate: "2026-05-24",
      days: 5,
      style: "Couple",
      interests: ["Nature", "Adventure"],
      accommodation: "Hotel",
      transport: "Car",
      notes: "A refreshing 5-day getaway to explore the best of Ranchi.",
    },
    itinerary: `## ✈️ Trip to Ranchi (Couple Plan)
- **Duration:** 5 Days (20 May – 24 May)
- **Departure:** Musabani
- **Budget:** ₹10,000 INR
- **Accommodation:** Hotel
- **Transit:** Car

### Day-by-Day Highlights
- **Day 1: Arrival & Sunset View** - Drive from Musabani, check in to hotel, visit Patratu Valley.
- **Day 2: Waterfalls exploration** - Hundru Falls & Jonha Falls.
- **Day 3: Temples & Scenic Spots** - Pahari Mandir, Jagannath Temple, and Rock Garden.
- **Day 4: Nature Walk** - Kanke Dam and Deer Park.
- **Day 5: Souvenirs & Departure** - Local market shopping and drive back.`,
  },
  {
    id: "mock-2",
    createdAt: Date.now() - 86400000 * 5,
    input: {
      from: "Delhi",
      destination: "Manali",
      budget: 18500,
      currency: "INR",
      travelers: 3,
      startDate: "2026-06-10",
      endDate: "2026-06-16",
      days: 7,
      style: "Family",
      interests: ["Mountains", "Adventure"],
      accommodation: "Resort",
      transport: "Bus",
      notes: "A thrilling week in the mountains.",
    },
    itinerary: `## 🏔️ Manali Adventure (Family Plan)
- **Duration:** 7 Days (10 Jun – 16 Jun)
- **Departure:** Delhi
- **Budget:** ₹18,500 INR
- **Accommodation:** Resort
- **Transit:** Bus

### Day-by-Day Highlights
- **Day 1: Arrival** - Check-in at Resort, walk around Mall Road.
- **Day 2: Solang Valley** - Paragliding and adventure sports.
- **Day 3: Rohtang Pass** - Scenic snow fields.
- **Day 4: Old Manali & Temples** - Hadimba Temple and Manu Temple.
- **Day 5: Jogini Waterfalls** - Soft trek and picnic.
- **Day 6: Vashisht Hot Springs** - Relaxation day.
- **Day 7: Departure** - Return bus back to Delhi.`,
  },
  {
    id: "mock-3",
    createdAt: Date.now() - 86400000 * 10,
    input: {
      from: "Mumbai",
      destination: "Kerala",
      budget: 22000,
      currency: "INR",
      travelers: 2,
      startDate: "2026-07-05",
      endDate: "2026-07-12",
      days: 8,
      style: "Couple",
      interests: ["Beaches", "Nature", "Culture"],
      accommodation: "Airbnb",
      transport: "Flight",
      notes: "Backwaters, beaches and breathtaking views.",
    },
    itinerary: `## 🌴 Kerala Escape (Couple Plan)
- **Duration:** 8 Days (05 Jul – 12 Jul)
- **Departure:** Mumbai
- **Budget:** ₹22,000 INR
- **Accommodation:** Airbnb
- **Transit:** Flight

### Day-by-Day Highlights
- **Day 1: Arrival in Kochi** - Explore Fort Kochi and Chinese Fishing Nets.
- **Day 2: Munnar Tea Gardens** - Scenic drive and tea estate walk.
- **Day 3: Munnar Sightseeing** - Eravikulam National Park and Mattupetty Dam.
- **Day 4: Thekkady Spice Plantations** - Periyar wildlife sanctuary boating.
- **Day 5: Alleppey Houseboat** - Overnight stay in houseboats.
- **Day 6: Kovalam Beach** - Relaxing beach resort stay.
- **Day 7: Varkala Cliff** - Breathtaking cliff sunset view.
- **Day 8: Departure** - Flight back from Trivandrum.`,
  },
];

function RootIndexPage() {
  const { user } = useAuth();

  if (user) {
    return <DashboardPage />;
  }

  return <LandingPage />;
}

// -------------------------------------------------------------
// GUEST LANDING PAGE (PREMIUM SaaS LAYOUT MOCKUP)
// -------------------------------------------------------------
function LandingPage() {
  const navigate = useNavigate();

  // Planner modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Hero Fields
  const [heroFrom, setHeroFrom] = useState("");
  const [heroTo, setHeroTo] = useState("");
  const [heroDates, setHeroDates] = useState("2026-05-20 - 2026-05-24");
  const [heroTravelers, setHeroTravelers] = useState(2);

  // Extended form variables
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

  const handleHeroPlan = (e: React.FormEvent) => {
    e.preventDefault();
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
      currency: heroTo.toLowerCase() === "ranchi" ? "INR" : "USD",
      travelers: heroTravelers,
      startDate: start,
      endDate: end,
      days: calculatedDays,
      style: heroTravelers === 1 ? "Solo" : heroTravelers === 2 ? "Couple" : "Family",
      interests: ["Nature", "Adventure"],
      accommodation: "Hotel",
      transport: "Car",
      notes: `A wonderful ${calculatedDays}-day trip to explore ${heroTo}.`,
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      sessionStorage.setItem("tripai:current", JSON.stringify(newTrip));

      // Save locally
      const saved = JSON.parse(localStorage.getItem("tripai:saved") || "[]");
      saved.unshift(newTrip);
      localStorage.setItem("tripai:saved", JSON.stringify(saved));
      toast.success("Itinerary generated successfully!");

      navigate({ to: "/itinerary" });
    } catch (err) {
      console.error(err);
      toast.error("Error generating trip. Loading local fallback.");
      // Fallback local mock trip load
      const tripId = crypto.randomUUID();
      const fallbackTrip: SavedTrip = {
        id: tripId,
        createdAt: Date.now(),
        input: modalForm,
        itinerary: `## 🏕️ Custom Trip to ${modalForm.destination}\nGenerated locally.`,
      };
      sessionStorage.setItem("tripai:current", JSON.stringify(fallbackTrip));
      navigate({ to: "/itinerary" });
    } finally {
      setModalLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] flex flex-col font-sans overflow-x-hidden relative">
      {/* Full Page Backdrop Image Space */}
      <div
        className="absolute inset-x-0 top-0 bg-cover bg-top opacity-[0.90] pointer-events-none z-0 h-[1000px]"
        style={{ backgroundImage: "url('/background.jpg')" }}
      />
      {/* Smooth linear gradient mask to fade the backdrop into the theme color */}
      <div
        className="absolute inset-x-0 top-0 bg-gradient-to-b from-transparent via-[#0F172A]/60 to-[#0F172A] pointer-events-none z-0 h-[1000px]"
      />

      {/* Background visual subtle radial glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-[#10B981]/5 blur-[160px] pointer-events-none z-0" />

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 h-[76px] border-b border-white/5 bg-[#0F172A]/70 backdrop-blur-xl shrink-0 select-none">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-8">
          <Link to="/" className="group flex items-center gap-3">
            <div className="shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white p-1 shadow-md">
              <img src="/logo.png" alt="Trip AI Logo" className="size-8 object-contain" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="text-md font-black tracking-tight text-[#F8FAFC] flex items-center">
                Trip
                <span className="text-[#10B981] ml-0.5">AI</span>
              </span>
              <span className="text-[6.5px] font-bold uppercase tracking-wider text-[#94A3B8] mt-1">
                Plan here, book anywhere
              </span>
            </div>
          </Link>

          {/* Navigation links */}
          <nav className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-[#94A3B8]">
            <a href="#features" className="hover:text-[#F8FAFC] transition-colors duration-200">Features</a>
            <a href="#how-it-works" className="hover:text-[#F8FAFC] transition-colors duration-200">How It Works</a>
            <a href="#destinations" className="hover:text-[#F8FAFC] transition-colors duration-200">Destinations</a>
            <a href="#pricing" className="hover:text-[#F8FAFC] transition-colors duration-200">Pricing</a>
            <a href="#blog" className="hover:text-[#F8FAFC] transition-colors duration-200">Blog</a>
            <a href="#about" className="hover:text-[#F8FAFC] transition-colors duration-200">About</a>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-4.5">
            <Link to="/login" className="text-[15px] font-bold text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-[#10B981] hover:bg-[#34D399] text-[#0F172A] text-sm font-extrabold px-5 py-2.5 shadow-soft hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* SECTION 01: HERO SECTION */}
      <section className="mx-auto max-w-7xl px-8 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center text-left relative z-10">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/20 bg-[#10B981]/10 px-3.5 py-1 text-[11px] font-bold text-[#10B981] uppercase tracking-wider">
            ✨ AI-Powered Travel Planning
          </span>

          {/* Headline 72px */}
          <h1 className="text-5xl sm:text-[72px] font-black leading-[1.05] tracking-tight text-[#F8FAFC] uppercase font-outfit">
            PLAN YOUR NEXT <br />
            <span className="text-[#10B981]">ADVENTURE</span> <br />
            WITH AI
          </h1>

          <div className="space-y-4">
            <p className="text-[18px] font-bold tracking-wide uppercase text-[#34D399] flex items-center gap-2">
              Plan here. <span className="border-b border-[#10B981] pb-0.5">Book anywhere.</span>
            </p>
            <p className="max-w-md text-[18px] text-[#94A3B8] leading-relaxed font-outfit">
              TripAI creates personalized AI itineraries in seconds and lets you book flights, hotels, and rentals on any platform you prefer.
            </p>
          </div>

          {/* Search form widget */}
          <form onSubmit={handleHeroPlan} className="grid grid-cols-2 md:grid-cols-[1fr_1fr_auto] gap-3 p-2.5 bg-[#172235] border border-white/5 rounded-2xl shadow-soft items-center max-w-lg w-full">
            <div className="flex flex-col text-left px-3.5 py-1.5 bg-[#1E293B] border border-white/5 rounded-xl">
              <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="size-2.5 text-[#10B981]" /> From
              </span>
              <input
                type="text"
                required
                value={heroFrom}
                onChange={(e) => setHeroFrom(e.target.value)}
                placeholder="Departure"
                className="w-full bg-transparent text-xs text-[#F8FAFC] font-semibold placeholder:text-[#94A3B8] focus:outline-none mt-1"
              />
            </div>

            <div className="flex flex-col text-left px-3.5 py-1.5 bg-[#1E293B] border border-white/5 rounded-xl">
              <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="size-2.5 text-[#34D399]" /> To
              </span>
              <input
                type="text"
                required
                value={heroTo}
                onChange={(e) => setHeroTo(e.target.value)}
                placeholder="Destination"
                className="w-full bg-transparent text-xs text-[#F8FAFC] font-semibold placeholder:text-[#94A3B8] focus:outline-none mt-1"
              />
            </div>

            <button
              type="submit"
              className="size-12.5 rounded-xl bg-[#10B981] text-[#0F172A] hover:bg-[#34D399] flex items-center justify-center shadow-soft hover:-translate-y-0.5 transition-all shrink-0 cursor-pointer w-full md:w-auto"
            >
              <ArrowRight className="size-5.5" />
            </button>
          </form>

          {/* Action CTAs below inputs */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl bg-[#10B981] hover:bg-[#34D399] text-[#0F172A] text-sm font-extrabold px-6 py-3.5 shadow-glow hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
            >
              Plan Your Trip – It's Free <ArrowRight className="size-4" />
            </button>
            <a
              href="#how-it-works"
              className="rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/5 text-[#F8FAFC] text-sm font-bold px-6 py-3.5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="size-3.5 fill-current" /> See How It Works
            </a>
          </div>

          {/* Trusted avatars rating display */}
          <div className="flex items-center gap-3.5 pt-4 select-none">
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80",
              ].map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="Reviewer"
                  className="size-8.5 rounded-full object-cover border-2 border-[#0F172A] shrink-0"
                />
              ))}
            </div>
            <div className="text-left leading-tight">
              <div className="flex text-[#F59E0B] gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </div>
              <span className="text-[12px] text-[#94A3B8] font-bold tracking-wide uppercase">Loved by 10,000+ travelers</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Mockup side - Recreated to match reference composition */}
        <div className="relative w-full max-w-[500px] h-[480px] lg:h-[500px] flex items-center justify-center select-none lg:mt-0 mt-12 mx-auto">

          {/* Dashed circular orbit path behind cards */}
          <div className="absolute size-[380px] rounded-full border-2 border-dashed border-white/5 pointer-events-none -z-10 animate-[spin_120s_linear_infinite]" />

          {/* Orbit Badge 1: Orange Hotel/Building Badge (Left) */}
          <div className="absolute left-[5px] top-[220px] z-20 size-11 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-float-slow">
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 21h18M3 10h18M5 10V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v5M8 14v3M12 14v3M16 14v3" />
            </svg>
          </div>

          {/* Orbit Badge 2: Green Plane Badge (Top-Right) */}
          <div className="absolute right-[45px] top-[75px] z-20 size-11 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] flex items-center justify-center shadow-glow animate-float-fast">
            <Plane className="size-5 fill-current" />
          </div>

          {/* Orbit Badge 3: Green Document/Check Badge (Bottom-Right) */}
          <div className="absolute right-[90px] bottom-[110px] z-20 size-11 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.15)] animate-float-medium">
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>

          {/* Widget 1: Floating Itinerary list (Top-Left) */}
          <div className="absolute left-[30px] top-[15px] z-10 w-[290px] rounded-2xl border border-white/5 bg-[#1E293B] p-5 shadow-2xl text-left space-y-4 animate-float-slow">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                <Sparkles className="size-4" />
              </div>
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                AI Generated Itinerary
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <div className="space-y-2 text-[10px] font-bold text-[#94A3B8] flex-1">
                {[
                  { d: "Day 1", name: "Manali" },
                  { d: "Day 2", name: "Solang Valley" },
                  { d: "Day 3", name: "Rohtang Pass" },
                  { d: "Day 4", name: "Local Market" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-1">
                    <span className="text-white/60">{item.d}</span>
                    <span className="text-[#F8FAFC] flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-[#10B981]" /> {item.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Thumbnail Image */}
              <div className="w-20 h-[92px] rounded-xl overflow-hidden shrink-0 border border-white/5">
                <img
                  src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=150&h=180&q=80"
                  alt="Manali Visual"
                  className="size-full object-cover"
                />
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-2 border border-white/10 rounded-xl bg-white/[0.02] hover:bg-white/5 text-center text-[10px] font-black text-[#10B981] flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              View Full Plan <ArrowRight className="size-3" />
            </button>
          </div>

          {/* Widget 2: Floating Weather Card (Right) */}
          <div className="absolute right-[10px] top-[140px] z-10 w-[170px] rounded-2xl border border-white/5 bg-[#1E293B] p-4.5 shadow-2xl text-left space-y-4 animate-float-medium">
            <span className="text-[10px] text-[#94A3B8] font-bold block">Manali, India</span>

            <div className="flex items-center gap-3">
              {/* Stylized Sun + Cloud visual */}
              <div className="relative shrink-0 size-9">
                <SunDim className="size-7 text-[#F59E0B] absolute top-[-3px] left-[-3px] animate-pulse" />
                <Cloud className="size-6 text-[#F8FAFC]/90 absolute bottom-0 right-0" />
              </div>
              <span className="text-3xl font-black text-[#F8FAFC]">18°C</span>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#94A3B8] font-semibold">
              <span>☀️ Clear Skies</span>
              <span className="opacity-60">↓ 12°C</span>
            </div>
          </div>

          {/* Widget 3: Floating Budget Graph (Bottom-Left) */}
          <div className="absolute left-[50px] bottom-[70px] z-10 w-[270px] rounded-2xl border border-white/5 bg-[#1E293B] p-4.5 shadow-2xl text-left space-y-2 animate-float-fast">
            <span className="text-[9px] font-bold text-[#94A3B8] uppercase">Total Budget</span>
            <div className="text-2xl font-black text-[#10B981]">₹18,500</div>

            <div className="flex items-center justify-between mt-2 border-t border-white/5 pt-2">
              <div className="text-[9px] text-[#94A3B8] font-semibold leading-tight">
                5 Days · 2 Travelers
              </div>

              {/* Clean budget graph path */}
              <svg className="w-24 h-6 text-[#10B981] shrink-0">
                <path d="M0,20 Q10,12 24,18 T48,4 T72,15 T96,5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Widget 4: Book Anywhere logobar (Bottom) */}
          <div className="absolute bottom-[0px] left-[30px] z-10 w-[380px] rounded-2xl border border-white/5 bg-[#1E293B]/90 px-4 py-3 shadow-2xl flex items-center justify-between text-xs select-none">
            <span className="flex items-center gap-1.5 text-[10px] text-[#94A3B8] font-bold">
              <span className="size-2 rounded bg-[#10B981]" /> Book Anywhere
            </span>
            <div className="flex gap-3.5 items-center text-white/90 font-extrabold text-[11px]">
              <span>Booking.com</span>
              <span className="flex flex-col items-center leading-none">
                <span>agoda</span>
                <span className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => <span key={idx} className="size-1 rounded-full bg-white/60" />)}
                </span>
              </span>
              <span>airbnb</span>
              <span className="text-[9px] text-[#94A3B8] font-semibold">+ more</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 01b: TRUSTED PARTNERS */}
      <section className="border-y border-white/5 bg-[#172235] py-8 select-none shrink-0 relative z-10">
        <div className="mx-auto max-w-7xl px-8 flex flex-col lg:flex-row items-center justify-between gap-8 text-[13px] text-[#94A3B8] font-extrabold uppercase tracking-widest">
          <span>We compare across 50+ booking platforms</span>
          <div className="flex flex-wrap gap-8 sm:gap-10 items-center justify-center">
            {[
              { name: "Booking.com", url: "https://upload.wikimedia.org/wikipedia/commons/b/be/Booking.com_logo.svg", anim: "animate-float-slow" },
              { name: "agoda", url: "https://upload.wikimedia.org/wikipedia/commons/a/ad/Agoda_Logo_2020.svg", anim: "animate-float-medium" },
              { name: "airbnb", url: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg", anim: "animate-float-fast" },
              { name: "Expedia", url: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Expedia_Logo.svg", anim: "animate-float-slow" },
              { name: "cleartrip", url: "https://upload.wikimedia.org/wikipedia/commons/d/df/Cleartrip_Logo.svg", anim: "animate-float-medium" },
              { name: "Trip.com", url: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Trip.com_logo.svg", anim: "animate-float-fast" },
            ].map((p, idx) => (
              <img
                key={idx}
                src={p.url}
                alt={p.name}
                className={`h-5 sm:h-5.5 object-contain brightness-0 invert opacity-60 hover:opacity-100 transition-all duration-300 ${p.anim}`}
              />
            ))}
            <span className="text-[11px] text-[#94A3B8] font-semibold lowercase">and more...</span>
          </div>
        </div>
      </section>

      {/* SECTION 02: FEATURES SECTION */}
      <section id="features" className="mx-auto max-w-7xl px-8 py-24 text-center select-none scroll-mt-20">
        <div className="max-w-3xl mx-auto space-y-4 mb-20">
          {/* Section Heading 48px */}
          <h2 className="text-3xl sm:text-[48px] font-bold text-[#F8FAFC] uppercase tracking-tight font-outfit">
            Everything you need for the <span className="text-[#10B981]">perfect trip</span>
          </h2>
          <p className="text-[18px] text-[#94A3B8] leading-relaxed max-w-xl mx-auto font-outfit">
            TripAI simplifies travel planning with the power of artificial intelligence. We coordinate the logistics, you live the experience.
          </p>
        </div>

        {/* 6 Grid cards with separate hover & border accent colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left font-outfit">
          {[
            { title: "AI-Powered Itineraries", desc: "Get personalized day-by-day itineraries tailored directly to your destinations and style in seconds.", icon: Sparkles, color: "border-[#10B981] hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:border-[#10B981]/50", iconCol: "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20" },
            { title: "Best Options, Everywhere", desc: "We scan and compare the best flights, stay accommodations, and transit modes across the web.", icon: Compass, color: "border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:border-blue-500/50", iconCol: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
            { title: "Book Anywhere", desc: "You book directly where you want. We provide the smart guiding details, you decide the final purchases.", icon: Wallet, color: "border-[#F59E0B] hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:border-[#F59E0B]/50", iconCol: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20" },
            { title: "Smart Budgeting", desc: "Optimize your travel budget with AI spending categorisation and tailored packing lists to avoid extra costs.", icon: TrendingUp, color: "border-purple-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:border-purple-500/50", iconCol: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
            { title: "Discover & Explore", desc: "Unlock hidden viewpoints, scenic valleys, and local gourmet recommendations missed by guidebooks.", icon: Globe2, color: "border-teal-500 hover:shadow-[0_0_20px_rgba(20,184,166,0.15)] hover:border-teal-500/50", iconCol: "text-teal-500 bg-teal-500/10 border-teal-500/20" },
            { title: "Your Data, Your Way", desc: "Secure account panels, custom credentials, private documents, and encrypted synchronization.", icon: ShieldCheck, color: "border-slate-500 hover:shadow-[0_0_20px_rgba(100,116,139,0.15)] hover:border-slate-500/50", iconCol: "text-slate-500 bg-slate-500/10 border-slate-500/20" },
          ].map((f, i) => (
            <div key={i} className={`rounded-3xl border ${f.color} bg-[#1E293B] p-8 flex flex-col justify-between h-[230px] transition-all duration-300 hover:-translate-y-1.5`}>
              <div className="space-y-5">
                <div className={`size-12.5 rounded-xl border flex items-center justify-center shrink-0 ${f.iconCol}`}>
                  <f.icon className="size-6.5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-[22px] font-bold text-[#F8FAFC]">{f.title}</h4>
                  <p className="text-[15px] text-[#94A3B8] leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 03: HOW IT WORKS */}
      <section id="how-it-works" className="border-t border-white/5 bg-[#172235] py-24 text-center select-none scroll-mt-20">
        <div className="mx-auto max-w-7xl px-8 space-y-20">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-[48px] font-bold text-[#F8FAFC] uppercase tracking-tight font-outfit">
              How <span className="text-[#10B981]">TripAI</span> works
            </h2>
            <p className="text-[18px] text-[#94A3B8] font-semibold font-outfit">Plan your dream trip in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {[
              { num: "1", title: "Tell us your plan", desc: "Share your departure city, target destination, budget limit, and dates.", icon: FileText },
              { num: "2", title: "AI creates your trip", desc: "Our engine crafts a personalized markdown itinerary and checklists.", icon: Sparkles },
              { num: "3", title: "You book anywhere", desc: "Review options, check weather, edit plans conversationally, and book.", icon: Plane },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-5 relative z-10">
                <div className="size-16 rounded-full bg-[#1E293B] border border-white/10 flex items-center justify-center text-[#10B981] relative shadow-soft">
                  <step.icon className="size-6.5" />
                  <span className="absolute -top-1.5 -right-1.5 size-6 bg-[#10B981] rounded-full flex items-center justify-center text-[11px] font-black text-[#0F172A]">
                    {step.num}
                  </span>
                </div>
                <div className="space-y-1.5 max-w-xs font-outfit">
                  <h4 className="text-[22px] font-bold text-[#F8FAFC]">{step.title}</h4>
                  <p className="text-[15px] text-[#94A3B8] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}

            {/* Connecting dashed line in background */}
            <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-px border-t border-dashed border-white/10 -z-10" />
          </div>
        </div>
      </section>

      {/* SECTION 04: POPULAR DESTINATIONS */}
      <section id="destinations" className="mx-auto max-w-7xl px-8 py-24 text-center scroll-mt-20">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-16 select-none">
          <div className="text-left space-y-1.5">
            <h2 className="text-3xl sm:text-[48px] font-bold text-[#F8FAFC] uppercase tracking-tight font-outfit">Popular Destinations</h2>
            <p className="text-[18px] text-[#94A3B8] font-semibold font-outfit">Explore trending places loved by travelers</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="text-sm font-bold text-[#10B981] hover:underline flex items-center gap-1 cursor-pointer font-outfit">
            View all destinations <ChevronRight className="size-4.5" />
          </button>
        </div>

        {/* Infinite Horizontal Marquee Scroll Track Container */}
        <div className="relative w-full overflow-hidden py-6 select-none">
          {/* Faded edges overlay for premium SaaS look */}
          <div className="absolute left-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-r from-[#0F172A] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-l from-[#0F172A] to-transparent z-10 pointer-events-none" />

          {/* Scrolling loop */}
          <div className="animate-marquee flex gap-6 hover:[animation-play-state:paused] transition-all">
            {[
              { name: "Manali", country: "Himachal Pradesh", price: "6,200", stars: "4.9 (2.5k)", season: "Winter", tag: "Best Seller", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=350&q=70" },
              { name: "Goa", country: "India", price: "4,500", stars: "4.8 (1.8k)", season: "Winter", tag: "", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=350&q=70" },
              { name: "Kerala", country: "God's Own Country", price: "7,500", stars: "4.9 (2.5k)", season: "Monsoon", tag: "Popular", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
              { name: "Ladakh", country: "Jammu & Kashmir", price: "9,900", stars: "4.9 (1.6k)", season: "Summer", tag: "", img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=350&q=70" },
              { name: "Bali", country: "Indonesia", price: "12,500", stars: "4.8 (1.4k)", season: "Dry", tag: "", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=350&q=70" },
              { name: "Maldives", country: "Tropical Islands", price: "14,800", stars: "4.9 (1.2k)", season: "Dry", tag: "Luxury", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=350&q=70" },
              { name: "Shimla", country: "Himachal Pradesh", price: "5,800", stars: "4.7 (2.1k)", season: "Winter", tag: "", img: "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=350&q=70" },
              { name: "Paris", country: "France", price: "24,500", stars: "4.8 (3.4k)", season: "Spring", tag: "Romantic", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=350&q=70" },
              { name: "Tokyo", country: "Japan", price: "18,900", stars: "4.9 (2.8k)", season: "Spring", tag: "Trending", img: "https://plus.unsplash.com/premium_photo-1661914240950-b0124f20a5c1?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dG9reW98ZW58MHx8MHx8fDA%3D" }
            ].concat([
              { name: "Manali", country: "Himachal Pradesh", price: "6,200", stars: "4.9 (2.5k)", season: "Winter", tag: "Best Seller", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=350&q=70" },
              { name: "Goa", country: "India", price: "4,500", stars: "4.8 (1.8k)", season: "Winter", tag: "", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=350&q=70" },
              { name: "Kerala", country: "God's Own Country", price: "7,500", stars: "4.9 (2.5k)", season: "Monsoon", tag: "Popular", img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
              { name: "Ladakh", country: "Jammu & Kashmir", price: "9,900", stars: "4.9 (1.6k)", season: "Summer", tag: "", img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=350&q=70" },
              { name: "Bali", country: "Indonesia", price: "12,500", stars: "4.8 (1.4k)", season: "Dry", tag: "", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=350&q=70" },
              { name: "Maldives", country: "Tropical Islands", price: "14,800", stars: "4.9 (1.2k)", season: "Dry", tag: "Luxury", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=350&q=70" },
              { name: "Shimla", country: "Himachal Pradesh", price: "5,800", stars: "4.7 (2.1k)", season: "Winter", tag: "", img: "https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=350&q=70" },
              { name: "Paris", country: "France", price: "24,500", stars: "4.8 (3.4k)", season: "Spring", tag: "Romantic", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=350&q=70" },
              { name: "Tokyo", country: "Japan", price: "18,900", stars: "4.9 (2.8k)", season: "Spring", tag: "Trending", img: "https://plus.unsplash.com/premium_photo-1661914240950-b0124f20a5c1?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dG9reW98ZW58MHx8MHx8fDA%3D" }
            ]).map((d, i) => (
              <article
                key={i}
                onClick={() => {
                  setHeroTo(d.name);
                  toast.success(`Selected destination: ${d.name}`);
                }}
                className="w-[230px] md:w-[250px] shrink-0 group cursor-pointer relative overflow-hidden rounded-2xl border border-white/5 bg-[#1E293B] shadow-soft transition-all duration-500 hover:border-[#10B981]/30 hover:shadow-glow hover:-translate-y-1 text-left font-outfit"
              >
                <div className="h-44 overflow-hidden relative">
                  <img src={d.img} alt={d.name} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-black/25 pointer-events-none" />
                  {d.tag && (
                    <span className="absolute top-3.5 left-3.5 bg-[#10B981] text-[#0F172A] rounded-full px-3 py-0.5 text-[9px] font-black border border-[#10B981]/20 uppercase tracking-wider">
                      {d.tag}
                    </span>
                  )}
                </div>
                <div className="p-4.5 relative z-10 leading-tight space-y-1">
                  <h4 className="text-[16px] font-bold text-[#F8FAFC] group-hover:text-[#10B981] transition-colors">{d.name}</h4>
                  <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wide">{d.country}</p>

                  <div className="flex items-center gap-1 mt-1">
                    <Star className="size-3 text-[#F59E0B] fill-current" />
                    <span className="text-[10px] text-[#94A3B8] font-extrabold">{d.stars}</span>
                  </div>

                  <div className="text-[10px] text-[#94A3B8] font-bold pt-1">
                    ⛅ Season: <span className="text-[#F8FAFC]">{d.season}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3 border-t border-white/5 pt-2">
                    <span className="text-[9px] text-[#94A3B8] font-bold">Starting Price</span>
                    <span className="text-xs font-black text-[#F8FAFC]">₹{d.price}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 05: STATISTICS ROW */}
      <section className="border-t border-white/5 bg-[#172235] py-24 select-none">
        <div className="mx-auto max-w-5xl px-8 grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { val: "100K+", label: "Trips Planned", desc: "Tailored Agendas" },
            { val: "50+", label: "Booking Partners", desc: "Integrated Portals" },
            { val: "190+", label: "Countries Covered", desc: "Worldwide Support" },
            { val: "4.9/5", label: "Average Rating", desc: "By Travel Groups", rating: true },
          ].map((stat, idx) => (
            <div key={idx} className="space-y-2 text-center font-outfit">
              <div className="text-4xl font-black text-white">{stat.val}</div>
              <h5 className="text-[11px] font-black uppercase text-[#10B981] tracking-widest">{stat.label}</h5>
              {stat.rating && (
                <div className="flex text-[#F59E0B] justify-center gap-0.5 py-0.5">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-3.5 fill-current" />)}
                </div>
              )}
              <p className="text-[11px] text-[#94A3B8] font-semibold leading-none">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 06: FINAL CTA */}
      <section id="pricing" className="border-t border-white/5 bg-[#0F172A] py-24 select-none scroll-mt-20">
        <div className="mx-auto max-w-7xl px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-left">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-[48px] font-bold text-white uppercase tracking-tight leading-tight font-outfit">
              Ready for your <br />next adventure?
            </h2>
            <p className="text-[18px] text-[#94A3B8] leading-relaxed max-w-md font-outfit">
              Plan your dream vacation in under 30 seconds. Build structured day-to-day agendas and customized checklists.
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl bg-[#10B981] hover:bg-[#34D399] text-[#0F172A] text-sm font-black px-7 py-4 shadow-glow hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2 font-outfit"
            >
              Get Started for Free <ArrowRight className="size-4.5" />
            </button>

            <div className="flex items-center gap-6 text-[11px] text-[#94A3B8] font-extrabold uppercase tracking-wide font-outfit">
              <span className="flex items-center gap-1.5 text-[#10B981]">✓ No credit card required</span>
              <span className="flex items-center gap-1.5 text-[#10B981]">✓ Free forever plan</span>
            </div>
          </div>

          {/* Suitcase Image */}
          <div className="relative flex justify-center items-center">
            <img
              src="/suitcase.png"
              alt="Suitcase and Travel Equipment"
              className="h-96 md:h-[440px] object-contain relative z-10 select-none"
            />
          </div>
        </div>
      </section>

      {/* SECTION 07: FOOTER */}
      <footer id="about" className="border-t border-white/5 bg-[#172235] py-16 text-left select-none scroll-mt-20 shrink-0">
        <div className="mx-auto max-w-7xl px-8 grid grid-cols-2 md:grid-cols-6 gap-12 pb-12 border-b border-white/5 font-outfit">

          {/* Logo brand block */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="group flex items-center gap-3">
              <div className="shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white p-1 shadow-md">
                <img src="/logo.png" alt="Trip AI Logo" className="size-8 object-contain" />
              </div>
              <span className="text-md font-black tracking-tight text-white">
                Trip<span className="text-[#10B981]">AI</span>
              </span>
            </Link>
            <p className="text-[15px] text-[#94A3B8] max-w-xs leading-relaxed">
              Trip AI is a premium, AI-powered travel concierge and planner. Plan your dream trip in seconds.
            </p>
            {/* Social mockup icons */}
            <div className="flex gap-4 pt-1">
              {["instagram", "twitter", "youtube", "linkedin"].map((s) => (
                <span key={s} className="size-6.5 rounded-lg border border-white/10 hover:border-white/20 flex items-center justify-center text-[10px] font-black uppercase text-[#94A3B8] hover:text-white cursor-pointer transition-colors">
                  {s.slice(0, 2)}
                </span>
              ))}
            </div>
          </div>

          {/* Column 1 */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-white tracking-widest">Product</h4>
            <ul className="text-xs text-[#94A3B8] space-y-3 font-semibold">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#destinations" className="hover:text-white transition-colors">Destinations</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-white tracking-widest">Resources</h4>
            <ul className="text-xs text-[#94A3B8] space-y-3 font-semibold">
              <li><span className="hover:text-white transition-colors cursor-pointer">Blog</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Travel Guides</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">FAQs</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Support Center</span></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-white tracking-widest">Company</h4>
            <ul className="text-xs text-[#94A3B8] space-y-3 font-semibold">
              <li><span className="hover:text-white transition-colors cursor-pointer">About Us</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Careers</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Press</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Contact Us</span></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-white tracking-widest">Legal</h4>
            <ul className="text-xs text-[#94A3B8] space-y-3 font-semibold">
              <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Cookies Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#94A3B8] font-bold">
          <span>© {new Date().getFullYear()} TripAI. All rights reserved.</span>
          <span className="mt-2 sm:mt-0">Made with ❤️ for curious travelers worldwide.</span>
        </div>
      </footer>

      {/* Guest Planner Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto select-none">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#1E293B] p-6 md:p-8 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/10 text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
            >
              <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-left space-y-1.5 mb-6">
              <h3 className="text-[22px] font-bold text-[#F8FAFC] flex items-center gap-2">
                <Sparkles className="size-5 text-[#10B981] animate-pulse" /> Complete Your Plan
              </h3>
              <p className="text-[15px] text-[#94A3B8]">
                Define details to generate your optimized itinerary.
              </p>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4 text-left font-sans">
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-bold text-foreground">
                <div className="flex flex-col">
                  <span className="text-[8px] text-[#94A3B8] uppercase">Departing</span>
                  <span>{modalForm.from}</span>
                </div>
                <ArrowRight className="size-4 text-[#10B981]" />
                <div className="flex flex-col text-right">
                  <span className="text-[8px] text-[#94A3B8] uppercase">Destination</span>
                  <span>{modalForm.destination}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col text-xs font-bold text-foreground">
                  <span className="text-[8px] text-[#94A3B8] uppercase">Duration</span>
                  <span>{modalForm.days} Days ({modalForm.startDate} – {modalForm.endDate})</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col text-xs font-bold text-foreground">
                  <span className="text-[8px] text-[#94A3B8] uppercase">Travelers</span>
                  <span>{modalForm.travelers} Persons</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 items-end">
                <div className="col-span-2 flex flex-col">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Budget Limit</label>
                  <input
                    type="number"
                    value={modalForm.budget}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, budget: Number(e.target.value) }))}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#10B981]/40 font-semibold"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Currency</label>
                  <select
                    value={modalForm.currency}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, currency: e.target.value }))}
                    className="w-full bg-[#0F172A] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#10B981]/40 cursor-pointer"
                  >
                    {CURRENCY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Lodging</label>
                  <select
                    value={modalForm.accommodation}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, accommodation: e.target.value }))}
                    className="w-full bg-[#0F172A] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#10B981]/40 cursor-pointer"
                  >
                    {ACCOMMODATION_OPTIONS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Transit Mode</label>
                  <select
                    value={modalForm.transport}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, transport: e.target.value }))}
                    className="w-full bg-[#0F172A] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#10B981]/40 cursor-pointer"
                  >
                    {TRANSPORT_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Travel Style</label>
                <select
                  value={modalForm.style}
                  onChange={(e) => setModalForm((prev) => ({ ...prev, style: e.target.value as TravelStyle }))}
                  className="w-full bg-[#0F172A] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#10B981]/40 cursor-pointer"
                >
                  {STYLE_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Interests</label>
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
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${isSelected
                          ? "bg-[#10B981] text-[#0F172A] border-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                          : "bg-white/[0.02] text-muted-foreground border-white/5 hover:text-foreground"
                          }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-[#94A3B8] uppercase mb-1.5">Special requests (Notes)</label>
                <textarea
                  value={modalForm.notes}
                  onChange={(e) => setModalForm((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g. Vegetarian restaurants, slow pace, kids-friendly spots..."
                  rows={2}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-xs text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#10B981]/40 focus:bg-white/[0.05] transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 mt-6 border-t border-white/5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 text-xs font-extrabold text-foreground transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#34D399] text-[#0F172A] text-xs font-extrabold hover:brightness-110 flex items-center justify-center gap-2 shadow-glow transition-all disabled:opacity-50 cursor-pointer"
                >
                  {modalLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-[#0F172A]" /> Generating...
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
// MEMBER DASHBOARD COMPONENT (PRESERVED & FULLY OPERATIONAL)
// -------------------------------------------------------------
function DashboardPage() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<string>("Home");

  // Pro Subscription States
  const [isProMember, setIsProMember] = useState<boolean>(() => {
    return localStorage.getItem("tripai:ispro") === "true";
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

  // Calendar Hover Tooltip details
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
    toast.success("Document uploaded successfully.");
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

  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  const [heroFrom, setHeroFrom] = useState("");
  const [heroTo, setHeroTo] = useState("");
  const [heroStartDate, setHeroStartDate] = useState("");
  const [heroEndDate, setHeroEndDate] = useState("");
  const [heroDates, setHeroDates] = useState("");
  const [heroTravelers, setHeroTravelers] = useState(2);
  const [calendarMonth, setCalendarMonth] = useState("2026-05");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [profileName, setProfileName] = useState(user?.name || "Ak");
  const [profileEmail, setProfileEmail] = useState(user?.email || "ak@tripai.com");
  const [profilePic, setProfilePic] = useState(() => localStorage.getItem("tripai:profile_pic") || "");

  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem("tripai:preferences");
      if (saved) return JSON.parse(saved);
    } catch { }
    return {
      currency: "INR",
      accommodation: "Hotel",
      transport: "Car",
      style: "Couple" as TravelStyle,
      pace: "Balanced",
      diet: "None",
    };
  });

  const [apiKeys, setApiKeys] = useState(() => {
    return {
      groq: localStorage.getItem("tripai:key_groq") || "",
      gemini: localStorage.getItem("tripai:key_gemini") || "",
    };
  });

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

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "bot-init",
      sender: "bot",
      text: `Hi Traveler! 👋 I can help you plan your trips, find the best options, manage your bookings, and more. What would you like to do today?`,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (token) {
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
          const localSaved = JSON.parse(localStorage.getItem("tripai:saved") || "[]");
          setSavedTrips(localSaved);
        })
        .finally(() => {
          setLoadingTrips(false);
        });
    } else {
      const localSaved = JSON.parse(localStorage.getItem("tripai:saved") || "[]");
      setSavedTrips(localSaved);
      setLoadingTrips(false);
    }
  }, [token]);

  useEffect(() => {
    if (savedTrips && savedTrips.length > 0) {
      // Automatically adjust the calendar month view to focus on the latest planned/saved trip
      const latestTrip = savedTrips[savedTrips.length - 1];
      if (latestTrip && latestTrip.input.startDate) {
        const parts = latestTrip.input.startDate.split("-");
        if (parts.length >= 2) {
          setCalendarMonth(`${parts[0]}-${parts[1]}`);
        }
      }
    }
  }, [savedTrips.length]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name);
      setProfileEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const name = user?.name || profileName || "Traveler";
    setMessages((prev) =>
      prev.map((m) =>
        m.id === "bot-init"
          ? {
            ...m,
            text: `Hi ${name}! 👋 I can help you plan your trips, find the best options, manage your bookings, and more. What would you like to do today?`,
          }
          : m
      )
    );
  }, [user?.name, profileName]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 256;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > maxDim) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          }
        } else {
          if (h > maxDim) {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setProfilePic(dataUrl);
          toast.success("Avatar loaded from device successfully!");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleHeroPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroStartDate || !heroEndDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    const calculatedDays = daysBetween(heroStartDate, heroEndDate);
    setModalForm({
      from: heroFrom,
      destination: heroTo,
      budget: heroTo.toLowerCase() === "ranchi" ? 10000 : 25000,
      currency: preferences.currency,
      travelers: heroTravelers,
      startDate: heroStartDate,
      endDate: heroEndDate,
      days: calculatedDays,
      style: preferences.style,
      interests: ["Nature", "Adventure"],
      accommodation: preferences.accommodation,
      transport: preferences.transport,
      notes: `Lodging: ${preferences.accommodation}. Transit: ${preferences.transport}. Dietary restrictions: ${preferences.diet}. Travel Pace: ${preferences.pace}.`,
    });
    setIsModalOpen(true);
  };
  const handleDeleteTrip = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/trips/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete trip on backend");

      setSavedTrips((prev) => prev.filter((t) => t.id !== id));
      toast.success("Trip removed");
    } catch (err) {
      console.warn("Failed backend delete, removing locally:", err);
      const next = savedTrips.filter((t) => t.id !== id);
      setSavedTrips(next);
      localStorage.setItem("tripai:saved", JSON.stringify(next));
      toast.success("Trip removed (local)");
    }
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

      sessionStorage.setItem("tripai:current", JSON.stringify(newTrip));

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
        const saved = JSON.parse(localStorage.getItem("tripai:saved") || "[]");
        saved.unshift(newTrip);
        localStorage.setItem("tripai:saved", JSON.stringify(saved));
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

    setTimeout(() => {
      const responseText = `Hi ${profileName}, thanks for reaching out. We have logged your ticket: "${newTicket.subject}". An Atlas agent has been assigned and is looking into this. Feel free to add any screenshots or notes here!`;
      setTickets((prev) =>
        prev.map((t) =>
          t.id === newTicket.id
            ? { ...t, replies: [...t.replies, { sender: "agent", text: responseText, date: "Just now" }] }
            : t
        )
      );
      setActiveTicket((prev) =>
        prev && prev.id === newTicket.id
          ? { ...prev, replies: [...prev.replies, { sender: "agent", text: responseText, date: "Just now" }] }
          : prev
      );
      toast.info("New message from Support Concierge");
    }, 1500);
  };

  const [ticketReplyText, setTicketReplyText] = useState("");
  const handleSendTicketReply = () => {
    if (!activeTicket || !ticketReplyText.trim()) return;

    const reply = { sender: "user" as const, text: ticketReplyText.trim(), date: "Just now" };
    setTickets((prev) =>
      prev.map((t) => (t.id === activeTicket.id ? { ...t, replies: [...t.replies, reply] } : t))
    );
    setActiveTicket((prev) => (prev ? { ...prev, replies: [...prev.replies, reply] } : null));
    setTicketReplyText("");

    setTimeout(() => {
      const responseText = "Got it! We have passed this details to the engineering team. We will notify you once we have an update.";
      const botReply = { sender: "agent" as const, text: responseText, date: "Just now" };
      setTickets((prev) =>
        prev.map((t) => (t.id === activeTicket.id ? { ...t, replies: [...t.replies, botReply] } : t))
      );
      setActiveTicket((prev) => (prev ? { ...prev, replies: [...prev.replies, botReply] } : null));
    }, 1200);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("tripai:preferences", JSON.stringify(preferences));
    toast.success("Travel preferences updated! AI will apply this default context.");
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("tripai:key_groq", apiKeys.groq.trim());
    localStorage.setItem("tripai:key_gemini", apiKeys.gemini.trim());
    toast.success("Settings & API keys saved successfully.");
  };

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
      localStorage.setItem("tripai:ispro", "true");
      setCheckoutStep("success");
      toast.success("Welcome to Trip AI Pro!");
    }, 2000);
  };

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
    sessionStorage.setItem("tripai:current", JSON.stringify(trip));
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
    <div className={`relative h-screen bg-[#080912] text-foreground flex overflow-hidden ${isDarkMode ? "dark" : ""}`}>
      <div className="glow-orb glow-orb-primary top-[-100px] left-[-50px] size-[500px]" />
      <div className="glow-orb glow-orb-secondary bottom-[-200px] right-[-100px] size-[600px]" />

      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[#0a0c16]/80 backdrop-blur-xl h-screen sticky top-0 shrink-0 select-none">
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="group flex items-center gap-3">
            <div className="shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white p-1 shadow-md transition-transform duration-300 group-hover:scale-105">
              <img src="/logo.png" alt="Trip AI Logo" className="size-8 object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-md font-black tracking-tight text-foreground flex items-center leading-none">
                Trip
                <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent ml-0.5">
                  AI
                </span>
              </span>
              <span className="text-[6.5px] font-bold uppercase tracking-wider text-muted-foreground mt-1">
                Plan here, book anywhere
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {[
            { name: "Home", icon: Home },
            { name: "Bookings", icon: Plane },
            { name: "Calendar", icon: Calendar },
            { name: "Documents", icon: FileText },
            { name: "Preferences", icon: Sliders },
            { name: "Saved Trips", icon: Bookmark },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${activeTab === item.name
                ? "text-primary bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(104,117,245,0.1)]"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
                }`}
            >
              <item.icon className="size-4.5" />
              {item.name}
            </button>
          ))}
        </nav>

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
                <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed">
                  You have unlimited AI trip generations, priority support, and premium layouts active!
                </p>
                <div className="mt-3 flex items-center justify-between text-[8px] text-yellow-500 font-bold border-t border-yellow-500/10 pt-2.5">
                  <span>BILLING ACTIVE</span>
                  <span>RENUES MAY 2027</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 to-secondary/5 p-4 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
              <div className="absolute inset-0 bg-white/[0.01] backdrop-blur-[2px] -z-10" />
              <div className="relative">
                <span className="absolute top-0 right-0 bg-primary/20 border border-primary/30 rounded-full px-2 py-0.5 text-[8px] font-bold text-accent-foreground">
                  PRO
                </span>
                <h4 className="text-sm font-bold text-foreground">Upgrade to Pro</h4>
                <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                  Unlock exclusive features and get the best travel experience.
                </p>
                <button
                  onClick={() => {
                    setCheckoutStep("pricing");
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full mt-3 rounded-xl bg-[image:var(--gradient-hero)] text-white text-xs font-extrabold py-2 shadow-glow hover:brightness-110 transition-all duration-300 cursor-pointer"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/5 space-y-1">
          <button
            onClick={() => setActiveTab("Settings")}
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "Settings" ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <Settings className="size-4" />
            Settings
          </button>
          <button
            onClick={() => setActiveTab("Help & Support")}
            className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeTab === "Help & Support" ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <HelpCircle className="size-4" />
            Help & Support
          </button>

          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-2">
              <Moon className="size-3.5" /> Dark Mode
            </span>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary/20 transition-colors duration-200 ease-in-out focus:outline-none"
            >
              <span
                className={`pointer-events-none inline-block size-4 transform rounded-full bg-primary shadow ring-0 transition duration-200 ease-in-out ${isDarkMode ? "translate-x-4" : "translate-x-0"
                  }`}
              />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5 bg-[#080912]/80 backdrop-blur-xl shrink-0 select-none">
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5"
            >
              <svg className="size-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Trip AI Logo" className="size-6 object-contain" />
              <span className="text-sm font-black text-foreground">
                Trip<span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">AI</span>
              </span>
            </Link>
          </div>

          {activeTab === "Home" ? (
            <div className="relative hidden md:block w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search trips, destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-12 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 border border-white/10 rounded px-1.5 py-0.5 text-[8px] font-bold text-muted-foreground bg-white/5">
                ⌘ K
              </span>
            </div>
          ) : (
            <div className="text-left font-bold text-sm text-muted-foreground hidden lg:flex items-center gap-2">
              <span>Dashboard</span>
              <ChevronRight className="size-3.5" />
              <span className="text-foreground font-extrabold">{activeTab}</span>
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setModalForm({
                  from: heroFrom,
                  destination: heroTo,
                  budget: 10000,
                  currency: preferences.currency,
                  travelers: heroTravelers,
                  startDate: heroStartDate,
                  endDate: heroEndDate,
                  days: heroStartDate && heroEndDate ? daysBetween(heroStartDate, heroEndDate) : 5,
                  style: preferences.style,
                  interests: ["Nature"],
                  accommodation: preferences.accommodation,
                  transport: preferences.transport,
                  notes: "",
                });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-[image:var(--gradient-hero)] text-white text-xs font-black p-2.5 sm:px-4 sm:py-2.5 shadow-glow hover:brightness-110 transition-all duration-300 shrink-0 cursor-pointer"
            >
              <Plus className="size-3.5" /> <span className="hidden sm:inline">Plan New Trip</span>
            </button>

            <button
              onClick={() => toast.info("No new notifications")}
              className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all duration-300 relative shrink-0"
            >
              <Bell className="size-4" />
              <span className="absolute top-1 right-1 size-1.5 rounded-full bg-primary" />
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
              <div className="shrink-0 overflow-hidden rounded-full border border-primary/30 size-9 bg-primary/10 flex items-center justify-center text-primary select-none">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] font-black tracking-wider uppercase font-outfit">
                    {profileName.trim().slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight max-w-[120px]">
                <span className="text-xs font-bold text-foreground flex items-center gap-1 truncate">
                  {profileName} {isProMember && <span className="text-[7px] text-yellow-500 font-extrabold tracking-wide uppercase">Pro</span>}
                </span>
                <span className="text-[9px] text-muted-foreground font-semibold">Traveler</span>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors ml-1"
              >
                <LogOut className="size-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Grid */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          {activeTab === "Home" && (
            <>
              {/* 1. Hero Mountains Banner */}
              <section className="relative rounded-3xl overflow-hidden border border-white/5 shadow-2xl h-[280px] sm:h-[320px] flex flex-col justify-end p-6 md:p-8 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80')` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#080912] via-[#080912]/40 to-transparent" />
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

                  <form onSubmit={handleHeroPlan} className="grid grid-cols-2 md:grid-cols-[1.1fr_1.1fr_1.4fr_1fr_auto] gap-2 md:gap-3 p-2 bg-[#0d0f1f]/85 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl items-center w-full">
                    <div className="flex flex-col text-left px-3 py-1 bg-white/[0.02] border border-white/5 rounded-xl">
                      <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="size-2 text-primary" /> From
                      </span>
                      <input
                        type="text"
                        required
                        value={heroFrom}
                        onChange={(e) => setHeroFrom(e.target.value)}
                        placeholder="Departure"
                        className="w-full bg-transparent text-xs text-foreground font-semibold placeholder:text-muted-foreground focus:outline-none mt-0.5"
                      />
                    </div>

                    <div className="flex flex-col text-left px-3 py-1 bg-white/[0.02] border border-white/5 rounded-xl">
                      <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="size-2 text-secondary" /> To
                      </span>
                      <input
                        type="text"
                        required
                        value={heroTo}
                        onChange={(e) => setHeroTo(e.target.value)}
                        placeholder="Destination"
                        className="w-full bg-transparent text-xs text-foreground font-semibold placeholder:text-muted-foreground focus:outline-none mt-0.5"
                      />
                    </div>

                    <div className="flex flex-col text-left px-3 py-1 bg-white/[0.02] border border-white/5 rounded-xl col-span-2 md:col-span-1">
                      <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="size-2 text-accent-foreground" /> Dates
                      </span>
                      <div className="flex gap-2 items-center mt-0.5">
                        <input
                          type="date"
                          required
                          value={heroStartDate}
                          onChange={(e) => {
                            setHeroStartDate(e.target.value);
                            setHeroDates(`${e.target.value} - ${heroEndDate}`);
                          }}
                          className="bg-transparent text-xs text-foreground font-semibold focus:outline-none cursor-pointer w-[95px] [color-scheme:dark]"
                        />
                        <span className="text-[10px] text-muted-foreground">-</span>
                        <input
                          type="date"
                          required
                          value={heroEndDate}
                          onChange={(e) => {
                            setHeroEndDate(e.target.value);
                            setHeroDates(`${heroStartDate} - ${e.target.value}`);
                          }}
                          className="bg-transparent text-xs text-foreground font-semibold focus:outline-none cursor-pointer w-[95px] [color-scheme:dark]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col text-left px-3 py-1 bg-white/[0.02] border border-white/5 rounded-xl col-span-2 md:col-span-1">
                      <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Users className="size-2 text-primary" /> Travelers
                      </span>
                      <div className="flex items-center gap-2 mt-1 select-none">
                        <button
                          type="button"
                          onClick={() => setHeroTravelers((prev) => Math.max(1, prev - 1))}
                          className="size-5 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] flex items-center justify-center transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs text-foreground font-bold min-w-[70px] text-center">
                          {heroTravelers} {heroTravelers === 1 ? "Traveler" : "Travelers"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setHeroTravelers((prev) => prev + 1)}
                          className="size-5 rounded bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] flex items-center justify-center transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="size-11 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white hover:brightness-110 flex items-center justify-center shadow-glow transition-all shrink-0 cursor-pointer col-span-2 md:col-span-1 justify-self-center md:justify-self-start mt-2 md:mt-0"
                    >
                      <ArrowRight className="size-5" />
                    </button>
                  </form>
                </div>
              </section>

              {/* 2. Pillars section */}
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 select-none">
                {[
                  { title: "AI-Powered Plans", desc: "Customized itineraries in seconds", icon: Sparkles, color: "text-primary bg-primary/10 border-primary/20" },
                  { title: "Best Options", desc: "Top flights, hotels & activities", icon: Compass, color: "text-secondary bg-secondary/10 border-secondary/20" },
                  { title: "Book Anywhere", desc: "You book, we guide", icon: Wallet, color: "text-pink-500 bg-pink-500/10 border-pink-500/20" },
                  { title: "Smart Budgeting", desc: "Plan smart, spend smart", icon: TrendingUp, color: "text-green-500 bg-green-500/10 border-green-500/20" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5 shadow-soft hover:border-white/10 transition-all duration-300">
                    <div className={`p-3 rounded-xl border ${p.color} shrink-0`}>
                      <p.icon className="size-4.5" />
                    </div>
                    <div className="text-left leading-tight min-w-0">
                      <h5 className="text-xs font-bold text-foreground truncate">{p.title}</h5>
                      <p className="text-[9px] text-muted-foreground mt-0.5 truncate">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </section>

              {/* 3. Middle Section: Trips & Assistant */}
              <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-4 flex flex-col">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 select-none">
                    <h3 className="text-lg font-bold text-foreground tracking-tight">Your Saved Trips</h3>
                    <button onClick={() => setActiveTab("Saved Trips")} className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
                      View All <ChevronRight className="size-3" />
                    </button>
                  </div>

                  {loadingTrips ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-2.5">
                      <Loader2 className="size-6 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground font-semibold">Retrieving your trips...</span>
                    </div>
                  ) : filteredTrips.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl bg-white/[0.01] border border-dashed border-white/10">
                      <Bookmark className="size-8 text-muted-foreground/55" />
                      <p className="text-xs text-muted-foreground">
                        {searchQuery ? "No matching itineraries found." : "No saved trips yet. Start by planning a new adventure above!"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredTrips.map((trip) => {
                        const tag = trip.id.startsWith("mock-1") ? "Upcoming" : trip.id.startsWith("mock-2") ? "Saved" : "Draft";
                        const badgeColor = tag === "Upcoming" ? "bg-green-500/10 text-green-400 border-green-500/20" : tag === "Saved" ? "bg-primary/10 text-primary border-primary/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20";
                        const imgUrl = trip.input.destination.toLowerCase() === "ranchi" ? "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=150&h=150&q=70" : trip.input.destination.toLowerCase() === "manali" ? "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=150&h=150&q=70" : "https://images.unsplash.com/photo-1596761301588-915ccaec3e83?auto=format&fit=crop&w=150&h=150&q=70";

                        return (
                          <article key={trip.id} className="relative overflow-hidden rounded-2xl border border-white/5 bg-card/25 p-4 flex flex-col sm:flex-row gap-4 hover:border-white/10 transition-all duration-300">
                            <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden bg-muted shrink-0 relative">
                              <img src={imgUrl} alt={trip.input.destination} className="size-full object-cover" />
                              <span className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[8px] font-bold border ${badgeColor}`}>{tag}</span>
                            </div>
                            <div className="flex-1 flex flex-col justify-between text-left min-w-0">
                              <div>
                                <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                                  {trip.input.from} <ArrowRight className="size-3 text-muted-foreground" /> {trip.input.destination}
                                </h4>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  {trip.input.startDate ? new Date(trip.input.startDate).toLocaleDateString("en-US", { day: "numeric", month: "short" }) : "May 20"} – {trip.input.endDate ? new Date(trip.input.endDate).toLocaleDateString("en-US", { day: "numeric", month: "short" }) : "May 24"} · {trip.input.travelers} Travelers
                                </p>
                                <p className="text-xs text-muted-foreground/85 mt-2 line-clamp-1 italic">
                                  "{trip.input.notes || `Explore the beautiful vistas of ${trip.input.destination}.`}"
                                </p>
                              </div>
                              <div className="flex flex-wrap items-center justify-between gap-3 mt-3 border-t border-white/5 pt-2">
                                <div className="flex gap-4 text-[10px] text-muted-foreground font-semibold">
                                  <span>⏱️ {trip.input.days} Days</span>
                                  <span>💰 {trip.input.currency === "INR" ? "₹" : "$"}{trip.input.budget.toLocaleString()}</span>
                                  <span>👥 {trip.input.style}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <button onClick={() => handleViewTrip(trip)} className="rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-[10px] font-extrabold px-3 py-1.5 transition-colors cursor-pointer">
                                    View Itinerary
                                  </button>
                                  <button onClick={() => toast.info("No options available")} className="p-1.5 rounded-lg border border-white/5 hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors">
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

                <div className="space-y-4 flex flex-col h-full">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2 select-none">
                    <Sparkles className="size-4.5 text-primary" />
                    <h3 className="text-lg font-bold text-foreground tracking-tight text-left">Trip AI Assistant</h3>
                  </div>

                  <div className="flex-1 rounded-2xl border border-white/5 bg-[#0a0c16]/50 p-4 flex flex-col h-[400px] overflow-hidden">
                    <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin">
                      {messages.map((m) => {
                        const isBot = m.sender === "bot";
                        return (
                          <div key={m.id} className={`flex gap-2.5 text-left items-start ${!isBot ? "flex-row-reverse" : ""}`}>
                            <div className={`shrink-0 overflow-hidden rounded-full border size-7.5 bg-card ${isBot ? "border-primary/30 p-0.5" : "border-secondary/30"}`}>
                              <img
                                src={isBot ? "/logo.png" : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"}
                                alt={isBot ? "AI" : "User"}
                                className="size-full object-contain rounded-full"
                              />
                            </div>
                            <div className={`rounded-2xl px-3 py-2 text-xs max-w-[80%] leading-relaxed ${isBot ? "bg-white/[0.03] text-foreground border border-white/5" : "bg-primary text-white font-medium"
                              }`}>
                              {m.text}
                            </div>
                          </div>
                        );
                      })}
                      {chatLoading && (
                        <div className="flex gap-2.5 items-center text-left">
                          <div className="shrink-0 overflow-hidden rounded-full border border-primary/30 size-7.5 bg-card p-0.5">
                            <img src="/logo.png" alt="AI" className="size-full object-contain rounded-full" />
                          </div>
                          <div className="flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-2xl px-3 py-2.5">
                            <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                            <span className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                            <span className="size-1.5 rounded-full bg-primary animate-bounce" />
                          </div>
                        </div>
                      )}
                      <div ref={chatBottomRef} />
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-1.5 text-left border-t border-white/5 pt-3">
                      {["Plan a weekend trip", "Find budget hotels in Manali", "Best time to visit Kerala", "Create an itinerary for Europe"].map((s) => (
                        <button key={s} onClick={() => handleSuggestionClick(s)} className="text-[10px] text-muted-foreground hover:text-foreground font-semibold bg-white/[0.02] border border-white/5 hover:border-primary/20 px-2.5 py-1.5 rounded-xl transition-all text-left truncate cursor-pointer">
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
                        onKeyDown={(e) => { if (e.key === "Enter") sendChatMessage(); }}
                        className="flex-1 bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none"
                      />
                      <button onClick={() => sendChatMessage()} className="size-8.5 bg-primary rounded-xl text-white hover:brightness-110 flex items-center justify-center transition-all cursor-pointer shadow-glow">
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Popular Destinations Grid */}
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2 select-none">
                  <h3 className="text-lg font-bold text-foreground tracking-tight">Popular Destinations</h3>
                  <button onClick={() => toast.info("Destinations browser database coming soon.")} className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                    Explore All <ChevronRight className="size-3" />
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: "Manali", desc: "Himachal Pradesh", price: "12,500", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=300&q=70" },
                    { name: "Goa", desc: "Beach Paradise", price: "8,200", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=70" },
                    { name: "Kerala", desc: "God's Own Country", price: "9,800", img: "https://plus.unsplash.com/premium_photo-1697729438401-fcb4ff66d9a8?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a2VyYWxhfGVufDB8fDB8fHww" },
                    { name: "Ladakh", desc: "Land of High Passes", price: "15,900", img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=300&q=70" },
                  ].map((d) => (
                    <article key={d.name} onClick={() => { setHeroTo(d.name); toast.success(`Selected destination: ${d.name}`); }} className="group cursor-pointer relative overflow-hidden rounded-2xl border border-white/5 bg-card/25 shadow-xl transition-all duration-500 hover:border-primary/30 hover:shadow-glow hover:-translate-y-1">
                      <div className="h-40 overflow-hidden relative">
                        <img src={d.img} alt={d.name} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080912] via-[#080912]/20 to-transparent pointer-events-none" />
                      </div>
                      <div className="p-4 text-left relative z-10 leading-tight">
                        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{d.name}</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{d.desc}</p>
                        <div className="flex items-center justify-between mt-3.5 border-t border-white/5 pt-2">
                          <span className="text-[9px] text-muted-foreground font-semibold">Starting Price</span>
                          <span className="text-xs font-black text-foreground">₹{d.price}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* 5. Bottom widgets row */}
              <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-white/5 bg-card/25 p-5 flex flex-col h-[340px]">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 select-none">
                    <h4 className="text-sm font-bold text-foreground">Budget Overview</h4>
                    <TrendingUp className="size-4 text-primary" />
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
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total</span>
                      <span className="text-md font-black text-foreground">₹10,000</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-y-1.5 gap-x-2 text-[10px] text-muted-foreground font-semibold border-t border-white/5 pt-3">
                    <div className="flex items-center gap-1.5 truncate"><span className="size-2 rounded bg-primary shrink-0" /> Transport 40%</div>
                    <div className="flex items-center gap-1.5 truncate"><span className="size-2 rounded bg-secondary shrink-0" /> Stay 30%</div>
                    <div className="flex items-center gap-1.5 truncate"><span className="size-2 rounded bg-[var(--color-chart-5)] shrink-0" /> Food 15%</div>
                    <div className="flex items-center gap-1.5 truncate"><span className="size-2 rounded bg-[var(--color-chart-4)] shrink-0" /> Activities 10%</div>
                    <div className="flex items-center gap-1.5 truncate"><span className="size-2 rounded bg-emerald-500 shrink-0" /> Others 5%</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-card/25 p-5 flex flex-col h-[340px]">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 select-none">
                    <h4 className="text-sm font-bold text-foreground">Travel Checklist</h4>
                    <span className="text-[9px] text-primary font-bold">INTERACTIVE</span>
                  </div>
                  <div className="flex-1 py-4 space-y-3 overflow-y-auto">
                    {checklist.map((item) => (
                      <label key={item.id} className="flex items-center justify-between p-2.5 rounded-xl border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer select-none">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={item.completed} onChange={() => toggleChecklist(item.id)} className="rounded border-white/10 text-primary focus:ring-primary size-4 cursor-pointer" />
                          <span className={`text-xs font-semibold ${item.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>{item.task}</span>
                        </div>
                        {item.completed && <CheckCircle2 className="size-4 text-green-500 shrink-0" />}
                      </label>
                    ))}
                  </div>
                  <button onClick={() => { const pending = checklist.filter((c) => !c.completed).length; toast.info(`You have ${pending} tasks pending before your trip!`); }} className="w-full rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-xs font-extrabold py-2 transition-colors cursor-pointer">
                    Check Checklist Status
                  </button>
                </div>

                <div className="rounded-2xl border border-white/5 bg-card/25 p-5 flex flex-col h-[340px] md:col-span-2 xl:col-span-1">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 select-none">
                    <h4 className="text-sm font-bold text-foreground">Weather in {weatherCity}</h4>
                    <Cloud className="size-4 text-secondary" />
                  </div>
                  <div className="flex-1 flex items-center justify-between py-4 select-none">
                    <div className="text-left">
                      <div className="text-4xl font-black text-foreground">28°C</div>
                      <div className="text-xs text-muted-foreground font-semibold mt-1">Partly Cloudy</div>
                      <div className="flex gap-4 text-[10px] text-muted-foreground font-medium mt-3">
                        <span>💧 Hum: 65%</span>
                        <span>💨 Wind: 12 km/h</span>
                      </div>
                    </div>
                    <div className="relative shrink-0 pr-4">
                      <SunDim className="size-16 text-yellow-500 animate-pulse" />
                      <Cloud className="size-10 text-white/80 absolute bottom-[-4px] right-[-6px]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 border-t border-white/5 pt-3 pb-2 select-none">
                    {[
                      { day: "Mon", temp: "28°", icon: SunDim, color: "text-yellow-500" },
                      { day: "Tue", temp: "26°", icon: Cloud, color: "text-sky-400" },
                      { day: "Wed", temp: "27°", icon: CloudRain, color: "text-indigo-400" },
                      { day: "Thu", temp: "29°", icon: SunDim, color: "text-yellow-500" },
                      { day: "Fri", temp: "30°", icon: SunDim, color: "text-yellow-500" },
                    ].map((f, i) => (
                      <div key={i} className="flex flex-col items-center bg-white/[0.01] border border-white/[0.03] rounded-lg py-2">
                        <span className="text-[9px] font-bold text-muted-foreground">{f.day}</span>
                        <f.icon className={`size-4.5 my-1.5 ${f.color}`} />
                        <span className="text-[10px] font-extrabold text-foreground">{f.temp}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => toast.info("Weather forecast updated for Ranchi region.")} className="w-full rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-xs font-extrabold py-2 transition-colors cursor-pointer mt-2">
                    More Details
                  </button>
                </div>
              </section>

              {/* 6. Footer Banner CTA */}
              <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/15 to-secondary/15 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                <div className="absolute inset-0 bg-white/[0.01] backdrop-blur-[1px] -z-10" />
                <div className="text-left space-y-1">
                  <h2 className="text-lg md:text-xl font-black text-foreground">Plan here, book anywhere</h2>
                  <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
                    We find the best options, you book what works for you. Safe, customized, and smart itineraries.
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="rounded-xl bg-primary hover:brightness-110 text-white text-xs font-extrabold px-6 py-3 transition-all shrink-0 cursor-pointer shadow-glow flex items-center gap-2">
                  Plan Your Next Trip <ArrowRight className="size-4" />
                </button>
              </section>
              {/* Dashboard Footer */}
              <footer className="border-t border-white/5 bg-[#0a0c16]/30 py-12 text-left select-none mt-12 shrink-0 rounded-3xl w-full">
                <div className="px-6 grid grid-cols-2 md:grid-cols-6 gap-8 pb-8 border-b border-white/5 font-outfit">
                  {/* Logo brand block */}
                  <div className="col-span-2 space-y-4">
                    <Link to="/" className="group flex items-center gap-3">
                      <div className="shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white p-1 shadow-md">
                        <img src="/logo.png" alt="Trip AI Logo" className="size-8 object-contain" />
                      </div>
                      <span className="text-md font-black tracking-tight text-white">
                        Trip<span className="text-[#10B981]">AI</span>
                      </span>
                    </Link>
                    <p className="text-[13px] text-[#94A3B8] max-w-xs leading-relaxed">
                      Trip AI is a premium, AI-powered travel concierge and planner. Plan your dream trip in seconds.
                    </p>
                    {/* Social mockup icons */}
                    <div className="flex gap-3 pt-1">
                      {["instagram", "twitter", "youtube", "linkedin"].map((s) => (
                        <span key={s} className="size-6 rounded-lg border border-white/10 hover:border-white/20 flex items-center justify-center text-[9px] font-black uppercase text-[#94A3B8] hover:text-white cursor-pointer transition-colors">
                          {s.slice(0, 2)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Column 1 */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-white tracking-widest">Product</h4>
                    <ul className="text-[11px] text-[#94A3B8] space-y-2.5 font-semibold">
                      <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                      <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                      <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                      <li><a href="#destinations" className="hover:text-white transition-colors">Destinations</a></li>
                    </ul>
                  </div>

                  {/* Column 2 */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-white tracking-widest">Resources</h4>
                    <ul className="text-[11px] text-[#94A3B8] space-y-2.5 font-semibold">
                      <li><span className="hover:text-white transition-colors cursor-pointer">Blog</span></li>
                      <li><span className="hover:text-white transition-colors cursor-pointer">Travel Guides</span></li>
                      <li><span className="hover:text-white transition-colors cursor-pointer">FAQs</span></li>
                      <li><span className="hover:text-white transition-colors cursor-pointer">Support Center</span></li>
                    </ul>
                  </div>

                  {/* Column 3 */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-white tracking-widest">Company</h4>
                    <ul className="text-[11px] text-[#94A3B8] space-y-2.5 font-semibold">
                      <li><span className="hover:text-white transition-colors cursor-pointer">About Us</span></li>
                      <li><span className="hover:text-white transition-colors cursor-pointer">Careers</span></li>
                      <li><span className="hover:text-white transition-colors cursor-pointer">Press</span></li>
                      <li><span className="hover:text-white transition-colors cursor-pointer">Contact Us</span></li>
                    </ul>
                  </div>

                  {/* Column 4 */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-white tracking-widest">Legal</h4>
                    <ul className="text-[11px] text-[#94A3B8] space-y-2.5 font-semibold">
                      <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
                      <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
                      <li><span className="hover:text-white transition-colors cursor-pointer">Cookies Policy</span></li>
                    </ul>
                  </div>
                </div>

                <div className="px-6 pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-[#94A3B8] font-bold">
                  <span>© {new Date().getFullYear()} TripAI. All rights reserved.</span>
                  <span className="mt-2 sm:mt-0">Made with ❤️ for curious travelers worldwide.</span>
                </div>
              </footer>
            </>
          )}

          {activeTab === "Bookings" && (
            <div className="space-y-6 text-left max-w-4xl">
              <div>
                <h2 className="text-xl font-black text-foreground">Active Bookings</h2>
                <p className="text-xs text-muted-foreground mt-1">Manage and view your flight and hotel confirmations.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookings.map((b) => (
                  <div key={b.id} className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#0a0c16]/50 flex flex-col justify-between h-[220px]">
                    <div className="p-5 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold border ${b.status === "Confirmed" || b.status === "Active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>{b.status}</span>
                        <span className="text-[10px] text-muted-foreground font-semibold">{b.date}</span>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-md font-extrabold text-foreground flex items-center gap-2">{b.type === "flight" ? "✈️" : "🏨"} {b.title}</h4>
                        <p className="text-xs text-muted-foreground">{b.carrier} ({b.code})</p>
                      </div>
                      {b.type === "flight" ? (
                        <div className="grid grid-cols-3 gap-2 text-xs font-bold pt-2 border-t border-white/5">
                          <div><span className="text-[8px] text-muted-foreground block uppercase">Route</span><span className="text-foreground">{b.from}</span></div>
                          <div><span className="text-[8px] text-muted-foreground block uppercase">Gate</span><span className="text-foreground">{b.gate}</span></div>
                          <div><span className="text-[8px] text-muted-foreground block uppercase">Seat</span><span className="text-foreground">{b.seat}</span></div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2 border-t border-white/5">
                          <div><span className="text-[8px] text-muted-foreground block uppercase">Address</span><span className="text-foreground truncate block max-w-[120px]">{b.address}</span></div>
                          <div><span className="text-[8px] text-muted-foreground block uppercase">Room Type</span><span className="text-foreground">{b.room}</span></div>
                        </div>
                      )}
                    </div>
                    <div className="bg-white/5 border-t border-white/5 px-5 py-3 flex items-center justify-between">
                      <div className="flex gap-0.5 h-6 w-32 bg-foreground/10 px-1 py-1 rounded">
                        {Array.from({ length: 28 }).map((_, idx) => <div key={idx} className="h-full bg-foreground" style={{ width: idx % 3 === 0 ? "3px" : idx % 5 === 0 ? "1px" : "1.5px" }} />)}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold text-foreground">{b.cost}</span>
                        {b.status !== "Cancelled" && <button onClick={() => handleCancelBooking(b.id)} className="rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[9px] font-extrabold px-2.5 py-1.5 transition-colors cursor-pointer">Cancel</button>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Calendar" && (() => {
            const [calYear, calMonthStr] = calendarMonth.split("-");
            const calYearNum = Number(calYear);
            const calMonthNum = Number(calMonthStr);
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const calMonthName = monthNames[calMonthNum - 1];

            const daysInMonth = new Date(calYearNum, calMonthNum, 0).getDate();
            const startDayOfWeek = new Date(calYearNum, calMonthNum - 1, 1).getDay();

            const getTripForDay = (day: number) => {
              const dateStr = `${calYearNum}-${calMonthStr}-${day.toString().padStart(2, "0")}`;
              return savedTrips.find((t) => {
                if (!t.input.startDate || !t.input.endDate) return false;
                return dateStr >= t.input.startDate && dateStr <= t.input.endDate;
              });
            };

            const activeTripsInMonth = savedTrips.filter((t) => {
              if (!t.input.startDate) return false;
              return t.input.startDate.startsWith(calendarMonth);
            });

            const prevMonth = () => {
              const [y, m] = calendarMonth.split("-").map(Number);
              const ny = m === 1 ? y - 1 : y;
              const nm = m === 1 ? 12 : m - 1;
              setCalendarMonth(`${ny}-${nm.toString().padStart(2, "0")}`);
            };

            const nextMonth = () => {
              const [y, m] = calendarMonth.split("-").map(Number);
              const ny = m === 12 ? y + 1 : y;
              const nm = m === 12 ? 1 : m + 1;
              setCalendarMonth(`${ny}-${nm.toString().padStart(2, "0")}`);
            };

            return (
              <div className="space-y-6 text-left max-w-4xl select-none">
                <div>
                  <h2 className="text-xl font-black text-foreground">Travel Calendar</h2>
                  <p className="text-xs text-muted-foreground mt-1">Timeline of your upcoming trips and draft schedules.</p>
                </div>
                <div className="rounded-3xl border border-white/5 bg-[#0a0c16]/50 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={prevMonth}
                        className="size-7 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-white flex items-center justify-center cursor-pointer transition-colors"
                      >
                        &lt;
                      </button>
                      <h3 className="text-sm font-bold text-foreground min-w-[90px] text-center font-outfit">{calMonthName} {calYearNum}</h3>
                      <button
                        type="button"
                        onClick={nextMonth}
                        className="size-7 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-white flex items-center justify-center cursor-pointer transition-colors"
                      >
                        &gt;
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-4 text-[10px] text-muted-foreground font-bold">
                      {activeTripsInMonth.length === 0 ? (
                        <span>No trips scheduled this month</span>
                      ) : (
                        activeTripsInMonth.map((t, idx) => (
                          <span key={t.id} className="flex items-center gap-1.5">
                            <span className={`size-2 rounded ${idx % 2 === 0 ? "bg-primary" : "bg-secondary"}`} />
                            {t.input.destination} ({t.input.days} Days)
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-muted-foreground uppercase border-b border-white/5 pb-2">
                    <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center mt-3 text-xs font-bold">
                    {/* Render leading empty placeholders */}
                    {Array.from({ length: startDayOfWeek }).map((_, i) => (
                      <span key={`empty-${i}`} className="py-3 text-muted-foreground/10">—</span>
                    ))}
                    {/* Render actual days */}
                    {Array.from({ length: daysInMonth }).map((_, idx) => {
                      const day = idx + 1;
                      const activeTrip = getTripForDay(day);
                      let bgClass = "hover:bg-white/5 border border-transparent text-[#94A3B8]";
                      if (activeTrip) {
                        bgClass = "bg-primary/20 border border-primary/40 text-primary cursor-pointer shadow-[0_0_8px_rgba(104,117,245,0.15)]";
                      }
                      return (
                        <div
                          key={day}
                          onMouseEnter={() => {
                            if (activeTrip) {
                              setCalendarHover(`${activeTrip.input.from} to ${activeTrip.input.destination} (${activeTrip.input.days} Days): ${activeTrip.input.travelers} Travelers.`);
                            }
                          }}
                          onMouseLeave={() => setCalendarHover(null)}
                          className={`py-3.5 rounded-xl transition-all relative ${bgClass}`}
                        >
                          {day}
                          {activeTrip && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-primary" />}
                        </div>
                      );
                    })}
                  </div>
                  {calendarHover && <div className="mt-5 p-3 rounded-xl border border-primary/20 bg-primary/10 text-xs font-semibold text-foreground text-center animate-in fade-in duration-200">ℹ️ {calendarHover}</div>}
                </div>
              </div>
            );
          })()}

          {activeTab === "Documents" && (
            <div className="space-y-6 text-left max-w-4xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-foreground">Document Vault</h2>
                  <p className="text-xs text-muted-foreground mt-1">Keep digital copies of your passport, flight tickets, and visa letters safe.</p>
                </div>
                <button onClick={() => setIsDocModalOpen(true)} className="flex items-center gap-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-extrabold px-4 py-2.5 transition-colors cursor-pointer">
                  <UploadCloud className="size-4" /> Upload Document
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-2xl border border-white/5 bg-[#0a0c16]/50 flex flex-col justify-between h-[140px] hover:border-white/10 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0"><File className="size-5" /></div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-foreground truncate">{doc.name}</h4>
                        <span className="text-[8px] text-muted-foreground bg-white/5 border border-white/10 rounded px-1.5 py-0.5 mt-1.5 inline-block uppercase font-bold">{doc.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[10px] text-muted-foreground font-semibold">
                      <span>{doc.size} · {doc.date}</span>
                      <button onClick={() => toast.success(`Downloading ${doc.name}`)} className="p-1 rounded hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"><Download className="size-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>

              {isDocModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                  <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0d0f1f] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                    <div className="text-left space-y-1 mb-4">
                      <h4 className="text-md font-black text-foreground">Upload Document</h4>
                      <p className="text-xs text-muted-foreground font-medium">Add a digital scan of your travel document.</p>
                    </div>
                    <form onSubmit={handleAddDocument} className="space-y-4 text-left">
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 block">Document Name</label>
                        <input type="text" required value={docForm.name} onChange={(e) => setDocForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="e.g. Visa_Letter" className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none font-semibold" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 block">Category</label>
                        <select value={docForm.category} onChange={(e) => setDocForm((prev) => ({ ...prev, category: e.target.value as TravelDocument["category"] }))} className="w-full bg-[#0a0c16] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none cursor-pointer">
                          <option value="Passport">Passport Copy</option>
                          <option value="Visa">Visa Letter</option>
                          <option value="Ticket">E-Ticket PDF</option>
                          <option value="Insurance">Travel Insurance</option>
                          <option value="Other">Other Docs</option>
                        </select>
                      </div>
                      <div className="flex gap-3 pt-3">
                        <button type="button" onClick={() => setIsDocModalOpen(false)} className="flex-1 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-bold hover:bg-white/5 cursor-pointer">Cancel</button>
                        <button type="submit" className="flex-1 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:brightness-115 shadow-glow cursor-pointer">Upload</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "Preferences" && (
            <div className="space-y-6 text-left max-w-2xl select-none">
              <div>
                <h2 className="text-xl font-black text-foreground font-outfit">Travel Preferences</h2>
                <p className="text-xs text-muted-foreground mt-1">AI will automatically utilize these settings as planning defaults.</p>
              </div>
              <form onSubmit={handleSavePreferences} className="rounded-3xl border border-white/5 bg-[#0a0c16]/50 p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Preferred Lodging</label>
                    <select value={preferences.accommodation} onChange={(e) => setPreferences((prev: any) => ({ ...prev, accommodation: e.target.value }))} className="w-full bg-[#0a0c16] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none cursor-pointer">
                      {ACCOMMODATION_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Preferred Transit</label>
                    <select value={preferences.transport} onChange={(e) => setPreferences((prev: any) => ({ ...prev, transport: e.target.value }))} className="w-full bg-[#0a0c16] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none cursor-pointer">
                      {TRANSPORT_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Travel Style</label>
                    <select value={preferences.style} onChange={(e) => setPreferences((prev: any) => ({ ...prev, style: e.target.value }))} className="w-full bg-[#0a0c16] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none cursor-pointer">
                      {STYLE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Preferred Currency</label>
                    <select value={preferences.currency} onChange={(e) => setPreferences((prev: any) => ({ ...prev, currency: e.target.value }))} className="w-full bg-[#0a0c16] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none cursor-pointer">
                      {CURRENCY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full mt-3 rounded-xl bg-primary text-white text-xs font-extrabold py-2.5 shadow-glow hover:brightness-110 transition-all cursor-pointer">Save Travel Preferences</button>
              </form>
            </div>
          )}

          {activeTab === "Settings" && (
            <div className="space-y-6 text-left max-w-2xl select-none">
              <div>
                <h2 className="text-xl font-black text-foreground font-outfit">Account Settings</h2>
                <p className="text-xs text-muted-foreground mt-1">Configure Display details and upload profile photos.</p>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); localStorage.setItem("tripai:profile_pic", profilePic); window.dispatchEvent(new Event("tripai:profile_pic_updated")); toast.success("Profile parameters updated!"); }} className="rounded-3xl border border-white/5 bg-[#0a0c16]/50 p-6 space-y-4">
                <h3 className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2.5 mb-2.5"><UserCheck className="size-4 text-primary" /> Profile Details</h3>
                <div className="flex flex-col md:flex-row gap-6 items-center border-b border-white/5 pb-4 mb-4">
                  <div className="shrink-0 overflow-hidden rounded-full border border-primary/30 size-20 bg-primary/10 flex items-center justify-center text-primary select-none text-2xl font-black font-outfit">
                    {profilePic ? (
                      <img
                        src={profilePic}
                        alt="Profile Preview"
                        className="size-full object-cover"
                      />
                    ) : (
                      profileName.trim().slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 flex flex-col text-left gap-2">
                    <span className="text-xs font-bold text-foreground">Profile Picture</span>
                    <span className="text-[10px] text-muted-foreground">Upload a photo directly from your device (PNG or JPG) or paste an image URL.</span>
                    <div className="flex items-center gap-3 mt-1">
                      <label className="rounded-xl bg-primary hover:brightness-110 text-white text-xs font-bold px-4 py-2 cursor-pointer transition-all flex items-center gap-1.5 shadow-glow select-none">
                        <UploadCloud className="size-3.5" /> Upload File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      {profilePic && (
                        <button
                          type="button"
                          onClick={() => { setProfilePic(""); localStorage.removeItem("tripai:profile_pic"); window.dispatchEvent(new Event("tripai:profile_pic_updated")); }}
                          className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold px-4 py-2 cursor-pointer transition-colors text-muted-foreground hover:text-foreground"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col col-span-2 md:col-span-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Display Name</label>
                    <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} className="bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/40 focus:bg-white/[0.05]" />
                  </div>
                  <div className="flex flex-col col-span-2 md:col-span-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Email Address</label>
                    <input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/40 focus:bg-white/[0.05]" />
                  </div>
                  <div className="flex flex-col col-span-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Profile Picture URL</label>
                    <input type="text" placeholder="Paste an Unsplash or direct image URL (e.g. https://images.unsplash.com/...)" value={profilePic} onChange={(e) => setProfilePic(e.target.value)} className="bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/40 focus:bg-white/[0.05]" />
                  </div>
                </div>
                <button type="submit" className="rounded-xl bg-white/5 hover:bg-white/10 text-foreground border border-white/10 text-xs font-extrabold px-6 py-2 transition-colors cursor-pointer">Save Details</button>
              </form>
            </div>
          )}

          {activeTab === "Saved Trips" && (
            <div className="space-y-6 text-left max-w-4xl select-none">
              <div>
                <h2 className="text-xl font-black text-foreground font-outfit">Saved Trips</h2>
                <p className="text-xs text-muted-foreground mt-1 font-semibold">Your bookmarked itineraries, ready when you are.</p>
              </div>

              {savedTrips.length === 0 ? (
                <div className="rounded-3xl border border-white/5 bg-[#0a0c16]/50 p-12 text-center select-none">
                  <div className="grid size-12 place-items-center rounded-2xl bg-white/5 text-muted-foreground border border-white/5 mx-auto mb-4">
                    <Plane className="size-6 -rotate-45" />
                  </div>
                  <div className="text-lg font-bold text-foreground">No saved trips yet</div>
                  <p className="mt-2 text-sm text-muted-foreground max-w-xs mx-auto">
                    Plan a trip on the Home tab and save it to sync your travels here.
                  </p>
                  <button
                    className="mt-6 rounded-xl font-bold px-6 py-2.5 bg-[image:var(--gradient-hero)] shadow-glow text-white hover:brightness-110 cursor-pointer"
                    onClick={() => setActiveTab("Home")}
                  >
                    Plan a trip
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {savedTrips.map((t) => (
                    <div
                      key={t.id}
                      className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#0a0c16]/50 p-5 hover:border-white/10 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary truncate">
                            <MapPin className="size-3.5" /> {t.input.from} → {t.input.destination || "AI-picked"}
                          </div>
                          <div className="text-lg font-extrabold text-foreground truncate">
                            {t.input.days} Days · {t.input.style}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                            <Calendar className="size-3.5 shrink-0" />
                            <span className="truncate">
                              {t.input.startDate && t.input.endDate
                                ? `${t.input.startDate} → ${t.input.endDate}`
                                : new Date(t.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-sm font-semibold text-muted-foreground mt-1">
                            Budget:{" "}
                            <span className="text-foreground font-bold">
                              {t.input.currency === "INR" ? "₹" : "$"}{t.input.budget.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTrip(t.id)}
                          aria-label="Delete trip"
                          className="rounded-full p-2 text-muted-foreground transition-all duration-300 hover:bg-destructive/15 hover:text-destructive border border-transparent hover:border-destructive/10 cursor-pointer"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleViewTrip(t)}
                        className="mt-5 w-full rounded-xl py-2.5 font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-foreground transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        View Itinerary <ArrowRight className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "Help & Support" && (
            <div className="space-y-6 text-left max-w-4xl">
              <div>
                <h2 className="text-xl font-black text-foreground">Support Console</h2>
                <p className="text-xs text-muted-foreground mt-1">Interact with virtual Atlas support representatives.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.8fr] gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-foreground border-b border-white/5 pb-2">FAQs</h3>
                  {[{ q: "How does AI create itineraries?", a: "We compile budget, locations, and traveler groups, and relay them to Llama 3/Gemini structures." }, { q: "Can I edit an itinerary?", a: "Yes, use the chat companion inside the itinerary viewer." }].map((faq, i) => (
                    <div key={i} className="p-4 rounded-xl border border-white/5 bg-[#0a0c16]/30">
                      <h4 className="text-xs font-black text-foreground">❓ {faq.q}</h4>
                      <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-foreground border-b border-white/5 pb-2 flex justify-between items-center">
                    <span>Tickets Log</span>
                    <button onClick={() => setActiveTicket(null)} className="text-[10px] text-primary font-bold hover:underline">New Ticket</button>
                  </h3>

                  {activeTicket ? (
                    <div className="rounded-2xl border border-white/10 bg-[#0a0c16]/50 p-4 flex flex-col h-[360px]">
                      <div className="border-b border-white/5 pb-2.5 mb-2.5 flex items-center justify-between text-xs">
                        <span className="font-extrabold text-foreground truncate max-w-[200px]">🎟️ {activeTicket.subject}</span>
                        <span className="text-[9px] text-yellow-400 font-bold bg-yellow-500/10 px-1.5 py-0.5 rounded border uppercase">{activeTicket.status}</span>
                      </div>
                      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                        <div className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-xs"><span className="text-[9px] text-primary block font-bold uppercase mb-1">Description:</span>{activeTicket.text}</div>
                        {activeTicket.replies.map((r, idx) => (
                          <div key={idx} className={`flex gap-2 text-left items-start ${r.sender !== "agent" ? "flex-row-reverse" : ""}`}>
                            <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed max-w-[85%] ${r.sender === "agent" ? "bg-white/[0.05] text-foreground border border-white/5" : "bg-primary text-white font-medium"}`}>{r.text}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-2 border-t border-white/5 pt-3">
                        <input type="text" value={ticketReplyText} onChange={(e) => setTicketReplyText(e.target.value)} placeholder="Reply..." className="flex-1 bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none" />
                        <button onClick={handleSendTicketReply} className="px-3 bg-primary text-white text-xs font-bold rounded-xl hover:brightness-110 cursor-pointer shadow-glow">Send</button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleOpenTicket} className="rounded-3xl border border-white/5 bg-[#0a0c16]/50 p-5 space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 block">Subject</label>
                        <input type="text" required value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} placeholder="e.g. Can't save itinerary" className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none font-semibold" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 block">Description</label>
                        <textarea required value={ticketDescription} onChange={(e) => setTicketDescription(e.target.value)} placeholder="Details..." rows={4} className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none resize-none" />
                      </div>
                      <button type="submit" className="w-full rounded-xl bg-primary text-white text-xs font-extrabold py-2.5 shadow-glow hover:brightness-110 transition-all cursor-pointer">Submit</button>
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
          <div className="relative flex flex-col w-64 bg-[#0a0c16] h-full border-r border-white/5 p-4 animate-in slide-in-from-left duration-250">
            <button onClick={() => setMobileMenuOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/10 text-muted-foreground hover:text-foreground">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="pb-6 border-b border-white/5 mb-4">
              <div className="flex items-center gap-3">
                <div className="shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white p-1 shadow-md"><img src="/logo.png" alt="Logo" className="size-8 object-contain" /></div>
                <div className="flex flex-col text-left"><span className="text-md font-black text-foreground">Trip<span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">AI</span></span></div>
              </div>
            </div>
            <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
              {[
                { name: "Home", icon: Home },
                { name: "Bookings", icon: Plane },
                { name: "Calendar", icon: Calendar },
                { name: "Documents", icon: FileText },
                { name: "Preferences", icon: Sliders },
                { name: "Saved Trips", icon: Bookmark },
                { name: "Settings", icon: Settings },
                { name: "Help & Support", icon: HelpCircle },
              ].map((item) => (
                <button key={item.name} onClick={() => { setMobileMenuOpen(false); setActiveTab(item.name); }} className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${activeTab === item.name ? "text-primary bg-primary/10 border border-primary/20" : "text-muted-foreground hover:bg-white/5"}`}>
                  <item.icon className="size-4" />{item.name}
                </button>
              ))}
            </nav>
            <div className="border-t border-white/5 pt-4 space-y-2 text-left">
              <button onClick={() => logout()} className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-destructive"><LogOut className="size-4" />Log Out</button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Planner Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto select-none">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0d0f1f]/95 p-6 md:p-8 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/10 text-muted-foreground hover:text-foreground cursor-pointer"><svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            <div className="text-left space-y-1 mb-6">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2"><Sparkles className="size-5 text-primary" /> Complete Your Plan</h3>
            </div>
            <form onSubmit={handleModalSubmit} className="space-y-4 text-left font-sans">
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs font-bold text-foreground">
                <div className="flex flex-col text-left">
                  <label className="text-[8px] text-muted-foreground uppercase mb-1">Departing From</label>
                  <input
                    type="text"
                    required
                    placeholder="Departure"
                    value={modalForm.from}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, from: e.target.value }))}
                    className="bg-transparent text-xs text-foreground font-semibold placeholder:text-muted-foreground focus:outline-none w-full"
                  />
                </div>
                <ArrowRight className="size-4 text-primary shrink-0" />
                <div className="flex flex-col text-left">
                  <label className="text-[8px] text-muted-foreground uppercase mb-1 text-right block">Destination</label>
                  <input
                    type="text"
                    required
                    placeholder="Destination"
                    value={modalForm.destination}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, destination: e.target.value }))}
                    className="bg-transparent text-xs text-foreground font-semibold placeholder:text-muted-foreground focus:outline-none w-full text-right"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col text-left">
                  <label className="text-[8px] text-muted-foreground uppercase mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={modalForm.startDate}
                    onChange={(e) => {
                      const start = e.target.value;
                      setModalForm((prev) => {
                        const days = prev.endDate ? daysBetween(start, prev.endDate) : prev.days;
                        return { ...prev, startDate: start, days };
                      });
                    }}
                    className="bg-transparent text-xs text-foreground font-semibold focus:outline-none w-full cursor-pointer [color-scheme:dark]"
                  />
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col text-left">
                  <label className="text-[8px] text-muted-foreground uppercase mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={modalForm.endDate}
                    onChange={(e) => {
                      const end = e.target.value;
                      setModalForm((prev) => {
                        const days = prev.startDate ? daysBetween(prev.startDate, end) : prev.days;
                        return { ...prev, endDate: end, days };
                      });
                    }}
                    className="bg-transparent text-xs text-foreground font-semibold focus:outline-none w-full cursor-pointer [color-scheme:dark]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 items-end">
                <div className="col-span-1 flex flex-col text-left">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Travelers</label>
                  <input
                    type="number"
                    min={1}
                    value={modalForm.travelers}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, travelers: Number(e.target.value) }))}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-xs text-foreground font-semibold"
                  />
                </div>
                <div className="col-span-2 flex flex-col text-left">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Budget Limit</label>
                  <input
                    type="number"
                    value={modalForm.budget}
                    onChange={(e) => setModalForm((prev: any) => ({ ...prev, budget: Number(e.target.value) }))}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-xs text-foreground font-semibold"
                  />
                </div>
                <div className="col-span-1 flex flex-col text-left">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Currency</label>
                  <select
                    value={modalForm.currency}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, currency: e.target.value }))}
                    className="w-full bg-[#0a0c16] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-foreground cursor-pointer"
                  >
                    {CURRENCY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col"><label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Lodging</label><select value={modalForm.accommodation} onChange={(e) => setModalForm((prev) => ({ ...prev, accommodation: e.target.value }))} className="w-full bg-[#0a0c16] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-foreground cursor-pointer">{ACCOMMODATION_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}</select></div>
                <div className="flex flex-col"><label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Transit</label><select value={modalForm.transport} onChange={(e) => setModalForm((prev) => ({ ...prev, transport: e.target.value }))} className="w-full bg-[#0a0c16] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-foreground cursor-pointer">{TRANSPORT_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
              </div>
              <div className="flex flex-col"><label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Travel Style</label><select value={modalForm.style} onChange={(e) => setModalForm((prev) => ({ ...prev, style: e.target.value as TravelStyle }))} className="w-full bg-[#0a0c16] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-foreground cursor-pointer">{STYLE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Interests</label>
                <div className="flex flex-wrap gap-1.5">
                  {INTEREST_OPTIONS.map((interest) => {
                    const isSelected = modalForm.interests.includes(interest);
                    return <button type="button" key={interest} onClick={() => { setModalForm((prev) => ({ ...prev, interests: isSelected ? prev.interests.filter((i) => i !== interest) : [...prev.interests, interest] })); }} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${isSelected ? "bg-primary text-white border-primary" : "bg-white/[0.02] text-muted-foreground border-white/5 hover:text-foreground"}`}>{interest}</button>;
                  })}
                </div>
              </div>
              <div className="flex flex-col"><label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Notes</label><textarea value={modalForm.notes} onChange={(e) => setModalForm((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Notes..." rows={2} className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-xs text-foreground resize-none" /></div>
              <div className="flex gap-3 mt-6 border-t border-white/5 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-extrabold cursor-pointer">Cancel</button>
                <button type="submit" disabled={modalLoading} className="flex-1 py-2.5 rounded-xl bg-[image:var(--gradient-hero)] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-glow disabled:opacity-50 cursor-pointer">
                  {modalLoading ? <Loader2 className="size-4 animate-spin text-white" /> : <><Sparkles className="size-3.5" /> Generate</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0d0f1f]/95 p-6 md:p-8 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200 overflow-y-auto">
            <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/10 text-muted-foreground hover:text-foreground cursor-pointer"><svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            {checkoutStep === "pricing" && (
              <div className="text-left space-y-6">
                <div>
                  <h3 className="text-lg font-black text-foreground font-outfit">🚀 Unlock Premium Tiers</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col justify-between h-[200px]">
                    <div><h4 className="text-xs font-bold text-muted-foreground uppercase">Basic Plan</h4><div className="text-lg font-black text-foreground mt-2">Free</div></div>
                    <button disabled className="w-full mt-4 rounded-xl border border-white/10 text-muted-foreground text-xs font-bold py-2 bg-transparent opacity-60">Current</button>
                  </div>
                  <div className="p-5 rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-amber-500/5 flex flex-col justify-between h-[200px] relative">
                    <div><h4 className="text-xs font-bold text-yellow-400 uppercase">Trip AI Pro</h4><div className="text-lg font-black text-foreground mt-2">₹499 <span className="text-[10px] text-muted-foreground">/ year</span></div></div>
                    <button onClick={() => setCheckoutStep("billing")} className="w-full mt-4 rounded-xl bg-yellow-500 hover:brightness-110 text-neutral-950 text-xs font-black py-2 transition-all cursor-pointer">Subscribe</button>
                  </div>
                </div>
              </div>
            )}
            {checkoutStep === "billing" && (
              <div className="text-left space-y-6">
                <div><h3 className="text-lg font-black text-foreground">💳 Checkout</h3></div>
                <form onSubmit={handleUpgradeCheckout} className="space-y-4">
                  <div className="flex flex-col"><label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Card Number</label><input type="text" required value={cardForm.number} onChange={(e) => setCardForm((prev) => ({ ...prev, number: e.target.value.replace(/\D/g, "").slice(0, 16) }))} placeholder="4242 4242" className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none font-semibold" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col"><label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5 font-outfit">Expiry</label><input type="text" required value={cardForm.expiry} onChange={(e) => setCardForm((prev) => ({ ...prev, expiry: e.target.value.slice(0, 5) }))} placeholder="MM/YY" className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-center" /></div>
                    <div className="flex flex-col"><label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">CVC</label><input type="password" required value={cardForm.cvc} onChange={(e) => setCardForm((prev) => ({ ...prev, cvc: e.target.value.replace(/\D/g, "").slice(0, 3) }))} placeholder="•••" className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-center" /></div>
                  </div>
                  <div className="flex flex-col"><label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Name</label><input type="text" required value={cardForm.name} onChange={(e) => setCardForm((prev) => ({ ...prev, name: e.target.value }))} placeholder={profileName} className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5 text-xs" /></div>
                  <div className="flex gap-3 pt-4 border-t border-white/5 mt-6">
                    <button type="button" onClick={() => setCheckoutStep("pricing")} className="flex-1 py-2.5 bg-white/[0.02] border border-white/5 rounded-xl text-xs cursor-pointer">Back</button>
                    <button type="submit" disabled={paying} className="flex-1 py-2.5 bg-yellow-500 text-neutral-950 text-xs font-black rounded-xl hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer">{paying ? <Loader2 className="size-4 animate-spin text-neutral-950" /> : <><Check className="size-4" /> Simulate Payment</>}</button>
                  </div>
                </form>
              </div>
            )}
            {checkoutStep === "success" && (
              <div className="text-center space-y-6 py-6 animate-in zoom-in-95 duration-200">
                <div className="mx-auto size-16 bg-yellow-500/10 border border-yellow-500/30 rounded-full flex items-center justify-center text-yellow-500 text-3xl animate-bounce">🎉</div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-yellow-400 font-outfit">Upgrade Completed!</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">Thank you, {cardForm.name}! Pro Member benefits active.</p>
                </div>
                <button onClick={() => setIsCheckoutOpen(false)} className="rounded-xl bg-white/5 border border-white/10 px-8 py-2.5 text-xs font-extrabold cursor-pointer">Explore Pro</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
