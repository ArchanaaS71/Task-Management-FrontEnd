import { useEffect, useState } from "react";
import api from "../api/api";
import CardComments from "./CardComments";
import CardActivityPanel from "./CardActivityPanel";

function CardModal({ card, onClose, onDelete }) {
  const [currentCard, setCurrentCard] = useState(null);
  const [description, setDescription] = useState("");
  const [editingDesc, setEditingDesc] = useState(false);
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("12:00");
  const [editingDue, setEditingDue] = useState(false);

  useEffect(() => {
    if (card) fetchCard();
  }, [card]);

  const fetchCard = async () => {
    const res = await api.get(`/cards/${card.id}`);
    const data = res.data;

    setCurrentCard(data);
    setDescription(data.description || "");

    if (data.due_date) {
      const [d, t] = data.due_date.split("T");
      setDueDate(d);
      setDueTime(t.substring(0, 5));
    } else {
      setDueDate("");
      setDueTime("12:00");
    }
  };

  const saveDescription = async () => {
    await api.patch(`/cards/${currentCard.id}/description`, {
      description,
    });
    setEditingDesc(false);
    fetchCard();
  };

  const saveDueDate = async () => {
    await api.patch(`/cards/${currentCard.id}/due-date`, {
      due_date: dueDate ? `${dueDate}T${dueTime}:00` : null,
    });
    setEditingDue(false);
    fetchCard();
  };

  const deleteCard = async (e) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this card?")) return;

    await api.delete(`/cards/${currentCard.id}`);
    onDelete(currentCard.id);
    onClose();
  };

  if (!currentCard) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "900px",
          height: "90vh",
          borderRadius: "18px",
          background: "#1c1f27",
          border: "1px solid #2a2e38",
          display: "flex",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "24px",
            overflowY: "auto",
            color: "var(--text-h)",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>{currentCard.title}</h2>

          <h4>Due Date and Time</h4>
          {!editingDue ? (
            <div style={{ marginBottom: "20px" }}>
              <p>{dueDate ? `${dueDate} ${dueTime}` : "No due date"}</p>
              <button onClick={() => setEditingDue(true)}>Change</button>
            </div>
          ) : (
            <div style={{ marginBottom: "20px" }}>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                style={{ marginLeft: "8px" }}
              />
              <div style={{ marginTop: "8px" }}>
                <button onClick={saveDueDate}>Save</button>
                <button
                  onClick={() => setEditingDue(false)}
                  style={{ marginLeft: "8px" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <h4>Description</h4>
          {!editingDesc ? (
            <div style={{ marginBottom: "20px" }}>
              <p>{description || "No description"}</p>
              <button onClick={() => setEditingDesc(true)}>Edit</button>
            </div>
          ) : (
            <div style={{ marginBottom: "20px" }}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "100px",
                  marginBottom: "8px",
                }}
              />
              <button onClick={saveDescription}>Save</button>
              <button
                onClick={() => setEditingDesc(false)}
                style={{ marginLeft: "8px" }}
              >
                Cancel
              </button>
            </div>
          )}

          <CardComments cardId={currentCard.id} />

          <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
            <button onClick={onClose}>Close</button>
            <button
              onClick={deleteCard}
              style={{
                backgroundColor: "#d1242f",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
              }}
            >
              Delete card
            </button>
          </div>
        </div>

        <div
          style={{
            width: "300px",
            padding: "16px",
            background: "#151821",
            borderLeft: "1px solid #2a2e38",
            overflowY: "auto",
          }}
        >
          <CardActivityPanel cardId={currentCard.id} />
        </div>
      </div>
    </div>
  );
}

export default CardModal;