import { motion } from "framer-motion";
import UrgencyBadge from "./UrgencyBadge.jsx";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" },
  }),
  exit: {
    opacity: 0,
    scale: 0.92,
    transition: { duration: 0.3 },
  },
};

const ListingCard = ({ listing, index, onClaim, claiming, showClaimButton = true }) => {
  return (
    <motion.div
      layout
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-medium text-[var(--color-base-dark)]">
            {listing.foodType}
          </h3>
          <p className="text-sm text-black/60 mt-0.5">
            {listing.quantity?.value} {listing.quantity?.unit} ·{" "}
            {listing.restaurant?.name}
          </p>
        </div>
        <UrgencyBadge expiresAt={listing.expiresAt} urgency={listing.urgency} />
      </div>

      {listing.description && (
        <p className="text-sm text-black/70 mt-3">{listing.description}</p>
      )}

      {showClaimButton && (
        <motion.button
          onClick={() => onClaim(listing._id)}
          disabled={claiming}
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          className="mt-4 w-full rounded-xl py-2.5 font-semibold text-white transition-colors disabled:opacity-60"
          style={{ backgroundColor: "var(--color-ngo)" }}
        >
          {claiming ? "Claiming..." : "Claim Pickup"}
        </motion.button>
      )}
    </motion.div>
  );
};

export default ListingCard;
