import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ListingCard from "../components/ListingCard.jsx";
import { createListing, getMyListings, cancelListing } from "../api/endpoints.js";

const emptyForm = {
  foodType: "",
  description: "",
  quantityValue: "",
  quantityUnit: "servings",
  expiresAt: "",
};

const RestaurantDashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const loadListings = async () => {
    try {
      const res = await getMyListings();
      setListings(res.data.data);
    } catch {
      toast.error("Could not load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createListing({
        foodType: form.foodType,
        description: form.description,
        quantity: { value: Number(form.quantityValue), unit: form.quantityUnit },
        expiresAt: form.expiresAt,
      });
      toast.success("Listing posted!");
      setForm(emptyForm);
      setShowForm(false);
      loadListings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create listing");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelListing(id);
      toast.success("Listing cancelled");
      loadListings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    }
  };

  return (
    <div className="px-6 py-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-medium">Your Listings</h1>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowForm((s) => !s)}
          className="rounded-full px-5 py-2.5 font-semibold text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {showForm ? "Cancel" : "+ New Listing"}
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="overflow-hidden bg-white rounded-2xl border border-black/5 shadow-sm mb-8"
          >
            <div className="p-6 grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Food type</label>
                <input required value={form.foodType} onChange={(e) => setForm({ ...form, foodType: e.target.value })} className="w-full mt-1 rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <input type="number" required min="1" value={form.quantityValue} onChange={(e) => setForm({ ...form, quantityValue: e.target.value })} className="w-full mt-1 rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div>
                <label className="text-sm font-medium">Unit</label>
                <select value={form.quantityUnit} onChange={(e) => setForm({ ...form, quantityUnit: e.target.value })} className="w-full mt-1 rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-[var(--color-primary)]">
                  <option value="servings">servings</option>
                  <option value="kg">kg</option>
                  <option value="packets">packets</option>
                  <option value="liters">liters</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Description (optional)</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full mt-1 rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Safe pickup until</label>
                <input type="datetime-local" required value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="w-full mt-1 rounded-lg border border-black/10 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
              </div>
            </div>
            <div className="px-6 pb-6">
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={submitting}
                className="rounded-xl px-6 py-2.5 font-semibold text-white disabled:opacity-60"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {submitting ? "Posting..." : "Post Listing"}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {loading ? (
        <p className="text-black/50">Loading...</p>
      ) : listings.length === 0 ? (
        <p className="text-black/50">No listings yet. Post your first one above.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          <AnimatePresence>
            {listings.map((listing, i) => (
              <div key={listing._id} className="relative">
                <ListingCard listing={listing} index={i} showClaimButton={false} />
                <div className="mt-2 flex items-center justify-between px-1">
                  <span className="text-xs uppercase tracking-wide font-semibold text-black/40">
                    {listing.status.replace("_", " ")}
                  </span>
                  {listing.status === "available" && (
                    <button
                      onClick={() => handleCancel(listing._id)}
                      className="text-xs font-medium text-black/50 hover:text-[var(--color-urgency-high)]"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default RestaurantDashboard;
