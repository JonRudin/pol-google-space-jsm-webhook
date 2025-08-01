# Google Space JSM Webhook Forwarder

A lightweight Node.js + Express service to receive JSM alerts and forward them as formatted messages to the appropriate Google Chat space, based on team identifiers in the alert description.

## Features

- Listens for JSM webhook payloads
- Extracts action, message, priority, team and notes
- Automatically routes alerts to the correct Google Chat webhook
- Supports priority colouring (🟢 Closed, 🟠 Acknowledge/AddNote, 🔴 Triggered)

