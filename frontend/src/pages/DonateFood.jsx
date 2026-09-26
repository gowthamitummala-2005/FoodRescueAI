import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function DonateFood() {
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [foodType, setFoodType] = useState("Cooked Food");

  const [donations, setDonations] = useState([]);
  const [message, setMessage] = useState("");

  const userName =
    localStorage.getItem("userName") || "User";

  /* =====================================================
     LOAD PREVIOUS DONATIONS
  ===================================================== */

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = () => {
    const savedDonations = JSON.parse(
      localStorage.getItem("foodRescueDonations") || "[]"
    );

    setDonations(savedDonations);
  };

  /* =====================================================
     DONATE FOOD
  ===================================================== */

  const handleDonate = (e) => {
    e.preventDefault();

    setMessage("");

    if (
      !foodName.trim() ||
      !quantity ||
      !pickupAddress.trim()
    ) {
      setMessage(
        "Please fill in all the required details."
      );
      return;
    }

    if (Number(quantity) <= 0) {
      setMessage(
        "Quantity must be greater than zero."
      );
      return;
    }

    const newDonation = {
      id: `FD${Date.now()}`,

      foodName: foodName.trim(),

      quantity: Number(quantity),

      pickupAddress: pickupAddress.trim(),

      foodType,

      donorName: userName,

      status: "Pending",

      date: new Date().toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ),

      createdAt: new Date().toISOString(),
    };

    /*
     * IMPORTANT:
     *
     * We are adding the new donation to the
     * EXISTING array.
     *
     * We are NOT replacing the previous donations.
     */

    const updatedDonations = [
      newDonation,
      ...donations,
    ];

    localStorage.setItem(
      "foodRescueDonations",
      JSON.stringify(updatedDonations)
    );

    setDonations(updatedDonations);

    /*
     * Clear only the form.
     *
     * The donation remains visible below.
     */

    setFoodName("");
    setQuantity("");
    setPickupAddress("");
    setFoodType("Cooked Food");

    setMessage(
      "Donation submitted successfully!"
    );
  };

  /* =====================================================
     STATUS COUNTS
  ===================================================== */

  const pendingCount = donations.filter(
    (item) => item.status === "Pending"
  ).length;

  const acceptedCount = donations.filter(
    (item) => item.status === "Accepted"
  ).length;

  const pickedUpCount = donations.filter(
    (item) => item.status === "Picked Up"
  ).length;

  const completedCount = donations.filter(
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
        {/* PAGE HEADER */}

        <div
          style={{
            marginBottom: "28px",
          }}
        >
          <h1 className="page-title">
            🍱 Donate Surplus Food
          </h1>

          <p className="page-subtitle">
            Submit surplus food for redistribution and
            track every donation from this page.
          </p>
        </div>

        {/* STATUS SUMMARY */}

        <div
          className="grid grid-4"
          style={{
            marginBottom: "28px",
          }}
        >
          <MiniStatusCard
            icon="⏳"
            label="Pending"
            value={pendingCount}
          />

          <MiniStatusCard
            icon="🤝"
            label="Accepted"
            value={acceptedCount}
          />

          <MiniStatusCard
            icon="🚚"
            label="Picked Up"
            value={pickedUpCount}
          />

          <MiniStatusCard
            icon="✅"
            label="Completed"
            value={completedCount}
          />
        </div>

        {/* SUCCESS / ERROR MESSAGE */}

        {message && (
          <div
            className={
              message.includes("successfully")
                ? "alert alert-success"
                : "alert alert-error"
            }
          >
            {message.includes("successfully")
              ? "✅ "
              : "⚠️ "}
            {message}
          </div>
        )}

        {/* MAIN TWO-COLUMN AREA */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(350px, 420px) minmax(0, 1fr)",
            gap: "25px",
            alignItems: "start",
          }}
        >
          {/* ============================================
              DONATION FORM
          ============================================= */}

          <section
            className="card"
            style={{
              padding: "25px",
              position: "sticky",
              top: "95px",
            }}
          >
            <div
              style={{
                marginBottom: "22px",
              }}
            >
              <h2
                style={{
                  color: "#172b1d",
                  fontSize: "21px",
                  marginBottom: "6px",
                }}
              >
                New Donation
              </h2>

              <p
                style={{
                  color: "#667085",
                  fontSize: "13px",
                  lineHeight: "1.5",
                }}
              >
                Enter the details of the surplus food
                you want to donate.
              </p>
            </div>

            <form onSubmit={handleDonate}>
              {/* FOOD NAME */}

              <div className="form-group">
                <label className="form-label">
                  Food Name *
                </label>

                <input
                  className="form-input"
                  type="text"
                  placeholder="Example: Vegetable Biryani"
                  value={foodName}
                  onChange={(e) =>
                    setFoodName(e.target.value)
                  }
                />
              </div>

              {/* FOOD TYPE */}

              <div className="form-group">
                <label className="form-label">
                  Food Type
                </label>

                <select
                  className="form-select"
                  value={foodType}
                  onChange={(e) =>
                    setFoodType(e.target.value)
                  }
                >
                  <option>
                    Cooked Food
                  </option>

                  <option>
                    Packaged Food
                  </option>

                  <option>
                    Bakery Items
                  </option>

                  <option>
                    Fruits & Vegetables
                  </option>

                  <option>
                    Rice & Grains
                  </option>

                  <option>
                    Other
                  </option>
                </select>
              </div>

              {/* QUANTITY */}

              <div className="form-group">
                <label className="form-label">
                  Quantity / Meals *
                </label>

                <input
                  className="form-input"
                  type="number"
                  min="1"
                  placeholder="Example: 50"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(e.target.value)
                  }
                />
              </div>

              {/* ADDRESS */}

              <div className="form-group">
                <label className="form-label">
                  Pickup Address *
                </label>

                <textarea
                  className="form-textarea"
                  placeholder="Enter the location from where the food can be collected"
                  value={pickupAddress}
                  onChange={(e) =>
                    setPickupAddress(e.target.value)
                  }
                />
              </div>

              {/* USER */}

              <div
                style={{
                  padding: "13px",
                  background: "#f8faf9",
                  borderRadius: "9px",
                  marginBottom: "18px",
                  fontSize: "13px",
                }}
              >
                <span
                  style={{
                    color: "#667085",
                  }}
                >
                  Donor
                </span>

                <strong
                  style={{
                    display: "block",
                    color: "#344054",
                    marginTop: "3px",
                  }}
                >
                  {userName}
                </strong>
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="primary-button"
                style={{
                  width: "100%",
                }}
              >
                Submit Food Donation
              </button>
            </form>
          </section>

          {/* ============================================
              ALL DONATIONS
          ============================================= */}

          <section>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
                gap: "15px",
              }}
            >
              <div>
                <h2
                  style={{
                    color: "#172b1d",
                    fontSize: "22px",
                  }}
                >
                  My Donations
                </h2>

                <p
                  style={{
                    color: "#667085",
                    fontSize: "13px",
                    marginTop: "4px",
                  }}
                >
                  {donations.length} donation
                  {donations.length !== 1
                    ? "s"
                    : ""}{" "}
                  recorded
                </p>
              </div>
            </div>

            {donations.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  🍱
                </div>

                <h3 className="empty-state-title">
                  No Donations Yet
                </h3>

                <p className="empty-state-text">
                  Submit your first food donation using
                  the form. It will remain visible here
                  after submission.
                </p>
              </div>
            ) : (
              <div>
                {donations.map((donation) => (
                  <DonationCard
                    key={donation.id}
                    donation={donation}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   MINI STATUS CARD
========================================================= */

function MiniStatusCard({
  icon,
  label,
  value,
}) {
  return (
    <div
      className="card"
      style={{
        padding: "17px",
        display: "flex",
        alignItems: "center",
        gap: "13px",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: "#eaf7ee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "19px",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            color: "#667085",
            fontSize: "12px",
            marginBottom: "3px",
          }}
        >
          {label}
        </div>

        <strong
          style={{
            color: "#172b1d",
            fontSize: "21px",
          }}
        >
          {value}
        </strong>
      </div>
    </div>
  );
}

/* =========================================================
   DONATION CARD
========================================================= */

function DonationCard({ donation }) {
  const status =
    donation.status || "Pending";

  let statusClass = "status-pending";

  let statusMessage =
    "Waiting for NGO acceptance.";

  if (status === "Accepted") {
    statusClass = "status-accepted";
    statusMessage =
      "NGO accepted the donation. Pickup will be scheduled.";
  }

  if (status === "Picked Up") {
    statusClass = "status-picked";
    statusMessage =
      "The donated food has been picked up.";
  }

  if (
    status === "Delivered" ||
    status === "Completed"
  ) {
    statusClass = "status-delivered";
    statusMessage =
      "Food successfully delivered to beneficiaries.";
  }

  return (
    <article
      className="card"
      style={{
        padding: "22px",
        marginBottom: "18px",
      }}
    >
      {/* CARD HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "15px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <div
            style={{
              color: "#667085",
              fontSize: "12px",
              marginBottom: "5px",
            }}
          >
            {donation.id}
          </div>

          <h3
            style={{
              color: "#172b1d",
              fontSize: "20px",
            }}
          >
            🍱 {donation.foodName}
          </h3>
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
            "repeat(2, minmax(0, 1fr))",
          gap: "14px",
          paddingTop: "16px",
          borderTop: "1px solid #eef1ef",
        }}
      >
        <Detail
          label="Quantity"
          value={`${donation.quantity} meals`}
          icon="🍽️"
        />

        <Detail
          label="Food Type"
          value={
            donation.foodType ||
            "Cooked Food"
          }
          icon="🥗"
        />

        <Detail
          label="Pickup Address"
          value={donation.pickupAddress}
          icon="📍"
        />

        <Detail
          label="Donor"
          value={donation.donorName}
          icon="👤"
        />

        <Detail
          label="Submitted"
          value={donation.date}
          icon="📅"
        />

        <Detail
          label="Donation ID"
          value={donation.id}
          icon="🆔"
        />
      </div>

      {/* STATUS INFORMATION */}

      <div
        style={{
          marginTop: "18px",
          padding: "13px 15px",
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
        {statusMessage}
      </div>
    </article>
  );
}

/* =========================================================
   DETAIL
========================================================= */

function Detail({
  label,
  value,
  icon,
}) {
  return (
    <div
      style={{
        minWidth: 0,
      }}
    >
      <div
        style={{
          color: "#98a2b3",
          fontSize: "11px",
          marginBottom: "4px",
        }}
      >
        {icon} {label}
      </div>

      <div
        style={{
          color: "#344054",
          fontSize: "13px",
          fontWeight: "600",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default DonateFood;