import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DonateFood from "./pages/DonateFood";
import DonationHistory from "./pages/DonationHistory";
import FoodSafety from "./pages/FoodSafety";
import FSSAILicense from "./pages/FSSAILicense";
import NgoPage from "./pages/NgoPage";
import Profile from "./pages/Profile";
import RestaurantPage from "./pages/RestaurantPage";
import RoutePage from "./pages/Route";
import RouteOptimization from "./pages/RouteOptimization";
import Success from "./pages/Success";
import AIPrediction from "./pages/AIPrediction";

function App() {
  return (
    <Routes>

      {/* Landing Page */}
      <Route
        path="/"
        element={<Landing />}
      />

      {/* Authentication */}
      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      {/* Food Donation */}
      <Route
        path="/donate-food"
        element={<DonateFood />}
      />

      {/* Donation History */}
      <Route
        path="/donation-history"
        element={<DonationHistory />}
      />

      {/* Food Safety */}
      <Route
        path="/food-safety"
        element={<FoodSafety />}
      />

      {/* FSSAI */}
      <Route
        path="/fssai-license"
        element={<FSSAILicense />}
      />

      {/* NGOs */}
      <Route
        path="/ngos"
        element={<NgoPage />}
      />

      {/* Profile */}
      <Route
        path="/profile"
        element={<Profile />}
      />

      {/* Restaurants - NEW */}
      <Route
        path="/restaurants"
        element={<RestaurantPage />}
      />

      {/* Route / Map */}
      <Route
        path="/route"
        element={<RoutePage />}
      />

      {/* Route Optimization */}
      <Route
        path="/route-optimization"
        element={<RouteOptimization />}
      />

      {/* AI Prediction */}
      <Route
        path="/ai-prediction"
        element={<AIPrediction />}
      />

      {/* Success */}
      <Route
        path="/success"
        element={<Success />}
      />

      {/* Fallback */}
      <Route
        path="*"
        element={<Landing />}
      />

    </Routes>
  );
}

export default App;