const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const predictRoutes = require('./routes/predict');
const analyticsRoutes = require('./routes/analytics');
const feedbackRoutes = require('./routes/feedback');
const imageUploadRoutes = require('./routes/imageUpload');
const diseaseUploadRoutes = require('./routes/diseaseUpload');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/predict', predictRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/image-upload', imageUploadRoutes);
app.use('/api/disease-upload', diseaseUploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-agriculture')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🌾 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.warn('⚠️  MongoDB connection failed, starting server without DB:', err.message);
    // Start server anyway so the app works without MongoDB (data won't persist)
    app.listen(PORT, () => {
      console.log(`🌾 Server running on http://localhost:${PORT} (no DB)`);
    });
  });
