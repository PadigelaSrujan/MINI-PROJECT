import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiDollarSign, FiTrendingUp, FiArrowLeft, FiAward } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'];

// Crop image mapping using free Unsplash images
const cropImages = {
  'Rice': 'https://images.unsplash.com/photo-1536304993881-460346204399?w=400&h=300&fit=crop&q=80',
  'Wheat': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&q=80',
  'Maize': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop&q=80',
  'Cotton': 'https://images.unsplash.com/photo-1616431101494-1e09a3ce0bf5?w=400&h=300&fit=crop&q=80',
  'Sugarcane': 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop&q=80',
  'Groundnut': 'https://images.unsplash.com/photo-1567892737950-30c4db37cd89?w=400&h=300&fit=crop&q=80',
  'Tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop&q=80',
  'Chilli': 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&h=300&fit=crop&q=80',
  'Turmeric': 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop&q=80',
  'Soybean': 'https://images.unsplash.com/photo-1599709877566-1862e1849794?w=400&h=300&fit=crop&q=80',
  'Mustard': 'https://images.unsplash.com/photo-1563746098251-d35aef196e83?w=400&h=300&fit=crop&q=80',
  'Sunflower': 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&h=300&fit=crop&q=80',
  'Potato': 'https://images.unsplash.com/photo-1518977676601-b53f82ber83b?w=400&h=300&fit=crop&q=80',
  'Onion': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&h=300&fit=crop&q=80',
  'Jute': 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=300&fit=crop&q=80',
};

// Crop emoji fallbacks
const cropEmojis = {
  'Rice': '🌾', 'Wheat': '🌾', 'Maize': '🌽', 'Cotton': '☁️', 'Sugarcane': '🎋',
  'Groundnut': '🥜', 'Tomato': '🍅', 'Chilli': '🌶️', 'Turmeric': '🟡', 'Soybean': '🫘',
  'Mustard': '🌻', 'Sunflower': '🌻', 'Potato': '🥔', 'Onion': '🧅', 'Jute': '🌿',
};

const scoreColor = (score) => {
  if (score >= 80) return 'from-green-500 to-emerald-500';
  if (score >= 60) return 'from-yellow-500 to-amber-500';
  return 'from-orange-500 to-red-400';
};

const scoreBorder = (score) => {
  if (score >= 80) return 'border-green-200 hover:border-green-300';
  if (score >= 60) return 'border-yellow-200 hover:border-yellow-300';
  return 'border-orange-200 hover:border-orange-300';
};

function parseYield(yieldStr) {
  if (!yieldStr) return 20;
  const match = yieldStr.match(/(\d+)\s*-\s*(\d+)/);
  if (match) return (parseInt(match[1]) + parseInt(match[2])) / 2;
  return 20;
}

function parsePrice(priceStr) {
  if (!priceStr) return 2000;
  const match = priceStr.match(/(\d[\d,]*)\s*-\s*(\d[\d,]*)/);
  if (match) return (parseInt(match[1].replace(/,/g, '')) + parseInt(match[2].replace(/,/g, ''))) / 2;
  return 2000;
}

function CropImage({ cropName }) {
  const [imgError, setImgError] = React.useState(false);
  const url = cropImages[cropName];
  const emoji = cropEmojis[cropName] || '🌱';

  if (!url || imgError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
        <span className="text-5xl">{emoji}</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={cropName}
      className="w-full h-full object-cover"
      onError={() => setImgError(true)}
      loading="lazy"
    />
  );
}

function Results() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { results = [], inputs = {} } = location.state || {};

  if (results.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center glass-card p-12 max-w-md">
          <div className="text-6xl mb-4">🌱</div>
          <h2 className="font-heading text-xl font-bold text-primary-800 mb-2">{t('results.noCrops')}</h2>
          <button onClick={() => navigate('/input')} className="btn-primary mt-6 inline-flex items-center gap-2">
            <FiArrowLeft /> {t('results.tryAgain')}
          </button>
        </motion.div>
      </div>
    );
  }

  const yieldData = results.map((r) => ({ name: r.crop, yield: parseYield(r.yieldPerAcre) }));
  const profitData = results.map((r) => ({
    name: r.crop,
    profit: Math.round(parseYield(r.yieldPerAcre) * parsePrice(r.estimatedPrice) * (inputs.acres || 1) / 100),
  }));

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-900 mb-3">{t('results.title')}</h1>
          <p className="text-earth-500 text-lg">{t('results.subtitle')}</p>
        </motion.div>

        {/* Crop Cards */}
        <div className="space-y-8 mb-12">
          {results.map((crop, i) => (
            <motion.div
              key={crop.crop}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className={`crop-card border-2 ${scoreBorder(crop.score)} overflow-hidden`}
            >
              {/* Top section: Image + Score + Name */}
              <div className="flex flex-col md:flex-row gap-0">
                {/* Crop Image */}
                <div className="md:w-52 h-48 md:h-auto flex-shrink-0 overflow-hidden rounded-t-[18px] md:rounded-t-none md:rounded-l-[18px] relative -m-6 md:-m-6 mb-4 md:mb--6 mr-0 md:mr-4">
                  <CropImage cropName={crop.crop} />
                  {/* Rank Badge */}
                  <div className="absolute top-3 left-3">
                    {i === 0 ? (
                      <div className="flex items-center gap-1.5 bg-gold-500 text-primary-950 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        <FiAward size={14} /> {t('results.bestMatch')}
                      </div>
                    ) : (
                      <div className="bg-white/90 backdrop-blur-sm text-primary-800 text-xs font-bold px-3 py-1.5 rounded-full shadow">
                        {t('results.rank')} #{i + 1}
                      </div>
                    )}
                  </div>
                  {/* Score overlay */}
                  <div className="absolute bottom-3 right-3">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${scoreColor(crop.score)} text-white flex flex-col items-center justify-center shadow-lg`}>
                      <span className="text-lg font-extrabold leading-none">{crop.score}</span>
                      <span className="text-[9px] font-semibold opacity-80">SCORE</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-2 md:pt-0 md:pl-2">
                  {/* Crop Name + Price/Yield */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{cropEmojis[crop.crop] || '🌱'}</span>
                      <h3 className="font-heading text-2xl font-bold text-primary-900">{crop.crop}</h3>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center gap-1.5 text-sm">
                        <FiDollarSign className="text-gold-600" size={15} />
                        <span className="text-earth-500">{t('results.estimatedPrice')}:</span>
                        <span className="font-bold text-primary-800">{crop.estimatedPrice}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <FiTrendingUp className="text-primary-500" size={15} />
                        <span className="text-earth-500">{t('results.yieldPerAcre')}:</span>
                        <span className="font-bold text-primary-800">{crop.yieldPerAcre}</span>
                      </div>
                    </div>
                  </div>

                  {/* Advantages / Disadvantages */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-xl p-4">
                      <h4 className="font-heading font-semibold text-green-800 mb-2 flex items-center gap-1.5 text-sm">
                        <FiCheckCircle className="text-green-500" /> {t('results.advantages')}
                      </h4>
                      <ul className="space-y-1">
                        {crop.advantages.map((a, j) => (
                          <li key={j} className="text-xs text-green-700 flex items-start gap-1.5">
                            <span className="text-green-400 mt-0.5">•</span> {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4">
                      <h4 className="font-heading font-semibold text-red-800 mb-2 flex items-center gap-1.5 text-sm">
                        <FiAlertCircle className="text-red-500" /> {t('results.disadvantages')}
                      </h4>
                      <ul className="space-y-1">
                        {crop.disadvantages.map((d, j) => (
                          <li key={j} className="text-xs text-red-700 flex items-start gap-1.5">
                            <span className="text-red-400 mt-0.5">•</span> {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="font-heading text-lg font-bold text-primary-900 mb-4">📊 {t('results.yieldComparison')}</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #dcfce7' }}
                  formatter={(val) => [`${val} quintals`, 'Avg Yield']}
                />
                <Bar dataKey="yield" radius={[8, 8, 0, 0]}>
                  {yieldData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <h3 className="font-heading text-lg font-bold text-primary-900 mb-4">💰 {t('results.profitAnalysis')}</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={profitData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  dataKey="profit"
                  nameKey="name"
                  label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                  labelLine={false}
                >
                  {profitData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`₹${val.toLocaleString()}`, 'Est. Profit']} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button onClick={() => navigate('/input')} className="btn-primary inline-flex items-center gap-2 text-lg">
            <FiArrowLeft /> {t('results.tryAgain')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;
