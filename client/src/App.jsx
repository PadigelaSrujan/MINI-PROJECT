import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Dashboard from './pages/Dashboard';
import LanguageSelection from './pages/LanguageSelection';
import InputForm from './pages/InputForm';
import Results from './pages/Results';
import Analytics from './pages/Analytics';
import Feedback from './pages/Feedback';
import ImageUpload from './pages/ImageUpload';
import DiseaseDetection from './pages/DiseaseDetection';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-primary-50 font-body relative">
      {/* Background decorations */}
      <div className="bg-decoration w-96 h-96 bg-primary-300 top-20 -left-48" />
      <div className="bg-decoration w-80 h-80 bg-gold-400 top-96 -right-40" />
      <div className="bg-decoration w-72 h-72 bg-primary-400 bottom-20 left-1/3" />

      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/language" element={<LanguageSelection />} />
          <Route path="/input" element={<InputForm />} />
          <Route path="/results" element={<Results />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/image-upload" element={<ImageUpload />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;
