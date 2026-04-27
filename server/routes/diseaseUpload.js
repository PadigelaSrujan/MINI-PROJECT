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
const mockDiseaseResults = [
  {
    diseaseName: 'Leaf Spot (Cercospora)',
    confidence: 89,
    affectedCrop: 'Groundnut',
    severity: 'Moderate',
    symptoms: [
      'Small, circular brown spots on leaves',
      'Yellow halo around the spots',
      'Premature leaf fall',
    ],
    treatment: [
      'Spray Carbendazim (0.1%) or Mancozeb (0.2%)',
      'Ensure proper crop rotation',
      'Remove and destroy infected plant debris',
    ],
  },
  {
    diseaseName: 'Late Blight',
    confidence: 94,
    affectedCrop: 'Potato/Tomato',
    severity: 'High',
    symptoms: [
      'Irregular, dark, water-soaked spots on leaves',
      'White fungal growth on the underside of leaves',
      'Rapid wilting and browning of foliage',
    ],
    treatment: [
      'Apply fungicides containing Mancozeb or Chlorothalonil',
      'Improve air circulation around plants',
      'Avoid overhead watering',
    ],
  },
  {
    diseaseName: 'Powdery Mildew',
    confidence: 82,
    affectedCrop: 'Various (Wheat, Vegetables)',
    severity: 'Low to Moderate',
    symptoms: [
      'White or gray powdery spots on leaves and stems',
      'Curling or yellowing of leaves',
      'Stunted growth',
    ],
    treatment: [
      'Apply wettable sulfur or neem oil',
      'Ensure adequate spacing between plants',
      'Plant resistant varieties in the future',
    ],
  },
  {
    diseaseName: 'Healthy Plant',
    confidence: 98,
    affectedCrop: 'Unknown',
    severity: 'None',
    symptoms: [
      'Leaves are uniformly green and vibrant',
      'No visible spots or discoloration',
      'Normal growth pattern',
    ],
    treatment: [
      'Continue regular watering and fertilization schedule',
      'Maintain good field hygiene',
      'Monitor periodically for any changes',
    ],
  }
];

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Return a random mock analysis
    const analysis = mockDiseaseResults[Math.floor(Math.random() * mockDiseaseResults.length)];

    res.json({
      success: true,
      imageUrl: `/uploads/${req.file.filename}`,
      analysis,
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to analyze image for disease' });
  }
});

module.exports = router;
