import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const roles = [
  { value: "restaurant", label: "Restaurant / Hotel" },
  { value: "ngo", label: "NGO" },
];

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "restaurant",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center px-6 py-16">
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm border border-black/5"
      >
        <h1 className="font-display text-2xl font-medium mb-6">Create your account</h1>

        {error && (
          <p className="text-sm mb-4 text-white rounded-lg px-3 py-2" style={{ backgroundColor: "var(--color-urgency-high)" }}>
            {error}
          </p>
        )}

        <div className="flex gap-2 mb-5">
          {roles.map((r) => (
            <button
              type="button"
              key={r.value}
              onClick={() => setForm({ ...form, role: r.value })}
              className="flex-1 rounded-xl py-2 text-sm font-medium border transition-colors"
              style={
                form.role === r.value
                  ? { backgroundColor: "var(--color-primary)", color: "white", borderColor: "var(--color-primary)" }
                  : { borderColor: "rgba(0,0,0,0.1)" }
              }
            >
              {r.label}
            </button>
          ))}
        </div>

        <label className="text-sm font-medium">Name</label>
        <input required value={form.name} onChange={handleChange("name")} className="w-full mt-1 mb-4 rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />

        <label className="text-sm font-medium">Email</label>
        <input type="email" required value={form.email} onChange={handleChange("email")} className="w-full mt-1 mb-4 rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />

        <label className="text-sm font-medium">Password</label>
        <input type="password" required value={form.password} onChange={handleChange("password")} className="w-full mt-1 mb-4 rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />

        <label className="text-sm font-medium">Phone</label>
        <input value={form.phone} onChange={handleChange("phone")} className="w-full mt-1 mb-4 rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />

        <label className="text-sm font-medium">Address</label>
        <input value={form.address} onChange={handleChange("address")} className="w-full mt-1 mb-6 rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full rounded-xl py-2.5 font-semibold text-white disabled:opacity-60"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {loading ? "Creating account..." : "Create Account"}
        </motion.button>

        <p className="text-sm text-black/60 mt-4 text-center">
          Already have an account? <Link to="/login" className="font-medium text-[var(--color-primary)]">Log in</Link>
        </p>
      </motion.form>
    </div>
  );
};

export default RegisterPage;
