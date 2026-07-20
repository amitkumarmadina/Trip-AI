# ✈️ Trip AI — Voyagr

Voyagr (Trip AI) is a premium, AI-powered travel concierge and planner. It generates detailed, highly personalized day-by-day travel itineraries in seconds based on your departing location, destination, budget, travel style, interests, accommodation, and transport preferences. 

Equipped with **Atlas AI**—a real-time conversational chat assistant—you can ask to modify, swap, or refine activities, and watch your itinerary and budget tables update dynamically.

---

## 📷 UI Showcase & Mockups

Here are some visual showcases of the Voyagr user interface:

### 🌟 Dashboard View
*(Insert Dashboard screenshot here)*
<!-- <img src="/path/to/dashboard.png" width="800" alt="Voyagr Dashboard" /> -->

### ✍️ Trip Planner Form
*(Insert Planner Form screenshot here)*
<!-- <img src="/path/to/planner-form.png" width="800" alt="Voyagr Trip Planner Form" /> -->

### 💬 Atlas AI Chat Concierge & Itinerary
*(Insert Chat Concierge screenshot here)*
<!-- <img src="/path/to/chat-concierge.png" width="800" alt="Atlas AI Chat Concierge" /> -->

---

## ⚙️ Getting Started (Local Development)

Follow these steps to clone the repository and run Voyagr on your local machine.

### Prerequisites
Make sure you have **Node.js** (v18+) and **npm** installed on your system.

### 1. Clone the Repository
Clone this repository to your local machine using git:
```bash
git clone https://github.com/your-username/trip-ai.git
cd trip-ai
```

### 2. Install Dependencies
Install the required packages for both the Vite client and Express server:
```bash
npm install
```

### 3. Setup Environment Variables
Create a file named `.env` in the root directory of the project and populate it with the following configuration:
```env
# Server Port
PORT=5000

# MongoDB connection URI (using local MongoDB or MongoDB Atlas)
MONGODB_URI=mongodb://localhost:27017/voyagr

# JWT authentication secret (a secure random string)
JWT_SECRET=your_jwt_secret_key_here

# Google Gemini API key (for itinerary generation)
GEMINI_API_KEY=your_gemini_api_key_here

# Groq API key (for conversational Atlas AI chat)
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Run Development Servers
To spin up both the **Vite client** (running on `http://localhost:5173`) and the **Express API server** (running on `http://localhost:5000`) concurrently, run:
```bash
npm run dev
```

---

## ✨ Features

- **🎯 Smart Travel Planner:** Customize origin, destination, budget, group size, trip dates/duration, accommodation styles, travel interests, and transit modes.
- **🤖 Dual-Engine AI Generation:** Integrates with both **Groq API** (`llama-3.3-70b-versatile`) and **Google Gemini API** (`gemini-1.5-flash`) for rich, detailed markdown itinerary creation with a local fallback generator if keys are absent.
- **💬 Atlas AI Chat Concierge:** Real-time conversational interface. Ask Atlas AI to *"make the second day cheaper"* or *"swap transit to a bullet train"*, and it will reconstruct the itinerary markdown and update your view automatically.
- **🔒 Secure Authentication:** User signup, login, and profile fetching backed by **JWT** authentication and **bcrypt** password hashing.
- **💾 Cloud Sync & Dashboard:** Save travel plans directly to a **MongoDB** database, view your dashboard of saved itineraries, and delete or update them at any time.
- **📊 Interactive Budgeting:** Automatic markdown budget breakdown tables categorizing spending on accommodation, transportation, meals, activities, and miscellaneous items.
- **🧳 Packing & Checklist:** Smart packing recommendations tailored to your target climate and location.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 & TypeScript
- **Bundler & Build Tool:** Vite
- **Routing:** TanStack Router (`@tanstack/react-router`)
- **State & Data Fetching:** TanStack Query (`@tanstack/react-query`)
- **Styling & Components:** Tailwind CSS, Radix UI primitives, Lucide Icons, and Sonner notifications. (Streamlined layout with unused Shadcn assets removed).

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB (using Mongoose ODM)
- **Security:** JSON Web Tokens (JWT), CORS, and BcryptJS
- **Process Manager:** Nodemon (development)

---

## 📂 Streamlined Project Structure

```text
├── server/                     # Backend Source Code
│   ├── config/                 # Database configuration (db.js)
│   ├── middleware/             # Authentication & protection middleware (auth.js)
│   ├── models/                 # Mongoose schemas (User.js, Trip.js)
│   ├── routes/                 # Express API routes (auth.js, chat.js, itinerary.js)
│   └── server.js               # Express entry point
├── src/                        # Frontend React Application
│   ├── components/             # Reusable UI components & active Shadcn elements
│   ├── hooks/                  # Custom hooks (useAuth.tsx)
│   ├── lib/                    # Utils & types (utils.ts, trip-types.ts)
│   ├── routes/                 # TanStack Router page layouts (__root.tsx, itinerary.tsx, saved.tsx)
│   ├── main.tsx                # React mount entrypoint
│   └── styles.css              # Tailwind & Global stylesheet
├── index.html                  # HTML template & Font configurations
├── vercel.json                 # Vercel deployment routing configuration
├── vite.config.ts              # Vite configurations & plugins
├── tsconfig.json               # TypeScript configurations
└── package.json                # Project dependencies and run scripts
```

---

## 🔌 API Documentation

### Authentication Routes
- `POST /api/auth/register` — Registers a new user.
- `POST /api/auth/login` — Authenticates user credentials and returns a JWT token.
- `GET /api/auth/me` — Fetches current user profile (requires Bearer token).

### Itinerary Routes
- `POST /api/itinerary` — Generates a new travel itinerary using AI models.
- `GET /api/trips` — Gets all saved trips for the authenticated user.
- `POST /api/trips` — Saves an itinerary to the user's dashboard.
- `PUT /api/trips/:id` — Updates a saved itinerary.
- `DELETE /api/trips/:id` — Deletes a saved itinerary.

### Interactive Chat Routes
- `POST /api/itinerary/chat` — Relays message history, the current itinerary, and user queries to Atlas AI to conversationally update/refine plans.

---

## 📄 License
This project is open-source. Feel free to modify and adapt it for your personal use. Happy traveling! ✈️
