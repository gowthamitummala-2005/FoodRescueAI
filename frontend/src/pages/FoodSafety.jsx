import { useState } from "react";
import Navbar from "../components/Navbar";

function FoodSafety() {
  const [checks, setChecks] = useState({
    temperature: false,
    packaging: false,
    hygiene: false,
    expiry: false,
    contamination: false,
    storage: false,
  });

  const [message, setMessage] = useState("");

  const handleCheck = (name) => {
    setChecks((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));

    setMessage("");
  };

  const completedChecks =
    Object.values(checks).filter(Boolean).length;

  const totalChecks = Object.keys(checks).length;

  const safetyPercentage = Math.round(
    (completedChecks / totalChecks) * 100
  );

  const handleSaveAssessment = () => {
    if (completedChecks === 0) {
      setMessage(
        "Please complete at least one safety check."
      );
      return;
    }

    const assessment = {
      checks,
      safetyPercentage,
      date: new Date().toISOString(),
    };

    localStorage.setItem(
      "foodRescueSafetyAssessment",
      JSON.stringify(assessment)
    );

    setMessage(
      "Food safety assessment saved successfully."
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
            🛡️ Food Safety Assessment
          </h1>

          <p className="page-subtitle">
            Complete the safety checklist before
            submitting surplus food for redistribution.
          </p>
        </div>

        {/* SAFETY SCORE */}

        <section
          className="card"
          style={{
            padding: "25px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "25px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  color: "#98a2b3",
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                  marginBottom: "7px",
                }}
              >
                CURRENT SAFETY ASSESSMENT
              </div>

              <h2
                style={{
                  color: "#172b1d",
                  fontSize: "23px",
                  marginBottom: "6px",
                }}
              >
                Food Safety Score
              </h2>

              <p
                style={{
                  color: "#667085",
                  fontSize: "13px",
                }}
              >
                {completedChecks} of {totalChecks}{" "}
                checks completed
              </p>
            </div>

            {/* SCORE */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                minWidth: "240px",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "10px",
                  background: "#e7ebe8",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${safetyPercentage}%`,
                    height: "100%",
                    background:
                      safetyPercentage === 100
                        ? "#176b36"
                        : "#e8a317",
                    borderRadius: "20px",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>

              <strong
                style={{
                  color:
                    safetyPercentage === 100
                      ? "#176b36"
                      : "#8a6116",
                  fontSize: "22px",
                }}
              >
                {safetyPercentage}%
              </strong>
            </div>
          </div>
        </section>

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

        {/* MAIN CONTENT */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(350px, 1fr) minmax(280px, 360px)",
            gap: "25px",
            alignItems: "start",
          }}
        >
          {/* CHECKLIST */}

          <section
            className="card"
            style={{
              padding: "27px",
            }}
          >
            <h2
              style={{
                color: "#172b1d",
                fontSize: "21px",
                marginBottom: "6px",
              }}
            >
              Safety Checklist
            </h2>

            <p
              style={{
                color: "#667085",
                fontSize: "13px",
                lineHeight: "1.5",
                marginBottom: "22px",
              }}
            >
              Confirm each condition before donating
              prepared or surplus food.
            </p>

            <SafetyCheck
              checked={checks.temperature}
              onChange={() =>
                handleCheck("temperature")
              }
              icon="🌡️"
              title="Temperature Check"
              description="Food has been maintained at an appropriate temperature for safe handling."
            />

            <SafetyCheck
              checked={checks.packaging}
              onChange={() =>
                handleCheck("packaging")
              }
              icon="📦"
              title="Packaging Condition"
              description="Food containers or packaging are clean, intact and suitable for transport."
            />

            <SafetyCheck
              checked={checks.hygiene}
              onChange={() =>
                handleCheck("hygiene")
              }
              icon="🧼"
              title="Hygiene Check"
              description="Food has been handled using appropriate hygiene practices."
            />

            <SafetyCheck
              checked={checks.expiry}
              onChange={() =>
                handleCheck("expiry")
              }
              icon="📅"
              title="Expiry / Freshness Check"
              description="Food is within its usable period and is suitable for consumption."
            />

            <SafetyCheck
              checked={checks.contamination}
              onChange={() =>
                handleCheck("contamination")
              }
              icon="⚠️"
              title="Contamination Check"
              description="There are no visible signs of contamination, spoilage or unsafe food conditions."
            />

            <SafetyCheck
              checked={checks.storage}
              onChange={() =>
                handleCheck("storage")
              }
              icon="❄️"
              title="Storage Check"
              description="Food has been stored appropriately before pickup or redistribution."
            />

            <button
              className="primary-button"
              onClick={handleSaveAssessment}
              style={{
                width: "100%",
                marginTop: "20px",
              }}
            >
              Save Safety Assessment
            </button>
          </section>

          {/* GUIDELINES */}

          <section
            className="card"
            style={{
              padding: "25px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: "#eaf7ee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                marginBottom: "15px",
              }}
            >
              🛡️
            </div>

            <h2
              style={{
                color: "#172b1d",
                fontSize: "20px",
                marginBottom: "8px",
              }}
            >
              Safe Food Redistribution
            </h2>

            <p
              style={{
                color: "#667085",
                fontSize: "13px",
                lineHeight: "1.7",
                marginBottom: "20px",
              }}
            >
              Food intended for donation should be
              handled carefully from preparation and
              storage through pickup and redistribution.
            </p>

            <Guideline
              icon="🌡️"
              title="Temperature"
              text="Check that food has been stored and transported under appropriate conditions."
            />

            <Guideline
              icon="🧼"
              title="Hygiene"
              text="Use clean utensils, containers and appropriate food-handling practices."
            />

            <Guideline
              icon="📦"
              title="Packaging"
              text="Use clean and secure packaging that protects food during transportation."
            />

            <Guideline
              icon="👀"
              title="Food Condition"
              text="Do not redistribute food showing obvious spoilage, contamination or unsafe conditions."
            />

            <div
              style={{
                marginTop: "20px",
                padding: "13px",
                background: "#fff8e6",
                borderRadius: "9px",
                color: "#8a6116",
                fontSize: "11px",
                lineHeight: "1.5",
              }}
            >
              ⚠️ This checklist is a project-level
              screening tool and does not replace
              official food safety inspection or
              professional regulatory guidance.
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* =====================================================
   SAFETY CHECK
===================================================== */

function SafetyCheck({
  checked,
  onChange,
  icon,
  title,
  description,
}) {
  return (
    <label
      style={{
        display: "flex",
        gap: "14px",
        alignItems: "flex-start",
        padding: "17px",
        marginBottom: "12px",
        border: checked
          ? "1px solid #9ed3ad"
          : "1px solid #e7ebe8",
        background: checked
          ? "#f3fbf5"
          : "#ffffff",
        borderRadius: "11px",
        cursor: "pointer",
        transition: "0.2s ease",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          width: "18px",
          height: "18px",
          marginTop: "2px",
          accentColor: "#176b36",
          cursor: "pointer",
          flexShrink: 0,
        }}
      />

      <div
        style={{
          fontSize: "22px",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      <div>
        <strong
          style={{
            display: "block",
            color: "#172b1d",
            fontSize: "14px",
            marginBottom: "5px",
          }}
        >
          {title}
        </strong>

        <span
          style={{
            display: "block",
            color: "#667085",
            fontSize: "12px",
            lineHeight: "1.5",
          }}
        >
          {description}
        </span>
      </div>

      {checked && (
        <span
          style={{
            marginLeft: "auto",
            color: "#176b36",
            fontWeight: "800",
          }}
        >
          ✓
        </span>
      )}
    </label>
  );
}

/* =====================================================
   GUIDELINE
===================================================== */

function Guideline({
  icon,
  title,
  text,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "11px",
        marginBottom: "17px",
      }}
    >
      <span
        style={{
          fontSize: "18px",
          flexShrink: 0,
        }}
      >
        {icon}
      </span>

      <div>
        <strong
          style={{
            display: "block",
            color: "#344054",
            fontSize: "13px",
            marginBottom: "3px",
          }}
        >
          {title}
        </strong>

        <p
          style={{
            color: "#667085",
            fontSize: "12px",
            lineHeight: "1.5",
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

export default FoodSafety;