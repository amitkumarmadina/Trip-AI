import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import type { SavedTrip } from "@/lib/trip-types";

export const Route = createFileRoute("/itinerary")({
  head: () => ({
    meta: [{ title: "Your itinerary — Trip AI" }, { name: "robots", content: "noindex" }],
  }),
  component: ItineraryPage,
});

const SAVED_KEY = "voyagr:saved";

function readSaved(): SavedTrip[] {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
  } catch {
    return [];
  }
}

function ItineraryPage() {
  const navigate = useNavigate();
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("voyagr:current");
    if (!raw) {
      navigate({ to: "/" });
      return;
    }
    const t: SavedTrip = JSON.parse(raw);
    setTrip(t);

    // Check if saved on database
    fetch("/api/trips")
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
            sessionStorage.setItem("voyagr:current", JSON.stringify(updatedTrip));
          }
        }
      })
      .catch(() => {
        setSaved(readSaved().some((s) => s.id === t.id));
      });
  }, [navigate]);

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
    try {
      if (saved) {
        const res = await fetch(`/api/trips/${trip.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete trip");
        setSaved(false);
        toast.success("Removed from saved trips");
      } else {
        const res = await fetch("/api/trips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: trip.input,
            itinerary: trip.itinerary,
          }),
        });
        if (!res.ok) throw new Error("Failed to save trip");
        const savedTrip: SavedTrip = await res.json();

        setTrip(savedTrip);
        sessionStorage.setItem("voyagr:current", JSON.stringify(savedTrip));
        setSaved(true);
        toast.success("Trip saved!");
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

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Orbs */}
      <div className="glow-orb glow-orb-primary top-[-50px] right-[-50px] size-[350px] sm:size-[500px]" />
      <div className="glow-orb glow-orb-secondary bottom-[-100px] left-[-100px] size-[300px] sm:size-[450px]" />

      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-10">
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

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap gap-2.5 print:hidden">
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
            {saved ? "Saved to database" : "Save trip"}
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
        <article className="prose prose-invert prose-indigo mt-8 max-w-none rounded-3xl border border-white/5 bg-card/45 p-6 sm:p-10 shadow-2xl backdrop-blur-xl prose-headings:tracking-tight prose-h2:mt-8 prose-h2:border-b prose-h2:border-white/5 prose-h2:pb-3 prose-a:text-primary prose-table:text-sm prose-th:text-muted-foreground prose-td:text-foreground/90">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{trip.itinerary}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
