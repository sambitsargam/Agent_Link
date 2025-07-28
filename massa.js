const { JsonRpcProvider } = require("@massalabs/massa-web3");

// Connect to Massa buildnet (testnet)
async function getBalance(address) {
  try {
    const provider = JsonRpcProvider.buildnet();
    const balance = await provider.balanceOf([address]);
    
    // Return balance in MAS format
    return balance[0]?.balance ? (balance[0].balance / BigInt(10**9)).toString() : "0";
  } catch (error) {
    console.error("Error getting balance:", error);
    return "Error retrieving balance";
  }
}

module.exports = { getBalance };
