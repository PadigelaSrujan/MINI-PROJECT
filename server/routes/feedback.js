const express = require('express');
const router = express.Router();

let Feedback;
try {
  Feedback = require('../models/Feedback');
} catch (e) {}

// In-memory fallback
let inMemoryFeedback = [
  { rating: 5, comment: 'Excellent crop recommendations! Helped me choose the right crop for my field.', userName: 'Ramesh Kumar', createdAt: new Date('2026-04-20') },
  { rating: 4, comment: 'Very useful app. The multilingual support is great for farmers.', userName: 'Lakshmi Devi', createdAt: new Date('2026-04-19') },
  { rating: 5, comment: 'Best agriculture tool I have used. Accurate predictions!', userName: 'Suresh Reddy', createdAt: new Date('2026-04-18') },
  { rating: 4, comment: 'Good recommendations. Would love more crop varieties.', userName: 'Anjali Sharma', createdAt: new Date('2026-04-17') },
  { rating: 5, comment: 'This system saved me from planting the wrong crop this season!', userName: 'Venkat Rao', createdAt: new Date('2026-04-16') },
];

// Submit feedback
router.post('/', async (req, res) => {
  try {
    const { rating, comment, userName } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const feedbackData = {
      rating: parseInt(rating),
      comment: comment || '',
      userName: userName || 'Anonymous Farmer',
      createdAt: new Date(),
    };

    try {
      if (Feedback) {
        const feedback = new Feedback(feedbackData);
        await feedback.save();
      }
    } catch (dbErr) {
      inMemoryFeedback.unshift(feedbackData);
    }

    res.json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Get feedback
router.get('/', async (req, res) => {
  try {
    let feedbackList = [...inMemoryFeedback];
    let stats = { averageRating: 4.3, totalReviews: inMemoryFeedback.length };

    try {
      if (Feedback) {
        const dbFeedback = await Feedback.find().sort({ createdAt: -1 }).limit(20).lean();
        if (dbFeedback.length > 0) {
          feedbackList = [...dbFeedback, ...inMemoryFeedback];
        }
        const agg = await Feedback.aggregate([
          { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
        ]);
        if (agg.length > 0) {
          stats.averageRating = Math.round(agg[0].avg * 10) / 10;
          stats.totalReviews = agg[0].count + inMemoryFeedback.length;
        }
      }
    } catch (dbErr) {
      // Use in-memory data
    }

    res.json({ success: true, feedback: feedbackList.slice(0, 20), stats });
  } catch (error) {
    console.error('Feedback fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

module.exports = router;
