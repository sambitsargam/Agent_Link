const { Account } = require("@massalabs/massa-web3");
const { getBalance } = require("./massa");

async function parseIntent(msg) {
  const text = msg.toLowerCase();

  if (text.includes("create wallet") || text.includes("new wallet")) {
    return { intent: "create_wallet" };
  } else if (text.includes("balance") || text.includes("check balance")) {
    // Look for Massa address format (AU followed by alphanumeric characters)
    const addressMatch = msg.match(/AU[A-Za-z0-9]{48,50}/);
    return { intent: "get_balance", address: addressMatch ? addressMatch[0] : null };
  } else if (text.includes("help")) {
    return { intent: "help" };
  }

  return { intent: "unknown" };
}

async function handleIntent(intent) {
  try {
    if (intent.intent === "create_wallet") {
      const account = await Account.generate();
      return `✅ *Wallet Created Successfully!*\n\n📍 *Address:* ${account.address.toString()}\n🔑 *Private Key:* ${account.privateKey.toString()}\n\n⚠️ *Important:* Keep your private key safe and never share it with anyone!`;
    } 
    else if (intent.intent === "get_balance") {
      if (!intent.address) {
        return "⚠️ Please provide a valid Massa address (starting with AU).\n\nExample: Check balance for AU12abc...";
      }
      const balance = await getBalance(intent.address);
      return `💰 *Balance Information*\n\n📍 *Address:* ${intent.address}\n💎 *Balance:* ${balance} MAS`;
    }
    else if (intent.intent === "help") {
      return `🤖 *AgentLink - Your DeFi Assistant*\n\n*Available Commands:*\n\n🔹 "Create new wallet" - Generate a new Massa wallet\n🔹 "Check balance for AU12abc..." - Check wallet balance\n🔹 "Help" - Show this help message\n\n*Powered by Massa Blockchain* 🚀`;
    }

    return "❓ Sorry, I didn't understand your request. Type 'help' to see available commands.";
  } catch (error) {
    console.error("Error handling intent:", error);
    return "😔 Something went wrong. Please try again later.";
  }
}

module.exports = { parseIntent, handleIntent };
