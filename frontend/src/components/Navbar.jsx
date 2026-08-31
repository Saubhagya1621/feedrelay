import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/");
  };

  const links = (
    <>
      {!user && (
        <>
          <Link to="/login" onClick={() => setMenuOpen(false)}>Log in</Link>
          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="rounded-full px-4 py-2 text-white text-center"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Get Started
          </Link>
        </>
      )}

      {user?.role === "restaurant" && (
        <>
          <Link to="/restaurant/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link to="/pickups" onClick={() => setMenuOpen(false)}>Pickups</Link>
        </>
      )}
      {user?.role === "ngo" && (
        <>
          <Link to="/ngo/feed" onClick={() => setMenuOpen(false)}>Feed</Link>
          <Link to="/pickups" onClick={() => setMenuOpen(false)}>Pickups</Link>
        </>
      )}
      {user?.role === "admin" && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}

      {user && (
        <button onClick={handleLogout} className="text-left text-black/60 hover:text-black">
          Log out
        </button>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-[var(--color-base-light)]/90 backdrop-blur border-b border-black/5">
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl font-semibold" onClick={() => setMenuOpen(false)}>
          Feed<span style={{ color: "var(--color-primary)" }}>Relay</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5 text-sm font-medium">{links}</div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }} className="w-6 h-0.5 bg-black rounded" />
          <motion.span animate={{ opacity: menuOpen ? 0 : 1 }} className="w-6 h-0.5 bg-black rounded" />
          <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }} className="w-6 h-0.5 bg-black rounded" />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-black/5"
          >
            <div className="flex flex-col gap-4 px-6 py-5 text-sm font-medium">{links}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;