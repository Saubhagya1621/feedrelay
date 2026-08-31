import { motion } from "framer-motion";
import UrgencyBadge from "./UrgencyBadge.jsx";
import Avatar from "./Avatar.jsx";

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

const ListingCard = ({ listing, index, onClaim, onView, claiming, showClaimButton = true }) => {
  return (
    <motion.div
      layout
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={() => onView?.(listing)}
      className={`rounded-2xl border border-black/5 bg-white p-5 shadow-sm hover:shadow-md transition-shadow ${onView ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={listing.restaurant?.name} role="restaurant" size={38} />
          <div>
            <h3 className="font-display text-lg font-medium text-[var(--color-base-dark)]">
              {listing.foodType}
            </h3>
            <p className="text-sm text-black/60 mt-0.5">
              {listing.quantity?.value} {listing.quantity?.unit} ·{" "}
              {listing.restaurant?.name}
            </p>
          </div>
        </div>
        <UrgencyBadge expiresAt={listing.expiresAt} urgency={listing.urgency} />
      </div>

      {listing.description && (
        <p className="text-sm text-black/70 mt-3">{listing.description}</p>
      )}

      {showClaimButton && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onClaim(listing._id);
          }}
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