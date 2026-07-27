import { Sparkles } from "lucide-react";
import { APP_NAME } from "../constants/travelOptions";

const About = () => {
  return (
    <div className="page-container py-16">
      <div className="mx-auto max-w-3xl text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white">
          <Sparkles size={22} />
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 md:text-4xl">
          About {APP_NAME}
        </h1>
        <p className="mt-4 text-slate-500">
          {APP_NAME} is an AI-powered travel planning platform built to take the
          stress out of organizing a trip. Tell us where you want to go, your
          budget, and your interests — and our AI, powered by Google Gemini,
          builds a complete itinerary in minutes: hotels, attractions,
          restaurants, transportation, budgets, and packing lists.
        </p>
      </div>
    </div>
  );
};

export default About;