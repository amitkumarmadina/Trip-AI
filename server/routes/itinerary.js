import express from "express";
import { z } from "zod";
import { Trip } from "../models/Trip.js";

const router = express.Router();

const InputSchema = z.object({
  from: z.string().min(1).max(100),
  destination: z.string().max(100).optional().default(""),
  budget: z.number().nonnegative().max(10_000_000),
  currency: z.string().min(1).max(10),
  travelers: z.number().int().min(1).max(50),
  startDate: z.string().max(40).optional().default(""),
  endDate: z.string().max(40).optional().default(""),
  days: z.number().int().min(1).max(60),
  style: z.string().max(30),
  interests: z.array(z.string().max(40)).max(20),
  accommodation: z.string().max(30),
  transport: z.string().max(30),
  notes: z.string().max(1000).optional().default(""),
});

// Generate Itinerary
router.post("/itinerary", async (req, res) => {
  try {
    const data = InputSchema.parse(req.body);

    const groqKey = process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.trim() : "";
    const geminiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : "";
    let itineraryText = "";

    const prompt = `You are an expert travel planner. Create a detailed, personalized travel itinerary.

TRIP DETAILS:
- Departing from: ${data.from}
- Destination: ${data.destination || "Suggest the best destination based on preferences"}
- Budget: ${data.budget} ${data.currency}
- Travelers: ${data.travelers}
- Dates: ${data.startDate || "Flexible"} to ${data.endDate || "Flexible"} (${data.days} days)
- Travel style: ${data.style}
- Interests: ${data.interests.join(", ") || "General"}
- Accommodation preference: ${data.accommodation}
- Transport preference: ${data.transport}
- Additional notes: ${data.notes || "None"}

Return a well-structured Markdown itinerary with these sections:

## Trip Summary
(destination, dates, travelers, style, quick overview)

## Best Transportation

## Daily Itinerary
For EACH of the ${data.days} days include a \`### Day N — <Theme>\` heading, then:
- **Morning:** ...
- **Afternoon:** ...
- **Evening:** ...
- **Meals:** recommended restaurants
- **Estimated cost:** amount in ${data.currency}

## Budget Breakdown
A markdown table with columns Category | Estimated Cost (${data.currency}) covering Accommodation, Transportation, Food, Activities, Shopping, Miscellaneous, and a Total row.

## Suggested Hotels

## Tourist Attractions

## Local Experiences & Hidden Gems

## Packing Checklist
Grouped under: Documents, Clothing, Electronics, Medicines, Accessories, Essentials. Use bullet lists.

## Weather Advice

## Safety Tips & Local Customs

## Emergency Numbers

## Money-Saving Tips

Keep it practical, specific, and inspiring. Use emojis sparingly in headings.`;

    if (groqKey) {
      console.log("Calling Groq API...");
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are an expert travel planner who writes detailed, well-formatted Markdown itineraries.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API Error: ${response.status} - ${errText}`);
      }

      const resJson = await response.json();
      itineraryText = resJson.choices?.[0]?.message?.content || "";

      if (!itineraryText) {
        throw new Error("Empty response received from Groq API");
      }
    } else if (geminiKey) {
      console.log("Calling Google Gemini API...");
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
      }

      const resJson = await response.json();
      itineraryText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (!itineraryText) {
        throw new Error("Empty response received from Gemini API");
      }
    } else {
      console.log("No GEMINI_API_KEY configured. Returning beautiful mock itinerary...");
      // Simulate generating a high-quality mock markdown itinerary
      const finalDest = data.destination || "Paris, France";
      itineraryText = `## Trip Summary
- **Destination:** ${finalDest}
- **Departing from:** ${data.from}
- **Duration:** ${data.days} Days (${data.startDate || "Flexible"} to ${data.endDate || "Flexible"})
- **Travelers:** ${data.travelers} traveler(s)
- **Style:** ${data.style}
- **Vibe:** Relaxed yet exploratory. Ideal for experiencing local culture, sights, and hidden gems.

---

## Best Transportation
- **Primary Transport:** ${data.transport}
- **Local Commutes:** We recommend taking local buses and metros. Standard tickets or multi-day passes will be the most budget-friendly.

---

## Daily Itinerary
`;

      for (let i = 1; i <= data.days; i++) {
        itineraryText += `
### Day ${i} — Exploring ${finalDest}
- **Morning:** Start the day with a fresh breakfast at a local bakery near the city center. Visit the prominent landmarks and enjoy a refreshing walk.
- **Afternoon:** Head over to local history museum or gallery. Spend 2-3 hours wandering and enjoying the culture.
- **Evening:** Walk through the oldest quarter of the town. Browse boutique shops and view the sunset.
- **Meals:** Breakfast: Café du Commerce, Lunch: Local Street Food Vendor, Dinner: Chez Albert (traditional cuisine).
- **Estimated cost:** ${((data.budget / data.days) * 0.85).toFixed(0)} ${data.currency}
`;
      }

      itineraryText += `
---

## Budget Breakdown

| Category | Estimated Cost (${data.currency}) |
| :--- | :--- |
| **Accommodation** | ${(data.budget * 0.4).toFixed(0)} |
| **Transportation** | ${(data.budget * 0.25).toFixed(0)} |
| **Food & Dining** | ${(data.budget * 0.2).toFixed(0)} |
| **Activities** | ${(data.budget * 0.1).toFixed(0)} |
| **Miscellaneous** | ${(data.budget * 0.05).toFixed(0)} |
| **Total** | **${data.budget} ${data.currency}** |

---

## Suggested Hotels
1. **${finalDest} Central Inn** (Mid-range boutique, great location)
2. **The Cozy Corner Hostel** (Highly rated for solo travelers and couples)

---

## Tourist Attractions
- Main historical cathedral / temple / monument in ${finalDest}
- City view deck or central garden
- Local history museum

---

## Local Experiences & Hidden Gems
- Walk the back alleys of the oldest suburb for amazing artisan bakeries and cafes.
- Join a free local walking tour organized by native guides to learn authentic folklore.

---

## Packing Checklist
- **Documents:** Passport, Flight tickets, Travel insurance, Hotel vouchers.
- **Clothing:** Comfort shoes, weather-appropriate layered clothing.
- **Electronics:** Phone chargers, global power adapter, power bank.
- **Medicines:** Basic pain relievers, allergy pills, personal prescriptions.
- **Essentials:** Water bottle, day pack, sunglasses.

---

## Weather Advice
- Weather is generally pleasant. Keep an umbrella handy just in case of light showers.

---

## Safety & Local Customs
- Tipping is generally included in service charge, but rounding up is appreciated.
- Keep bags close in crowded metro stations.

---

## Emergency Numbers
- General Emergency: 112

---

## Money-Saving Tips
- Purchase museum passes or city transit cards in advance.
- Eat your main meal during lunch hours when local diners offer special set menus.
`;
    }

    res.json({ itinerary: itineraryText });
  } catch (error) {
    console.error(error);
    const msg = error instanceof Error ? error.message : "Error generating itinerary";
    res.status(400).json({ error: msg });
  }
});
// Get all saved trips from MongoDB
router.get("/trips", async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    const formatted = trips.map((t) => ({
      id: t._id.toString(),
      createdAt: t.createdAt.getTime(),
      input: t.input,
      itinerary: t.itinerary,
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch saved trips" });
  }
});

// Save a trip to MongoDB
router.post("/trips", async (req, res) => {
  try {
    const newTrip = new Trip({
      input: req.body.input,
      itinerary: req.body.itinerary,
    });
    const saved = await newTrip.save();
    res.status(201).json({
      id: saved._id.toString(),
      createdAt: saved.createdAt.getTime(),
      input: saved.input,
      itinerary: saved.itinerary,
    });
  } catch (error) {
    res.status(400).json({ error: "Failed to save trip" });
  }
});
// Delete a trip from MongoDB
router.delete("/trips/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Trip.findByIdAndDelete(id);
    res.json({ success: true, message: "Trip deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete trip" });
  }
});

export default router;
