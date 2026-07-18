import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { PlannerForm } from "@/components/PlannerForm";
import { Sparkles, Globe2, Wallet, Map, Star, Compass, Plane } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Cosmic ambient floating glow orbs */}
      <div className="glow-orb glow-orb-primary top-[-100px] left-[-50px] size-[400px] sm:size-[600px]" />
      <div className="glow-orb glow-orb-secondary top-[40%] right-[-100px] size-[350px] sm:size-[550px]" />
      <div className="glow-orb glow-orb-primary bottom-[-200px] left-[15%] size-[500px] sm:size-[700px]" />

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
    <section className="relative py-12 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="flex flex-col justify-center">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-accent-foreground backdrop-blur-md glow-text-primary">
            <Sparkles className="size-3.5 text-accent-foreground animate-pulse" /> Powered by
            Advanced AI
          </span>
          <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Plan your perfect trip with{" "}
            <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent glow-text-primary">
              AI intelligence
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
            Tell us your budget, destination, and interests. Our AI crafts a highly personalized
            travel itinerary in seconds — complete with day-by-day routines, smart budgets, and
            packing guides.
          </p>
          <div className="mt-8 flex flex-wrap gap-8 text-sm text-muted-foreground">
            <Stat value="150+" label="Destinations" />
            <Stat value="30s" label="Avg. plan time" />
            <Stat value="4.9★" label="Traveler rating" />
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-primary/10 to-secondary/15 blur-2xl" />
          <PlannerForm />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="relative pl-4 before:absolute before:left-0 before:top-2 before:h-8 before:w-[2px] before:bg-white/10">
      <div className="text-3xl font-bold bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mt-0.5">
        {label}
      </div>
    </div>
  );
}

const DESTINATIONS = [
  {
    name: "Kyoto, Japan",
    tag: "Culture · Temples",
    img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=70",
  },
  {
    name: "Santorini, Greece",
    tag: "Beaches · Sunsets",
    img: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=800&q=70",
  },
  {
    name: "Banff, Canada",
    tag: "Mountains · Nature",
    img: "https://images.unsplash.com/photo-1609825488888-3a766db05542?auto=format&fit=crop&w=800&q=70",
  },
  {
    name: "Marrakech, Morocco",
    tag: "History · Food",
    img: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=70",
  },
  {
    name: "Bali, Indonesia",
    tag: "Beaches · Wellness",
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=70",
  },
  {
    name: "Reykjavik, Iceland",
    tag: "Adventure · Nature",
    img: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=70",
  },
];

function Destinations() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Popular destinations</h2>
        <p className="mt-2 text-muted-foreground">
          Get inspired by trending places our travelers love.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DESTINATIONS.map((d) => (
          <article
            key={d.name}
            className="group relative overflow-hidden rounded-3xl border border-white/5 bg-card/40 shadow-xl transition-all duration-500 hover:border-primary/30 hover:shadow-glow hover:-translate-y-1.5"
          >
            <div className="overflow-hidden">
              <div
                className="h-52 w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${d.img})` }}
              />
            </div>
            {/* Ambient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent pointer-events-none" />
            <div className="relative p-6">
              <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {d.name}
              </div>
              <div className="mt-1 text-sm text-muted-foreground font-medium">{d.tag}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-crafted itineraries",
    desc: "Day-by-day plans tuned to your style, pace, and travel preferences.",
  },
  {
    icon: Wallet,
    title: "Smart budgets",
    desc: "Full cost breakdowns for lodging, food, transport, and activities.",
  },
  {
    icon: Map,
    title: "Local gems",
    desc: "Discover hidden spots the guidebooks miss — recommended by AI models.",
  },
  {
    icon: Globe2,
    title: "Any destination",
    desc: "From weekend city breaks to month-long adventures across the globe.",
  },
  {
    icon: Compass,
    title: "Packing lists",
    desc: "Auto-generated checklists tailored to your trip and weather forecast.",
  },
  {
    icon: Star,
    title: "Save & revisit",
    desc: "Bookmark generated itineraries and come back to them anytime.",
  },
];

function Features() {
  return (
    <section className="relative border-y border-white/5 bg-white/[0.02] backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why travelers love Trip AI
          </h2>
          <p className="mt-2 text-muted-foreground">
            Cutting edge features that take the stress out of vacation planning.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="glass-panel glass-panel-hover rounded-2xl p-6 transition-all duration-300"
            >
              <div className="mb-5 grid size-11 place-items-center rounded-xl bg-[image:var(--gradient-hero)] text-white shadow-md">
                <Icon className="size-5" />
              </div>
              <div className="text-lg font-bold text-foreground">{title}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  {
    name: "Amara O.",
    trip: "Lisbon · 7 days",
    quote:
      "It felt like a friend who's been everywhere planned my whole week. Restaurants were spot on.",
  },
  {
    name: "Ravi K.",
    trip: "Iceland · 10 days",
    quote: "The daily budgets kept us on track. Loved the hidden viewpoints it suggested.",
  },
  {
    name: "Elena M.",
    trip: "Kyoto · 5 days",
    quote: "Perfect pace for a solo traveler. Packing list saved me hours.",
  },
];

function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-center">
          Loved by curious travelers
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="glass-panel rounded-2xl p-6 relative overflow-hidden before:absolute before:left-0 before:top-0 before:h-1.5 before:w-full before:bg-[image:var(--gradient-hero)]"
          >
            <div className="flex gap-1 text-accent-foreground">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current text-primary" />
              ))}
            </div>
            <blockquote className="mt-4 text-sm leading-relaxed text-foreground/95 italic">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-5 border-t border-white/5 pt-4 flex flex-col">
              <span className="font-bold text-foreground">{t.name}</span>
              <span className="text-xs text-muted-foreground mt-0.5 font-medium">{t.trip}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background/50 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-lg bg-[image:var(--gradient-hero)] text-white shadow-sm">
            <Plane className="size-3.5 -rotate-45" />
          </span>
          <span className="font-bold bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
            Trip AI
          </span>
          <span>© {new Date().getFullYear()} — AI Travel Planner</span>
        </div>
        <div className="flex gap-4 font-medium text-xs">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Made with ❤️ for curious travelers</span>
        </div>
      </div>
    </footer>
  );
}
