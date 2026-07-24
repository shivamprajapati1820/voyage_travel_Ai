import { Link } from "react-router-dom";
import { Compass, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        <Compass size={28} />
      </span>
      <h1 className="mt-6 font-display text-6xl font-bold text-slate-900">404</h1>
      <p className="mt-2 text-lg font-medium text-slate-700">Looks like you've wandered off the map.</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary mt-6">
        <Home size={16} /> Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
