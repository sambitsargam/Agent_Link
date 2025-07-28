// Test script to show WhatsApp message formatting
const { parseIntent, handleIntent } = require('./intent');

async function testFormatting() {
  console.log("🔥 Testing WhatsApp Message Formatting\n");
  
  // Test 1: Create Wallet
  console.log("1️⃣ CREATE WALLET RESPONSE:");
  console.log("━".repeat(50));
  try {
    const intent1 = await parseIntent("create wallet", "test123");
    const response1 = await handleIntent(intent1, "create wallet");
    console.log(response1);
  } catch (error) {
    console.log("Error:", error.message);
  }
  console.log();
  
  // Test 2: Help Message
  console.log("2️⃣ HELP MESSAGE:");
  console.log("━".repeat(50));
  try {
    const intent2 = await parseIntent("help", "test123");
    const response2 = await handleIntent(intent2, "help");
    console.log(response2);
  } catch (error) {
    console.log("Error:", error.message);
  }
  console.log();
  
  // Test 3: Wallet List (after creating wallet)
  console.log("3️⃣ WALLET LIST (simulated):");
  console.log("━".repeat(50));
  try {
    const intent3 = await parseIntent("my wallets", "test123");
    const response3 = await handleIntent(intent3, "my wallets");
    console.log(response3);
  } catch (error) {
    console.log("Error:", error.message);
  }
}

testFormatting().catch(console.error);
