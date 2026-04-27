import React from 'react';
import { useTranslation } from 'react-i18next';
import { GiWheat } from 'react-icons/gi';

function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 text-white/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-700 flex items-center justify-center">
              <GiWheat className="text-gold-400 text-xl" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white">{t('appName')}</h3>
              <p className="text-sm text-white/50">{t('footer.description')}</p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-white/50">
              © {year} {t('appName')}. {t('footer.rights')}.
            </p>
            <p className="text-sm mt-1 text-gold-400">{t('footer.madeWith')}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
