// Enhanced features for massa.js - Future improvements

const { JsonRpcProvider, Account, Mas } = require("@massalabs/massa-web3");

// Connect to different networks
function getProvider(network = 'buildnet') {
  switch (network.toLowerCase()) {
    case 'mainnet':
      return JsonRpcProvider.mainnet();
    case 'buildnet':
    case 'testnet':
    default:
      return JsonRpcProvider.buildnet();
  }
}

// Get balance with better error handling
async function getBalance(address) {
  try {
    const provider = getProvider(process.env.MASSA_NETWORK || 'buildnet');
    const balance = await provider.balanceOf([address]);
    
    if (!balance || balance.length === 0) {
      return "0";
    }
    
    // Convert from nano MAS to MAS (divide by 10^9)
    const balanceInMas = balance[0]?.balance ? 
      (balance[0].balance / BigInt(10**9)).toString() : "0";
    
    return balanceInMas;
  } catch (error) {
    console.error("Error getting balance:", error);
    if (error.message.includes('Invalid address')) {
      return "Invalid address format";
    }
    return "Error retrieving balance";
  }
}

// Get multiple balances at once
async function getMultipleBalances(addresses) {
  try {
    const provider = getProvider(process.env.MASSA_NETWORK || 'buildnet');
    const balances = await provider.balanceOf(addresses);
    
    return balances.map((balance, index) => ({
      address: addresses[index],
      balance: balance?.balance ? (balance.balance / BigInt(10**9)).toString() : "0"
    }));
  } catch (error) {
    console.error("Error getting multiple balances:", error);
    return addresses.map(address => ({
      address,
      balance: "Error"
    }));
  }
}

// Validate Massa address format
function isValidMassaAddress(address) {
  // Massa addresses start with AU and are 51 characters long
  const massaAddressRegex = /^AU[A-Za-z0-9]{49}$/;
  return massaAddressRegex.test(address);
}

// Future: Send transaction (requires private key)
async function sendTransaction(fromPrivateKey, toAddress, amount) {
  try {
    // This would require implementing transaction sending
    // For now, just return a placeholder
    return {
      success: false,
      message: "Transaction sending not yet implemented"
    };
  } catch (error) {
    console.error("Error sending transaction:", error);
    return {
      success: false,
      message: "Error sending transaction"
    };
  }
}

// Get network status and info
async function getNetworkInfo() {
  try {
    const provider = getProvider(process.env.MASSA_NETWORK || 'buildnet');
    const status = await provider.client.status();
    
    return {
      network: process.env.MASSA_NETWORK || 'buildnet',
      chainId: status.chain_id,
      lastSlot: status.last_slot,
      minimalFee: status.minimal_fees
    };
  } catch (error) {
    console.error("Error getting network info:", error);
    return null;
  }
}

module.exports = { 
  getBalance, 
  getMultipleBalances,
  isValidMassaAddress,
  sendTransaction,
  getNetworkInfo
};
