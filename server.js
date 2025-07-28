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
app.post('/webhook', (req, res) => {
  let from, text;
  
  // Handle real Twilio WhatsApp webhook format
  if (req.body.From && req.body.Body) {
    from = req.body.From; // Already in format "whatsapp:+66955928521"
    text = req.body.Body;
    
    // Fix malformed phone numbers from test requests
    if (from.includes("whatsapp: ")) {
      from = from.replace("whatsapp: ", "whatsapp:+");
    }
  }
  // Handle test format (Meta/WhatsApp Business API format)
  else if (req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]) {
    const message = req.body.entry[0].changes[0].value.messages[0];
    from = `whatsapp:+${message.from}`; // Convert to Twilio format
    text = message.text?.body;
  }
  
  if (from && text) {
    console.log(`📱 Message from ${from}: ${text}`);
    
    // Parse intent with userId and respond
    parseIntent(text, from)
      .then(intent => {
        return handleIntent(intent, text);
      })
      .then(response => {
        return sendMessageToWhatsApp(from, response);
      })
      .catch(error => {
        console.error('❌ Error processing message:', error.message);
        return sendMessageToWhatsApp(from, "😔 Sorry, something went wrong. Please try again.");
      });
  }
  
  // Return 200 OK immediately to Twilio (this doesn't send a message to user)
  res.status(200).send('OK');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 AgentLink backend running on port ${PORT}`);
  console.log(`🌐 Webhook URL: http://localhost:${PORT}/webhook`);
  console.log(`💡 Make sure to configure your Twilio webhook URL to point to this endpoint`);
});
