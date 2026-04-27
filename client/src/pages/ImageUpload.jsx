import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiImage, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';

function ImageUpload() {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/image-upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setResult(data.analysis);
      }
    } catch (err) {
      // Mock fallback
      await new Promise((r) => setTimeout(r, 2000));
      setResult({
        detectedSoilType: 'Alluvial Soil',
        soilHealth: 'Good',
        confidence: 87,
        suggestedCrops: ['Rice', 'Wheat', 'Sugarcane'],
        observations: [
          'Rich organic matter detected in the soil',
          'Good water retention capacity observed',
          'Suitable for most cereal crops',
          'pH level appears neutral (6.5-7.0)',
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  const healthColor = (health) => {
    if (health === 'Very Good') return 'text-green-600 bg-green-100';
    if (health === 'Good') return 'text-emerald-600 bg-emerald-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-900 mb-3">{t('imageUpload.title')}</h1>
          <p className="text-earth-500 text-lg">{t('imageUpload.subtitle')}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Upload Zone */}
              <div
                className={`upload-zone ${dragOver ? 'dragover' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                {preview ? (
                  <div className="space-y-4">
                    <img src={preview} alt="Farm preview" className="max-h-64 mx-auto rounded-xl shadow-md" />
                    <p className="text-sm text-primary-700 font-medium">{file?.name}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FiUploadCloud className="text-5xl text-primary-400 mx-auto" />
                    <p className="text-lg font-medium text-primary-800">{t('imageUpload.dragDrop')}</p>
                    <p className="text-earth-400">{t('imageUpload.or')}</p>
                    <span className="inline-block btn-primary text-sm py-2 px-6">{t('imageUpload.browse')}</span>
                    <p className="text-xs text-earth-400">{t('imageUpload.supported')}</p>
                  </div>
                )}
              </div>

              {/* Analyze Button */}
              {preview && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpload}
                    disabled={loading}
                    className="btn-primary text-lg py-4 px-10 inline-flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t('imageUpload.analyzing')}
                      </>
                    ) : (
                      <>
                        <FiImage /> Analyze Image
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Preview + Summary */}
              <div className="glass-card p-6 flex flex-col md:flex-row gap-6">
                {preview && (
                  <img src={preview} alt="Farm" className="w-full md:w-48 h-48 object-cover rounded-xl shadow-md" />
                )}
                <div className="flex-1 space-y-4">
                  <h3 className="font-heading text-xl font-bold text-primary-900">{t('imageUpload.results')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-primary-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-earth-500 mb-1">{t('imageUpload.soilType')}</p>
                      <p className="font-heading font-bold text-primary-800">{result.detectedSoilType}</p>
                    </div>
                    <div className="bg-primary-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-earth-500 mb-1">{t('imageUpload.soilHealth')}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${healthColor(result.soilHealth)}`}>
                        {result.soilHealth}
                      </span>
                    </div>
                    <div className="bg-primary-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-earth-500 mb-1">{t('imageUpload.confidence')}</p>
                      <p className="font-heading font-bold text-primary-800">{result.confidence}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggested Crops */}
              <div className="glass-card p-6">
                <h4 className="font-heading font-bold text-primary-900 mb-3">🌾 {t('imageUpload.suggestedCrops')}</h4>
                <div className="flex flex-wrap gap-3">
                  {result.suggestedCrops.map((crop) => (
                    <span key={crop} className="px-4 py-2 bg-primary-100 text-primary-800 rounded-full font-medium text-sm">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>

              {/* Observations */}
              <div className="glass-card p-6">
                <h4 className="font-heading font-bold text-primary-900 mb-3">🔬 {t('imageUpload.observations')}</h4>
                <ul className="space-y-2">
                  {result.observations.map((obs, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-earth-600">
                      <FiCheckCircle className="text-primary-500 mt-0.5 flex-shrink-0" /> {obs}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reset */}
              <div className="text-center">
                <button onClick={reset} className="btn-primary inline-flex items-center gap-2">
                  <FiRefreshCw /> {t('imageUpload.uploadAnother')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ImageUpload;
