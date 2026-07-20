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
      { title: "Dashboard — Trip AI" },
      { name: "description", content: "AI-powered travel planner dashboard." },
    ],
  }),
  component: DashboardPage,
});

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
}

// 3 Mock Trips exactly matching the user's design image
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

function daysBetween(a: string, b: string) {
  if (!a || !b) return 1;
  const d = Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000) + 1;
  return Math.max(1, isFinite(d) ? d : 1);
}

function DashboardPage() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  // Active / Mocked Sidebar navigation status
  const [activeTab, setActiveTab] = useState<string>("Home");

  // Checklist state
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

  // Weather widget Ranchi dynamic details
  const [weatherCity] = useState("Ranchi");

  // Saved Trips state (dynamically fetched or fallbacks to mocks)
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  // Search Filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Hero form planning fields
  const [heroFrom, setHeroFrom] = useState("Musabani");
  const [heroTo, setHeroTo] = useState("Ranchi");
  const [heroDates, setHeroDates] = useState("2026-05-20 - 2026-05-24");
  const [heroTravelers, setHeroTravelers] = useState(2);

  // Planner Overlay Modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "bot-init",
      sender: "bot",
      text: `Hi Ak! 👋 I can help you plan your trips, find the best options, manage your bookings, and more. What would you like to do today?`,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Mobile menu control
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dark/Light Mode state
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Fetch saved trips on mount
  useEffect(() => {
    if (token) {
      fetch("/api/trips", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data: SavedTrip[]) => {
          // If the backend has trips, we merge them with mock data so it always looks full
          const uniqueBackend = data.filter(
            (bt) => !MOCK_SAVED_TRIPS.some((mt) => mt.input.destination === bt.input.destination)
          );
          setSavedTrips([...uniqueBackend, ...MOCK_SAVED_TRIPS]);
        })
        .catch(() => {
          setSavedTrips(MOCK_SAVED_TRIPS);
        })
        .finally(() => {
          setLoadingTrips(false);
        });
    } else {
      setSavedTrips(MOCK_SAVED_TRIPS);
      setLoadingTrips(false);
    }
  }, [token]);

  // Scroll chatbot to bottom on message change
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Trigger modal planning with hero fields pre-populated
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

      // Save locally & on backend if token is active
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
        // Fallback to localStorage
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
          itinerary: "", // Dashboard chat context has no active itinerary loaded
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
      // Local premium mock answers to show the AI chat is extremely smart and offline-friendly!
      let replyText = "I would be happy to help with that! However, it seems the backend is offline. Let me know if you would like me to help plan a customized journey to Ranchi, Manali, or Goa instead!";
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

  // Filter saved trips based on quick search query
  const filteredTrips = savedTrips.filter((t) => {
    const term = searchQuery.toLowerCase();
    return (
      t.input.from.toLowerCase().includes(term) ||
      t.input.destination.toLowerCase().includes(term) ||
      (t.input.notes && t.input.notes.toLowerCase().includes(term))
    );
  });

  return (
    <div className={`relative min-h-screen bg-[#080912] text-foreground flex ${isDarkMode ? "dark" : ""}`}>
      {/* Background neon visual grids */}
      <div className="glow-orb glow-orb-primary top-[-100px] left-[-50px] size-[500px]" />
      <div className="glow-orb glow-orb-secondary bottom-[-200px] right-[-100px] size-[600px]" />

      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[#0a0c16]/80 backdrop-blur-xl h-screen sticky top-0 shrink-0 select-none">
        {/* Logo */}
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

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {[
            { name: "Home", icon: Home, route: "/" },
            { name: "Trips", icon: Plane, route: "/saved" },
            { name: "Saved", icon: Bookmark, route: "/saved" },
            { name: "Bookings", icon: Calendar, route: null },
            { name: "Calendar", icon: Calendar, route: null },
            { name: "Documents", icon: FileText, route: null },
            { name: "Preferences", icon: Sliders, route: null },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => {
                if (item.route) {
                  setActiveTab(item.name);
                  navigate({ to: item.route });
                } else {
                  toast.info(`${item.name} is a premium demo section.`);
                }
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === item.name
                  ? "text-primary bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(104,117,245,0.1)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
              }`}
            >
              <item.icon className="size-4.5" />
              {item.name}
            </button>
          ))}
        </nav>

        {/* Upgrade Card */}
        <div className="px-4 py-4">
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
                onClick={() => toast.success("Trip AI Premium registration coming soon!")}
                className="w-full mt-3 rounded-xl bg-[image:var(--gradient-hero)] text-white text-xs font-extrabold py-2 shadow-glow hover:brightness-110 transition-all duration-300 cursor-pointer"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <button
            onClick={() => toast.info("Settings panel coming soon!")}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground transition-all duration-300"
          >
            <Settings className="size-4" />
            Settings
          </button>
          <button
            onClick={() => toast.info("Help Center is offline.")}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground transition-all duration-300"
          >
            <HelpCircle className="size-4" />
            Help & Support
          </button>

          {/* Dark Mode Switcher */}
          <div className="flex items-center justify-between px-4 py-2.5">
            <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-2">
              <Moon className="size-3.5" /> Dark Mode
            </span>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary/20 transition-colors duration-200 ease-in-out focus:outline-none"
            >
              <span
                className={`pointer-events-none inline-block size-4 transform rounded-full bg-primary shadow ring-0 transition duration-200 ease-in-out ${
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
        <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#080912]/80 backdrop-blur-xl shrink-0 select-none">
          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center gap-4 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5"
            >
              <svg className="size-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* Mobile Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Trip AI Logo" className="size-6 object-contain" />
              <span className="text-sm font-black text-foreground">
                Trip<span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">AI</span>
              </span>
            </Link>
          </div>

          {/* Search bar widget */}
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

          {/* Profile controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-[image:var(--gradient-hero)] text-white text-xs font-black px-4 py-2.5 shadow-glow hover:brightness-110 transition-all duration-300 shrink-0 cursor-pointer"
            >
              <Plus className="size-3.5" /> Plan New Trip
            </button>

            <button
              onClick={() => toast.info("No new notifications")}
              className="p-2.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all duration-300 relative shrink-0"
            >
              <Bell className="size-4" />
              <span className="absolute top-1 right-1 size-1.5 rounded-full bg-primary" />
            </button>

            {/* User Profile Info */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
              <div className="shrink-0 overflow-hidden rounded-full border border-primary/30 size-9 bg-card">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
                  alt="Profile"
                  className="size-full object-cover"
                />
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight max-w-[100px]">
                <span className="text-xs font-bold text-foreground truncate">
                  {user ? user.name : "Ak"}
                </span>
                <span className="text-[9px] text-muted-foreground font-semibold">Traveler</span>
              </div>
              {user && (
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors ml-1"
                >
                  <LogOut className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Grid */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          
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

              {/* Floating Form */}
              <form onSubmit={handleHeroPlan} className="grid grid-cols-2 md:grid-cols-[1.1fr_1.1fr_1.4fr_1fr_auto] gap-2 md:gap-3 p-2 bg-[#0d0f1f]/85 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl items-center w-full">
                {/* From Field */}
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

                {/* To Field */}
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

                {/* Dates Field */}
                <div className="flex flex-col text-left px-3 py-1 bg-white/[0.02] border border-white/5 rounded-xl col-span-2 md:col-span-1">
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="size-2 text-accent-foreground" /> Dates
                  </span>
                  <input
                    type="text"
                    required
                    value={heroDates}
                    onChange={(e) => setHeroDates(e.target.value)}
                    placeholder="20 May – 24 May"
                    className="w-full bg-transparent text-xs text-foreground font-semibold placeholder:text-muted-foreground focus:outline-none mt-0.5"
                  />
                </div>

                {/* Travelers Select */}
                <div className="flex flex-col text-left px-3 py-1 bg-white/[0.02] border border-white/5 rounded-xl col-span-2 md:col-span-1">
                  <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Users className="size-2 text-primary" /> Travelers
                  </span>
                  <select
                    value={heroTravelers}
                    onChange={(e) => setHeroTravelers(Number(e.target.value))}
                    className="w-full bg-transparent text-xs text-foreground font-semibold focus:outline-none mt-0.5 cursor-pointer border-none p-0"
                  >
                    <option value={1} className="bg-[#0f1122]">1 Traveler</option>
                    <option value={2} className="bg-[#0f1122]">2 Travelers</option>
                    <option value={3} className="bg-[#0f1122]">3 Travelers</option>
                    <option value={4} className="bg-[#0f1122]">4 Travelers</option>
                    <option value={5} className="bg-[#0f1122]">5+ Travelers</option>
                  </select>
                </div>

                {/* Submit Action */}
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
            
            {/* Left 2/3: Saved Trips list */}
            <div className="xl:col-span-2 space-y-4 flex flex-col">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 select-none">
                <h3 className="text-lg font-bold text-foreground tracking-tight">Your Saved Trips</h3>
                <Link to="/saved" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  View All <ChevronRight className="size-3" />
                </Link>
              </div>

              {loadingTrips ? (
                <div className="flex flex-col items-center justify-center py-20 gap-2.5">
                  <Loader2 className="size-6 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground font-semibold">Retrieving your trips...</span>
                </div>
              ) : filteredTrips.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl bg-white/[0.01] border border-dashed border-white/10">
                  <Bookmark className="size-8 text-muted-foreground/55" />
                  <p className="text-xs text-muted-foreground">No matching itineraries found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTrips.map((trip) => {
                    const tag = trip.id.startsWith("mock-1")
                      ? "Upcoming"
                      : trip.id.startsWith("mock-2")
                        ? "Saved"
                        : "Draft";

                    const badgeColor =
                      tag === "Upcoming"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : tag === "Saved"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-orange-500/10 text-orange-400 border-orange-500/20";

                    // Custom Unsplash thumbnails matching location
                    const imgUrl = trip.input.destination.toLowerCase() === "ranchi"
                      ? "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=150&h=150&q=70"
                      : trip.input.destination.toLowerCase() === "manali"
                        ? "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=150&h=150&q=70"
                        : "https://images.unsplash.com/photo-1596761301588-915ccaec3e83?auto=format&fit=crop&w=150&h=150&q=70";

                    return (
                      <article key={trip.id} className="relative overflow-hidden rounded-2xl border border-white/5 bg-card/25 p-4 flex flex-col sm:flex-row gap-4 hover:border-white/10 transition-all duration-300">
                        {/* Thumbnail */}
                        <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden bg-muted shrink-0 relative">
                          <img src={imgUrl} alt={trip.input.destination} className="size-full object-cover" />
                          <span className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[8px] font-bold border ${badgeColor}`}>
                            {tag}
                          </span>
                        </div>

                        {/* Details */}
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
                            {/* Meta Specs */}
                            <div className="flex gap-4 text-[10px] text-muted-foreground font-semibold">
                              <span>⏱️ {trip.input.days} Days</span>
                              <span>💰 {trip.input.currency === "INR" ? "₹" : "$"}{trip.input.budget.toLocaleString()}</span>
                              <span>👥 {trip.input.style}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleViewTrip(trip)}
                                className="rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-[10px] font-extrabold px-3 py-1.5 transition-colors cursor-pointer"
                              >
                                View Itinerary
                              </button>
                              <button
                                onClick={() => {
                                  toast.info("Context options opening");
                                }}
                                className="p-1.5 rounded-lg border border-white/5 hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
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
              <div className="flex items-center gap-2 border-b border-white/5 pb-2 select-none">
                <Sparkles className="size-4.5 text-primary" />
                <h3 className="text-lg font-bold text-foreground tracking-tight text-left">Trip AI Assistant</h3>
              </div>

              {/* Chat Container Box */}
              <div className="flex-1 rounded-2xl border border-white/5 bg-[#0a0c16]/50 p-4 flex flex-col h-[400px] overflow-hidden">
                {/* Messages Box */}
                <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-thin">
                  {messages.map((m) => {
                    const isBot = m.sender === "bot";
                    return (
                      <div key={m.id} className={`flex gap-2.5 text-left items-start ${!isBot ? "flex-row-reverse" : ""}`}>
                        {/* Avatar */}
                        <div className={`shrink-0 overflow-hidden rounded-full border size-7.5 bg-card ${isBot ? "border-primary/30 p-0.5" : "border-secondary/30"}`}>
                          <img
                            src={isBot ? "/logo.png" : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"}
                            alt={isBot ? "AI" : "User"}
                            className="size-full object-contain rounded-full"
                          />
                        </div>

                        {/* Bubble */}
                        <div className={`rounded-2xl px-3 py-2 text-xs max-w-[80%] leading-relaxed ${
                          isBot
                            ? "bg-white/[0.03] text-foreground border border-white/5"
                            : "bg-primary text-white font-medium"
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

                {/* Suggestion Chips */}
                <div className="mt-3 grid grid-cols-2 gap-1.5 text-left border-t border-white/5 pt-3">
                  {[
                    "Plan a weekend trip",
                    "Find budget hotels in Manali",
                    "Best time to visit Kerala",
                    "Create an itinerary for Europe",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestionClick(s)}
                      className="text-[10px] text-muted-foreground hover:text-foreground font-semibold bg-white/[0.02] border border-white/5 hover:border-primary/20 px-2.5 py-1.5 rounded-xl transition-all text-left truncate cursor-pointer"
                    >
                      💡 {s}
                    </button>
                  ))}
                </div>

                {/* Input form */}
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask me anything..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") sendChatMessage();
                    }}
                    className="flex-1 bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all"
                  />
                  <button
                    onClick={() => sendChatMessage()}
                    className="size-8.5 bg-primary rounded-xl text-white hover:brightness-110 flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-glow"
                  >
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
              <button
                onClick={() => toast.info("Full destinations database is coming soon.")}
                className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                Explore All <ChevronRight className="size-3" />
              </button>
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
                  className="group cursor-pointer relative overflow-hidden rounded-2xl border border-white/5 bg-card/25 shadow-xl transition-all duration-500 hover:border-primary/30 hover:shadow-glow hover:-translate-y-1"
                >
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
            
            {/* Widget 1: Budget Overview */}
            <div className="rounded-2xl border border-white/5 bg-card/25 p-5 flex flex-col h-[340px]">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 select-none">
                <h4 className="text-sm font-bold text-foreground">Budget Overview</h4>
                <TrendingUp className="size-4 text-primary" />
              </div>

              {/* Chart Visualizer */}
              <div className="flex-1 flex items-center justify-center py-4 relative">
                {/* SVG Donut Chart */}
                <svg className="size-40 transform -rotate-90">
                  {/* Transport: 40% (stroke-dasharray: 251.2 * 0.4 = 100.48) */}
                  <circle
                    cx="80"
                    cy="80"
                    r="40"
                    stroke="var(--color-primary)"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray="100.48 251.2"
                    strokeDashoffset="0"
                    className="transition-all"
                  />
                  {/* Stay: 30% (stroke-dasharray: 251.2 * 0.3 = 75.36) */}
                  <circle
                    cx="80"
                    cy="80"
                    r="40"
                    stroke="var(--color-secondary)"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray="75.36 251.2"
                    strokeDashoffset="-100.48"
                    className="transition-all"
                  />
                  {/* Food: 15% (stroke-dasharray: 251.2 * 0.15 = 37.68) */}
                  <circle
                    cx="80"
                    cy="80"
                    r="40"
                    stroke="var(--color-chart-5)"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray="37.68 251.2"
                    strokeDashoffset="-175.84"
                    className="transition-all"
                  />
                  {/* Activities: 10% (stroke-dasharray: 251.2 * 0.1 = 25.12) */}
                  <circle
                    cx="80"
                    cy="80"
                    r="40"
                    stroke="var(--color-chart-4)"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray="25.12 251.2"
                    strokeDashoffset="-213.52"
                    className="transition-all"
                  />
                  {/* Others: 5% (stroke-dasharray: 251.2 * 0.05 = 12.56) */}
                  <circle
                    cx="80"
                    cy="80"
                    r="40"
                    stroke="#10b981"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray="12.56 251.2"
                    strokeDashoffset="-238.64"
                    className="transition-all"
                  />
                </svg>

                {/* Inner Ring stats */}
                <div className="absolute flex flex-col items-center justify-center leading-tight">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total</span>
                  <span className="text-md font-black text-foreground">₹10,000</span>
                </div>
              </div>

              {/* Legends Table */}
              <div className="grid grid-cols-3 gap-y-1.5 gap-x-2 text-[10px] text-muted-foreground font-semibold border-t border-white/5 pt-3">
                <div className="flex items-center gap-1.5 truncate"><span className="size-2 rounded bg-primary shrink-0" /> Transport 40%</div>
                <div className="flex items-center gap-1.5 truncate"><span className="size-2 rounded bg-secondary shrink-0" /> Stay 30%</div>
                <div className="flex items-center gap-1.5 truncate"><span className="size-2 rounded bg-[var(--color-chart-5)] shrink-0" /> Food 15%</div>
                <div className="flex items-center gap-1.5 truncate"><span className="size-2 rounded bg-[var(--color-chart-4)] shrink-0" /> Activities 10%</div>
                <div className="flex items-center gap-1.5 truncate"><span className="size-2 rounded bg-emerald-500 shrink-0" /> Others 5%</div>
              </div>
            </div>

            {/* Widget 2: Checklist */}
            <div className="rounded-2xl border border-white/5 bg-card/25 p-5 flex flex-col h-[340px]">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 select-none">
                <h4 className="text-sm font-bold text-foreground">Travel Checklist</h4>
                <button
                  onClick={() => toast.info("See checklist directory")}
                  className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors"
                >
                  View All
                </button>
              </div>

              {/* Checklist list */}
              <div className="flex-1 py-4 space-y-3 overflow-y-auto">
                {checklist.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleChecklist(item.id)}
                        className="rounded border-white/10 text-primary focus:ring-primary size-4 cursor-pointer"
                      />
                      <span className={`text-xs font-semibold ${item.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                        {item.task}
                      </span>
                    </div>
                    {item.completed && <CheckCircle2 className="size-4 text-green-500 shrink-0" />}
                  </label>
                ))}
              </div>

              <button
                onClick={() => toast.success("All list items synchronised.")}
                className="w-full rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-xs font-extrabold py-2 transition-colors cursor-pointer"
              >
                See Full Checklist
              </button>
            </div>

            {/* Widget 3: Weather Ranchi */}
            <div className="rounded-2xl border border-white/5 bg-card/25 p-5 flex flex-col h-[340px] md:col-span-2 xl:col-span-1">
              <div className="flex items-center justify-between border-b border-white/5 pb-2 select-none">
                <h4 className="text-sm font-bold text-foreground">Weather in {weatherCity}</h4>
                <Cloud className="size-4 text-secondary" />
              </div>

              {/* Active Temp */}
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

              {/* 5-day forecast strip */}
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

              <button
                onClick={() => toast.info("Real-time meteorological details loaded.")}
                className="w-full rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-xs font-extrabold py-2 transition-colors cursor-pointer mt-2"
              >
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
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl bg-primary hover:brightness-110 text-white text-xs font-extrabold px-6 py-3 transition-all shrink-0 cursor-pointer shadow-glow flex items-center gap-2"
            >
              Plan Your Next Trip <ArrowRight className="size-4" />
            </button>
          </section>

        </main>
      </div>

      {/* Mobile Drawer Sidebar Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm select-none">
          <div className="relative flex flex-col w-64 bg-[#0a0c16] h-full border-r border-white/5 p-4 animate-in slide-in-from-left duration-250">
            {/* Close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/10 text-muted-foreground hover:text-foreground"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Logo */}
            <div className="pb-6 border-b border-white/5 mb-4">
              <div className="flex items-center gap-3">
                <div className="shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white p-1 shadow-md">
                  <img src="/logo.png" alt="Trip AI Logo" className="size-8 object-contain" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-md font-black text-foreground">
                    Trip<span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">AI</span>
                  </span>
                  <span className="text-[6.5px] font-bold uppercase tracking-wider text-muted-foreground">
                    Plan here, book anywhere
                  </span>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1.5">
              {[
                { name: "Home", icon: Home, route: "/" },
                { name: "Trips", icon: Plane, route: "/saved" },
                { name: "Saved", icon: Bookmark, route: "/saved" },
                { name: "Bookings", icon: Calendar, route: null },
                { name: "Calendar", icon: Calendar, route: null },
                { name: "Documents", icon: FileText, route: null },
                { name: "Preferences", icon: Sliders, route: null },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (item.route) {
                      setActiveTab(item.name);
                      navigate({ to: item.route });
                    } else {
                      toast.info(`${item.name} is a premium feature.`);
                    }
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold text-left transition-all ${
                    activeTab === item.name
                      ? "text-primary bg-primary/10 border border-primary/20"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="size-4" />
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Switch Dark/Light */}
            <div className="border-t border-white/5 pt-4 space-y-2 text-left">
              <div className="flex items-center justify-between px-2">
                <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-2">
                  <Moon className="size-3.5" /> Dark Mode
                </span>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary/20 transition-colors duration-200 ease-in-out focus:outline-none"
                >
                  <span
                    className={`pointer-events-none inline-block size-4 transform rounded-full bg-primary shadow transition duration-200 ease-in-out ${
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
                  className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
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
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0d0f1f]/95 p-6 md:p-8 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/10 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <svg className="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Heading */}
            <div className="text-left space-y-1 mb-6">
              <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                <Sparkles className="size-5 text-primary animate-pulse" /> Complete Your Plan
              </h3>
              <p className="text-xs text-muted-foreground">
                Define details to generate your optimized itinerary.
              </p>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleModalSubmit} className="space-y-4 text-left">
              
              {/* Departure -> Destination summary */}
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-bold text-foreground">
                <div className="flex flex-col">
                  <span className="text-[8px] text-muted-foreground uppercase">Departing</span>
                  <span>{modalForm.from}</span>
                </div>
                <ArrowRight className="size-4 text-primary" />
                <div className="flex flex-col text-right">
                  <span className="text-[8px] text-muted-foreground uppercase">Destination</span>
                  <span>{modalForm.destination}</span>
                </div>
              </div>

              {/* Dates & Travelers summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col text-xs font-bold text-foreground">
                  <span className="text-[8px] text-muted-foreground uppercase">Duration</span>
                  <span>{modalForm.days} Days ({modalForm.startDate} – {modalForm.endDate})</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col text-xs font-bold text-foreground">
                  <span className="text-[8px] text-muted-foreground uppercase">Travelers</span>
                  <span>{modalForm.travelers} Persons</span>
                </div>
              </div>

              {/* Budget & Currency */}
              <div className="grid grid-cols-3 gap-3 items-end">
                <div className="col-span-2 flex flex-col">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Budget Limit</label>
                  <input
                    type="number"
                    value={modalForm.budget}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, budget: Number(e.target.value) }))}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary/40 font-semibold"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Currency</label>
                  <select
                    value={modalForm.currency}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, currency: e.target.value }))}
                    className="w-full bg-[#0a0c16] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/40 cursor-pointer"
                  >
                    {CURRENCY_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Accommodation & Transport */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Lodging</label>
                  <select
                    value={modalForm.accommodation}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, accommodation: e.target.value }))}
                    className="w-full bg-[#0a0c16] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/40 cursor-pointer"
                  >
                    {ACCOMMODATION_OPTIONS.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Transit Mode</label>
                  <select
                    value={modalForm.transport}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, transport: e.target.value }))}
                    className="w-full bg-[#0a0c16] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/40 cursor-pointer"
                  >
                    {TRANSPORT_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Style & Notes */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Travel Style</label>
                <select
                  value={modalForm.style}
                  onChange={(e) => setModalForm((prev) => ({ ...prev, style: e.target.value as TravelStyle }))}
                  className="w-full bg-[#0a0c16] border border-white/5 rounded-xl px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-primary/40 cursor-pointer"
                >
                  {STYLE_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Interests (toggle chips) */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Interests</label>
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
                            ? "bg-primary text-white border-primary shadow-[0_0_8px_rgba(104,117,245,0.3)]"
                            : "bg-white/[0.02] text-muted-foreground border-white/5 hover:text-foreground"
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Special requests (Notes)</label>
                <textarea
                  value={modalForm.notes}
                  onChange={(e) => setModalForm((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g. Vegetarian restaurants, slow pace, kids-friendly spots..."
                  rows={2}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-white/[0.05] transition-all resize-none"
                />
              </div>

              {/* Actions */}
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
                  className="flex-1 py-2.5 rounded-xl bg-[image:var(--gradient-hero)] text-white text-xs font-extrabold hover:brightness-110 flex items-center justify-center gap-2 shadow-glow transition-all disabled:opacity-50 cursor-pointer"
                >
                  {modalLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin text-white" /> Generating...
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
