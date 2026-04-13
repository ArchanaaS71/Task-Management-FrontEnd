import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Boards() {
  const navigate = useNavigate();

  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await api.get("/boards");
      setBoards(response.data);
    } catch {
      alert("Failed to load boards");
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async () => {
    if (!title.trim()) {
      alert("Board title is required");
      return;
    }

    try {
      await api.post("/boards", {
        title: title,
        description: description || "No description",
      });
      setTitle("");
      setDescription("");
      fetchBoards();
    } catch {
      alert("Failed to create board");
    }
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading boards...</p>;
  }

  return (
    <div
      style={{
        padding: "32px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: "28px" }}>Your Boards</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            padding: "26px",
            borderRadius: "18px",
            background: "#1c1f27",
            border: "1px solid #2a2e38",
          }}
        >
          <h2 style={{ marginBottom: "18px", color: "var(--text-h)" }}>
            Create New Board
          </h2>

          <input
            type="text"
            placeholder="Board title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              marginBottom: "14px",
              borderRadius: "10px",
              border: "1px solid #2f3440",
              background: "#151821",
              color: "var(--text-h)",
              boxSizing: "border-box",
            }}
          />

          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              marginBottom: "20px",
              borderRadius: "10px",
              border: "1px solid #2f3440",
              background: "#151821",
              color: "var(--text-h)",
              boxSizing: "border-box",
            }}
          />

          <button
            onClick={createBoard}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              background: "var(--accent)",
              color: "white",
              fontSize: "15px",
              cursor: "pointer",
              boxSizing: "border-box",
            }}
          >
            Create Board
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "22px",
        }}
      >
        {boards.length === 0 && <p>No boards created yet.</p>}

        {boards.map((board) => (
          <div
            key={board.id}
            onClick={() => navigate(`/boards/${board.id}`)}
            style={{
              padding: "26px",
              borderRadius: "18px",
              background: "#1c1f27",
              border: "1px solid #2a2e38",
              cursor: "pointer",
            }}
          >
            <h2 style={{ marginBottom: "10px", color: "var(--text-h)" }}>
              {board.title}
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text)" }}>
              {board.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Boards;