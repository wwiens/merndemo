import React, { useState, useEffect } from 'react';
import './EmojiGrid.css';

function EmojiGrid() {
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animatingId, setAnimatingId] = useState(null);

  useEffect(() => {
    fetchReactions();
  }, []);

  const fetchReactions = async () => {
    try {
      const response = await fetch('/api/reactions');
      if (!response.ok) {
        throw new Error('Failed to fetch reactions');
      }
      const data = await response.json();
      setReactions(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEmojiClick = async (emojiId) => {
    // Trigger animation
    setAnimatingId(emojiId);
    setTimeout(() => setAnimatingId(null), 300);

    try {
      const response = await fetch(`/api/reactions/${emojiId}/increment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to increment');
      }

      const data = await response.json();

      // Update local state with new count
      setReactions(prevReactions =>
        prevReactions.map(reaction =>
          reaction.emojiId === emojiId
            ? { ...reaction, count: data.count }
            : reaction
        )
      );
    } catch (err) {
      console.error('Error incrementing reaction:', err);
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading reactions...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="emoji-grid-container">
      <header>
        <h1>Emoji Reactions</h1>
        <p>Click an emoji to react!</p>
        <a href="#admin" className="admin-link">Admin</a>
      </header>

      <div className="emoji-grid">
        {reactions.map(reaction => (
          <div
            key={reaction.emojiId}
            className={`emoji-card ${animatingId === reaction.emojiId ? 'animate' : ''}`}
            onClick={() => handleEmojiClick(reaction.emojiId)}
          >
            <div className="emoji-symbol">{reaction.symbol}</div>
            <div className="emoji-label">{reaction.label}</div>
            <div className="emoji-count">{reaction.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmojiGrid;
