import dotenv from 'dotenv';
dotenv.config();

import { initializeWhatsApp } from './src/whatsapp_handler.js';

// Pre-flight check
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ ERROR: GEMINI_API_KEY is missing! Please set it in your .env file.");
    console.error("👉 Get your free key at: https://aistudio.google.com/app/apikey");
    process.exit(1);
}

console.log("Starting Daily Reading Assistant...");
initializeWhatsApp();
