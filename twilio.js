const twilio = require("twilio");

const client = twilio("TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN");

async function sendMessageToWhatsApp(to, body) {
  await client.messages.create({
    from: "whatsapp:+14155238886",
    to,
    body,
  });
}

module.exports = { sendMessageToWhatsApp };
