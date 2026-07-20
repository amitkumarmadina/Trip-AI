# ✈️ Trip AI — Voyagr

Voyagr (Trip AI) is a premium, AI-powered travel concierge and planner. It generates detailed, highly personalized day-by-day travel itineraries in seconds based on your departing location, destination, budget, travel style, interests, accommodation, and transport preferences. 

Equipped with **Atlas AI**—a real-time conversational chat assistant—you can ask to modify, swap, or refine activities, and watch your itinerary and budget tables update dynamically.

---

## 🚀 Deployment Guide (Vercel + Render)

This project is optimized to run with the **Frontend hosted on Vercel** and the **Backend API server hosted on Render**. Follow these steps to deploy the application.

### 1. Deploy the Backend on Render
1. Sign up/Log in to [Render](https://render.com/).
2. Create a new **Web Service** and connect your GitHub repository.
3. Configure the following service settings:
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/server.js`
4. Under the **Environment** tab, add the following environment variables:
   - `PORT`: `10000` (or leave empty, Render assigns this automatically)
   - `MONGODB_URI`: Your MongoDB connection string (e.g., MongoDB Atlas URI)
   - `JWT_SECRET`: A secure random string for JWT hashing
   - `GEMINI_API_KEY`: Your Google Gemini API Key
   - `GROQ_API_KEY`: Your Groq API Key (used for conversational Atlas AI chat)
   - `NODE_ENV`: `production`
5. Click **Deploy Web Service** and copy your service's URL once the build finishes (e.g., `https://your-backend.onrender.com`).

### 2. Configure Vercel Proxy Routing
1. Open the [vercel.json](file:///d:/Trip-AI/vercel.json) file at the root of the project.
2. Replace `https://your-backend.onrender.com` with your actual Render service URL:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://your-actual-backend.onrender.com/api/:path*"
       },
       {
         "source": "/:path*",
         "destination": "/index.html"
       }
     ]
   }
   ```
3. Commit and push this change to your repository.

### 3. Deploy the Frontend on Vercel
1. Log in to the [Vercel Dashboard](https://vercel.com/) and create a new project.
2. Select your repository.
3. Vercel will automatically detect **Vite** as the framework preset:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. Vercel will build the Vite SPA and route all `/api/*` requests to your Render backend automatically via the proxy rewrite!

---

## ⚙️ Local Development Setup

To run the application locally on your machine:

### 1. Setup Environment Variables
Create a `.env` file at the root of the project:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/voyagr
JWT_SECRET=your_local_jwt_secret
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Servers
Start both the **Vite client** (runs on `http://localhost:5173`) and the **Express API server** (runs on `http://localhost:5000`) concurrently:
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
