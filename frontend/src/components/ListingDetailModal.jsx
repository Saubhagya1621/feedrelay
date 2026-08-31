import { AnimatePresence, motion } from "framer-motion";
import Avatar from "./Avatar.jsx";
import UrgencyBadge from "./UrgencyBadge.jsx";

const ListingDetailModal = ({ listing, onClose, onClaim, claiming }) => {
  if (!listing) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Avatar name={listing.restaurant?.name} role="restaurant" size={44} />
              <div>
                <h2 className="font-display text-xl font-medium">{listing.foodType}</h2>
                <p className="text-sm text-black/50">{listing.restaurant?.name}</p>
              </div>
            </div>
            <UrgencyBadge expiresAt={listing.expiresAt} urgency={listing.urgency} />
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-black/50">Quantity</span>
              <span className="font-medium">
                {listing.quantity?.value} {listing.quantity?.unit}
              </span>
            </div>
            {listing.description && (
              <div>
                <span className="text-black/50 text-sm">Description</span>
                <p className="text-sm mt-1">{listing.description}</p>
              </div>
            )}
            {listing.restaurant?.address && (
              <div className="flex justify-between text-sm">
                <span className="text-black/50">Pickup location</span>
                <span className="font-medium text-right">{listing.restaurant.address}</span>
              </div>
            )}
            {listing.restaurant?.phone && (
              <div className="flex justify-between text-sm">
                <span className="text-black/50">Contact</span>
                <span className="font-medium">{listing.restaurant.phone}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 rounded-xl py-2.5 font-medium border border-black/10">
              Close
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onClaim(listing._id)}
              disabled={claiming}
              className="flex-1 rounded-xl py-2.5 font-semibold text-white disabled:opacity-60"
              style={{ backgroundColor: "var(--color-ngo)" }}
            >
              {claiming ? "Claiming..." : "Claim Pickup"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ListingDetailModal;