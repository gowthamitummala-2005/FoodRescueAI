import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Donor",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setError("");

    const {
      name,
      email,
      phone,
      role,
      password,
      confirmPassword,
    } = formData;

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !role.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Please fill in all the required details.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    /*
     * Temporary frontend registration.
     *
     * During the backend phase, this will be replaced
     * with a Spring Boot registration API.
     */

    setTimeout(() => {
      localStorage.setItem("userName", name.trim());
      localStorage.setItem(
        "userEmail",
        email.trim().toLowerCase()
      );
      localStorage.setItem("userPhone", phone.trim());
      localStorage.setItem("userRole", role);
      localStorage.setItem("userPassword", password);

      localStorage.removeItem("isLoggedIn");

      setLoading(false);

      navigate("/success");
    }, 600);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f4fbf6 0%, #ffffff 55%, #edf8f0 100%)",
        padding: "35px 20px",
      }}
    >
      {/* TOP BRAND */}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto 25px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            border: "none",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#176b36",
            fontWeight: "800",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "#176b36",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            🍱
          </span>

          FoodRescueAI
        </button>

        <button
          onClick={() => navigate("/login")}
          style={{
            border: "none",
            background: "transparent",
            color: "#176b36",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Already registered? Sign in
        </button>
      </div>

      {/* REGISTER CARD */}

      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "#ffffff",
          border: "1px solid #e7ebe8",
          borderRadius: "18px",
          padding: "35px",
          boxShadow:
            "0 12px 40px rgba(16, 24, 40, 0.08)",
        }}
      >
        <div
          style={{
            marginBottom: "28px",
          }}
        >
          <h1
            style={{
              color: "#172b1d",
              fontSize: "30px",
              marginBottom: "8px",
            }}
          >
            Create your account
          </h1>

          <p
            style={{
              color: "#667085",
              lineHeight: "1.6",
            }}
          >
            Join FoodRescueAI and start managing
            surplus food responsibly.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="alert alert-error">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* NAME + ROLE */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "18px",
            }}
          >
            <div className="form-group">
              <label className="form-label">
                Full Name *
              </label>

              <input
                className="form-input"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Account Type *
              </label>

              <select
                className="form-select"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Donor">
                  Donor
                </option>

                <option value="Restaurant Owner">
                  Restaurant Owner
                </option>

                <option value="Hotel Owner">
                  Hotel Owner
                </option>

                <option value="NGO">
                  NGO
                </option>

                <option value="Volunteer">
                  Volunteer
                </option>
              </select>
            </div>
          </div>

          {/* EMAIL */}

          <div className="form-group">
            <label className="form-label">
              Email Address *
            </label>

            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          {/* PHONE */}

          <div className="form-group">
            <label className="form-label">
              Phone Number *
            </label>

            <input
              className="form-input"
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
          </div>

          {/* PASSWORD */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "18px",
            }}
          >
            <div className="form-group">
              <label className="form-label">
                Password *
              </label>

              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Confirm Password *
              </label>

              <input
                className="form-input"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* TERMS NOTE */}

          <div
            style={{
              padding: "13px 15px",
              marginBottom: "20px",
              background: "#f8faf9",
              borderRadius: "9px",
              color: "#667085",
              fontSize: "13px",
              lineHeight: "1.5",
            }}
          >
            By creating an account, you agree to use
            FoodRescueAI responsibly for food donation
            and redistribution activities.
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
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
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;