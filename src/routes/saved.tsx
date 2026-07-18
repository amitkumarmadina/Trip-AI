import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import type { SavedTrip } from "@/lib/trip-types";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved trips — Voyagr" },
      { name: "description", content: "Your bookmarked AI-generated travel itineraries." },
    ],
  }),
  component: SavedPage,
});

const KEY = "voyagr:saved";

function SavedPage() {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/trips")
      .then((res) => {
        if (!res.ok) throw new Error("Backend unavailable");
        return res.json();
      })
      .then((data) => {
        setTrips(data);
      })
      .catch((err) => {
        console.warn("Falling back to local storage:", err);
        try {
          setTrips(JSON.parse(localStorage.getItem(KEY) || "[]"));
        } catch {
          setTrips([]);
        }
      });
  }, []);

  const remove = async (id: string) => {
    try {
      const res = await fetch(`/api/trips/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete trip on backend");

      setTrips((prev) => prev.filter((t) => t.id !== id));
      toast.success("Trip removed");
    } catch (err) {
      console.warn("Failed backend delete, removing locally:", err);
      const next = trips.filter((t) => t.id !== id);
      setTrips(next);
      localStorage.setItem(KEY, JSON.stringify(next));
      toast.success("Trip removed (local)");
    }
  };

  const open = (t: SavedTrip) => {
    sessionStorage.setItem("voyagr:current", JSON.stringify(t));
    navigate({ to: "/itinerary" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">Saved trips</h1>
        <p className="mt-2 text-muted-foreground">
          Your bookmarked itineraries, ready when you are.
        </p>

        {trips.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-border p-12 text-center">
            <div className="text-lg font-medium">No saved trips yet</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Plan a trip and hit “Save” to bookmark it here.
            </p>
            <Button className="mt-6 rounded-full" onClick={() => navigate({ to: "/" })}>
              Plan a trip
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {trips.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-border/60 bg-card p-5 shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-3.5" /> {t.input.from} →{" "}
                      {t.input.destination || "AI-picked"}
                    </div>
                    <div className="mt-1 text-lg font-semibold">
                      {t.input.days} days · {t.input.style}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="size-3.5" />
                      {t.input.startDate && t.input.endDate
                        ? `${t.input.startDate} → ${t.input.endDate}`
                        : new Date(t.createdAt).toLocaleDateString()}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Budget: {t.input.budget.toLocaleString()} {t.input.currency}
                    </div>
                  </div>
                  <button
                    onClick={() => remove(t.id)}
                    aria-label="Delete trip"
                    className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <Button
                  onClick={() => open(t)}
                  variant="outline"
                  className="mt-4 w-full rounded-full"
                >
                  View itinerary <ArrowRight className="ml-1.5 size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
