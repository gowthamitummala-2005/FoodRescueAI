import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";

function Dashboard() {
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [predictions, setPredictions] = useState([]);

  const userName =
    localStorage.getItem("userName") || "User";

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    /*
     * Temporary frontend storage.
     *
     * Later these values will come from Spring Boot
     * APIs and H2 database.
     */

    const savedDonations = JSON.parse(
      localStorage.getItem("foodRescueDonations") || "[]"
    );

    const savedPredictions = JSON.parse(
      localStorage.getItem("foodRescuePredictions") || "[]"
    );

    setDonations(savedDonations);
    setPredictions(savedPredictions);
  };

  const pendingDonations = donations.filter(
    (item) => item.status === "Pending"
  ).length;

  const completedDonations = donations.filter(
    (item) =>
      item.status === "Delivered" ||
      item.status === "Completed"
  ).length;

  const totalMeals = donations.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  return (
    <div className="page-container">
      <Navbar />

      <div
        style={{
          display: "flex",
          minHeight: "calc(100vh - 72px)",
        }}
      >
        {/* SIDEBAR */}

        <DashboardSidebar navigate={navigate} />

        {/* MAIN CONTENT */}

        <main
          style={{
            flex: 1,
            padding: "32px",
            overflow: "hidden",
          }}
        >
          {/* HEADER */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "20px",
              marginBottom: "30px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                style={{
                  color: "#667085",
                  fontSize: "14px",
                  marginBottom: "7px",
                }}
              >
                Food Rescue Overview
              </p>

              <h1 className="page-title">
                Welcome, {userName} 👋
              </h1>

              <p className="page-subtitle">
                Monitor your food donations, AI insights
                and redistribution activities.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => navigate("/donate-food")}
            >
              + Donate Food
            </button>
          </div>

          {/* STATISTICS */}

          <div
            className="grid grid-4"
            style={{
              marginBottom: "30px",
            }}
          >
            <StatCard
              icon="🍱"
              title="Total Donations"
              value={donations.length}
              description="Food donation records"
            />

            <StatCard
              icon="❤️"
              title="Meals Recorded"
              value={totalMeals}
              description="Total donated quantity"
            />

            <StatCard
              icon="⏳"
              title="Pending"
              value={pendingDonations}
              description="Awaiting action"
            />

            <StatCard
              icon="✅"
              title="Completed"
              value={completedDonations}
              description="Successfully delivered"
            />
          </div>

          {/* QUICK ACTIONS */}

          <section
            className="card"
            style={{
              padding: "25px",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  color: "#172b1d",
                  fontSize: "21px",
                  marginBottom: "5px",
                }}
              >
                Quick Actions
              </h2>

              <p
                style={{
                  color: "#667085",
                  fontSize: "14px",
                }}
              >
                Access the most frequently used FoodRescueAI
                features.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(4, minmax(0, 1fr))",
                gap: "15px",
              }}
            >
              <QuickAction
                icon="🍱"
                title="Donate Food"
                description="Submit surplus food"
                onClick={() => navigate("/donate-food")}
              />

              <QuickAction
                icon="🤖"
                title="AI Prediction"
                description="Analyze food waste risk"
                onClick={() =>
                  navigate("/ai-prediction")
                }
              />

              <QuickAction
                icon="📍"
                title="Find NGOs"
                description="Discover nearby organizations"
                onClick={() => navigate("/ngo")}
              />

              <QuickAction
                icon="📜"
                title="Donation History"
                description="View your activity"
                onClick={() =>
                  navigate("/donations")
                }
              />
            </div>
          </section>

          {/* TWO COLUMN SECTION */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1.2fr 0.8fr",
              gap: "25px",
            }}
          >
            {/* RECENT DONATIONS */}

            <section
              className="card"
              style={{
                padding: "25px",
              }}
            >
              <SectionHeader
                title="Recent Donations"
                action="View All"
                onClick={() =>
                  navigate("/donations")
                }
              />

              {donations.length === 0 ? (
                <EmptySection
                  icon="🍱"
                  title="No donations yet"
                  text="Your food donations will appear here."
                  buttonText="Donate Food"
                  onClick={() =>
                    navigate("/donate-food")
                  }
                />
              ) : (
                <div>
                  {donations
                    .slice(0, 5)
                    .map((donation) => (
                      <DonationRow
                        key={
                          donation.id ||
                          donation.donationId
                        }
                        donation={donation}
                      />
                    ))}
                </div>
              )}
            </section>

            {/* AI INSIGHTS */}

            <section
              className="card"
              style={{
                padding: "25px",
              }}
            >
              <SectionHeader
                title="AI Insights"
                action="Open AI"
                onClick={() =>
                  navigate("/ai-prediction")
                }
              />

              {predictions.length === 0 ? (
                <EmptySection
                  icon="🤖"
                  title="No predictions yet"
                  text="Generate an AI prediction to see insights."
                  buttonText="Generate Prediction"
                  onClick={() =>
                    navigate("/ai-prediction")
                  }
                />
              ) : (
                <div>
                  {predictions
                    .slice(0, 4)
                    .map((prediction) => (
                      <PredictionRow
                        key={
                          prediction.id ||
                          prediction.predictionId
                        }
                        prediction={prediction}
                      />
                    ))}
                </div>
              )}
            </section>
          </div>

          {/* SYSTEM MODULES */}

          <section
            style={{
              marginTop: "30px",
            }}
          >
            <div
              style={{
                marginBottom: "18px",
              }}
            >
              <h2
                style={{
                  color: "#172b1d",
                  fontSize: "21px",
                }}
              >
                FoodRescueAI Modules
              </h2>
            </div>

            <div
              className="grid grid-3"
            >
              <ModuleCard
                icon="🪪"
                title="FSSAI License"
                description="Manage food business licensing and compliance information."
                button="Open Module"
                onClick={() =>
                  navigate("/fssai-license")
                }
              />

              <ModuleCard
                icon="🛡️"
                title="Food Safety"
                description="Review food handling and redistribution safety checks."
                button="Check Safety"
                onClick={() =>
                  navigate("/food-safety")
                }
              />

              <ModuleCard
                icon="🚚"
                title="Route Planning"
                description="Plan efficient pickup and redistribution routes."
                button="Plan Route"
                onClick={() =>
                  navigate("/route")
                }
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function DashboardSidebar({ navigate }) {
  const menu = [
    {
      icon: "🏠",
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: "🍱",
      label: "Donate Food",
      path: "/donate-food",
    },
    {
      icon: "🤖",
      label: "AI Prediction",
      path: "/ai-prediction",
    },
    {
      icon: "📍",
      label: "Nearby NGOs",
      path: "/ngo",
    },
    {
      icon: "📜",
      label: "Donation History",
      path: "/donations",
    },
    {
      icon: "🪪",
      label: "FSSAI License",
      path: "/fssai-license",
    },
    {
      icon: "🛡️",
      label: "Food Safety",
      path: "/food-safety",
    },
    {
      icon: "🚚",
      label: "Route Planning",
      path: "/route",
    },
    {
      icon: "👤",
      label: "Profile",
      path: "/profile",
    },
  ];

  return (
    <aside
      style={{
        width: "235px",
        background: "#123d24",
        padding: "25px 13px",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          color: "#a9d5b6",
          fontSize: "11px",
          fontWeight: "800",
          letterSpacing: "1px",
          padding: "0 13px 14px",
        }}
      >
        APPLICATION
      </div>

      {menu.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 13px",
            marginBottom: "5px",
            border: "none",
            borderRadius: "9px",
            background:
              item.path === "/dashboard"
                ? "#237a42"
                : "transparent",
            color: "white",
            textAlign: "left",
            fontWeight:
              item.path === "/dashboard"
                ? "700"
                : "500",
            cursor: "pointer",
          }}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </aside>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        border: "1px solid #e7ebe8",
        background: "#ffffff",
        borderRadius: "12px",
        padding: "18px",
        textAlign: "left",
        transition: "0.2s ease",
      }}
    >
      <div
        style={{
          fontSize: "25px",
          marginBottom: "10px",
        }}
      >
        {icon}
      </div>

      <strong
        style={{
          display: "block",
          color: "#172b1d",
          marginBottom: "5px",
        }}
      >
        {title}
      </strong>

      <span
        style={{
          color: "#667085",
          fontSize: "12px",
        }}
      >
        {description}
      </span>
    </button>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  title,
  action,
  onClick,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "18px",
      }}
    >
      <h2
        style={{
          color: "#172b1d",
          fontSize: "19px",
        }}
      >
        {title}
      </h2>

      <button
        onClick={onClick}
        style={{
          border: "none",
          background: "transparent",
          color: "#176b36",
          fontSize: "13px",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        {action} →
      </button>
    </div>
  );
}

/* =========================================================
   DONATION ROW
========================================================= */

function DonationRow({ donation }) {
  const status = donation.status || "Pending";

  let statusClass = "status-pending";

  if (status === "Accepted") {
    statusClass = "status-accepted";
  }

  if (status === "Picked Up") {
    statusClass = "status-picked";
  }

  if (
    status === "Delivered" ||
    status === "Completed"
  ) {
    statusClass = "status-delivered";
  }

  return (
    <div
      style={{
        padding: "14px 0",
        borderBottom: "1px solid #eef1ef",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "15px",
      }}
    >
      <div>
        <strong
          style={{
            display: "block",
            color: "#172b1d",
            marginBottom: "5px",
          }}
        >
          🍱 {donation.foodName || "Food Donation"}
        </strong>

        <span
          style={{
            color: "#667085",
            fontSize: "12px",
          }}
        >
          {donation.quantity || 0} meals
        </span>
      </div>

      <span
        className={`status-badge ${statusClass}`}
      >
        {status}
      </span>
    </div>
  );
}

/* =========================================================
   PREDICTION ROW
========================================================= */

function PredictionRow({ prediction }) {
  const risk =
    prediction.wasteRisk || "Unknown";

  let background = "#f8faf9";
  let color = "#667085";

  if (risk === "High") {
    background = "#fff0f0";
    color = "#b42318";
  }

  if (risk === "Medium") {
    background = "#fff8e6";
    color = "#8a6116";
  }

  if (risk === "Low") {
    background = "#eaf7ee";
    color = "#176b36";
  }

  return (
    <div
      style={{
        padding: "14px",
        marginBottom: "10px",
        borderRadius: "10px",
        background,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <strong>{prediction.foodName}</strong>

        <strong style={{ color }}>
          {risk}
        </strong>
      </div>

      <p
        style={{
          color: "#667085",
          fontSize: "12px",
          marginTop: "5px",
        }}
      >
        {prediction.recommendation ||
          "Review prediction details"}
      </p>
    </div>
  );
}

/* =========================================================
   EMPTY SECTION
========================================================= */

function EmptySection({
  icon,
  title,
  text,
  buttonText,
  onClick,
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "35px 15px",
      }}
    >
      <div
        style={{
          fontSize: "35px",
          marginBottom: "10px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          color: "#172b1d",
          marginBottom: "7px",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#667085",
          fontSize: "13px",
          marginBottom: "16px",
        }}
      >
        {text}
      </p>

      <button
        className="primary-button"
        onClick={onClick}
      >
        {buttonText}
      </button>
    </div>
  );
}

/* =========================================================
   MODULE CARD
========================================================= */

function ModuleCard({
  icon,
  title,
  description,
  button,
  onClick,
}) {
  return (
    <div
      className="card"
      style={{
        padding: "23px",
      }}
    >
      <div
        style={{
          fontSize: "28px",
          marginBottom: "12px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          color: "#172b1d",
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#667085",
          fontSize: "13px",
          lineHeight: "1.6",
          minHeight: "42px",
          marginBottom: "18px",
        }}
      >
        {description}
      </p>

      <button
        className="secondary-button"
        onClick={onClick}
      >
        {button}
      </button>
    </div>
  );
}

export default Dashboard;