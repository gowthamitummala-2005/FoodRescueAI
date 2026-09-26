import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f4fbf6 0%, #ffffff 55%, #edf8f0 100%)",
      }}
    >
      {/* NAVBAR */}

      <header
        style={{
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 7%",
          background: "rgba(255,255,255,0.95)",
          borderBottom: "1px solid #e7ebe8",
        }}
      >
        <div
          style={{
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
                fontSize: "20px",
                fontWeight: "800",
                color: "#176b36",
              }}
            >
              FoodRescueAI
            </div>

            <div
              style={{
                fontSize: "10px",
                color: "#667085",
                fontWeight: "700",
                letterSpacing: "0.5px",
              }}
            >
              SMART FOOD WASTE MANAGEMENT
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "10px 20px",
              borderRadius: "9px",
              border: "1px solid #176b36",
              background: "white",
              color: "#176b36",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "10px 20px",
              borderRadius: "9px",
              border: "none",
              background: "#176b36",
              color: "white",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* HERO */}

      <main
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
          padding: "80px 30px 60px",
        }}
      >
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "60px",
            alignItems: "center",
          }}
        >
          {/* LEFT */}

          <div>
            <div
              style={{
                display: "inline-block",
                padding: "7px 13px",
                borderRadius: "30px",
                background: "#eaf7ee",
                color: "#176b36",
                fontSize: "13px",
                fontWeight: "700",
                marginBottom: "20px",
              }}
            >
              🌱 AI-POWERED FOOD RESCUE PLATFORM
            </div>

            <h1
              style={{
                fontSize: "clamp(40px, 5vw, 64px)",
                lineHeight: "1.08",
                color: "#172b1d",
                marginBottom: "22px",
                fontWeight: "800",
              }}
            >
              Turn surplus food
              <span
                style={{
                  display: "block",
                  color: "#176b36",
                }}
              >
                into social impact.
              </span>
            </h1>

            <p
              style={{
                fontSize: "18px",
                lineHeight: "1.7",
                color: "#667085",
                maxWidth: "650px",
                marginBottom: "32px",
              }}
            >
              FoodRescueAI helps donors manage surplus food,
              predict food-waste risk, discover nearby NGOs,
              and coordinate safe food redistribution.
            </p>

            <div
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => navigate("/register")}
                style={{
                  padding: "14px 25px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#176b36",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Start Rescuing Food →
              </button>

              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "14px 25px",
                  border: "1px solid #d0d5dd",
                  borderRadius: "10px",
                  background: "white",
                  color: "#344054",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Sign In
              </button>
            </div>
          </div>

          {/* RIGHT VISUAL */}

          <div
            style={{
              position: "relative",
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "30px",
                border: "1px solid #e4ebe6",
                boxShadow:
                  "0 20px 50px rgba(23,107,54,0.12)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "25px",
                }}
              >
                <div>
                  <p
                    style={{
                      color: "#667085",
                      fontSize: "13px",
                      marginBottom: "5px",
                    }}
                  >
                    Food Rescue Overview
                  </p>

                  <h2
                    style={{
                      color: "#172b1d",
                      fontSize: "22px",
                    }}
                  >
                    Today's Impact
                  </h2>
                </div>

                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "12px",
                    background: "#eaf7ee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "23px",
                  }}
                >
                  🤖
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                }}
              >
                <ImpactCard
                  icon="🍱"
                  value="1,240"
                  label="Meals Rescued"
                />

                <ImpactCard
                  icon="🏢"
                  value="38"
                  label="NGO Partners"
                />

                <ImpactCard
                  icon="♻️"
                  value="420 kg"
                  label="Waste Prevented"
                />

                <ImpactCard
                  icon="❤️"
                  value="860"
                  label="People Reached"
                />
              </div>

              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  background: "#f8faf9",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "24px" }}>🌱</span>

                <div>
                  <strong
                    style={{
                      display: "block",
                      color: "#176b36",
                    }}
                  >
                    Smart food redistribution
                  </strong>

                  <span
                    style={{
                      color: "#667085",
                      fontSize: "13px",
                    }}
                  >
                    Powered by data and intelligent recommendations
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}

        <section
          style={{
            marginTop: "100px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "40px",
            }}
          >
            <p
              style={{
                color: "#176b36",
                fontWeight: "700",
                fontSize: "13px",
                letterSpacing: "1px",
              }}
            >
              PLATFORM FEATURES
            </p>

            <h2
              style={{
                marginTop: "10px",
                fontSize: "34px",
                color: "#172b1d",
              }}
            >
              Everything needed to rescue food
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",
              gap: "20px",
            }}
          >
            <FeatureCard
              icon="🤖"
              title="AI Food Prediction"
              text="Analyze surplus food and estimate waste risk with intelligent recommendations."
            />

            <FeatureCard
              icon="📍"
              title="Nearby NGO Discovery"
              text="Find suitable nearby food rescue organizations based on the donor's location."
            />

            <FeatureCard
              icon="📋"
              title="Donation Tracking"
              text="Track every donation from submission through pickup and successful delivery."
            />

            <FeatureCard
              icon="🛡️"
              title="Food Safety"
              text="Support safer redistribution through food handling and safety checks."
            />

            <FeatureCard
              icon="🪪"
              title="FSSAI Compliance"
              text="Maintain food-business compliance information and licensing details."
            />

            <FeatureCard
              icon="🚚"
              title="Smart Routing"
              text="Support efficient pickup planning between donors and rescue organizations."
            />
          </div>
        </section>

        {/* CTA */}

        <section
          style={{
            marginTop: "80px",
            padding: "45px",
            borderRadius: "20px",
            background: "#176b36",
            color: "white",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              marginBottom: "12px",
            }}
          >
            Ready to make every meal count?
          </h2>

          <p
            style={{
              opacity: 0.9,
              marginBottom: "25px",
            }}
          >
            Join FoodRescueAI and help reduce food waste.
          </p>

          <button
            onClick={() => navigate("/register")}
            style={{
              border: "none",
              background: "white",
              color: "#176b36",
              padding: "13px 24px",
              borderRadius: "9px",
              fontWeight: "750",
              cursor: "pointer",
            }}
          >
            Create Your Account
          </button>
        </section>
      </main>

      {/* FOOTER */}

      <footer
        style={{
          marginTop: "30px",
          padding: "30px",
          textAlign: "center",
          borderTop: "1px solid #e7ebe8",
          color: "#667085",
          fontSize: "14px",
          background: "#ffffff",
        }}
      >
        © {new Date().getFullYear()} FoodRescueAI. Smart food,
        less waste, greater impact.
      </footer>
    </div>
  );
}

/* =========================
   IMPACT CARD
========================= */

function ImpactCard({ icon, value, label }) {
  return (
    <div
      style={{
        padding: "18px",
        background: "#f8faf9",
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          fontSize: "23px",
          marginBottom: "8px",
        }}
      >
        {icon}
      </div>

      <strong
        style={{
          display: "block",
          color: "#172b1d",
          fontSize: "22px",
        }}
      >
        {value}
      </strong>

      <span
        style={{
          color: "#667085",
          fontSize: "12px",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* =========================
   FEATURE CARD
========================= */

function FeatureCard({ icon, title, text }) {
  return (
    <div
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
          marginBottom: "17px",
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          marginBottom: "9px",
          color: "#172b1d",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#667085",
          lineHeight: "1.6",
          fontSize: "14px",
        }}
      >
        {text}
      </p>
    </div>
  );
}

export default Landing;