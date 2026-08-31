import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const URGENCY_COLORS = {
  low: "var(--color-urgency-low)",
  medium: "var(--color-urgency-medium)",
  high: "var(--color-urgency-high)",
};

const formatTimeLeft = (ms) => {
  if (ms <= 0) return "Expired";
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left`;
};

const UrgencyBadge = ({ expiresAt, urgency }) => {
  const [timeLeft, setTimeLeft] = useState(
    new Date(expiresAt) - new Date()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(new Date(expiresAt) - new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const color = URGENCY_COLORS[urgency] || URGENCY_COLORS.low;

  return (
    <motion.span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-tabular font-semibold text-white"
      style={{ backgroundColor: color }}
      animate={{ scale: [1, 1.03, 1] }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {formatTimeLeft(timeLeft)}
    </motion.span>
  );
};

export default UrgencyBadge;
