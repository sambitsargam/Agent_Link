# 🤖 AgentLink

**AgentLink** is a WhatsApp-based AI assistant for DeFi that enables users to interact with the **Massa blockchain** using natural language. AgentLink brings the next evolution of user-friendly DeFi by combining:

- ✨ AI Intent Recognition  
- 🔐 MPC-ready Wallet Infrastructure  
- 🔗 Massa's Autonomous Smart Contracts  
- 📱 WhatsApp — the most used messaging platform in the world

Whether you're creating a wallet, checking your balance, or eventually sending transactions and setting automation — AgentLink makes it as easy as chatting with a friend.


## 🌟 Key Features

### ✅ Wallet Creation
Easily create a new Massa blockchain wallet via WhatsApp with a simple command like:

> “Create a new wallet for me”

AgentLink returns:
- Wallet address
- Public key
- Private key (MPC-safe)


### 💰 Balance Inquiry
Ask AgentLink for the balance of any Massa address:

> “Check balance for AU12abc...”

You'll receive the current MAS balance in real time via Massa's public testnet RPC.


### 🧠 AI Intent Engine
A lightweight AI parsing layer translates natural messages into actionable blockchain instructions. Example mappings:
- “I want to send 10 MAS to this address” → `send` intent
- “What's my wallet balance?” → `get_balance` intent

> Future versions will integrate GPT-4 for more fluid conversation and automation.

### 🔄 Massa Web3 SDK Integration
Using `@massalabs/massa-web3`, the backend handles:
- Wallet generation
- Balance lookups
- Transaction preparation (sending in next version)
- Interfacing with Massa’s testnet


### 🧪 DeFi UX on WhatsApp
By leveraging Twilio’s WhatsApp Business API, AgentLink runs where users are already active — on mobile messaging.

- No browser extension
- No dApp login
- No manual RPC config

Just message, and it works.

## 🛠 Built With

- **Node.js + Express** – lightweight backend  
- **Massa Web3 SDK** – interaction with Massa L1  
- **Twilio** – WhatsApp messaging interface  
- **OpenAI/GPT-ready** – placeholder for intent parsing  
- **JSON RPC & Deferred Calls** – for future ASC automation


## 🎯 Hackathon Scope (Wave 1)

The version submitted for **Wave 1 of the Massa Buildathon** includes:

- 🔐 Programmatic Massa wallet generation  
- 📊 Real-time MAS balance retrieval  
- 💬 WhatsApp bot that responds to commands  
- 🧠 Message parser for core intents  
- ✅ Working with no centralized backend automation — designed to extend toward ASC usage

## 🧩 Future Work (Wave 2+)

- ✈️ Send MAS transactions from wallet to wallet  
- ⏰ DCA strategies via Autonomous Smart Contracts (ASC)  
- 📈 Limit Orders or Subscriptions via Deferred Calls  
- 🤖 Full GPT integration for DeFi conversation flow  
- 🔐 MPC key management backend (Shamir or Threshold signing)  
- 🔗 DeWeb-hosted frontends for dashboard or confirmation pages


## 🧠 Why It Matters

**AgentLink** represents a paradigm shift in DeFi UX:
- 📱 Anyone with WhatsApp can use DeFi — no Web3 experience needed  
- 🧠 AI reduces learning curve  
- 🔗 Fully decentralized infrastructure (Massa)  
- ⚡ No frontend to host or maintain — just code + smart contracts

## 🏆 Submission Goals

This project was built for:

**🧱 Massa Buildathon — Wave 1: DeFi Apps That Run Themselves**

- ✅ 100% On-Chain Logic (Massa)  
- ✅ Fully Autonomous Smart Contract Support (future)  
- ✅ Minimal Frontend (WhatsApp as UI)  
- ✅ Novel UX concept  
- ✅ Ready to scale with MassaBits support


## 👥 Contributors

- **Sambit Sargam Ekalabya**  
- [GitHub](https://github.com/sambitsargam)  
- [Twitter](https://twitter.com/sambitsargam)


## 💬 Sample WhatsApp Commands

```text
"Create a new wallet"
"Check balance for AU12abcxyz..."
"What's my wallet balance?"
"Send 5 MAS to AU1xxxxxx" (future)
"Create a DCA for BTC weekly" (future)
