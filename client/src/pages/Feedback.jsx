import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';

function Feedback() {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [stats, setStats] = useState({ averageRating: 4.3, totalReviews: 5 });

  useEffect(() => {
    fetch('/api/feedback')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFeedbackList(data.feedback);
          setStats(data.stats);
        }
      })
      .catch(() => {
        setFeedbackList([
          { rating: 5, comment: 'Excellent recommendations! Very accurate.', userName: 'Ramesh Kumar', createdAt: '2026-04-20' },
          { rating: 4, comment: 'Great multilingual support for farmers.', userName: 'Lakshmi Devi', createdAt: '2026-04-19' },
          { rating: 5, comment: 'Best agriculture tool. Highly recommend!', userName: 'Suresh Reddy', createdAt: '2026-04-18' },
        ]);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;
    setLoading(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment, userName: userName || 'Anonymous Farmer' }),
      });
    } catch (err) {}
    setSubmitted(true);
    setLoading(false);
    setFeedbackList((prev) => [
      { rating, comment, userName: userName || 'Anonymous Farmer', createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setComment('');
      setUserName('');
    }, 3000);
  };

  const renderStars = (count, size = 'text-xl') => {
    return Array.from({ length: 5 }, (_, i) => (
      <FiStar
        key={i}
        className={`${size} ${i < count ? 'fill-gold-500 text-gold-500' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-900 mb-3">{t('feedback.title')}</h1>
          <p className="text-earth-500 text-lg">{t('feedback.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Feedback Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass-card p-8">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="thanks"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8"
                  >
                    <div className="text-5xl mb-4">🎉</div>
                    <h3 className="font-heading text-xl font-bold text-primary-800">{t('feedback.thankYou')}</h3>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit}>
                    {/* Star Rating */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-primary-800 mb-3">{t('feedback.rateExperience')}</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            className="star"
                          >
                            <FiStar
                              className={`text-3xl transition-colors ${
                                star <= (hover || rating) ? 'fill-gold-500 text-gold-500' : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name */}
                    <div className="mb-4">
                      <label className="flex items-center gap-2 text-sm font-medium text-primary-800 mb-2">
                        <FiUser className="text-primary-500" /> {t('feedback.yourName')}
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder={t('feedback.namePlaceholder')}
                        className="input-field"
                      />
                    </div>

                    {/* Comment */}
                    <div className="mb-6">
                      <label className="flex items-center gap-2 text-sm font-medium text-primary-800 mb-2">
                        <FiMessageSquare className="text-primary-500" /> {t('feedback.yourComment')}
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={t('feedback.commentPlaceholder')}
                        rows={4}
                        className="input-field resize-none"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={rating === 0 || loading}
                      className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-50"
                    >
                      <FiSend /> {t('feedback.submit')}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="glass-card p-4 text-center">
                <p className="font-heading text-2xl font-bold text-primary-800">{stats.averageRating} ★</p>
                <p className="text-xs text-earth-500">{t('feedback.avgRating')}</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="font-heading text-2xl font-bold text-primary-800">{stats.totalReviews}</p>
                <p className="text-xs text-earth-500">{t('feedback.totalReviews')}</p>
              </div>
            </div>
          </motion.div>

          {/* Recent Feedback List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <h3 className="font-heading text-lg font-bold text-primary-900 mb-4">{t('feedback.recentFeedback')}</h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {feedbackList.map((fb, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-bold text-sm">
                        {(fb.userName || 'A')[0]}
                      </div>
                      <span className="font-medium text-primary-800 text-sm">{fb.userName}</span>
                    </div>
                    <div className="flex gap-0.5">{renderStars(fb.rating, 'text-sm')}</div>
                  </div>
                  {fb.comment && <p className="text-sm text-earth-600 leading-relaxed">{fb.comment}</p>}
                  <p className="text-xs text-earth-400 mt-2">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
