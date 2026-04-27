# 🌾 Smart Agriculture - Crop Recommendation System

A full-stack AI-powered crop recommendation system built for Indian farmers with multilingual support.

## Features

- **Smart Crop Recommendations** — Rule-based engine analyzing temperature, humidity, rainfall, soil type, pH, and season
- **Multilingual Support** — English, Telugu, Hindi, Tamil (i18next)
- **Interactive Dashboard** — Usage statistics and ratings
- **Analytics** — Usage trends, top crops, season distribution charts
- **Farm Image Upload** — AI-based soil and crop analysis (mock)
- **Farmer Chatbot** — Rule-based Q&A for farming queries
- **Feedback System** — Star ratings and reviews

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Vite, Tailwind CSS 3, Recharts, Framer Motion, i18next |
| Backend | Node.js, Express, Mongoose, Multer |
| Database | MongoDB |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (optional — app works without it)

### Install & Run

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Run backend (from server/)
cd ../server
npm run dev

# Run frontend (from client/ in a new terminal)
cd ../client
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## Project Structure

```
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Navbar, Footer, Chatbot
│   │   ├── pages/         # Dashboard, LanguageSelection, InputForm, Results, Analytics, Feedback, ImageUpload
│   │   ├── i18n/          # Translation files (EN, TE, HI, TA)
│   │   └── App.jsx        # Root component with routes
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                # Express backend
│   ├── engine/            # Crop recommendation logic
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   └── index.js           # Server entry point
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predict` | Get crop recommendations |
| GET | `/api/analytics` | Usage analytics & stats |
| POST | `/api/feedback` | Submit feedback |
| GET | `/api/feedback` | Get recent feedback |
| POST | `/api/image-upload` | Upload farm image for analysis |
