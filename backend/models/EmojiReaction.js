const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  incrementedBy: String
}, { _id: false });

const emojiReactionSchema = new mongoose.Schema({
  emojiId: {
    type: String,
    required: true,
    unique: true
  },
  label: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  events: [eventSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('EmojiReaction', emojiReactionSchema);
