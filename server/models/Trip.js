import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
  input: {
    from: { type: String, required: true },
    destination: { type: String, default: "" },
    budget: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    travelers: { type: Number, default: 1 },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    days: { type: Number, default: 1 },
    style: { type: String, default: "Adventure" },
    interests: { type: [String], default: [] },
    accommodation: { type: String, default: "Hotel" },
    transport: { type: String, default: "Flight" },
    notes: { type: String, default: "" },
  },
  itinerary: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Trip = mongoose.model("Trip", TripSchema);
