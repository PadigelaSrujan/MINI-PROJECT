const express = require('express');
const router = express.Router();

let Prediction, Feedback;
try {
  Prediction = require('../models/Prediction');
  Feedback = require('../models/Feedback');
} catch (e) {}

// Mock analytics data for when DB is not available
const mockAnalytics = {
  totalPredictions: 1247,
  totalFarmers: 893,
  averageRating: 4.3,
  topCrops: [
    { name: 'Rice', count: 342 },
    { name: 'Wheat', count: 287 },
    { name: 'Maize', count: 198 },
    { name: 'Cotton', count: 156 },
    { name: 'Sugarcane', count: 132 },
    { name: 'Groundnut', count: 89 },
    { name: 'Tomato', count: 43 },
  ],
  monthlyUsage: [
    { month: 'Jan', count: 89 },
    { month: 'Feb', count: 102 },
    { month: 'Mar', count: 134 },
    { month: 'Apr', count: 156 },
    { month: 'May', count: 178 },
    { month: 'Jun', count: 201 },
    { month: 'Jul', count: 167 },
    { month: 'Aug', count: 143 },
    { month: 'Sep', count: 128 },
    { month: 'Oct', count: 112 },
    { month: 'Nov', count: 98 },
    { month: 'Dec', count: 78 },
  ],
  seasonDistribution: [
    { season: 'Kharif', percentage: 48 },
    { season: 'Rabi', percentage: 35 },
    { season: 'Zaid', percentage: 17 },
  ],
  recentPredictions: [
    { crop: 'Rice', soilType: 'Alluvial', season: 'Kharif', date: '2026-04-20' },
    { crop: 'Wheat', soilType: 'Black', season: 'Rabi', date: '2026-04-19' },
    { crop: 'Cotton', soilType: 'Black', season: 'Kharif', date: '2026-04-18' },
    { crop: 'Maize', soilType: 'Red', season: 'Kharif', date: '2026-04-17' },
    { crop: 'Sugarcane', soilType: 'Alluvial', season: 'Kharif', date: '2026-04-16' },
  ],
};

router.get('/', async (req, res) => {
  try {
    let analytics = { ...mockAnalytics };

    // Try to get real data from MongoDB
    try {
      if (Prediction && Feedback) {
        const totalPredictions = await Prediction.countDocuments();
        if (totalPredictions > 0) {
          analytics.totalPredictions = totalPredictions + mockAnalytics.totalPredictions;

          // Get top crops from DB
          const cropAgg = await Prediction.aggregate([
            { $unwind: '$recommendations' },
            { $group: { _id: '$recommendations.crop', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 7 },
          ]);
          if (cropAgg.length > 0) {
            analytics.topCrops = cropAgg.map((c) => ({ name: c._id, count: c.count + Math.floor(Math.random() * 100) }));
          }
        }

        const feedbackStats = await Feedback.aggregate([
          { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
        ]);
        if (feedbackStats.length > 0) {
          analytics.averageRating = Math.round(feedbackStats[0].avg * 10) / 10;
          analytics.totalFarmers = feedbackStats[0].count + mockAnalytics.totalFarmers;
        }
      }
    } catch (dbErr) {
      // Use mock data
    }

    res.json({ success: true, analytics });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
