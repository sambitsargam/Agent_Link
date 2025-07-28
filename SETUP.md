# AgentLink Setup Guide

This guide will walk you through setting up AgentLink step by step.

## Features

AgentLink provides the following WhatsApp commands:

- **`create wallet`** - Generate a new Massa blockchain wallet
- **`check balance for [address]`** - Check balance for any Massa address  
- **`my wallets`** - Show your saved wallets (session-based)
- **`portfolio advice`** - Get AI-powered investment tips (with OpenAI)
- **`market info`** - Learn about Massa ecosystem and DeFi trends
- **`help`** - Show available commands
- **Educational queries** - Ask about DeFi, blockchain, etc.

## Prerequisites

Before you begin, make sure you have:

1. **Node.js 16+** installed
   ```bash
   node --version  # Should be 16.0.0 or higher
   ```

2. **npm** (comes with Node.js)
   ```bash
   npm --version
   ```

3. **A Twilio account** (free tier works)
4. **ngrok** (for local development)
   ```bash
   npm install -g ngrok
   ```

## Step 1: Install Dependencies

```bash
cd Agent_Link
npm install
```

## Step 2: Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Get your Twilio credentials:
   - Go to [Twilio Console](https://console.twilio.com/)
   - Find your **Account SID** and **Auth Token**
   - Navigate to **Messaging > Settings > WhatsApp sandbox settings**

3. Edit `.env` file with your credentials:
   ```env
   # Required: Twilio Configuration
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   
   # Optional: OpenAI for AI-powered responses
   OPENAI_API_KEY=your_openai_api_key_here
   USE_OPENAI=true
   
   # Server Configuration
   PORT=3000
   ```

4. (Optional) Get OpenAI API key for AI-powered responses:
   - Go to [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Create a new API key
   - Add it to your `.env` file as `OPENAI_API_KEY`

## Step 3: Test the Application Locally

1. Start the server:
   ```bash
   npm start
   ```

2. Test the health endpoint:
   ```bash
   curl http://localhost:3000/
   ```

   You should see:
   ```json
   {
     "status": "AgentLink is running!",
     "message": "🤖 Your AI-powered DeFi assistant on WhatsApp using Massa blockchain",
     "version": "1.0.0"
   }
   ```

## Step 4: Set Up ngrok for Public Access

1. Start ngrok in a new terminal:
   ```bash
   ngrok http 3000
   ```

2. Copy the public URL (looks like `https://abc123.ngrok.io`)

## Step 5: Configure Twilio Webhook

1. Go to [Twilio Console > Messaging > Settings > WhatsApp sandbox settings](https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox)

2. Set the webhook URL to:
   ```
   https://your-ngrok-url.ngrok.io/webhook
   ```

3. Save the configuration

## Step 6: Test with WhatsApp

1. Join the WhatsApp sandbox by sending the activation code to the sandbox number

2. Send a test message:
   ```
   create wallet
   ```

3. You should receive a response with a new Massa wallet!

## Troubleshooting

### Common Issues

1. **"Module not found" errors**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Twilio webhook not receiving messages**
   - Check if ngrok is still running
   - Verify the webhook URL in Twilio console
   - Check server logs for errors

3. **Balance queries not working**
   - This is normal for new wallets (they have 0 balance)
   - Try with a funded address from the Massa faucet

4. **"Cannot GET /" error**
   - Server is not running, use `npm start`

### Getting Test Funds

1. Go to [Massa Buildnet Faucet](https://buildnet.massa.net/faucet)
2. Enter your generated wallet address
3. Request test MAS tokens
4. Wait a few minutes for the transaction to confirm

## Development Commands

```bash
# Start the server
npm start

# Check server status
curl http://localhost:3000/

# View server logs
tail -f logs/server.log  # if you set up logging
```

## Production Deployment

For production deployment:

1. **Use a proper hosting service** (Heroku, DigitalOcean, AWS, etc.)
2. **Set environment variables** on your hosting platform
3. **Use your production webhook URL** in Twilio
4. **Consider rate limiting** and security measures
5. **Set up monitoring** and logging

## Next Steps

Once everything is working:

1. **Customize the bot responses** in `intent.js`
2. **Add more features** like transaction sending
3. **Integrate with smart contracts** for advanced DeFi features
4. **Add user session management** for multi-step interactions
5. **Implement error logging** and monitoring

## Support

If you run into issues:

1. Check the console logs for error messages
2. Verify your environment variables are set correctly
3. Test each component individually (server, ngrok, Twilio)
4. Create an issue in the repository with details about your problem

Good luck with your AgentLink setup! 🚀
