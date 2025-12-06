# Quick Start Guide

## 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

## 2. Start the Application

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 3. Seed Initial Data

```bash
# Create sample emojis
curl -X POST http://localhost:5000/api/reactions \
  -H "Content-Type: application/json" \
  -H "x-admin-key: demo-admin-key-12345" \
  -d '{"emojiId": "heart", "label": "Heart", "symbol": "❤️"}'

curl -X POST http://localhost:5000/api/reactions \
  -H "Content-Type: application/json" \
  -H "x-admin-key: demo-admin-key-12345" \
  -d '{"emojiId": "thumbs-up", "label": "Thumbs Up", "symbol": "👍"}'

curl -X POST http://localhost:5000/api/reactions \
  -H "Content-Type: application/json" \
  -H "x-admin-key: demo-admin-key-12345" \
  -d '{"emojiId": "fire", "label": "Fire", "symbol": "🔥"}'

curl -X POST http://localhost:5000/api/reactions \
  -H "Content-Type: application/json" \
  -H "x-admin-key: demo-admin-key-12345" \
  -d '{"emojiId": "star", "label": "Star", "symbol": "⭐"}'

curl -X POST http://localhost:5000/api/reactions \
  -H "Content-Type: application/json" \
  -H "x-admin-key: demo-admin-key-12345" \
  -d '{"emojiId": "rocket", "label": "Rocket", "symbol": "🚀"}'

curl -X POST http://localhost:5000/api/reactions \
  -H "Content-Type: application/json" \
  -H "x-admin-key: demo-admin-key-12345" \
  -d '{"emojiId": "party", "label": "Party", "symbol": "🎉"}'
```

## 4. Access the Application

- **Main App:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/#admin (password: `admin123`)
- **API Health:** http://localhost:5000/health
- **All Reactions:** http://localhost:5000/api/reactions
- **Events Log:** http://localhost:5000/api/reactions/events

## Key Files

| File | Purpose |
|------|---------|
| [backend/server.js](backend/server.js) | Express API with all endpoints |
| [backend/models/EmojiReaction.js](backend/models/EmojiReaction.js) | MongoDB schema |
| [backend/config.js](backend/config.js) | Configuration loader |
| [frontend/src/components/EmojiGrid.jsx](frontend/src/components/EmojiGrid.jsx) | Main emoji display |
| [frontend/src/components/AdminPage.jsx](frontend/src/components/AdminPage.jsx) | Admin interface |
| [frontend/src/App.jsx](frontend/src/App.jsx) | Route handler |

## Common Commands

```bash
# Backend development (with auto-reload)
cd backend && npm run dev

# Frontend development (with hot reload)
cd frontend && npm run dev

# Build frontend for production
cd frontend && npm run build

# Start backend in production
cd backend && npm start
```

## Default Credentials

- **Admin Password:** `admin123`
- **Admin API Key:** `demo-admin-key-12345`

**⚠️ Change these in production!**
