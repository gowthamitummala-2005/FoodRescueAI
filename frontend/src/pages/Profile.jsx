import { useState } from "react";
import Navbar from "../components/Navbar";

function Profile() {
  const [name, setName] = useState(
    localStorage.getItem("userName") || ""
  );

  const [email] = useState(
    localStorage.getItem("userEmail") || ""
  );

  const [phone, setPhone] = useState(
    localStorage.getItem("userPhone") || ""
  );

  const [role, setRole] = useState(
    localStorage.getItem("userRole") || "Donor"
  );

  const [message, setMessage] = useState("");

  const handleSave = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "userName",
      name.trim()
    );

    localStorage.setItem(
      "userPhone",
      phone.trim()
    );

    localStorage.setItem(
      "userRole",
      role
    );

    setMessage(
      "Profile updated successfully!"
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

        <div style={{ marginBottom: "28px" }}>
          <h1 className="page-title">
            👤 My Profile
          </h1>

          <p className="page-subtitle">
            Manage your FoodRescueAI account information.
          </p>
        </div>

        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="alert alert-success">
            ✅ {message}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "280px minmax(0, 700px)",
            gap: "25px",
            alignItems: "start",
          }}
        >
          {/* PROFILE SUMMARY */}

          <section
            className="card"
            style={{
              padding: "28px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                margin: "0 auto 18px",
                background: "#eaf7ee",
                color: "#176b36",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "38px",
                fontWeight: "800",
              }}
            >
              {name
                ? name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <h2
              style={{
                color: "#172b1d",
                fontSize: "20px",
                marginBottom: "6px",
              }}
            >
              {name || "User"}
            </h2>

            <p
              style={{
                color: "#667085",
                fontSize: "13px",
                marginBottom: "15px",
                wordBreak: "break-word",
              }}
            >
              {email || "No email available"}
            </p>

            <span
              style={{
                display: "inline-block",
                padding: "6px 13px",
                borderRadius: "20px",
                background: "#eaf7ee",
                color: "#176b36",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              {role}
            </span>
          </section>

          {/* PROFILE FORM */}

          <section
            className="card"
            style={{
              padding: "28px",
            }}
          >
            <h2
              style={{
                color: "#172b1d",
                fontSize: "21px",
                marginBottom: "6px",
              }}
            >
              Personal Information
            </h2>

            <p
              style={{
                color: "#667085",
                fontSize: "13px",
                marginBottom: "25px",
              }}
            >
              Update the information associated with
              your account.
            </p>

            <form onSubmit={handleSave}>
              {/* NAME */}

              <div className="form-group">
                <label className="form-label">
                  Full Name
                </label>

                <input
                  className="form-input"
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your name"
                />
              </div>

              {/* EMAIL */}

              <div className="form-group">
                <label className="form-label">
                  Email Address
                </label>

                <input
                  className="form-input"
                  type="email"
                  value={email}
                  disabled
                  style={{
                    background: "#f2f4f7",
                    cursor: "not-allowed",
                  }}
                />

                <small
                  style={{
                    display: "block",
                    marginTop: "6px",
                    color: "#98a2b3",
                    fontSize: "11px",
                  }}
                >
                  Email cannot be changed from this
                  profile page.
                </small>
              </div>

              {/* PHONE */}

              <div className="form-group">
                <label className="form-label">
                  Phone Number
                </label>

                <input
                  className="form-input"
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Enter phone number"
                />
              </div>

              {/* ROLE */}

              <div className="form-group">
                <label className="form-label">
                  Account Type
                </label>

                <select
                  className="form-select"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value)
                  }
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

              {/* SAVE */}

              <button
                type="submit"
                className="primary-button"
              >
                Save Profile
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Profile;