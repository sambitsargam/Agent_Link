const { ClientFactory, DefaultProviderUrls, WalletClient } = require("@massalabs/massa-web3");

async function getBalance(address) {
  const baseClient = await ClientFactory.createDefaultClient(
    DefaultProviderUrls.TESTNET
  );

  const walletClient = new WalletClient(baseClient);
  const balance = await walletClient.getWalletInfo(address);
  return balance.final_balance;
}

module.exports = { getBalance };
