import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const testWebhookUrl = process.env.testWebhookUrl

const payload = {
    text: 'Hello from my webhook!',
    source: 'test-script',
    timestamp: new Date().toISOString(),
};

async function sendWebhook() {
    try {
        const res = await axios.post(testWebhookUrl, payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Sent successfully:', res.status);
    } catch (err) {
        console.error('Error sending webhook:', err);
    }
}

sendWebhook();