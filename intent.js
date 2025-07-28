const { Account } = require("@massalabs/massa-web3");
const { getBalance, isValidMassaAddress } = require("./massa");
const sessionManager = require("./session");
const { 
  parseWithOpenAI, 
  generateSmartResponse, 
  explainConcept, 
  generatePersonalizedHelp,
  generatePortfolioAdvice,
  generateMarketInfo,
  isOpenAIConfigured
} = require("./openai");

// Helper function to format addresses for WhatsApp
function formatAddress(address) {
  return `\`${address}\``;
}

// Helper function to format wallet info for WhatsApp
function formatWalletInfo(nickname, address, timeAgo) {
  const shortAddress = `${address.substring(0, 8)}...${address.substring(-8)}`;
  return `*${nickname}*\n   📍 ${formatAddress(shortAddress)}\n   🕒 Created ${timeAgo}m ago`;
}// Simple fallback parsing for when OpenAI is not available
async function parseIntentSimple(msg) {
  const text = msg.toLowerCase().trim();

  // Check if the message is just a Massa address
  if (isValidMassaAddress(msg.trim())) {
    return { intent: "check_balance", address: msg.trim() };
  }

  if (text.includes("create wallet") || text.includes("new wallet") || text.includes("generate wallet")) {
    return { intent: "create_wallet" };
  } else if (text.includes("balance") || text.includes("check balance")) {
    const addressMatch = msg.match(/AU[A-Za-z0-9]{49}/);
    return { intent: "get_balance", address: addressMatch ? addressMatch[0] : null };
  } else if (text.includes("my wallets") || text.includes("list wallets") || text.includes("show wallets")) {
    return { intent: "list_wallets" };
  } else if (text.includes("help") || text.includes("commands") || text.includes("what can")) {
    return { intent: "help" };
  } else if (text.includes("portfolio") || text.includes("investment") || text.includes("advice")) {
    return { intent: "portfolio_advice" };
  } else if (text.includes("market") || text.includes("price") || text.includes("trends")) {
    return { intent: "market_info" };
  } else if (text.includes("what is") || text.includes("explain") || text.includes("tell me about")) {
    return { intent: "explain", query: msg };
  }

  return { intent: "unknown" };
}

async function parseIntent(msg, userId) {
  const useOpenAI = process.env.USE_OPENAI === 'true' && isOpenAIConfigured();
  
  // Get user session for context
  const session = sessionManager.getSession(userId);
  sessionManager.incrementMessageCount(userId);
  
  if (useOpenAI) {
    try {
      const aiResult = await parseWithOpenAI(msg, session);
      if (aiResult) {
        // Store last action in session
        sessionManager.setContext(userId, 'lastAction', aiResult.action);
        
        // Convert OpenAI format to our internal format
        const intentMapping = {
          'CREATE_WALLET': 'create_wallet',
          'CHECK_BALANCE': 'check_balance',
          'LIST_WALLETS': 'list_wallets',
          'HELP': 'help',
          'EXPLAIN': 'explain',
          'PORTFOLIO_ADVICE': 'portfolio_advice',
          'MARKET_INFO': 'market_info'
        };
        
        return {
          intent: intentMapping[aiResult.action] || aiResult.action.toLowerCase(),
          address: aiResult.address,
          query: aiResult.explanation || msg,
          aiResponse: aiResult.response,
          confidence: aiResult.confidence || 0.8,
          userId: userId
        };
      }
    } catch (error) {
      console.error("⚠️ OpenAI parsing failed, using simple parsing");
    }
  }

  // Fallback to simple parsing
  const simpleResult = await parseIntentSimple(msg);
  simpleResult.userId = userId;
  return simpleResult;
}

async function handleIntent(intent, originalMessage = "") {
  const userId = intent.userId;
  const session = sessionManager.getSession(userId);
  
  try {
    if (intent.intent === "create_wallet") {
      const account = await Account.generate();
      
      // Save wallet to user session
      sessionManager.addWalletToSession(userId, {
        address: account.address.toString(),
        nickname: `Wallet ${session.wallets.length + 1}`
      });
      
      // Try to generate a smart response with OpenAI
      const smartResponse = await generateSmartResponse("WALLET_CREATED");
      
      if (smartResponse) {
        return `${smartResponse}\n\n📍 *Address:*\n${formatAddress(account.address.toString())}\n\n🔑 *Private Key:*\n${formatAddress(account.privateKey.toString())}\n\n⚠️ *Security Note:* Store your private key safely and never share it!\n\n💡 *Tip:* You now have ${session.wallets.length} wallet(s) saved. Type *"my wallets"* to see them all.`;
      }
      
      // Fallback response
      return `✅ *Wallet Created Successfully!*\n\n📍 *Address:*\n${formatAddress(account.address.toString())}\n\n🔑 *Private Key:*\n${formatAddress(account.privateKey.toString())}\n\n⚠️ *Important:* Keep your private key safe and never share it with anyone!\n\n💡 You now have ${session.wallets.length} wallet(s) saved.`;
    } 
    else if (intent.intent === "get_balance" || intent.intent === "check_balance") {
      if (!intent.address) {
        // If user has saved wallets, suggest them
        const userWallets = sessionManager.getUserWallets(userId);
        if (userWallets.length > 0) {
          const walletList = userWallets.map((w, i) => `${i + 1}. ${w.nickname}: ${formatAddress(w.address.substring(0, 10) + '...')}`).join('\n');
          return `⚠️ Please provide a valid Massa address.\n\n*Your saved wallets:*\n${walletList}\n\nExample: *"Check balance for AU12abc..."* or just send the address.`;
        }
        return "⚠️ Please provide a valid Massa address (starting with AU and 52 characters long).\n\nExample: Check balance for AU12abc...";
      }
      
      // Validate address format before checking balance
      if (!isValidMassaAddress(intent.address)) {
        return `❌ *Invalid Address*\n\nThe address you provided is not valid.\n\n✅ *Valid format:* AU + 50 characters (52 total)\n📝 *Example:* AU12CzGuNMcj5eQbfCRNHLJffRFBqgJWGJKaiqvKKBfS9vhFCjGN2\n\n💡 Make sure you copied the complete address.`;
      }
      
      const balance = await getBalance(intent.address);
      
      // Handle error responses from getBalance
      if (balance.includes("Unable to retrieve") || balance.includes("Invalid")) {
        return `😔 *Balance Check Failed*\n\n${balance}\n\n💡 *Tips:*\n• Make sure the address is correct\n• Check your internet connection\n• Try again in a few seconds`;
      }
      
      // Try to generate a smart response with OpenAI
      const smartResponse = await generateSmartResponse("BALANCE_RESULT", {
        balance: balance,
        address: intent.address
      });
      
      if (smartResponse) {
        return smartResponse;
      }
      
      // Fallback response
      return `💰 *Balance Information*\n\n📍 *Address:*\n${formatAddress(intent.address)}\n\n💎 *Balance:* ${balance} MAS`;
    }
    else if (intent.intent === "list_wallets") {
      const userWallets = sessionManager.getUserWallets(userId);
      
      if (userWallets.length === 0) {
        return `📝 *Your Wallets*\n\nYou haven't created any wallets yet.\n\n🔹 Type *"create wallet"* to get started!\n🔹 Wallets are saved for easy access during our conversation.`;
      }
      
      const walletList = userWallets.map((wallet, index) => {
        const timeAgo = Math.floor((Date.now() - wallet.createdAt) / (1000 * 60));
        return `${index + 1}. ${formatWalletInfo(wallet.nickname, wallet.address, timeAgo)}`;
      }).join('\n\n');
      
      return `📝 *Your Wallets* (${userWallets.length})\n\n${walletList}\n\n💡 *Tip:* Send any address to check its balance!`;
    }
    else if (intent.intent === "portfolio_advice") {
      const portfolioAdvice = await generatePortfolioAdvice(session);
      
      if (portfolioAdvice) {
        return `📈 *Portfolio Advice*\n\n${portfolioAdvice}`;
      }
      
      // Fallback advice
      return `📈 *Portfolio Tips*\n\n🔹 *Diversify:* Don't put all funds in one asset\n🔹 *Research:* Understand Massa's unique features\n🔹 *Security:* Use multiple wallets for different purposes\n🔹 *DCA:* Consider dollar-cost averaging\n🔹 *Stay Updated:* Follow Massa ecosystem developments\n\n💡 You have ${session.wallets.length} wallet(s) - great start for portfolio management!`;
    }
    else if (intent.intent === "market_info") {
      const marketInfo = await generateMarketInfo();
      
      if (marketInfo) {
        return `📊 *Market Insights*\n\n${marketInfo}`;
      }
      
      // Fallback market info
      return `📊 *Massa Blockchain Highlights*\n\n🚀 *High Performance:* 10,000+ TPS capability\n🤖 *Autonomous Smart Contracts:* Self-executing without external triggers\n🌐 *Decentralized Web:* Host dApps entirely on-chain\n💻 *Developer Friendly:* TypeScript-based smart contracts\n⚡ *Parallel Processing:* Unique multi-threaded architecture\n\n📈 *Growing Ecosystem:* Continuous development and adoption`;
    }
    else if (intent.intent === "help") {
      // Try to generate personalized help
      const personalizedHelp = await generatePersonalizedHelp(originalMessage, session);
      
      if (personalizedHelp) {
        return personalizedHelp;
      }
      
      // Enhanced fallback help with user context
      const walletCount = session.wallets.length;
      const isNewUser = session.messageCount <= 3;
      
      let helpMessage = `🤖 *AgentLink - Your DeFi Assistant*\n\n`;
      
      if (isNewUser) {
        helpMessage += `*Welcome! Here's what I can help you with:*\n\n`;
      } else {
        helpMessage += `*Available Commands:* (You have ${walletCount} wallet(s))\n\n`;
      }
      
      helpMessage += `🔹 *"Create new wallet"* - Generate a new Massa wallet\n🔹 *"Check balance for AU12abc..."* - Check wallet balance\n🔹 *"My wallets"* - Show your saved wallets\n🔹 *"Portfolio advice"* - Get investment tips\n🔹 *"Market info"* - Learn about Massa ecosystem\n🔹 *"What is DeFi?"* - Learn about DeFi concepts\n🔹 *"Help"* - Show this help message\n\n*Powered by Massa Blockchain* 🚀`;
      
      return helpMessage;
    }
    else if (intent.intent === "explain") {
      // If OpenAI already provided a response, use it
      if (intent.aiResponse) {
        return intent.aiResponse;
      }
      
      // Otherwise, try to explain the concept
      const explanation = await explainConcept(intent.query);
      
      if (explanation) {
        return explanation;
      }
      
      // Fallback explanation
      return `🎓 *Learning More*\n\nI'd love to explain that concept! However, I need my AI capabilities to provide detailed explanations.\n\nFor now, try asking specific questions about:\n• Creating wallets\n• Checking balances\n• Basic DeFi concepts\n\nOr visit the Massa documentation: *docs.massa.net*`;
    }

    // If we have an AI response from the parsing stage, use it
    if (intent.aiResponse) {
      return intent.aiResponse;
    }

    // Handle unknown intents - check if it might be an address
    if (intent.intent === "unknown") {
      // Check if the message looks like an address
      if (isValidMassaAddress(originalMessage.trim())) {
        // Recursively handle as balance check
        return handleIntent({ 
          intent: "check_balance", 
          address: originalMessage.trim(), 
          userId: userId 
        }, originalMessage);
      }
      
      return `❓ *I didn't understand that*\n\nTry one of these commands:\n• *"create wallet"* - Generate a new wallet\n• *"help"* - See all available commands\n• Send a Massa address to check its balance\n\n💡 Type *"help"* to see everything I can do!`;
    }

    return "❓ Sorry, I didn't understand your request. Type 'help' to see available commands.";
  } catch (error) {
    console.error("Error handling intent:", error);
    return "😔 Something went wrong. Please try again later.";
  }
}

module.exports = { parseIntent, handleIntent };
