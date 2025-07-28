require('dotenv').config();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886";

if (!accountSid || !authToken) {
  console.warn("⚠️ Twilio credentials not found in environment variables. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in your .env file");
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

async function sendMessageToWhatsApp(to, body) {
  try {
    if (!client) {
      console.log("📝 Twilio not configured - Message would be sent to", to.replace(/whatsapp:\+/, "+"));
      return;
    }

    await client.messages.create({
      from: whatsappNumber,
      to,
      body,
    });
    console.log("✅ Message sent to", to.replace(/whatsapp:\+/, "+"));
  } catch (error) {
    console.error("❌ Error sending message:", error.message);
  }
}

module.exports = { sendMessageToWhatsApp };
