import { useEffect, useState } from "react";
import api from "../api/api";

function CardComments({ cardId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchComments();
  }, [cardId]);

  const fetchComments = async () => {
    const res = await api.get(`/comments/card/${cardId}`);
    setComments(res.data);
  };

  const addComment = async () => {
    if (!text.trim()) return;

    await api.post("/comments", {
      content: text,
      card_id: cardId,
    });

    setText("");
    fetchComments();
  };

  return (
    <div style={{ marginTop: "24px" }}>
      <h4 style={{ marginBottom: "12px" }}>Comments</h4>

      <textarea
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "100%",
          minHeight: "70px",
          padding: "10px 12px",
          borderRadius: "10px",
          border: "1px solid #2f3440",
          background: "#151821",
          color: "var(--text-h)",
          boxSizing: "border-box",
          marginBottom: "10px",
          resize: "vertical",
        }}
      />

      <button
        onClick={addComment}
        style={{
          padding: "8px 14px",
          borderRadius: "10px",
          border: "none",
          background: "var(--accent)",
          color: "white",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        Add Comment
      </button>

      <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {comments.map((c) => (
          <div
            key={c.id}
            style={{
              background: "#151821",
              border: "1px solid #2f3440",
              padding: "12px 14px",
              borderRadius: "12px",
              color: "var(--text-h)",
              fontSize: "14px",
            }}
          >
            <div style={{ marginBottom: "6px" }}>{c.content}</div>
            <div style={{ fontSize: "11px", color: "var(--text)" }}>
              {new Date(c.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardComments;
