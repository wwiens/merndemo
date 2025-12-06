import React, { useState } from 'react';
import './AdminPage.css';

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [newEmoji, setNewEmoji] = useState({
    emojiId: '',
    label: '',
    symbol: ''
  });
  const [message, setMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password check (in production, this should be more secure)
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setAdminKey('demo-admin-key-12345');
      setMessage('');
    } else {
      setMessage('Incorrect password');
    }
  };

  const handleResetCounts = async () => {
    if (!confirm('Are you sure you want to reset all counts to zero?')) {
      return;
    }

    try {
      const response = await fetch('/api/reactions/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reset counts');
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleCreateEmoji = async (e) => {
    e.preventDefault();

    if (!newEmoji.emojiId || !newEmoji.label || !newEmoji.symbol) {
      setMessage('All fields are required');
      return;
    }

    try {
      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify(newEmoji)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create emoji');
      }

      const data = await response.json();
      setMessage(`Successfully created: ${data.label}`);
      setNewEmoji({ emojiId: '', label: '', symbol: '' });
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <h2>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
            />
            <button type="submit" className="admin-button">Login</button>
          </form>
          {message && <p className="message error">{message}</p>}
          <a href="#" className="back-link">Back to main</a>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-panel">
        <h2>Admin Panel</h2>

        <div className="admin-section">
          <h3>Reset All Counts</h3>
          <button onClick={handleResetCounts} className="admin-button danger">
            Reset All Counts to Zero
          </button>
        </div>

        <div className="admin-section">
          <h3>Create New Emoji</h3>
          <form onSubmit={handleCreateEmoji}>
            <input
              type="text"
              placeholder="Emoji ID (e.g., thumbs-up)"
              value={newEmoji.emojiId}
              onChange={(e) => setNewEmoji({ ...newEmoji, emojiId: e.target.value })}
              className="admin-input"
            />
            <input
              type="text"
              placeholder="Label (e.g., Thumbs Up)"
              value={newEmoji.label}
              onChange={(e) => setNewEmoji({ ...newEmoji, label: e.target.value })}
              className="admin-input"
            />
            <input
              type="text"
              placeholder="Emoji Symbol (e.g., 👍)"
              value={newEmoji.symbol}
              onChange={(e) => setNewEmoji({ ...newEmoji, symbol: e.target.value })}
              className="admin-input"
            />
            <button type="submit" className="admin-button">Create Emoji</button>
          </form>
        </div>

        {message && <p className="message">{message}</p>}

        <a href="#" className="back-link">Back to main</a>
      </div>
    </div>
  );
}

export default AdminPage;
