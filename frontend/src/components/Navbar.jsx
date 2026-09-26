import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "User";

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userRole");

    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navLinkStyle = ({ isActive }) => ({
    textDecoration: "none",
    color: isActive ? "#176b36" : "#475467",
    fontWeight: isActive ? "700" : "600",
    fontSize: "15px",
    padding: "9px 12px",
    borderRadius: "8px",
    background: isActive ? "#eaf7ee" : "transparent",
    transition: "0.2s ease",
  });

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        background: "#ffffff",
        borderBottom: "1px solid #e7ebe8",
        boxShadow: "0 2px 12px rgba(16, 24, 40, 0.05)",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          minHeight: "72px",
          padding: "0 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        {/* LOGO */}

        <NavLink
          to="/dashboard"
          onClick={closeMenu}
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "#176b36",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
            }}
          >
            🍱
          </div>

          <div>
            <div
              style={{
                color: "#176b36",
                fontSize: "19px",
                fontWeight: "800",
                lineHeight: 1,
              }}
            >
              FoodRescue
            </div>

            <div
              style={{
                color: "#667085",
                fontSize: "11px",
                fontWeight: "600",
                marginTop: "4px",
              }}
            >
              AI FOOD WASTE MANAGEMENT
            </div>
          </div>
        </NavLink>

        {/* DESKTOP NAVIGATION */}

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <NavLink
            to="/dashboard"
            style={navLinkStyle}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/donate-food"
            style={navLinkStyle}
          >
            Donate Food
          </NavLink>

          <NavLink
            to="/ai-prediction"
            style={navLinkStyle}
          >
            AI Prediction
          </NavLink>

          <NavLink
            to="/ngo"
            style={navLinkStyle}
          >
            Nearby NGOs
          </NavLink>

          <NavLink
            to="/donations"
            style={navLinkStyle}
          >
            My Donations
          </NavLink>
        </nav>

        {/* USER SECTION */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <NavLink
            to="/profile"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "9px",
              color: "#344054",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "#eaf7ee",
                color: "#176b36",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>

            <span
              style={{
                fontSize: "14px",
                fontWeight: "650",
              }}
            >
              {userName}
            </span>
          </NavLink>

          <button
            onClick={handleLogout}
            style={{
              border: "1px solid #e4e7ec",
              background: "#ffffff",
              color: "#b42318",
              borderRadius: "8px",
              padding: "9px 13px",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Logout
          </button>

          {/* MOBILE MENU BUTTON */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none",
              border: "none",
              background: "transparent",
              fontSize: "25px",
              cursor: "pointer",
            }}
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}

      {menuOpen && (
        <div
          style={{
            padding: "12px 20px 20px",
            borderTop: "1px solid #eef1ef",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <NavLink
              to="/dashboard"
              onClick={closeMenu}
              style={navLinkStyle}
            >
              🏠 Dashboard
            </NavLink>

            <NavLink
              to="/donate-food"
              onClick={closeMenu}
              style={navLinkStyle}
            >
              🍱 Donate Food
            </NavLink>

            <NavLink
              to="/ai-prediction"
              onClick={closeMenu}
              style={navLinkStyle}
            >
              🤖 AI Prediction
            </NavLink>

            <NavLink
              to="/ngo"
              onClick={closeMenu}
              style={navLinkStyle}
            >
              📍 Nearby NGOs
            </NavLink>

            <NavLink
              to="/donations"
              onClick={closeMenu}
              style={navLinkStyle}
            >
              📋 My Donations
            </NavLink>

            <NavLink
              to="/profile"
              onClick={closeMenu}
              style={navLinkStyle}
            >
              👤 Profile
            </NavLink>

            <button
              onClick={() => {
                closeMenu();
                handleLogout();
              }}
              style={{
                textAlign: "left",
                border: "none",
                background: "#fff0f0",
                color: "#b42318",
                padding: "10px 12px",
                borderRadius: "8px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;