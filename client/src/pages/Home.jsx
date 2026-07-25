import { Link } from "react-router-dom";
import {
  Sparkles,
  MapPin,
  Wallet,
  CalendarCheck,
  ArrowRight,
  Hotel,
  Utensils,
  Backpack,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import NearbySuggestions from "../components/NearbySuggestions";

const features = [
  {
    icon: Sparkles,
    title: "AI-Generated Itineraries",
    desc: "Gemini AI crafts a personalized, day-wise plan based on your interests and budget.",
  },
  {
    icon: Hotel,
    title: "Hotel Suggestions",
    desc: "Curated stay recommendations that match your budget and travel style.",
  },
  {
    icon: Utensils,
    title: "Restaurants & Cuisine",
    desc: "Discover must-try local restaurants and dishes at your destination.",
  },
  {
    icon: MapPin,
    title: "Interactive Maps",
    desc: "Visualize your destination and attractions on an OpenStreetMap view.",
  },
  {
    icon: Wallet,
    title: "Smart Budgeting",
    desc: "Get a category-wise estimated budget breakdown for your entire trip.",
  },
  {
    icon: Backpack,
    title: "Packing Checklist",
    desc: "Never forget essentials with an AI-curated packing checklist.",
  },
];

const steps = [
  { title: "Tell us your plans", desc: "Destination, dates, budget, travelers & interests." },
  { title: "AI builds your trip", desc: "Gemini generates a full itinerary in seconds." },
  { title: "Explore & go", desc: "Review, tweak, and save your trip for the road." },
];

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="bg-hero-pattern absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6,20,40,0.65), rgba(6,20,40,0.75)), url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80)",
          }}
        />
        <div className="page-container relative flex min-h-[600px] flex-col items-start justify-center gap-6 py-24 text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur">
            <Sparkles size={16} className="text-accent-400" /> Powered by Google Gemini AI
          </span>
          <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight md:text-6xl">
            Plan your perfect trip <span className="text-accent-400">in minutes</span>, not hours.
          </h1>
          <p className="max-w-xl text-lg text-slate-200">
            Voyage uses AI to build complete, personalized travel itineraries —
            hotels, attractions, restaurants, budgets and more — tailored just for you.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to={isAuthenticated ? "/create-trip" : "/register"}
              className="btn-accent !px-6 !py-3 text-base"
            >
              Plan My Trip <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn-secondary !bg-white/10 !px-6 !py-3 !text-white !border-white/30 text-base hover:!bg-white/20">
              Learn More
            </Link>
          </div>

          <div className="mt-8 grid w-full max-w-lg grid-cols-3 gap-6 border-t border-white/20 pt-6 text-sm">
            <div>
              <p className="font-display text-2xl font-bold">AI</p>
              <p className="text-slate-300">Powered Planning</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold">Free</p>
              <p className="text-slate-300">To Get Started</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold">Instant</p>
              <p className="text-slate-300">Itineraries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Nearby Holiday Suggestions */}
      <NearbySuggestions />

      {/* Features */}
      <section className="page-container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Everything you need to plan a trip</h2>
          <p className="mt-3 text-slate-500">
            From itineraries to budgets, Voyage handles the planning so you can focus on the adventure.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card transition hover:-translate-y-1 hover:shadow-lg">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <Icon size={22} />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-800">{title}</h3>
              <p className="mt-2 text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-primary-900 py-20 text-white">
        <div className="page-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="section-title text-white">How Voyage Works</h2>
            <p className="mt-3 text-primary-100">Three simple steps to your next adventure.</p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step, idx) => (
              <div key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-500 font-semibold">
                  {idx + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-primary-100">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-container py-20 text-center">
        <CalendarCheck size={40} className="mx-auto text-primary-600" />
        <h2 className="section-title mt-4">Ready to plan your next adventure?</h2>
        <p className="mx-auto mt-3 max-w-lg text-slate-500">
          Join Voyage today and let AI take the stress out of trip planning.
        </p>
        <Link to={isAuthenticated ? "/create-trip" : "/register"} className="btn-primary mt-6 inline-flex !px-8 !py-3 text-base">
          Get Started Free <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
};

export default Home;
