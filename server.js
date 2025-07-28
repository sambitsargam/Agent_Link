require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const { parseIntent, handleIntent } = require("./intent");
const { sendMessageToWhatsApp } = require("./twilio");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "AgentLink is running!", 
    message: "🤖 Your AI-powered DeFi assistant on WhatsApp using Massa blockchain",
    version: "1.0.0"
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// WhatsApp webhook endpoint
app.post("/whatsapp", async (req, res) => {
  try {
    const msg = req.body.Body;
    const from = req.body.From;

    if (!msg || !from) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log(`📱 Received message from ${from}: ${msg}`);

    // Parse user intent and handle the request
    const intent = await parseIntent(msg);
    const result = await handleIntent(intent);

    // Send response back to user
    await sendMessageToWhatsApp(from, result);
    
    console.log(`✅ Response sent to ${from}`);
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error processing WhatsApp message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 AgentLink backend running on port ${PORT}`);
  console.log(`🌐 Webhook URL: http://localhost:${PORT}/whatsapp`);
  console.log(`💡 Make sure to configure your Twilio webhook URL to point to this endpoint`);
});
