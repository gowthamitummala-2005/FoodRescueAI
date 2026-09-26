import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

// ============================================================
// API
// ============================================================

const API_BASE =
  "http://foodrescueai-backend.onrender.com/api/routes";

// ============================================================
// DEFAULT HYDERABAD CENTER
// ============================================================

const HYDERABAD_CENTER = [
  17.3850,
  78.4867,
];

// ============================================================
// CUSTOM PICKUP MARKER
// ============================================================

const pickupIcon =
  L.divIcon({
    className: "custom-route-marker",

    html: `
      <div style="
        width:36px;
        height:36px;
        border-radius:50%;
        background:#dc2626;
        border:4px solid white;
        box-shadow:0 3px 10px rgba(0,0,0,0.35);
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:18px;
      ">
        📍
      </div>
    `,

    iconSize: [36, 36],

    iconAnchor: [18, 18],
  });

// ============================================================
// CUSTOM DESTINATION MARKER
// ============================================================

const destinationIcon =
  L.divIcon({
    className: "custom-route-marker",

    html: `
      <div style="
        width:36px;
        height:36px;
        border-radius:50%;
        background:#2563eb;
        border:4px solid white;
        box-shadow:0 3px 10px rgba(0,0,0,0.35);
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:18px;
      ">
        🏢
      </div>
    `,

    iconSize: [36, 36],

    iconAnchor: [18, 18],
  });

// ============================================================
// MAP CONTROLLER
// ============================================================

function RouteMapController({
  pickup,
  destination,
  route,
}) {

  const map = useMap();

  useEffect(() => {

    // --------------------------------------------------------
    // If actual route exists, fit the complete route.
    // --------------------------------------------------------

    if (
      route &&
      route.length > 1
    ) {

      const bounds =
        L.latLngBounds(route);

      map.fitBounds(
        bounds,
        {
          padding: [50, 50],
          maxZoom: 15,
        }
      );

      return;
    }

    // --------------------------------------------------------
    // If pickup + destination exist
    // --------------------------------------------------------

    if (
      pickup &&
      destination
    ) {

      const bounds =
        L.latLngBounds([
          [
            pickup.latitude,
            pickup.longitude,
          ],
          [
            destination.latitude,
            destination.longitude,
          ],
        ]);

      map.fitBounds(
        bounds,
        {
          padding: [50, 50],
          maxZoom: 15,
        }
      );

      return;
    }

    // --------------------------------------------------------
    // Pickup only
    // --------------------------------------------------------

    if (pickup) {

      map.flyTo(
        [
          pickup.latitude,
          pickup.longitude,
        ],
        14,
        {
          duration: 1,
        }
      );

      return;
    }

    // --------------------------------------------------------
    // Destination only
    // --------------------------------------------------------

    if (destination) {

      map.flyTo(
        [
          destination.latitude,
          destination.longitude,
        ],
        14,
        {
          duration: 1,
        }
      );
    }

  }, [
    map,
    pickup,
    destination,
    route,
  ]);

  return null;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Route() {

  const [pickup, setPickup] =
    useState("");

  const [destination, setDestination] =
    useState("");

  const [routeData, setRouteData] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==========================================================
  // GENERATE ROUTE
  // ==========================================================

  const generateRoute =
    async (event) => {

      event.preventDefault();

      setError("");

      setRouteData(null);

      // ------------------------------------------------------
      // VALIDATION
      // ------------------------------------------------------

      if (!pickup.trim()) {

        setError(
          "Please enter the pickup location."
        );

        return;
      }

      if (!destination.trim()) {

        setError(
          "Please enter the destination."
        );

        return;
      }

      // ------------------------------------------------------
      // LOADING
      // ------------------------------------------------------

      setLoading(true);

      try {

        const response =
          await axios.get(
            `${API_BASE}/calculate`,
            {
              params: {
                pickup:
                  pickup.trim(),

                destination:
                  destination.trim(),
              },

              timeout: 35000,
            }
          );

        const data =
          response.data;

        console.log(
          "ROUTE RESPONSE:",
          data
        );

        if (!data.success) {

          setError(
            data.message ||
            "Unable to calculate route."
          );

          return;
        }

        // ----------------------------------------------------
        // SAVE COMPLETE ROUTE
        // ----------------------------------------------------

        setRouteData(data);

      } catch (err) {

        console.error(
          "ROUTE ERROR:",
          err
        );

        if (
          err.code ===
          "ECONNABORTED"
        ) {

          setError(
            "The route request took too long. Please try again."
          );

        } else if (
          err.response?.data?.message
        ) {

          setError(
            err.response.data.message
          );

        } else {

          setError(
            "Could not connect to the backend. Make sure Spring Boot is running on port 8080."
          );
        }

      } finally {

        setLoading(false);
      }
    };

  // ==========================================================
  // CLEAR
  // ==========================================================

  const clearRoute = () => {

    setPickup("");

    setDestination("");

    setRouteData(null);

    setError("");
  };

  // ==========================================================
  // ROUTE COORDINATES
  // ==========================================================

  const routeCoordinates =
    routeData?.geometry?.coordinates
      ? routeData.geometry.coordinates.map(
          ([lng, lat]) => [
            lat,
            lng,
          ]
        )
      : [];

  // ==========================================================
  // MAP CENTER
  // ==========================================================

  const mapCenter =
    routeData?.pickup
      ? [
          routeData.pickup.latitude,
          routeData.pickup.longitude,
        ]
      : HYDERABAD_CENTER;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      style={{
        minHeight:
          "100vh",

        background:
          "#f5f7f2",

        color:
          "#1f2937",

        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header
        style={{
          background:
            "#ffffff",

          borderBottom:
            "1px solid #e5e7eb",

          padding:
            "18px 7%",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          gap:
            "25px",

          flexWrap:
            "wrap",
        }}
      >

        {/* LOGO */}

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "12px",
          }}
        >

          <div
            style={{
              width:
                "44px",

              height:
                "44px",

              borderRadius:
                "12px",

              background:
                "#173f20",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              fontSize:
                "22px",
            }}
          >
            🍃
          </div>

          <div>

            <div
              style={{
                fontSize:
                  "21px",

                fontWeight:
                  "700",

                color:
                  "#173f20",
              }}
            >
              FoodRescue
            </div>

            <div
              style={{
                fontSize:
                  "10px",

                letterSpacing:
                  "0.8px",

                color:
                  "#7a8179",
              }}
            >
              AI FOOD WASTE MANAGEMENT
            </div>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "25px",

            flexWrap:
              "wrap",
          }}
        >

          <a
            href="/dashboard"
            style={navStyle}
          >
            Dashboard
          </a>

          <a
            href="/donate"
            style={navStyle}
          >
            Donate Food
          </a>

          <a
            href="/prediction"
            style={navStyle}
          >
            AI Prediction
          </a>

          <a
            href="/ngo"
            style={navStyle}
          >
            Nearby NGOs
          </a>

          <a
            href="/donations"
            style={navStyle}
          >
            My Donations
          </a>

        </nav>

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "10px",
          }}
        >

          <div
            style={{
              width:
                "32px",

              height:
                "32px",

              borderRadius:
                "50%",

              background:
                "#eef2ea",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              fontWeight:
                "700",

              color:
                "#173f20",
            }}
          >
            J
          </div>

          <strong>
            JAYA
          </strong>

          <a
            href="/login"
            style={{
              color:
                "#6b7280",

              textDecoration:
                "none",

              fontSize:
                "14px",
            }}
          >
            Logout
          </a>

        </div>

      </header>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main
        style={{
          width:
            "86%",

          maxWidth:
            "1250px",

          margin:
            "0 auto",

          padding:
            "35px 0 60px",
        }}
      >

        {/* PAGE TITLE */}

        <div
          style={{
            marginBottom:
              "28px",
          }}
        >

          <h1
            style={{
              margin:
                "0 0 8px",

              fontSize:
                "34px",

              color:
                "#234c2a",

              fontWeight:
                "700",
            }}
          >
            🚚 Route Planning
          </h1>

          <p
            style={{
              margin:
                "0",

              color:
                "#66706a",

              fontSize:
                "16px",
            }}
          >
            Plan efficient food pickup and
            redistribution routes between locations.
          </p>

        </div>

        {/* ====================================================
            SEARCH CARD
        ==================================================== */}

        <section
          style={{
            background:
              "#ffffff",

            borderRadius:
              "14px",

            padding:
              "30px",

            boxShadow:
              "0 2px 12px rgba(0,0,0,0.06)",

            border:
              "1px solid #edf0eb",

            marginBottom:
              "25px",
          }}
        >

          <h2
            style={{
              margin:
                "0 0 8px",

              fontSize:
                "22px",

              color:
                "#202820",
            }}
          >
            Plan a Food Rescue Route
          </h2>

          <p
            style={{
              margin:
                "0 0 25px",

              color:
                "#777f78",

              fontSize:
                "14px",
            }}
          >
            Enter any pickup location and
            destination in Hyderabad.
          </p>

          <form
            onSubmit={
              generateRoute
            }
          >

            <div
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  "1fr 1fr",

                gap:
                  "18px",
              }}
            >

              {/* PICKUP */}

              <div>

                <label
                  style={labelStyle}
                >
                  Pickup Location *
                </label>

                <input
                  value={pickup}
                  onChange={(e) =>
                    setPickup(
                      e.target.value
                    )
                  }
                  placeholder="Example: ECIL"
                  style={inputStyle}
                />

              </div>

              {/* DESTINATION */}

              <div>

                <label
                  style={labelStyle}
                >
                  Destination *
                </label>

                <input
                  value={
                    destination
                  }
                  onChange={(e) =>
                    setDestination(
                      e.target.value
                    )
                  }
                  placeholder="Example: Habsiguda"
                  style={inputStyle}
                />

              </div>

            </div>

            {/* ERROR */}

            {error && (

              <div
                style={{
                  marginTop:
                    "18px",

                  padding:
                    "13px 16px",

                  borderRadius:
                    "8px",

                  background:
                    "#fff1f2",

                  border:
                    "1px solid #fecdd3",

                  color:
                    "#be123c",

                  fontSize:
                    "14px",
                }}
              >
                ⚠️ {error}
              </div>

            )}

            {/* BUTTONS */}

            <div
              style={{
                display:
                  "flex",

                gap:
                  "12px",

                marginTop:
                  "22px",
              }}
            >

              <button
                type="submit"
                disabled={
                  loading
                }
                style={{
                  background:
                    loading
                      ? "#78917c"
                      : "#173f20",

                  color:
                    "#ffffff",

                  border:
                    "none",

                  borderRadius:
                    "9px",

                  padding:
                    "13px 25px",

                  fontSize:
                    "15px",

                  fontWeight:
                    "700",

                  cursor:
                    loading
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {loading
                  ? "🚚 Calculating..."
                  : "🚚 Generate Route"}
              </button>

              <button
                type="button"
                onClick={
                  clearRoute
                }
                style={{
                  background:
                    "#ffffff",

                  color:
                    "#374151",

                  border:
                    "1px solid #9ca3af",

                  borderRadius:
                    "9px",

                  padding:
                    "13px 25px",

                  fontSize:
                    "15px",

                  fontWeight:
                    "600",

                  cursor:
                    "pointer",
                }}
              >
                Clear
              </button>

            </div>

          </form>

        </section>

        {/* ====================================================
            ALWAYS VISIBLE MAP
        ==================================================== */}

        <section
          style={{
            background:
              "#ffffff",

            borderRadius:
              "14px",

            padding:
              "25px",

            boxShadow:
              "0 2px 12px rgba(0,0,0,0.06)",

            border:
              "1px solid #edf0eb",

            marginBottom:
              "25px",
          }}
        >

          <h2
            style={{
              margin:
                "0 0 8px",

              fontSize:
                "22px",

              color:
                "#202820",
            }}
          >
            🗺️ Interactive Route Map
          </h2>

          <p
            style={{
              margin:
                "0 0 18px",

              color:
                "#777f78",

              fontSize:
                "14px",
            }}
          >
            {routeData
              ? "Showing the actual driving route between the selected locations."
              : "The Hyderabad map is ready. Enter two locations and generate a route."}
          </p>

          {/* MAP */}

          <div
            style={{
              width:
                "100%",

              height:
                "520px",

              borderRadius:
                "12px",

              overflow:
                "hidden",

              border:
                "1px solid #d8ded8",

              position:
                "relative",
            }}
          >

            <MapContainer
              center={
                mapCenter
              }

              zoom={
                routeData
                  ? 13
                  : 11
              }

              scrollWheelZoom={
                true
              }

              zoomControl={
                true
              }

              style={{
                width:
                  "100%",

                height:
                  "100%",
              }}
            >

              {/* OPENSTREETMAP */}

              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* MAP CONTROLLER */}

              <RouteMapController
                pickup={
                  routeData?.pickup
                }
                destination={
                  routeData?.destination
                }
                route={
                  routeCoordinates
                }
              />

              {/* PICKUP MARKER */}

              {routeData?.pickup && (

                <Marker
                  position={[
                    routeData.pickup
                      .latitude,

                    routeData.pickup
                      .longitude,
                  ]}
                  icon={
                    pickupIcon
                  }
                >

                  <Popup>

                    <strong>
                      📍 Pickup
                    </strong>

                    <br />

                    {
                      routeData
                        .pickup
                        .name
                    }

                    <br />

                    <small>
                      {
                        routeData
                          .pickup
                          .displayName
                      }
                    </small>

                  </Popup>

                </Marker>

              )}

              {/* DESTINATION MARKER */}

              {routeData?.destination && (

                <Marker
                  position={[
                    routeData
                      .destination
                      .latitude,

                    routeData
                      .destination
                      .longitude,
                  ]}
                  icon={
                    destinationIcon
                  }
                >

                  <Popup>

                    <strong>
                      🏢 Destination
                    </strong>

                    <br />

                    {
                      routeData
                        .destination
                        .name
                    }

                    <br />

                    <small>
                      {
                        routeData
                          .destination
                          .displayName
                    }
                    </small>

                  </Popup>

                </Marker>

              )}

              {/* ACTUAL ROUTE */}

              {routeCoordinates.length > 1 && (

                <Polyline
                  positions={
                    routeCoordinates
                  }

                  pathOptions={{
                    color:
                      "#1976ff",

                    weight:
                      6,

                    opacity:
                      0.9,
                  }}
                />

              )}

            </MapContainer>

          </div>

        </section>

        {/* ====================================================
            ROUTE INFORMATION
        ==================================================== */}

        {routeData && (

          <section
            style={{
              background:
                "#ffffff",

              borderRadius:
                "14px",

              padding:
                "28px",

              boxShadow:
                "0 2px 12px rgba(0,0,0,0.06)",

              border:
                "1px solid #edf0eb",
            }}
          >

            <div
              style={{
                fontSize:
                  "12px",

                color:
                  "#748076",

                letterSpacing:
                  "1px",

                fontWeight:
                  "700",
              }}
            >
              ROUTE RESULT
            </div>

            <h2
              style={{
                margin:
                  "7px 0 25px",

                fontSize:
                  "25px",

                color:
                  "#202820",
              }}
            >
              Recommended Food Rescue Route
            </h2>

            {/* LOCATIONS */}

            <div
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  "1fr 1fr",

                gap:
                  "18px",

                marginBottom:
                  "20px",
              }}
            >

              {/* PICKUP */}

              <div
                style={{
                  background:
                    "#fff7f7",

                  border:
                    "1px solid #fecaca",

                  borderRadius:
                    "10px",

                  padding:
                    "20px",
                }}
              >

                <div
                  style={{
                    fontSize:
                      "12px",

                    color:
                      "#991b1b",

                    fontWeight:
                      "700",

                    marginBottom:
                      "7px",
                  }}
                >
                  📍 PICKUP
                </div>

                <div
                  style={{
                    fontSize:
                      "18px",

                    fontWeight:
                      "700",

                    color:
                      "#1f2937",
                  }}
                >
                  {
                    routeData
                      .pickup
                      .name
                  }
                </div>

                <div
                  style={{
                    marginTop:
                      "7px",

                    fontSize:
                      "13px",

                    color:
                      "#6b7280",

                    lineHeight:
                      "1.5",
                  }}
                >
                  {
                    routeData
                      .pickup
                      .displayName
                  }
                </div>

              </div>

              {/* DESTINATION */}

              <div
                style={{
                  background:
                    "#f5f8ff",

                  border:
                    "1px solid #bfdbfe",

                  borderRadius:
                    "10px",

                  padding:
                    "20px",
                }}
              >

                <div
                  style={{
                    fontSize:
                      "12px",

                    color:
                      "#1d4ed8",

                    fontWeight:
                      "700",

                    marginBottom:
                      "7px",
                  }}
                >
                  🏢 DESTINATION
                </div>

                <div
                  style={{
                    fontSize:
                      "18px",

                    fontWeight:
                      "700",

                    color:
                      "#1f2937",
                  }}
                >
                  {
                    routeData
                      .destination
                      .name
                  }
                </div>

                <div
                  style={{
                    marginTop:
                      "7px",

                    fontSize:
                      "13px",

                    color:
                      "#6b7280",

                    lineHeight:
                      "1.5",
                  }}
                >
                  {
                    routeData
                      .destination
                      .displayName
                  }
                </div>

              </div>

            </div>

            {/* DISTANCE + TIME */}

            <div
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  "1fr 1fr",

                gap:
                  "18px",
              }}
            >

              {/* DISTANCE */}

              <div
                style={{
                  background:
                    "#f0fdf4",

                  border:
                    "1px solid #bbf7d0",

                  borderRadius:
                    "10px",

                  padding:
                    "22px",
                }}
              >

                <div
                  style={{
                    fontSize:
                      "13px",

                    fontWeight:
                      "700",

                    color:
                      "#166534",

                    marginBottom:
                      "8px",
                  }}
                >
                  📏 ROUTE DISTANCE
                </div>

                <div
                  style={{
                    fontSize:
                      "30px",

                    fontWeight:
                      "700",

                    color:
                      "#14532d",
                  }}
                >
                  {
                    routeData
                      .distance
                  }
                </div>

              </div>

              {/* TIME */}

              <div
                style={{
                  background:
                    "#eff6ff",

                  border:
                    "1px solid #bfdbfe",

                  borderRadius:
                    "10px",

                  padding:
                    "22px",
                }}
              >

                <div
                  style={{
                    fontSize:
                      "13px",

                    fontWeight:
                      "700",

                    color:
                      "#1d4ed8",

                    marginBottom:
                      "8px",
                  }}
                >
                  ⏱️ ESTIMATED TRAVEL TIME
                </div>

                <div
                  style={{
                    fontSize:
                      "30px",

                    fontWeight:
                      "700",

                    color:
                      "#1e40af",
                  }}
                >
                  {
                    routeData
                      .duration
                  }
                </div>

              </div>

            </div>

            {/* PURPOSE */}

            <div
              style={{
                marginTop:
                  "20px",

                padding:
                  "15px",

                background:
                  "#fafcf9",

                border:
                  "1px solid #e5e9e3",

                borderRadius:
                  "9px",

                color:
                  "#4b5563",

                fontSize:
                  "14px",
              }}
            >
              ♻️ <strong>
                Purpose:
              </strong>{" "}
              Food pickup and
              redistribution
            </div>

            {/* INFO */}

            <div
              style={{
                marginTop:
                  "18px",

                padding:
                  "12px 15px",

                background:
                  "#fffbeb",

                border:
                  "1px solid #fde68a",

                borderRadius:
                  "8px",

                fontSize:
                  "13px",

                color:
                  "#92400e",
              }}
            >
              ℹ️ Distance and estimated travel
              time are calculated from the actual
              OpenStreetMap/OSRM driving route.
            </div>

          </section>

        )}

        {/* ====================================================
            EMPTY STATE
        ==================================================== */}

        {!routeData && !loading && (

          <section
            style={{
              marginTop:
                "25px",

              background:
                "#ffffff",

              borderRadius:
                "14px",

              padding:
                "35px",

              textAlign:
                "center",

              border:
                "1px solid #edf0eb",
            }}
          >

            <div
              style={{
                fontSize:
                  "45px",

                marginBottom:
                  "10px",
              }}
            >
              🚚
            </div>

            <h2
              style={{
                margin:
                  "0 0 8px",

                color:
                  "#202820",
              }}
            >
              Ready to Plan a Route
            </h2>

            <p
              style={{
                margin:
                  "0",

                color:
                  "#7b837d",

                fontSize:
                  "14px",
              }}
            >
              Try locations such as ECIL,
              Habsiguda, Tarnaka, Uppal,
              Secunderabad, Malkajgiri,
              Kukatpally, Gachibowli,
              Madhapur or any other
              Hyderabad location.
            </p>

          </section>

        )}

      </main>

    </div>
  );
}

// ============================================================
// STYLES
// ============================================================

const navStyle = {
  textDecoration:
    "none",

  color:
    "#4b5563",

  fontSize:
    "14px",

  fontWeight:
    "500",
};

const labelStyle = {
  display:
    "block",

  marginBottom:
    "9px",

  fontSize:
    "14px",

  fontWeight:
    "700",

  color:
    "#303630",
};

const inputStyle = {
  width:
    "100%",

  boxSizing:
    "border-box",

  padding:
    "14px 15px",

  borderRadius:
    "8px",

  border:
    "1px solid #d1d5db",

  outline:
    "none",

  fontSize:
    "15px",

  color:
    "#374151",

  background:
    "#ffffff",
};