import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/routes`;

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

const defaultCenter = [17.385044, 78.486671];

function ChangeMapCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);

  return null;
}

function Ngo() {
  const [location, setLocation] = useState("");
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("ngoRecentSearches") || "[]"
      );
    } catch {
      return [];
    }
  });

  const validNgos = useMemo(() => {
    return ngos.filter(
      (ngo) =>
        ngo.latitude !== null &&
        ngo.longitude !== null &&
        ngo.latitude !== undefined &&
        ngo.longitude !== undefined &&
        !isNaN(Number(ngo.latitude)) &&
        !isNaN(Number(ngo.longitude))
    );
  }, [ngos]);

  const mapCenter =
    validNgos.length > 0
      ? [
          Number(validNgos[0].latitude),
          Number(validNgos[0].longitude)
        ]
      : defaultCenter;

  useEffect(() => {
    localStorage.setItem(
      "ngoRecentSearches",
      JSON.stringify(recentSearches)
    );
  }, [recentSearches]);

  const searchNgos = async (searchLocation = location) => {
    const value = searchLocation.trim();

    if (!value) {
      setError("Please enter a location.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ngos/nearby?location=${encodeURIComponent(
          value
        )}`
      );

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data = await response.json();

      setNgos(Array.isArray(data) ? data : []);

      setRecentSearches((old) => {
        const updated = [
          value,
          ...old.filter(
            (x) => x.toLowerCase() !== value.toLowerCase()
          )
        ];

        return updated.slice(0, 8);
      });
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load NGOs. Make sure Spring Boot is running on port 8080."
      );

      setNgos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchNgos();
  };

  const openDirections = (ngo) => {
    if (
      ngo.latitude === undefined ||
      ngo.longitude === undefined
    ) {
      return;
    }

    const url =
      `https://www.google.com/maps/dir/?api=1&destination=` +
      `${ngo.latitude},${ngo.longitude}`;

    window.open(url, "_blank");
  };

  return (
    <div className="ngo-page">

      <div className="ngo-header">
        <h1>NGO Finder</h1>

        <p>
          Find nearby NGOs and community organizations
          for any location in Hyderabad.
        </p>
      </div>

      {/* SEARCH */}

      <form
        className="search-box"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
          placeholder="Enter location e.g. Ecil, Uppal, Tarnaka..."
        />

        <button type="submit">
          {loading ? "Searching..." : "Search NGOs"}
        </button>
      </form>

      {/* ERROR */}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* RESULT */}

      {location && ngos.length > 0 && (
        <div className="summary">
          <h3>📍 {location}</h3>

          <p>
            {ngos.length} nearby organizations found
          </p>
        </div>
      )}

      {/* MAP */}

      {ngos.length > 0 && (
        <section className="map-section">

          <div className="section-header">
            <h2>NGOs Near You</h2>

            <span>
              {validNgos.length} locations
            </span>
          </div>

          <div className="map-wrapper">

            <MapContainer
              center={mapCenter}
              zoom={13}
              scrollWheelZoom={true}
              style={{
                width: "100%",
                height: "500px"
              }}
            >

              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <ChangeMapCenter
                position={mapCenter}
              />

              {validNgos.map((ngo, index) => {

                const position = [
                  Number(ngo.latitude),
                  Number(ngo.longitude)
                ];

                return (
                  <Marker
                    key={
                      ngo.placeId ||
                      `${ngo.latitude}-${ngo.longitude}-${index}`
                    }
                    position={position}
                  >

                    <Popup>

                      <div className="popup">

                        <h3>
                          {ngo.name ||
                            "Nearby Organization"}
                        </h3>

                        <p>
                          📍{" "}
                          {ngo.address ||
                            "Address available on map"}
                        </p>

                        <p>
                          📏{" "}
                          {ngo.distance !== undefined
                            ? `${ngo.distance} km`
                            : "Distance unavailable"}
                        </p>

                        <p>
                          📞{" "}
                          {ngo.phone ||
                            "Phone not available"}
                        </p>

                        {ngo.openingHours && (
                          <p>
                            🕒{" "}
                            {ngo.openingHours}
                          </p>
                        )}

                        <button
                          onClick={() =>
                            openDirections(ngo)
                          }
                        >
                          🗺️ Get Directions
                        </button>

                      </div>

                    </Popup>

                  </Marker>
                );
              })}

            </MapContainer>

          </div>

        </section>
      )}

      {/* NGO CARDS */}

      {ngos.length > 0 && (
        <section className="results">

          <div className="section-header">
            <h2>Nearby Organizations</h2>

            <span>
              {ngos.length} results
            </span>
          </div>

          <div className="ngo-grid">

            {ngos.map((ngo, index) => (

              <div
                className="ngo-card"
                key={
                  ngo.placeId ||
                  `${ngo.name}-${index}`
                }
              >

                <h3>
                  {ngo.name ||
                    "Nearby Organization"}
                </h3>

                <p>
                  📍{" "}
                  {ngo.address ||
                    "Address available on map"}
                </p>

                <p>
                  📏{" "}
                  {ngo.distance !== undefined
                    ? `${ngo.distance} km away`
                    : "Distance unavailable"}
                </p>

                <p>
                  📞{" "}
                  {ngo.phone ||
                    "Phone not available"}
                </p>

                {ngo.openingHours && (
                  <p>
                    🕒 {ngo.openingHours}
                  </p>
                )}

                <button
                  onClick={() =>
                    openDirections(ngo)
                  }
                >
                  🗺️ Directions
                </button>

              </div>

            ))}

          </div>

        </section>
      )}

      {/* RECENT SEARCHES */}

      {recentSearches.length > 0 && (
        <section className="recent">

          <h2>Recent NGO Searches</h2>

          <div>
            {recentSearches.map(
              (item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setLocation(item);
                    searchNgos(item);
                  }}
                >
                  📍 {item}
                </button>
              )
            )}
          </div>

        </section>
      )}

      <style>{`

        .ngo-page {
          min-height: 100vh;
          padding: 35px;
          background:
            linear-gradient(
              135deg,
              #f5f7ff,
              #ffffff,
              #f7f2ff
            );
          font-family: Arial, sans-serif;
          color: #1f2937;
        }

        .ngo-header,
        .search-box,
        .summary,
        .map-section,
        .results,
        .recent {
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
        }

        .ngo-header h1 {
          font-size: 38px;
          margin-bottom: 8px;
          background:
            linear-gradient(
              90deg,
              #667eea,
              #764ba2
            );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ngo-header p {
          color: #6b7280;
        }

        .search-box {
          display: flex;
          gap: 12px;
          margin-top: 25px;
        }

        .search-box input {
          flex: 1;
          height: 52px;
          border: 1px solid #d8ddec;
          border-radius: 12px;
          padding: 0 18px;
          font-size: 16px;
          outline: none;
        }

        .search-box button,
        .ngo-card button,
        .popup button {
          border: none;
          border-radius: 10px;
          padding: 12px 20px;
          background:
            linear-gradient(
              135deg,
              #667eea,
              #764ba2
            );
          color: white;
          font-weight: bold;
          cursor: pointer;
        }

        .summary {
          margin-top: 20px;
          padding: 20px;
          background: white;
          border-radius: 15px;
        }

        .summary h3 {
          margin: 0;
        }

        .summary p {
          color: #6b7280;
        }

        .error {
          max-width: 1400px;
          margin: 20px auto;
          padding: 15px;
          background: #fee2e2;
          color: #991b1b;
          border-radius: 10px;
        }

        .map-section,
        .results,
        .recent {
          margin-top: 30px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .section-header h2 {
          margin: 0;
        }

        .section-header span {
          color: #6b7280;
        }

        .map-wrapper {
          border-radius: 18px;
          overflow: hidden;
          box-shadow:
            0 10px 30px
            rgba(0,0,0,0.12);
          background: white;
        }

        .ngo-grid {
          display: grid;
          grid-template-columns:
            repeat(
              auto-fit,
              minmax(280px, 1fr)
            );
          gap: 18px;
        }

        .ngo-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow:
            0 6px 20px
            rgba(0,0,0,0.06);
        }

        .ngo-card h3 {
          margin-top: 0;
        }

        .ngo-card p {
          color: #6b7280;
          line-height: 1.5;
        }

        .popup {
          min-width: 220px;
        }

        .popup h3 {
          margin-top: 0;
        }

        .popup p {
          font-size: 13px;
        }

        .recent {
          padding-bottom: 50px;
        }

        .recent button {
          margin: 5px;
          padding: 10px 15px;
          border-radius: 20px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
        }

        @media(max-width:700px) {

          .ngo-page {
            padding: 20px;
          }

          .search-box {
            flex-direction: column;
          }

          .search-box button {
            height: 50px;
          }

        }

      `}</style>

    </div>
  );
}

export default Ngo;