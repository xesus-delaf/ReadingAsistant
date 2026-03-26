# Daily Reading Assistant

A simple, modular WhatsApp bot powered by Node.js, WhatsApp-Web.js, and OpenAI. It searches the internet for any requested topic (or general programming news) and generates a 5-minute English reading summary with a vocabulary glossary and a mini-quiz to help you practice your English.

## Features
- **No API Keys for Search**: Uses DuckDuckGo to scrape top results completely for free.
- **GitHub Friendly**: No hardcoded secrets. Requires a `.env` file for OpenAI.
- **English Difficulty Adjustments**: Send "Make it easier" / "Make it harder" to scale between B1 and C1.
- **Interactive**: Built-in vocabulary and comprehension quiz.

## Setup Instructions

1. **Install Node.js**: Ensure you have Node.js installed (v16.x or newer).
2. **Install Dependencies**: Run the following in your terminal:
   ```bash
   npm install
   ```
3. **Environment Setup**: 
   - Rename `.env.example` to `.env`.
   - Add your OpenAI API key to the `.env` file.
   *Example:* `OPENAI_API_KEY=sk-...`
4. **Run the Bot**:
   ```bash
   npm start
   ```
5. **Scan QR Code**: Open WhatsApp on your phone, go to "Linked Devices", and scan the QR code that appears in your terminal.

## How to Use
Send messages to the WhatsApp account connected to the bot:
- Text `"Reading"`, `"Daily"`, or `"News"` to get a random tech reading.
- Text `"Read about [Topic]"` (e.g. `"Read about React 19"`) to get a reading on a specific subject.
- Text `"Make it easier"` or `"Make it harder"` to adjust current difficulty level.
