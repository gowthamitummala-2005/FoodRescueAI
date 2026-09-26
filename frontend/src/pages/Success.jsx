import { useNavigate } from "react-router-dom";

function Success() {
  const navigate = useNavigate();

  const userName =
    localStorage.getItem("userName") || "User";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f4fbf6 0%, #ffffff 55%, #edf8f0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "25px",
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "520px",
          padding: "45px 35px",
          textAlign: "center",
        }}
      >
        {/* SUCCESS ICON */}

        <div
          style={{
            width: "82px",
            height: "82px",
            margin: "0 auto 22px",
            borderRadius: "50%",
            background: "#e8f7ed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "42px",
          }}
        >
          ✓
        </div>

        {/* TITLE */}

        <h1
          style={{
            color: "#176b36",
            fontSize: "30px",
            marginBottom: "10px",
          }}
        >
          Registration Successful!
        </h1>

        <p
          style={{
            color: "#667085",
            lineHeight: "1.7",
            marginBottom: "8px",
          }}
        >
          Welcome to FoodRescueAI,
        </p>

        <h2
          style={{
            color: "#172b1d",
            fontSize: "22px",
            marginBottom: "18px",
          }}
        >
          {userName} 👋
        </h2>

        <p
          style={{
            color: "#667085",
            lineHeight: "1.7",
            fontSize: "14px",
            maxWidth: "400px",
            margin: "0 auto 28px",
          }}
        >
          Your account has been created successfully.
          Sign in to access your dashboard and start
          managing food donations.
        </p>

        {/* ACCOUNT SUMMARY */}

        <div
          style={{
            background: "#f8faf9",
            borderRadius: "12px",
            padding: "18px",
            marginBottom: "25px",
            textAlign: "left",
          }}
        >
          <p
            style={{
              color: "#667085",
              fontSize: "13px",
              marginBottom: "5px",
            }}
          >
            Registered email
          </p>

          <strong
            style={{
              color: "#344054",
              wordBreak: "break-word",
            }}
          >
            {localStorage.getItem("userEmail") ||
              "Email registered"}
          </strong>
        </div>

        {/* LOGIN BUTTON */}

        <button
          onClick={() => navigate("/login")}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "10px",
            background: "#176b36",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Continue to Login →
        </button>

        {/* HOME */}

        <button
          onClick={() => navigate("/")}
          style={{
            width: "100%",
            marginTop: "12px",
            padding: "11px",
            border: "none",
            background: "transparent",
            color: "#667085",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default Success;