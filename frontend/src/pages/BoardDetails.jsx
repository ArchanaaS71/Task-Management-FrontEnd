import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import api from "../api/api";
import ListColumn from "../components/ListColumn";
import CardModal from "../components/CardModal";

function BoardDetails() {
  const { id } = useParams();

  const [lists, setLists] = useState([]);
  const [cardsByList, setCardsByList] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);
  const [newListTitle, setNewListTitle] = useState("");

  useEffect(() => {
    loadBoard();
  }, []);

  const loadBoard = async () => {
    const boardRes = await api.get(`/boards/${id}/details`);
    const boardLists = boardRes.data.lists || [];
    setLists(boardLists);

    const map = {};
    for (let i = 0; i < boardLists.length; i++) {
      const listId = boardLists[i].id;
      const cardsRes = await api.get(`/cards/list/${listId}`);
      map[listId] = cardsRes.data || [];
    }
    setCardsByList(map);
  };

  const addList = async () => {
    if (!newListTitle.trim()) return;

    await api.post("/lists", {
      title: newListTitle,
      position: lists.length + 1,
      board_id: Number(id),
    });

    setNewListTitle("");
    loadBoard();
  };

  const addCard = async (listId, title) => {
    const cards = cardsByList[listId] || [];

    await api.post("/cards", {
      title,
      list_id: listId,
      position: cards.length + 1,
      description: null,
      due_date: null,
    });

    loadBoard();
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const srcList = Number(source.droppableId);
    const dstList = Number(destination.droppableId);

    if (srcList === dstList && source.index === destination.index) return;

    const sourceCards = [...cardsByList[srcList]];
    const movedCard = sourceCards.splice(source.index, 1)[0];

    const targetCards =
      srcList === dstList
        ? sourceCards
        : [...(cardsByList[dstList] || [])];

    targetCards.splice(destination.index, 0, {
      ...movedCard,
      list_id: dstList,
    });

    setCardsByList((prev) => {
      const updated = { ...prev };
      updated[srcList] = srcList === dstList ? targetCards : sourceCards;
      updated[dstList] = targetCards;
      return updated;
    });

    await api.patch(`/cards/${draggableId}/move`, {
      list_id: dstList,
      position: destination.index + 1,
    });
  };

  return (
    <div
      style={{
        height: "100vh",
        overflowY: "hidden",
        padding: "32px",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "24px" }}>Board</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <div
          style={{
            display: "flex",
            gap: "24px",
            alignItems: "flex-start",
            overflowX: "auto",
            paddingBottom: "16px",
          }}
        >
          {lists.map((list) => (
            <Droppable key={list.id} droppableId={String(list.id)} type="CARD">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  <ListColumn
                    list={list}
                    cards={cardsByList[list.id] || []}
                    onAddCard={addCard}
                    onCardClick={setSelectedCard}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}

          <div
            style={{
              minWidth: "260px",
              padding: "16px",
              borderRadius: "16px",
              background: "#1c1f27",
              border: "1px solid #2a2e38",
              height: "fit-content",
              alignSelf: "flex-start",
            }}
          >
            <input
              placeholder="Add another list"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid #2f3440",
                background: "#151821",
                color: "var(--text-h)",
                boxSizing: "border-box",
                marginBottom: "12px",
              }}
            />

            <button
              onClick={addList}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                background: "var(--accent)",
                color: "white",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Add List
            </button>
          </div>
        </div>
      </DragDropContext>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          boardId={id}
          onClose={() => {
            setSelectedCard(null);
            loadBoard();
          }}
        />
      )}
    </div>
  );
}

export default BoardDetails;
