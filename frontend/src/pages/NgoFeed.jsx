import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ListingCard from "../components/ListingCard.jsx";
import ListingDetailModal from "../components/ListingDetailModal.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { SkeletonGrid } from "../components/Skeleton.jsx";
import StatStrip from "../components/StatStrip.jsx";
import { getFeed, claimListing } from "../api/endpoints.js";
import { useSocket } from "../context/SocketContext.jsx";

const NgoFeed = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [detailListing, setDetailListing] = useState(null);
  const socket = useSocket();

  const loadFeed = async () => {
    try {
      const res = await getFeed();
      setListings(res.data.data);
    } catch {
      toast.error("Could not load feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNew = (listing) => {
      setListings((prev) => [listing, ...prev]);
      toast(`New listing: ${listing.foodType}`, { icon: "🍲" });
    };

    const handleClaimed = ({ listingId }) => {
      setListings((prev) => prev.filter((l) => l._id !== listingId));
    };

    const handleCancelled = ({ listingId }) => {
      setListings((prev) => prev.filter((l) => l._id !== listingId));
    };

    socket.on("listing:new", handleNew);
    socket.on("listing:claimed", handleClaimed);
    socket.on("listing:cancelled", handleCancelled);

    return () => {
      socket.off("listing:new", handleNew);
      socket.off("listing:claimed", handleClaimed);
      socket.off("listing:cancelled", handleCancelled);
    };
  }, [socket]);

  const handleClaim = async (id) => {
    setClaimingId(id);
    try {
      await claimListing(id);
      toast.success("Claimed! Head to Pickups to update status.");
      setListings((prev) => prev.filter((l) => l._id !== id));
      setDetailListing(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not claim listing");
      loadFeed();
    } finally {
      setClaimingId(null);
    }
  };

  const highUrgencyCount = listings.filter((l) => l.urgency === "high").length;

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl font-medium mb-6">Available Now</h1>

      {!loading && listings.length > 0 && (
        <StatStrip
          stats={[
            { label: "Available listings", value: listings.length, color: "var(--color-primary)" },
            { label: "Urgent (< 1 hr)", value: highUrgencyCount, color: "var(--color-urgency-high)" },
            { label: "Restaurants", value: new Set(listings.map((l) => l.restaurant?._id)).size, color: "var(--color-ngo)" },
          ]}
        />
      )}

      {loading ? (
        <SkeletonGrid count={4} />
      ) : listings.length === 0 ? (
        <EmptyState
          icon="🍽️"
          title="No listings available right now"
          subtitle="New surplus food will appear here the moment a restaurant posts it — check back soon."
        />
      ) : (
        <motion.div layout className="grid md:grid-cols-2 gap-5">
          <AnimatePresence>
            {listings.map((listing, i) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                index={i}
                onClaim={handleClaim}
                onView={setDetailListing}
                claiming={claimingId === listing._id}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {detailListing && (
        <ListingDetailModal
          listing={detailListing}
          onClose={() => setDetailListing(null)}
          onClaim={handleClaim}
          claiming={claimingId === detailListing._id}
        />
      )}
    </div>
  );
};

export default NgoFeed;