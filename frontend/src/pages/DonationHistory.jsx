import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function DonationHistory() {
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = () => {
    const saved = JSON.parse(
      localStorage.getItem("foodRescueDonations") || "[]"
    );

    setDonations(saved);
  };

  const filteredDonations =
    filter === "All"
      ? donations
      : donations.filter(
          (item) => item.status === filter
        );

  const totalMeals = donations.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0),
    0
  );

  const pending = donations.filter(
    (item) => item.status === "Pending"
  ).length;

  const completed = donations.filter(
    (item) =>
      item.status === "Delivered" ||
      item.status === "Completed"
  ).length;

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

        <div style={{ marginBottom: "28px" }}>
          <h1 className="page-title">
            📋 Donation History
          </h1>

          <p className="page-subtitle">
            View and track every food donation you have
            submitted.
          </p>
        </div>

        {/* SUMMARY */}

        <div
          className="grid grid-4"
          style={{ marginBottom: "28px" }}
        >
          <HistoryStat
            icon="🍱"
            label="Total Donations"
            value={donations.length}
          />

          <HistoryStat
            icon="🍽️"
            label="Total Meals"
            value={totalMeals}
          />

          <HistoryStat
            icon="⏳"
            label="Pending"
            value={pending}
          />

          <HistoryStat
            icon="✅"
            label="Completed"
            value={completed}
          />
        </div>

        {/* FILTER */}

        <div
          className="card"
          style={{
            padding: "18px 20px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <strong
              style={{
                color: "#172b1d",
              }}
            >
              All Donation Records
            </strong>

            <p
              style={{
                color: "#667085",
                fontSize: "12px",
                marginTop: "4px",
              }}
            >
              Previous donations are never removed
              from this history.
            </p>
          </div>

          <select
            className="form-select"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            style={{
              width: "190px",
            }}
          >
            <option value="All">
              All Donations
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Accepted">
              Accepted
            </option>

            <option value="Picked Up">
              Picked Up
            </option>

            <option value="Delivered">
              Delivered
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>
        </div>

        {/* DONATIONS */}

        {filteredDonations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              📋
            </div>

            <h3 className="empty-state-title">
              No Donations Found
            </h3>

            <p className="empty-state-text">
              Your donation records will appear here
              after you submit food.
            </p>
          </div>
        ) : (
          <div>
            {filteredDonations.map((donation) => (
              <HistoryCard
                key={donation.id}
                donation={donation}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/* =====================================================
   SUMMARY CARD
===================================================== */

function HistoryStat({
  icon,
  label,
  value,
}) {
  return (
    <div
      className="card"
      style={{
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "13px",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "11px",
          background: "#eaf7ee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            color: "#667085",
            fontSize: "12px",
            marginBottom: "4px",
          }}
        >
          {label}
        </div>

        <strong
          style={{
            color: "#172b1d",
            fontSize: "23px",
          }}
        >
          {value}
        </strong>
      </div>
    </div>
  );
}

/* =====================================================
   HISTORY CARD
===================================================== */

function HistoryCard({ donation }) {
  const status =
    donation.status || "Pending";

  let statusClass = "status-pending";

  let message =
    "Waiting for NGO acceptance.";

  if (status === "Accepted") {
    statusClass = "status-accepted";
    message =
      "NGO accepted the donation. Pickup will be scheduled.";
  }

  if (status === "Picked Up") {
    statusClass = "status-picked";
    message =
      "Food has been picked up successfully.";
  }

  if (
    status === "Delivered" ||
    status === "Completed"
  ) {
    statusClass = "status-delivered";
    message =
      "Food was successfully delivered to beneficiaries.";
  }

  return (
    <article
      className="card"
      style={{
        padding: "24px",
        marginBottom: "18px",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <div>
          <div
            style={{
              color: "#98a2b3",
              fontSize: "12px",
              marginBottom: "5px",
            }}
          >
            {donation.id}
          </div>

          <h2
            style={{
              color: "#172b1d",
              fontSize: "21px",
            }}
          >
            🍱 {donation.foodName}
          </h2>
        </div>

        <span
          className={`status-badge ${statusClass}`}
        >
          {status}
        </span>
      </div>

      {/* DETAILS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
          gap: "18px",
          padding: "18px 0",
          borderTop: "1px solid #eef1ef",
          borderBottom: "1px solid #eef1ef",
        }}
      >
        <Detail
          icon="🍽️"
          label="Quantity"
          value={`${donation.quantity} meals`}
        />

        <Detail
          icon="🥗"
          label="Food Type"
          value={
            donation.foodType ||
            "Cooked Food"
          }
        />

        <Detail
          icon="👤"
          label="Donor"
          value={donation.donorName}
        />

        <Detail
          icon="📍"
          label="Pickup Address"
          value={donation.pickupAddress}
        />

        <Detail
          icon="📅"
          label="Submitted"
          value={donation.date}
        />

        <Detail
          icon="🆔"
          label="Donation ID"
          value={donation.id}
        />
      </div>

      {/* STATUS */}

      <div
        style={{
          marginTop: "18px",
          padding: "14px 16px",
          background:
            status === "Delivered" ||
            status === "Completed"
              ? "#eaf7ee"
              : "#f8faf9",
          borderRadius: "10px",
          color:
            status === "Delivered" ||
            status === "Completed"
              ? "#176b36"
              : "#667085",
          fontSize: "13px",
          lineHeight: "1.5",
        }}
      >
        <strong>
          Current Status:
        </strong>{" "}
        {message}
      </div>
    </article>
  );
}

/* =====================================================
   DETAIL
===================================================== */

function Detail({
  icon,
  label,
  value,
}) {
  return (
    <div>
      <div
        style={{
          color: "#98a2b3",
          fontSize: "11px",
          marginBottom: "5px",
        }}
      >
        {icon} {label}
      </div>

      <div
        style={{
          color: "#344054",
          fontSize: "13px",
          fontWeight: "600",
          lineHeight: "1.5",
          wordBreak: "break-word",
        }}
      >
        {value || "Not available"}
      </div>
    </div>
  );
}

export default DonationHistory;