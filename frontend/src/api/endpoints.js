import api from "./axios.js";

// Auth
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const logoutUser = () => api.post("/auth/logout");
export const getCurrentUser = () => api.get("/auth/me");

// Listings
export const createListing = (data) => api.post("/listings", data);
export const getFeed = () => api.get("/listings/feed");
export const getMyListings = () => api.get("/listings/mine");
export const getListingById = (id) => api.get(`/listings/${id}`);
export const claimListing = (id) => api.post(`/listings/${id}/claim`);
export const cancelListing = (id) => api.post(`/listings/${id}/cancel`);

// Pickups
export const getMyPickups = () => api.get("/pickups");
export const updatePickupStatus = (id, status, cancelReason) =>
  api.patch(`/pickups/${id}/status`, { status, cancelReason });

// Feedback
export const submitFeedback = (data) => api.post("/feedback", data);

// Admin
export const getAdminStats = () => api.get("/admin/stats");
export const getExpiredListings = () => api.get("/admin/listings/expired");
export const getCancelledPickups = () => api.get("/admin/pickups/cancelled");
