# 🤖 AgentLink

**AgentLink** is a WhatsApp-based AI assistant for DeFi that enables users to interact with the **Massa blockchain** using natural language. AgentLink brings the next evolution of user-friendly DeFi by combining:

- ✨ AI Intent Recognition  
- 🔐 Secure Wallet Generation  
- 🔗 Massa's High-Performance Blockchain  
- 📱 WhatsApp — the most used messaging platform in the world

Whether you're creating a wallet, checking your balance, or exploring DeFi possibilities — AgentLink makes blockchain interactions as easy as chatting with a friend.

## 🌟 Key Features

### ✅ Wallet Creation
Easily create a new Massa blockchain wallet via WhatsApp with a simple command:
> "Create a new wallet for me"

AgentLink returns:
- 📍 Wallet address
- 🔑 Private key (securely generated)
- ⚠️ Security warnings and best practices

### 💰 Balance Inquiry
Ask AgentLink for the balance of any Massa address:
> "Check balance for AU12abc..."

You'll receive the current MAS balance in real time via Massa's buildnet.

### 🧠 AI Intent Engine
A lightweight AI parsing layer translates natural messages into actionable blockchain instructions:
- "I want to create a wallet" → `create_wallet` intent
- "What's my balance?" → `get_balance` intent
- "Help me" → `help` intent

### 🔄 Massa Web3 SDK Integration
Using the latest `@massalabs/massa-web3` v5.2.0, the backend handles:
- ✅ Wallet generation with proper key management
- ✅ Balance lookups on Massa buildnet
- ✅ Error handling and user-friendly responses
- 🔜 Transaction sending (coming soon)
- 🔜 Smart contract interactions (coming soon)

### 🧪 DeFi UX on WhatsApp
By leveraging Twilio's WhatsApp Business API, AgentLink runs where users are already active — on mobile messaging.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Twilio account with WhatsApp sandbox setup
- ngrok or similar tunneling service (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Agent_Link
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Twilio credentials:
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   PORT=3000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Set up ngrok tunnel** (for local development)
   ```bash
   ngrok http 3000
   ```

6. **Configure Twilio webhook**
   - Go to your Twilio Console
   - Navigate to WhatsApp Sandbox settings
   - Set webhook URL to: `https://your-ngrok-url.ngrok.io/whatsapp`

## 📱 Usage Examples

Once set up, users can interact with AgentLink via WhatsApp:

### Create a New Wallet
```
User: "Create a new wallet for me"

AgentLink: ✅ Wallet Created Successfully!

📍 Address: AU12CzGuNMcj5eQbfCRNHLJffRFBqgJWGJKaiqvKKBfS9vhFCjGN2
🔑 Private Key: S1a2b3c4d5e6f7...

⚠️ Important: Keep your private key safe and never share it with anyone!
```

### Check Balance
```
User: "Check balance for AU12CzGuNMcj5eQbfCRNHLJffRFBqgJWGJKaiqvKKBfS9vhFCjGN2"

AgentLink: 💰 Balance Information

📍 Address: AU12CzGuNMcj5eQbfCRNHLJffRFBqgJWGJKaiqvKKBfS9vhFCjGN2
💎 Balance: 1000 MAS
```

### Get Help
```
User: "Help"

AgentLink: 🤖 AgentLink - Your DeFi Assistant

Available Commands:

🔹 "Create new wallet" - Generate a new Massa wallet
🔹 "Check balance for AU12abc..." - Check wallet balance  
🔹 "Help" - Show this help message

Powered by Massa Blockchain 🚀
```

## 🏗️ Architecture

```
WhatsApp User → Twilio API → AgentLink Server → Massa Blockchain
                     ↓
              AI Intent Parser → Response Generator
```

## 🔧 API Endpoints

- **POST /whatsapp** - Webhook endpoint for Twilio
- **GET /** - Health check and status
- **GET /health** - Detailed health check

## 🛠️ Development

### Project Structure
```
Agent_Link/
├── server.js          # Express server and main application
├── intent.js          # AI intent parsing and handling
├── massa.js           # Massa blockchain integration
├── twilio.js          # WhatsApp/Twilio integration
├── package.json       # Dependencies and scripts
├── .env.example       # Environment variables template
└── README.md          # This file
```

### Running in Development Mode
```bash
npm run dev
```

### Testing the Integration
You can test the server without WhatsApp by sending a POST request:
```bash
curl -X POST http://localhost:3000/whatsapp \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "Body=create wallet&From=whatsapp:+1234567890"
```

## 🌍 Massa Blockchain Integration

AgentLink uses the Massa blockchain's buildnet (testnet) for all operations:

- **Network**: Massa Buildnet
- **SDK**: @massalabs/massa-web3 v5.2.0
- **Features**: Wallet creation, balance queries
- **Address Format**: AU + 48-50 alphanumeric characters

### Why Massa?
- ⚡ High throughput (10,000+ TPS)
- 🔄 Autonomous Smart Contracts
- 🌐 Decentralized Web capabilities
- 👨‍💻 TypeScript-friendly development

## 🔐 Security Considerations

- Private keys are generated client-side and sent via encrypted WhatsApp
- No private keys are stored on the server
- All communications happen through Twilio's secure infrastructure
- Massa addresses and transactions are publicly verifiable

## 🚧 Future Roadmap

- [ ] **Transaction Sending**: Send MAS tokens via WhatsApp
- [ ] **Smart Contract Interaction**: Deploy and interact with contracts
- [ ] **DeFi Operations**: Staking, delegation, and yield farming
- [ ] **Multi-language Support**: Expand beyond English
- [ ] **Advanced AI**: GPT-4 integration for natural conversations
- [ ] **Portfolio Tracking**: Multi-address balance monitoring
- [ ] **Price Alerts**: Real-time MAS price notifications

## 🏆 Hackathon Submission

This project was built for the **Massa Buildathon - Wave 1: DeFi Apps That Run Themselves**

- ✅ 100% On-Chain Logic (Massa)  
- ✅ Fully Autonomous Smart Contract Support (future)  
- ✅ Minimal Frontend (WhatsApp as UI)  
- ✅ Novel UX concept  
- ✅ Ready to scale with Massa ecosystem

## 👥 Contributors

- **Sambit Sargam Ekalabya**  
- [GitHub](https://github.com/sambitsargam)  
- [Twitter](https://twitter.com/sambitsargam)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🆘 Support

- **Massa Documentation**: [https://docs.massa.net/](https://docs.massa.net/)
- **Twilio WhatsApp API**: [https://www.twilio.com/whatsapp](https://www.twilio.com/whatsapp)
- **Issues**: Create an issue in this repository

---

**Built with ❤️ for the Massa ecosystem**
