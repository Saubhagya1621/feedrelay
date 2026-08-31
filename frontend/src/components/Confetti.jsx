import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
  "var(--color-primary)",
  "var(--color-ngo)",
  "var(--color-urgency-medium)",
  "var(--color-urgency-low)",
];

const PIECES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: (Math.random() - 0.5) * 320,
  rotate: Math.random() * 360,
  color: COLORS[i % COLORS.length],
  delay: Math.random() * 0.15,
}));

const Confetti = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 flex items-start justify-center pointer-events-none z-[60]">
          {PIECES.map((p) => (
            <motion.span
              key={p.id}
              initial={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
              animate={{ opacity: 0, x: p.x, y: 420, rotate: p.rotate }}
              transition={{ duration: 1.4, delay: p.delay, ease: "easeOut" }}
              className="absolute top-1/3 w-2 h-3 rounded-sm"
              style={{ backgroundColor: p.color }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default Confetti;