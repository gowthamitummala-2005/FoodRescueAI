import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function AIPrediction() {
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [eventType, setEventType] = useState("Regular Meal");

  const [predictions, setPredictions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = () => {
    const savedPredictions = JSON.parse(
      localStorage.getItem("foodRescuePredictions") || "[]"
    );

    setPredictions(savedPredictions);
  };

  const generatePrediction = (e) => {
    e.preventDefault();

    setMessage("");

    if (!foodName.trim() || !quantity) {
      setMessage(
        "Please enter the food name and quantity."
      );
      return;
    }

    if (Number(quantity) <= 0) {
      setMessage(
        "Quantity must be greater than zero."
      );
      return;
    }

    const qty = Number(quantity);

    /*
     * FRONTEND DEMO PREDICTION
     *
     * This will later be replaced by the
     * Spring Boot AI prediction service.
     */

    let wasteRisk = "Low";
    let wasteRiskPercentage = 25;
    let confidencePercentage = 82;
    let accuracyPercentage = 84;
    let recommendation =
      "Food can be redistributed normally.";
    let recommendedNgo =
      "Nearby food rescue organization";

    if (qty >= 100) {
      wasteRisk = "High";
      wasteRiskPercentage = 88;
      confidencePercentage = 94;
      accuracyPercentage = 91;

      recommendation =
        "Donate immediately to reduce the possibility of food waste.";

      recommendedNgo =
        "High-capacity nearby NGO";
    } else if (qty >= 50) {
      wasteRisk = "Medium";
      wasteRiskPercentage = 64;
      confidencePercentage = 89;
      accuracyPercentage = 87;

      recommendation =
        "Arrange donation within the next few hours.";

      recommendedNgo =
        "Nearby community food rescue NGO";
    } else {
      wasteRisk = "Low";
      wasteRiskPercentage = 28;
      confidencePercentage = 82;
      accuracyPercentage = 84;

      recommendation =
        "Food can be safely redistributed with normal planning.";

      recommendedNgo =
        "Nearby local food rescue NGO";
    }

    /*
     * EVENT TYPE ADJUSTMENT
     */

    if (
      eventType === "Wedding" ||
      eventType === "Large Event"
    ) {
      wasteRiskPercentage = Math.min(
        wasteRiskPercentage + 8,
        99
      );

      confidencePercentage = Math.min(
        confidencePercentage + 2,
        99
      );

      recommendation =
        "Large-event surplus detected. Prioritize rapid NGO pickup.";
    }

    if (eventType === "Restaurant") {
      wasteRiskPercentage = Math.min(
        wasteRiskPercentage + 5,
        99
      );
    }

    const newPrediction = {
      id: `AI${Date.now()}`,

      foodName: foodName.trim(),

      quantity: qty,

      eventType,

      wasteRisk,

      wasteRiskPercentage,

      confidencePercentage,

      accuracyPercentage,

      recommendedNgo,

      recommendation,

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
     * Add the new prediction to the old
     * predictions instead of replacing them.
     */

    const updatedPredictions = [
      newPrediction,
      ...predictions,
    ];

    localStorage.setItem(
      "foodRescuePredictions",
      JSON.stringify(updatedPredictions)
    );

    setPredictions(updatedPredictions);

    /*
     * Clear only the form.
     *
     * Previous reports remain visible.
     */

    setFoodName("");
    setQuantity("");
    setEventType("Regular Meal");

    setMessage(
      "AI prediction generated successfully!"
    );
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
            🤖 AI Food Waste Prediction
          </h1>

          <p className="page-subtitle">
            Analyze surplus food, estimate waste risk and
            receive intelligent donation recommendations.
          </p>
        </div>

        {/* SUMMARY */}

        <div
          className="grid grid-3"
          style={{
            marginBottom: "28px",
          }}
        >
          <SummaryCard
            icon="🤖"
            label="Total Predictions"
            value={predictions.length}
          />

          <SummaryCard
            icon="⚠️"
            label="High Risk Predictions"
            value={
              predictions.filter(
                (item) =>
                  item.wasteRisk === "High"
              ).length
            }
          />

          <SummaryCard
            icon="📈"
            label="Average Confidence"
            value={`${calculateAverageConfidence(
              predictions
            )}%`}
          />
        </div>

        {/* MESSAGE */}

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

        {/* FORM + INFORMATION */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(350px, 430px) minmax(0, 1fr)",
            gap: "25px",
            alignItems: "start",
          }}
        >
          {/* FORM */}

          <section
            className="card"
            style={{
              padding: "25px",
              position: "sticky",
              top: "95px",
            }}
          >
            <h2
              style={{
                color: "#172b1d",
                fontSize: "21px",
                marginBottom: "6px",
              }}
            >
              Generate New Prediction
            </h2>

            <p
              style={{
                color: "#667085",
                fontSize: "13px",
                lineHeight: "1.5",
                marginBottom: "22px",
              }}
            >
              Enter the food information to generate
              an AI-based waste-risk assessment.
            </p>

            <form onSubmit={generatePrediction}>
              {/* FOOD */}

              <div className="form-group">
                <label className="form-label">
                  Food Name *
                </label>

                <input
                  className="form-input"
                  type="text"
                  placeholder="Example: Biryani"
                  value={foodName}
                  onChange={(e) =>
                    setFoodName(e.target.value)
                  }
                />
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
                  placeholder="Example: 100"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(e.target.value)
                  }
                />
              </div>

              {/* EVENT */}

              <div className="form-group">
                <label className="form-label">
                  Event / Source
                </label>

                <select
                  className="form-select"
                  value={eventType}
                  onChange={(e) =>
                    setEventType(e.target.value)
                  }
                >
                  <option>
                    Regular Meal
                  </option>

                  <option>
                    Restaurant
                  </option>

                  <option>
                    Wedding
                  </option>

                  <option>
                    Birthday
                  </option>

                  <option>
                    Corporate Event
                  </option>

                  <option>
                    Large Event
                  </option>

                  <option>
                    Hotel
                  </option>
                </select>
              </div>

              {/* BUTTON */}

              <button
                type="submit"
                className="primary-button"
                style={{
                  width: "100%",
                  marginTop: "5px",
                }}
              >
                🤖 Generate AI Prediction
              </button>
            </form>
          </section>

          {/* PREVIOUS REPORTS */}

          <section>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div>
                <h2
                  style={{
                    color: "#172b1d",
                    fontSize: "22px",
                  }}
                >
                  AI Prediction Reports
                </h2>

                <p
                  style={{
                    color: "#667085",
                    fontSize: "13px",
                    marginTop: "4px",
                  }}
                >
                  All your previous predictions remain
                  visible here.
                </p>
              </div>
            </div>

            {predictions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  🤖
                </div>

                <h3 className="empty-state-title">
                  No Predictions Yet
                </h3>

                <p className="empty-state-text">
                  Enter your food details and generate
                  your first AI prediction.
                </p>
              </div>
            ) : (
              predictions.map((prediction) => (
                <PredictionReport
                  key={prediction.id}
                  prediction={prediction}
                />
              ))
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
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
        gap: "15px",
      }}
    >
      <div
        style={{
          width: "45px",
          height: "45px",
          borderRadius: "12px",
          background: "#eaf7ee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "21px",
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
            marginBottom: "4px",
          }}
        >
          {label}
        </div>

        <strong
          style={{
            color: "#172b1d",
            fontSize: "24px",
          }}
        >
          {value}
        </strong>
      </div>
    </div>
  );
}

/* =========================================================
   PREDICTION REPORT
========================================================= */

function PredictionReport({
  prediction,
}) {
  const risk =
    prediction.wasteRisk || "Low";

  let riskBackground = "#eaf7ee";
  let riskColor = "#176b36";

  if (risk === "Medium") {
    riskBackground = "#fff8e6";
    riskColor = "#9a6700";
  }

  if (risk === "High") {
    riskBackground = "#fff0f0";
    riskColor = "#b42318";
  }

  return (
    <article
      className="card"
      style={{
        padding: "25px",
        marginBottom: "20px",
      }}
    >
      {/* REPORT HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "15px",
          marginBottom: "22px",
          flexWrap: "wrap",
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
            Prediction ID: {prediction.id}
          </div>

          <h2
            style={{
              color: "#172b1d",
              fontSize: "21px",
            }}
          >
            🤖 {prediction.foodName}
          </h2>

          <p
            style={{
              color: "#667085",
              fontSize: "12px",
              marginTop: "5px",
            }}
          >
            {prediction.date} •{" "}
            {prediction.eventType}
          </p>
        </div>

        <div
          style={{
            padding: "9px 15px",
            borderRadius: "999px",
            background: riskBackground,
            color: riskColor,
            fontWeight: "800",
            fontSize: "13px",
          }}
        >
          {risk} Waste Risk
        </div>
      </div>

      {/* METRICS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, minmax(0, 1fr))",
          gap: "14px",
          marginBottom: "22px",
        }}
      >
        <Metric
          label="Waste Risk"
          value={`${prediction.wasteRiskPercentage}%`}
          icon="⚠️"
        />

        <Metric
          label="AI Confidence"
          value={`${prediction.confidencePercentage}%`}
          icon="🤖"
        />

        <Metric
          label="Estimated Accuracy"
          value={`${prediction.accuracyPercentage}%`}
          icon="🎯"
        />
      </div>

      {/* PROGRESS BARS */}

      <div
        style={{
          display: "grid",
          gap: "16px",
          marginBottom: "22px",
        }}
      >
        <ProgressBar
          label="Waste Risk"
          percentage={
            prediction.wasteRiskPercentage
          }
        />

        <ProgressBar
          label="AI Confidence"
          percentage={
            prediction.confidencePercentage
          }
        />

        <ProgressBar
          label="Estimated Accuracy"
          percentage={
            prediction.accuracyPercentage
          }
        />
      </div>

      {/* DETAILS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",
          gap: "14px",
          paddingTop: "18px",
          borderTop: "1px solid #eef1ef",
        }}
      >
        <InfoBox
          icon="🍽️"
          label="Quantity"
          value={`${prediction.quantity} meals`}
        />

        <InfoBox
          icon="🏢"
          label="Recommended NGO"
          value={prediction.recommendedNgo}
        />

        <InfoBox
          icon="💡"
          label="Recommendation"
          value={prediction.recommendation}
        />

        <InfoBox
          icon="📅"
          label="Prediction Date"
          value={prediction.date}
        />
      </div>

      {/* DISCLAIMER */}

      <div
        style={{
          marginTop: "20px",
          padding: "12px 14px",
          borderRadius: "9px",
          background: "#f8faf9",
          color: "#667085",
          fontSize: "11px",
          lineHeight: "1.5",
        }}
      >
        ℹ️ Prediction confidence and estimated
        accuracy are currently demonstration metrics.
        They will be calculated from the actual model
        evaluation after backend AI integration.
      </div>
    </article>
  );
}

/* =========================================================
   METRIC
========================================================= */

function Metric({
  label,
  value,
  icon,
}) {
  return (
    <div
      style={{
        padding: "15px",
        background: "#f8faf9",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          fontSize: "18px",
          marginBottom: "5px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#667085",
          fontSize: "11px",
          marginBottom: "3px",
        }}
      >
        {label}
      </div>

      <strong
        style={{
          color: "#172b1d",
          fontSize: "20px",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

/* =========================================================
   PROGRESS BAR
========================================================= */

function ProgressBar({
  label,
  percentage,
}) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "6px",
          fontSize: "12px",
        }}
      >
        <span
          style={{
            color: "#475467",
            fontWeight: "600",
          }}
        >
          {label}
        </span>

        <strong
          style={{
            color: "#176b36",
          }}
        >
          {percentage}%
        </strong>
      </div>

      <div
        style={{
          width: "100%",
          height: "8px",
          borderRadius: "20px",
          background: "#e7ebe8",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            borderRadius: "20px",
            background: "#176b36",
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({
  icon,
  label,
  value,
}) {
  return (
    <div
      style={{
        padding: "14px",
        borderRadius: "10px",
        background: "#ffffff",
        border: "1px solid #eef1ef",
      }}
    >
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
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* =========================================================
   AVERAGE CONFIDENCE
========================================================= */

function calculateAverageConfidence(
  predictions
) {
  if (!predictions.length) {
    return 0;
  }

  const total = predictions.reduce(
    (sum, item) =>
      sum +
      Number(
        item.confidencePercentage || 0
      ),
    0
  );

  return Math.round(
    total / predictions.length
  );
}

export default AIPrediction;