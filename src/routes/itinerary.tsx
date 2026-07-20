import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bookmark,
  BookmarkCheck,
  Copy,
  Printer,
  Share2,
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Wallet,
  Compass,
  Send,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import type { SavedTrip } from "@/lib/trip-types";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/itinerary")({
  head: () => ({
    meta: [{ title: "Your itinerary — Trip AI" }, { name: "robots", content: "noindex" }],
  }),
  component: ItineraryPage,
});

const SAVED_KEY = "tripai:saved";

function readSaved(): SavedTrip[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
  } catch {
    return [];
  }
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
}

function ItineraryPage() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"itinerary" | "booking">("itinerary");

  // Chatbot states
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hi! I'm Atlas AI, your premium trip concierge. Feel free to ask me questions about this plan, or ask me to change anything (e.g. 'Change this to a couple trip', 'Make the budget cheaper', or 'Suggest dinner spots for Day 3')! I will modify the plan for you live.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat log
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  useEffect(() => {
    const raw = sessionStorage.getItem("tripai:current");
    if (!raw) {
      navigate({ to: "/" });
      return;
    }
    const t: SavedTrip = JSON.parse(raw);
    setTrip(t);

    // Check if saved on database (if logged in)
    if (token) {
      fetch("/api/trips", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((savedTrips: SavedTrip[]) => {
          const isSaved = savedTrips.some(
            (s) =>
              s.id === t.id ||
              (s.input.from === t.input.from &&
                s.input.destination === t.input.destination &&
                s.input.startDate === t.input.startDate &&
                s.input.endDate === t.input.endDate &&
                s.itinerary === t.itinerary),
          );
          setSaved(isSaved);
          if (isSaved) {
            const matched = savedTrips.find(
              (s) =>
                s.id === t.id ||
                (s.input.from === t.input.from &&
                  s.input.destination === t.input.destination &&
                  s.input.startDate === t.input.startDate &&
                  s.input.endDate === t.input.endDate &&
                  s.itinerary === t.itinerary),
            );
            if (matched && matched.id !== t.id) {
              const updatedTrip = { ...t, id: matched.id };
              setTrip(updatedTrip);
              sessionStorage.setItem("tripai:current", JSON.stringify(updatedTrip));
            }
          }
        })
        .catch(() => {
          setSaved(readSaved().some((s) => s.id === t.id));
        });
    } else {
      // Guest local storage check
      setSaved(readSaved().some((s) => s.id === t.id));
    }
  }, [navigate, token]);

  const summary = useMemo(() => {
    if (!trip) return null;
    const { input } = trip;
    return [
      { icon: MapPin, label: "Destination", value: input.destination || "AI-picked" },
      {
        icon: Calendar,
        label: "Dates",
        value:
          input.startDate && input.endDate
            ? `${input.startDate} → ${input.endDate}`
            : `${input.days} days`,
      },
      {
        icon: Wallet,
        label: "Budget",
        value: `${input.budget.toLocaleString()} ${input.currency}`,
      },
      { icon: Users, label: "Travelers", value: `${input.travelers} · ${input.style}` },
    ];
  }, [trip]);

  if (!trip) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="mx-auto max-w-2xl px-6 py-24 text-center text-muted-foreground">
          Loading itinerary…
        </div>
      </div>
    );
  }

  const toggleSave = async () => {
    // If not authenticated, prompt login
    if (!user || !token) {
      sessionStorage.setItem("tripai:redirect", "/itinerary");
      toast.error("Please sign in to save your travel itineraries");
      navigate({ to: "/login" });
      return;
    }

    try {
      if (saved) {
        const res = await fetch(`/api/trips/${trip.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to delete trip");
        setSaved(false);
        toast.success("Removed from saved trips");
      } else {
        const res = await fetch("/api/trips", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            input: trip.input,
            itinerary: trip.itinerary,
          }),
        });
        if (!res.ok) throw new Error("Failed to save trip");
        const savedTrip: SavedTrip = await res.json();

        setTrip(savedTrip);
        sessionStorage.setItem("tripai:current", JSON.stringify(savedTrip));
        setSaved(true);
        toast.success("Trip saved to database!");
      }
    } catch (err) {
      console.error(err);
      // Fallback
      const list = readSaved();
      if (saved) {
        localStorage.setItem(SAVED_KEY, JSON.stringify(list.filter((s) => s.id !== trip.id)));
        setSaved(false);
        toast.success("Removed from saved trips (local)");
      } else {
        localStorage.setItem(SAVED_KEY, JSON.stringify([trip, ...list]));
        setSaved(true);
        toast.success("Trip saved (locally)!");
      }
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(trip.itinerary);
    toast.success("Itinerary copied to clipboard");
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Trip AI itinerary",
          text: trip.itinerary.slice(0, 500),
        });
      } catch (err) {
        console.warn("Share failed:", err);
      }
    } else {
      copy();
    }
  };

  // Chat message submit handler
  const sendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    setChatLoading(true);

    const userMessageId = Math.random().toString();
    setMessages((prev) => [...prev, { id: userMessageId, sender: "user", text: userMsg }]);

    try {
      const res = await fetch("/api/itinerary/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itinerary: trip.itinerary,
          message: userMsg,
          history: messages.slice(-8), // Send last 8 messages for context
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to talk to AI concierge");
      }

      const botReplyRaw = data.reply || "";

      // Check for <updated_itinerary>...</updated_itinerary> XML tags
      const match = botReplyRaw.match(/<updated_itinerary>([\s\S]*?)<\/updated_itinerary>/);

      let botTextResponse = botReplyRaw;
      if (match) {
        // Extract conversation response and strip the tag block
        botTextResponse = botReplyRaw
          .replace(/<updated_itinerary>[\s\S]*?<\/updated_itinerary>/g, "")
          .trim();
        if (!botTextResponse) {
          botTextResponse = "I have updated your itinerary based on your preferences!";
        }

        const newItineraryText = match[1].trim();

        // Update local trip state
        const updatedTrip = { ...trip, itinerary: newItineraryText };
        setTrip(updatedTrip);
        sessionStorage.setItem("tripai:current", JSON.stringify(updatedTrip));

        // If trip is saved, sync changes to MongoDB database!
        if (saved && token) {
          fetch(`/api/trips/${trip.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ itinerary: newItineraryText }),
          })
            .then((syncRes) => {
              if (syncRes.ok) {
                toast.success("Itinerary updated and synced to account!");
              }
            })
            .catch((err) => {
              console.warn("MongoDB sync failed on update:", err);
            });
        } else {
          toast.success("Itinerary updated!");
        }
      }

      setMessages((prev) => [
        ...prev,
        { id: Math.random().toString(), sender: "bot", text: botTextResponse },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "bot",
          text: `Sorry, I encountered an error: ${msg}. Please make sure GROQ_API_KEY is configured in your .env.`,
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Orbs */}
      <div className="glow-orb glow-orb-primary top-[-50px] right-[-50px] size-[350px] sm:size-[500px]" />
      <div className="glow-orb glow-orb-secondary bottom-[-100px] left-[-100px] size-[300px] sm:size-[450px]" />

      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" /> New trip
        </Link>

        {/* Hero details container */}
        <div className="mt-6 rounded-3xl border border-white/5 bg-[image:var(--gradient-hero)] p-6 sm:p-8 text-white shadow-glow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <MapPin className="size-36" />
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-secondary-foreground bg-white/15 px-3 py-1 rounded-full w-fit">
            Your custom itinerary
          </div>
          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            {trip.input.from} → {trip.input.destination || "AI-suggested destination"}
          </h1>
          <div className="mt-6 grid gap-4 grid-cols-2 lg:grid-cols-4">
            {summary!.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl bg-white/10 p-4 border border-white/5 backdrop-blur-md"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/70">
                  <Icon className="size-3.5 text-white/80" /> {label}
                </div>
                <div className="mt-1.5 truncate text-sm font-bold">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Split Screen Container */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.8fr_1fr] items-start">
          {/* LEFT COLUMN: Itinerary / Booking Content */}
          <div className="space-y-6">
            {/* Tab Selection */}
            <div className="flex border-b border-white/5 pb-px print:hidden">
              <button
                onClick={() => setActiveTab("itinerary")}
                className={`pb-3 text-sm font-bold tracking-tight border-b-2 px-1.5 transition-all duration-300 ${
                  activeTab === "itinerary"
                    ? "border-primary text-foreground font-black"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Itinerary Plan
              </button>
              <button
                onClick={() => setActiveTab("booking")}
                className={`ml-6 pb-3 text-sm font-bold tracking-tight border-b-2 px-1.5 transition-all duration-300 flex items-center gap-1.5 ${
                  activeTab === "booking"
                    ? "border-primary text-foreground font-black"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Compass className="size-4 text-primary" /> Book Anywhere Hub
              </button>
            </div>

            {activeTab === "itinerary" ? (
              <div className="animate-fade-in">
                {/* Action Controls */}
                <div className="mt-4 flex flex-wrap gap-2.5 print:hidden">
                  <Button
                    onClick={toggleSave}
                    variant={saved ? "secondary" : "default"}
                    className="rounded-full font-bold h-11 px-5 bg-white/5 border border-white/10 hover:bg-white/10 text-foreground transition-all duration-300"
                  >
                    {saved ? (
                      <BookmarkCheck className="mr-1.5 size-4 text-primary" />
                    ) : (
                      <Bookmark className="mr-1.5 size-4" />
                    )}
                    {saved ? "Saved" : "Save trip"}
                  </Button>
                  <Button
                    onClick={copy}
                    variant="outline"
                    className="rounded-full font-bold h-11 px-5 bg-transparent border-white/10 hover:bg-white/5 text-foreground transition-all duration-300"
                  >
                    <Copy className="mr-1.5 size-4" /> Copy
                  </Button>
                  <Button
                    onClick={share}
                    variant="outline"
                    className="rounded-full font-bold h-11 px-5 bg-transparent border-white/10 hover:bg-white/5 text-foreground transition-all duration-300"
                  >
                    <Share2 className="mr-1.5 size-4" /> Share
                  </Button>
                  <Button
                    onClick={() => window.print()}
                    variant="outline"
                    className="rounded-full font-bold h-11 px-5 bg-transparent border-white/10 hover:bg-white/5 text-foreground transition-all duration-300"
                  >
                    <Printer className="mr-1.5 size-4" /> Print
                  </Button>
                </div>

                {/* Content markdown paper */}
                <article className="prose prose-invert prose-indigo mt-6 max-w-none rounded-3xl border border-white/5 bg-card/45 p-6 sm:p-10 shadow-2xl backdrop-blur-xl prose-headings:tracking-tight prose-h2:mt-8 prose-h2:border-b prose-h2:border-white/5 prose-h2:pb-3 prose-a:text-primary prose-table:text-sm prose-th:text-muted-foreground prose-td:text-foreground/90">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{trip.itinerary}</ReactMarkdown>
                </article>
              </div>
            ) : (
              <BookingHub trip={trip} />
            )}
          </div>

          {/* RIGHT COLUMN: AI Chatbot Concierge Panel */}
          <div className="glass-panel rounded-3xl border-white/5 shadow-xl flex flex-col h-[580px] lg:sticky lg:top-24 overflow-hidden relative">
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/[0.01] flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <Sparkles className="size-4 text-white" />
              </span>
              <div>
                <h2 className="text-sm font-black text-foreground">Atlas AI</h2>
                <p className="text-[10px] text-muted-foreground font-semibold">
                  Tweak inputs & Ask questions
                </p>
              </div>
            </div>

            {/* Message log display */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-semibold scrollbar-thin">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                      m.sender === "user"
                        ? "bg-[image:var(--gradient-hero)] text-white rounded-br-sm"
                        : "bg-white/5 border border-white/5 text-foreground rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 text-muted-foreground rounded-2xl rounded-bl-sm p-3.5 flex items-center gap-2">
                    <Loader2 className="size-3.5 animate-spin text-primary" />
                    <span>AI is editing your plan…</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat message input form */}
            <form
              onSubmit={sendChatMessage}
              className="p-3 border-t border-white/5 bg-white/[0.01] flex gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask to edit itinerary or ask travel questions..."
                className="flex-1 h-10 rounded-xl bg-white/5 border border-white/10 px-3.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 placeholder:text-muted-foreground/60"
                disabled={chatLoading}
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="grid size-10 place-items-center rounded-xl bg-[image:var(--gradient-hero)] text-white hover:brightness-110 disabled:opacity-50 transition-all shadow-glow shrink-0"
              >
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingHub({ trip }: { trip: SavedTrip }) {
  const { input } = trip;
  const from = input.from;
  const destination = input.destination || "Destination";
  const days = input.days;
  const budget = input.budget;
  const currency = input.currency;
  const startDate = input.startDate;

  // Search URLs pre-populated
  const searchGoogleFlights = `https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(destination)}%20from%20${encodeURIComponent(from)}%20on%20${startDate || ""}`;
  const searchSkyscanner = `https://www.skyscanner.com/transport/flights/${encodeURIComponent(from.substring(0, 3).toLowerCase())}/${encodeURIComponent(destination.substring(0, 3).toLowerCase())}/${startDate ? startDate.replace(/\//g, "") : ""}`;
  const searchBooking = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(destination)}`;
  const searchAirbnb = `https://www.airbnb.com/s/${encodeURIComponent(destination)}/homes`;
  const searchViator = `https://www.viator.com/search/${encodeURIComponent(destination)}`;
  const searchGetYourGuide = `https://www.getyourguide.com/s?q=${encodeURIComponent(destination)}`;

  // Estimated Price Distribution based on user inputs
  const estFlight = Math.round(budget * 0.35);
  const estHotel = Math.round(budget * 0.4);
  const estActivities = Math.round(budget * 0.15);
  const estFoodMisc = Math.round(budget * 0.1);

  return (
    <div className="mt-8 space-y-8 animate-fade-in pb-16">
      {/* AI Wise Choice Insight Box */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-white/5 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[image:var(--gradient-hero)]" />
        <div className="flex items-center gap-2 mb-4">
          <span className="grid size-7 place-items-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Compass className="size-4 text-white" />
          </span>
          <h2 className="text-xl font-bold tracking-tight">AI Wise Choice Insight</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Based on your criteria (traveling from <strong>{from}</strong> to{" "}
          <strong>{destination}</strong> for <strong>{days} days</strong> with a budget of{" "}
          <strong>
            {budget.toLocaleString()} {currency}
          </strong>
          ), we recommend a multi-channel booking approach:
        </p>
        <ul className="mt-4 space-y-2.5 text-xs font-semibold text-foreground/90">
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 grid size-4 place-items-center rounded-full bg-emerald-500/15 text-[9px] font-black text-emerald-400">
              ✓
            </span>
            <span>
              <strong>Flights Strategy:</strong> Book directly with airlines on Google Flights to
              avoid OTA markups. Best booking window is 45-60 days before departure.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 grid size-4 place-items-center rounded-full bg-emerald-500/15 text-[9px] font-black text-emerald-400">
              ✓
            </span>
            <span>
              <strong>Lodging Choice:</strong> Booking.com yields free cancellation, but Airbnb
              offers better group rates for travelers of style ({input.style}). Compare Agoda for
              localized deals.
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-0.5 grid size-4 place-items-center rounded-full bg-emerald-500/15 text-[9px] font-black text-emerald-400">
              ✓
            </span>
            <span>
              <strong>Local Tours:</strong> Pre-book high-demand excursions on Viator or
              GetYourGuide to guarantee spots.
            </span>
          </li>
        </ul>
      </div>

      {/* Pricing Comparison Table Matrix */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-white/5 shadow-xl">
        <h2 className="text-xl font-bold tracking-tight mb-4 font-black">
          Wise Choice Price Matrix
        </h2>
        <p className="text-xs text-muted-foreground mb-4 font-semibold">
          Estimated channels pricing comparison (calculated in {currency}):
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-muted-foreground text-xs uppercase tracking-wider font-bold">
                <th className="py-3 pr-4">Category</th>
                <th className="py-3 px-4">OTA (Expedia/Booking)</th>
                <th className="py-3 px-4">Direct / Budget Site</th>
                <th className="py-3 px-4 text-primary">AI Best Deal</th>
                <th className="py-3 pl-4 text-emerald-400">Wise Choice Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              <tr>
                <td className="py-3.5 pr-4 text-foreground font-bold">Flights</td>
                <td className="py-3.5 px-4 text-muted-foreground">
                  {(estFlight * 1.08).toLocaleString()} {currency}
                </td>
                <td className="py-3.5 px-4 text-muted-foreground">
                  {estFlight.toLocaleString()} {currency}
                </td>
                <td className="py-3.5 px-4 text-primary font-bold">
                  {(estFlight * 0.96).toLocaleString()} {currency}
                </td>
                <td className="py-3.5 pl-4 text-emerald-400 font-bold">Book Direct (Save 12%)</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 text-foreground font-bold">Hotels & Stays</td>
                <td className="py-3.5 px-4 text-muted-foreground">
                  {estHotel.toLocaleString()} {currency}
                </td>
                <td className="py-3.5 px-4 text-muted-foreground">
                  {(estHotel * 1.05).toLocaleString()} {currency}
                </td>
                <td className="py-3.5 px-4 text-primary font-bold">
                  {(estHotel * 0.92).toLocaleString()} {currency}
                </td>
                <td className="py-3.5 pl-4 text-emerald-400 font-bold">Use Booking.com / Agoda</td>
              </tr>
              <tr>
                <td className="py-3.5 pr-4 text-foreground font-bold">Activities</td>
                <td className="py-3.5 px-4 text-muted-foreground">
                  {(estActivities * 1.1).toLocaleString()} {currency}
                </td>
                <td className="py-3.5 px-4 text-muted-foreground">
                  {estActivities.toLocaleString()} {currency}
                </td>
                <td className="py-3.5 px-4 text-primary font-bold">
                  {(estActivities * 0.95).toLocaleString()} {currency}
                </td>
                <td className="py-3.5 pl-4 text-emerald-400 font-bold">Compare Viator & GYG</td>
              </tr>
              <tr className="border-t border-white/10 bg-white/[0.01]">
                <td className="py-4 pr-4 text-foreground font-black">Total Estimates</td>
                <td className="py-4 px-4 text-muted-foreground font-bold">
                  {(estFlight * 1.08 + estHotel + estActivities * 1.1).toLocaleString()} {currency}
                </td>
                <td className="py-4 px-4 text-muted-foreground font-bold">
                  {(estFlight + estHotel * 1.05 + estActivities).toLocaleString()} {currency}
                </td>
                <td className="py-4 px-4 text-primary font-black">
                  {(estFlight * 0.96 + estHotel * 0.92 + estActivities * 0.95).toLocaleString()}{" "}
                  {currency}
                </td>
                <td className="py-4 pl-4 text-emerald-400 font-black">Expected Savings: ~10%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep Link Redirection Cards */}
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4 font-black">
          Book Anywhere Redirect Hub
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Skyscanner */}
          <a
            href={searchSkyscanner}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel glass-panel-hover rounded-2xl p-5 border border-white/5 flex flex-col justify-between h-40 group transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Flights
                </span>
                <span className="text-[10px] bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-full font-bold">
                  Skyscanner
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
                Compare flight deals
              </h3>
              <p className="text-xs text-muted-foreground mt-1 font-semibold">
                Cross-check fares from 1000+ travel providers.
              </p>
            </div>
            <span className="text-xs font-bold text-foreground flex items-center gap-1 mt-3">
              Search Skyscanner →
            </span>
          </a>

          {/* Google Flights */}
          <a
            href={searchGoogleFlights}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel glass-panel-hover rounded-2xl p-5 border border-white/5 flex flex-col justify-between h-40 group transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Flights
                </span>
                <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full font-bold">
                  Google Flights
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
                Direct airline search
              </h3>
              <p className="text-xs text-muted-foreground mt-1 font-semibold">
                Fast, accurate calendar prices directly from carrier sites.
              </p>
            </div>
            <span className="text-xs font-bold text-foreground flex items-center gap-1 mt-3">
              Search Google Flights →
            </span>
          </a>

          {/* Booking.com */}
          <a
            href={searchBooking}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel glass-panel-hover rounded-2xl p-5 border border-white/5 flex flex-col justify-between h-40 group transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Stays
                </span>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full font-bold">
                  Booking.com
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
                Hotels & Resorts
              </h3>
              <p className="text-xs text-muted-foreground mt-1 font-semibold">
                Free cancellations, guest reviews, and direct reservation cards.
              </p>
            </div>
            <span className="text-xs font-bold text-foreground flex items-center gap-1 mt-3">
              Search Booking.com →
            </span>
          </a>

          {/* Airbnb */}
          <a
            href={searchAirbnb}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel glass-panel-hover rounded-2xl p-5 border border-white/5 flex flex-col justify-between h-40 group transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Stays
                </span>
                <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full font-bold">
                  Airbnb
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
                Vacation Rentals
              </h3>
              <p className="text-xs text-muted-foreground mt-1 font-semibold">
                Homestays, localized villas, and group lodges.
              </p>
            </div>
            <span className="text-xs font-bold text-foreground flex items-center gap-1 mt-3">
              Search Airbnb →
            </span>
          </a>

          {/* Viator */}
          <a
            href={searchViator}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel glass-panel-hover rounded-2xl p-5 border border-white/5 flex flex-col justify-between h-40 group transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Activities
                </span>
                <span className="text-[10px] bg-yellow-500/15 text-yellow-400 px-2 py-0.5 rounded-full font-bold">
                  Viator
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
                Tours & Experiences
              </h3>
              <p className="text-xs text-muted-foreground mt-1 font-semibold">
                Guided day trips, museum skip-the-line passes, and tickets.
              </p>
            </div>
            <span className="text-xs font-bold text-foreground flex items-center gap-1 mt-3">
              Search Viator →
            </span>
          </a>

          {/* GetYourGuide */}
          <a
            href={searchGetYourGuide}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-panel glass-panel-hover rounded-2xl p-5 border border-white/5 flex flex-col justify-between h-40 group transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Activities
                </span>
                <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full font-bold">
                  GetYourGuide
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mt-2 group-hover:text-primary transition-colors">
                Local Day Excursions
              </h3>
              <p className="text-xs text-muted-foreground mt-1 font-semibold">
                Browse, secure and schedule localized ticket bundles.
              </p>
            </div>
            <span className="text-xs font-bold text-foreground flex items-center gap-1 mt-3">
              Search GetYourGuide →
            </span>
          </a>
        </div>
      </div>

      {/* Budget Allocation Tracker */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-white/5 shadow-xl">
        <h2 className="text-xl font-bold tracking-tight mb-4 font-black">
          Budget Distribution Tracker
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wider text-muted-foreground">
              <span>Flights & Transport (35%)</span>
              <span className="text-foreground">
                {estFlight.toLocaleString()} {currency}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full" style={{ width: "35%" }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wider text-muted-foreground">
              <span>Stays & Hotels (40%)</span>
              <span className="text-foreground">
                {estHotel.toLocaleString()} {currency}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: "40%" }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wider text-muted-foreground">
              <span>Tours & Activities (15%)</span>
              <span className="text-foreground">
                {estActivities.toLocaleString()} {currency}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "15%" }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wider text-muted-foreground">
              <span>Food, Transit & Miscellaneous (10%)</span>
              <span className="text-foreground">
                {estFoodMisc.toLocaleString()} {currency}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: "10%" }} />
            </div>
          </div>
        </div>
        <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-sm">
          <span className="text-muted-foreground font-bold">Overall Trip Budget Limit</span>
          <span className="text-foreground font-black text-lg">
            {budget.toLocaleString()} {currency}
          </span>
        </div>
      </div>
    </div>
  );
}
