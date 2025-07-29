import express from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(express.json());

const googleChatUrl = process.env.googleChatUrl
const JSMOpenAlertsUrl = process.env.JSMOpenAlertsUrl
app.post('/incoming-alert', async (req, res) => {
    try {
        const alert = req.body.alert;

        if (!alert || !alert.message) {
            return res.status(400).send('Missing alert message');
        }

        const chatMessage = {
            text:
                `🚨 *New Alert from Datadog*

*Message:* ${alert.message}
*Priority:* ${alert.priority}
*Team:* ${alert.team}

[View Monitor](${alert.details?.["Event Url"]}) | [Open JSM Alerts](${JSMOpenAlertsUrl})`
        };

        await axios.post(googleChatUrl, chatMessage);
        console.log('✅ Sent to Google Chat');
        res.status(200).send('Forwarded');
    } catch (err) {
        console.error('❌ Error:', err);
        res.status(500).send('Failed to forward');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Listening on http://localhost:${PORT}/incoming-alert`);
});