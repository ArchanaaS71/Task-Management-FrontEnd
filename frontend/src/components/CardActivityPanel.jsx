import { useEffect, useState } from "react";
import api from "../api/api";

function CardActivityPanel({ cardId }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivity();
  }, [cardId]);

  const fetchActivity = async () => {
    try {
      const res = await api.get(`/activity/card/${cardId}`);
      setActivities(res.data);
    } catch {
      console.error("Failed to load card activity");
    }
  };

  const recentActivities = activities.slice(0, 7);

  return (
    <div
      style={{
        width: "300px",
        padding: "16px",
        background: "#151821",
        overflowY: "auto",
        boxSizing: "border-box",
      }}
    >
      <h4
        style={{
          marginBottom: "16px",
          color: "var(--text-h)",
          fontSize: "15px",
        }}
      >
        Comments and activity
      </h4>

      {recentActivities.length === 0 && (
        <p style={{ fontSize: "13px", color: "var(--text)" }}>
          No activity yet
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {recentActivities.map((a) => (
          <div
            key={a.id}
            style={{
              background: "#1c1f27",
              border: "1px solid #2f3440",
              padding: "12px 14px",
              borderRadius: "12px",
              color: "var(--text-h)",
              fontSize: "13px",
            }}
          >
            <div style={{ marginBottom: "6px" }}>{a.action}</div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--text)",
              }}
            >
              {new Date(a.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardActivityPanel;