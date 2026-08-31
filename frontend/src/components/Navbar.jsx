import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-base-light/90 backdrop-blur border-b border-black/5">
      <Link to="/" className="font-display text-xl font-semibold">
        Feed<span style={{ color: "var(--color-primary)" }}>Relay</span>
      </Link>

      <div className="flex items-center gap-5 text-sm font-medium">
        {!user && (
          <>
            <Link to="/login">Log in</Link>
            <Link
              to="/register"
              className="rounded-full px-4 py-2 text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Get Started
            </Link>
          </>
        )}

        {user?.role === "restaurant" && (
          <>
            <Link to="/restaurant/dashboard">Dashboard</Link>
            <Link to="/pickups">Pickups</Link>
          </>
        )}
        {user?.role === "ngo" && (
          <>
            <Link to="/ngo/feed">Feed</Link>
            <Link to="/pickups">Pickups</Link>
          </>
        )}
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}

        {user && (
          <button onClick={handleLogout} className="text-black/60 hover:text-black">
            Log out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;