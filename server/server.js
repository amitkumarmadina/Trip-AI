import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import itineraryRouter from "./routes/itinerary.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", itineraryRouter);

// Resolve static assets path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(rootDir, "dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(rootDir, "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API Server is running in development mode...");
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
