import { useState } from "react";
import Navbar from "../components/Navbar";

function RouteOptimization() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");

  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const generateRoute = (e) => {
    e.preventDefault();

    setMessage("");

    if (!pickup.trim() || !destination.trim()) {
      setMessage(
        "Please enter both pickup and destination locations."
      );
      return;
    }

    setLoading(true);

    /*
     * FRONTEND STAGE
     *
     * Later, Spring Boot will connect this page
     * to a real maps/routing service.
     *
     * We are NOT hard-coding a route here.
     */

    setTimeout(() => {
      setRoute({
        pickup: pickup.trim(),
        destination: destination.trim(),
        estimatedDistance: null,
        estimatedTime: null,
      });

      setLoading(false);
    }, 700);
  };

  const clearRoute = () => {
    setPickup("");
    setDestination("");
    setRoute(null);
    setMessage("");
  };

  return (
    <div className="page-container">
      <Navbar />

      <main
        className="content-container"
        style={{
          paddingTop: "30px",
          paddingBottom: "50px",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            marginBottom: "28px",
          }}
        >
          <h1 className="page-title">
            🚚 Route Planning
          </h1>

          <p className="page-subtitle">
            Plan efficient food pickup and redistribution
            routes between locations.
          </p>
        </div>

        {/* SEARCH FORM */}

        <section
          className="card"
          style={{
            padding: "28px",
            marginBottom: "25px",
          }}
        >
          <h2
            style={{
              color: "#172b1d",
              fontSize: "21px",
              marginBottom: "7px",
            }}
          >
            Plan a Food Rescue Route
          </h2>

          <p
            style={{
              color: "#667085",
              fontSize: "13px",
              lineHeight: "1.6",
              marginBottom: "22px",
            }}
          >
            Enter the pickup location and destination.
            The routing service will calculate the most
            suitable route when the backend is connected.
          </p>

          {/* MESSAGE */}

          {message && (
            <div className="alert alert-error">
              ⚠️ {message}
            </div>
          )}

          <form onSubmit={generateRoute}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "18px",
              }}
            >
              {/* PICKUP */}

              <div className="form-group">
                <label className="form-label">
                  Pickup Location *
                </label>

                <input
                  className="form-input"
                  type="text"
                  placeholder="Example: Tarnaka"
                  value={pickup}
                  onChange={(e) =>
                    setPickup(e.target.value)
                  }
                />
              </div>

              {/* DESTINATION */}

              <div className="form-group">
                <label className="form-label">
                  Destination *
                </label>

                <input
                  className="form-input"
                  type="text"
                  placeholder="Example: NGO / Distribution Center"
                  value={destination}
                  onChange={(e) =>
                    setDestination(
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "5px",
              }}
            >
              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading
                  ? "Calculating Route..."
                  : "🚚 Generate Route"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={clearRoute}
              >
                Clear
              </button>
            </div>
          </form>
        </section>

        {/* ROUTE RESULT */}

        {loading && (
          <div
            className="card"
            style={{
              padding: "45px",
              textAlign: "center",
            }}
          >
            <div
              className="loading-spinner"
              style={{
                margin: "0 auto 15px",
              }}
            />

            <h3
              style={{
                color: "#172b1d",
                marginBottom: "6px",
              }}
            >
              Calculating optimal route...
            </h3>

            <p
              style={{
                color: "#667085",
                fontSize: "13px",
              }}
            >
              Preparing the route between the selected
              locations.
            </p>
          </div>
        )}

        {!loading && route && (
          <section
            className="card"
            style={{
              padding: "28px",
            }}
          >
            {/* RESULT HEADER */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "15px",
                flexWrap: "wrap",
                marginBottom: "25px",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#98a2b3",
                    fontSize: "11px",
                    fontWeight: "700",
                    marginBottom: "7px",
                  }}
                >
                  ROUTE RESULT
                </div>

                <h2
                  style={{
                    color: "#172b1d",
                    fontSize: "22px",
                  }}
                >
                  Recommended Food Rescue Route
                </h2>
              </div>

              <span
                style={{
                  padding: "7px 12px",
                  borderRadius: "20px",
                  background: "#eaf7ee",
                  color: "#176b36",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                Route Ready
              </span>
            </div>

            {/* ROUTE VISUAL */}

            <div
              style={{
                padding: "25px",
                background: "#f8faf9",
                borderRadius: "14px",
                marginBottom: "22px",
              }}
            >
              <RoutePoint
                icon="📍"
                label="Pickup"
                value={route.pickup}
              />

              <div
                style={{
                  width: "2px",
                  height: "30px",
                  background: "#b8c8bd",
                  marginLeft: "14px",
                }}
              />

              <RoutePoint
                icon="🏢"
                label="Destination"
                value={route.destination}
              />
            </div>

            {/* ROUTE METRICS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, minmax(0, 1fr))",
                gap: "15px",
                marginBottom: "22px",
              }}
            >
              <RouteMetric
                icon="📍"
                label="Pickup"
                value={route.pickup}
              />

              <RouteMetric
                icon="🏢"
                label="Destination"
                value={route.destination}
              />

              <RouteMetric
                icon="♻️"
                label="Purpose"
                value="Food Redistribution"
              />
            </div>

            {/* MAP PLACEHOLDER */}

            <div
              style={{
                minHeight: "280px",
                borderRadius: "13px",
                background:
                  "linear-gradient(135deg, #eef5f0, #f8faf9)",
                border: "1px solid #e1e9e3",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "30px",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  marginBottom: "12px",
                }}
              >
                🗺️
              </div>

              <h3
                style={{
                  color: "#172b1d",
                  marginBottom: "7px",
                }}
              >
                Interactive Route Map
              </h3>

              <p
                style={{
                  color: "#667085",
                  fontSize: "13px",
                  maxWidth: "520px",
                  lineHeight: "1.6",
                }}
              >
                The live map, route line, distance,
                estimated travel time and optimized
                route will be connected during the
                backend integration stage.
              </p>
            </div>

            {/* NOTE */}

            <div
              style={{
                marginTop: "20px",
                padding: "13px 15px",
                borderRadius: "9px",
                background: "#fff8e6",
                color: "#8a6116",
                fontSize: "11px",
                lineHeight: "1.5",
              }}
            >
              ℹ️ No distance or travel-time values are
              being invented at the frontend stage.
              They will be calculated from the actual
              routing service later.
            </div>
          </section>
        )}

        {/* INITIAL STATE */}

        {!loading && !route && (
          <div
            className="empty-state"
          >
            <div className="empty-state-icon">
              🚚
            </div>

            <h3 className="empty-state-title">
              Ready to Plan a Route
            </h3>

            <p
              className="empty-state-text"
              style={{
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Enter a food pickup location and a
              destination above. The routing system will
              later calculate the actual route.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

/* =====================================================
   ROUTE POINT
===================================================== */

function RoutePoint({
  icon,
  label,
  value,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          background: "#ffffff",
          border: "1px solid #d9e2dc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            color: "#98a2b3",
            fontSize: "10px",
            fontWeight: "700",
            textTransform: "uppercase",
            marginBottom: "3px",
          }}
        >
          {label}
        </div>

        <strong
          style={{
            color: "#344054",
            fontSize: "13px",
          }}
        >
          {value}
        </strong>
      </div>
    </div>
  );
}

/* =====================================================
   ROUTE METRIC
===================================================== */

function RouteMetric({
  icon,
  label,
  value,
}) {
  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #eef1ef",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          fontSize: "19px",
          marginBottom: "7px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#98a2b3",
          fontSize: "10px",
          marginBottom: "4px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "#344054",
          fontSize: "12px",
          fontWeight: "700",
          lineHeight: "1.4",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default RouteOptimization;