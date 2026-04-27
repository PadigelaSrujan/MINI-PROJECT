import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiImage, FiRefreshCw, FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi';

function DiseaseDetection() {
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
      const res = await fetch('/api/disease-upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) {
        setResult(data.analysis);
      }
    } catch (err) {
      // Mock fallback
      await new Promise((r) => setTimeout(r, 2000));
      setResult({
        diseaseName: 'Leaf Spot (Cercospora)',
        confidence: 89,
        affectedCrop: 'Groundnut',
        severity: 'Moderate',
        symptoms: [
          'Small, circular brown spots on leaves',
          'Yellow halo around the spots',
          'Premature leaf fall',
        ],
        treatment: [
          'Spray Carbendazim (0.1%) or Mancozeb (0.2%)',
          'Ensure proper crop rotation',
          'Remove and destroy infected plant debris',
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

  const severityColor = (severity) => {
    if (severity === 'High') return 'text-red-600 bg-red-100 border-red-200';
    if (severity === 'Moderate') return 'text-orange-600 bg-orange-100 border-orange-200';
    if (severity === 'Low to Moderate') return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-green-600 bg-green-100 border-green-200';
  };

  const isHealthy = result?.diseaseName === 'Healthy Plant';

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary-900 mb-3">{t('diseaseDetection.title', 'Crop Disease Detection')}</h1>
          <p className="text-earth-500 text-lg">{t('diseaseDetection.subtitle', 'Upload a photo of a sick plant for AI-based disease diagnosis and treatment')}</p>
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
                    <img src={preview} alt="Plant preview" className="max-h-64 mx-auto rounded-xl shadow-md" />
                    <p className="text-sm text-primary-700 font-medium">{file?.name}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FiUploadCloud className="text-5xl text-red-400 mx-auto" />
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
                        {t('diseaseDetection.analyzing', 'Diagnosing...')}
                      </>
                    ) : (
                      <>
                        <FiImage /> {t('diseaseDetection.analyzeBtn', 'Diagnose Plant')}
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
                  <img src={preview} alt="Plant" className="w-full md:w-48 h-48 object-cover rounded-xl shadow-md" />
                )}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                     <h3 className="font-heading text-xl font-bold text-primary-900">{t('diseaseDetection.results', 'Diagnosis Results')}</h3>
                     {isHealthy ? (
                        <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-bold border border-green-200">
                          <FiCheckCircle /> {t('diseaseDetection.healthyBadge', 'Healthy')}
                        </span>
                     ) : (
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold border ${severityColor(result.severity)}`}>
                          <FiAlertTriangle /> {result.severity} {t('diseaseDetection.severity', 'Severity')}
                        </span>
                     )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-primary-50 rounded-xl p-3">
                      <p className="text-xs text-earth-500 mb-1">{t('diseaseDetection.diseaseName', 'Detected Condition')}</p>
                      <p className={`font-heading font-bold ${isHealthy ? 'text-green-700' : 'text-red-700'}`}>{result.diseaseName}</p>
                    </div>
                    <div className="bg-primary-50 rounded-xl p-3 text-center">
                      <p className="text-xs text-earth-500 mb-1">{t('imageUpload.confidence', 'Confidence')}</p>
                      <p className="font-heading font-bold text-primary-800">{result.confidence}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              {!isHealthy && (
                <div className="glass-card p-6 border-l-4 border-orange-400">
                  <h4 className="font-heading font-bold text-primary-900 mb-3 flex items-center gap-2">
                    <FiInfo className="text-orange-500" /> {t('diseaseDetection.symptoms', 'Identified Symptoms')}
                  </h4>
                  <ul className="space-y-2">
                    {result.symptoms.map((sym, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-earth-600">
                        <span className="text-orange-400 mt-0.5 font-bold">•</span> {sym}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Treatment */}
              <div className={`glass-card p-6 border-l-4 ${isHealthy ? 'border-green-400' : 'border-blue-400'}`}>
                 <h4 className="font-heading font-bold text-primary-900 mb-3 flex items-center gap-2">
                    <FiCheckCircle className={isHealthy ? 'text-green-500' : 'text-blue-500'} /> 
                    {isHealthy ? t('diseaseDetection.recommendations', 'Care Recommendations') : t('diseaseDetection.treatment', 'Recommended Treatment')}
                  </h4>
                <ul className="space-y-2">
                  {result.treatment.map((treat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-earth-600">
                       <span className={`${isHealthy ? 'text-green-500' : 'text-blue-500'} mt-0.5 font-bold`}>•</span> {treat}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reset */}
              <div className="text-center">
                <button onClick={reset} className="btn-primary inline-flex items-center gap-2">
                  <FiRefreshCw /> {t('diseaseDetection.uploadAnother', 'Diagnose Another Plant')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DiseaseDetection;
