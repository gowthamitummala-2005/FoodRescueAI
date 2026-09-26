import "./App.css";
import "leaflet/dist/leaflet.css";

import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

// ===============================
// PUBLIC PAGES
// ===============================
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Success from "./pages/Success";

// ===============================
// PROTECTED PAGES
// ===============================
import Dashboard from "./pages/Dashboard";
import DonateFood from "./pages/DonateFood";
import AIPrediction from "./pages/AIPrediction";
import DonationHistory from "./pages/DonationHistory";
import NgoPage from "./pages/NgoPage";
import Profile from "./pages/Profile";

import FSSAILicense from "./pages/FSSAILicense";
import FoodSafety from "./pages/FoodSafety";

// ===============================
// ROUTE PLANNER
// IMPORTANT: NOT named Route
// ===============================
import RoutePlanner from "./pages/Route";


// ===============================
// PROTECTED ROUTE
// ===============================
function ProtectedRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


// ===============================
// APP
// ===============================
function App() {
  return (
    <Routes>

      {/* PUBLIC */}

      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/success"
        element={<Success />}
      />


      {/* PROTECTED */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/donate-food"
        element={
          <ProtectedRoute>
            <DonateFood />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ai-prediction"
        element={
          <ProtectedRoute>
            <AIPrediction />
          </ProtectedRoute>
        }
      />

      <Route
        path="/donations"
        element={
          <ProtectedRoute>
            <DonationHistory />
          </ProtectedRoute>
        }
      />

      <Route
        path="/ngo"
        element={
          <ProtectedRoute>
            <NgoPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/fssai-license"
        element={
          <ProtectedRoute>
            <FSSAILicense />
          </ProtectedRoute>
        }
      />

      <Route
        path="/food-safety"
        element={
          <ProtectedRoute>
            <FoodSafety />
          </ProtectedRoute>
        }
      />


      {/* ===============================
          NEW ROUTE PLANNER
          =============================== */}

      <Route
        path="/route"
        element={
          <ProtectedRoute>
            <RoutePlanner />
          </ProtectedRoute>
        }
      />


      {/* FALLBACK */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;