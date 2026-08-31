import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { submitFeedback } from "../api/endpoints.js";

const FeedbackModal = ({ pickup, onClose, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }
    setSubmitting(true);
    try {
      await submitFeedback({ pickupId: pickup._id, rating, comment });
      toast.success("Feedback submitted");
      onSubmitted();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

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
          className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
        >
          <h2 className="font-display text-xl font-medium mb-1">Rate this pickup</h2>
          <p className="text-sm text-black/50 mb-4">{pickup.listing?.foodType}</p>

          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <motion.button
                key={n}
                whileTap={{ scale: 0.85 }}
                onClick={() => setRating(n)}
                className="text-3xl"
                style={{ color: n <= rating ? "var(--color-primary)" : "rgba(0,0,0,0.15)" }}
              >
                ★
              </motion.button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional comment"
            rows={3}
            className="w-full rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-[var(--color-primary)] mb-4 resize-none"
          />

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 rounded-xl py-2.5 font-medium border border-black/10">
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 rounded-xl py-2.5 font-semibold text-white disabled:opacity-60"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              {submitting ? "Sending..." : "Submit"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeedbackModal;
