# ✈️ Trip AI — Voyagr

Voyagr (Trip AI) is a premium, AI-powered travel concierge and planner. It generates detailed, highly personalized day-by-day travel itineraries in seconds based on your departing location, destination, budget, travel style, interests, accommodation, and transport preferences. 

Equipped with **Atlas AI**—a real-time conversational chat assistant—you can ask to modify, swap, or refine activities, and watch your itinerary and budget tables update dynamically.

---

## 🚀 Live Demo & Deployment
> [!NOTE]  
> **Live Deployed Link:** `[Insert Your Live Deployed Link Here]` *(e.g., Vercel, Render, or Railway URL)*

---

## ✨ Features

- **🎯 Smart Travel Planner:** Customize your origin, destination, budget, group size, trip dates/duration, accommodation styles, travel interests, and transit modes.
- **🤖 Dual-Engine AI Generation:** Integrates with both **Groq API** (`llama-3.3-70b-versatile`) and **Google Gemini API** (`gemini-1.5-flash`) for rich, detailed markdown itinerary creation with a local fallback generator if keys are absent.
- **💬 Atlas AI Chat Concierge:** Real-time conversational interface that parses your requests. Ask Atlas AI to *"make the second day cheaper"* or *"swap transit to a bullet train"*, and it will reconstruct the itinerary markdown and update your view automatically.
- **🔒 Secure Authentication:** User signup, login, and profile fetching backed by **JWT** authentication and **bcrypt** password hashing.
- **💾 Cloud Sync & Dashboard:** Save travel plans directly to a **MongoDB** database, view your dashboard of saved itineraries, and delete or update them at any time.
- **📊 Interactive Budgeting:** Automatic markdown budget breakdown tables categorizing spending on accommodation, transportation, meals, activities, and miscellaneous items.
- **🧳 Packing & Checklist:** Smart packing recommendations classified under Documents, Clothing, Electronics, Medicines, and Accessories tailored to your target climate and location.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 & TypeScript
- **Bundler & Build Tool:** Vite
- **Routing:** TanStack Router (`@tanstack/react-router`)
- **State & Data Fetching:** TanStack Query (`@tanstack/react-query`)
- **Styling & Components:** Tailwind CSS, Radix UI primitives, Lucide Icons, Embla Carousel, and Sonner notifications.

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB (using Mongoose ODM)
- **Security:** JSON Web Tokens (JWT), CORS, and BcryptJS
- **Process Manager:** Nodemon (development)

---

## 📂 Project Structure

```text
├── server/                     # Backend Source Code
│   ├── config/                 # Database configuration (db.js)
│   ├── middleware/             # Authentication & protection middleware (auth.js)
│   ├── models/                 # Mongoose schemas (User.js, Trip.js)
│   ├── routes/                 # Express API routes
│   │   ├── auth.js             # Register, Login, Me endpoints
│   │   ├── chat.js             # Atlas AI chat routing
│   │   └── itinerary.js        # Generator, save, get, delete, update trips
│   └── server.js               # Express entry point
├── src/                        # Frontend React Application
│   ├── components/             # Reusable UI components (PlannerForm, Navbar, etc.)
│   ├── routes/                 # TanStack Router page layouts (__root.tsx, itinerary.tsx, saved.tsx)
│   ├── main.tsx                # React mount entrypoint
│   └── index.css               # Tailwind & Global stylesheet
├── index.html                  # HTML template & Font configurations
├── vite.config.ts              # Vite configurations & plugins
├── tsconfig.json               # TypeScript configurations
├── package.json                # Project dependencies and run scripts
└── .env                        # Local environment credentials
```

---

## ⚙️ Environment Variables

Create a `.env` file at the root of the project and populate the following values:

```env
# Backend server port
PORT=5000

# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/voyagr

# JSON Web Token Secret
JWT_SECRET=your_jwt_secret_key_here

# AI Credentials (Provide at least one for live AI generation)
# 1. Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# 2. Groq API (Recommended for Atlas AI chatbot functionality)
GROQ_API_KEY=your_groq_api_key_here
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** (v18+) and **npm** or **Bun** installed.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/voyagr-travel-planner.git
cd voyagr-travel-planner
```

### 2. Install dependencies
Using npm:
```bash
npm install
```
Using Bun:
```bash
bun install
```

### 3. Run in Development Mode
To spin up both the **Vite client** (runs on `http://localhost:5173`) and the **Express API server** (runs on `http://localhost:5000`) concurrently, execute:

Using npm:
```bash
npm run dev
```
Using Bun:
```bash
bun dev
```

---

## 🔌 API Documentation

### Authentication Routes
- `POST /api/auth/register` — Registers a new user.
- `POST /api/auth/login` — Authenticates user credentials and returns a JWT token.
- `GET /api/auth/me` — Fetches current user profile (requires Bearer token).

### Itinerary Routes
- `POST /api/itinerary` — Generates a new travel itinerary using AI models (or template fallback).
- `GET /api/trips` — Gets all saved trips for the authenticated user.
- `POST /api/trips` — Saves an itinerary to the user's dashboard.
- `PUT /api/trips/:id` — Updates a saved itinerary.
- `DELETE /api/trips/:id` — Deletes a saved itinerary.

### Interactive Chat Routes
- `POST /api/itinerary/chat` — Relays message history, the current itinerary, and user queries to Atlas AI to conversationally update/refine plans.

---

## 🎨 UI Showcase

*(Optional: Add screenshots or GIFs of your layout here!)*
- **Dashboard:** Sleek modern dashboard with glassmorphic cards summarizing all trips.
- **Generator Form:** Clean, custom form elements with reactive input validation.
- **Concierge View:** Side-by-side view featuring the interactive chatbot alongside a formatted markdown travel itinerary.

---

## 📄 License
This project is open-source. Feel free to modify and adapt it for your personal use. Happy traveling! ✈️
