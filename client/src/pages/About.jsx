import { Sparkles, Code2, GraduationCap, Rocket } from "lucide-react";
import { APP_NAME } from "../constants/travelOptions";

const techStack = [
  "React.js (Vite)",
  "Tailwind CSS",
  "Node.js & Express.js",
  "MongoDB Atlas",
  "JWT & bcrypt",
  "Google Gemini AI",
  "OpenStreetMap (Leaflet)",
  "Axios",
];

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

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
        <div className="card text-center">
          <GraduationCap className="mx-auto text-primary-600" size={28} />
          <h3 className="mt-3 font-semibold text-slate-800">Academic Project</h3>
          <p className="mt-2 text-sm text-slate-500">
            Built as a B.Sc. Computer Science final-year project, showcasing a
            complete MERN stack application with real-world AI integration.
          </p>
        </div>
        <div className="card text-center">
          <Code2 className="mx-auto text-primary-600" size={28} />
          <h3 className="mt-3 font-semibold text-slate-800">Modern Architecture</h3>
          <p className="mt-2 text-sm text-slate-500">
            A clean separation of concerns across a React frontend and an
            Express/MongoDB backend, with JWT-secured REST APIs.
          </p>
        </div>
        <div className="card text-center">
          <Rocket className="mx-auto text-primary-600" size={28} />
          <h3 className="mt-3 font-semibold text-slate-800">AI-First Planning</h3>
          <p className="mt-2 text-sm text-slate-500">
            Google Gemini generates structured, destination-specific travel
            plans tailored to your budget and interests.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-4xl">
        <h2 className="section-title text-center !text-2xl">Built With</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
