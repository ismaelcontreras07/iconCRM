import React, { useState, useEffect } from 'react';
import Board from '@asseinfo/react-kanban';
import '@asseinfo/react-kanban/dist/styles.css';

export default function KanbanActivities() {
  const [board, setBoard] = useState({ columns: [] });

  // Cargar actividades y construir columnas
  useEffect(() => {
    fetch('/api/activities/listActivities.php')
      .then(res => res.json())
      .then(data => {
        const activities = data.data;
        const statuses = [
          { id: 1, title: 'No iniciada', key: 'no_iniciada' },
          { id: 2, title: 'Pendiente', key: 'pendiente' },
          { id: 3, title: 'Aplazada', key: 'aplazada' },
          { id: 4, title: 'Completada', key: 'completada' }
        ];
        const cols = statuses.map(s => ({
          id: s.id,
          title: s.title,
          cards: activities
            .filter(a => a.status === s.key)
            .map(a => ({ id: a.id, title: a.description, meta: a }))
        }));
        setBoard({ columns: cols });
      })
      .catch(err => console.error(err));
  }, []);

  const handleCardDragEnd = (card, source, destination) => {
    if (!destination) return;
    const destKey = ['no_iniciada', 'pendiente', 'aplazada', 'completada'][destination.toColumnId - 1];

    fetch('/api/activities/updateActivities.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: card.id, status: destKey })
    })
      .then(res => res.json())
      .then(() => {
        const updated = Board.moveCard(board, source, destination);
        setBoard(updated);
      })
      .catch(err => console.error(err));
  };

  return (
    <Board
      initialBoard={board}
      allowAddCard={false}
      allowRemoveCard={false}
      onCardDragEnd={handleCardDragEnd}
    />
  );
}