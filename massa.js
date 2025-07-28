const { JsonRpcProvider } = require("@massalabs/massa-web3");

// Validate Massa address format
function isValidMassaAddress(address) {
  try {
    // Massa addresses start with AU and are 52 characters long
    if (!address || typeof address !== 'string') return false;
    if (!address.startsWith('AU')) return false;
    if (address.length !== 52) return false;
    
    // Basic character validation - should contain only alphanumeric characters
    if (!/^AU[A-Za-z0-9]+$/.test(address)) return false;
    
    return true;
  } catch (error) {
    return false;
  }
}

// Connect to Massa buildnet (testnet)
async function getBalance(address) {
  try {
    // Validate address first
    if (!isValidMassaAddress(address)) {
      return "Invalid address format";
    }

    const provider = JsonRpcProvider.buildnet();
    const balanceInfo = await provider.balanceOf([address]);
    
    // Return balance in MAS format
    if (balanceInfo && balanceInfo[0] && balanceInfo[0].balance) {
      const balanceInMAS = Number(balanceInfo[0].balance) / (10**9);
      return balanceInMAS.toFixed(4);
    }
    
    return "0.0000";
  } catch (error) {
    console.error("Error getting balance:", error);
    return "Unable to retrieve balance. Please try again.";
  }
}

module.exports = { getBalance, isValidMassaAddress };
