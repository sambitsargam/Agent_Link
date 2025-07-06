const { Account } = require("@massalabs/massa-web3");
const { getBalance } = require("./massa");

async function parseIntent(msg) {
  const text = msg.toLowerCase();

  if (text.includes("create wallet")) {
    return { intent: "create_wallet" };
  } else if (text.includes("balance")) {
    const addressMatch = msg.match(/AU\w{10,}/);
    return { intent: "get_balance", address: addressMatch ? addressMatch[0] : null };
  }

  return { intent: "unknown" };
}

async function handleIntent(intent) {
  if (intent.intent === "create_wallet") {
    const account = await Account.generate();
    return `✅ Wallet Created:\nAddress: ${account.address.toString()}\nPrivate Key: ${account.privateKey.toString()}`;
  } else if (intent.intent === "get_balance") {
    if (!intent.address) return "⚠️ Address not found in your message.";
    const balance = await getBalance(intent.address);
    return `💰 Balance for ${intent.address}: ${balance} MAS`;
  }

  return "❓ Sorry, I didn't understand your request.";
}

module.exports = { parseIntent, handleIntent };
