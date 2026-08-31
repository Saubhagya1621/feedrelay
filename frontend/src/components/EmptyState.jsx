import { motion } from "framer-motion";

const EmptyState = ({ icon = "🍲", title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl border border-dashed border-black/10 bg-white/50"
    >
      <motion.span
        className="text-5xl mb-3"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        {icon}
      </motion.span>
      <p className="font-display text-lg font-medium text-[var(--color-base-dark)]">
        {title}
      </p>
      {subtitle && <p className="text-sm text-black/50 mt-1 max-w-xs">{subtitle}</p>}
    </motion.div>
  );
};

export default EmptyState;