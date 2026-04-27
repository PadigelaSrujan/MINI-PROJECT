import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiSend, FiRefreshCw, FiThermometer, FiDroplet, FiCloudRain, FiLayers, FiMaximize } from 'react-icons/fi';

const soilTypeValues = ['Alluvial', 'Black', 'Red', 'Laterite', 'Sandy', 'Clay'];
const seasonValues = ['Kharif', 'Rabi', 'Zaid'];

function InputForm() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    temperature: '',
    humidity: '',
    rainfall: '',
    soilType: '',
    phLevel: 7,
    acres: '',
    season: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.temperature) errs.temperature = t('input.validation.required');
    else if (form.temperature < 0 || form.temperature > 50) errs.temperature = t('input.validation.tempRange');
    if (!form.humidity) errs.humidity = t('input.validation.required');
    else if (form.humidity < 0 || form.humidity > 100) errs.humidity = t('input.validation.humidityRange');
    if (!form.rainfall) errs.rainfall = t('input.validation.required');
    else if (form.rainfall < 0 || form.rainfall > 500) errs.rainfall = t('input.validation.rainfallRange');
    if (!form.soilType) errs.soilType = t('input.validation.required');
    if (form.phLevel < 0 || form.phLevel > 14) errs.phLevel = t('input.validation.phRange');
    if (!form.acres) errs.acres = t('input.validation.required');
    else if (form.acres <= 0) errs.acres = t('input.validation.acresMin');
    if (!form.season) errs.season = t('input.validation.required');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, language: i18n.language }),
      });
      const data = await res.json();
      if (data.success) {
        navigate('/results', { state: { results: data.recommendations, inputs: data.inputSummary } });
      }
    } catch (err) {
      // Fallback: navigate with mock data
      navigate('/results', {
        state: {
          results: [
            { crop: 'Rice', score: 92, advantages: ['High demand staple food', 'Good government support'], disadvantages: ['Requires lots of water', 'Labor intensive'], estimatedPrice: '₹2,200 - ₹2,800/quintal', yieldPerAcre: '18 - 25 quintals' },
            { crop: 'Maize', score: 78, advantages: ['All season crop', 'Drought tolerant'], disadvantages: ['Susceptible to pests', 'Lower MSP'], estimatedPrice: '₹1,800 - ₹2,400/quintal', yieldPerAcre: '20 - 30 quintals' },
            { crop: 'Sugarcane', score: 71, advantages: ['High yield', 'Assured market'], disadvantages: ['Long duration crop', 'Water intensive'], estimatedPrice: '₹300 - ₹400/quintal', yieldPerAcre: '300 - 450 quintals' },
          ],
          inputs: form,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ temperature: '', humidity: '', rainfall: '', soilType: '', phLevel: 7, acres: '', season: '' });
    setErrors({});
  };

  const fieldIcon = (icon) => (
    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
      {icon}
    </div>
  );

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-900 mb-3">
            {t('input.title')}
          </h1>
          <p className="text-earth-500 text-lg">{t('input.subtitle')}</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="glass-card p-8 md:p-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Temperature */}
            <div>
              <label className="flex items-center gap-2 mb-2 font-medium text-primary-800 text-sm">
                {fieldIcon(<FiThermometer size={18} />)}
                {t('input.temperature')}
              </label>
              <input
                type="number"
                name="temperature"
                value={form.temperature}
                onChange={handleChange}
                placeholder={t('input.temperaturePlaceholder')}
                className="input-field"
                step="0.1"
              />
              {errors.temperature && <p className="text-red-500 text-xs mt-1">{errors.temperature}</p>}
            </div>

            {/* Humidity */}
            <div>
              <label className="flex items-center gap-2 mb-2 font-medium text-primary-800 text-sm">
                {fieldIcon(<FiDroplet size={18} />)}
                {t('input.humidity')}
              </label>
              <input
                type="number"
                name="humidity"
                value={form.humidity}
                onChange={handleChange}
                placeholder={t('input.humidityPlaceholder')}
                className="input-field"
                step="0.1"
              />
              {errors.humidity && <p className="text-red-500 text-xs mt-1">{errors.humidity}</p>}
            </div>

            {/* Rainfall */}
            <div>
              <label className="flex items-center gap-2 mb-2 font-medium text-primary-800 text-sm">
                {fieldIcon(<FiCloudRain size={18} />)}
                {t('input.rainfall')}
              </label>
              <input
                type="number"
                name="rainfall"
                value={form.rainfall}
                onChange={handleChange}
                placeholder={t('input.rainfallPlaceholder')}
                className="input-field"
                step="0.1"
              />
              {errors.rainfall && <p className="text-red-500 text-xs mt-1">{errors.rainfall}</p>}
            </div>

            {/* Soil Type */}
            <div>
              <label className="flex items-center gap-2 mb-2 font-medium text-primary-800 text-sm">
                {fieldIcon(<FiLayers size={18} />)}
                {t('input.soilType')}
              </label>
              <select
                name="soilType"
                value={form.soilType}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">{t('input.selectSoil')}</option>
                {soilTypeValues.map((s) => (
                  <option key={s} value={s}>{t(`input.soilTypes.${s.toLowerCase()}`)}</option>
                ))}
              </select>
              {errors.soilType && <p className="text-red-500 text-xs mt-1">{errors.soilType}</p>}
            </div>

            {/* pH Level */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 mb-2 font-medium text-primary-800 text-sm">
                {fieldIcon(<span className="text-xs font-bold">pH</span>)}
                {t('input.phLevel')}: <span className="text-primary-600 font-bold">{form.phLevel}</span>
              </label>
              <input
                type="range"
                name="phLevel"
                value={form.phLevel}
                onChange={handleChange}
                min="0"
                max="14"
                step="0.1"
                className="w-full h-2 bg-gradient-to-r from-red-400 via-yellow-300 via-green-400 to-blue-500 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-earth-400 mt-1">
                <span>Acidic (0)</span>
                <span>Neutral (7)</span>
                <span>Alkaline (14)</span>
              </div>
              {errors.phLevel && <p className="text-red-500 text-xs mt-1">{errors.phLevel}</p>}
            </div>

            {/* Acres */}
            <div>
              <label className="flex items-center gap-2 mb-2 font-medium text-primary-800 text-sm">
                {fieldIcon(<FiMaximize size={18} />)}
                {t('input.acres')}
              </label>
              <input
                type="number"
                name="acres"
                value={form.acres}
                onChange={handleChange}
                placeholder={t('input.acresPlaceholder')}
                className="input-field"
                step="0.1"
              />
              {errors.acres && <p className="text-red-500 text-xs mt-1">{errors.acres}</p>}
            </div>

            {/* Season */}
            <div>
              <label className="flex items-center gap-2 mb-2 font-medium text-primary-800 text-sm">
                {fieldIcon(<span className="text-sm">🌦️</span>)}
                {t('input.season')}
              </label>
              <select
                name="season"
                value={form.season}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">{t('input.selectSeason')}</option>
                {seasonValues.map((s) => (
                  <option key={s} value={s}>{t(`input.seasons.${s.toLowerCase()}`)}</option>
                ))}
              </select>
              {errors.season && <p className="text-red-500 text-xs mt-1">{errors.season}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2 text-lg py-4 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FiSend />
              )}
              {loading ? 'Processing...' : t('input.submit')}
            </motion.button>
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-primary-200 text-primary-700 font-semibold hover:bg-primary-50 transition-colors"
            >
              <FiRefreshCw />
              {t('input.reset')}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

export default InputForm;
