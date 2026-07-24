import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Compass, Menu, X, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { APP_NAME } from "../constants/travelOptions";
import { getInitials } from "../utils/formatters";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition hover:text-primary-600 ${
    isActive ? "text-primary-600" : "text-slate-600"
  }`;

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
      <nav className="page-container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-primary-700">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
            <Compass size={20} />
          </span>
          <span className="font-display text-xl font-semibold">{APP_NAME}</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 hover:bg-slate-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                  {getInitials(user?.name)}
                </span>
                <span className="text-sm font-medium text-slate-700">{user?.name?.split(" ")[0]}</span>
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-card"
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <Link
                    to="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <UserIcon size={16} /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-secondary !px-4 !py-2">
                Login
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <div className="page-container flex flex-col gap-4 py-4">
            <NavLink to="/" className={navLinkClass} onClick={() => setMenuOpen(false)} end>
              Home
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                Dashboard
              </NavLink>
            )}
            <NavLink to="/about" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              About
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  Profile
                </NavLink>
                <button onClick={handleLogout} className="btn-primary w-full">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="btn-secondary flex-1" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn-primary flex-1" onClick={() => setMenuOpen(false)}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
