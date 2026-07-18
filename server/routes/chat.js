import express from "express";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { itinerary, message, history } = req.body;

    const groqKey = process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.trim() : "";
    if (!groqKey) {
      return res.status(400).json({
        error: "Groq API Key is not configured. Please add GROQ_API_KEY in your .env file.",
      });
    }

    // Build chat payload
    const systemPrompt = `You are Atlas AI, the premium travel concierge for Trip AI. You help users refine their travel plan or answer general travel questions about their trip.

CURRENT ITINERARY:
${itinerary}

CRITICAL RULES:
1. If the user asks you to modify, change, add, delete, or rewrite anything in the itinerary (e.g. change budget, swap transport, add activities, change days, change to a couple/family plan, make it cheaper):
   - You MUST output the entire updated itinerary in Markdown format.
   - Enclose the complete updated itinerary between "<updated_itinerary>" and "</updated_itinerary>" XML tags. Do not skip days, output the full new version.
   - Make a brief, friendly conversational response outside the tags explaining what changes you made.
2. If they just ask general questions (e.g., "what's the weather like?", "suggest packing tips", "how is local transit?"):
   - Answer their question conversationally.
   - DO NOT output the itinerary or use the "<updated_itinerary>" tags.
3. Maintain the professional, high-quality, emoji-rich Markdown itinerary style.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((h) => ({
        role: h.sender === "user" ? "user" : "assistant",
        content: h.text,
      })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API Error: ${response.status} - ${errText}`);
    }

    const resJson = await response.json();
    const reply = resJson.choices?.[0]?.message?.content || "";

    res.json({ reply });
  } catch (error) {
    console.error("Itinerary Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to get AI response" });
  }
});

export default router;
