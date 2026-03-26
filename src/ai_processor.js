import { GoogleGenerativeAI } from "@google/generative-ai";

const userPreferences = {}; // In-memory difficulty store

export async function processReading(topic, searchContext, userId) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const difficulty = userPreferences[userId] || "B2 (Upper Intermediate)";
    console.log(`🧠 Generating reading for ${userId} at level ${difficulty}...`);

    const prompt = `You are a helpful Daily Reading Assistant for English learners.
Your goal is to take a given Topic and some Search Context, and generate a 5-minute reading summary (around 500-700 words) in English.
The user's English level is currently set to: ${difficulty}. YOU MUST adapt the vocabulary, grammar, and complexity to this level.

Please format your response EXACTLY like this:

📰 *[Appropriate Catchy Title]*

[The 500-700 word reading text, properly spaced into paragraphs with emojis]

---

📖 *Vocabulary Glossary:*
1. *Word 1*: Definition in context.
2. *Word 2*: Definition in context.
3. *Word 3*: Definition in context.
(Include 3-5 advanced words used in the text)

---

🧠 *Mini-Quiz:*
1. [Question 1 about the reading topic]?
   A) [Option]
   B) [Option]
   C) [Option]

2. [Question 2 about a vocabulary word or detail]?
   A) [Option]
   B) [Option]
   C) [Option]

*(Optional: Reply with your answers, or command "Make it harder" / "Make it easier" for tomorrow!)*

Topic: ${topic}

Current Information context from the Web:
${searchContext}`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("❌ Gemini Full Error:", JSON.stringify(error?.message ?? error, null, 2));
        const msg = error?.message || "Unknown error";
        return `❌ Gemini Error: ${msg}`;
    }
}

export function updateDifficulty(userId, command) {
    const cmd = command.toLowerCase();
    let oldDiff = userPreferences[userId] || "B2 (Upper Intermediate)";
    let newDiff = oldDiff;

    if (cmd.includes("easier")) {
        newDiff = oldDiff.includes("C1") ? "B2 (Upper Intermediate)" : "B1 (Intermediate)";
    } else if (cmd.includes("harder")) {
        newDiff = oldDiff.includes("B1") ? "B2 (Upper Intermediate)" : "C1 (Advanced)";
    }

    userPreferences[userId] = newDiff;
    return `✅ Difficulty adjusted! Your next reading will be at a **${newDiff}** level.`;
}
