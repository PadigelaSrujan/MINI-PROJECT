import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiUsers, FiBarChart2, FiStar, FiArrowRight, FiTrendingUp, FiImage, FiMessageSquare } from 'react-icons/fi';
import { GiWheat, GiPlantSeed, GiFarmTractor } from 'react-icons/gi';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalFarmers: 893,
    totalPredictions: 1247,
    averageRating: 4.3,
  });

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats({
            totalFarmers: data.analytics.totalFarmers,
            totalPredictions: data.analytics.totalPredictions,
            averageRating: data.analytics.averageRating,
          });
        }
      })
      .catch(() => {});
  }, []);

  const statCards = [
    {
      icon: <FiUsers className="text-2xl" />,
      value: stats.totalFarmers.toLocaleString(),
      label: t('dashboard.totalFarmers'),
      color: 'from-primary-500 to-primary-600',
      bgLight: 'bg-primary-50',
    },
    {
      icon: <FiBarChart2 className="text-2xl" />,
      value: stats.totalPredictions.toLocaleString(),
      label: t('dashboard.totalPredictions'),
      color: 'from-emerald-500 to-teal-600',
      bgLight: 'bg-emerald-50',
    },
    {
      icon: <FiStar className="text-2xl" />,
      value: `${stats.averageRating} ★`,
      label: t('dashboard.avgRating'),
      color: 'from-gold-500 to-gold-600',
      bgLight: 'bg-yellow-50',
    },
  ];

  const quickLinks = [
    { to: '/analytics', icon: <FiTrendingUp />, label: t('dashboard.analytics'), color: 'text-emerald-600' },
    { to: '/feedback', icon: <FiMessageSquare />, label: t('dashboard.feedback'), color: 'text-blue-600' },
    { to: '/image-upload', icon: <FiImage />, label: t('dashboard.imageUpload'), color: 'text-purple-600' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient text-white py-20 md:py-28">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 opacity-10">
          <GiWheat className="text-[200px]" />
        </div>
        <div className="absolute bottom-10 left-10 opacity-10">
          <GiPlantSeed className="text-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <GiFarmTractor className="text-gold-400" />
              <span className="text-sm font-medium text-gold-400">{t('tagline')}</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('dashboard.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed">
              {t('dashboard.subtitle')}
            </p>
            <Link to="/language">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn-gold text-lg px-10 py-4 inline-flex items-center gap-3"
              >
                {t('dashboard.startButton')}
                <FiArrowRight className="text-xl" />
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L60 68C120 56 240 32 360 24C480 16 600 24 720 32C840 40 960 48 1080 44C1200 40 1320 24 1380 16L1440 8V80H0Z" fill="#f0fdf4" />
          </svg>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((card, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="glass-card p-6 flex items-center gap-4"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-md`}>
                {card.icon}
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-primary-900">{card.value}</p>
                <p className="text-sm text-earth-500">{card.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-heading text-2xl font-bold text-primary-900 mb-8 text-center"
        >
          {t('dashboard.quickLinks')}
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {quickLinks.map((link, i) => (
            <motion.div key={i} custom={i + 3} initial="hidden" animate="visible" variants={fadeUp}>
              <Link
                to={link.to}
                className="glass-card p-6 flex flex-col items-center gap-3 text-center group cursor-pointer"
              >
                <div className={`text-3xl ${link.color} group-hover:scale-110 transition-transform`}>
                  {link.icon}
                </div>
                <span className="font-heading font-semibold text-primary-800">{link.label}</span>
                <FiArrowRight className="text-earth-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
