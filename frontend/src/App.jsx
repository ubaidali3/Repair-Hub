import React, { useEffect, useState } from "react";
import {
  NavLink,
  useNavigate,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import {
  Wrench,
  LogOut,
  Menu,
  X,
  UserRound,
  LayoutDashboard,
  MessageCircle,
  Bell,
  ShieldCheck,
  CalendarDays,
  BriefcaseBusiness,
  Home as HomeIcon,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

import { api } from "./lib/api.js";
import { message } from "./lib/helpers.js";

import Admin from "./components/Admin.jsx";
import Auth from "./components/Auth.jsx";
import Bookings from "./components/Bookings.jsx";
import Dashboard from "./components/Dashboard.jsx";
import DirectBooking from "./components/DirectBooking.jsx";
import Home from "./components/Home.jsx";
import JobDetail from "./components/JobDetail.jsx";
import Jobs from "./components/Jobs.jsx";
import Messages from "./components/Messages.jsx";
import Notifications from "./components/Notifications.jsx";
import PostRequest from "./components/PostRequest.jsx";
import Profile from "./components/Profile.jsx";
import Technicians from "./components/Technicians.jsx";
import Warranties from "./components/Warranties.jsx";

const baseLinks = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/technicians", label: "Technicians", icon: Wrench },
  { to: "/jobs", label: "Repair Jobs", icon: BriefcaseBusiness },
];

const userLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/profile", label: "Profile & Security", icon: UserRound },
  { to: "/bookings", label: "Bookings", icon: CalendarDays },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/warranties", label: "Warranties", icon: ShieldCheck },
  { to: "/notifications", label: "Alerts", icon: Bell },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [notice, setNotice] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    api
      .get("/auth/me")
      .then((r) => {
        if (active) setUser(r.data.user);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setChecking(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [navigate]);

  useEffect(() => {
    if (!notice) return;

    const timer = window.setTimeout(() => {
      setNotice("");
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [notice]);

  const flash = (text) => {
    setNotice(text);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const logout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await api.post("/auth/logout");
      setUser(null);
      setMenuOpen(false);
      navigate("/");
    } catch (e) {
      flash(message(e));
    } finally {
      setLoggingOut(false);
    }
  };

  const navClass = ({ isActive }) =>
    [
      "inline-flex items-center gap-2 rounded-xl px-3 py-2.5",
      "text-sm font-semibold whitespace-nowrap transition-all duration-200",
      isActive
        ? "bg-teal-50 text-teal-800"
        : "text-slate-600 hover:bg-slate-50 hover:text-teal-700",
    ].join(" ");

  const mobileNavClass = ({ isActive }) =>
    [
      "flex w-full items-center gap-3 rounded-xl px-4 py-3",
      "text-sm font-semibold transition-colors",
      isActive
        ? "bg-teal-50 text-teal-800"
        : "text-slate-600 hover:bg-slate-50 hover:text-teal-700",
    ].join(" ");

  const closeMenu = () => setMenuOpen(false);

  const renderDesktopLinks = () => (
    <>
      {baseLinks.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={navClass}
        >
          {label}
        </NavLink>
      ))}

      {user &&
        userLinks.map(({ to, label }) => (
          <NavLink key={to} to={to} className={navClass}>
            {label}
          </NavLink>
        ))}

      {user?.role === "admin" && (
        <NavLink to="/admin" className={navClass}>
          Admin
        </NavLink>
      )}
    </>
  );

  const renderMobileLinks = () => (
    <>
      {baseLinks.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={mobileNavClass}
          onClick={closeMenu}
        >
          <Icon size={19} className="shrink-0" />
          <span>{label}</span>
          <ChevronRight size={16} className="ml-auto opacity-50" />
        </NavLink>
      ))}

      {user && (
        <>
          <div className="px-4 pb-1 pt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            My Account
          </div>

          {userLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={mobileNavClass}
              onClick={closeMenu}
            >
              <Icon size={19} className="shrink-0" />
              <span>{label}</span>
              <ChevronRight size={16} className="ml-auto opacity-50" />
            </NavLink>
          ))}

          {user.role === "admin" && (
            <NavLink
              to="/admin"
              className={mobileNavClass}
              onClick={closeMenu}
            >
              <ShieldCheck size={19} />
              <span>Admin Panel</span>
              <ChevronRight size={16} className="ml-auto opacity-50" />
            </NavLink>
          )}
        </>
      )}
    </>
  );

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-[#f7faf9] text-slate-800">
      {/* Responsive Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 shadow-sm shadow-slate-900/[0.03] backdrop-blur-xl">
        <div className="mx-auto flex min-h-[68px] max-w-[1600px] items-center justify-between gap-3 px-4 sm:min-h-[76px] sm:px-6 lg:px-8">

          {/* Brand */}
          <Link
            to="/"
            onClick={closeMenu}
            className="group flex min-w-0 shrink-0 items-center gap-2 sm:gap-3"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white shadow-md shadow-teal-900/15 transition duration-200 group-hover:bg-teal-800 sm:size-12 sm:rounded-2xl">
              <Wrench size={23} strokeWidth={2.2} />
            </span>

            <span className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-2xl">
              Repair<span className="text-teal-700">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
  aria-label="Main navigation"
  className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex"
>
            {renderDesktopLinks()}
          </nav>

          {/* Desktop Account Actions */}
          <div className="hidden shrink-0 items-center gap-2 2xl:flex">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex max-w-44 items-center gap-2 rounded-xl px-2 py-2 transition hover:bg-slate-50"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-800">
                    <UserRound size={18} />
                  </span>

                  <span className="max-w-28 truncate text-sm font-semibold text-slate-700">
                    {user.name || "My Account"}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  disabled={loggingOut}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <LogOut size={17} />
                  {loggingOut ? "Signing out..." : "Logout"}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-teal-700"
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-bold text-white shadow-md shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-teal-800"
                >
                  Get Started
                  <ChevronRight size={17} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile / Tablet Actions */}
          <div className="flex shrink-0 items-center gap-2 2xl:hidden">
            {user && (
              <Link
                to="/profile"
                aria-label="My profile"
                className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-800 transition hover:bg-teal-100 sm:size-11"
              >
                <UserRound size={20} />
              </Link>
            )}

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 sm:size-11"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown */}
        {menuOpen && (
          <div
            id="mobile-navigation"
            className="max-h-[calc(100dvh-68px)] overflow-y-auto border-t border-slate-100 bg-white px-4 pb-5 pt-4 shadow-xl sm:max-h-[calc(100dvh-76px)] sm:px-6"
          >
            <nav
              aria-label="Mobile navigation"
              className="mx-auto max-w-xl space-y-1"
            >
              {user && (
                <div className="mb-4 flex items-center gap-3 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-white p-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white">
                    <UserRound size={22} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">
                      {user.name || "My Account"}
                    </p>
                    <p className="text-xs font-medium capitalize text-slate-500">
                      {user.role || "Customer"}
                    </p>
                  </div>
                </div>
              )}

              {renderMobileLinks()}

              <div className="my-3 border-t border-slate-100" />

              {user ? (
                <button
                  type="button"
                  onClick={logout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  <LogOut size={19} />
                  {loggingOut ? "Signing out..." : "Logout"}
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Sign in
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-1 rounded-xl bg-teal-700 px-3 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
                  >
                    Get Started
                    <ChevronRight size={16} />
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Flash Notification */}
      {notice && (
        <div className="sticky top-[68px] z-40 px-4 pt-3 sm:top-[76px] sm:px-6">
          <div
            role="status"
            className="mx-auto flex max-w-5xl items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-lg shadow-slate-900/5"
          >
            <AlertCircle size={20} className="mt-0.5 shrink-0" />

            <span className="min-w-0 flex-1 break-words leading-6">
              {notice}
            </span>

            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setNotice("")}
              className="shrink-0 rounded-lg p-1 text-amber-800 transition hover:bg-amber-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="min-w-0 flex-1">
        {checking ? (
          <div className="flex min-h-[65vh] flex-col items-center justify-center gap-5 px-4">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 shadow-sm sm:size-20">
              <Wrench size={32} className="animate-pulse" />
            </div>

            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-teal-700" />
            </div>

            <p className="text-center text-sm font-medium text-slate-500">
              Preparing your experience...
            </p>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home user={user} />} />

            <Route
              path="/login"
              element={<Auth type="login" onAuth={setUser} flash={flash} />}
            />

            <Route
              path="/register"
              element={<Auth type="register" onAuth={setUser} flash={flash} />}
            />

            <Route path="/jobs" element={<Jobs user={user} flash={flash} />} />

            <Route
              path="/jobs/:id"
              element={<JobDetail user={user} flash={flash} />}
            />

            <Route
              path="/technicians"
              element={<Technicians user={user} flash={flash} />}
            />

            <Route
              path="/technicians/:id/book"
              element={<DirectBooking user={user} flash={flash} />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard user={user} flash={flash} />}
            />

            <Route
              path="/profile"
              element={<Profile user={user} setUser={setUser} flash={flash} />}
            />

            <Route
              path="/requests/new"
              element={<PostRequest user={user} flash={flash} />}
            />

            <Route
              path="/bookings"
              element={<Bookings user={user} flash={flash} />}
            />

            <Route
              path="/messages"
              element={<Messages user={user} flash={flash} />}
            />

            <Route
              path="/warranties"
              element={<Warranties user={user} flash={flash} />}
            />

            <Route
              path="/notifications"
              element={<Notifications user={user} flash={flash} />}
            />

            <Route
              path="/admin"
              element={<Admin user={user} flash={flash} />}
            />

            <Route
              path="*"
              element={
                <section className="flex min-h-[60vh] flex-col items-center justify-center px-5 py-12 text-center">
                  <div className="flex size-20 items-center justify-center rounded-3xl bg-teal-50 text-teal-700">
                    <Wrench size={35} />
                  </div>

                  <h1 className="mt-6 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                    Page not found
                  </h1>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500 sm:text-base">
                    The page you are looking for doesn't exist.
                  </p>

                  <Link
                    to="/"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800"
                  >
                    <HomeIcon size={18} />
                    Return home
                  </Link>
                </section>
              }
            />
          </Routes>
        )}
      </main>

      {/* Responsive Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 md:flex-row md:items-center md:justify-between">

          <Link
            to="/"
            className="flex w-fit items-center gap-2.5"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-teal-700 text-white">
              <Wrench size={19} />
            </span>

            <span className="text-lg font-extrabold text-slate-900">
              Repair<span className="text-teal-700">Hub</span>
            </span>
          </Link>

          <p className="text-xs leading-6 text-slate-500 sm:text-sm">
            © {new Date().getFullYear()} UstaadBid · Built for Pakistan
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500 sm:text-sm">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={16} className="shrink-0 text-teal-700" />
              Repair with confidence
            </span>

            <span className="rounded-lg bg-slate-50 px-2.5 py-1.5">
              Cash on Service
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}