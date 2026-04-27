const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  inputs: {
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    rainfall: { type: Number, required: true },
    soilType: { type: String, required: true },
    phLevel: { type: Number, required: true },
    acres: { type: Number, required: true },
    season: { type: String, required: true },
  },
  recommendations: [
    {
      crop: String,
      score: Number,
      advantages: [String],
      disadvantages: [String],
      estimatedPrice: String,
      yieldPerAcre: String,
    },
  ],
  language: { type: String, default: 'en' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Prediction', predictionSchema);
