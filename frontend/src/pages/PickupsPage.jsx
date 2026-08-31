import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMyPickups, updatePickupStatus } from "../api/endpoints.js";
import { useAuth } from "../context/AuthContext.jsx";
import FeedbackModal from "../components/FeedbackModal.jsx";

const NEXT_STEP = {
  claimed: "en_route",
  en_route: "arrived",
  arrived: "completed",
};

const STEP_LABEL = {
  en_route: "Mark En Route",
  arrived: "Mark Arrived",
  completed: "Mark Completed",
};

const PickupsPage = () => {
  const { user } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [feedbackTarget, setFeedbackTarget] = useState(null);

  const load = async () => {
    try {
      const res = await getMyPickups();
      setPickups(res.data.data);
    } catch {
      toast.error("Could not load pickups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const advance = async (pickup) => {
    const nextStatus = NEXT_STEP[pickup.status];
    if (!nextStatus) return;
    setUpdatingId(pickup._id);
    try {
      await updatePickupStatus(pickup._id, nextStatus);
      toast.success("Status updated");
      await load();
      if (nextStatus === "completed") {
        setFeedbackTarget({ ...pickup, status: "completed" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto">
      <h1 className="font-display text-3xl font-medium mb-8">Pickups</h1>

      {loading ? (
        <p className="text-black/50">Loading...</p>
      ) : pickups.length === 0 ? (
        <p className="text-black/50">No pickups yet.</p>
      ) : (
        <div className="space-y-4">
          {pickups.map((pickup) => (
            <motion.div
              key={pickup._id}
              layout
              className="rounded-2xl bg-white border border-black/5 p-5 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="font-semibold">{pickup.listing?.foodType}</p>
                <p className="text-sm text-black/60">
                  {user.role === "ngo" ? pickup.restaurant?.name : pickup.ngo?.name}
                </p>
                <span className="inline-block mt-1 text-xs uppercase tracking-wide font-semibold text-black/40">
                  {pickup.status.replace("_", " ")}
                </span>
              </div>

              {NEXT_STEP[pickup.status] && (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => advance(pickup)}
                  disabled={updatingId === pickup._id}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                  style={{ backgroundColor: "var(--color-ngo)" }}
                >
                  {STEP_LABEL[NEXT_STEP[pickup.status]]}
                </motion.button>
              )}

              {pickup.status === "completed" && (
                <button
                  onClick={() => setFeedbackTarget(pickup)}
                  className="text-sm font-medium text-[var(--color-primary)]"
                >
                  Rate pickup
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {feedbackTarget && (
        <FeedbackModal
          pickup={feedbackTarget}
          onClose={() => setFeedbackTarget(null)}
          onSubmitted={load}
        />
      )}
    </div>
  );
};

export default PickupsPage;
