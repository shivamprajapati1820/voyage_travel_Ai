import { Link } from "react-router-dom";
import { Compass, Mail, Github, Linkedin } from "lucide-react";
import { APP_NAME } from "../constants/travelOptions";

const Footer = () => {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="page-container grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-primary-700">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
              <Compass size={18} />
            </span>
            <span className="font-display text-lg font-semibold">{APP_NAME}</span>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            Plan smarter, AI-crafted trips in minutes — itineraries, hotels,
            and budgets tailored just for you.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-800">Product</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link to="/" className="hover:text-primary-600">Home</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary-600">Dashboard</Link></li>
            <li><Link to="/create-trip" className="hover:text-primary-600">Create Trip</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-800">Company</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link to="/about" className="hover:text-primary-600">About</Link></li>
            <li><Link to="/login" className="hover:text-primary-600">Login</Link></li>
            <li><Link to="/register" className="hover:text-primary-600">Register</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-800">Connect</h4>
          <div className="flex gap-3">
            <a href="#" className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:text-primary-600">
              <Mail size={16} />
            </a>
            <a href="#" className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:text-primary-600">
              <Github size={16} />
            </a>
            <a href="#" className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:text-primary-600">
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 py-4">
        <p className="page-container text-center text-xs text-slate-400">
          © {new Date().getFullYear()} {APP_NAME}. Built as a B.Sc. Computer Science final-year project.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
