import { Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";

function ListColumn({ list, cards, onAddCard, onCardClick }) {
  const [newCardTitle, setNewCardTitle] = useState("");

  const handleAddCard = () => {
    if (!newCardTitle.trim()) return;
    onAddCard(list.id, newCardTitle);
    setNewCardTitle("");
  };

  return (
    <div
      style={{
        minWidth: "280px",
        padding: "24px",
        borderRadius: "18px",
        background: "#1c1f27",
        border: "1px solid #2a2e38",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontSize: "18px",
          marginBottom: "18px",
          color: "var(--text-h)",
          fontWeight: 500,
        }}
      >
        {list.title}
      </div>

      <Droppable droppableId={String(list.id)} type="CARD">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {cards.map((card, index) => (
              <Draggable
                key={card.id}
                draggableId={String(card.id)}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onCardClick(card)}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "12px",
                      background: "#151821",
                      border: "1px solid #2f3440",
                      color: "var(--text-h)",
                      fontSize: "14px",
                      cursor: "pointer",
                      ...provided.draggableProps.style,
                    }}
                  >
                    {card.labels?.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          marginBottom: "8px",
                        }}
                      >
                        {card.labels.map((label) => (
                          <div
                            key={label.id}
                            style={{
                              width: "36px",
                              height: "6px",
                              backgroundColor: label.color,
                              borderRadius: "4px",
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {card.title}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <input
        placeholder="Add a card"
        value={newCardTitle}
        onChange={(e) => setNewCardTitle(e.target.value)}
        style={{
          marginTop: "18px",
          width: "100%",
          padding: "10px 14px",
          borderRadius: "10px",
          border: "1px solid #2f3440",
          background: "#151821",
          color: "var(--text-h)",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={handleAddCard}
        style={{
          marginTop: "12px",
          padding: "10px",
          borderRadius: "12px",
          border: "none",
          background: "var(--accent)",
          color: "white",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        Add Card
      </button>
    </div>
  );
}

export default ListColumn;