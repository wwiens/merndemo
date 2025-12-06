const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const EmojiReaction = require('./models/EmojiReaction');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiter for increment endpoint
const incrementLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: 'Too many increment requests, please slow down'
});

// Admin key validation middleware
const requireAdminKey = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'] || req.body.adminKey;

  if (adminKey !== config.adminKey) {
    return res.status(403).json({ error: 'Invalid admin key' });
  }

  next();
};

// MongoDB connection
mongoose.connect(config.mongoUri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes

/**
 * GET /api/reactions
 * Fetch all emoji reactions sorted by label
 */
app.get('/api/reactions', async (req, res) => {
  try {
    const reactions = await EmojiReaction.find()
      .sort({ label: 1 })
      .select('-events'); // Exclude events array for performance

    res.json(reactions);
  } catch (error) {
    console.error('Error fetching reactions:', error);
    res.status(500).json({ error: 'Failed to fetch reactions' });
  }
});

/**
 * POST /api/reactions/:id/increment
 * Increment the count for a specific emoji
 */
app.post('/api/reactions/:id/increment', incrementLimiter, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid emoji ID' });
    }

    const reaction = await EmojiReaction.findOne({ emojiId: id });

    if (!reaction) {
      return res.status(404).json({ error: 'Emoji not found' });
    }

    // Increment count and log event
    reaction.count += 1;
    reaction.events.push({
      timestamp: new Date(),
      incrementedBy: req.ip
    });

    await reaction.save();

    res.json({
      emojiId: reaction.emojiId,
      count: reaction.count
    });
  } catch (error) {
    console.error('Error incrementing reaction:', error);
    res.status(500).json({ error: 'Failed to increment reaction' });
  }
});

/**
 * POST /api/reactions/reset
 * Reset all emoji counts to zero (admin only)
 */
app.post('/api/reactions/reset', requireAdminKey, async (req, res) => {
  try {
    await EmojiReaction.updateMany({}, { count: 0, events: [] });

    res.json({ message: 'All counts reset successfully' });
  } catch (error) {
    console.error('Error resetting counts:', error);
    res.status(500).json({ error: 'Failed to reset counts' });
  }
});

/**
 * POST /api/reactions
 * Create a new emoji entry (admin only)
 */
app.post('/api/reactions', requireAdminKey, async (req, res) => {
  try {
    const { emojiId, label, symbol } = req.body;

    // Validate required fields
    if (!emojiId || !label || !symbol) {
      return res.status(400).json({
        error: 'Missing required fields: emojiId, label, symbol'
      });
    }

    // Check if emoji already exists
    const existing = await EmojiReaction.findOne({ emojiId });
    if (existing) {
      return res.status(409).json({ error: 'Emoji ID already exists' });
    }

    const newReaction = new EmojiReaction({
      emojiId,
      label,
      symbol,
      count: 0,
      events: []
    });

    await newReaction.save();

    res.status(201).json(newReaction);
  } catch (error) {
    console.error('Error creating reaction:', error);
    res.status(500).json({ error: 'Failed to create reaction' });
  }
});

/**
 * GET /api/reactions/events
 * Get last N increment events across all emojis
 */
app.get('/api/reactions/events', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const reactions = await EmojiReaction.find()
      .select('emojiId label symbol events');

    // Flatten all events with emoji info
    const allEvents = [];
    reactions.forEach(reaction => {
      reaction.events.forEach(event => {
        allEvents.push({
          emojiId: reaction.emojiId,
          label: reaction.label,
          symbol: reaction.symbol,
          timestamp: event.timestamp,
          incrementedBy: event.incrementedBy
        });
      });
    });

    // Sort by timestamp descending and limit
    allEvents.sort((a, b) => b.timestamp - a.timestamp);
    const limitedEvents = allEvents.slice(0, limit);

    res.json(limitedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
