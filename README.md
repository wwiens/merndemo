# Emoji Reactions MERN Application

A full-stack emoji reaction counter built with MongoDB, Express, React, and Node.js.

## Features

- Interactive emoji grid with real-time click counting
- Smooth animations on emoji interactions
- Admin panel for managing emojis and resetting counts
- Rate limiting to prevent abuse
- Audit trail of all increment events
- MongoDB Atlas integration

## Project Structure

```
.
├── backend/
│   ├── models/
│   │   └── EmojiReaction.js
│   ├── config.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmojiGrid.jsx
│   │   │   ├── EmojiGrid.css
│   │   │   ├── AdminPage.jsx
│   │   │   └── AdminPage.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── mndb.txt (MongoDB credentials - not committed)
└── requirements.md
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (connection string in mndb.txt)

## Setup Instructions

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configure MongoDB

The application reads MongoDB credentials from `mndb.txt` in the root directory. This file should contain:

```
Username: your_username
Password: your_password
```

Alternatively, set the `MONGO_URI` environment variable:

```bash
export MONGO_URI="mongodb+srv://username:password@cluster0.yqwqot.mongodb.net/?appName=Cluster0"
```

### 3. Seed Initial Data (Optional)

To populate the database with initial emoji reactions, you can use the admin panel or create them via API:

```bash
curl -X POST http://localhost:5000/api/reactions \
  -H "Content-Type: application/json" \
  -H "x-admin-key: demo-admin-key-12345" \
  -d '{
    "emojiId": "heart",
    "label": "Heart",
    "symbol": "❤️"
  }'
```

## Running the Application

### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:3000`

### Production Build

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Serve from Backend:**
The backend can serve the built frontend files. Configure Express to serve static files from `frontend/dist`.

## API Endpoints

### Public Endpoints

- `GET /api/reactions` - Fetch all emoji reactions
- `POST /api/reactions/:id/increment` - Increment count (rate limited: 30/min)
- `GET /api/reactions/events?limit=50` - Get recent increment events
- `GET /health` - Health check

### Admin Endpoints (require `x-admin-key` header)

- `POST /api/reactions` - Create new emoji
- `POST /api/reactions/reset` - Reset all counts to zero

**Admin Key:** `demo-admin-key-12345` (change in production via `ADMIN_KEY` env var)

## Admin Panel

Access the admin panel at `http://localhost:3000/#admin`

**Default Password:** `admin123`

Features:
- Reset all emoji counts
- Create new emoji reactions

## Configuration Options

### Backend Environment Variables

- `MONGO_URI` - MongoDB connection string (overrides mndb.txt)
- `ADMIN_KEY` - Admin authentication key (default: demo-admin-key-12345)
- `PORT` - Server port (default: 5000)

### Frontend Configuration

Edit [vite.config.js](frontend/vite.config.js) to change proxy settings or port.

## Security Features

- CORS enabled for local development
- Rate limiting on increment endpoint (30 requests/minute)
- Admin key authentication for write operations
- Input validation on all endpoints
- MongoDB connection credential management

## Testing the Application

### Manual Testing

1. Start both backend and frontend
2. Visit `http://localhost:3000`
3. Click emojis to increment counts
4. Visit `http://localhost:3000/#admin` to access admin features
5. Check `http://localhost:5000/api/reactions/events` for audit trail

### Create Sample Emojis

```bash
# Heart
curl -X POST http://localhost:5000/api/reactions \
  -H "Content-Type: application/json" \
  -H "x-admin-key: demo-admin-key-12345" \
  -d '{"emojiId": "heart", "label": "Heart", "symbol": "❤️"}'

# Thumbs Up
curl -X POST http://localhost:5000/api/reactions \
  -H "Content-Type: application/json" \
  -H "x-admin-key: demo-admin-key-12345" \
  -d '{"emojiId": "thumbs-up", "label": "Thumbs Up", "symbol": "👍"}'

# Fire
curl -X POST http://localhost:5000/api/reactions \
  -H "Content-Type: application/json" \
  -H "x-admin-key: demo-admin-key-12345" \
  -d '{"emojiId": "fire", "label": "Fire", "symbol": "🔥"}'

# Star
curl -X POST http://localhost:5000/api/reactions \
  -H "Content-Type: application/json" \
  -H "x-admin-key: demo-admin-key-12345" \
  -d '{"emojiId": "star", "label": "Star", "symbol": "⭐"}'
```

## Troubleshooting

### MongoDB Connection Issues

- Verify `mndb.txt` contains correct credentials
- Check MongoDB Atlas network access (whitelist your IP)
- Ensure cluster is running

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### CORS Errors

- Ensure backend is running before frontend
- Check proxy configuration in [vite.config.js](frontend/vite.config.js)

## License

MIT
# merndemo
