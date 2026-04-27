import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiUsers, FiStar, FiBarChart2 } from 'react-icons/fi';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';

const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#facc15', '#f59e0b'];

const defaultAnalytics = {
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
};

function Analytics() {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState(defaultAnalytics);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAnalytics(data.analytics);
      })
      .catch(() => {});
  }, []);

  const statCards = [
    { icon: <FiBarChart2 />, value: analytics.totalPredictions.toLocaleString(), label: t('analytics.totalPredictions'), gradient: 'from-primary-500 to-primary-600' },
    { icon: <FiUsers />, value: analytics.totalFarmers.toLocaleString(), label: t('analytics.totalFarmers'), gradient: 'from-emerald-500 to-teal-600' },
    { icon: <FiStar />, value: `${analytics.averageRating} ★`, label: t('analytics.avgRating'), gradient: 'from-gold-500 to-gold-600' },
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-900 mb-3">{t('analytics.title')}</h1>
          <p className="text-earth-500 text-lg">{t('analytics.subtitle')}</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 flex items-center gap-4"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white text-xl shadow-md`}>
                {card.icon}
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-primary-900">{card.value}</p>
                <p className="text-sm text-earth-500">{card.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Usage Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h3 className="font-heading text-lg font-bold text-primary-900 mb-4 flex items-center gap-2">
              <FiTrendingUp className="text-primary-500" /> {t('analytics.usageTrends')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #dcfce7' }} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ fill: '#16a34a', r: 4 }}
                  activeDot={{ r: 6, fill: '#15803d' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Top Crops Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="font-heading text-lg font-bold text-primary-900 mb-4">
              🌾 {t('analytics.topCrops')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.topCrops} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#dcfce7" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #dcfce7' }} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {analytics.topCrops.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Season Distribution Pie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6 lg:col-span-2"
          >
            <h3 className="font-heading text-lg font-bold text-primary-900 mb-4">
              🌦️ {t('analytics.seasonDistribution')}
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <ResponsiveContainer width={300} height={280}>
                <PieChart>
                  <Pie
                    data={analytics.seasonDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    innerRadius={60}
                    dataKey="percentage"
                    nameKey="season"
                    label={({ season, percentage }) => `${season}: ${percentage}%`}
                  >
                    {analytics.seasonDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`${val}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {analytics.seasonDistribution.map((s, i) => (
                  <div key={s.season} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="font-medium text-primary-800">{s.season}</span>
                    <span className="text-earth-500">— {s.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
