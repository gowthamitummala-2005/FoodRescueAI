import React, { useEffect, useState } from "react";
import "./FSSAILicense.css";

function FSSAILicense() {
  const [license, setLicense] = useState(null);

  const [formData, setFormData] = useState({
    licenseNumber: "",
    businessName: "",
    businessType: "Restaurant",
    issueDate: "",
    expiryDate: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Load saved license
  useEffect(() => {
    const savedLicense = localStorage.getItem("fssaiLicense");

    if (savedLicense) {
      try {
        const parsed = JSON.parse(savedLicense);

        setLicense(parsed);
        setFormData({
          licenseNumber: parsed.licenseNumber || "",
          businessName: parsed.businessName || "",
          businessType: parsed.businessType || "Restaurant",
          issueDate: parsed.issueDate || "",
          expiryDate: parsed.expiryDate || "",
        });
      } catch (error) {
        console.error("Unable to load license:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.licenseNumber ||
      !formData.businessName ||
      !formData.issueDate ||
      !formData.expiryDate
    ) {
      setMessageType("error");
      setMessage("Please fill in all required fields.");
      return;
    }

    if (
      new Date(formData.expiryDate) <
      new Date(formData.issueDate)
    ) {
      setMessageType("error");
      setMessage("Expiry date cannot be before issue date.");
      return;
    }

    const newLicense = {
      ...formData,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "fssaiLicense",
      JSON.stringify(newLicense)
    );

    setLicense(newLicense);

    setMessageType("success");
    setMessage("License information saved successfully.");
  };

  const calculateDaysRemaining = () => {
    if (!license?.expiryDate) return 0;

    const today = new Date();
    const expiry = new Date(license.expiryDate);

    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const difference =
      expiry.getTime() - today.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  };

  const daysRemaining = calculateDaysRemaining();

  const getStatus = () => {
    if (!license) {
      return {
        text: "Not Added",
        className: "status-neutral",
        icon: "○",
      };
    }

    if (daysRemaining < 0) {
      return {
        text: "Expired",
        className: "status-danger",
        icon: "!",
      };
    }

    if (daysRemaining <= 30) {
      return {
        text: "Expiring Soon",
        className: "status-warning",
        icon: "!",
      };
    }

    return {
      text: "Active",
      className: "status-active",
      icon: "✓",
    };
  };

  const status = getStatus();

  const formatDate = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="fssai-page">

      {/* ================================
          NAVBAR
      ================================= */}

      <nav className="fssai-navbar">

        <div className="brand-area">
          <div className="brand-icon">
            🍃
          </div>

          <div>
            <h2>FoodRescue</h2>
            <span>AI FOOD WASTE MANAGEMENT</span>
          </div>
        </div>

        <div className="nav-links">

          <a href="/dashboard">
            Dashboard
          </a>

          <a href="/donate-food">
            Donate Food
          </a>

          <a href="/ai-prediction">
            AI Prediction
          </a>

          <a href="/ngo">
            Nearby NGOs
          </a>

          <a href="/donations">
            My Donations
          </a>

        </div>

        <div className="nav-user">

          <div className="theme-icon">
            ☾
          </div>

          <span>JARIS</span>

          <a href="/login">
            Logout
          </a>

        </div>

      </nav>


      {/* ================================
          PAGE CONTENT
      ================================= */}

      <main className="fssai-container">

        {/* Breadcrumb */}

        <div className="breadcrumb">
          Dashboard
          <span>›</span>
          FSSAI License
        </div>


        {/* ================================
            HERO
        ================================= */}

        <section className="fssai-hero">

          <div className="hero-left">

            <div className="hero-icon">
              🛡️
            </div>

            <div>

              <div className="hero-label">
                FOOD SAFETY & COMPLIANCE
              </div>

              <h1>
                FSSAI Compliance Center
              </h1>

              <p>
                Keep your food business compliant,
                organized and ready for safe food
                operations.
              </p>

            </div>

          </div>


          <div className="hero-status">

            <div className="shield">
              🛡️
            </div>

            <div>
              <span>COMPLIANCE STATUS</span>

              <strong className={status.className}>
                {status.icon} {status.text}
              </strong>
            </div>

          </div>

        </section>


        {/* ================================
            MAIN GRID
        ================================= */}

        <section className="license-grid">


          {/* ================================
              FORM CARD
          ================================= */}

          <div className="license-form-card">

            <div className="card-heading">

              <div className="heading-icon">
                🪪
              </div>

              <div>
                <h2>
                  License Information
                </h2>

                <p>
                  Add your official FSSAI
                  registration details.
                </p>
              </div>

            </div>


            <form onSubmit={handleSubmit}>

              {/* License Number */}

              <div className="input-group">

                <label>
                  FSSAI Registration / License Number
                  <span>*</span>
                </label>

                <div className="input-wrapper">

                  <span>🔢</span>

                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="Enter FSSAI number"
                  />

                </div>

              </div>


              {/* Business Name */}

              <div className="input-group">

                <label>
                  Business / Organization Name
                  <span>*</span>
                </label>

                <div className="input-wrapper">

                  <span>🏪</span>

                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Enter business name"
                  />

                </div>

              </div>


              {/* Business Type */}

              <div className="input-group">

                <label>
                  Business Type
                </label>

                <div className="input-wrapper">

                  <span>🍽️</span>

                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                  >
                    <option value="Restaurant">
                      Restaurant
                    </option>

                    <option value="Hotel">
                      Hotel
                    </option>

                    <option value="Catering">
                      Catering
                    </option>

                    <option value="Food Manufacturer">
                      Food Manufacturer
                    </option>

                    <option value="Bakery">
                      Bakery
                    </option>

                    <option value="Supermarket">
                      Supermarket
                    </option>

                    <option value="Food Supplier">
                      Food Supplier
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

              </div>


              {/* Dates */}

              <div className="date-grid">

                <div className="input-group">

                  <label>
                    Issue Date
                    <span>*</span>
                  </label>

                  <div className="input-wrapper">

                    <span>📅</span>

                    <input
                      type="date"
                      name="issueDate"
                      value={formData.issueDate}
                      onChange={handleChange}
                    />

                  </div>

                </div>


                <div className="input-group">

                  <label>
                    Expiry Date
                    <span>*</span>
                  </label>

                  <div className="input-wrapper">

                    <span>⏳</span>

                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                    />

                  </div>

                </div>

              </div>


              {/* Message */}

              {message && (
                <div
                  className={`form-message ${messageType}`}
                >
                  {messageType === "success"
                    ? "✓"
                    : "!"}

                  <span>{message}</span>
                </div>
              )}


              {/* Button */}

              <button
                type="submit"
                className="save-button"
              >
                <span>✓</span>
                Save License Information
              </button>

            </form>

          </div>


          {/* ================================
              STATUS CARD
          ================================= */}

          <div className="status-card">

            {!license ? (

              <div className="empty-license">

                <div className="empty-circle">
                  🪪
                </div>

                <h2>
                  No License Added
                </h2>

                <p>
                  Add your FSSAI license information
                  to start monitoring your compliance
                  status.
                </p>

                <div className="secure-row">

                  <div>
                    🔒
                    <span>Secure</span>
                  </div>

                  <div>
                    ✓
                    <span>Compliance Ready</span>
                  </div>

                </div>

              </div>

            ) : (

              <div className="active-license">

                <div className="license-top">

                  <div>
                    <span className="small-label">
                      FSSAI LICENSE
                    </span>

                    <h2>
                      {status.text}
                    </h2>
                  </div>

                  <div
                    className={`big-status ${status.className}`}
                  >
                    {status.icon}
                  </div>

                </div>


                <div className="license-number-box">

                  <span>
                    Registration Number
                  </span>

                  <strong>
                    {license.licenseNumber}
                  </strong>

                </div>


                <div className="business-info">

                  <span>Business</span>

                  <strong>
                    {license.businessName}
                  </strong>

                  <small>
                    {license.businessType}
                  </small>

                </div>


                <div className="license-dates">

                  <div>

                    <span>
                      Issued
                    </span>

                    <strong>
                      {formatDate(
                        license.issueDate
                      )}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Expires
                    </span>

                    <strong>
                      {formatDate(
                        license.expiryDate
                      )}
                    </strong>

                  </div>

                </div>


                <div
                  className={`days-box ${
                    daysRemaining < 0
                      ? "expired"
                      : daysRemaining <= 30
                      ? "warning"
                      : ""
                  }`}
                >

                  {daysRemaining >= 0 ? (
                    <>
                      <strong>
                        {daysRemaining}
                      </strong>

                      <span>
                        days remaining
                      </span>
                    </>
                  ) : (
                    <>
                      <strong>
                        {Math.abs(daysRemaining)}
                      </strong>

                      <span>
                        days expired
                      </span>
                    </>
                  )}

                </div>

              </div>

            )}

          </div>

        </section>


        {/* ================================
            COMPLIANCE OVERVIEW
        ================================= */}

        <section className="overview-section">

          <div className="section-title">

            <div>
              <span>
                YOUR SAFETY DASHBOARD
              </span>

              <h2>
                Compliance Overview
              </h2>
            </div>

            <p>
              Stay informed about your food
              safety requirements.
            </p>

          </div>


          <div className="overview-grid">

            <div className="overview-card">

              <div className="overview-icon green">
                🛡️
              </div>

              <div>

                <span>
                  LICENSE STATUS
                </span>

                <strong>
                  {license
                    ? status.text
                    : "Not Added"}
                </strong>

              </div>

            </div>


            <div className="overview-card">

              <div className="overview-icon blue">
                📅
              </div>

              <div>

                <span>
                  VALIDITY MONITORING
                </span>

                <strong>
                  Automatic
                </strong>

              </div>

            </div>


            <div className="overview-card">

              <div className="overview-icon orange">
                🔔
              </div>

              <div>

                <span>
                  EXPIRY ALERTS
                </span>

                <strong>
                  Enabled
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* ================================
            SAFETY NOTE
        ================================= */}

        <section className="safety-note">

          <div className="note-icon">
            💡
          </div>

          <div>

            <h3>
              Why keep your FSSAI details updated?
            </h3>

            <p>
              Keeping your license information
              organized helps you monitor its
              validity and maintain your food
              safety records in one place.
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default FSSAILicense;