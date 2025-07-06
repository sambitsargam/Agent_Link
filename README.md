# AgentLink

**AgentLink** is a WhatsApp-based AI assistant that allows users to interact with the Massa blockchain using natural language.

## ✨ Features

- Create Massa wallets
- Get real-time MAS balances
- AI-parsed intents (stubbed)
- Send and receive messages via WhatsApp (Twilio)

## 🚀 Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add your Twilio credentials to `twilio.js`:
   ```js
   const client = twilio("TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN");
   ```

3. Run the server:
   ```bash
   npm start
   ```

4. Test WhatsApp messages:
   - "Create wallet"
   - "Check balance for AU12...."

## 📦 Tech Stack

- Node.js + Express
- Twilio WhatsApp API
- Massa Web3 SDK

## 🛠 TODO (Next Phase)

- Transaction sending
- AI intent via GPT
- Autonomous smart contract scheduling (ASC)

## 🧠 Built for Massa Buildathon - Wave 1
