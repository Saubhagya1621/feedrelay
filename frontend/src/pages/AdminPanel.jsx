import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAdminStats } from "../api/endpoints.js";
import { SkeletonStat } from "../components/Skeleton.jsx";

const StatCard = ({ label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-2xl bg-white border border-black/5 p-6 shadow-sm"
  >
    <p className="text-sm text-black/50">{label}</p>
    <p className="font-display font-tabular text-3xl font-semibold mt-1" style={{ color }}>
      {value}
    </p>
  </motion.div>
);

const AdminPanel = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAdminStats()
      .then((res) => setStats(res.data.data))
      .catch(() => toast.error("Could not load stats"));
  }, []);

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl font-medium mb-8">Platform Overview</h1>

      {!stats ? (
        <div className="grid md:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonStat key={i} />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-5">
          <StatCard label="Meals Saved" value={stats.totalMealsSaved} color="var(--color-primary)" />
          <StatCard label="Active Listings" value={stats.activeListings} color="var(--color-urgency-medium)" />
          <StatCard label="Completed Pickups" value={stats.completedPickups} color="var(--color-ngo)" />
          <StatCard label="Partner NGOs" value={stats.totalNgos} color="var(--color-ngo)" />
          <StatCard label="Restaurants" value={stats.totalRestaurants} color="var(--color-primary)" />
          <StatCard label="Disputed/Cancelled" value={stats.disputedPickups} color="var(--color-urgency-high)" />
        </div>
      )}
    </div>
  );
};

export default AdminPanel;