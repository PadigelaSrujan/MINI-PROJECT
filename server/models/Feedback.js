const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  userName: { type: String, default: 'Anonymous Farmer' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feedback', feedbackSchema);
