import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    /*
     * Temporary frontend authentication.
     * We will replace this with Spring Boot authentication
     * when we rebuild the backend.
     */

    setTimeout(() => {
      const savedEmail = localStorage.getItem("userEmail");
      const savedPassword = localStorage.getItem("userPassword");
      const savedName = localStorage.getItem("userName");

      if (
        savedEmail &&
        savedPassword &&
        email.trim().toLowerCase() === savedEmail.toLowerCase() &&
        password === savedPassword
      ) {
        localStorage.setItem("isLoggedIn", "true");

        if (savedName) {
          localStorage.setItem("userName", savedName);
        }

        navigate("/dashboard");
      } else {
        setError(
          "Invalid email or password. Please check your details."
        );
      }

      setLoading(false);
    }, 600);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f5f7f6",
      }}
    >
      {/* LEFT BRAND PANEL */}

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "50px",
          background:
            "linear-gradient(145deg, #12572c, #176b36, #238548)",
          color: "white",
        }}
      >
        <div
          style={{
            maxWidth: "520px",
          }}
        >
          <div
            style={{
              fontSize: "55px",
              marginBottom: "20px",
            }}
          >
            🍱
          </div>

          <h1
            style={{
              fontSize: "46px",
              lineHeight: "1.1",
              marginBottom: "20px",
            }}
          >
            Welcome back to
            <span
              style={{
                display: "block",
              }}
            >
              FoodRescueAI
            </span>
          </h1>

          <p
            style={{
              fontSize: "17px",
              lineHeight: "1.7",
              opacity: 0.9,
            }}
          >
            Manage your food donations, discover nearby
            rescue organizations and use AI-powered
            insights to reduce food waste.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "30px",
            }}
          >
            <ImpactBadge
              icon="🍱"
              text="Food Donations"
            />

            <ImpactBadge
              icon="🤖"
              text="AI Insights"
            />

            <ImpactBadge
              icon="📍"
              text="NGO Discovery"
            />
          </div>
        </div>
      </div>

      {/* LOGIN PANEL */}

      <div
        style={{
          width: "480px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          background: "#ffffff",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "380px",
          }}
        >
          {/* HEADER */}

          <div
            style={{
              marginBottom: "30px",
            }}
          >
            <h2
              style={{
                fontSize: "30px",
                color: "#172b1d",
                marginBottom: "8px",
              }}
            >
              Sign in
            </h2>

            <p
              style={{
                color: "#667085",
                fontSize: "14px",
              }}
            >
              Access your FoodRescueAI account.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div
              className="alert alert-error"
              style={{
                marginBottom: "20px",
              }}
            >
              ❌ {error}
            </div>
          )}

          {/* FORM */}

          <form onSubmit={handleLogin}>
            {/* EMAIL */}

            <div className="form-group">
              <label className="form-label">
                Email Address
              </label>

              <input
                className="form-input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {/* PASSWORD */}

            <div className="form-group">
              <label className="form-label">
                Password
              </label>

              <input
                className="form-input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                marginTop: "8px",
                border: "none",
                borderRadius: "10px",
                background: loading
                  ? "#98b8a3"
                  : "#176b36",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "700",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* REGISTER */}

          <div
            style={{
              textAlign: "center",
              marginTop: "25px",
              color: "#667085",
              fontSize: "14px",
            }}
          >
            Don't have an account?{" "}

            <button
              onClick={() => navigate("/register")}
              style={{
                border: "none",
                background: "transparent",
                color: "#176b36",
                fontWeight: "700",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Create an account
            </button>
          </div>

          {/* BACK */}

          <button
            onClick={() => navigate("/")}
            style={{
              width: "100%",
              marginTop: "20px",
              padding: "10px",
              border: "none",
              background: "transparent",
              color: "#667085",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

function ImpactBadge({ icon, text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "9px 12px",
        borderRadius: "30px",
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.18)",
        fontSize: "13px",
      }}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

export default Login;