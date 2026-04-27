import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const languageOptions = [
  { code: 'en', name: 'English', native: 'English', emoji: '🇬🇧', script: 'Aa' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', emoji: '🇮🇳', script: 'తె' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', emoji: '🇮🇳', script: 'हि' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', emoji: '🇮🇳', script: 'த' },
];

function LanguageSelection() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const selectLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    navigate('/input');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center"
      >
        <div className="inline-flex items-center gap-2 bg-primary-100 rounded-full px-4 py-2 mb-6">
          <span className="text-2xl">🌍</span>
          <span className="text-sm font-medium text-primary-700">Multi-Language Support</span>
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-900 mb-3">
          {t('language.title')}
        </h1>
        <p className="text-earth-500 mb-10 text-lg">
          {t('language.subtitle')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {languageOptions.map((lang, i) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => selectLanguage(lang.code)}
              className={`glass-card p-6 flex items-center gap-4 text-left cursor-pointer group ${
                i18n.language === lang.code
                  ? 'border-2 border-primary-400 bg-primary-50/80 shadow-glow'
                  : ''
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-primary-700">{lang.script}</span>
              </div>
              <div>
                <p className="font-heading font-bold text-lg text-primary-800 group-hover:text-primary-600 transition-colors">
                  {lang.native}
                </p>
                <p className="text-sm text-earth-500">{lang.name}</p>
              </div>
              {i18n.language === lang.code && (
                <div className="ml-auto w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default LanguageSelection;
