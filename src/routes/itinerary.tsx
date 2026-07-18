import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bookmark, BookmarkCheck, Copy, Printer, Share2, ArrowLeft, MapPin, Calendar, Users, Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import type { SavedTrip } from "@/lib/trip-types";

export const Route = createFileRoute("/itinerary")({
  head: () => ({
    meta: [
      { title: "Your itinerary — Voyagr" },
      { name: "robots", content: "noindex" },
    ],
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
    setSaved(readSaved().some((s) => s.id === t.id));
  }, [navigate]);

  const summary = useMemo(() => {
    if (!trip) return null;
    const { input } = trip;
    return [
      { icon: MapPin, label: "Destination", value: input.destination || "AI-picked" },
      { icon: Calendar, label: "Dates", value: input.startDate && input.endDate ? `${input.startDate} → ${input.endDate}` : `${input.days} days` },
      { icon: Wallet, label: "Budget", value: `${input.budget.toLocaleString()} ${input.currency}` },
      { icon: Users, label: "Travelers", value: `${input.travelers} · ${input.style}` },
    ];
  }, [trip]);

  if (!trip) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-2xl px-6 py-24 text-center text-muted-foreground">
          Loading itinerary…
        </div>
      </div>
    );
  }

  const toggleSave = () => {
    const list = readSaved();
    if (saved) {
      localStorage.setItem(SAVED_KEY, JSON.stringify(list.filter((s) => s.id !== trip.id)));
      setSaved(false);
      toast.success("Removed from saved trips");
    } else {
      localStorage.setItem(SAVED_KEY, JSON.stringify([trip, ...list]));
      setSaved(true);
      toast.success("Trip saved!");
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(trip.itinerary);
    toast.success("Itinerary copied to clipboard");
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Voyagr itinerary", text: trip.itinerary.slice(0, 500) });
      } catch {}
    } else {
      copy();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> New trip
        </Link>

        <div className="mt-6 rounded-3xl border border-border/60 bg-[image:var(--gradient-hero)] p-8 text-primary-foreground shadow-[var(--shadow-glow)]">
          <div className="text-sm uppercase tracking-widest opacity-80">Your itinerary</div>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
            {trip.input.from} → {trip.input.destination || "AI-suggested"}
          </h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summary!.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl bg-white/15 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80">
                  <Icon className="size-3.5" /> {label}
                </div>
                <div className="mt-1 truncate text-base font-semibold">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 print:hidden">
          <Button onClick={toggleSave} variant={saved ? "secondary" : "default"} className="rounded-full">
            {saved ? <BookmarkCheck className="mr-1.5 size-4" /> : <Bookmark className="mr-1.5 size-4" />}
            {saved ? "Saved" : "Save trip"}
          </Button>
          <Button onClick={copy} variant="outline" className="rounded-full">
            <Copy className="mr-1.5 size-4" /> Copy
          </Button>
          <Button onClick={share} variant="outline" className="rounded-full">
            <Share2 className="mr-1.5 size-4" /> Share
          </Button>
          <Button onClick={() => window.print()} variant="outline" className="rounded-full">
            <Printer className="mr-1.5 size-4" /> Print
          </Button>
        </div>

        <article className="prose prose-slate mt-8 max-w-none rounded-3xl border border-border/60 bg-card p-8 shadow-[var(--shadow-soft)] prose-headings:tracking-tight prose-h2:mt-8 prose-h2:border-b prose-h2:border-border prose-h2:pb-2 prose-a:text-primary prose-table:text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{trip.itinerary}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}