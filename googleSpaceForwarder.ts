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
        const action = req.body.action;
        const alert = req.body.alert;
        const responders = alert.responders;
        const noteLine = alert.note ? `\n*Note:* ${alert.note}` : '';
        // JSM Ops sends "Event URL"; alerts raised via the retired Opsgenie handle carry "Event Url".
        const monitorUrl = alert.details?.["Event URL"] ?? alert.details?.["Event Url"];
        const monitorLine = monitorUrl ? `[View Monitor](${monitorUrl})\n` : '';

        const description = alert.description || '';

        const webhookUrl = (() => {
            if (description.includes('@slack-pol-reward-alerts-prod')) return process.env.webhookReward;
            if (description.includes('@slack-pol-finance-alerts-prod')) return process.env.webhookFinance;
            if (description.includes('@slack-pol-platform-alerts-prod')) return process.env.webhookPlatform;
            if (description.includes('@slack-pol-inbound-alerts-prod')) return process.env.webhookInbound;
            if (description.includes('@slack-pol-rec-alerts-prod')) return process.env.webhookRec;
            if (description.includes('@slack-pol-cards-alerts-prod')) return process.env.webhookCards;
            if (description.includes('@slack-pol-bacs-alerts-prod')) return process.env.webhookBacs;
            return process.env.googleChatUrl;
        })();

        if (!alert || !alert.message) {
            return res.status(400).send('Missing alert message');
        }

        const statusEmoji = (() => {
            const actionLower = action?.toLowerCase();
            if (actionLower === 'close') return '🟢';
            if (actionLower === 'acknowledge' || actionLower === 'addnote') return '🟠';
            return '🔴';
        })();

        const chatMessage = {
            text:
                `${statusEmoji} *New Alert from Datadog*

*Action:* ${action}
*Message:* ${alert.message}
*Priority:* ${alert.priority}
*Team:* ${responders?.[0]?.name || 'POL'}${noteLine}

${monitorLine}[Open JSM Alerts](${JSMOpenAlertsUrl})`
        };

        await axios.post(webhookUrl, chatMessage);
        console.log('Sent to Google Chat');
        res.status(200).send('Forwarded');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Failed to forward');
    }
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`🚀 Listening on http://localhost:${PORT}/incoming-alert`);
});