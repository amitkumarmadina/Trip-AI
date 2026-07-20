# <img src="public/logo.png" width="36" alt="Trip AI Logo" style="vertical-align:middle"/> Trip AI

> **AI-powered travel concierge & itinerary planner — Plan here, book anywhere.**

Trip AI generates rich, deeply personalized day-by-day travel itineraries in seconds powered by Groq (Llama 3) and Google Gemini AI. Built with a premium dark-mode dashboard, real-time AI chat, saved trips, interactive travel calendar, and full user authentication.

🔗 **Live:** [trip-ai-delta-rouge.vercel.app](https://trip-ai-delta-rouge.vercel.app)

---

## 📷 Screenshots

### 🏠 Landing Page — Hero
![Landing Hero](docs/screenshots/landing_hero.png)

### 🎯 Plan Your Trip — Smart Search Bar
![Plan Trip](docs/screenshots/plan_trip.png)

### 🌍 Destinations Marquee
![Destinations](docs/screenshots/destinations.png)

### 🔐 Login & Register
![Auth](docs/screenshots/auth.png)

### 📊 Member Dashboard — Home
![Dashboard Home](docs/screenshots/dashboard_home.png)

### 🗓️ Travel Calendar
![Calendar](docs/screenshots/calendar.png)

### 🗂️ Saved Trips Tab
![Saved Trips](docs/screenshots/saved_trips.png)

### ⚙️ Account Settings — Profile Upload
![Settings](docs/screenshots/settings.png)

### 🤖 AI Itinerary Viewer + Chat Concierge
![Itinerary](docs/screenshots/itinerary.png)

> 📸 *Screenshots are captured from the live production build at localhost:5173.*

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🎯 **Smart Trip Planner** | Enter origin, destination, dates (dd/mm/yyyy), travellers, budget, interests, transit, and lodging. |
| 🤖 **Dual AI Engine** | Groq API (Llama-3.3-70B) + Google Gemini 1.5 Flash — with offline fallback generator. |
| 💬 **Atlas AI Chat** | Conversational chat to refine your itinerary: *"Make Day 2 budget-friendly"*, etc. |
| 🔒 **JWT Authentication** | Secure user signup, login, and session management with bcrypt password hashing. |
| 📊 **Member Dashboard** | Premium dark-mode sidebar dashboard with Home, Bookings, Calendar, Documents, Saved Trips, Preferences, Settings, and Help tabs. |
| 🗓️ **Travel Calendar** | Dynamic monthly calendar that auto-highlights trip date ranges from your saved trips. |
| 🗂️ **Saved Trips** | Cloud-synced (MongoDB) saved itineraries with local storage fallback. View, delete, and open any saved trip. |
| 👤 **Profile Management** | Upload profile photo from device or URL, update display name & email. |
| 🌟 **Destination Marquee** | Animated infinite horizontal scroll showcasing popular global destinations. |
| 📦 **Packing Checklist** | Smart packing list tailored to climate and destination. |
| 💱 **Multi-Currency** | Budget in INR, USD, EUR, GBP, AED, and more. |
| 🌙 **Dark Mode** | Full dark-mode toggle persisted across sessions. |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19 + TypeScript** | Core framework |
| **Vite 8** | Build tool & dev server |
| **TanStack Router** | File-based client-side routing |
| **TanStack Query** | Async data fetching & caching |
| **Tailwind CSS** | Utility-first styling |
| **Lucide Icons** | Icon library |
| **Sonner** | Toast notifications |
| **Radix UI** | Accessible UI primitives |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js (ES Modules)** | Server runtime |
| **Express.js** | REST API framework |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT + bcryptjs** | Authentication & password hashing |
| **Nodemon** | Development auto-restart |
| **Groq SDK** | Llama 3 AI integration |
| **Google Generative AI** | Gemini AI integration |

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js** v18+
- **npm** v9+
- MongoDB Atlas account (or local MongoDB)
- Groq API key — [console.groq.com](https://console.groq.com)
- Google Gemini API key — [aistudio.google.com](https://aistudio.google.com)

### 1. Clone the Repository
```bash
git clone https://github.com/amitkumarmadina/Trip-AI.git
cd Trip-AI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
# Server Port
PORT=5000

# MongoDB connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/tripai

# JWT Secret
JWT_SECRET=your_secure_jwt_secret_here

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Groq API Key
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Run Development Servers
```bash
npm run dev
```
This starts:
- 🖥️ **Vite Client** → `http://localhost:5173`
- ⚙️ **Express API** → `http://localhost:5000`

### 5. Build for Production
```bash
npm run build
```

---

## 📂 Project Structure

```
Trip-AI/
├── public/                     # Static assets (logo, favicon)
├── server/                     # Backend (Express + MongoDB)
│   ├── config/db.js            # MongoDB connection
│   ├── middleware/auth.js       # JWT authentication middleware
│   ├── models/                 # Mongoose schemas (User, Trip)
│   └── routes/                 # API route handlers (auth, trips, itinerary, chat)
│   └── server.js               # Express entry point
├── src/                        # Frontend React Application
│   ├── components/             # Reusable UI components (Navbar, PlannerForm, etc.)
│   ├── hooks/useAuth.tsx        # Authentication state hook
│   ├── lib/                    # Utilities & TypeScript types
│   └── routes/                 # TanStack pages
│       ├── index.tsx           # Landing page + Member Dashboard
│       ├── itinerary.tsx       # AI Itinerary Viewer + Chat
│       ├── login.tsx           # Login page
│       ├── register.tsx        # Registration page
│       └── saved.tsx           # Saved trips page
├── docs/screenshots/           # README screenshot assets
├── index.html                  # HTML template
├── vite.config.ts              # Vite configuration
├── vercel.json                 # Vercel deployment config
└── package.json                # Scripts & dependencies
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login & receive JWT |
| `GET` | `/api/auth/me` | Get authenticated user profile |

### Trips
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/trips` | Get all saved trips for user |
| `POST` | `/api/trips` | Save a new itinerary |
| `PUT` | `/api/trips/:id` | Update an existing trip |
| `DELETE` | `/api/trips/:id` | Delete a saved trip |

### AI
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/itinerary` | Generate AI itinerary from trip inputs |
| `POST` | `/api/itinerary/chat` | Chat with Atlas AI to refine itinerary |

---

## 🚀 Deployment

Trip AI is deployed on **Vercel** (frontend) with API routes proxied via `vercel.json`. The MongoDB instance runs on **MongoDB Atlas**.

```json
// vercel.json — rewrites API calls to Express backend
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://your-backend.onrender.com/api/$1" }
  ]
}
```

---

## 📄 License

This project is open-source and free to use for personal projects. Made with ❤️ for curious travelers worldwide. ✈️

---

<p align="center">
  <img src="public/logo.png" width="48" alt="Trip AI" /><br/>
  <b>Trip AI</b> — Plan here, book anywhere.
</p>
