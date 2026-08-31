import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form);
      const dest =
        user.role === "restaurant"
          ? "/restaurant/dashboard"
          : user.role === "ngo"
          ? "/ngo/feed"
          : "/admin";
      navigate(dest);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center px-6 py-20">
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-sm border border-black/5"
      >
        <h1 className="font-display text-2xl font-medium mb-6">Welcome back</h1>

        {error && (
          <p className="text-sm mb-4 text-white rounded-lg px-3 py-2" style={{ backgroundColor: "var(--color-urgency-high)" }}>
            {error}
          </p>
        )}

        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mt-1 mb-4 rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-[var(--color-primary)]"
        />

        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mt-1 mb-6 rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-[var(--color-primary)]"
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full rounded-xl py-2.5 font-semibold text-white disabled:opacity-60"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {loading ? "Logging in..." : "Log In"}
        </motion.button>

        <p className="text-sm text-black/60 mt-4 text-center">
          No account? <Link to="/register" className="font-medium text-[var(--color-primary)]">Register</Link>
        </p>
      </motion.form>
    </div>
  );
};

export default LoginPage;
