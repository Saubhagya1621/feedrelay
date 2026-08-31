import { motion } from "framer-motion";

const StatStrip = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-xl bg-white/70 border border-black/5 px-4 py-3 text-center"
        >
          <p className="font-display font-tabular text-xl font-semibold" style={{ color: s.color || "var(--color-primary)" }}>
            {s.value}
          </p>
          <p className="text-xs text-black/50 mt-0.5">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatStrip;