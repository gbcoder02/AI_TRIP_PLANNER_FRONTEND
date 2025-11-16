import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Route to generate travel plan
app.post("/api/content", async (req, res) => {
  try {
    const { question } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a travel planner AI. You return travel plans in pure JSON, no explanations.",
        },
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0.8,
    });

    const result = completion.choices[0].message.content;

    // Try parsing JSON
    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch (e) {
      console.error("⚠️ Could not parse JSON from AI:", result);
      return res.status(500).json({
        error: "AI response could not be parsed. Try again.",
      });
    }

    res.json({ result: parsed });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Failed to generate travel plan." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ AI Travel Planner backend running on port ${PORT}`));
