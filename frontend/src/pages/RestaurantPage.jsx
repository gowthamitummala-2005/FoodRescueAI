import React, { useEffect, useState } from "react";

const API_URL =
  "https://foodrescueai-backend.onrender.com/api/restaurants";

function RestaurantPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load restaurants");
      }

      const data = await response.json();

      setRestaurants(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load restaurant data.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2>Loading restaurants...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <h2>{error}</h2>
          <button style={styles.retryButton} onClick={fetchRestaurants}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Restaurants</h1>

          <p style={styles.subtitle}>
            FSSAI-licensed restaurants registered in FoodRescueAI
          </p>
        </div>

        <button style={styles.refreshButton} onClick={fetchRestaurants}>
          🔄 Refresh
        </button>
      </div>

      {restaurants.length === 0 ? (
        <div style={styles.empty}>
          <h2>No restaurant data available</h2>
          <p>
            Add restaurant records through the restaurant API to display them
            here.
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} style={styles.card}>
              {/* RESTAURANT HEADER */}
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.name}>
                    🍽️ {restaurant.name}
                  </h2>

                  <p style={styles.cuisine}>
                    {restaurant.cuisine || "Cuisine not available"}
                  </p>
                </div>

                <span
                  style={{
                    ...styles.statusBadge,
                    ...(restaurant.fssaiStatus === "ACTIVE"
                      ? styles.active
                      : styles.inactive),
                  }}
                >
                  {restaurant.fssaiStatus || "UNKNOWN"}
                </span>
              </div>

              {/* BASIC DETAILS */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  📍 Restaurant Details
                </h3>

                <p>
                  <strong>Address:</strong>{" "}
                  {restaurant.address || "Not available"}
                </p>

                <p>
                  <strong>City:</strong>{" "}
                  {restaurant.city || "Not available"}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {restaurant.phone || "Not available"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {restaurant.email || "Not available"}
                </p>
              </div>

              {/* LOCATION */}
              <div style={styles.locationBox}>
                <h3 style={styles.sectionTitle}>
                  🗺️ Location
                </h3>

                <p>
                  <strong>Latitude:</strong>{" "}
                  {restaurant.latitude ?? "Not available"}
                </p>

                <p>
                  <strong>Longitude:</strong>{" "}
                  {restaurant.longitude ?? "Not available"}
                </p>
              </div>

              {/* FSSAI DETAILS */}
              <div style={styles.fssaiBox}>
                <h3 style={styles.sectionTitle}>
                  ✅ FSSAI Licence Details
                </h3>

                <p>
                  <strong>Licence Number:</strong>{" "}
                  {restaurant.fssaiLicenseNumber || "Not available"}
                </p>

                <p>
                  <strong>Licence Type:</strong>{" "}
                  {restaurant.fssaiLicenseType || "Not available"}
                </p>

                <p>
                  <strong>Expiry Date:</strong>{" "}
                  {restaurant.fssaiLicenseExpiryDate || "Not available"}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {restaurant.fssaiStatus || "Unknown"}
                </p>
              </div>

              {/* FOOD SAFETY OFFICER */}
              <div style={styles.officerBox}>
                <h3 style={styles.sectionTitle}>
                  👮 Food Safety Officer
                </h3>

                <p>
                  <strong>Name:</strong>{" "}
                  {restaurant.foodSafetyOfficerName ||
                    "Not available"}
                </p>

                <p>
                  <strong>Contact:</strong>{" "}
                  {restaurant.foodSafetyOfficerContact ||
                    "Not available"}
                </p>
              </div>

              {/* FOOD DATA */}
              <div style={styles.foodInfo}>
                <h3 style={styles.sectionTitle}>
                  🍱 Food & Waste Information
                </h3>

                <div style={styles.foodGrid}>
                  <div style={styles.foodCard}>
                    <span style={styles.foodNumber}>
                      {restaurant.averageDailyFoodKg ?? 0}
                    </span>
                    <span>Daily Food (kg)</span>
                  </div>

                  <div style={styles.foodCard}>
                    <span style={styles.foodNumber}>
                      {restaurant.averageDailyWasteKg ?? 0}
                    </span>
                    <span>Daily Waste (kg)</span>
                  </div>

                  <div style={styles.foodCard}>
                    <span style={styles.foodNumber}>
                      {restaurant.surplusFoodKg ?? 0}
                    </span>
                    <span>Surplus Food (kg)</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "1250px",
    margin: "0 auto",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    gap: "20px",
  },

  heading: {
    fontSize: "32px",
    margin: 0,
    color: "#1f2937",
  },

  subtitle: {
    color: "#6b7280",
    marginTop: "8px",
  },

  refreshButton: {
    border: "none",
    background: "#2e7d32",
    color: "white",
    padding: "11px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },

  retryButton: {
    border: "none",
    background: "#2e7d32",
    color: "white",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  errorBox: {
    textAlign: "center",
    padding: "50px",
    background: "#fff3f3",
    borderRadius: "12px",
    color: "#b91c1c",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "22px",
  },

  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "22px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
    border: "1px solid #eeeeee",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "18px",
  },

  name: {
    margin: 0,
    fontSize: "22px",
    color: "#1f2937",
  },

  cuisine: {
    marginTop: "6px",
    color: "#6b7280",
    fontSize: "14px",
  },

  statusBadge: {
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  active: {
    background: "#dcfce7",
    color: "#166534",
  },

  inactive: {
    background: "#fee2e2",
    color: "#991b1b",
  },

  section: {
    paddingBottom: "12px",
    marginBottom: "14px",
    borderBottom: "1px solid #eeeeee",
  },

  sectionTitle: {
    fontSize: "16px",
    marginTop: 0,
    marginBottom: "10px",
    color: "#374151",
  },

  locationBox: {
    background: "#f3f8ff",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "14px",
  },

  fssaiBox: {
    background: "#f1f8e9",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "14px",
    borderLeft: "4px solid #43a047",
  },

  officerBox: {
    background: "#fff8e1",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "14px",
    borderLeft: "4px solid #f9a825",
  },

  foodInfo: {
    marginTop: "10px",
    paddingTop: "14px",
    borderTop: "1px solid #eeeeee",
  },

  foodGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
  },

  foodCard: {
    background: "#f8fafc",
    borderRadius: "8px",
    padding: "12px 6px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    fontSize: "11px",
    color: "#6b7280",
  },

  foodNumber: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#2e7d32",
  },

  empty: {
    padding: "50px",
    textAlign: "center",
    background: "#f9fafb",
    borderRadius: "14px",
    color: "#6b7280",
  },
};

export default RestaurantPage;