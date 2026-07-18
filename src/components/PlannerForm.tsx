import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Sparkles, MapPin, Calendar, Wallet, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  INTEREST_OPTIONS,
  STYLE_OPTIONS,
  ACCOMMODATION_OPTIONS,
  TRANSPORT_OPTIONS,
  CURRENCY_OPTIONS,
  type TripInput,
  type SavedTrip,
} from "@/lib/trip-types";

function daysBetween(a: string, b: string) {
  if (!a || !b) return 1;
  const d = Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000) + 1;
  return Math.max(1, isFinite(d) ? d : 1);
}

export function PlannerForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<TripInput>({
    from: "",
    destination: "",
    budget: 1500,
    currency: "USD",
    travelers: 2,
    startDate: "",
    endDate: "",
    days: 5,
    style: "Couple",
    interests: [],
    accommodation: "Hotel",
    transport: "Flight",
    notes: "",
  });

  const update = <K extends keyof TripInput>(k: K, v: TripInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleInterest = (i: string) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(i) ? f.interests.filter((x) => x !== i) : [...f.interests, i],
    }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.from.trim()) {
      toast.error("Please enter a departure city");
      return;
    }
    const days =
      form.startDate && form.endDate ? daysBetween(form.startDate, form.endDate) : form.days;
    const payload = { ...form, days };

    setLoading(true);
    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to generate itinerary");
      }

      const { itinerary } = await res.json();

      const trip: SavedTrip = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        input: payload,
        itinerary,
      };
      sessionStorage.setItem("voyagr:current", JSON.stringify(trip));
      navigate({ to: "/itinerary" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      id="planner"
      onSubmit={onSubmit}
      className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-[var(--shadow-glow)] backdrop-blur-xl sm:p-8"
    >
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="size-5 text-primary" />
        <h2 className="text-xl font-semibold tracking-tight">Design your trip</h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Departure city" icon={<MapPin className="size-4" />}>
          <Input
            value={form.from}
            onChange={(e) => update("from", e.target.value)}
            placeholder="e.g. New York"
            maxLength={100}
          />
        </Field>
        <Field label="Destination (optional)" icon={<MapPin className="size-4" />}>
          <Input
            value={form.destination}
            onChange={(e) => update("destination", e.target.value)}
            placeholder="Surprise me…"
            maxLength={100}
          />
        </Field>

        <Field label="Start date" icon={<Calendar className="size-4" />}>
          <Input
            type="date"
            value={form.startDate}
            onChange={(e) => update("startDate", e.target.value)}
          />
        </Field>
        <Field label="End date" icon={<Calendar className="size-4" />}>
          <Input
            type="date"
            value={form.endDate}
            onChange={(e) => update("endDate", e.target.value)}
          />
        </Field>

        <Field label={`Budget (${form.currency})`} icon={<Wallet className="size-4" />}>
          <Input
            type="number"
            min={0}
            value={form.budget}
            onChange={(e) => update("budget", Number(e.target.value))}
          />
        </Field>
        <Field label="Currency">
          <Select value={form.currency} onValueChange={(v) => update("currency", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCY_OPTIONS.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Travelers" icon={<Users className="size-4" />}>
          <Input
            type="number"
            min={1}
            max={50}
            value={form.travelers}
            onChange={(e) => update("travelers", Number(e.target.value))}
          />
        </Field>
        <Field label="Days">
          <Input
            type="number"
            min={1}
            max={60}
            value={form.days}
            onChange={(e) => update("days", Number(e.target.value))}
          />
        </Field>

        <Field label="Travel style">
          <Select
            value={form.style}
            onValueChange={(v) => update("style", v as TripInput["style"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STYLE_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Accommodation">
          <Select value={form.accommodation} onValueChange={(v) => update("accommodation", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACCOMMODATION_OPTIONS.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Transport">
          <Select value={form.transport} onValueChange={(v) => update("transport", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TRANSPORT_OPTIONS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <div />
      </div>

      <div className="mt-6">
        <Label className="mb-3 block text-sm font-medium">Interests</Label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((i) => {
            const active = form.interests.includes(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggleInterest(i)}
                className={
                  "rounded-full border px-4 py-1.5 text-sm transition-all " +
                  (active
                    ? "border-transparent bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-soft)]"
                    : "border-border bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground")
                }
              >
                {i}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <Field label="Additional notes">
          <Textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Dietary needs, must-see places, pace preferences…"
            maxLength={1000}
            rows={3}
          />
        </Field>
      </div>

      <Button
        type="submit"
        disabled={loading}
        size="lg"
        className="mt-8 h-14 w-full rounded-2xl bg-[image:var(--gradient-hero)] text-base font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.01]"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 size-5 animate-spin" />
            Planning your dream vacation…
          </>
        ) : (
          <>
            <Sparkles className="mr-2 size-5" />
            Generate my itinerary
          </>
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
        {icon}
        {label}
      </Label>
      {children}
    </div>
  );
}
