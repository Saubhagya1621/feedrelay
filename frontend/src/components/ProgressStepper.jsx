import { motion } from "framer-motion";

const STEPS = ["claimed", "en_route", "arrived", "completed"];
const LABELS = { claimed: "Claimed", en_route: "En Route", arrived: "Arrived", completed: "Completed" };

const ProgressStepper = ({ status }) => {
  const currentIndex = status === "cancelled" ? -1 : STEPS.indexOf(status);

  if (status === "cancelled") {
    return (
      <span
        className="text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full text-white"
        style={{ backgroundColor: "var(--color-urgency-high)" }}
      >
        Cancelled
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center">
          <motion.div
            initial={false}
            animate={{
              backgroundColor: i <= currentIndex ? "var(--color-ngo)" : "rgba(0,0,0,0.12)",
              scale: i === currentIndex ? 1.15 : 1,
            }}
            className="w-2.5 h-2.5 rounded-full"
            title={LABELS[step]}
          />
          {i < STEPS.length - 1 && (
            <div
              className="w-5 h-0.5 mx-0.5"
              style={{
                backgroundColor: i < currentIndex ? "var(--color-ngo)" : "rgba(0,0,0,0.12)",
              }}
            />
          )}
        </div>
      ))}
      <span className="ml-2 text-xs font-medium text-black/50">{LABELS[status]}</span>
    </div>
  );
};

export default ProgressStepper;