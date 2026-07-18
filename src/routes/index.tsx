import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { PlannerForm } from "@/components/PlannerForm";
import { Sparkles, Globe2, Wallet, Map, Star, Compass } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Destinations />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 10%, oklch(0.72 0.14 210 / 0.35), transparent 60%), radial-gradient(50% 40% at 90% 20%, oklch(0.72 0.14 165 / 0.3), transparent 60%)",
        }}
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-20">
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" /> Powered by AI
          </span>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Plan your perfect trip with{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">AI</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted-foreground">
            Tell us your budget, destination, and interests. Our AI creates a personalized travel
            itinerary in seconds — complete with daily plans, budgets, and packing lists.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Stat value="150+" label="Destinations" />
            <Stat value="30s" label="Avg. plan time" />
            <Stat value="4.9★" label="Traveler rating" />
          </div>
        </div>
        <PlannerForm />
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-semibold text-foreground">{value}</div>
      <div className="text-xs uppercase tracking-wider">{label}</div>
    </div>
  );
}

const DESTINATIONS = [
  { name: "Kyoto, Japan", tag: "Culture · Temples", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=70" },
  { name: "Santorini, Greece", tag: "Beaches · Sunsets", img: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=800&q=70" },
  { name: "Banff, Canada", tag: "Mountains · Nature", img: "https://images.unsplash.com/photo-1609825488888-3a766db05542?auto=format&fit=crop&w=800&q=70" },
  { name: "Marrakech, Morocco", tag: "History · Food", img: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=70" },
  { name: "Bali, Indonesia", tag: "Beaches · Wellness", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=70" },
  { name: "Reykjavik, Iceland", tag: "Adventure · Nature", img: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=70" },
];

function Destinations() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Popular destinations</h2>
          <p className="mt-2 text-muted-foreground">Get inspired by trending places our travelers love.</p>
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {DESTINATIONS.map((d) => (
          <article
            key={d.name}
            className="group overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-1"
          >
            <div
              className="h-48 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${d.img})` }}
            />
            <div className="p-5">
              <div className="text-base font-semibold">{d.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">{d.tag}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const FEATURES = [
  { icon: Sparkles, title: "AI-crafted itineraries", desc: "Day-by-day plans tuned to your style, pace, and interests." },
  { icon: Wallet, title: "Smart budgets", desc: "Full cost breakdowns for lodging, food, transport, and activities." },
  { icon: Map, title: "Local gems", desc: "Discover hidden spots the guidebooks miss — recommended by AI." },
  { icon: Globe2, title: "Any destination", desc: "From weekend city breaks to month-long adventures across the globe." },
  { icon: Compass, title: "Packing lists", desc: "Auto-generated checklists tailored to your trip and weather." },
  { icon: Star, title: "Save & revisit", desc: "Bookmark itineraries and come back to them anytime." },
];

function Features() {
  return (
    <section className="border-y border-border/60 bg-muted/40">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-semibold tracking-tight">Why travelers love Voyagr</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="mb-4 grid size-11 place-items-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground">
                <Icon className="size-5" />
              </div>
              <div className="text-lg font-semibold">{title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  { name: "Amara O.", trip: "Lisbon · 7 days", quote: "It felt like a friend who's been everywhere planned my whole week. Restaurants were spot on." },
  { name: "Ravi K.", trip: "Iceland · 10 days", quote: "The daily budgets kept us on track. Loved the hidden viewpoints it suggested." },
  { name: "Elena M.", trip: "Kyoto · 5 days", quote: "Perfect pace for a solo traveler. Packing list saved me hours." },
];

function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="text-3xl font-semibold tracking-tight">Loved by travelers</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure key={t.name} className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="flex gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <blockquote className="mt-3 text-sm leading-relaxed text-foreground/90">“{t.quote}”</blockquote>
            <figcaption className="mt-4 text-sm">
              <div className="font-semibold">{t.name}</div>
              <div className="text-muted-foreground">{t.trip}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
        <div>© {new Date().getFullYear()} Voyagr — AI Travel Planner</div>
        <div>Made with ☀️ for curious travelers</div>
      </div>
    </footer>
  );
}
