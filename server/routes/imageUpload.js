const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Mock AI analysis responses
const mockAnalysisResults = [
  {
    detectedSoilType: 'Alluvial Soil',
    soilHealth: 'Good',
    confidence: 87,
    suggestedCrops: ['Rice', 'Wheat', 'Sugarcane'],
    observations: [
      'Rich organic matter detected in the soil',
      'Good water retention capacity observed',
      'Suitable for most cereal crops',
      'pH level appears neutral (6.5-7.0)',
    ],
  },
  {
    detectedSoilType: 'Black Cotton Soil',
    soilHealth: 'Very Good',
    confidence: 92,
    suggestedCrops: ['Cotton', 'Soybean', 'Maize'],
    observations: [
      'High clay content detected',
      'Excellent moisture retention',
      'Rich in minerals like calcium and magnesium',
      'Ideal for deep-rooted crops',
    ],
  },
  {
    detectedSoilType: 'Red Laterite Soil',
    soilHealth: 'Moderate',
    confidence: 78,
    suggestedCrops: ['Groundnut', 'Tomato', 'Chilli'],
    observations: [
      'Iron-rich soil detected',
      'Well-drained soil structure',
      'May need organic matter supplementation',
      'Suitable for horticultural crops',
    ],
  },
  {
    detectedSoilType: 'Sandy Loam',
    soilHealth: 'Moderate',
    confidence: 83,
    suggestedCrops: ['Groundnut', 'Potato', 'Mustard'],
    observations: [
      'Light textured soil detected',
      'Good drainage but low water retention',
      'Needs regular fertilization',
      'Best for root vegetables and oilseeds',
    ],
  },
];

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Return a random mock analysis
    const analysis = mockAnalysisResults[Math.floor(Math.random() * mockAnalysisResults.length)];

    res.json({
      success: true,
      imageUrl: `/uploads/${req.file.filename}`,
      analysis,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

module.exports = router;
