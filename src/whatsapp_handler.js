import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import { searchInternet } from './search_engine.js';
import { processReading, updateDifficulty } from './ai_processor.js';

export function initializeWhatsApp() {
    console.log("Initializing WhatsApp Client...");
    
    // LocalAuth saves the session so you don't have to scan the QR code every time
    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    client.on('qr', (qr) => {
        console.log('\n📲 Scan the QR code below using your WhatsApp Linked Devices:\n');
        qrcode.generate(qr, { small: true });
        
        console.log('\n⚠️ ¿No escanea? Haz Ctrl+Clic (o copia/pega) en el siguiente enlace para ver el QR limpio en tu navegador:');
        console.log(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}\n`);
    });

    client.on('ready', () => {
        console.log('\n✅ Daily Reading Assistant is successfully connected and ready to receive messages!\n');
    });

    // Usamos 'message_create' para que el bot escuche no solo los mensajes de otros,
    // sino TAMBIÉN los mensajes que tú te envías a ti mismo o a tus grupos.
    client.on('message_create', async (msg) => {
        const text = msg.body.trim();
        const lowerText = text.toLowerCase();
        const userId = msg.from;

        // Command: Adjust difficulty
        if (lowerText.includes('make it easier') || lowerText.includes('make it harder')) {
            const response = updateDifficulty(userId, lowerText);
            msg.reply(response);
            return;
        }

        // Parse Triggers
        let topic = '';
        if (lowerText === 'reading' || lowerText === 'daily' || lowerText === 'news') {
            topic = 'latest programming news, new dev tools, tech newsletters';
        } else if (lowerText.startsWith('read about ')) {
            topic = text.substring(11).trim();
        }

        // Execute workflow if a topic was found
        if (topic) {
            msg.reply(`Searching the web for "${topic}" and generating your reading... ⏳ (This might take a minute)`);
            
            try {
                // 1. Search the web
                const context = await searchInternet(topic);
                
                // 2. Generate summary, vocabulary, and quiz
                const reading = await processReading(topic, context, userId);
                
                // 3. Send final message
                msg.reply(reading);
            } catch (error) {
                console.error("Workflow failed:", error);
                msg.reply("❌ Sorry, something went wrong while preparing your reading.");
            }
        } 
        // Small handling for people replying to the quiz answers
        else if (text.length <= 2 && /^[a-c]$/i.test(text)) {
            msg.reply("Did you get it right? Review the reading once more! (Hint: automated grading could be added here in the future 😉)");
        }
    });

    client.initialize();
}
