/**
 * Rule-Based Crop Recommendation Engine
 * Recommends crops based on temperature, humidity, rainfall, soil type, pH, and season.
 */

const cropDatabase = [
  {
    name: 'Rice',
    conditions: {
      tempRange: [20, 35],
      humidityRange: [60, 95],
      rainfallRange: [100, 300],
      soilTypes: ['Alluvial', 'Clay', 'Laterite'],
      phRange: [5.0, 7.5],
      seasons: ['Kharif'],
    },
    advantages: [
      'High demand staple food crop',
      'Good government support (MSP)',
      'Can be grown in waterlogged areas',
      'Multiple varieties available for different regions',
    ],
    disadvantages: [
      'Requires large amounts of water',
      'Labor intensive cultivation',
      'Prone to pest attacks',
      'Methane emissions from paddy fields',
    ],
    estimatedPrice: '₹2,200 - ₹2,800 per quintal',
    yieldPerAcre: '18 - 25 quintals',
  },
  {
    name: 'Wheat',
    conditions: {
      tempRange: [10, 25],
      humidityRange: [30, 70],
      rainfallRange: [25, 100],
      soilTypes: ['Alluvial', 'Clay', 'Black'],
      phRange: [6.0, 8.0],
      seasons: ['Rabi'],
    },
    advantages: [
      'India\'s second most important cereal crop',
      'Good MSP and market demand',
      'Mechanized farming possible',
      'Good storage life',
    ],
    disadvantages: [
      'Sensitive to high temperatures',
      'Requires irrigation in low rainfall areas',
      'Susceptible to rust diseases',
      'Cannot tolerate waterlogging',
    ],
    estimatedPrice: '₹2,100 - ₹2,600 per quintal',
    yieldPerAcre: '15 - 22 quintals',
  },
  {
    name: 'Maize',
    conditions: {
      tempRange: [18, 32],
      humidityRange: [40, 80],
      rainfallRange: [50, 200],
      soilTypes: ['Alluvial', 'Red', 'Sandy', 'Black'],
      phRange: [5.5, 7.5],
      seasons: ['Kharif', 'Rabi', 'Zaid'],
    },
    advantages: [
      'Can be grown in all three seasons',
      'Used for food, feed, and industrial purposes',
      'Drought tolerant varieties available',
      'Good intercropping potential',
    ],
    disadvantages: [
      'Susceptible to fall armyworm',
      'Needs well-drained soil',
      'Lower MSP compared to rice/wheat',
      'Storage can be challenging',
    ],
    estimatedPrice: '₹1,800 - ₹2,400 per quintal',
    yieldPerAcre: '20 - 30 quintals',
  },
  {
    name: 'Cotton',
    conditions: {
      tempRange: [25, 40],
      humidityRange: [40, 70],
      rainfallRange: [50, 150],
      soilTypes: ['Black', 'Alluvial', 'Red'],
      phRange: [6.0, 8.0],
      seasons: ['Kharif'],
    },
    advantages: [
      'High commercial value (White Gold)',
      'Strong textile industry demand',
      'Good export potential',
      'By-products like cottonseed oil are valuable',
    ],
    disadvantages: [
      'Highly susceptible to bollworm',
      'Requires significant pesticide use',
      'Water intensive crop',
      'Price fluctuations in market',
    ],
    estimatedPrice: '₹6,000 - ₹7,500 per quintal',
    yieldPerAcre: '6 - 10 quintals',
  },
  {
    name: 'Sugarcane',
    conditions: {
      tempRange: [20, 38],
      humidityRange: [50, 90],
      rainfallRange: [75, 250],
      soilTypes: ['Alluvial', 'Black', 'Red', 'Clay'],
      phRange: [5.5, 8.0],
      seasons: ['Kharif', 'Zaid'],
    },
    advantages: [
      'High yield per acre',
      'Sugar mills provide assured market',
      'Ratoon cropping saves replanting costs',
      'By-products: bagasse, molasses, ethanol',
    ],
    disadvantages: [
      'Long duration crop (12-18 months)',
      'Very water intensive',
      'Delayed payments from sugar mills',
      'High labor requirement for harvesting',
    ],
    estimatedPrice: '₹300 - ₹400 per quintal',
    yieldPerAcre: '300 - 450 quintals',
  },
  {
    name: 'Groundnut',
    conditions: {
      tempRange: [22, 35],
      humidityRange: [40, 70],
      rainfallRange: [40, 150],
      soilTypes: ['Sandy', 'Red', 'Alluvial'],
      phRange: [5.5, 7.0],
      seasons: ['Kharif', 'Rabi'],
    },
    advantages: [
      'Good source of edible oil',
      'Fixes nitrogen in soil',
      'Short duration crop (3-4 months)',
      'Good domestic and export demand',
    ],
    disadvantages: [
      'Susceptible to aflatoxin contamination',
      'Sensitive to waterlogging',
      'Prone to leaf spot and rust diseases',
      'Requires well-drained soil',
    ],
    estimatedPrice: '₹5,500 - ₹7,000 per quintal',
    yieldPerAcre: '8 - 14 quintals',
  },
  {
    name: 'Tomato',
    conditions: {
      tempRange: [18, 30],
      humidityRange: [40, 80],
      rainfallRange: [30, 130],
      soilTypes: ['Red', 'Alluvial', 'Sandy', 'Black'],
      phRange: [5.5, 7.5],
      seasons: ['Kharif', 'Rabi', 'Zaid'],
    },
    advantages: [
      'High market demand year-round',
      'Multiple harvests from single planting',
      'Can be grown in greenhouse/polyhouse',
      'Good for processed food industry',
    ],
    disadvantages: [
      'Highly perishable, short shelf life',
      'Price crashes during peak season',
      'Susceptible to many diseases',
      'Requires regular spraying and care',
    ],
    estimatedPrice: '₹800 - ₹3,000 per quintal (variable)',
    yieldPerAcre: '80 - 150 quintals',
  },
  {
    name: 'Chilli',
    conditions: {
      tempRange: [20, 35],
      humidityRange: [40, 75],
      rainfallRange: [50, 150],
      soilTypes: ['Black', 'Red', 'Sandy', 'Alluvial'],
      phRange: [5.5, 7.0],
      seasons: ['Kharif', 'Rabi'],
    },
    advantages: [
      'High value spice crop',
      'Good domestic and export demand',
      'Can be dried for longer shelf life',
      'Growing demand for chilli-based products',
    ],
    disadvantages: [
      'Susceptible to fruit rot and leaf curl',
      'Labor intensive harvesting',
      'Price volatility in market',
      'Requires careful water management',
    ],
    estimatedPrice: '₹8,000 - ₹15,000 per quintal (dry)',
    yieldPerAcre: '5 - 10 quintals (dry)',
  },
  {
    name: 'Turmeric',
    conditions: {
      tempRange: [20, 35],
      humidityRange: [60, 90],
      rainfallRange: [100, 250],
      soilTypes: ['Alluvial', 'Red', 'Clay', 'Laterite'],
      phRange: [5.0, 7.5],
      seasons: ['Kharif'],
    },
    advantages: [
      'High medicinal and commercial value',
      'Growing global demand for organic turmeric',
      'Good export potential',
      'Long storage life when dried',
    ],
    disadvantages: [
      'Long duration crop (7-9 months)',
      'Requires heavy rainfall or irrigation',
      'Processing (boiling, drying, polishing) is labor intensive',
      'Susceptible to rhizome rot',
    ],
    estimatedPrice: '₹7,000 - ₹12,000 per quintal',
    yieldPerAcre: '8 - 12 quintals (dry)',
  },
  {
    name: 'Soybean',
    conditions: {
      tempRange: [20, 35],
      humidityRange: [40, 80],
      rainfallRange: [60, 200],
      soilTypes: ['Black', 'Alluvial', 'Red'],
      phRange: [6.0, 7.5],
      seasons: ['Kharif'],
    },
    advantages: [
      'Rich in protein - versatile uses',
      'Fixes nitrogen in soil',
      'Good for oil extraction',
      'Short duration crop (3-4 months)',
    ],
    disadvantages: [
      'Susceptible to yellow mosaic virus',
      'Sensitive to waterlogging',
      'Requires specific Rhizobium inoculant',
      'Price affected by global soybean market',
    ],
    estimatedPrice: '₹4,000 - ₹5,500 per quintal',
    yieldPerAcre: '8 - 14 quintals',
  },
  {
    name: 'Mustard',
    conditions: {
      tempRange: [10, 25],
      humidityRange: [30, 60],
      rainfallRange: [20, 80],
      soilTypes: ['Alluvial', 'Sandy', 'Red'],
      phRange: [6.0, 8.0],
      seasons: ['Rabi'],
    },
    advantages: [
      'Important oilseed crop',
      'Low water requirement',
      'Short duration crop',
      'Good MSP support',
    ],
    disadvantages: [
      'Susceptible to aphid attacks',
      'Sensitive to frost during flowering',
      'Lower yield compared to other oilseeds',
      'Requires cool and dry weather',
    ],
    estimatedPrice: '₹5,000 - ₹6,500 per quintal',
    yieldPerAcre: '5 - 8 quintals',
  },
  {
    name: 'Sunflower',
    conditions: {
      tempRange: [20, 35],
      humidityRange: [30, 65],
      rainfallRange: [30, 120],
      soilTypes: ['Black', 'Red', 'Alluvial', 'Sandy'],
      phRange: [6.0, 8.0],
      seasons: ['Kharif', 'Rabi', 'Zaid'],
    },
    advantages: [
      'Can be grown in all seasons',
      'Photo-insensitive crop',
      'High quality edible oil',
      'Short duration (80-100 days)',
    ],
    disadvantages: [
      'Bird damage during seed formation',
      'Susceptible to downy mildew',
      'Requires bee pollination for good yield',
      'Competition from imported sunflower oil',
    ],
    estimatedPrice: '₹5,500 - ₹7,000 per quintal',
    yieldPerAcre: '4 - 8 quintals',
  },
  {
    name: 'Potato',
    conditions: {
      tempRange: [10, 25],
      humidityRange: [40, 80],
      rainfallRange: [30, 120],
      soilTypes: ['Alluvial', 'Sandy', 'Red'],
      phRange: [5.0, 6.5],
      seasons: ['Rabi'],
    },
    advantages: [
      'High yield per acre',
      'Short growing period (70-120 days)',
      'Huge domestic demand',
      'Processing industry (chips, fries) provides market',
    ],
    disadvantages: [
      'Highly perishable, needs cold storage',
      'Susceptible to late blight disease',
      'Price crashes during bumper harvest',
      'High input cost for seed and fertilizers',
    ],
    estimatedPrice: '₹500 - ₹1,500 per quintal',
    yieldPerAcre: '80 - 120 quintals',
  },
  {
    name: 'Onion',
    conditions: {
      tempRange: [15, 30],
      humidityRange: [40, 70],
      rainfallRange: [30, 100],
      soilTypes: ['Alluvial', 'Red', 'Sandy', 'Black'],
      phRange: [5.5, 7.0],
      seasons: ['Kharif', 'Rabi'],
    },
    advantages: [
      'Essential kitchen commodity - steady demand',
      'Good export potential',
      'Can be stored for months',
      'High profit during off-season',
    ],
    disadvantages: [
      'Extreme price volatility',
      'Susceptible to purple blotch and thrips',
      'Government export bans affect farmers',
      'Storage losses can be significant',
    ],
    estimatedPrice: '₹1,000 - ₹4,000 per quintal (variable)',
    yieldPerAcre: '60 - 100 quintals',
  },
  {
    name: 'Jute',
    conditions: {
      tempRange: [24, 37],
      humidityRange: [70, 95],
      rainfallRange: [150, 300],
      soilTypes: ['Alluvial', 'Clay', 'Laterite'],
      phRange: [5.5, 7.5],
      seasons: ['Kharif'],
    },
    advantages: [
      'Eco-friendly natural fiber',
      'Growing demand for biodegradable products',
      'Government supports jute packaging',
      'Good for crop rotation with rice',
    ],
    disadvantages: [
      'Labor intensive retting process',
      'Limited to high rainfall regions',
      'Competition from synthetic fibers',
      'Price dependent on government policy',
    ],
    estimatedPrice: '₹4,500 - ₹6,000 per quintal',
    yieldPerAcre: '8 - 12 quintals',
  },
];

/**
 * Calculate match score for a crop given the input conditions
 */
function calculateScore(crop, inputs) {
  const { temperature, humidity, rainfall, soilType, phLevel, season } = inputs;
  const c = crop.conditions;
  let score = 0;
  let maxScore = 0;

  // Temperature score (weight: 20)
  maxScore += 20;
  if (temperature >= c.tempRange[0] && temperature <= c.tempRange[1]) {
    const mid = (c.tempRange[0] + c.tempRange[1]) / 2;
    const range = (c.tempRange[1] - c.tempRange[0]) / 2;
    const dist = Math.abs(temperature - mid) / range;
    score += 20 * (1 - dist * 0.3);
  } else {
    const distLow = Math.max(0, c.tempRange[0] - temperature);
    const distHigh = Math.max(0, temperature - c.tempRange[1]);
    const dist = Math.min(distLow, distHigh);
    if (dist <= 5) score += 20 * (1 - dist / 5) * 0.3;
  }

  // Humidity score (weight: 15)
  maxScore += 15;
  if (humidity >= c.humidityRange[0] && humidity <= c.humidityRange[1]) {
    score += 15;
  } else {
    const distLow = Math.max(0, c.humidityRange[0] - humidity);
    const distHigh = Math.max(0, humidity - c.humidityRange[1]);
    const dist = Math.min(distLow, distHigh);
    if (dist <= 15) score += 15 * (1 - dist / 15) * 0.4;
  }

  // Rainfall score (weight: 20)
  maxScore += 20;
  if (rainfall >= c.rainfallRange[0] && rainfall <= c.rainfallRange[1]) {
    score += 20;
  } else {
    const distLow = Math.max(0, c.rainfallRange[0] - rainfall);
    const distHigh = Math.max(0, rainfall - c.rainfallRange[1]);
    const dist = Math.min(distLow, distHigh);
    if (dist <= 50) score += 20 * (1 - dist / 50) * 0.3;
  }

  // Soil type score (weight: 20)
  maxScore += 20;
  if (c.soilTypes.includes(soilType)) {
    score += 20;
  }

  // pH score (weight: 15)
  maxScore += 15;
  if (phLevel >= c.phRange[0] && phLevel <= c.phRange[1]) {
    score += 15;
  } else {
    const distLow = Math.max(0, c.phRange[0] - phLevel);
    const distHigh = Math.max(0, phLevel - c.phRange[1]);
    const dist = Math.min(distLow, distHigh);
    if (dist <= 1.5) score += 15 * (1 - dist / 1.5) * 0.3;
  }

  // Season score (weight: 10)
  maxScore += 10;
  if (c.seasons.includes(season)) {
    score += 10;
  }

  return Math.round((score / maxScore) * 100);
}

/**
 * Get crop recommendations sorted by score
 */
function recommendCrops(inputs) {
  const results = cropDatabase.map((crop) => ({
    crop: crop.name,
    score: calculateScore(crop, inputs),
    advantages: crop.advantages,
    disadvantages: crop.disadvantages,
    estimatedPrice: crop.estimatedPrice,
    yieldPerAcre: crop.yieldPerAcre,
  }));

  // Filter crops with score > 30 and sort by score descending
  return results
    .filter((r) => r.score > 30)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

module.exports = { recommendCrops, cropDatabase };
