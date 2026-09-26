function StatCard({
  icon,
  title,
  value,
  description,
}) {
  return (
    <div
      className="card"
      style={{
        padding: "22px",
        minHeight: "145px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "15px",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: "#667085",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            {title}
          </p>

          <h2
            style={{
              margin: "8px 0 5px",
              color: "#172b1d",
              fontSize: "28px",
              fontWeight: "800",
            }}
          >
            {value}
          </h2>

          {description && (
            <p
              style={{
                margin: 0,
                color: "#98a2b3",
                fontSize: "11px",
              }}
            >
              {description}
            </p>
          )}
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
            fontSize: "22px",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatCard;