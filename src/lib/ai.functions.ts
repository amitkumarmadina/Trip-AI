import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  from: z.string().min(1).max(100),
  destination: z.string().max(100),
  budget: z.number().nonnegative().max(10_000_000),
  currency: z.string().min(1).max(10),
  travelers: z.number().int().min(1).max(50),
  startDate: z.string().max(40),
  endDate: z.string().max(40),
  days: z.number().int().min(1).max(60),
  style: z.string().max(30),
  interests: z.array(z.string().max(40)).max(20),
  accommodation: z.string().max(30),
  transport: z.string().max(30),
  notes: z.string().max(1000).optional().default(""),
});

export const generateItinerary = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = `You are an expert travel planner. Create a detailed, personalized travel itinerary.

TRIP DETAILS:
- Departing from: ${data.from}
- Destination: ${data.destination || "Suggest the best destination based on preferences"}
- Budget: ${data.budget} ${data.currency}
- Travelers: ${data.travelers}
- Dates: ${data.startDate} to ${data.endDate} (${data.days} days)
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

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are an expert travel planner who writes detailed, well-formatted Markdown itineraries." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429) throw new Error("Rate limit reached. Please try again shortly.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in your workspace.");
      throw new Error(`AI request failed (${res.status}): ${body.slice(0, 200)}`);
    }

    const json = await res.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "";
    if (!content) throw new Error("Empty response from AI");
    return { itinerary: content };
  });