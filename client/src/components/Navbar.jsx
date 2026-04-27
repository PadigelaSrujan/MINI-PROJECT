import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiGlobe, FiHome, FiBarChart2, FiMessageSquare, FiCamera, FiChevronDown, FiImage, FiShield } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';

const languages = [
  { code: 'en', label: 'EN', name: 'English', flag: '🇬🇧' },
  { code: 'te', label: 'తె', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'hi', label: 'हि', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', label: 'த', name: 'தமிழ்', flag: '🇮🇳' },
];

function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [imageMenuOpen, setImageMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (langOpen && !e.target.closest('.lang-dropdown')) setLangOpen(false);
      if (imageMenuOpen && !e.target.closest('.image-dropdown')) setImageMenuOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [langOpen, imageMenuOpen]);

  const navLinks = [
    { path: '/', label: t('nav.home'), icon: <FiHome size={16} /> },
    { path: '/analytics', label: t('nav.analytics'), icon: <FiBarChart2 size={16} /> },
    // Image tools will be rendered as a custom dropdown, see below
    { path: '/feedback', label: t('nav.feedback'), icon: <FiMessageSquare size={16} /> },
  ];

  const imageTools = [
    { path: '/image-upload', label: 'Farm Analysis', icon: <FiImage size={16} /> },
    { path: '/disease-detection', label: 'Disease Detection', icon: <FiShield size={16} /> },
  ];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    setLangOpen(false);
  };

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-2xl shadow-md border-b border-primary-100'
          : 'bg-white/70 backdrop-blur-xl border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-400 via-primary-500 to-primary-700 flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                <GiWheat className="text-white text-[22px]" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gold-400 rounded-full border-2 border-white animate-pulse" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="font-heading font-extrabold text-lg bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
                {t('appName')}
              </span>
              <p className="text-[10px] text-earth-400 font-medium -mt-0.5 tracking-wide">
                CROP RECOMMENDATION
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center bg-primary-50/60 rounded-2xl p-1.5 gap-0.5">
            <Link to="/" className="relative">
              <motion.div
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  location.pathname === '/' ? 'text-white' : 'text-earth-500 hover:text-primary-700'
                }`}
                whileHover={location.pathname !== '/' ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.97 }}
              >
                {location.pathname === '/' && (
                  <motion.div layoutId="activeNav" className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl shadow-md" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
                <span className="relative z-10"><FiHome size={16} /></span>
                <span className="relative z-10">{t('nav.home')}</span>
              </motion.div>
            </Link>

            <Link to="/analytics" className="relative">
              <motion.div
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  location.pathname === '/analytics' ? 'text-white' : 'text-earth-500 hover:text-primary-700'
                }`}
                whileHover={location.pathname !== '/analytics' ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.97 }}
              >
                {location.pathname === '/analytics' && (
                  <motion.div layoutId="activeNav" className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl shadow-md" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
                <span className="relative z-10"><FiBarChart2 size={16} /></span>
                <span className="relative z-10">{t('nav.analytics')}</span>
              </motion.div>
            </Link>

            {/* Image Tools Dropdown */}
            <div className="relative image-dropdown">
              <motion.div
                 className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                   (location.pathname === '/image-upload' || location.pathname === '/disease-detection') ? 'text-white' : 'text-earth-500 hover:text-primary-700'
                 }`}
                 onClick={() => setImageMenuOpen(!imageMenuOpen)}
                 whileHover={(location.pathname !== '/image-upload' && location.pathname !== '/disease-detection') ? { scale: 1.02 } : {}}
                 whileTap={{ scale: 0.97 }}
              >
                 {(location.pathname === '/image-upload' || location.pathname === '/disease-detection') && (
                  <motion.div layoutId="activeNav" className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl shadow-md" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
                <span className="relative z-10"><FiCamera size={16} /></span>
                <span className="relative z-10">Tools</span>
                <FiChevronDown className={`relative z-10 transition-transform ${imageMenuOpen ? 'rotate-180' : ''}`} />
              </motion.div>
              
              <AnimatePresence>
                {imageMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-glass-lg border border-primary-100 overflow-hidden z-50"
                  >
                    <div className="p-1.5 flex flex-col">
                       {imageTools.map(tool => (
                          <Link
                            key={tool.path}
                            to={tool.path}
                            onClick={() => setImageMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                               location.pathname === tool.path
                                 ? 'bg-primary-100 text-primary-700'
                                 : 'text-earth-600 hover:bg-primary-50 hover:text-primary-600'
                             }`}
                          >
                             {tool.icon}
                             <span>{tool.label}</span>
                          </Link>
                       ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/feedback" className="relative">
              <motion.div
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  location.pathname === '/feedback' ? 'text-white' : 'text-earth-500 hover:text-primary-700'
                }`}
                whileHover={location.pathname !== '/feedback' ? { scale: 1.02 } : {}}
                whileTap={{ scale: 0.97 }}
              >
                {location.pathname === '/feedback' && (
                  <motion.div layoutId="activeNav" className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl shadow-md" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
                <span className="relative z-10"><FiMessageSquare size={16} /></span>
                <span className="relative z-10">{t('nav.feedback')}</span>
              </motion.div>
            </Link>
          </div>

          {/* Right: Language Switcher + Mobile Toggle */}
          <div className="flex items-center gap-2">
            {/* Language Dropdown */}
            <div className="relative lang-dropdown">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => { e.stopPropagation(); setLangOpen(!langOpen); }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  langOpen
                    ? 'bg-primary-100 text-primary-700 shadow-sm'
                    : 'text-earth-500 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <FiGlobe className="text-primary-500" size={17} />
                <span>{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.label}</span>
                <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-glass-lg border border-primary-100 overflow-hidden z-50"
                  >
                    <div className="p-1.5">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                            i18n.language === lang.code
                              ? 'bg-primary-100 text-primary-700'
                              : 'text-earth-600 hover:bg-primary-50 hover:text-primary-600'
                          }`}
                        >
                          <span className="text-base">{lang.flag}</span>
                          <span>{lang.name}</span>
                          {i18n.language === lang.code && (
                            <svg className="w-4 h-4 ml-auto text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-2xl text-earth-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden pb-4"
            >
              <div className="bg-primary-50/60 rounded-2xl p-2 space-y-1">
                {navLinks.map((link, i) => {
                   // We skip rendering feedback here so we can inject imageTools before it
                   if(link.path === '/feedback') return null;
                   return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                        location.pathname === link.path
                          ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md'
                          : 'text-earth-600 hover:bg-white hover:text-primary-600'
                      }`}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  </motion.div>
                )})}
                
                {imageTools.map((tool, i) => (
                   <motion.div
                    key={tool.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navLinks.length + i) * 0.05 }}
                  >
                    <Link
                      to={tool.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                        location.pathname === tool.path
                          ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md'
                          : 'text-earth-600 hover:bg-white hover:text-primary-600'
                      }`}
                    >
                      {tool.icon}
                      {tool.label}
                    </Link>
                  </motion.div>
                ))}

                 <motion.div
                    key="/feedback"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navLinks.length + imageTools.length) * 0.05 }}
                  >
                    <Link
                      to="/feedback"
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                        location.pathname === '/feedback'
                          ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md'
                          : 'text-earth-600 hover:bg-white hover:text-primary-600'
                      }`}
                    >
                      <FiMessageSquare size={16}/>
                      {t('nav.feedback')}
                    </Link>
                  </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

export default Navbar;
