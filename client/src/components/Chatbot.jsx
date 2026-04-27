import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';

const farmingResponses = {
  'rice': 'Rice grows best in temperatures of 20-35°C with high humidity (60-95%). It needs 100-300mm rainfall and alluvial or clay soil with pH 5.0-7.5. Best season: Kharif.',
  'wheat': 'Wheat thrives in cool temperatures (10-25°C), moderate humidity (30-70%), and 25-100mm rainfall. It prefers alluvial or black soil with pH 6.0-8.0. Best season: Rabi.',
  'cotton': 'Cotton needs warm temperatures (25-40°C), moderate humidity, and 50-150mm rainfall. Black or alluvial soil with pH 6.0-8.0 is ideal. Season: Kharif.',
  'summer': 'For summer (Zaid season), consider crops like Maize, Sunflower, Tomato, or Sugarcane. These crops tolerate higher temperatures well.',
  'winter': 'For winter (Rabi season), consider Wheat, Mustard, Potato, or Onion. These crops prefer cooler temperatures.',
  'rainy': 'For the rainy/monsoon season (Kharif), Rice, Cotton, Maize, Soybean, and Groundnut are excellent choices.',
  'water': 'Rice needs the most water (100-300mm). For low-water crops, consider Mustard, Sunflower, or Groundnut. Drip irrigation can save 30-50% water.',
  'soil': 'Common soil types: Alluvial (best for cereals), Black (great for cotton), Red (good for groundnut), Sandy (ideal for root crops), and Clay (retains moisture well).',
  'profit': 'High-profit crops include Cotton (₹6,000-7,500/quintal), Chilli (₹8,000-15,000/quintal dry), and Turmeric (₹7,000-12,000/quintal). However, profits depend on your region and market.',
  'organic': 'For organic farming, use natural fertilizers like compost, vermicompost, and neem cake. Avoid chemical pesticides and use biological pest control methods.',
  'fertilizer': 'NPK ratio depends on the crop. Rice: 120-60-60 kg/ha, Wheat: 120-60-40 kg/ha. Always get soil testing done before applying fertilizers.',
  'pest': 'Common pest management: Use neem oil spray, install pheromone traps, practice crop rotation, and maintain field hygiene. IPM (Integrated Pest Management) is recommended.',
  'help': 'I can help with: crop recommendations, soil types, seasonal planting, water management, fertilizers, pest control, and profit estimates. Just ask!',
  'hello': 'Hello! 🌾 Welcome to Smart Agriculture. I can help you with crop recommendations, farming tips, and more. What would you like to know?',
  'hi': 'Hi there! 🌱 How can I help you with your farming today?',
  'thank': 'You\'re welcome! Happy farming! 🌾 Feel free to ask anything else.',
};

function getResponse(message) {
  const lower = message.toLowerCase();
  for (const [key, response] of Object.entries(farmingResponses)) {
    if (lower.includes(key)) return response;
  }
  return "I'm not sure about that, but I can help with crops, soil types, seasons, water management, fertilizers, and pest control. Try asking about any of these topics! 🌿";
}

function Chatbot() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: t('chatbot.welcome'), sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { text: input.trim(), sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const botResponse = { text: getResponse(input), sender: 'bot' };
      setMessages((prev) => [...prev, botResponse]);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="chatbot-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="chatbot-window mb-4 bg-white border border-primary-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌾</span>
                <h3 className="text-white font-heading font-semibold text-sm">{t('chatbot.title')}</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                <FiX size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="chatbot-messages bg-primary-50/50">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`chat-bubble ${msg.sender}`}
                >
                  {msg.text}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-primary-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('chatbot.placeholder')}
                className="flex-1 px-3 py-2 rounded-xl border border-primary-200 text-sm outline-none focus:border-primary-400 transition-colors"
              />
              <button
                onClick={sendMessage}
                className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition-colors"
              >
                <FiSend size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-glass-lg flex items-center justify-center hover:shadow-glow transition-shadow"
      >
        {isOpen ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </motion.button>
    </div>
  );
}

export default Chatbot;
