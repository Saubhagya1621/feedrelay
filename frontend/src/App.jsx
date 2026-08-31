import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import RestaurantDashboard from "./pages/RestaurantDashboard.jsx";
import NgoFeed from "./pages/NgoFeed.jsx";
import PickupsPage from "./pages/PickupsPage.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";

function App() {
  return (
    <div className="min-h-screen bg-[var(--color-base-light)]">
      <Toaster position="top-center" />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/restaurant/dashboard"
          element={
            <ProtectedRoute allowedRoles={["restaurant"]}>
              <RestaurantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo/feed"
          element={
            <ProtectedRoute allowedRoles={["ngo"]}>
              <NgoFeed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pickups"
          element={
            <ProtectedRoute allowedRoles={["restaurant", "ngo"]}>
              <PickupsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
