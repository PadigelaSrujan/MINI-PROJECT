const express = require('express');
const router = express.Router();
const { recommendCrops } = require('../engine/cropRecommender');

// In-memory fallback when MongoDB is not available
let inMemoryPredictions = [];

let Prediction;
try {
  Prediction = require('../models/Prediction');
} catch (e) {
  Prediction = null;
}

router.post('/', async (req, res) => {
  try {
    const { temperature, humidity, rainfall, soilType, phLevel, acres, season, language } = req.body;

    // Validate inputs
    if (!temperature || !humidity || !rainfall || !soilType || !phLevel || !acres || !season) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const inputs = {
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      rainfall: parseFloat(rainfall),
      soilType,
      phLevel: parseFloat(phLevel),
      acres: parseFloat(acres),
      season,
    };

    const recommendations = recommendCrops(inputs);

    const predictionData = {
      inputs,
      recommendations,
      language: language || 'en',
      createdAt: new Date(),
    };

    // Try to save to MongoDB, fall back to in-memory
    try {
      if (Prediction) {
        const prediction = new Prediction(predictionData);
        await prediction.save();
      }
    } catch (dbErr) {
      inMemoryPredictions.push(predictionData);
    }

    res.json({
      success: true,
      recommendations,
      inputSummary: inputs,
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

module.exports = router;
