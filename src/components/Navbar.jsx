import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Stethoscope } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { initials } from "../utils/format";

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-brand/10 text-brand" : "text-muted hover:text-fg"
  }`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand to-accent text-white shadow-glow">
            <Stethoscope size={19} />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Medi<span className="gradient-text">Book</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          <NavLink to="/" end className={linkClass}>ডাক্তার খুঁজুন</NavLink>
          {user && <NavLink to="/dashboard" className={linkClass}>ড্যাশবোর্ড</NavLink>}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="hidden items-center gap-2 rounded-xl border border-line bg-surface2/60 py-1.5 pl-1.5 pr-3 sm:flex"
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-brand to-accent text-xs font-bold text-white">
                  {initials(user.name)}
                </span>
                <span className="max-w-[8rem] truncate text-sm font-medium">{user.name}</span>
              </Link>
              <button onClick={handleLogout} aria-label="লগ আউট" className="btn-ghost !px-3">
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn-primary">লগইন</Link>
          )}
        </div>
      </div>
    </header>
  );
}