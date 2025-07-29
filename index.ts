import express from 'express';
import bodyParser from 'body-parser';
import { exec } from 'child_process';

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your actual Google Chat webhook URL
const GOOGLE_CHAT_WEBHOOK = 'https://chat.googleapis.com/v1/spaces/AAQAQFXdoPs/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=8wL2Pdv9y2dhSZA440qLdIslrON2qhTfFNRdX2dgtNQ';

app.use(bodyParser.json());

app.post('/', (req, res) => {
    console.log('📥 Received JSM webhook:');
    console.log(JSON.stringify(req.body, null, 2));

    // Example: extract a useful alert message
    const description = req.body?.description || '⚠️ Alert received';
    const summary = req.body?.summary || '';
    const text = `🛎️ *New JSM Alert*:\n${description}\n${summary}`;

    // Option 1: Send to Google Chat via curl
    const curlCmd = `curl -H 'Content-Type: application/json' -d '${JSON.stringify({ text })}' "${GOOGLE_CHAT_WEBHOOK}"`;

    exec(curlCmd, (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Error sending to Google Chat:', error.message);
        } else {
            console.log('✅ Sent to Google Chat:', stdout);
        }
    });

    res.status(200).send('Received');
});

app.listen(PORT, () => {
    console.log(`🚀 JSM webhook listener running on port ${PORT}`);
});